"""Compare compensation estimators on the 2024 Stack Overflow Developer Survey."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
from sklearn.model_selection import train_test_split

from ml.constants import DEFAULT_RANDOM_SEED
from ml.metrics import regression_metrics
from ml.model import save_model
from ml.preprocessing import feature_engineering
from utils.io_utils import write_json

# Keep the survey's combined role rather than assigning the same respondent twice.
SURVEY_ROLES = {
    "Developer, back-end": "Backend Engineer",
    "Cloud infrastructure engineer": "Cloud Engineer",
    "Data engineer": "Data Engineer",
    "Data scientist or machine learning specialist": "Data Scientist / ML Specialist",
    "DevOps specialist": "DevOps Engineer",
    "Developer, front-end": "Frontend Engineer",
    "Developer, full-stack": "Full Stack Engineer",
    "Developer, mobile": "Mobile Developer",
    "Developer, QA or test": "QA Engineer",
    "Security professional": "Security Engineer",
}
TECHNOLOGY_COLUMNS = [
    "LanguageHaveWorkedWith",
    "DatabaseHaveWorkedWith",
    "PlatformHaveWorkedWith",
    "WebframeHaveWorkedWith",
]
FEATURES = ["job_title", "years_experience", "technology_count"]
TARGET = "annual_compensation_inr"
MIN_BASELINE_GROUP = 5


def read_survey(dataset: Path, *, worldwide: bool = False) -> pd.DataFrame:
    columns = ["Country", "Currency", "CompTotal", "DevType", "YearsCodePro"]
    if worldwide:
        columns.append("ConvertedCompYearly")
    survey = pd.read_csv(dataset, usecols=columns + TECHNOLOGY_COLUMNS)
    survey["inr"] = survey["Currency"].str.split().str[0].eq("INR")
    if not worldwide:
        survey = survey.loc[survey["Country"].eq("India") & survey["inr"]].copy()

    survey["job_title"] = survey["DevType"].map(SURVEY_ROLES)
    survey["years_experience"] = pd.to_numeric(
        survey["YearsCodePro"].replace({"Less than 1 year": 0, "More than 50 years": 51}),
        errors="coerce",
    )
    survey = survey.dropna(subset=["Country", "job_title", "years_experience"]).copy()
    survey[TARGET] = pd.to_numeric(survey["CompTotal"], errors="coerce")
    complete = survey[TECHNOLOGY_COLUMNS].dropna()
    technology_answers = complete.agg(";".join, axis=1)
    survey["technology_count"] = technology_answers.map(
        lambda answer: len({tool.strip().casefold() for tool in answer.split(";") if tool.strip()})
    )
    return feature_engineering(survey)


def load_survey(dataset: Path) -> pd.DataFrame:
    survey = read_survey(dataset)
    eligible = np.isfinite(survey[TARGET]) & survey[TARGET].gt(0)
    return survey.loc[eligible].dropna(subset=["technology_count"])


def fit_median(train: pd.DataFrame, target: str = TARGET) -> dict:
    by_role_band = train.groupby(["job_title", "experience_band"])[target].agg(["median", "size"])
    return {
        "role_band": by_role_band.loc[by_role_band["size"].ge(MIN_BASELINE_GROUP), "median"],
        "role": train.groupby("job_title")[target].median(),
        "overall": float(train[target].median()),
    }


def predict_median(medians: dict, frame: pd.DataFrame) -> pd.Series:
    groups = pd.MultiIndex.from_frame(frame[["job_title", "experience_band"]])
    predictions = pd.Series(medians["role_band"].reindex(groups).to_numpy(), index=frame.index)
    return predictions.fillna(frame["job_title"].map(medians["role"])).fillna(medians["overall"])


def median_predictions(train: pd.DataFrame, test: pd.DataFrame) -> pd.Series:
    return predict_median(fit_median(train), test)


def fit_catboost(
    train: pd.DataFrame, features: list[str], target: str = TARGET
) -> CatBoostRegressor:
    model = CatBoostRegressor(
        loss_function="MAE",
        iterations=400,
        depth=5,
        learning_rate=0.05,
        cat_features=[column for column in ("job_title", "Country") if column in features],
        random_seed=DEFAULT_RANDOM_SEED,
        verbose=False,
        allow_writing_files=False,
    )
    model.fit(train[features], train[target])
    return model


def run_benchmark(dataset: Path, output_dir: Path) -> dict:
    survey = load_survey(dataset)
    if len(survey) < 10:
        raise ValueError("Expected at least 10 eligible India survey responses")

    train, test = train_test_split(survey, test_size=0.2, random_state=DEFAULT_RANDOM_SEED)
    baseline = median_predictions(train, test)
    model = fit_catboost(train, FEATURES)
    catboost = model.predict(test[FEATURES])
    actual = test[TARGET].to_numpy()
    baseline_metrics = regression_metrics(actual, baseline)
    catboost_metrics = regression_metrics(actual, catboost)

    # Resample paired errors because both methods predict the same test records.
    improvement = np.abs(actual - baseline.to_numpy()) - np.abs(actual - catboost)
    rng = np.random.default_rng(DEFAULT_RANDOM_SEED)
    resamples = rng.choice(improvement, size=(2000, len(improvement)), replace=True).mean(axis=1)
    lower, upper = np.quantile(resamples, [0.025, 0.975])
    report = {
        "dataset": "2024 Stack Overflow Developer Survey",
        "target": TARGET,
        "features": FEATURES,
        "rows": len(survey),
        "train_rows": len(train),
        "test_rows": len(test),
        "random_seed": DEFAULT_RANDOM_SEED,
        "rows_by_role": survey["job_title"].value_counts().to_dict(),
        "test_rows_by_role": test["job_title"].value_counts().reindex(
            survey["job_title"].unique(), fill_value=0
        ).to_dict(),
        "observed_compensation_range_inr": [float(survey[TARGET].min()), float(survey[TARGET].max())],
        "median_baseline": {key: baseline_metrics[key] for key in ("mae", "rmse")},
        "catboost": {key: catboost_metrics[key] for key in ("mae", "rmse")},
        "catboost_mae_improvement_inr": float(improvement.mean()),
        "catboost_mae_improvement_95_percent_interval_inr": [float(lower), float(upper)],
        "recommended_method": "catboost" if lower > 0 else "median_baseline",
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    save_model(model, output_dir / "survey_catboost.pkl")
    write_json(output_dir / "survey_benchmark.json", report)
    return report


def fit_estimator(method: str, india: pd.DataFrame, international: pd.DataFrame) -> tuple[dict, int]:
    if method == "median_baseline":
        return {"method": method, "medians": fit_median(india)}, len(india)

    features = FEATURES[:2]
    train = india
    if method == "catboost_complete_cases":
        train = india.dropna(subset=["technology_count"])
    elif method == "catboost_with_technologies":
        features = FEATURES
    elif method == "catboost_with_international":
        features = FEATURES[:2] + ["Country"]
        # Recover the survey exchange rate from the fitting rows only. Conversion
        # rounds reported USD to whole dollars, so use the median of valid ratios.
        usd = india["ConvertedCompYearly"]
        paired = np.isfinite(usd) & usd.ge(100)
        inr_per_usd = (india.loc[paired, TARGET] / usd.loc[paired]).median()
        if not np.isfinite(inr_per_usd):
            raise ValueError("Could not estimate the survey INR/USD conversion rate")
        converted = international.assign(**{TARGET: international["ConvertedCompYearly"] * inr_per_usd})
        train = pd.concat([india, converted], ignore_index=True)

    model = fit_catboost(train, features)
    return {"method": method, "features": features, "model": model}, len(train)


def predict_estimator(estimator: dict, frame: pd.DataFrame) -> np.ndarray:
    """Predict annual total compensation in INR for a frame of India profiles."""
    if estimator["method"] == "median_baseline":
        return predict_median(estimator["medians"], feature_engineering(frame)).to_numpy()
    features = estimator["features"]
    inputs = frame.assign(Country="India")
    if "technology_count" in features and "technology_count" not in inputs:
        inputs["technology_count"] = np.nan
    inputs = inputs[features]
    return estimator["model"].predict(inputs)


def run_expanded_benchmark(dataset: Path, output_dir: Path) -> dict:
    survey = read_survey(dataset, worldwide=True)
    in_india = survey["Country"].eq("India")
    india = survey.loc[in_india & survey["inr"] & np.isfinite(survey[TARGET]) & survey[TARGET].gt(0)]
    usd = survey["ConvertedCompYearly"]
    international = survey.loc[~in_india & np.isfinite(usd) & usd.gt(0)]
    development, test = train_test_split(
        india, test_size=0.2, random_state=DEFAULT_RANDOM_SEED, stratify=india["job_title"]
    )
    train, validation = train_test_split(
        development, test_size=0.25, random_state=DEFAULT_RANDOM_SEED, stratify=development["job_title"]
    )

    actual = validation[TARGET].to_numpy()
    baseline, _ = fit_estimator("median_baseline", train, international)
    baseline_errors = np.abs(actual - predict_estimator(baseline, validation))
    validation_results = {
        "median_baseline": {"fit_rows": len(train), "mae_inr": float(baseline_errors.mean())}
    }
    methods = [
        "catboost_complete_cases",
        "catboost_expanded_india",
        "catboost_with_technologies",
        "catboost_with_international",
    ]
    rng = np.random.default_rng(DEFAULT_RANDOM_SEED)
    sample_indices = rng.integers(len(actual), size=(5000, len(actual)))
    # Bonferroni-adjusted paired intervals for the four comparisons to the baseline.
    tail = 0.05 / (2 * len(methods))
    selected = "median_baseline"
    for method in methods:
        estimator, fit_rows = fit_estimator(method, train, international)
        errors = np.abs(actual - predict_estimator(estimator, validation))
        mae = float(errors.mean())
        improvement = (baseline_errors - errors)[sample_indices].mean(axis=1)
        lower, upper = np.quantile(improvement, [tail, 1 - tail])
        validation_results[method] = {
            "fit_rows": fit_rows,
            "mae_inr": mae,
            "adjusted_improvement_interval_inr": [float(lower), float(upper)],
        }
        if lower > 0 and mae < validation_results[selected]["mae_inr"]:
            selected = method

    baseline, _ = fit_estimator("median_baseline", development, international)
    evaluated = baseline
    if selected != "median_baseline":
        evaluated, _ = fit_estimator(selected, development, international)
    actual = test[TARGET].to_numpy()
    test_baseline = np.abs(actual - predict_estimator(baseline, test)).mean()
    test_selected = np.abs(actual - predict_estimator(evaluated, test)).mean()

    final_estimator, final_rows = fit_estimator(selected, india, international)
    report = {
        "dataset": "2024 Stack Overflow Developer Survey",
        "target": TARGET,
        "eligible_india_rows": len(india),
        "india_rows_with_complete_technology_answers": int(india["technology_count"].notna().sum()),
        "eligible_international_rows": len(international),
        "india_train_rows": len(train),
        "india_validation_rows": len(validation),
        "india_test_rows": len(test),
        "india_rows_by_role": india["job_title"].value_counts().to_dict(),
        "test_rows_by_role": test["job_title"].value_counts().to_dict(),
        "validation": validation_results,
        "selected_method": selected,
        "test_mae_inr": {"median_baseline": float(test_baseline), "selected": float(test_selected)},
        "final_fit_rows": final_rows,
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(final_estimator, output_dir / "expanded_survey_estimator.pkl")
    write_json(output_dir / "expanded_survey_benchmark.json", report)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, required=True, help="Path to survey results.csv")
    parser.add_argument("--output-dir", type=Path, required=True, help="Directory for model and report")
    parser.add_argument("--expanded", action="store_true", help="Compare additional survey training data")
    args = parser.parse_args()
    benchmark = run_expanded_benchmark if args.expanded else run_benchmark
    print(json.dumps(benchmark(args.dataset, args.output_dir), indent=2))


if __name__ == "__main__":
    main()

"""Train and use the India and international survey compensation estimators."""

from __future__ import annotations

import argparse
from bisect import bisect_right
import json
import math
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

from ml.constants import DEFAULT_RANDOM_SEED
from ml.preprocessing import feature_engineering
from scripts.benchmark_survey import (
    FEATURES,
    SURVEY_ROLES,
    TARGET,
    fit_catboost,
    fit_median,
    predict_estimator,
    predict_median,
    read_survey,
    run_expanded_benchmark,
)
from utils.io_utils import write_json

USD_TARGET = "ConvertedCompYearly"
WORLD_FEATURES = FEATURES[:2] + ["Country"]
MIN_COUNTRY_ROWS = 30

MARKET_PAY_FILE = "market_pay_benchmarks.json"
MIN_BENCHMARK_ROWS = 20
EXPERIENCE_CUTS = [2, 5, 10]
EXPERIENCE_LABELS = ["0–1 years", "2–4 years", "5–9 years", "10+ years"]


def experience_group(years: float) -> str:
    return EXPERIENCE_LABELS[bisect_right(EXPERIENCE_CUTS, years)]


def write_market_pay_benchmarks(survey: pd.DataFrame, output_dir: Path) -> None:
    is_india = survey["Country"].eq("India")
    compensation = survey[TARGET].where(is_india, survey[USD_TARGET])
    eligible = np.isfinite(compensation) & compensation.gt(0) & (~is_india | survey["inr"])
    observations = survey.loc[eligible, ["Country", "job_title", "years_experience"]].assign(
        compensation=compensation.loc[eligible]
    )
    observations["experience"] = observations["years_experience"].map(experience_group)
    records = []
    for keys in (["Country", "job_title", "experience"], ["Country", "job_title"], ["Country"]):
        for key, group in observations.groupby(keys):
            if len(group) < MIN_BENCHMARK_ROWS:
                continue
            lower, median, upper = group["compensation"].quantile([0.25, 0.5, 0.75])
            group_key = key if isinstance(key, tuple) else (key,)
            country, role, band = (*group_key, None, None)[:3]
            records.append({
                "country": country, "role": role, "experience": band, "sample_size": len(group),
                "p25": round(float(lower), 2), "median": round(float(median), 2), "p75": round(float(upper), 2),
            })
    write_json(output_dir / MARKET_PAY_FILE, records)


def fit_country_medians(frame: pd.DataFrame) -> dict:
    return {country: fit_median(group, USD_TARGET) for country, group in frame.groupby("Country")}


def predict_country_medians(medians: dict, frame: pd.DataFrame) -> pd.Series:
    frame = feature_engineering(frame)
    predictions = [
        predict_median(medians[country], group) for country, group in frame.groupby("Country")
    ]
    return pd.concat(predictions).reindex(frame.index)


def train_markets(dataset: Path, output_dir: Path) -> dict:
    survey = read_survey(dataset, worldwide=True)
    eligible = survey["Country"].ne("India") & np.isfinite(survey[USD_TARGET]) & survey[USD_TARGET].gt(0)
    world = survey.loc[eligible]
    country_sizes = world["Country"].value_counts()
    countries = sorted(country_sizes.loc[country_sizes.ge(MIN_COUNTRY_ROWS)].index)
    world = world.loc[world["Country"].isin(countries)]
    if world.empty:
        raise ValueError(f"Expected a non-India country with at least {MIN_COUNTRY_ROWS} eligible responses")

    development, test = train_test_split(
        world, test_size=0.2, random_state=DEFAULT_RANDOM_SEED, stratify=world["Country"]
    )
    train, validation = train_test_split(
        development, test_size=0.25, random_state=DEFAULT_RANDOM_SEED, stratify=development["Country"]
    )
    medians = fit_country_medians(train)
    model = fit_catboost(train, WORLD_FEATURES, USD_TARGET)
    baseline_error = (validation[USD_TARGET] - predict_country_medians(medians, validation)).abs()
    catboost_error = (validation[USD_TARGET] - model.predict(validation[WORLD_FEATURES])).abs()
    differences = (baseline_error - catboost_error).to_numpy()
    rng = np.random.default_rng(DEFAULT_RANDOM_SEED)
    draws = rng.choice(differences, size=(2000, len(differences)), replace=True).mean(axis=1)
    lower, upper = np.quantile(draws, [0.025, 0.975])
    selected = "catboost" if lower > 0 else "country_median"

    test_baseline = predict_country_medians(fit_country_medians(development), test)
    report_rows = test[["Country"]].assign(baseline_error=(test[USD_TARGET] - test_baseline).abs())
    if selected == "catboost":
        evaluated_model = fit_catboost(development, WORLD_FEATURES, USD_TARGET)
        report_rows["selected_error"] = (test[USD_TARGET] - evaluated_model.predict(test[WORLD_FEATURES])).abs()
        estimator = {"method": selected, "model": fit_catboost(world, WORLD_FEATURES, USD_TARGET)}
    else:
        report_rows["selected_error"] = report_rows["baseline_error"]
        estimator = {"method": selected, "medians": fit_country_medians(world)}

    role_options = world.groupby("Country")["job_title"].agg(lambda roles: sorted(set(roles))).to_dict()
    estimator["roles_by_country"] = role_options
    report = {
        "dataset": "2024 Stack Overflow Developer Survey",
        "target": "annual_total_compensation_usd",
        "countries": countries,
        "minimum_eligible_rows_per_country": MIN_COUNTRY_ROWS,
        "fit_rows": len(world),
        "validation_rows": len(validation),
        "test_rows": len(test),
        "validation_mae_usd": {
            "country_median": float(baseline_error.mean()),
            "catboost": float(catboost_error.mean()),
        },
        "validation_catboost_improvement_interval_usd": [float(lower), float(upper)],
        "test_mae_usd": {
            "country_median": float(report_rows["baseline_error"].mean()),
            "selected": float(report_rows["selected_error"].mean()),
        },
        "test_by_country": report_rows.groupby("Country")["selected_error"].agg(
            test_rows="size", mae_usd="mean"
        ).to_dict(orient="index"),
        "selected_method": selected,
        "india_benchmark": run_expanded_benchmark(dataset, output_dir)["selected_method"],
    }
    joblib.dump(estimator, output_dir / "international_survey_estimator.pkl")
    write_json(output_dir / "international_survey_benchmark.json", report)
    write_market_pay_benchmarks(survey, output_dir)
    return report


def load_market_estimators(artifact_dir: Path) -> dict:
    return {
        "india": joblib.load(artifact_dir / "expanded_survey_estimator.pkl"),
        "international": joblib.load(artifact_dir / "international_survey_estimator.pkl"),
    }


def predict_market(artifact_dir: Path, country: str, role: str, experience: float) -> dict:
    return estimate_market(load_market_estimators(artifact_dir), country, role, experience)


def predict_international(estimator: dict, frame: pd.DataFrame) -> np.ndarray:
    if estimator["method"] == "catboost":
        return estimator["model"].predict(frame[WORLD_FEATURES])
    return predict_country_medians(estimator["medians"], frame).to_numpy()


def estimate_market(estimators: dict, country: str, role: str, experience: float) -> dict:
    if not math.isfinite(experience) or not 0 <= experience <= 51:
        raise ValueError("Experience must be between 0 and 51 years (51 represents 50+)")
    country = country.strip()
    roles = {value.casefold(): value for value in SURVEY_ROLES.values()}
    roles.update({
        "backend developer": "Backend Engineer",
        "frontend developer": "Frontend Engineer",
        "full stack developer": "Full Stack Engineer",
        "android developer": "Mobile Developer",
        "ios developer": "Mobile Developer",
        "data scientist": "Data Scientist / ML Specialist",
        "machine learning engineer": "Data Scientist / ML Specialist",
    })
    role_name = roles.get(role.strip().casefold())
    if role_name is None:
        raise ValueError(f"Unknown job role. Choose from: {', '.join(sorted(set(roles.values())))}")
    if country.casefold() == "india":
        estimator = estimators["india"]
        frame = pd.DataFrame([{"job_title": role_name, "years_experience": experience}])
        prediction = predict_estimator(estimator, frame)[0]
        currency = "INR"
        country = "India"
    else:
        estimator = estimators["international"]
        countries = {name.casefold(): name for name in estimator["roles_by_country"]}
        country_key = {
            "united states": "united states of america",
            "united kingdom": "united kingdom of great britain and northern ireland",
        }.get(country.casefold(), country.casefold())
        if country_key not in countries:
            raise ValueError(f"Unsupported country. Choose India or one of: {', '.join(countries.values())}")
        country = countries[country_key]
        if role_name not in estimator["roles_by_country"][country]:
            raise ValueError(f"Available roles for {country}: {', '.join(estimator['roles_by_country'][country])}")
        frame = pd.DataFrame([{"job_title": role_name, "years_experience": experience, "Country": country}])
        prediction = predict_international(estimator, frame)[0]
        currency = "USD"
    return {
        "country": country,
        "job_title": role_name,
        "currency": currency,
        "annual_total_compensation": round(float(prediction), 2),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    actions = parser.add_subparsers(dest="action", required=True)
    train = actions.add_parser("train", help="Train both market estimators")
    train.add_argument("--dataset", type=Path, required=True)
    train.add_argument("--output-dir", type=Path, required=True)
    predict = actions.add_parser("predict", help="Estimate annual total compensation")
    predict.add_argument("--artifact-dir", type=Path, required=True)
    predict.add_argument("--country", required=True)
    predict.add_argument("--role", required=True)
    predict.add_argument("--experience", type=float, required=True)
    args = parser.parse_args()
    try:
        if args.action == "train":
            result = train_markets(args.dataset, args.output_dir)
        else:
            result = predict_market(args.artifact_dir, args.country, args.role, args.experience)
    except (ValueError, FileNotFoundError) as exc:
        parser.error(str(exc))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()

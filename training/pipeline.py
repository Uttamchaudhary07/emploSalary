from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np
import pandas as pd
from catboost import CatBoostRegressor, Pool
from sklearn.model_selection import KFold, train_test_split

from ml.constants import (
    CATEGORICAL_COLUMNS,
    DEFAULT_RANDOM_SEED,
    FEATURE_COLUMNS,
    NUMERIC_COLUMNS,
    TARGET_COLUMN,
)
from ml.data_loader import load_dataset, normalize_columns
from ml.metrics import regression_metrics
from ml.preprocessing import build_profile, feature_engineering, handle_missing_values, remove_duplicates
from ml.model import save_model, save_preprocessor
from utils.io_utils import write_json, write_text
from utils.logging_utils import setup_logging


@dataclass(slots=True)
class TrainingResult:
    metrics: dict[str, float]
    cv_metrics: dict[str, float]
    model_path: str
    preprocessor_path: str
    feature_columns_path: str
    metadata_path: str
    report_path: str


def _build_preprocessor() -> object:
    class SalaryPreprocessor:
        def fit(self, frame: pd.DataFrame, y=None):
            self.feature_columns_ = FEATURE_COLUMNS.copy()
            return self

        def transform(self, frame: pd.DataFrame) -> pd.DataFrame:
            cleaned = normalize_columns(frame)
            cleaned = cleaned.loc[:, FEATURE_COLUMNS].copy()
            cleaned = handle_missing_values(cleaned)
            cleaned = feature_engineering(cleaned)
            for column in NUMERIC_COLUMNS:
                cleaned[column] = pd.to_numeric(cleaned[column], errors="coerce")
                cleaned[column] = cleaned[column].fillna(cleaned[column].median())
            for column in CATEGORICAL_COLUMNS + ["experience_band", "performance_band"]:
                if column in cleaned.columns:
                    cleaned[column] = cleaned[column].astype(str).fillna("Unknown")
            return cleaned

    return SalaryPreprocessor()


def _train_catboost(x_train: pd.DataFrame, y_train: pd.Series, x_valid: pd.DataFrame, y_valid: pd.Series) -> CatBoostRegressor:
    model = CatBoostRegressor(
        loss_function="RMSE",
        eval_metric="RMSE",
        iterations=2000,
        learning_rate=0.03,
        depth=8,
        random_seed=DEFAULT_RANDOM_SEED,
        verbose=200,
        od_type="Iter",
        od_wait=100,
        task_type="CPU",
    )

    train_pool = Pool(x_train, y_train, cat_features=[col for col in x_train.columns if col in CATEGORICAL_COLUMNS or col in {"experience_band", "performance_band"}])
    valid_pool = Pool(x_valid, y_valid, cat_features=[col for col in x_valid.columns if col in CATEGORICAL_COLUMNS or col in {"experience_band", "performance_band"}])
    model.fit(train_pool, eval_set=valid_pool, use_best_model=True)
    return model


def run_training(dataset_path: str | Path, output_dir: str | Path, model_version: str) -> TrainingResult:
    setup_logging(Path(output_dir) / "training.log")
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    frame = load_dataset(dataset_path)
    frame = normalize_columns(frame)
    frame = remove_duplicates(frame)
    profile = build_profile(frame)
    frame = handle_missing_values(frame)
    frame = feature_engineering(frame)

    if TARGET_COLUMN not in frame.columns:
        raise KeyError(f"Missing target column: {TARGET_COLUMN}")

    features = frame.loc[:, FEATURE_COLUMNS].copy()
    target = pd.to_numeric(frame[TARGET_COLUMN], errors="coerce")
    dataset = pd.concat([features, target.rename(TARGET_COLUMN)], axis=1).dropna(subset=[TARGET_COLUMN])

    features = dataset.loc[:, FEATURE_COLUMNS]
    target = dataset[TARGET_COLUMN].astype(float)

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.2,
        random_state=DEFAULT_RANDOM_SEED,
    )

    preprocessor = _build_preprocessor()
    preprocessor.fit(x_train)
    x_train_processed = preprocessor.transform(x_train)
    x_test_processed = preprocessor.transform(x_test)

    cv = KFold(n_splits=5, shuffle=True, random_state=DEFAULT_RANDOM_SEED)
    cv_scores: list[float] = []
    cv_r2: list[float] = []
    for train_idx, val_idx in cv.split(x_train_processed):
        fold_model = _train_catboost(
            x_train_processed.iloc[train_idx],
            y_train.iloc[train_idx],
            x_train_processed.iloc[val_idx],
            y_train.iloc[val_idx],
        )
        fold_pred = fold_model.predict(x_train_processed.iloc[val_idx])
        fold_metrics = regression_metrics(y_train.iloc[val_idx], fold_pred)
        cv_scores.append(fold_metrics["rmse"])
        cv_r2.append(fold_metrics["r2"])

    model = _train_catboost(x_train_processed, y_train, x_test_processed, y_test)
    y_pred = model.predict(x_test_processed)
    metrics = regression_metrics(y_test, y_pred)

    residuals = np.asarray(y_test) - np.asarray(y_pred)
    metadata = {
        "model_name": "employee_salary_catboost",
        "model_version": model_version,
        "target_column": TARGET_COLUMN,
        "feature_columns": FEATURE_COLUMNS,
        "numeric_columns": NUMERIC_COLUMNS,
        "categorical_columns": CATEGORICAL_COLUMNS + ["experience_band", "performance_band"],
        "random_seed": DEFAULT_RANDOM_SEED,
        "rows": profile.rows,
        "columns": profile.columns,
        "duplicate_rows_removed": profile.duplicate_rows,
        "trained_at": pd.Timestamp.utcnow().isoformat(),
        "cross_validation": {
            "rmse_mean": float(np.mean(cv_scores)),
            "rmse_std": float(np.std(cv_scores, ddof=1)) if len(cv_scores) > 1 else 0.0,
            "r2_mean": float(np.mean(cv_r2)),
        },
        "metrics": metrics,
        "residual_std": float(np.std(residuals, ddof=1)) if len(residuals) > 1 else 0.0,
    }

    model_path = output_dir.parent / "models" / "salary_model.pkl"
    preprocessor_path = output_dir / "preprocessor.pkl"
    feature_columns_path = output_dir / "feature_columns.json"
    metadata_path = output_dir / "model_metadata.json"
    metrics_path = output_dir / "evaluation_metrics.json"
    report_path = output_dir / "evaluation_report.md"

    model_path.parent.mkdir(parents=True, exist_ok=True)
    save_model(model, model_path)
    save_preprocessor(preprocessor, preprocessor_path)
    write_json(feature_columns_path, FEATURE_COLUMNS)
    write_json(metadata_path, metadata)
    write_json(metrics_path, metrics)
    write_text(
        report_path,
        "\n".join(
            [
                "# Evaluation Report",
                "",
                f"Model: {metadata['model_name']}",
                f"Version: {metadata['model_version']}",
                "",
                "## Metrics",
                f"- MAE: {metrics['mae']:.4f}",
                f"- MSE: {metrics['mse']:.4f}",
                f"- RMSE: {metrics['rmse']:.4f}",
                f"- R2: {metrics['r2']:.4f}",
                f"- MAPE: {metrics['mape']:.4f}",
                "",
                "## Cross Validation",
                f"- RMSE Mean: {metadata['cross_validation']['rmse_mean']:.4f}",
                f"- RMSE Std: {metadata['cross_validation']['rmse_std']:.4f}",
                f"- R2 Mean: {metadata['cross_validation']['r2_mean']:.4f}",
            ]
        ),
    )

    return TrainingResult(
        metrics=metrics,
        cv_metrics=metadata["cross_validation"],
        model_path=str(model_path),
        preprocessor_path=str(preprocessor_path),
        feature_columns_path=str(feature_columns_path),
        metadata_path=str(metadata_path),
        report_path=str(report_path),
    )

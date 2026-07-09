from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from catboost import Pool

from ml.constants import CATEGORICAL_COLUMNS, FEATURE_COLUMNS, TARGET_COLUMN
from ml.data_loader import load_dataset, normalize_columns
from ml.metrics import regression_metrics
from ml.preprocessing import feature_engineering, handle_missing_values, remove_duplicates
from ml.visualization import (
    save_correlation_heatmap,
    save_distribution_plot,
    save_feature_importance,
    save_prediction_vs_actual,
    save_residual_plot,
)
from utils.io_utils import read_json, write_json


def run_evaluation(dataset_path: str | Path, model_path: str | Path, preprocessor_path: str | Path, output_dir: str | Path) -> dict:
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    frame = load_dataset(dataset_path)
    frame = normalize_columns(frame)
    frame = remove_duplicates(frame)
    frame = handle_missing_values(frame)
    frame = feature_engineering(frame)

    model = joblib.load(model_path)
    preprocessor = joblib.load(preprocessor_path)

    features = frame.loc[:, FEATURE_COLUMNS].copy()
    target = pd.to_numeric(frame[TARGET_COLUMN], errors="coerce")
    dataset = pd.concat([features, target.rename(TARGET_COLUMN)], axis=1).dropna(subset=[TARGET_COLUMN])
    features = dataset.loc[:, FEATURE_COLUMNS]
    target = dataset[TARGET_COLUMN].astype(float)

    processed = preprocessor.transform(features)
    predictions = model.predict(processed)

    metrics = regression_metrics(target, predictions)

    write_json(output_dir / "evaluation_metrics.json", metrics)
    save_correlation_heatmap(frame, output_dir / "correlation_heatmap.png")
    save_distribution_plot(frame, TARGET_COLUMN, output_dir / "salary_distribution.png")
    save_feature_importance(model, list(processed.columns), output_dir / "feature_importance.png")
    save_residual_plot(np.asarray(target), np.asarray(predictions), output_dir / "residual_plot.png")
    save_prediction_vs_actual(np.asarray(target), np.asarray(predictions), output_dir / "prediction_vs_actual.png")

    try:
        import shap

        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(processed)
        shap.summary_plot(shap_values, processed, show=False)
        import matplotlib.pyplot as plt

        plt.tight_layout()
        plt.savefig(output_dir / "shap_summary_plot.png", dpi=200, bbox_inches="tight")
        plt.close()
    except Exception:
        (output_dir / "shap_summary_plot.txt").write_text("SHAP summary plot generation was skipped because shap evaluation failed.")

    return metrics

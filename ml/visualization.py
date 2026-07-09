from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import seaborn as sns
from catboost import CatBoostRegressor


def save_correlation_heatmap(frame, output_path: str | Path) -> None:
    numeric = frame.select_dtypes(include="number")
    plt.figure(figsize=(12, 10))
    sns.heatmap(numeric.corr(), cmap="coolwarm", center=0)
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def save_distribution_plot(frame, column: str, output_path: str | Path) -> None:
    plt.figure(figsize=(10, 6))
    sns.histplot(frame[column], kde=True, bins=40)
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def save_feature_importance(model: CatBoostRegressor, feature_names: list[str], output_path: str | Path) -> None:
    importances = model.get_feature_importance(prettified=False)
    order = sorted(range(len(importances)), key=lambda idx: importances[idx], reverse=True)
    plt.figure(figsize=(12, 8))
    sns.barplot(x=[importances[idx] for idx in order], y=[feature_names[idx] for idx in order], orient="h")
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def save_residual_plot(y_true, y_pred, output_path: str | Path) -> None:
    residuals = y_true - y_pred
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=y_pred, y=residuals, s=20)
    plt.axhline(0, color="red", linestyle="--")
    plt.xlabel("Predicted Salary")
    plt.ylabel("Residuals")
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def save_prediction_vs_actual(y_true, y_pred, output_path: str | Path) -> None:
    plt.figure(figsize=(8, 8))
    sns.scatterplot(x=y_true, y=y_pred, s=20)
    limit_low = min(y_true.min(), y_pred.min())
    limit_high = max(y_true.max(), y_pred.max())
    plt.plot([limit_low, limit_high], [limit_low, limit_high], color="red", linestyle="--")
    plt.xlabel("Actual Salary")
    plt.ylabel("Predicted Salary")
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()

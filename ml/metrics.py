from __future__ import annotations

import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def mape(y_true, y_pred) -> float:
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    denominator = np.where(np.abs(y_true) < 1e-8, np.nan, y_true)
    value = np.nanmean(np.abs((y_true - y_pred) / denominator)) * 100.0
    return float(value)


def regression_metrics(y_true, y_pred) -> dict[str, float]:
    mse_value = float(mean_squared_error(y_true, y_pred))
    return {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "mse": mse_value,
        "rmse": float(np.sqrt(mse_value)),
        "r2": float(r2_score(y_true, y_pred)),
        "mape": mape(y_true, y_pred),
    }

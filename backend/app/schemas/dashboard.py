from __future__ import annotations

from pydantic import BaseModel

from app.schemas.prediction import PredictionSummary


class DashboardSummary(BaseModel):
    total_predictions: int
    average_predicted_salary: float | None
    saved_reports_count: int
    predictions_this_month: int
    latest_prediction: PredictionSummary | None

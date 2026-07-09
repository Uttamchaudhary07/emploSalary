from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from ml.constants import CATEGORICAL_COLUMNS, FEATURE_COLUMNS, NUMERIC_COLUMNS


def clean_text(value: object) -> str:
    if value is None:
        return "Unknown"
    text = str(value).strip()
    if not text or text.lower() in {"na", "n/a", "nan", "null", "none", "<na>"}:
        return "Unknown"
    return text


def cap_numeric_outliers(series: pd.Series) -> pd.Series:
    q1 = series.quantile(0.25)
    q3 = series.quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return series.clip(lower=lower, upper=upper)


def remove_duplicates(frame: pd.DataFrame) -> pd.DataFrame:
    return frame.drop_duplicates().reset_index(drop=True)


def handle_missing_values(frame: pd.DataFrame) -> pd.DataFrame:
    cleaned = frame.copy()
    for column in FEATURE_COLUMNS:
        if column not in cleaned.columns:
            continue
        if column in NUMERIC_COLUMNS:
            cleaned[column] = pd.to_numeric(cleaned[column], errors="coerce")
            cleaned[column] = cleaned[column].fillna(cleaned[column].median())
        else:
            cleaned[column] = cleaned[column].map(clean_text)
    return cleaned


def feature_engineering(frame: pd.DataFrame) -> pd.DataFrame:
    engineered = frame.copy()
    if "years_experience" in engineered.columns:
        engineered["experience_band"] = pd.cut(
            engineered["years_experience"],
            bins=[-1, 1, 3, 5, 10, 50, 100],
            labels=["0-1", "2-3", "4-5", "6-10", "11-50", "50+"],
        ).astype("string").fillna("Unknown")
    if "performance_rating" in engineered.columns:
        engineered["performance_band"] = pd.cut(
            engineered["performance_rating"],
            bins=[-1, 2.5, 3.5, 4.0, 4.5, 5.0],
            labels=["low", "avg", "good", "very_good", "excellent"],
            include_lowest=True,
        ).astype("string").fillna("Unknown")
    return engineered


@dataclass(slots=True)
class DataProfile:
    rows: int
    columns: int
    missing_values: dict[str, int]
    duplicate_rows: int


def build_profile(frame: pd.DataFrame) -> DataProfile:
    return DataProfile(
        rows=int(frame.shape[0]),
        columns=int(frame.shape[1]),
        missing_values=frame.isna().sum().to_dict(),
        duplicate_rows=int(frame.duplicated().sum()),
    )

from __future__ import annotations

from pathlib import Path

import pandas as pd


def load_dataset(dataset_path: str | Path) -> pd.DataFrame:
    path = Path(dataset_path)
    if path.suffix.lower() in {".xlsx", ".xls"}:
        return pd.read_excel(path)
    if path.suffix.lower() == ".csv":
        return pd.read_csv(path)
    raise ValueError(f"Unsupported dataset format: {path.suffix}")


def normalize_columns(frame: pd.DataFrame) -> pd.DataFrame:
    normalized = frame.copy()
    normalized.columns = (
        normalized.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(r"[^a-z0-9]+", "_", regex=True)
        .str.strip("_")
    )
    return normalized

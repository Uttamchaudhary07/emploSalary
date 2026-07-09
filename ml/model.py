from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import joblib
from catboost import CatBoostRegressor


@dataclass(slots=True)
class ModelBundle:
    model: CatBoostRegressor
    preprocessor: object


def save_model(model: CatBoostRegressor, path: str | Path) -> None:
    joblib.dump(model, Path(path))


def load_model(path: str | Path) -> CatBoostRegressor:
    return joblib.load(Path(path))


def save_preprocessor(preprocessor: object, path: str | Path) -> None:
    joblib.dump(preprocessor, Path(path))


def load_preprocessor(path: str | Path):
    return joblib.load(Path(path))

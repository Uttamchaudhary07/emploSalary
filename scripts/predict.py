from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd

from ml.constants import FEATURE_COLUMNS


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run salary prediction for a single employee payload")
    parser.add_argument("--input", type=Path, required=True, help="JSON file containing a single employee record")
    parser.add_argument("--model", type=Path, default=Path("models/salary_model.pkl"), help="Path to the trained CatBoost model")
    parser.add_argument("--preprocessor", type=Path, default=Path("artifacts/preprocessor.pkl"), help="Path to the fitted preprocessor")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    payload = json.loads(args.input.read_text())
    frame = pd.DataFrame([payload], columns=FEATURE_COLUMNS)
    preprocessor = joblib.load(args.preprocessor)
    model = joblib.load(args.model)
    processed = preprocessor.transform(frame)
    prediction = float(model.predict(processed)[0])
    print(json.dumps({"prediction": prediction, "expected_salary": round(prediction, 2)}, indent=2))


if __name__ == "__main__":
    main()

from __future__ import annotations

import argparse
from pathlib import Path

from training.pipeline import run_training


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the salary estimator CatBoost model")
    parser.add_argument("--dataset", type=Path, required=True, help="Path to the salary dataset")
    parser.add_argument("--output-dir", type=Path, default=Path("artifacts"), help="Directory for artifacts")
    parser.add_argument("--model-version", type=str, default="2026.07.09", help="Model version string")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    result = run_training(args.dataset, args.output_dir, args.model_version)
    print(result)


if __name__ == "__main__":
    main()

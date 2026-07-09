from __future__ import annotations

import argparse
from pathlib import Path

from evaluation.evaluate import run_evaluation


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate the salary estimator model")
    parser.add_argument("--dataset", type=Path, required=True, help="Path to the salary dataset")
    parser.add_argument("--model", type=Path, default=Path("models/salary_model.pkl"), help="Path to saved model")
    parser.add_argument("--preprocessor", type=Path, default=Path("artifacts/preprocessor.pkl"), help="Path to saved preprocessor")
    parser.add_argument("--output-dir", type=Path, default=Path("artifacts/evaluation"), help="Directory for evaluation outputs")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    metrics = run_evaluation(args.dataset, args.model, args.preprocessor, args.output_dir)
    print(metrics)


if __name__ == "__main__":
    main()

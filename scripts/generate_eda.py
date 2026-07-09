from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from ml.constants import TARGET_COLUMN
from ml.data_loader import load_dataset, normalize_columns
from ml.preprocessing import build_profile, feature_engineering, handle_missing_values, remove_duplicates
from ml.visualization import save_correlation_heatmap, save_distribution_plot
from utils.io_utils import write_json, write_text


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate EDA outputs for the salary dataset")
    parser.add_argument("--dataset", type=Path, required=True, help="Path to the salary dataset")
    parser.add_argument("--output-dir", type=Path, default=Path("artifacts/eda"), help="Directory for EDA outputs")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output_dir = args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    frame = load_dataset(args.dataset)
    frame = normalize_columns(frame)
    frame = remove_duplicates(frame)
    frame = handle_missing_values(frame)
    frame = feature_engineering(frame)

    profile = build_profile(frame)
    write_json(output_dir / "data_profile.json", profile.__dict__)
    save_correlation_heatmap(frame, output_dir / "correlation_heatmap.png")
    save_distribution_plot(frame, TARGET_COLUMN, output_dir / "salary_distribution.png")

    report = [
        "# EDA Report",
        "",
        f"Rows: {profile.rows}",
        f"Columns: {profile.columns}",
        f"Duplicate rows: {profile.duplicate_rows}",
        "",
        "## Missing Values",
    ]
    report.extend([f"- {column}: {count}" for column, count in profile.missing_values.items()])
    write_text(output_dir / "eda_report.md", "\n".join(report))


if __name__ == "__main__":
    main()

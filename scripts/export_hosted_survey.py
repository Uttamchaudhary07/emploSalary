"""Export aggregate model estimates and benchmarks for the Vercel function."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import pandas as pd

from scripts.benchmark_survey import SURVEY_ROLES, predict_estimator
from scripts.survey_market import (
    MARKET_PAY_FILE,
    load_market_estimators,
    predict_international,
)
from utils.io_utils import read_json


def export_hosted_survey(artifact_dir: Path, output: Path) -> None:
    estimators = load_market_estimators(artifact_dir)
    india_report = read_json(artifact_dir / "expanded_survey_benchmark.json")
    world_report = read_json(artifact_dir / "international_survey_benchmark.json")
    years = range(52)
    markets = {
        "India": {
            "currency": "INR",
            "benchmark_error": {
                "mean_absolute_error": india_report["test_mae_inr"]["selected"],
                "test_rows": india_report["india_test_rows"],
            },
            "roles": {},
        }
    }
    for role in sorted(set(SURVEY_ROLES.values())):
        profiles = pd.DataFrame({"job_title": role, "years_experience": years})
        estimates = predict_estimator(estimators["india"], profiles)
        markets["India"]["roles"][role] = [round(float(value), 2) for value in estimates]

    world = estimators["international"]
    profiles = pd.DataFrame(
        (country, role, year)
        for country, roles in world["roles_by_country"].items()
        for role in roles
        for year in years
    )
    profiles.columns = ["Country", "job_title", "years_experience"]
    profiles["estimate"] = predict_international(world, profiles)
    for country, country_rows in profiles.groupby("Country"):
        test = world_report["test_by_country"][country]
        markets[country] = {
            "currency": "USD",
            "benchmark_error": {"mean_absolute_error": test["mae_usd"], "test_rows": test["test_rows"]},
            "roles": {
                role: [round(float(value), 2) for value in rows["estimate"]]
                for role, rows in country_rows.groupby("job_title")
            },
        }

    data = {"markets": markets, "market_pay": read_json(artifact_dir / MARKET_PAY_FILE)}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    export_hosted_survey(args.artifact_dir, args.output)

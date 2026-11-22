# Employee Salary ML Project

This project trains a CatBoost regression model to predict employee salary from historical employee records.

## Structure

- `data/` - raw and processed data
- `notebooks/` - exploratory analysis and experimentation
- `ml/` - shared ML code, preprocessing, model, and feature definitions
- `models/` - trained model files
- `artifacts/` - saved metadata, feature columns, metrics, and plots
- `training/` - training entry points
- `evaluation/` - evaluation entry points
- `scripts/` - training, evaluation, and prediction scripts
- `utils/` - shared helpers

## Required Outputs

The training pipeline saves:

- `models/salary_model.pkl`
- `artifacts/preprocessor.pkl`
- `artifacts/feature_columns.json`
- `artifacts/model_metadata.json`
- `artifacts/evaluation_metrics.json`
- `artifacts/evaluation_report.md`

## Run

1. Install dependencies: `pip install -r requirements.txt`
2. Train: `python scripts/train_model.py --dataset "Employee_Salary_Estimator_Dataset_100000 copy.xlsx"`
3. Evaluate: `python scripts/evaluate_model.py --dataset "Employee_Salary_Estimator_Dataset_100000 copy.xlsx"`
4. Predict: `python scripts/predict.py --input sample_input.json`

## Benchmark on real compensation data

Download `results.csv` from the [2024 Stack Overflow Developer Survey archive](https://github.com/StackExchange/Survey/tree/main/packages/archive/2024). From the repository root, run:

```sh
python -m scripts.benchmark_survey --dataset /path/to/results.csv --output-dir /path/to/survey-benchmark
```

The benchmark uses India responses with positive annual total compensation in INR,
a mapped development role, professional coding experience, and answers for
languages, databases, platforms, and web frameworks. It counts the distinct
technologies reported across those four answers. The survey groups data scientists
and machine learning specialists together.

Both methods predict the same held-out 20% of respondents. The median baseline
uses training records for the same role and experience band when at least five
are available, then falls back to the role median and finally the overall median.
CatBoost uses role, experience, and technology count. The report recommends
CatBoost when the paired 95% bootstrap interval for the MAE improvement is
entirely above zero. The report includes role counts for the full sample and
the test set, as well as the range of reported compensation. Positive survey
values are retained as reported and can include data-entry errors.

The output directory holds `survey_benchmark.json` and `survey_catboost.pkl`.
The survey model takes three features and uses its own artifact path for offline
evaluation.

### Compare larger training sets

Add `--expanded` to the command above. This compares the median baseline and
four CatBoost variants on the same India validation set. The variants use
complete survey responses, all eligible India responses, all eligible India
responses with technology count, or India plus international responses.
Incomplete technology answers are represented as missing. For the international
comparison, the model uses country and converts the survey's USD figures to INR
using the median exchange ratio from the India fitting rows.

Model selection uses paired improvement intervals adjusted for four comparisons.
The selected method and the median baseline are evaluated on a separate,
role-stratified India test set. The selected method is then refit on all rows
eligible for that method. Fliar's advertised salary ranges measure a different
target and are excluded from this survey experiment.

The expanded run saves `expanded_survey_benchmark.json` and
`expanded_survey_estimator.pkl`. Load the locally generated estimator and pass
India profiles to `predict_estimator` for offline annual INR estimates.

```python
import joblib
import pandas as pd

from scripts.benchmark_survey import predict_estimator

estimator = joblib.load("/path/to/survey-benchmark/expanded_survey_estimator.pkl")
profiles = pd.DataFrame([{"job_title": "Backend Engineer", "years_experience": 5}])
predictions = predict_estimator(estimator, profiles)
```

### Predict for India and international markets

Train both estimators from the same survey CSV. Then pass a country, a mapped
job role, and years of professional coding experience to the prediction command.

```sh
python -m scripts.survey_market train --dataset /path/to/results.csv --output-dir /path/to/survey-benchmark

python -m scripts.survey_market predict --artifact-dir /path/to/survey-benchmark \
  --country India --role "Backend Engineer" --experience 5

python -m scripts.survey_market predict --artifact-dir /path/to/survey-benchmark \
  --country Germany --role "Backend Engineer" --experience 5
```

India estimates are in INR. International estimates use the survey's
USD-converted annual total compensation and model country as a feature.
International training and evaluation cover non-India countries with at least
30 eligible responses and use a country-stratified holdout. The command accepts
country and role combinations observed in the training source. See
`international_survey_benchmark.json` in the output directory for country
coverage and held-out errors.

## Run the survey inference service

From the repository root, install the service dependencies and start inference
using the artifact directory populated by the market training command.

```sh
python -m pip install -r requirements-inference.txt
SURVEY_ARTIFACT_DIR=/path/to/survey-benchmark \
  python -m uvicorn ml.inference_api:app --host 127.0.0.1 --port 8001
```

Start the authenticated API using the [backend setup](backend/README.md).
It sends `POST /api/v1/predictions/predict` requests to the inference service
configured by `ML_SERVICE_BASE_URL`. Set the same `ML_SERVICE_API_KEY` in both
process environments if the backend uses a key. The response reports annual
total compensation and its currency. City, education, and skills are stored
with the request. The survey models estimate compensation from role, experience,
and international country.

The results page compares an editable offer with the survey's 25th, 50th, and
75th percentiles. The market training command writes these figures to
`market_pay_benchmarks.json`. Benchmarks use at least 20 responses and show the
matched cohort. If a role-and-experience group is too small, the results show
the same role across experience levels or the broader market. For INR results,
the take-home calculator shares the offer amount and accepts optional annual pay
outside regular salary and monthly deductions.

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

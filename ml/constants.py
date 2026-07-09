from __future__ import annotations

FEATURE_COLUMNS = [
    "age",
    "gender",
    "education",
    "years_experience",
    "job_title",
    "department",
    "industry",
    "company_size",
    "company_type",
    "city",
    "state",
    "country",
    "work_mode",
    "skills",
    "programming_language",
    "framework",
    "cloud_platform",
    "database",
    "certifications",
    "performance_rating",
    "previous_companies",
    "system_design_knowledge",
    "dsa_rating",
    "location",
]

TARGET_COLUMN = "salary"

NUMERIC_COLUMNS = [
    "age",
    "years_experience",
    "performance_rating",
    "previous_companies",
    "system_design_knowledge",
    "dsa_rating",
]

CATEGORICAL_COLUMNS = [
    "gender",
    "education",
    "job_title",
    "department",
    "industry",
    "company_size",
    "company_type",
    "city",
    "state",
    "country",
    "work_mode",
    "skills",
    "programming_language",
    "framework",
    "cloud_platform",
    "database",
    "certifications",
    "location",
]

DEFAULT_RANDOM_SEED = 42

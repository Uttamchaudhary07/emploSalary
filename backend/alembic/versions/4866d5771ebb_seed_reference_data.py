"""seed reference data

Revision ID: 4866d5771ebb
Revises: e2aed9b7afdf
Create Date: 2026-07-09 20:13:31.350382

"""
from __future__ import annotations

import uuid
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

import app.database.base


# revision identifiers, used by Alembic.
revision: str = '4866d5771ebb'
down_revision: Union[str, None] = 'e2aed9b7afdf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


job_roles_table = sa.table(
    "job_roles",
    sa.column("id", app.database.base.GUID()),
    sa.column("title", sa.String),
    sa.column("category", sa.String),
)

locations_table = sa.table(
    "locations",
    sa.column("id", app.database.base.GUID()),
    sa.column("city", sa.String),
    sa.column("state", sa.String),
    sa.column("country", sa.String),
)

skills_table = sa.table(
    "skills",
    sa.column("id", app.database.base.GUID()),
    sa.column("name", sa.String),
    sa.column("category", sa.String),
)

JOB_ROLES = [
    ("Software Engineer", "Engineering"),
    ("Senior Software Engineer", "Engineering"),
    ("Data Scientist", "Data"),
    ("Data Analyst", "Data"),
    ("Machine Learning Engineer", "Data"),
    ("Product Manager", "Product"),
    ("Engineering Manager", "Engineering"),
    ("DevOps Engineer", "Engineering"),
    ("Backend Engineer", "Engineering"),
    ("Frontend Engineer", "Engineering"),
    ("Full Stack Engineer", "Engineering"),
    ("QA Engineer", "Engineering"),
    ("UX Designer", "Design"),
    ("UI Designer", "Design"),
    ("Sales Executive", "Sales"),
    ("Account Manager", "Sales"),
    ("Marketing Manager", "Marketing"),
    ("HR Manager", "Human Resources"),
    ("Financial Analyst", "Finance"),
    ("Business Analyst", "Business"),
]

LOCATIONS = [
    ("San Francisco", "California", "United States"),
    ("New York", "New York", "United States"),
    ("Seattle", "Washington", "United States"),
    ("Austin", "Texas", "United States"),
    ("Chicago", "Illinois", "United States"),
    ("Toronto", "Ontario", "Canada"),
    ("Vancouver", "British Columbia", "Canada"),
    ("London", None, "United Kingdom"),
    ("Berlin", None, "Germany"),
    ("Amsterdam", None, "Netherlands"),
    ("Dublin", None, "Ireland"),
    ("Bengaluru", "Karnataka", "India"),
    ("Hyderabad", "Telangana", "India"),
    ("Pune", "Maharashtra", "India"),
    ("Singapore", None, "Singapore"),
    ("Sydney", "New South Wales", "Australia"),
    ("Remote", None, "Remote"),
]

SKILLS = [
    ("Python", "Programming"),
    ("JavaScript", "Programming"),
    ("TypeScript", "Programming"),
    ("Java", "Programming"),
    ("Go", "Programming"),
    ("SQL", "Data"),
    ("React", "Frontend"),
    ("Node.js", "Backend"),
    ("FastAPI", "Backend"),
    ("Django", "Backend"),
    ("AWS", "Cloud"),
    ("GCP", "Cloud"),
    ("Azure", "Cloud"),
    ("Docker", "DevOps"),
    ("Kubernetes", "DevOps"),
    ("Machine Learning", "Data"),
    ("Deep Learning", "Data"),
    ("Data Analysis", "Data"),
    ("Project Management", "Management"),
    ("Communication", "Soft Skills"),
    ("Leadership", "Soft Skills"),
    ("Agile", "Process"),
]


def upgrade() -> None:
    op.bulk_insert(
        job_roles_table,
        [{"id": uuid.uuid4(), "title": title, "category": category} for title, category in JOB_ROLES],
    )
    op.bulk_insert(
        locations_table,
        [
            {"id": uuid.uuid4(), "city": city, "state": state, "country": country}
            for city, state, country in LOCATIONS
        ],
    )
    op.bulk_insert(
        skills_table,
        [{"id": uuid.uuid4(), "name": name, "category": category} for name, category in SKILLS],
    )


def downgrade() -> None:
    op.execute(job_roles_table.delete().where(job_roles_table.c.title.in_([t for t, _ in JOB_ROLES])))
    op.execute(locations_table.delete().where(locations_table.c.city.in_([c for c, _, _ in LOCATIONS])))
    op.execute(skills_table.delete().where(skills_table.c.name.in_([n for n, _ in SKILLS])))

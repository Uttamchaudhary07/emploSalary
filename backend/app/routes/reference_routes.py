from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_reference_data_service
from app.schemas.job_role import JobRoleRead
from app.schemas.location import LocationRead
from app.schemas.skill import SkillRead
from app.services.reference_data_service import ReferenceDataService

router = APIRouter(prefix="/reference", tags=["Reference Data"])


@router.get("/job-roles", response_model=list[JobRoleRead])
async def search_job_roles(
    search: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    reference_service: ReferenceDataService = Depends(get_reference_data_service),
) -> list[JobRoleRead]:
    roles = await reference_service.search_job_roles(search, limit)
    return [JobRoleRead.model_validate(role) for role in roles]


@router.get("/locations", response_model=list[LocationRead])
async def search_locations(
    search: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    reference_service: ReferenceDataService = Depends(get_reference_data_service),
) -> list[LocationRead]:
    locations = await reference_service.search_locations(search, limit)
    return [LocationRead.model_validate(location) for location in locations]


@router.get("/skills", response_model=list[SkillRead])
async def search_skills(
    search: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    reference_service: ReferenceDataService = Depends(get_reference_data_service),
) -> list[SkillRead]:
    skills = await reference_service.search_skills(search, limit)
    return [SkillRead.model_validate(skill) for skill in skills]

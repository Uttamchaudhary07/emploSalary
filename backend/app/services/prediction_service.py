from __future__ import annotations

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.integrations.ml_service import MLPredictionRequest, MLServiceClient
from app.models.prediction import Prediction
from app.models.prediction_history import PredictionHistoryEventType
from app.models.user import User
from app.repositories.job_role_repository import JobRoleRepository
from app.repositories.location_repository import LocationRepository
from app.repositories.prediction_history_repository import PredictionHistoryRepository
from app.repositories.prediction_repository import PredictionRepository
from app.repositories.skill_repository import SkillRepository
from app.schemas.prediction import PredictionCreateRequest, PredictionFilterParams
from app.utils.pagination import Page, PaginationParams

logger = get_logger(component="prediction_service")


class PredictionService:
    def __init__(self, db: AsyncSession, ml_client: MLServiceClient) -> None:
        self._db = db
        self._ml_client = ml_client
        self._predictions = PredictionRepository(db)
        self._history = PredictionHistoryRepository(db)
        self._job_roles = JobRoleRepository(db)
        self._locations = LocationRepository(db)
        self._skills = SkillRepository(db)

    async def create_prediction(self, user: User, data: PredictionCreateRequest) -> Prediction:
        job_role = await self._job_roles.get_or_create(data.job_title)
        location = await self._locations.get_or_create(
            city=data.city, country=data.country, state=data.state
        )
        skills = await self._skills.get_or_create_many(data.skills) if data.skills else []

        ml_request = MLPredictionRequest(
            job_title=data.job_title,
            years_experience=data.years_experience,
            education_level=data.education_level.value,
            city=data.city,
            country=data.country,
            state=data.state,
            skills=data.skills,
        )

        logger.info("Requesting prediction {} for user {}", ml_request.request_id, user.id)
        ml_response = await self._ml_client.predict(ml_request)

        prediction = Prediction(
            user_id=user.id,
            job_role_id=job_role.id,
            location_id=location.id,
            job_title=data.job_title,
            years_experience=data.years_experience,
            education_level=data.education_level.value,
            predicted_salary=ml_response["predicted_salary"],
            currency=ml_response.get("currency", "USD"),
            confidence_score=ml_response.get("confidence_score"),
            ml_model_version=str(ml_response.get("model_version", "unknown")),
            ml_request_id=ml_request.request_id,
            raw_input=ml_request.to_payload(),
            raw_output=ml_response,
        )
        prediction.skills = skills

        await self._predictions.create(prediction)
        await self._history.add_event(
            prediction_id=prediction.id,
            user_id=user.id,
            event_type=PredictionHistoryEventType.CREATED,
            snapshot={"predicted_salary": float(prediction.predicted_salary)},
        )
        await self._db.commit()

        return await self._predictions.get_by_id(prediction.id)

    async def get_prediction(self, user: User, prediction_id: uuid.UUID, *, record_view: bool = True) -> Prediction:
        prediction = await self._predictions.get_by_id(prediction_id)
        if prediction is None or prediction.user_id != user.id:
            raise NotFoundError("Prediction not found.")

        if record_view:
            await self._history.add_event(
                prediction_id=prediction.id,
                user_id=user.id,
                event_type=PredictionHistoryEventType.VIEWED,
            )
            await self._db.commit()

        return prediction

    async def list_history(
        self, user: User, pagination: PaginationParams, filters: PredictionFilterParams
    ) -> Page[Prediction]:
        return await self._predictions.list_for_user(
            user.id,
            pagination,
            job_role_id=filters.job_role_id,
            location_id=filters.location_id,
            search=filters.search,
            date_from=filters.date_from,
            date_to=filters.date_to,
        )

    async def get_audit_trail(self, user: User, prediction_id: uuid.UUID) -> list:
        prediction = await self._predictions.get_by_id(prediction_id)
        if prediction is None or prediction.user_id != user.id:
            raise NotFoundError("Prediction not found.")
        return await self._history.list_for_prediction(prediction_id)

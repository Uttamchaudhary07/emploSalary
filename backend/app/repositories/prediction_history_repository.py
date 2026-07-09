from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.prediction_history import PredictionHistory, PredictionHistoryEventType


class PredictionHistoryRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add_event(
        self,
        *,
        prediction_id: uuid.UUID,
        user_id: uuid.UUID,
        event_type: PredictionHistoryEventType,
        snapshot: dict | None = None,
    ) -> PredictionHistory:
        event = PredictionHistory(
            prediction_id=prediction_id, user_id=user_id, event_type=event_type, snapshot=snapshot
        )
        self._session.add(event)
        await self._session.flush()
        return event

    async def list_for_prediction(self, prediction_id: uuid.UUID) -> list[PredictionHistory]:
        stmt = (
            select(PredictionHistory)
            .where(PredictionHistory.prediction_id == prediction_id)
            .order_by(PredictionHistory.created_at.asc())
        )
        result = await self._session.execute(stmt)
        return list(result.scalars())

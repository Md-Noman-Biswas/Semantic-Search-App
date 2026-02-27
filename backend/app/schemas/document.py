from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentBase(BaseModel):
    title: str
    description: str
    summary: str


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    summary: str | None = None


class DocumentOut(DocumentBase):
    id: int
    created_by: int
    summary_embedding: list[float] | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

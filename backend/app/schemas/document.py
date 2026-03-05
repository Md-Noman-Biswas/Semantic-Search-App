from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentCreate(BaseModel):
    title: str
    description: str
    summary: str | None = None


class SummaryGenerateRequest(BaseModel):
    title: str
    description: str


class SummaryGenerateResponse(BaseModel):
    summary: str


class DocumentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    summary: str | None = None


class DocumentOut(BaseModel):
    id: int
    title: str
    description: str
    summary: str
    created_by: int
    summary_embedding: list[float] | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicDocumentOut(BaseModel):
    id: int
    title: str
    description: str
    summary: str
    created_at: datetime
    author_id: int
    author_name: str


class SimilarDocumentOut(PublicDocumentOut):
    similarity_score: float

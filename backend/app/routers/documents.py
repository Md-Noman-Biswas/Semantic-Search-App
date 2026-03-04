from fastapi import APIRouter, Depends, HTTPException
from math import sqrt
from sqlalchemy.orm import Session

from app.core.embeddings import EmbeddingError, generate_summary_embedding
from app.core.database import get_db
from app.deps import get_current_user
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentOut, DocumentUpdate, PublicDocumentOut, SimilarDocumentOut


router = APIRouter(prefix="/api/documents", tags=["documents"])
public_router = APIRouter(prefix="/api/public/documents", tags=["public-documents"])


def cosine_similarity(left: list[float], right: list[float]) -> float:
    if len(left) != len(right) or not left:
        return 0.0

    dot_product = sum(a * b for a, b in zip(left, right))
    left_norm = sqrt(sum(value * value for value in left))
    right_norm = sqrt(sum(value * value for value in right))

    if not left_norm or not right_norm:
        return 0.0

    return dot_product / (left_norm * right_norm)


def serialize_public_document(doc: Document) -> PublicDocumentOut:
    return PublicDocumentOut(
        id=doc.id,
        title=doc.title,
        description=doc.description,
        summary=doc.summary,
        created_at=doc.created_at,
        author_id=doc.creator.id,
        author_name=doc.creator.name,
    )


def try_generate_embedding(summary: str) -> list[float] | None:
    try:
        return generate_summary_embedding(summary)
    except EmbeddingError:
        return None


@router.get("/", response_model=list[DocumentOut])
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Document)
    if current_user.role != "admin":
        query = query.filter(Document.created_by == current_user.id)
    documents = query.order_by(Document.created_at.desc()).all()

    updated = False
    for doc in documents:
        if doc.summary and not doc.summary_embedding:
            embedding = try_generate_embedding(doc.summary)
            if embedding is not None:
                doc.summary_embedding = embedding
                updated = True

    if updated:
        db.commit()
        for doc in documents:
            db.refresh(doc)

    return documents


@router.post("/", response_model=DocumentOut, status_code=201)
def create_document(
    payload: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    summary_embedding = try_generate_embedding(payload.summary)

    doc = Document(**payload.model_dump(), created_by=current_user.id, summary_embedding=summary_embedding)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.put("/{document_id}", response_model=DocumentOut)
def update_document(
    document_id: int,
    payload: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "admin" and doc.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updates = payload.model_dump(exclude_unset=True)

    if "summary" in updates:
        doc.summary_embedding = try_generate_embedding(updates["summary"])
    elif not doc.summary_embedding and doc.summary:
        doc.summary_embedding = try_generate_embedding(doc.summary)

    for field, value in updates.items():
        setattr(doc, field, value)

    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if current_user.role != "admin" and doc.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(doc)
    db.commit()


@public_router.get("/", response_model=list[PublicDocumentOut])
def list_public_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).join(Document.creator).order_by(Document.created_at.desc()).all()
    return [serialize_public_document(doc) for doc in documents]


@public_router.get("/{document_id}", response_model=PublicDocumentOut)
def get_public_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).join(Document.creator).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return serialize_public_document(doc)


@public_router.get("/{document_id}/similar", response_model=list[SimilarDocumentOut])
def list_similar_documents(document_id: int, threshold: float = 0.6, limit: int = 5, db: Session = Depends(get_db)):
    if threshold < 0 or threshold > 1:
        raise HTTPException(status_code=400, detail="threshold must be between 0 and 1")

    doc = db.query(Document).join(Document.creator).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if not doc.summary_embedding:
        raise HTTPException(status_code=400, detail="Selected document has no embedding")

    candidates = db.query(Document).join(Document.creator).filter(Document.id != document_id).all()
    scored: list[SimilarDocumentOut] = []

    for candidate in candidates:
        if not candidate.summary_embedding:
            continue

        score = cosine_similarity(doc.summary_embedding, candidate.summary_embedding)
        if score >= threshold:
            scored.append(
                SimilarDocumentOut(
                    **serialize_public_document(candidate).model_dump(),
                    similarity_score=score,
                )
            )

    scored.sort(key=lambda item: item.similarity_score, reverse=True)
    return scored[: max(1, min(limit, 5))]

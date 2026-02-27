from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.embeddings import EmbeddingError, generate_summary_embedding
from app.core.database import get_db
from app.deps import get_current_user
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentOut, DocumentUpdate


router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("/", response_model=list[DocumentOut])
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Document)
    if current_user.role != "admin":
        query = query.filter(Document.created_by == current_user.id)
    return query.order_by(Document.created_at.desc()).all()


@router.post("/", response_model=DocumentOut, status_code=201)
def create_document(
    payload: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        summary_embedding = generate_summary_embedding(payload.summary)
    except EmbeddingError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

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
        try:
            doc.summary_embedding = generate_summary_embedding(updates["summary"])
        except EmbeddingError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

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

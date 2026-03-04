from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentOut, DocumentUpdate, PublicDocumentOut


router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("/", response_model=list[DocumentOut])
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Document)
    if current_user.role != "admin":
        query = query.filter(Document.created_by == current_user.id)
    return query.order_by(Document.created_at.desc()).all()


@router.get("/public", response_model=list[PublicDocumentOut])
def list_public_documents(db: Session = Depends(get_db)):
    docs = (
        db.query(Document, User.name)
        .join(User, Document.created_by == User.id)
        .order_by(Document.created_at.desc())
        .all()
    )
    return [
        PublicDocumentOut(
            id=doc.id,
            title=doc.title,
            description=doc.description,
            summary=doc.summary,
            created_by=doc.created_by,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
            author_name=author_name,
        )
        for doc, author_name in docs
    ]


@router.get("/public/{document_id}", response_model=PublicDocumentOut)
def get_public_document(document_id: int, db: Session = Depends(get_db)):
    result = (
        db.query(Document, User.name)
        .join(User, Document.created_by == User.id)
        .filter(Document.id == document_id)
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="Document not found")

    doc, author_name = result
    return PublicDocumentOut(
        id=doc.id,
        title=doc.title,
        description=doc.description,
        summary=doc.summary,
        created_by=doc.created_by,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
        author_name=author_name,
    )


@router.post("/", response_model=DocumentOut, status_code=201)
def create_document(
    payload: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = Document(**payload.model_dump(), created_by=current_user.id)
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

    for field, value in payload.model_dump(exclude_unset=True).items():
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

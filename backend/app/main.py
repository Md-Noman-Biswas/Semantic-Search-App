from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models import User
from app.routers import auth, documents, users


Base.metadata.create_all(bind=engine)


def ensure_documents_embedding_column() -> None:
    if not engine.url.drivername.startswith("sqlite"):
        return

    with engine.connect() as connection:
        columns = {column["name"] for column in inspect(connection).get_columns("documents")}
        if "summary_embedding" not in columns:
            connection.execute(text("ALTER TABLE documents ADD COLUMN summary_embedding JSON"))
            connection.commit()

app = FastAPI(title="Semantic Search App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def seed_admin_user():
    ensure_documents_embedding_column()

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            db.add(
                User(
                    name="Admin",
                    email="admin@example.com",
                    password=get_password_hash("admin123"),
                    role="admin",
                )
            )
            db.commit()
    finally:
        db.close()


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(documents.router)
app.include_router(documents.public_router)


@app.get("/")
def root():
    return {"message": "Semantic Search App API is running"}

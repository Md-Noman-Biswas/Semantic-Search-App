from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models import User
from app.routers import auth, documents, users


Base.metadata.create_all(bind=engine)

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


@app.get("/")
def root():
    return {"message": "Semantic Search App API is running"}

# Semantic Search App (FastAPI + React)

## Folder Structure

```text
Semantic-Search-App/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── document.py
│   │   │   ├── user.py
│   │   │   └── __init__.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── documents.py
│   │   │   ├── users.py
│   │   │   └── __init__.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── document.py
│   │   │   └── user.py
│   │   ├── deps.py
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── components/
│   │   │   ├── DocumentForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── UserManagementPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Backend setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- API runs at `http://localhost:8000`.
- Default seeded admin user:
  - email: `admin@example.com`
  - password: `admin123`

### Environment variables (optional)
Create `backend/.env`:

```env
JWT_SECRET_KEY=your_secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./app.db
```

> Notes: `config.py` currently reads `jwt_secret_key`, `access_token_expire_minutes`, and `database_url` with defaults.

## Frontend setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- Frontend runs at `http://localhost:5173`.
- To point frontend to backend, use optional `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

## Implemented Features

- JWT login with hashed passwords (`passlib` + bcrypt).
- Role-based route protection (`admin` / `user`).
- Admin can:
  - view all documents
  - create/edit any document
  - view all users
  - create users
  - edit user role and fields
- User can:
  - view own documents only
  - create/edit/delete own documents
- SQLAlchemy ORM models for `User` and `Document`.
- Pydantic schemas for input/output validation.


## Troubleshooting

If you see this startup error on Windows:
- `(trapped) error reading bcrypt version`
- `AttributeError: module 'bcrypt' has no attribute '__about__'`

it usually means an incompatible `bcrypt` version is installed with `passlib`. This project pins `bcrypt==4.0.1` in `backend/requirements.txt`. Recreate your venv and reinstall dependencies:

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install --upgrade pip
pip install --force-reinstall -r requirements.txt
```

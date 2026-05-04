# Inner Serenity Counselling Center - Backend API

FastAPI backend for the Inner Serenity Counselling Center web application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

4. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py              # Application entry point
│   ├── api/
│   │   └── routes/         # API route handlers
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   ├── core/
│   │   ├── config.py        # Configuration
│   │   └── security.py      # Authentication
│   └── db/
│       ├── session.py       # Database session
│       └── base.py          # Base model
├── alembic/                 # Database migrations
├── requirements.txt
└── .env.example
```

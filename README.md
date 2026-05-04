# Inner Serenity Counselling Centre - Monorepo

A modern, responsive counselling center web application built as a monorepo with separate frontend, backend, and database management components.

## Project Structure

```
.
├── frontend/                  # Next.js 15+ frontend application
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── public/                # Static assets
│   ├── styles/                # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
│
├── backend/                   # FastAPI Python backend
│   ├── app/
│   │   ├── main.py            # Application entry point
│   │   ├── api/
│   │   │   └── routes/       # API route handlers
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   ├── core/
│   │   │   ├── config.py     # Configuration
│   │   │   └── security.py   # Authentication
│   │   └── db/
│   │       ├── session.py     # Database session
│   │       └── base.py        # Base model
│   ├── alembic/               # Database migrations
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── database/                  # Database management
│   ├── migrations/            # Alembic migration files
│   ├── seeds/                 # Seed scripts
│   ├── export/
│   │   └── export_db.py      # Export to JSON/CSV
│   ├── import/
│   │   └── import_db.py      # Import from JSON/CSV
│   ├── schema.sql             # SQL schema dump
│   └── README.md
│
├── docker-compose.yml         # Docker orchestration
├── .gitignore
└── README.md
```

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd innerserenity-counselling-center-web
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- PostgreSQL: localhost:5432

## Manual Setup

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit http://localhost:8000/docs for API documentation

### Database

The database is managed via PostgreSQL. See `database/README.md` for:
- Export/import utilities
- Migration management
- Seeding initial data

## Features

### Frontend
- **Professional Branding**: Elegant lotus logo and "Inner Serenity" branding
- **Responsive Design**: Mobile-first approach for all devices
- **Dark/Light Mode**: Theme toggle with persistent preference
- **Smooth Animations**: Framer Motion-powered transitions
- **Pages**: Home, About, Services, Resources, Booking, Chat, Contact
- **Admin Dashboard**: Calendar, clients, invoices, sessions management

### Backend
- **RESTful API**: FastAPI with automatic OpenAPI documentation
- **Authentication**: JWT-based admin authentication
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic for database version control
- **Routes**: Bookings, clients, invoices, sessions, quotes, messaging, admin

## Technology Stack

### Frontend
- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI components
- Framer Motion

### Backend
- FastAPI
- Python 3.11+
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/innerserenity
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
API_V1_PREFIX=/api
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Available Endpoints
- `POST /api/bookings` - Create/update bookings
- `GET /api/clients` - Manage clients
- `GET /api/invoices` - Invoice management
- `GET /api/sessions` - Therapy sessions
- `GET /api/quotes` - Inspirational quotes
- `POST /api/messaging` - Messaging system
- `POST /api/admin/login` - Admin authentication

## Database Management

### Export Database
```bash
cd database
python export/export_db.py
```

### Import Database
```bash
cd database
python import/import_db.py --format json
```

### Run Migrations
```bash
cd backend
alembic upgrade head
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload  # Start dev server
```

## Documentation

- `frontend/` - Frontend-specific documentation in its README
- `backend/README.md` - Backend API documentation
- `database/README.md` - Database management guide
- Various `.md` files in root for project history (implementation guides, etc.)

## License

Proprietary - Inner Serenity Counselling Centre

## Support

For issues or questions:
- Email: support@innerserenity.com
- Phone: +1 (555) 123-4567
- Hours: Mon-Fri 9AM-7PM, Sat 10AM-4PM

---

Built with ❤️ for mental health and inner serenity.

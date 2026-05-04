# Database Management

This directory contains database migration, seeding, and export/import utilities.

## Structure

```
database/
├── migrations/          # Alembic migration files (symlink from backend/alembic)
├── seeds/               # Seed scripts for initial data
├── export/
│   └── export_db.py     # Script to export all tables to JSON/CSV
├── import/
│   └── import_db.py     # Script to import from JSON/CSV
└── schema.sql           # Auto-generated plain SQL schema dump
```

## Usage

### Export Database

Export all tables to JSON and CSV:

```bash
cd database
python export/export_db.py
```

This will create:
- `export/json/*.json` - JSON exports of all tables
- `export/csv/*.csv` - CSV exports of all tables

### Import Database

Import from JSON:

```bash
cd database
python import/import_db.py --format json
```

Import from CSV:

```bash
cd database
python import/import_db.py --format csv
```

### Run Migrations

Migrations are managed by Alembic in the backend. See `backend/alembic/` for migration files.

```bash
cd backend
alembic upgrade head
```

### Seed Initial Data

Run seed scripts to populate initial data:

```bash
cd database/seeds
python seed_data.py
```

## Environment Variables

Set `DATABASE_URL` environment variable before running scripts:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/innerserenity"
```

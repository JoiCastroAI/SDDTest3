# Development Guide

## Prerequisites

- **Docker** and **Docker Compose**
- **Node.js** (v18+) and **npm** — for local frontend development
- **Python 3.12** — for local backend development (optional if using Docker)
- **Git**

## Quick Start (Docker)

Start all services with Docker Compose:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on `localhost:5432`
- **Backend (FastAPI)** on `localhost:8000`
- **Frontend (Vite/React)** on `localhost:5173`

Default credentials (override via `.env`):
- `POSTGRES_USER=appuser`
- `POSTGRES_PASSWORD=apppassword`
- `POSTGRES_DB=appdb`

## Local Development

### Backend

```bash
cd backend
pip install -e ".[dev]"

# Run database migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --port 8000
```

Requires a running PostgreSQL instance. Set `DATABASE_URL` environment variable:
```
DATABASE_URL=postgresql+asyncpg://appuser:apppassword@localhost:5432/appdb
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev server runs at `http://localhost:5173`.

Set `VITE_API_URL` to point to the backend (defaults to `http://localhost:8000`).

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend E2E Tests (Cypress)

```bash
cd frontend
npx cypress open    # Interactive
npx cypress run     # Headless
```

Requires both backend and frontend running.

### Seed Database

Populate the database with 22 sample companies for development/demo:

```bash
# Via Docker
docker compose exec backend python -m scripts.seed_companies

# Local
cd backend
python -m scripts.seed_companies
```

The script is idempotent — re-running skips existing companies.

## Project Structure

```
├── backend/
│   ├── app/              # FastAPI application (Clean Architecture / DDD)
│   ├── alembic/          # Database migrations
│   ├── scripts/          # Utility scripts (seed data, etc.)
│   ├── tests/            # pytest tests
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components (common/, layout/, dashboard/)
│   │   ├── pages/        # Page components (DashboardPage, CompaniesPage)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer (Axios)
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility functions
│   │   └── App.tsx       # Root component with routing
│   ├── cypress/          # E2E tests
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── ai-specs/             # Standards, specs, and documentation
```

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | — | Redirects to `/dashboard` |
| `/dashboard` | DashboardPage | KPI cards, charts, and company ranking |
| `/companies` | CompaniesPage | Company CRUD with paginated table |

All routes render inside `MainLayout` which includes a collapsible sidebar.

## Key Dependencies

### Backend
- FastAPI, SQLAlchemy 2.x, Pydantic v2, Alembic, PostgreSQL 16

### Frontend
- React 18, TypeScript, Vite, React Router v6, Bootstrap 5 (react-bootstrap), Recharts, Axios, Cypress

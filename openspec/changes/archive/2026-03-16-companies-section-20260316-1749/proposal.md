## Why

The application needs a Companies entity to support core business operations. Users must be able to list, create, edit, and delete companies through a responsive UI backed by a full CRUD API. Bulk operations (multi-select and delete) are required for efficient data management.

## What Changes

- New `Company` domain entity with fields: id, name (unique), street, city, state, zip_code, country, revenue, expenses, employees, clients, created_at, updated_at. Profit is computed (revenue - expenses).
- New `companies` database table with Alembic migration
- New REST API endpoints: GET (list with pagination), GET (by id), POST, PUT, DELETE, DELETE (bulk)
- New Companies page at `/companies` with paginated table, bulk selection, create/edit modals, empty state
- Frontend implementation follows Figma designs with responsive layout
- Unit tests (domain, use cases, router) and integration tests (all endpoints)
- Cypress e2e tests for all user flows
- Documentation updates: `api-spec.yml`, `data-model.md`

## Capabilities

### New Capabilities
- `companies-crud`: Backend CRUD API for the Companies entity — domain entity, repository, use cases, REST endpoints, pagination, bulk delete, database migration
- `companies-ui`: Frontend Companies page — paginated table with bulk selection, create/edit modals, empty state, responsive layout, Figma-linked design

### Modified Capabilities
<!-- None — this is a greenfield feature with no existing specs -->

## Impact

- **Backend**: New domain entity, repository, use cases, router, Alembic migration under `backend/app/`
- **Database**: New `companies` table in PostgreSQL
- **API**: 5 new endpoints under `/companies`
- **Frontend**: New page component, service layer, types under `frontend/src/`
- **Documentation**: `ai-specs/specs/api-spec.yml` and `ai-specs/specs/data-model.md` updated
- **Tests**: New unit, integration, and e2e test files

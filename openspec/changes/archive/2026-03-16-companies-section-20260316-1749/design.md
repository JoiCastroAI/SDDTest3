## Context

This is a greenfield feature adding a Companies entity to the application. There is no existing companies functionality. The backend uses Python 3.12 / FastAPI with Clean Architecture (DDD layers), PostgreSQL via SQLAlchemy 2.x async, and Alembic migrations. The frontend uses React 18 / TypeScript / Vite with react-bootstrap and Axios. The UI must match provided Figma designs.

The Figma designs reveal the Company entity has: name, address fields (street/city/state/zip/country), financial data (revenue/expenses with computed profit), and metrics (employees/clients).

## Goals / Non-Goals

**Goals:**
- Full CRUD backend for Companies following Clean Architecture layers (Domain → Application → Infrastructure → Presentation)
- Paginated list endpoint with configurable page size
- Bulk delete endpoint (idempotent — silently skips missing IDs)
- Frontend Companies page with table, bulk selection, create/edit modals, empty state
- Figma-faithful responsive layout using react-bootstrap (converted from Tailwind reference)
- Comprehensive test coverage: unit, integration, and e2e

**Non-Goals:**
- Company relationships (e.g., parent/child companies, company-to-user associations) — future work
- Search or filtering on the companies list — not in current acceptance criteria (search input visible in Figma but not in AC)
- Soft delete — companies are hard-deleted
- Import/export functionality
- Sorting functionality — visible in Figma headers but not in current AC scope

## Decisions

### 1. Domain entity as a dataclass, not a Pydantic model
**Decision**: Use `@dataclass` for the `Company` domain entity.
**Rationale**: Per backend-standards.mdc, domain entities are pure Python with no framework imports. Pydantic schemas are used only at the API boundary.
**Alternative considered**: Pydantic BaseModel for domain — rejected because it couples the domain to Pydantic.

### 2. Computed profit field (not stored)
**Decision**: `profit` is computed as `revenue - expenses` in the domain entity and API response. It is NOT stored in the database.
**Rationale**: Storing computed values creates data consistency risks. The computation is trivial (subtraction), so there is no performance concern.
**Alternative considered**: Stored computed column in PostgreSQL — rejected for simplicity.

### 3. Pagination via offset/limit with wrapper response
**Decision**: Use `page`/`page_size` query params, return `{items, total, page, page_size, total_pages}`.
**Rationale**: Offset pagination is simple and sufficient for a companies table.
**Alternative considered**: Cursor-based pagination — overkill for this dataset size.

### 4. Bulk delete as DELETE /companies with request body
**Decision**: `DELETE /companies` with `{"ids": [...]}` body, returns 204. Silently skips non-existent IDs.
**Rationale**: Idempotent behavior avoids partial-failure complexity.
**Alternative considered**: `POST /companies/bulk-delete` — rejected to keep REST semantics.

### 5. Unique constraint on company name
**Decision**: Enforce uniqueness at both DB level (UNIQUE constraint + index) and API level (409 Conflict response).
**Rationale**: DB constraint is the safety net; API-level check provides a user-friendly error message.

### 6. Frontend modals for create/edit
**Decision**: Use react-bootstrap `Modal` component for both create and edit forms, sharing a single `CompanyFormModal` component with mode prop.
**Rationale**: Create and edit forms have identical fields (per Figma). A shared component reduces duplication.

### 7. NUMERIC(15,2) for financial fields
**Decision**: Use `NUMERIC(15,2)` (Decimal) for revenue and expenses.
**Rationale**: Financial data requires exact decimal arithmetic. Float would introduce rounding errors.
**Alternative considered**: INTEGER storing cents — rejected for readability.

### 8. Figma-to-Bootstrap conversion
**Decision**: Convert Figma Tailwind output to react-bootstrap components + custom CSS using Figma design tokens (colors, radii, typography).
**Rationale**: Project uses react-bootstrap per frontend-standards.mdc. Tailwind is NOT installed.

## Risks / Trade-offs

- **[Risk] Bulk delete without confirmation could cause accidental data loss** → Mitigation: Frontend shows a confirmation dialog before calling the bulk delete API.
- **[Risk] Name uniqueness check is not atomic (race condition between check and insert)** → Mitigation: DB UNIQUE constraint catches any race; API returns 409 from the IntegrityError handler.
- **[Risk] Hard delete is irreversible** → Mitigation: Accepted for MVP. Soft delete can be added later if needed.
- **[Trade-off] Offset pagination degrades on very large datasets** → Acceptable for companies table.
- **[Trade-off] Search input visible in Figma but excluded from scope** → Can be added in a follow-up change.

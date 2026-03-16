<!-- BEGIN_ENRICHED_USER_STORY -->
# Enriched User Story

design-linked: true
scope:
  backend: true
  frontend: true
source: Notion
reference: https://www.notion.so/31a04e35e0538073ad71c7cc64e16cb6

## Title
Companies Section

## Problem / Context
The application requires a Companies entity to manage company data end-to-end. Users need the ability to list, create, edit, and delete companies through a responsive UI backed by a full CRUD API. Bulk operations (select multiple and delete) are also required. The frontend implementation must follow the provided Figma designs, including empty states and responsive layout.

## Desired Outcome
- A paginated companies table with bulk selection checkboxes
- Bulk delete action for selected companies
- Create company modal with form validation
- Edit company modal with pre-populated data and form validation
- Empty state displayed when no companies exist
- Full CRUD REST API for the Companies entity

## Acceptance Criteria

### Backend
- BE-AC1: `Company` domain entity with fields: `id` (UUID, PK), `name` (str, required, unique), `industry` (str, optional), `website` (str, optional), `phone` (str, optional), `address` (str, optional), `created_at` (datetime), `updated_at` (datetime)
- BE-AC2: `GET /companies` returns paginated list. Query params: `page` (int, default 1), `page_size` (int, default 10, max 100). Response includes `items`, `total`, `page`, `page_size`, `total_pages`.
- BE-AC3: `GET /companies/{company_id}` returns a single company by UUID. Returns 404 if not found.
- BE-AC4: `POST /companies` creates a new company. Request body: `name` (required), `industry`, `website`, `phone`, `address`. Returns 201 with created entity. Returns 409 if `name` already exists.
- BE-AC5: `PUT /companies/{company_id}` updates an existing company. Returns 404 if not found. Returns 409 if updated `name` conflicts.
- BE-AC6: `DELETE /companies/{company_id}` deletes a company. Returns 204 on success. Returns 404 if not found.
- BE-AC7: `DELETE /companies` (bulk delete). Request body: `ids: list[UUID]`. Returns 204 on success. Silently skips IDs that do not exist.
- BE-AC8: Alembic migration creates the `companies` table.
- BE-AC9: Unit tests for domain entity, use cases, and router layer (AAA pattern).
- BE-AC10: Integration tests for all endpoints using `httpx.AsyncClient`.
- BE-AC11: `api-spec.yml` updated with all Companies endpoints.
- BE-AC12: `data-model.md` updated with Companies entity definition.

### Frontend
- FE-AC1: Companies page at route `/companies` displays a paginated table of companies.
- FE-AC2: Table columns match Figma design. Each row shows company data with a selection checkbox.
- FE-AC3: Header checkbox selects/deselects all visible rows.
- FE-AC4: When one or more rows are selected, a bulk actions bar appears with a "Delete" button.
- FE-AC5: Bulk delete shows a confirmation dialog, then calls the bulk delete API and refreshes the list.
- FE-AC6: "New Company" button opens a creation modal with form fields matching the entity (name required, others optional). Validation errors displayed inline.
- FE-AC7: Clicking a row's edit action opens an edit modal pre-populated with company data. Save calls the update API and refreshes the list.
- FE-AC8: Empty state is shown when no companies exist, matching the Figma empty state design.
- FE-AC9: Pagination controls at the bottom of the table (page navigation, page size selector).
- FE-AC10: Responsive layout — table adapts to smaller viewports as per Figma.
- FE-AC11: All interactive elements have `data-testid` attributes.
- FE-AC12: Loading and error states handled for all async operations.
- FE-AC13: Cypress e2e tests cover: list view, create, edit, delete single, bulk delete, empty state, pagination.

## API Contracts

### GET /companies
**Query params:** `page` (int), `page_size` (int)
**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "industry": "string | null",
      "website": "string | null",
      "phone": "string | null",
      "address": "string | null",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ],
  "total": 0,
  "page": 1,
  "page_size": 10,
  "total_pages": 0
}
```

### GET /companies/{company_id}
**Response 200:** Single company object (same shape as items above)
**Response 404:** `{"detail": "Company not found: <id>"}`

### POST /companies
**Request body:**
```json
{
  "name": "string (required)",
  "industry": "string | null",
  "website": "string | null",
  "phone": "string | null",
  "address": "string | null"
}
```
**Response 201:** Created company object
**Response 409:** `{"detail": "Company with name '<name>' already exists"}`

### PUT /companies/{company_id}
**Request body:** Same as POST
**Response 200:** Updated company object
**Response 404:** `{"detail": "Company not found: <id>"}`
**Response 409:** `{"detail": "Company with name '<name>' already exists"}`

### DELETE /companies/{company_id}
**Response 204:** No content
**Response 404:** `{"detail": "Company not found: <id>"}`

### DELETE /companies (bulk)
**Request body:**
```json
{
  "ids": ["uuid", "uuid"]
}
```
**Response 204:** No content

## Data Model

### companies table
| Column     | Type                     | Constraints                  |
|------------|--------------------------|------------------------------|
| id         | UUID                     | PK, default uuid4            |
| name       | VARCHAR(255)             | NOT NULL, UNIQUE, indexed    |
| industry   | VARCHAR(255)             | NULLABLE                     |
| website    | VARCHAR(500)             | NULLABLE                     |
| phone      | VARCHAR(50)              | NULLABLE                     |
| address    | TEXT                     | NULLABLE                     |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, default now()      |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, default now(), on update now() |

## Design References

Figma File:
https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=0-1

Referenced Nodes:
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-3
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-549
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1230
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1675

## Constraints / Notes
- Backend follows Clean Architecture with DDD layers (Domain → Application → Infrastructure → Presentation) per backend-standards.mdc
- Frontend uses React 18 + TypeScript + Vite + react-bootstrap per frontend-standards.mdc
- All code, comments, error messages in English
- Company `name` must be unique (enforced at DB and API level)
- Bulk delete is idempotent — non-existent IDs are silently skipped

<!-- END_ENRICHED_USER_STORY -->

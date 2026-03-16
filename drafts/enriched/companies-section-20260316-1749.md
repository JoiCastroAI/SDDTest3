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
- BE-AC1: `Company` domain entity with fields: `id` (UUID, PK), `name` (str, required, unique), `street` (str, optional), `city` (str, optional), `state` (str, optional), `zip_code` (str, optional), `country` (str, optional), `revenue` (Decimal, default 0), `expenses` (Decimal, default 0), `employees` (int, default 0), `clients` (int, default 0), `created_at` (datetime), `updated_at` (datetime). Profit is computed as `revenue - expenses` (not stored).
- BE-AC2: `GET /companies` returns paginated list. Query params: `page` (int, default 1), `page_size` (int, default 10, max 100). Response includes `items`, `total`, `page`, `page_size`, `total_pages`. Each item includes a computed `profit` field.
- BE-AC3: `GET /companies/{company_id}` returns a single company by UUID. Returns 404 if not found.
- BE-AC4: `POST /companies` creates a new company. Request body: `name` (required), `street`, `city`, `state`, `zip_code`, `country`, `revenue`, `expenses`, `employees`, `clients`. Returns 201 with created entity. Returns 409 if `name` already exists.
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
- FE-AC2: Table columns match Figma: checkbox, Name, Address (city, state), Revenue, Expenses, Profit (computed), Employees, Clients, Actions (edit/delete).
- FE-AC3: Header checkbox selects/deselects all visible rows.
- FE-AC4: When one or more rows are selected, a bulk actions bar appears with a "Delete" button.
- FE-AC5: Bulk delete shows a confirmation dialog, then calls the bulk delete API and refreshes the list.
- FE-AC6: "New Company" button opens a creation modal with form sections: Basic Info (name), Address (street, city, state, zip, country), Financial Data (revenue, expenses, computed profit), Other Data (employees, clients). Name is required. Validation errors displayed inline.
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
      "street": "string | null",
      "city": "string | null",
      "state": "string | null",
      "zip_code": "string | null",
      "country": "string | null",
      "revenue": 0.0,
      "expenses": 0.0,
      "profit": 0.0,
      "employees": 0,
      "clients": 0,
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
  "street": "string | null",
  "city": "string | null",
  "state": "string | null",
  "zip_code": "string | null",
  "country": "string | null",
  "revenue": 0.0,
  "expenses": 0.0,
  "employees": 0,
  "clients": 0
}
```
**Response 201:** Created company object (includes computed profit)
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
| street     | VARCHAR(255)             | NULLABLE                     |
| city       | VARCHAR(255)             | NULLABLE                     |
| state      | VARCHAR(100)             | NULLABLE                     |
| zip_code   | VARCHAR(20)              | NULLABLE                     |
| country    | VARCHAR(100)             | NULLABLE                     |
| revenue    | NUMERIC(15,2)            | NOT NULL, default 0          |
| expenses   | NUMERIC(15,2)            | NOT NULL, default 0          |
| employees  | INTEGER                  | NOT NULL, default 0          |
| clients    | INTEGER                  | NOT NULL, default 0          |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, default now()      |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, default now(), on update now() |

Note: `profit` is computed as `revenue - expenses` and returned in API responses but NOT stored in the database.

## Design References

Figma File:
https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=0-1

Referenced Nodes:
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-3
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-549
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1230
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-título?node-id=1-1675

## Design Snapshot (from Figma MCP)

### Design Tokens
- Primary color: `#5a6745` (olive green — active nav, primary buttons, profit text)
- Text primary: `#0a0a0a`
- Text secondary: `#717182`
- Required field indicator: `#d4183d`
- Input background: `#f3f3f5`
- Table header background: `rgba(236, 236, 240, 0.5)`
- Calculated profit background: `#f5f7f3`
- Sidebar background: `#fafafa`
- Border color: `rgba(0, 0, 0, 0.1)`
- Card shadow: `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)`
- Border radius: `10px` (buttons, cards, inputs)
- Font: Inter (Regular 400, Medium 500, Semi Bold 600, Bold 700)
- Base font size: 16px, line-height 24px

### Node 1:3 — Sidebar
- Vertical nav with logo "FastReport" and menu items (Dashboard, Empresas)
- Active item: bg `#5a6745`, text white
- Inactive item: text `#0a0a0a`

### Node 1:549 — Companies Table (main content)
- Header: title "Empresas" + subtitle + "Nueva Empresa" primary button
- Search input below header
- Table columns: checkbox | Name (sortable) | Address | Revenue (sortable) | Expenses (sortable) | Profit (sortable) | Employees (sortable) | Clients (sortable) | Actions
- Row actions: edit icon + delete icon buttons
- Footer: "Showing N of N companies"

### Node 1:1230 — Create Company Modal
- Title: "Nueva Empresa" with X close button
- Sections: Basic Info (name*), Address (street*, city*, state*, zip*, country*), Financial Data (revenue*, expenses*, computed profit display), Other Data (employees*, clients*)
- Footer: Cancel (outline) + "Crear Empresa" (primary) buttons
- Shadow card with rounded corners

### Node 1:1675 — Edit Company Modal
- Same layout as create modal but title "Editar Empresa"
- Fields pre-populated with existing data
- Submit button text: "Guardar Cambios"

## Constraints / Notes
- Backend follows Clean Architecture with DDD layers (Domain → Application → Infrastructure → Presentation) per backend-standards.mdc
- Frontend uses React 18 + TypeScript + Vite + react-bootstrap per frontend-standards.mdc
- All code, comments, error messages in English
- Company `name` must be unique (enforced at DB and API level)
- Bulk delete is idempotent — non-existent IDs are silently skipped
- Profit is always computed (revenue - expenses), never stored

<!-- END_ENRICHED_USER_STORY -->

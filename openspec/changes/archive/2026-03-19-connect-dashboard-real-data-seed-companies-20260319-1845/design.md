## Context

The dashboard UI is fully built (KPI cards, 4 charts, ranking table) but wired to `mockDashboardData.ts` — a static file with 8 fake companies and fabricated monthly profit numbers. The backend already serves a complete Companies CRUD API (`GET /companies` with pagination), and a `companyService` Axios client exists on the frontend. The gap is purely in the hook (`useDashboardData`) which imports mock data synchronously instead of calling the API.

The Company model has no time-series fields — only per-company snapshots (revenue, expenses, profit, employees, clients, created_at). The `ProfitEvolutionChart` currently consumes `MonthlyProfitData[]` which cannot be derived from the existing data model without fabrication.

## Goals / Non-Goals

**Goals:**
- Connect `useDashboardData` to the real `companyService.getAll()` API
- Compute KPIs and chart datasets from live company records
- Replace the fabricated monthly chart with a meaningful chart derivable from real company fields
- Seed 20+ realistic companies so the dashboard is populated on first run
- Remove all mock data artifacts

**Non-Goals:**
- Adding time-series / historical data to the Company model
- Changing dashboard layout, styling, or component structure
- Modifying the Companies CRUD page or API endpoints
- Adding new API endpoints

## Decisions

### D1: Fetch strategy — single large-page request

**Decision**: Call `companyService.getAll(1, 1000)` with a large page size to fetch all companies in one request.

**Alternatives considered**:
- Pagination loop (fetch page by page until exhausted): More correct for large datasets, but adds complexity. With ~25 companies this is unnecessary.
- New `/companies/stats` aggregate endpoint: Clean separation, but violates the "no new endpoints" constraint and over-engineers for the current scale.

**Rationale**: Simplest approach. The dataset is small (20-30 companies). If the company count grows significantly, a dedicated stats endpoint can be added later.

### D2: ProfitEvolutionChart replacement — Top N companies by profit

**Decision**: Replace the monthly line chart with a bar chart showing the top 10 companies ranked by profit. Reuse the existing `Company[]` data.

**Alternatives considered**:
- Derive "cumulative profit by creation month" from `created_at`: Misleading — `created_at` is when the record was added to the system, not when the company started earning profit.
- Remove the chart entirely: Leaves a visual gap in the dashboard layout.

**Rationale**: Uses real data without fabrication. Complements the existing RevenueChart (top 5 by revenue) by showing a different ranking dimension. Keeps the same card slot in the dashboard grid.

### D3: Type relocation — `types/dashboard.ts`

**Decision**: Move `KpiTotals` type and `computeKpiTotals()` to `frontend/src/types/dashboard.ts`. Remove `MonthlyProfitData` type entirely (no longer needed after D2).

**Rationale**: These types are consumed by the hook and dashboard page. A dedicated `types/dashboard.ts` keeps them discoverable alongside `types/company.ts`.

### D4: Seed script — standalone Python script with repository layer

**Decision**: Create `backend/scripts/seed_companies.py` that uses the existing SQLAlchemy infrastructure (session factory, CompanyModel) to insert companies directly. The script checks for existing companies by name and skips duplicates (idempotent).

**Alternatives considered**:
- Alembic data migration: Mixes schema migrations with data seeding, harder to re-run selectively.
- API-based seeding (HTTP POST loop): Adds network overhead, requires the server to be running, slower.

**Rationale**: Direct database access is fastest and doesn't require the API server. Using the existing SQLAlchemy models ensures data consistency. Idempotency via name-check makes it safe to re-run.

### D5: Seed data characteristics

**Decision**: 22 companies across diverse industries (tech, healthcare, finance, manufacturing, retail, energy, education, logistics, etc.), spanning multiple countries and revenue ranges ($500K–$15M). Financial ratios are realistic (expenses 55–85% of revenue, employee counts proportional to revenue).

## Risks / Trade-offs

- **[Risk] Large page_size fetch**: If company count grows to thousands, fetching all in one request becomes slow → **Mitigation**: Acceptable for MVP; add a `/dashboard/stats` endpoint when needed.
- **[Risk] Seed script couples to database internals**: Direct SQLAlchemy usage means the script breaks if models change → **Mitigation**: The script imports the same models used by the application; changes propagate naturally.
- **[Risk] ProfitEvolutionChart component rename/rework**: Changing from line chart to bar chart may break existing E2E selectors → **Mitigation**: Update `dashboard.cy.ts` test selectors in the same change.

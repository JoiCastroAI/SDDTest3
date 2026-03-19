## Why

The dashboard displays hardcoded mock data instead of real company records from the API. KPIs and charts are fabricated, making the dashboard useless for understanding actual system state. Additionally, the database has too few companies to produce a meaningful dashboard view — seeding 20+ diverse companies is needed.

## What Changes

- Replace mock data imports in `useDashboardData` hook with real `companyService.getAll()` API calls
- Compute all KPIs (revenue, expenses, profit, employees, clients) from fetched company data
- Derive all chart data from real company records instead of fabricated arrays
- Replace the `ProfitEvolutionChart` (which relies on non-existent time-series data) with a chart derived from real company fields
- Create a backend seed script that populates 20+ companies with realistic, diverse financial data
- Delete `mockDashboardData.ts` and relocate reusable types/functions
- Update E2E tests to work with real API data

## Capabilities

### New Capabilities
- `seed-companies`: Backend seed script that creates 20+ companies with realistic, diverse financial data across industries and revenue ranges. Idempotent (skips existing companies by name).
- `dashboard-live-data`: Frontend hook and type changes to connect the dashboard to the real companies API, compute KPIs from live data, and derive all chart datasets from actual company records.

### Modified Capabilities
_(No existing spec-level requirements change. The companies CRUD API and UI remain unchanged.)_

## Impact

- **Backend**: New `backend/scripts/seed_companies.py` script; no API changes needed
- **Frontend**: `useDashboardData` hook rewritten (async fetch replaces sync mock); `mockDashboardData.ts` deleted; `ProfitEvolutionChart` updated to use real data; types relocated to `types/dashboard.ts`
- **Tests**: `dashboard.cy.ts` updated to expect real API responses
- **APIs**: No new endpoints — existing `GET /companies` is sufficient (with larger `page_size`)
- **Dependencies**: None added

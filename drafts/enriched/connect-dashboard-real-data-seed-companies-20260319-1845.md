<!-- BEGIN_ENRICHED_USER_STORY -->
# Enriched User Story

design-linked: false
scope:
  backend: true
  frontend: true
source: Manual
reference: N/A

## Title
Connect dashboard to real backend data and seed companies

## Problem / Context
The dashboard currently displays hardcoded mock data from `mockDashboardData.ts` instead of real company data from the API. All KPIs (revenue, expenses, profit, employees, clients) and chart data are fabricated. Additionally, the database has very few companies, so even after connecting to the real API the dashboard would look empty.

## Desired Outcome
The dashboard fetches all company data from the real backend API, computes KPIs and chart data from actual records, and displays a populated view thanks to 20+ seeded companies with realistic, diverse financial data.

## Acceptance Criteria

### AC-1: Hook uses real API
- `useDashboardData` calls `companyService.getAll()` instead of importing mock data.
- Loading and error states are properly handled (spinner while fetching, error message on failure).
- The hook fetches ALL companies (page_size large enough or pagination loop).

### AC-2: KPIs computed from real data
- `computeKpiTotals()` (or equivalent logic) aggregates revenue, expenses, profit, employees, and clients from the fetched company array.
- KPI cards display correct totals matching the sum of all companies in the database.

### AC-3: Charts derived from real company data
- **RevenueChart**: Top 5 companies by revenue — already consumes `companies[]`, no change needed beyond data source.
- **ExpensesVsRevenueChart**: Top 6 companies by profit margin — already consumes `companies[]`, no change needed beyond data source.
- **DistributionChart**: Revenue range distribution — already consumes `companies[]`, no change needed beyond data source.
- **RankingTable**: Top 10 companies by profit — already consumes `companies[]`, no change needed beyond data source.
- **ProfitEvolutionChart**: Currently uses `MonthlyProfitData[]` which is fully fabricated. Since the Company model has no time-series data, this chart must be replaced with a real-data alternative. **Decision**: Replace with "Profit by Company" (top N companies by profit as a line/bar), OR derive a "Cumulative Profit by Company Creation Month" from `created_at` dates. See Open Questions.

### AC-4: Backend seed script
- A seed script (e.g., `backend/scripts/seed_companies.py`) creates 20+ companies with realistic, diverse data.
- Companies span multiple industries, countries, and revenue ranges (small to large).
- Financial figures are realistic (expenses < revenue in most cases, varied employee/client counts).
- The script is idempotent (skips companies that already exist by name) or clearly documented as one-time.
- The script can be run via a simple command (e.g., `python -m scripts.seed_companies` or a docker-compose exec command).

### AC-5: Remove mock data
- `frontend/src/data/mockDashboardData.ts` is deleted.
- The `KpiTotals` type and `computeKpiTotals()` function are relocated (e.g., to `frontend/src/types/dashboard.ts` or within the hook itself).
- The `MonthlyProfitData` type is either relocated or removed depending on chart decision.
- No remaining imports reference `mockDashboardData`.

### AC-6: Tests updated
- E2E tests (`dashboard.cy.ts`) are updated to work with real API data (or intercepted realistic responses).
- Backend seed script has basic validation (e.g., a test or self-check that confirms 20+ companies were created).

## Technical Analysis

### Backend Changes
| File / Area | Change |
|---|---|
| `backend/scripts/seed_companies.py` (NEW) | Seed script creating 20+ companies via repository or direct SQL |
| `backend/app/main.py` | Possibly add a CLI entrypoint or management command for seeding |

### Frontend Changes
| File / Area | Change |
|---|---|
| `frontend/src/hooks/useDashboardData.ts` | Replace mock imports with `companyService.getAll()` call; async fetch with loading/error |
| `frontend/src/data/mockDashboardData.ts` | DELETE |
| `frontend/src/types/dashboard.ts` (NEW or inline) | Relocate `KpiTotals`, `computeKpiTotals()` |
| `frontend/src/components/dashboard/ProfitEvolutionChart.tsx` | Update to use real-data-derived chart (see AC-3 decision) |

### Existing Code That Needs No Change (data-source agnostic)
- `KpiCard.tsx` — receives props, no data awareness
- `RevenueChart.tsx` — receives `companies[]`
- `ExpensesVsRevenueChart.tsx` — receives `companies[]`
- `DistributionChart.tsx` — receives `companies[]`
- `RankingTable.tsx` — receives `companies[]`
- `DashboardPage.tsx` — consumes hook output, no mock awareness (unless ProfitEvolutionChart props change)

### API Considerations
- `GET /companies` currently paginates (default page_size=10). The hook must request a large enough page_size (e.g., 1000) or implement pagination to get all companies.
- No new API endpoints are needed.

## Open Questions

1. **ProfitEvolutionChart replacement**: The Company model has no monthly time-series data. Options:
   - **(A)** Replace with "Top N Companies by Profit" bar chart (simplest, uses existing data).
   - **(B)** Derive "Companies Created per Month" or "Cumulative Profit by Creation Month" from `created_at`.
   - **(C)** Remove the chart entirely and replace with another metric (e.g., employees distribution).
   - **Recommendation**: Option (A) or (B). Needs PO decision.

2. **Seed script execution**: Should the seed script run automatically on first `docker-compose up`, or remain a manual step?

## Out of Scope
- Adding time-series/historical data to the Company model.
- Authentication or authorization changes.
- Modifying the Companies CRUD page.
- Changing chart styling or dashboard layout (UI stays the same).

## Dependencies
- Backend API must be running and accessible from frontend.
- Database must be migrated (companies table exists).
- `companyService.getAll()` already exists and works.
<!-- END_ENRICHED_USER_STORY -->

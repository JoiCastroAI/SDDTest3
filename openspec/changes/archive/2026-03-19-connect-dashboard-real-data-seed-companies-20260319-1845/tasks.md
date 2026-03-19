## 1. Backend — Seed Script

- [x] 1.1 [BE] Create `backend/scripts/seed_companies.py` with 22 diverse companies (multiple industries, countries, realistic financials: revenue $500K–$15M, expenses 55–85% of revenue, proportional employees/clients)
- [x] 1.2 [BE] Implement idempotency — check existing companies by name, skip duplicates, print summary (created vs. skipped)
- [x] 1.3 [BE] Verify seed script runs successfully via `docker-compose exec backend python -m scripts.seed_companies` and creates 22 companies

## 2. Frontend — Type Relocation

- [x] 2.1 [FE] Create `frontend/src/types/dashboard.ts` with `KpiTotals` type and `computeKpiTotals()` function (moved from `mockDashboardData.ts`)
- [x] 2.2 [FE] Update all imports that reference `KpiTotals` or `computeKpiTotals` from `mockDashboardData` to import from `types/dashboard`

## 3. Frontend — Connect Hook to Real API

- [x] 3.1 [FE] Rewrite `useDashboardData` hook to call `companyService.getAll(1, 1000)` with async/await, proper loading state, and error handling
- [x] 3.2 [FE] Remove all imports from `data/mockDashboardData` in the hook

## 4. Frontend — Replace ProfitEvolutionChart

- [x] 4.1 [FE] Replace `ProfitEvolutionChart` internals: change from line chart (monthly mock data) to bar chart showing top 10 companies by profit (descending), using `Company[]` as input prop instead of `MonthlyProfitData[]`
- [x] 4.2 [FE] Update `DashboardPage.tsx` to pass `companies` to the updated chart instead of `monthlyProfitData`
- [x] 4.3 [FE] Remove `MonthlyProfitData` type (no longer needed) and `monthlyProfitData` from hook return type

## 5. Frontend — Remove Mock Data

- [x] 5.1 [FE] Delete `frontend/src/data/mockDashboardData.ts`
- [x] 5.2 [FE] Verify no remaining imports reference `mockDashboardData` anywhere in the codebase

## 6. Tests

- [x] 6.1 [TEST] Add a self-check to the seed script that verifies 22 companies exist after execution
- [x] 6.2 [E2E] Update `frontend/cypress/e2e/dashboard.cy.ts` to work with real API data (remove any mock-dependent assertions, verify KPI cards render non-zero values, verify charts render)

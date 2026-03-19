## ADDED Requirements

### Requirement: Hook fetches companies from real API
The `useDashboardData` hook SHALL call `companyService.getAll()` to fetch company data from the backend API instead of importing mock data.

#### Scenario: Successful data fetch
- **WHEN** the dashboard page loads
- **THEN** the hook calls `companyService.getAll(1, 1000)` to retrieve all companies
- **AND** the returned companies array is used for KPI computation and chart rendering
- **AND** a loading state is shown while the request is in flight

#### Scenario: API error handling
- **WHEN** the API call fails (network error, server error)
- **THEN** the hook sets an error message
- **AND** the loading state is cleared
- **AND** the dashboard displays the error state (no crash)

#### Scenario: Empty database
- **WHEN** the API returns zero companies
- **THEN** all KPIs display zero values
- **AND** the dashboard shows the existing empty state

### Requirement: KPIs computed from real company data
The dashboard SHALL compute all KPI totals by aggregating real company records.

#### Scenario: KPI aggregation
- **WHEN** companies are fetched successfully
- **THEN** Total Revenue equals the sum of all companies' `revenue` field
- **AND** Total Expenses equals the sum of all companies' `expenses` field
- **AND** Net Profit equals the sum of all companies' `profit` field
- **AND** Total Employees equals the sum of all companies' `employees` field
- **AND** Total Clients equals the sum of all companies' `clients` field

### Requirement: Charts derived from real company data
All dashboard charts SHALL render data derived exclusively from the fetched company records.

#### Scenario: Revenue chart uses real data
- **WHEN** companies are loaded
- **THEN** the RevenueChart displays the top 5 companies by revenue (no change needed — already data-driven)

#### Scenario: Profit margin chart uses real data
- **WHEN** companies are loaded
- **THEN** the ExpensesVsRevenueChart displays profit margin for top 6 companies by profit (no change needed — already data-driven)

#### Scenario: Distribution chart uses real data
- **WHEN** companies are loaded
- **THEN** the DistributionChart groups companies by revenue range (no change needed — already data-driven)

#### Scenario: Ranking table uses real data
- **WHEN** companies are loaded
- **THEN** the RankingTable shows top 10 companies by profit (no change needed — already data-driven)

### Requirement: ProfitEvolutionChart replaced with real-data chart
The ProfitEvolutionChart SHALL be replaced with a chart that displays the top 10 companies by profit as a bar chart, since the Company model has no time-series data.

#### Scenario: Top companies by profit chart
- **WHEN** companies are loaded
- **THEN** a bar chart displays the top 10 companies ranked by profit (descending)
- **AND** each bar shows the company name on the axis and profit value
- **AND** the chart title reflects the new content (e.g., "Top Companies by Profit")

#### Scenario: Chart styling consistency
- **WHEN** the new chart renders
- **THEN** it uses the same Recharts library and visual style (colors, fonts, card wrapper) as other dashboard charts

### Requirement: Mock data module removed
The file `frontend/src/data/mockDashboardData.ts` SHALL be deleted after all references are replaced.

#### Scenario: No remaining mock imports
- **WHEN** the codebase is searched for imports from `mockDashboardData`
- **THEN** zero import statements reference that module
- **AND** the file no longer exists on disk

### Requirement: Dashboard types relocated
The `KpiTotals` type and `computeKpiTotals()` function SHALL be moved to `frontend/src/types/dashboard.ts`.

#### Scenario: Types accessible from new location
- **WHEN** `useDashboardData` or other consumers import `KpiTotals` or `computeKpiTotals`
- **THEN** they import from `types/dashboard` (not from `data/mockDashboardData`)

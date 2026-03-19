## ADDED Requirements

### Requirement: Dashboard page route
The application SHALL render a Dashboard page at the `/dashboard` route. The root route `/` SHALL redirect to `/dashboard`.

#### Scenario: Navigate to dashboard
- **WHEN** the user navigates to `/dashboard`
- **THEN** the Dashboard page SHALL render inside the MainLayout with sidebar visible

#### Scenario: Root redirect
- **WHEN** the user navigates to `/`
- **THEN** the application SHALL redirect to `/dashboard`

### Requirement: KPI metric cards
The Dashboard page SHALL display 5 KPI metric cards: Total Revenue, Total Expenses, Net Profit, Total Employees, Total Clients. Values SHALL be computed from all companies.

#### Scenario: KPI cards render with computed values
- **WHEN** the dashboard loads with companies having revenue=[100000, 200000], expenses=[50000, 80000], employees=[10, 20], clients=[5, 15]
- **THEN** 5 KPI cards SHALL display: Total Revenue=€ 300,000.00, Total Expenses=€ 130,000.00, Net Profit=€ 170,000.00, Total Employees=30, Total Clients=20

#### Scenario: KPI cards display icons
- **WHEN** the KPI cards render
- **THEN** each card SHALL display a relevant react-bootstrap-icon (e.g., CurrencyEuro for revenue, GraphDown for expenses, GraphUp for profit, People for employees, PersonPlus for clients)

#### Scenario: Financial values formatted with currency
- **WHEN** a KPI card displays a financial value of 125450.00
- **THEN** the value SHALL be formatted as "€ 125,450.00" with thousands separators and 2 decimal places

#### Scenario: Integer values formatted without decimals
- **WHEN** a KPI card displays Total Employees=1500
- **THEN** the value SHALL be formatted as "1,500" with thousands separators and no decimal places

### Requirement: Revenue distribution bar chart
The Dashboard SHALL display a bar chart (Recharts BarChart) showing revenue distribution by company name.

#### Scenario: Bar chart renders with company data
- **WHEN** the dashboard loads with 5 companies
- **THEN** a bar chart SHALL render with one bar per company, using the company name as the X-axis label and revenue as the Y-axis value

#### Scenario: Bar chart tooltip on hover
- **WHEN** the user hovers over a bar in the revenue chart
- **THEN** a tooltip SHALL display the company name and formatted revenue value

#### Scenario: Bar chart uses primary color
- **WHEN** the revenue bar chart renders
- **THEN** the bars SHALL use the primary color #5a6745

### Requirement: Profit evolution line chart
The Dashboard SHALL display a line chart (Recharts LineChart) showing profit trends over a static period of the last 6–12 months.

#### Scenario: Line chart renders with monthly data
- **WHEN** the dashboard loads
- **THEN** a line chart SHALL render with months on the X-axis and aggregated profit on the Y-axis

#### Scenario: Line chart tooltip on hover
- **WHEN** the user hovers over a data point in the profit evolution chart
- **THEN** a tooltip SHALL display the month name and formatted profit value

#### Scenario: Line chart uses primary color
- **WHEN** the profit evolution chart renders
- **THEN** the line SHALL use the primary color #5a6745

### Requirement: Expenses vs revenue grouped bar chart
The Dashboard SHALL display a grouped bar chart (Recharts BarChart) comparing expenses and revenue side by side per company.

#### Scenario: Grouped bar chart renders
- **WHEN** the dashboard loads with company data
- **THEN** a grouped bar chart SHALL render with two bars per company: revenue (#5a6745) and expenses (secondary gray)

#### Scenario: Grouped bar chart tooltip on hover
- **WHEN** the user hovers over a bar group
- **THEN** a tooltip SHALL display the company name with both revenue and expenses values formatted with currency

### Requirement: Distribution chart
The Dashboard SHALL display an area or donut chart (Recharts) showing employee or client distribution across companies.

#### Scenario: Distribution chart renders
- **WHEN** the dashboard loads with company data
- **THEN** an area or donut chart SHALL render showing distribution of employees or clients per company

#### Scenario: Distribution chart tooltip on hover
- **WHEN** the user hovers over a segment of the distribution chart
- **THEN** a tooltip SHALL display the company name and corresponding value

### Requirement: Ranking table — top 10 companies
The Dashboard SHALL display a table with the top 10 companies sorted by net profit in descending order.

#### Scenario: Ranking table renders with correct columns
- **WHEN** the dashboard loads with company data
- **THEN** a table SHALL display columns: Position, Company Name, Revenue, Expenses, Profit

#### Scenario: Ranking table sorted by profit descending
- **WHEN** there are companies with profits [50000, 100000, 75000]
- **THEN** the ranking table SHALL display them in order: 1st=100000, 2nd=75000, 3rd=50000

#### Scenario: Ranking table limited to 10 entries
- **WHEN** there are 15 companies
- **THEN** the ranking table SHALL display only the top 10 by net profit

#### Scenario: First position highlighted
- **WHEN** the ranking table renders
- **THEN** the first position row SHALL be visually highlighted with a distinct background or badge

#### Scenario: Ranking table financial values formatted
- **WHEN** the ranking table displays a revenue value of 250000
- **THEN** it SHALL be formatted as "€ 250,000.00"

### Requirement: Dashboard empty state
When no companies exist, the Dashboard SHALL display an informative empty state message instead of charts and ranking.

#### Scenario: Empty state when no companies
- **WHEN** the dashboard loads and there are zero companies
- **THEN** an empty state message SHALL be displayed (e.g., "No companies registered yet. Add your first company to see dashboard metrics.")
- **AND** KPI cards SHALL show zero values or dashes

### Requirement: Mock data support
The Dashboard SHALL support mock/example data for demonstration purposes when no real company data is available.

#### Scenario: Mock data available for demonstration
- **WHEN** the dashboard is used for demonstration with no real API data
- **THEN** realistic example data SHALL be available for all KPI cards, charts, and the ranking table

#### Scenario: Mock data uses Company type
- **WHEN** mock data is generated
- **THEN** it SHALL conform to the existing `Company` type from `types/company.ts`

### Requirement: Dashboard visual design
The Dashboard page SHALL follow the specified design tokens for colors, spacing, and visual style.

#### Scenario: Design tokens applied
- **WHEN** the dashboard renders
- **THEN** the background SHALL be white (#ffffff), the primary accent color SHALL be #5a6745, and sections SHALL have 24px spacing

#### Scenario: KPI cards have visual separation
- **WHEN** KPI cards render
- **THEN** each card SHALL have a subtle shadow (`0 1px 3px 0 rgba(0,0,0,0.1)`) or border and 8px border-radius

#### Scenario: Charts responsive within container
- **WHEN** the dashboard content area resizes (e.g., sidebar collapse/expand)
- **THEN** all charts SHALL resize responsively within their containers without overflow or clipping

### Requirement: Dashboard data-testid attributes
All interactive and key dashboard elements SHALL have `data-testid` attributes for Cypress e2e testing.

#### Scenario: Dashboard page has testid
- **WHEN** the dashboard page renders
- **THEN** it SHALL have `data-testid="dashboard-page"`

#### Scenario: KPI cards have testids
- **WHEN** KPI cards render
- **THEN** each card SHALL have a testid: `data-testid="kpi-total-revenue"`, `data-testid="kpi-total-expenses"`, `data-testid="kpi-net-profit"`, `data-testid="kpi-total-employees"`, `data-testid="kpi-total-clients"`

## Design References

Implementation MUST consult Figma MCP at apply time for visual layout and component structure:
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-t%C3%ADtulo?node-id=1-38&t=QcS1oj0KkCvF2TRB-0
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-t%C3%ADtulo?node-id=1-3&t=QcS1oj0KkCvF2TRB-0

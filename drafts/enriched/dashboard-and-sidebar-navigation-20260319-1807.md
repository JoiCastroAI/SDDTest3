<!-- BEGIN_ENRICHED_USER_STORY -->
# Enriched User Story

design-linked: true
scope:
  backend: false
  frontend: true
source: Notion
reference: https://www.notion.so/Dashboard-Section-and-lateral-menu-32804e35e05380adab19defb82c0ff58

## Title
Dashboard with consolidated metrics, interactive charts, company ranking, and collapsible sidebar navigation

## Problem / Context
FastReport is a desktop SaaS for business management that allows users to manage multiple companies from a single platform. Users currently must review each company individually to get financial and operational performance data, which is time-consuming and makes it hard to identify patterns or compare across companies. There is no unified view showing overall business status or KPIs. Additionally, a persistent sidebar navigation is needed as the primary navigation component across all screens.

## Desired Outcome
Users can visualize on a single screen:
- Consolidated total metrics across all companies (revenue, expenses, net profit, employees, clients)
- Financial and operational trends via interactive charts (Recharts)
- Company ranking by performance (top 10 by net profit)
- Visual comparisons to facilitate strategic decisions
- A collapsible sidebar for navigating between sections (Dashboard, Companies)

The dashboard must load quickly, be visually clear, and allow basic chart interaction (tooltips on hover).

## Acceptance Criteria

### AC-1: KPI Metric Cards
- GIVEN the user navigates to the Dashboard page
- WHEN the page loads
- THEN 5 KPI cards are displayed: Total Revenue, Total Expenses, Net Profit, Total Employees, Total Clients
- AND each card shows a value computed from all companies (note: no "active" status field exists — all companies are included)
- AND each card displays a relevant icon (using react-bootstrap-icons per project standards)
- AND financial values are formatted with thousands separators and € symbol (e.g., "€ 125,450.00")
- AND integer values (employees, clients) are formatted with thousands separators only

### AC-2: Revenue Distribution Chart (Bar)
- GIVEN there are companies with revenue data
- WHEN the dashboard renders
- THEN a bar chart (Recharts) displays revenue distribution by company name
- AND hovering over a bar shows a tooltip with company name and formatted revenue
- AND the chart uses primary color #5a6745

### AC-3: Profit Evolution Chart (Line)
- GIVEN the dashboard is loaded
- WHEN the profit evolution section renders
- THEN a line chart (Recharts) shows profit trends over a static period (last 6–12 months)
- AND hovering shows tooltip with month and profit value
- AND the chart uses primary color #5a6745

### AC-4: Expenses vs Revenue Comparison Chart (Grouped Bar)
- GIVEN the dashboard is loaded
- WHEN the comparison section renders
- THEN a grouped bar chart (Recharts) shows expenses and revenue side by side per company
- AND hovering shows tooltip with both values
- AND revenue uses primary color #5a6745, expenses use a secondary gray tone

### AC-5: Distribution Chart (Area or Donut)
- GIVEN the dashboard is loaded
- WHEN the distribution section renders
- THEN an area or donut chart (Recharts) shows employee or client distribution across companies
- AND hovering shows tooltip with company name and value

### AC-6: Ranking Table — Top 10 Companies
- GIVEN there are companies with financial data
- WHEN the dashboard renders
- THEN a table displays the top 10 companies sorted by net profit (descending)
- AND columns are: Position, Company Name, Revenue, Expenses, Profit
- AND all financial values are formatted with thousands separators and € symbol
- AND the first position row is visually highlighted (e.g., gold badge or distinct background)

### AC-7: Collapsible Sidebar — Structure
- GIVEN the user is on any page
- WHEN the layout renders
- THEN a fixed left sidebar is displayed
- AND when expanded, the sidebar width is ~256px showing full logo text "FastReport" and nav item labels
- AND when collapsed, the sidebar width is ~72px showing only icons and a reduced logo/isotipo

### AC-8: Collapsible Sidebar — Navigation Items
- GIVEN the sidebar is rendered
- WHEN the user views the navigation items
- THEN at minimum 2 items are shown: "Dashboard" (route: /dashboard) and "Companies" (route: /companies)
- AND each item has an icon (react-bootstrap-icons per project standards)
- AND the active route item is highlighted with #5a6745 background and white text
- AND inactive items show gray text (#6b7280) with hover background (#f3f4f6)

### AC-9: Collapsible Sidebar — Toggle Behavior
- GIVEN the sidebar has a toggle button
- WHEN the user clicks the toggle
- THEN the sidebar smoothly transitions between expanded and collapsed states (250ms CSS transition)
- AND the main content area adjusts width accordingly without layout breakage
- AND the collapsed/expanded state persists during the browser session (React state; no localStorage required)

### AC-10: Sidebar — Route Navigation
- GIVEN the sidebar items are clickable
- WHEN the user clicks "Dashboard"
- THEN the app navigates to /dashboard without full page reload (react-router)
- AND when the user clicks "Companies"
- THEN the app navigates to /companies without full page reload

### AC-11: Layout and Visual Design
- GIVEN the dashboard page is loaded
- WHEN the user views the page
- THEN the background is white (#ffffff) with military green (#5a6745) as primary accent
- AND sections have consistent 24px spacing
- AND KPI cards have subtle shadows or borders for visual separation
- AND the layout works correctly on desktop resolutions >= 1280px width

### AC-12: Empty State
- GIVEN no companies exist in the system
- WHEN the dashboard loads
- THEN an informative empty state message is displayed (e.g., "No companies registered yet. Add your first company to see dashboard metrics.")
- AND KPI cards show zero values or dashes

### AC-13: Mock / Example Data
- GIVEN the system has no real company data
- WHEN the dashboard is used for demonstration
- THEN realistic example data is available for all charts, cards, and ranking table
- AND mock data can be replaced by real API data from GET /companies in a future iteration

## Standard Compliance Notes

### CRITICAL — UI Framework Conflict
The original user story specifies Tailwind CSS v4 and lucide-react. However, the **project frontend standards** (`ai-specs/specs/frontend-standards.mdc`) mandate:
- **Bootstrap 5 / react-bootstrap** for UI components and styling
- **react-bootstrap-icons** for icons (not lucide-react)

**Resolution**: Implementation MUST follow the project standards (Bootstrap 5 + react-bootstrap-icons). Tailwind CSS and lucide-react MUST NOT be used. The visual design tokens (colors, spacing, shadows) from the user story will be applied via Bootstrap utilities and custom CSS.

### New Dependency: Recharts
Recharts is not currently in the project but is explicitly required by the user story for charting. It must be added as a dependency: `npm install recharts`.

### No "Active" Status Field
The Company entity has no `active`/`status` field. All companies will be included in dashboard calculations. If filtering by active status is needed in the future, a data model change would be required first.

### Routing Change
Current App.tsx redirects `/` to `/companies`. This must change to redirect to `/dashboard` (or make `/dashboard` the default route) and introduce a layout wrapper component that includes the sidebar on all pages.

## Technical Notes

### Existing Assets to Leverage
- `frontend/src/types/company.ts` — Company type already defined with all needed fields (revenue, expenses, profit, employees, clients)
- `frontend/src/services/companyService.ts` — Existing API service for fetching companies
- `frontend/src/utils/format.ts` — May already contain number formatting utilities
- `GET /companies` API endpoint — Returns paginated company list (may need `page_size=100` or a new unpaginated endpoint for dashboard aggregation)

### New Files Expected
- `frontend/src/pages/DashboardPage.tsx` — Main dashboard page component
- `frontend/src/components/layout/Sidebar.tsx` — Collapsible sidebar component
- `frontend/src/components/layout/MainLayout.tsx` — Layout wrapper with sidebar + content area
- `frontend/src/components/dashboard/KpiCard.tsx` — Individual KPI metric card
- `frontend/src/components/dashboard/RevenueChart.tsx` — Bar chart for revenue distribution
- `frontend/src/components/dashboard/ProfitEvolutionChart.tsx` — Line chart for profit trends
- `frontend/src/components/dashboard/ExpensesVsRevenueChart.tsx` — Grouped bar chart
- `frontend/src/components/dashboard/DistributionChart.tsx` — Area or donut chart
- `frontend/src/components/dashboard/RankingTable.tsx` — Top 10 companies ranking table
- `frontend/src/hooks/useDashboardData.ts` — Custom hook to compute dashboard aggregates
- `frontend/src/data/mockDashboardData.ts` — Mock/example data for demonstration

### Design Tokens (from user story, applied via Bootstrap/CSS)
- Color Primary: `#5a6745` (military green)
- Color Background: `#ffffff`
- Color Text Primary: `#1a1a1a`
- Color Text Secondary: `#6b7280`
- Color Border: `#e5e7eb`
- Shadow Card: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- Spacing Section: `24px`
- Border Radius: `8px`
- Sidebar Width Expanded: `256px`
- Sidebar Width Collapsed: `72px`
- NavItem Active Background: `#5a6745`
- NavItem Active Text: `#ffffff`
- NavItem Inactive Text: `#6b7280`
- NavItem Hover Background: `#f3f4f6`
- Transition Duration: `250ms`

## Constraints
- React 18 + TypeScript (strict mode)
- Bootstrap 5 / react-bootstrap (per project standards — NOT Tailwind)
- react-bootstrap-icons (per project standards — NOT lucide-react)
- Recharts for all charts (new dependency)
- React Router v6 for navigation
- Desktop only (min 1280px, no mobile responsive)
- No backend changes required — use existing GET /companies or mock data
- Single currency: € EUR
- Static time period for evolution charts (last 6–12 months)
- Dashboard must render < 2s with up to 100 companies
- Charts must not lag on hover/resize interaction

## Design References

Figma File:
https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/FastReport?node-id=0-1&t=QcS1oj0KkCvF2TRB-1

Referenced Nodes:
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-t%C3%ADtulo?node-id=1-38&t=QcS1oj0KkCvF2TRB-0
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-t%C3%ADtulo?node-id=1-3&t=QcS1oj0KkCvF2TRB-0

<!-- END_ENRICHED_USER_STORY -->

## 1. Setup and Dependencies

- [x] 1.1 [FE] Install `recharts` dependency in frontend (`npm install recharts`)
- [x] 1.2 [FE] Add CSS custom properties for design tokens in `index.css` (--color-primary: #5a6745, --color-bg: #ffffff, --color-text-primary: #1a1a1a, --color-text-secondary: #6b7280, --color-border: #e5e7eb, --shadow-card, --spacing-section: 24px, --border-radius: 8px)

## 2. Design Sync

- [x] 2.1 [FE] Sync layout/components from Figma nodes — consult Figma MCP for visual structure of dashboard and sidebar using node-id links: node-id=1-38, node-id=1-3. All subsequent FE tasks must match Figma design (Live Design Mode in `/opsx:apply`)

## 3. Layout and Sidebar

- [x] 3.1 [FE] Create `Sidebar` component (`components/layout/Sidebar.tsx`) with collapsed/expanded states (72px/256px), FastReport logo (full text / isotipo), toggle button with ChevronBarLeft/ChevronBarRight icons, and 250ms CSS transition. Include data-testids: sidebar, sidebar-toggle
- [x] 3.2 [FE] Create navigation items in Sidebar: "Dashboard" (/dashboard, Speedometer2 icon) and "Companies" (/companies, Building icon) using react-bootstrap-icons. Active route highlighted with #5a6745 bg + white text, inactive with #6b7280 text, hover #f3f4f6. Include data-testids: nav-dashboard, nav-companies. Nav item min height 44px, padding 12px 16px, icon size 20px
- [x] 3.3 [FE] Create `MainLayout` component (`components/layout/MainLayout.tsx`) with Sidebar + content area using React Router `<Outlet />`. Sidebar state managed via useState (default: expanded). Content area adjusts width on sidebar toggle

## 4. Routing Restructure

- [x] 4.1 [FE] Update `App.tsx` to use nested routes: MainLayout as parent route wrapping /dashboard (DashboardPage) and /companies (CompaniesPage). Redirect `/` to `/dashboard`

## 5. Mock Data and Dashboard Hook

- [x] 5.1 [FE] Create `data/mockDashboardData.ts` with realistic example data: array of 10–15 mock companies (conforming to Company type), monthly profit evolution data (last 12 months), pre-computed KPI aggregates
- [x] 5.2 [FE] Create `hooks/useDashboardData.ts` custom hook that returns mock data (companies, KPI totals, monthly trends). Structured to swap in real API calls in a future iteration
- [x] 5.3 [FE] Create or extend `utils/format.ts` with `formatCurrency(value: number): string` (€ with 2 decimals, thousands sep) and `formatInteger(value: number): string` (thousands sep, no decimals)

## 6. Dashboard — KPI Cards

- [x] 6.1 [FE] Create `KpiCard` component (`components/dashboard/KpiCard.tsx`) with icon (react-bootstrap-icons), label, and formatted value. Card styling: shadow (0 1px 3px 0 rgba(0,0,0,0.1)), border-radius 8px, Bootstrap card base. Must match Figma design
- [x] 6.2 [FE] Render 5 KPI cards in DashboardPage: Total Revenue, Total Expenses, Net Profit, Total Employees, Total Clients. Include data-testids: kpi-total-revenue, kpi-total-expenses, kpi-net-profit, kpi-total-employees, kpi-total-clients

## 7. Dashboard — Charts

- [x] 7.1 [FE] Create `RevenueChart` component (`components/dashboard/RevenueChart.tsx`) — Recharts BarChart showing revenue per company. Primary color #5a6745, tooltips with company name + formatted revenue. Responsive within container
- [x] 7.2 [FE] Create `ProfitEvolutionChart` component (`components/dashboard/ProfitEvolutionChart.tsx`) — Recharts LineChart showing monthly profit trends (last 6–12 months). Primary color #5a6745, tooltips with month + formatted profit
- [x] 7.3 [FE] Create `ExpensesVsRevenueChart` component (`components/dashboard/ExpensesVsRevenueChart.tsx`) — Recharts grouped BarChart with revenue (#5a6745) and expenses (gray) per company. Tooltips with both values formatted
- [x] 7.4 [FE] Create `DistributionChart` component (`components/dashboard/DistributionChart.tsx`) — Recharts area or donut chart showing employee/client distribution per company. Tooltips with company name + value

## 8. Dashboard — Ranking Table

- [x] 8.1 [FE] Create `RankingTable` component (`components/dashboard/RankingTable.tsx`) — Bootstrap Table showing top 10 companies by net profit (descending). Columns: Position, Company Name, Revenue, Expenses, Profit. Financial values formatted with currency. First position row visually highlighted (distinct background or badge)

## 9. Dashboard Page Assembly

- [x] 9.1 [FE] Create `DashboardPage` (`pages/DashboardPage.tsx`) composing KPI cards, 4 charts, and ranking table in a grid layout with 24px section spacing. Include data-testid="dashboard-page". Must match Figma layout
- [x] 9.2 [FE] Implement empty state in DashboardPage: when no companies exist, show informative message ("No companies registered yet. Add your first company to see dashboard metrics.") and KPI cards with zero/dash values

## 10. Companies-UI Integration

- [x] 10.1 [FE] Verify CompaniesPage renders correctly inside MainLayout with sidebar (expanded and collapsed). Table adjusts width without overflow. No functional regression in CRUD operations

## 11. E2E Tests

- [x] 11.1 [E2E] Create Cypress test for sidebar navigation: verify sidebar renders on /dashboard and /companies, toggle collapse/expand works, navigation items route correctly, active state highlights correctly
- [x] 11.2 [E2E] Create Cypress test for dashboard page: verify KPI cards render with data-testids, charts render without errors, ranking table displays, empty state shows when no companies
- [x] 11.3 [E2E] Create Cypress test for routing: verify `/` redirects to `/dashboard`, `/companies` loads inside layout, sidebar persists across navigation

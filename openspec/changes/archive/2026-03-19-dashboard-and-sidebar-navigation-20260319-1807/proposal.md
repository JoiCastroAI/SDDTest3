## Why

Users managing multiple companies in FastReport must currently navigate to each company individually to assess financial and operational performance. There is no consolidated view showing KPIs, trends, or comparisons across all companies. Additionally, the application lacks a persistent navigation component — the current routing is flat with no sidebar, making it difficult to move between sections as the app grows.

## What Changes

- Add a **Dashboard page** as the new default landing page (`/dashboard`) with:
  - 5 KPI metric cards (Total Revenue, Total Expenses, Net Profit, Total Employees, Total Clients) computed from all companies
  - 4 interactive charts (Recharts): revenue distribution bar chart, profit evolution line chart, expenses vs revenue grouped bar chart, employee/client distribution area/donut chart
  - Top 10 companies ranking table sorted by net profit
  - Empty state handling when no companies exist
  - Mock/example data for demonstration
- Add a **collapsible sidebar** as the global navigation component across all pages:
  - Fixed left sidebar with expand/collapse toggle (256px / 72px)
  - Navigation items: Dashboard and Companies with icons and active-route highlighting
  - FastReport logo (full text expanded, isotipo collapsed)
  - Smooth 250ms CSS transition
- **Introduce a layout wrapper** (`MainLayout`) that wraps all routes with the sidebar
- **Change default route** from `/companies` to `/dashboard`
- **Add Recharts** as a new frontend dependency
- UI follows Figma designs — node-id links are available in `Design References` for implementation

## Capabilities

### New Capabilities
- `dashboard-view`: Dashboard page with KPI cards, interactive Recharts charts, ranking table, empty state, and mock data support
- `sidebar-navigation`: Collapsible sidebar layout component with route navigation, logo, toggle behavior, and active-route highlighting

### Modified Capabilities
- `companies-ui`: Default route changes from `/companies` to `/dashboard`; CompaniesPage will be wrapped in the new MainLayout with sidebar instead of rendering standalone

## Impact

- **Frontend code**: New pages, components, hooks, and layout wrapper; App.tsx routing restructured
- **Dependencies**: `recharts` added to `frontend/package.json`
- **Existing pages**: `CompaniesPage` wrapped in new `MainLayout` — visual change but no functional change to CRUD behavior
- **Routing**: `/` now redirects to `/dashboard` instead of `/companies`; `/companies` remains accessible via sidebar
- **No backend changes**: Dashboard computes aggregates from existing `GET /companies` API or uses mock data

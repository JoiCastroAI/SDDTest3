## Context

FastReport is a React 18 / TypeScript / Vite frontend using Bootstrap 5 (react-bootstrap), React Router v6, Axios, and React Context. The current app has a flat routing structure in `App.tsx` that redirects `/` to `/companies` with no layout wrapper or navigation component. The Companies section (CRUD) is fully implemented with pages, components, services, and types.

This change introduces two new frontend capabilities — a dashboard page and a collapsible sidebar — plus a layout wrapper that restructures how all pages are rendered. No backend changes are needed; the dashboard will compute aggregates from existing company data or use mock data.

## Goals / Non-Goals

**Goals:**
- Provide a consolidated dashboard view with KPIs, charts, and ranking across all companies
- Introduce a persistent collapsible sidebar for global navigation
- Wrap all existing and future pages in a shared layout component
- Add Recharts as a charting dependency
- Maintain all existing Companies CRUD functionality unchanged

**Non-Goals:**
- No backend API changes or new endpoints (aggregation is done client-side or via mock data)
- No mobile responsiveness (desktop only, min 1280px)
- No real-time data updates or WebSocket integration
- No user authentication or role-based dashboard filtering
- No "active/inactive" company status filtering (field does not exist in the data model)

## Decisions

### 1. Layout Architecture: MainLayout wrapper with Outlet

Introduce a `MainLayout` component that renders the `Sidebar` and a content area. Use React Router's `<Outlet />` for nested routes so all pages share the sidebar.

**Why**: This is the standard React Router v6 pattern for shared layouts. It avoids prop-drilling the sidebar state and keeps page components clean. The existing `CompaniesPage` requires zero changes — it simply renders inside the Outlet.

**Alternative considered**: Rendering the sidebar directly in `App.tsx` alongside routes. Rejected because it tightly couples navigation to the root component and makes testing/isolation harder.

### 2. Sidebar State: React useState with no persistence

The sidebar collapsed/expanded state will live in `MainLayout` as `useState(false)` (default: expanded). It persists during the session naturally (component stays mounted across route changes via Outlet). No localStorage needed.

**Why**: The enriched user story explicitly states "React state; no localStorage required." Keeping it simple avoids unnecessary complexity.

### 3. Dashboard Data: Mock data module with future API hook

Create a `mockDashboardData.ts` module exporting realistic example data for all charts, KPIs, and ranking. Create a `useDashboardData` hook that currently returns mock data but is structured to swap in real API calls (from `companyService`) in a future iteration.

**Why**: The user story accepts mock data for this phase. Structuring it behind a hook means the dashboard components don't need to change when real data is wired in. The existing `GET /companies` endpoint is paginated (max 100), so fetching all companies for aggregation is feasible but deferred.

### 4. Charting: Recharts (new dependency)

Add `recharts` to `frontend/package.json`. Each chart type gets its own component under `components/dashboard/`.

**Why**: Recharts is explicitly required by the user story. It's a well-maintained React charting library that integrates naturally with the component model. Each chart as a separate component follows the project's "one component per file" standard.

### 5. Styling: Bootstrap 5 utilities + custom CSS variables

Apply the design tokens (military green #5a6745, shadows, spacing, border-radius) via CSS custom properties in `index.css` and Bootstrap utility classes. Do NOT use Tailwind CSS or lucide-react — the project standard mandates Bootstrap 5 and react-bootstrap-icons.

**Why**: The enriched user story flagged a critical conflict — the original story specified Tailwind, but project standards require Bootstrap. Custom CSS properties bridge the gap between specific design tokens and Bootstrap's utility system.

### 6. Routing Restructure

Change `App.tsx` from flat routes to nested routes:
```
/              → redirect to /dashboard
/dashboard     → DashboardPage (inside MainLayout)
/companies     → CompaniesPage (inside MainLayout)
```

**Why**: The dashboard becomes the primary landing page per the user story. Nesting under MainLayout ensures all pages get the sidebar. The redirect from `/` to `/dashboard` replaces the current redirect to `/companies`.

## Risks / Trade-offs

- **[Risk] CompaniesPage visual regression** — Wrapping in MainLayout changes the available viewport width. → Mitigation: CompaniesPage already uses Bootstrap responsive utilities; the content area will flex to fill remaining space.

- **[Risk] Recharts bundle size** — Recharts adds ~150KB (gzipped ~45KB) to the frontend bundle. → Mitigation: Acceptable for a desktop-only SaaS. Tree-shaking via Vite reduces unused chart types. Can lazy-load the dashboard page if needed.

- **[Risk] Mock data divergence** — Mock data structure may drift from real API response shape over time. → Mitigation: Mock data uses the same `Company` type from `types/company.ts`, ensuring type-level alignment. The `useDashboardData` hook abstracts the data source.

- **[Trade-off] Client-side aggregation vs. backend endpoint** — Computing KPIs by fetching all companies client-side works for ≤100 companies but won't scale. → Accepted for this phase per user story constraints. A dedicated aggregation endpoint can be added later.

## Live Design Mode

This change is **design-linked**. Frontend implementation must consult Figma MCP at apply time to match the visual design for dashboard layout, KPI cards, charts placement, sidebar structure, and design tokens. Figma node references are available in the enriched user story's Design References section.

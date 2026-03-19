## MODIFIED Requirements

### Requirement: Companies page route
The application SHALL render a Companies page at the `/companies` route inside the MainLayout wrapper (with sidebar). The root route `/` SHALL redirect to `/dashboard` instead of `/companies`.

#### Scenario: Navigate to companies page
- **WHEN** the user navigates to `/companies`
- **THEN** the Companies page SHALL render inside the MainLayout with the sidebar visible, displaying a paginated table of companies fetched from `GET /companies`

#### Scenario: Root redirect changed
- **WHEN** the user navigates to `/`
- **THEN** the application SHALL redirect to `/dashboard` (not `/companies`)

### Requirement: Responsive layout
The companies table SHALL adapt within the MainLayout content area. The layout SHALL work correctly when the sidebar is expanded or collapsed.

#### Scenario: Table on small viewport
- **WHEN** the viewport width is less than 768px
- **THEN** the table layout SHALL adapt for mobile viewing per Figma design

#### Scenario: Table adapts to sidebar state
- **WHEN** the sidebar transitions between expanded and collapsed
- **THEN** the companies table SHALL adjust its width to fill the available content area without overflow

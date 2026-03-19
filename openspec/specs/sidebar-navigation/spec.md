## ADDED Requirements

### Requirement: Sidebar structure
The application SHALL render a fixed left sidebar on all pages via a MainLayout wrapper component. The sidebar SHALL have two states: expanded (256px) and collapsed (72px).

#### Scenario: Sidebar visible on all pages
- **WHEN** the user navigates to any route (/dashboard, /companies)
- **THEN** a fixed left sidebar SHALL be visible

#### Scenario: Sidebar expanded width
- **WHEN** the sidebar is in expanded state
- **THEN** its width SHALL be approximately 256px

#### Scenario: Sidebar collapsed width
- **WHEN** the sidebar is in collapsed state
- **THEN** its width SHALL be approximately 72px

### Requirement: FastReport logo
The sidebar SHALL display the FastReport logo at the top. When expanded, the full logo text "FastReport" SHALL be shown. When collapsed, only an isotipo/reduced version SHALL be displayed.

#### Scenario: Logo expanded state
- **WHEN** the sidebar is expanded
- **THEN** the logo area SHALL display the full text "FastReport"

#### Scenario: Logo collapsed state
- **WHEN** the sidebar is collapsed
- **THEN** the logo area SHALL display only a reduced isotipo or icon version

### Requirement: Navigation items
The sidebar SHALL display at minimum 2 navigation items: "Dashboard" (route: /dashboard) and "Companies" (route: /companies). Each item SHALL have a react-bootstrap-icon to the left of the label text.

#### Scenario: Navigation items rendered
- **WHEN** the sidebar renders
- **THEN** at minimum 2 navigation items SHALL be visible: "Dashboard" and "Companies"

#### Scenario: Navigation item icons
- **WHEN** navigation items render
- **THEN** each item SHALL display a react-bootstrap-icon (e.g., Speedometer2 for Dashboard, Building for Companies)

#### Scenario: Collapsed state hides text
- **WHEN** the sidebar is collapsed
- **THEN** navigation item labels SHALL be hidden and only icons SHALL remain visible

#### Scenario: Expanded state shows text and icon
- **WHEN** the sidebar is expanded
- **THEN** navigation items SHALL show both icon and label text

### Requirement: Active route highlighting
The navigation item corresponding to the current route SHALL be visually highlighted with a #5a6745 background and white text. Inactive items SHALL have gray text (#6b7280).

#### Scenario: Active item highlighted on dashboard
- **WHEN** the user is on the `/dashboard` route
- **THEN** the "Dashboard" nav item SHALL have background color #5a6745 and white (#ffffff) text
- **AND** the "Companies" nav item SHALL have gray text (#6b7280) and no active background

#### Scenario: Active item highlighted on companies
- **WHEN** the user is on the `/companies` route
- **THEN** the "Companies" nav item SHALL have background color #5a6745 and white text
- **AND** the "Dashboard" nav item SHALL be inactive

### Requirement: Navigation item hover state
Inactive navigation items SHALL display a hover background (#f3f4f6) when the user hovers over them.

#### Scenario: Hover on inactive item
- **WHEN** the user hovers over an inactive navigation item
- **THEN** the item background SHALL change to #f3f4f6

### Requirement: Toggle collapse/expand
The sidebar SHALL include a toggle button that collapses or expands the sidebar with a smooth CSS transition of 250ms.

#### Scenario: Toggle from expanded to collapsed
- **WHEN** the user clicks the toggle button while the sidebar is expanded
- **THEN** the sidebar SHALL animate to collapsed state (72px) over 250ms

#### Scenario: Toggle from collapsed to expanded
- **WHEN** the user clicks the toggle button while the sidebar is collapsed
- **THEN** the sidebar SHALL animate to expanded state (256px) over 250ms

#### Scenario: Toggle button icon
- **WHEN** the toggle button renders
- **THEN** it SHALL display an appropriate icon (e.g., ChevronBarLeft when expanded, ChevronBarRight when collapsed)

### Requirement: Content area adjustment
When the sidebar collapses or expands, the main content area SHALL adjust its width accordingly without layout breakage.

#### Scenario: Content expands on sidebar collapse
- **WHEN** the sidebar transitions from expanded to collapsed
- **THEN** the main content area SHALL expand to fill the freed space

#### Scenario: Content shrinks on sidebar expand
- **WHEN** the sidebar transitions from collapsed to expanded
- **THEN** the main content area SHALL shrink to accommodate the sidebar without overflow

### Requirement: Sidebar state persistence during session
The sidebar collapsed/expanded state SHALL persist during the browser session (React state). It SHALL NOT require localStorage.

#### Scenario: State persists across route navigation
- **WHEN** the user collapses the sidebar and navigates from /dashboard to /companies
- **THEN** the sidebar SHALL remain collapsed

### Requirement: Route navigation via sidebar
Clicking a navigation item SHALL navigate to the corresponding route using react-router without a full page reload.

#### Scenario: Navigate to dashboard
- **WHEN** the user clicks the "Dashboard" navigation item
- **THEN** the app SHALL navigate to /dashboard without a full page reload

#### Scenario: Navigate to companies
- **WHEN** the user clicks the "Companies" navigation item
- **THEN** the app SHALL navigate to /companies without a full page reload

### Requirement: Sidebar visual design
The sidebar SHALL follow the specified design tokens for background, borders, and sizing.

#### Scenario: Sidebar background and border
- **WHEN** the sidebar renders
- **THEN** the background SHALL be white (#ffffff) and there SHALL be a right border (1px solid #e5e7eb) or subtle shadow separating it from the content

#### Scenario: Navigation item sizing
- **WHEN** navigation items render
- **THEN** each item SHALL have a minimum height of 44px with padding of 12px 16px and icon size of 20px

#### Scenario: Toggle button sizing
- **WHEN** the toggle button renders
- **THEN** it SHALL have a minimum click area of 40x40px

### Requirement: Sidebar data-testid attributes
All sidebar interactive elements SHALL have `data-testid` attributes for Cypress e2e testing.

#### Scenario: Sidebar container has testid
- **WHEN** the sidebar renders
- **THEN** it SHALL have `data-testid="sidebar"`

#### Scenario: Toggle button has testid
- **WHEN** the toggle button renders
- **THEN** it SHALL have `data-testid="sidebar-toggle"`

#### Scenario: Navigation items have testids
- **WHEN** navigation items render
- **THEN** they SHALL have `data-testid="nav-dashboard"` and `data-testid="nav-companies"`

## Design References

Implementation MUST consult Figma MCP at apply time for sidebar visual layout:
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-t%C3%ADtulo?node-id=1-38&t=QcS1oj0KkCvF2TRB-0
- https://www.figma.com/design/GfsFFzSElzlbM9uhiNJ3jx/Sin-t%C3%ADtulo?node-id=1-3&t=QcS1oj0KkCvF2TRB-0

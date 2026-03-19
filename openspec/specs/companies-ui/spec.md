## ADDED Requirements

### Requirement: Companies page route
The application SHALL render a Companies page at the `/companies` route inside the MainLayout wrapper (with sidebar). The root route `/` SHALL redirect to `/dashboard` instead of `/companies`.

#### Scenario: Navigate to companies page
- **WHEN** the user navigates to `/companies`
- **THEN** the Companies page SHALL render inside the MainLayout with the sidebar visible, displaying a paginated table of companies fetched from `GET /companies`

#### Scenario: Root redirect changed
- **WHEN** the user navigates to `/`
- **THEN** the application SHALL redirect to `/dashboard` (not `/companies`)

### Requirement: Companies table columns
The companies table SHALL display columns matching the Figma design. Each row SHALL show company data with a selection checkbox.

#### Scenario: Table renders with correct columns
- **WHEN** the companies page loads with data
- **THEN** the table SHALL display columns for selection checkbox, name, industry, website, phone, address, and an actions column

#### Scenario: Table row displays company data
- **WHEN** a company exists with name="Acme Corp", industry="Technology"
- **THEN** the corresponding table row SHALL display "Acme Corp" and "Technology" in their respective columns

### Requirement: Bulk selection via checkboxes
The table SHALL include a header checkbox that selects/deselects all visible rows, and individual row checkboxes for per-item selection.

#### Scenario: Header checkbox selects all rows
- **WHEN** the user clicks the header checkbox while no rows are selected
- **THEN** all visible row checkboxes SHALL become checked

#### Scenario: Header checkbox deselects all rows
- **WHEN** the user clicks the header checkbox while all rows are selected
- **THEN** all visible row checkboxes SHALL become unchecked

#### Scenario: Individual row selection
- **WHEN** the user clicks a row's checkbox
- **THEN** that row SHALL become selected without affecting other rows

### Requirement: Bulk actions bar
When one or more rows are selected, a bulk actions bar SHALL appear with a "Delete" button.

#### Scenario: Bulk actions bar appears on selection
- **WHEN** the user selects one or more rows via checkboxes
- **THEN** a bulk actions bar SHALL appear showing the count of selected items and a "Delete" button

#### Scenario: Bulk actions bar hides when no selection
- **WHEN** the user deselects all rows
- **THEN** the bulk actions bar SHALL be hidden

### Requirement: Bulk delete with confirmation
Clicking the bulk "Delete" button SHALL show a confirmation dialog. On confirm, the system SHALL call the bulk delete API and refresh the table.

#### Scenario: Bulk delete with confirmation
- **WHEN** the user selects 3 companies and clicks the bulk "Delete" button
- **THEN** a confirmation dialog SHALL appear asking to confirm deletion of 3 companies

#### Scenario: Bulk delete confirmed
- **WHEN** the user confirms the bulk delete dialog
- **THEN** the system SHALL call `DELETE /companies` with the selected IDs, display a success message, and refresh the table

#### Scenario: Bulk delete cancelled
- **WHEN** the user cancels the bulk delete dialog
- **THEN** no API call SHALL be made and the selection SHALL remain unchanged

### Requirement: Create company modal
A "New Company" button SHALL open a creation modal with form fields for name (required), industry, website, phone, and address. Validation errors SHALL be displayed inline.

#### Scenario: Open create modal
- **WHEN** the user clicks the "New Company" button
- **THEN** a modal SHALL appear with empty form fields for name, industry, website, phone, and address

#### Scenario: Submit valid create form
- **WHEN** the user fills in name="Acme Corp" and clicks submit
- **THEN** the system SHALL call `POST /companies`, close the modal, display a success message, and refresh the table

#### Scenario: Submit create form without name
- **WHEN** the user attempts to submit the create form without entering a name
- **THEN** an inline validation error SHALL appear on the name field

#### Scenario: Create with duplicate name
- **WHEN** the user submits a create form and the API returns 409
- **THEN** an error message SHALL be displayed indicating the name already exists

### Requirement: Edit company modal
Clicking a row's edit action SHALL open an edit modal pre-populated with the company's current data. Save SHALL call the update API and refresh the table.

#### Scenario: Open edit modal
- **WHEN** the user clicks the edit action on a company row
- **THEN** a modal SHALL appear with form fields pre-populated with the company's current data

#### Scenario: Submit valid edit form
- **WHEN** the user modifies the company name and clicks save
- **THEN** the system SHALL call `PUT /companies/{id}`, close the modal, display a success message, and refresh the table

#### Scenario: Edit with conflicting name
- **WHEN** the user changes the name to one that already exists and the API returns 409
- **THEN** an error message SHALL be displayed indicating the name already exists

### Requirement: Empty state
When no companies exist, the page SHALL display an empty state matching the Figma empty state design.

#### Scenario: Empty state displayed
- **WHEN** the companies page loads and `GET /companies` returns items=[]
- **THEN** the page SHALL display the empty state view instead of the table

### Requirement: Pagination controls
Pagination controls SHALL appear at the bottom of the table with page navigation and a page size selector.

#### Scenario: Navigate to next page
- **WHEN** the user clicks the "next page" control
- **THEN** the table SHALL fetch and display the next page of companies

#### Scenario: Change page size
- **WHEN** the user selects a different page size from the selector
- **THEN** the table SHALL refetch data with the new page size and reset to page 1

#### Scenario: Pagination shows correct metadata
- **WHEN** there are 25 companies with page_size=10
- **THEN** the pagination controls SHALL indicate 3 total pages

### Requirement: Responsive layout
The companies table SHALL adapt within the MainLayout content area. The layout SHALL work correctly when the sidebar is expanded or collapsed.

#### Scenario: Table on small viewport
- **WHEN** the viewport width is less than 768px
- **THEN** the table layout SHALL adapt for mobile viewing per Figma design

#### Scenario: Table adapts to sidebar state
- **WHEN** the sidebar transitions between expanded and collapsed
- **THEN** the companies table SHALL adjust its width to fill the available content area without overflow

### Requirement: Loading and error states
All async operations (fetch, create, update, delete) SHALL display appropriate loading and error states.

#### Scenario: Loading state on initial fetch
- **WHEN** the companies page is loading data
- **THEN** a loading spinner SHALL be displayed

#### Scenario: Error state on fetch failure
- **WHEN** the `GET /companies` API call fails
- **THEN** an error alert SHALL be displayed with an appropriate error message

#### Scenario: Loading state on form submission
- **WHEN** the user submits a create or edit form
- **THEN** the submit button SHALL be disabled and show a loading indicator

### Requirement: Data-testid attributes
All interactive elements SHALL have `data-testid` attributes for Cypress e2e testing.

#### Scenario: Table has testid
- **WHEN** the companies table is rendered
- **THEN** it SHALL have `data-testid="companies-table"`

#### Scenario: Create button has testid
- **WHEN** the "New Company" button is rendered
- **THEN** it SHALL have `data-testid="create-company-btn"`

#### Scenario: Modal form fields have testids
- **WHEN** the create/edit modal is open
- **THEN** form fields SHALL have testids: `data-testid="company-name-input"`, `data-testid="company-industry-input"`, etc.

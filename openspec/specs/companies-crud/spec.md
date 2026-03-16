## ADDED Requirements

### Requirement: Company domain entity
The system SHALL define a `Company` domain entity as a Python dataclass with the following fields: `id` (UUID, auto-generated), `name` (str, required), `street` (str, optional), `city` (str, optional), `state` (str, optional), `zip_code` (str, optional), `country` (str, optional), `revenue` (Decimal, default 0), `expenses` (Decimal, default 0), `employees` (int, default 0), `clients` (int, default 0), `created_at` (datetime), `updated_at` (datetime). The entity SHALL expose a computed `profit` property that returns `revenue - expenses`.

#### Scenario: Company entity creation with all fields
- **WHEN** a Company entity is instantiated with name="Acme Corp", city="Seattle", state="WA", revenue=4100000, expenses=2800000, employees=89, clients=340
- **THEN** the entity SHALL have a UUID id, the provided field values, timestamps, and profit SHALL equal 1300000

#### Scenario: Company entity creation with required fields only
- **WHEN** a Company entity is instantiated with only name="Acme Corp"
- **THEN** the entity SHALL have a UUID id, name="Acme Corp", address fields as None, revenue=0, expenses=0, employees=0, clients=0, and profit=0

### Requirement: Companies database table
The system SHALL create a `companies` table in PostgreSQL via an Alembic migration with columns: `id` (UUID, PK, default uuid4), `name` (VARCHAR(255), NOT NULL, UNIQUE, indexed), `street` (VARCHAR(255), NULLABLE), `city` (VARCHAR(255), NULLABLE), `state` (VARCHAR(100), NULLABLE), `zip_code` (VARCHAR(20), NULLABLE), `country` (VARCHAR(100), NULLABLE), `revenue` (NUMERIC(15,2), NOT NULL, default 0), `expenses` (NUMERIC(15,2), NOT NULL, default 0), `employees` (INTEGER, NOT NULL, default 0), `clients` (INTEGER, NOT NULL, default 0), `created_at` (TIMESTAMPTZ, NOT NULL, default now()), `updated_at` (TIMESTAMPTZ, NOT NULL, default now(), auto-update on modification).

#### Scenario: Migration creates the companies table
- **WHEN** the Alembic migration is applied
- **THEN** the `companies` table SHALL exist with all specified columns and constraints

#### Scenario: Name uniqueness enforced at database level
- **WHEN** an INSERT is attempted with a name that already exists in the `companies` table
- **THEN** the database SHALL reject the operation with a unique constraint violation

### Requirement: List companies with pagination
The system SHALL provide a `GET /companies` endpoint that returns a paginated list of companies. Query parameters: `page` (int, default 1), `page_size` (int, default 10, max 100). The response SHALL include `items` (list of company objects with computed `profit`), `total` (total count), `page`, `page_size`, and `total_pages`.

#### Scenario: List companies with default pagination
- **WHEN** a GET request is made to `/companies` with no query params
- **THEN** the response status SHALL be 200 and the body SHALL contain up to 10 items with profit computed, page=1, page_size=10, and correct total/total_pages

#### Scenario: List companies with custom page size
- **WHEN** a GET request is made to `/companies?page=2&page_size=5`
- **THEN** the response SHALL return the second page of 5 items with correct pagination metadata

#### Scenario: List companies returns empty when none exist
- **WHEN** a GET request is made to `/companies` and no companies exist
- **THEN** the response status SHALL be 200 with items=[], total=0, total_pages=0

### Requirement: Get company by ID
The system SHALL provide a `GET /companies/{company_id}` endpoint that returns a single company by its UUID, including computed profit.

#### Scenario: Get existing company
- **WHEN** a GET request is made to `/companies/{company_id}` with a valid existing UUID
- **THEN** the response status SHALL be 200 with the full company object including computed profit

#### Scenario: Get non-existent company
- **WHEN** a GET request is made to `/companies/{company_id}` with a UUID that does not exist
- **THEN** the response status SHALL be 404 with detail "Company not found: {company_id}"

### Requirement: Create company
The system SHALL provide a `POST /companies` endpoint that creates a new company. The request body SHALL include `name` (required), `street`, `city`, `state`, `zip_code`, `country` (optional strings), `revenue`, `expenses` (optional decimals, default 0), `employees`, `clients` (optional ints, default 0).

#### Scenario: Create company with all fields
- **WHEN** a POST request is made to `/companies` with name="Acme Corp", city="Seattle", state="WA", revenue=4100000, expenses=2800000, employees=89, clients=340
- **THEN** the response status SHALL be 201 with the created company object including a generated UUID, timestamps, and profit=1300000

#### Scenario: Create company with name only
- **WHEN** a POST request is made to `/companies` with only name="Acme Corp"
- **THEN** the response status SHALL be 201 with address fields as null, financial fields as 0, and profit=0

#### Scenario: Create company with duplicate name
- **WHEN** a POST request is made to `/companies` with a name that already exists
- **THEN** the response status SHALL be 409 with detail "Company with name 'Acme Corp' already exists"

#### Scenario: Create company without name
- **WHEN** a POST request is made to `/companies` without a name field
- **THEN** the response status SHALL be 422 (Pydantic validation error)

### Requirement: Update company
The system SHALL provide a `PUT /companies/{company_id}` endpoint that updates an existing company.

#### Scenario: Update existing company
- **WHEN** a PUT request is made to `/companies/{company_id}` with valid data and an existing UUID
- **THEN** the response status SHALL be 200 with the updated company object, updated `updated_at` timestamp, and recomputed profit

#### Scenario: Update non-existent company
- **WHEN** a PUT request is made to `/companies/{company_id}` with a UUID that does not exist
- **THEN** the response status SHALL be 404 with detail "Company not found: {company_id}"

#### Scenario: Update company with conflicting name
- **WHEN** a PUT request is made with a name that belongs to another existing company
- **THEN** the response status SHALL be 409 with detail "Company with name '<name>' already exists"

### Requirement: Delete single company
The system SHALL provide a `DELETE /companies/{company_id}` endpoint that deletes a company by UUID.

#### Scenario: Delete existing company
- **WHEN** a DELETE request is made to `/companies/{company_id}` with an existing UUID
- **THEN** the response status SHALL be 204 with no body and the company SHALL no longer exist in the database

#### Scenario: Delete non-existent company
- **WHEN** a DELETE request is made to `/companies/{company_id}` with a UUID that does not exist
- **THEN** the response status SHALL be 404 with detail "Company not found: {company_id}"

### Requirement: Bulk delete companies
The system SHALL provide a `DELETE /companies` endpoint that accepts a request body with `ids` (list of UUIDs) and deletes all matching companies. The operation SHALL be idempotent — non-existent IDs are silently skipped.

#### Scenario: Bulk delete existing companies
- **WHEN** a DELETE request is made to `/companies` with ids containing 3 valid UUIDs
- **THEN** the response status SHALL be 204 and all 3 companies SHALL be deleted

#### Scenario: Bulk delete with some non-existent IDs
- **WHEN** a DELETE request is made to `/companies` with ids containing 2 existing and 1 non-existent UUID
- **THEN** the response status SHALL be 204 and only the 2 existing companies SHALL be deleted (no error for the missing one)

#### Scenario: Bulk delete with empty list
- **WHEN** a DELETE request is made to `/companies` with ids=[]
- **THEN** the response status SHALL be 204 with no deletions

### Requirement: Company API response format
All company endpoints SHALL return company objects in the following JSON format: `{id, name, street, city, state, zip_code, country, revenue, expenses, profit, employees, clients, created_at, updated_at}`. The `profit` field SHALL always be computed as `revenue - expenses`. All error responses SHALL use the format `{"detail": "<message>"}`.

#### Scenario: Successful response contains all fields including computed profit
- **WHEN** any company endpoint returns a company object with revenue=4100000 and expenses=2800000
- **THEN** the response SHALL include all 14 fields and profit SHALL equal 1300000

#### Scenario: Error response follows standard format
- **WHEN** any company endpoint returns an error
- **THEN** the response body SHALL be `{"detail": "<descriptive message>"}`

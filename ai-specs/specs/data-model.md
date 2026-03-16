# Data Model

## Companies

### Entity: Company

Domain entity representing a company in the system.

**Fields:**

| Field      | Type                     | Required | Default        | Description                          |
|------------|--------------------------|----------|----------------|--------------------------------------|
| id         | UUID                     | Yes      | Auto-generated | Primary key                          |
| name       | str                      | Yes      | —              | Company name (unique)                |
| street     | str                      | No       | null           | Street address                       |
| city       | str                      | No       | null           | City                                 |
| state      | str                      | No       | null           | State/Province                       |
| zip_code   | str                      | No       | null           | ZIP/Postal code                      |
| country    | str                      | No       | null           | Country                              |
| revenue    | Decimal(15,2)            | Yes      | 0              | Revenue amount                       |
| expenses   | Decimal(15,2)            | Yes      | 0              | Expenses amount                      |
| profit     | Decimal (computed)       | —        | —              | Computed: revenue - expenses         |
| employees  | int                      | Yes      | 0              | Number of employees                  |
| clients    | int                      | Yes      | 0              | Number of clients                    |
| created_at | datetime (UTC)           | Yes      | now()          | Creation timestamp                   |
| updated_at | datetime (UTC)           | Yes      | now()          | Last update timestamp (auto-update)  |

### Database Table: `companies`

| Column     | Type                     | Constraints                          |
|------------|--------------------------|--------------------------------------|
| id         | UUID                     | PK, default gen_random_uuid()        |
| name       | VARCHAR(255)             | NOT NULL, UNIQUE, indexed            |
| street     | VARCHAR(255)             | NULLABLE                             |
| city       | VARCHAR(255)             | NULLABLE                             |
| state      | VARCHAR(100)             | NULLABLE                             |
| zip_code   | VARCHAR(20)              | NULLABLE                             |
| country    | VARCHAR(100)             | NULLABLE                             |
| revenue    | NUMERIC(15,2)            | NOT NULL, default 0                  |
| expenses   | NUMERIC(15,2)            | NOT NULL, default 0                  |
| employees  | INTEGER                  | NOT NULL, default 0                  |
| clients    | INTEGER                  | NOT NULL, default 0                  |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, default now()              |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, default now(), auto-update |

**Notes:**
- `profit` is computed as `revenue - expenses` in the domain entity and API response. It is NOT stored in the database.
- `name` has a UNIQUE constraint enforced at both DB and application level.
- Index `ix_companies_name` on the `name` column for fast lookups.

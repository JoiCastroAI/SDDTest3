## ADDED Requirements

### Requirement: Seed script creates 20+ diverse companies
The system SHALL provide a standalone Python script at `backend/scripts/seed_companies.py` that inserts 20 or more companies into the database with realistic financial data.

#### Scenario: First-time seeding on empty database
- **WHEN** the seed script is executed against an empty database
- **THEN** 22 companies are created with distinct names, spanning at least 6 different industries
- **AND** each company has non-zero revenue, expenses, employees, and clients
- **AND** revenue values range from approximately $500K to $15M across the dataset
- **AND** expenses are between 55% and 85% of revenue for each company
- **AND** employee counts are proportional to company size (10–500 range)
- **AND** client counts vary realistically (50–2000 range)

#### Scenario: Idempotent re-run on populated database
- **WHEN** the seed script is executed and companies with matching names already exist
- **THEN** existing companies are skipped (not duplicated, not updated)
- **AND** only companies with new names are inserted
- **AND** the script completes without error

#### Scenario: Script uses existing infrastructure
- **WHEN** the seed script runs
- **THEN** it uses the existing SQLAlchemy session factory and CompanyModel
- **AND** it reads the database URL from the same configuration as the application
- **AND** no new dependencies are required

### Requirement: Seed data includes geographic diversity
The system SHALL seed companies with addresses spanning multiple countries and cities.

#### Scenario: Geographic distribution
- **WHEN** the seed data is examined
- **THEN** companies span at least 3 different countries
- **AND** no two companies share the same city

### Requirement: Seed script is executable via simple command
The system SHALL allow running the seed script with a single command.

#### Scenario: Direct Python execution
- **WHEN** a developer runs `python -m scripts.seed_companies` from the backend directory (or equivalent docker-compose exec command)
- **THEN** the script connects to the database, inserts seed data, and prints a summary of companies created vs. skipped

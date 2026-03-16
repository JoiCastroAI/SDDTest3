## 1. Backend — Domain Layer

- [x] 1.1 Create `Company` domain entity as a dataclass in `backend/app/domain/entities/company.py` with fields: id (UUID), name (str), industry (str|None), website (str|None), phone (str|None), address (str|None), created_at (datetime), updated_at (datetime)
- [x] 1.2 Create `CompanyRepository` abstract interface in `backend/app/domain/repositories/company_repository.py` with methods: get_by_id, get_all (paginated), save, update, delete, bulk_delete, get_by_name
- [x] 1.3 Add domain exceptions in `backend/app/domain/exceptions.py`: `CompanyNotFoundError`, `CompanyAlreadyExistsError`
- [x] 1.4 Write unit tests for Company entity in `backend/tests/unit/domain/test_company.py`

## 2. Backend — Infrastructure Layer

- [x] 2.1 Create `CompanyModel` SQLAlchemy ORM model in `backend/app/infrastructure/database/models/company.py` mapping to the `companies` table
- [x] 2.2 Create Alembic migration for the `companies` table with all columns and constraints (UNIQUE on name, indexes)
- [x] 2.3 Implement `SqlAlchemyCompanyRepository` in `backend/app/infrastructure/repositories/company_repository.py` with entity ↔ model mapping, pagination, and bulk delete

## 3. Backend — Application Layer

- [x] 3.1 Create Pydantic schemas in `backend/app/application/schemas/company.py`: `CreateCompanyRequest`, `UpdateCompanyRequest`, `CompanyResponse`, `PaginatedCompanyResponse`, `BulkDeleteRequest`
- [x] 3.2 Create use cases in `backend/app/application/use_cases/company_use_cases.py`: `ListCompaniesUseCase`, `GetCompanyUseCase`, `CreateCompanyUseCase`, `UpdateCompanyUseCase`, `DeleteCompanyUseCase`, `BulkDeleteCompaniesUseCase`
- [x] 3.3 Write unit tests for use cases in `backend/tests/unit/application/test_company_use_cases.py` (mocked repository, AAA pattern)

## 4. Backend — Presentation Layer

- [x] 4.1 Create companies router in `backend/app/api/routers/company_router.py` with all 5 endpoints (GET list, GET by id, POST, PUT, DELETE single, DELETE bulk)
- [x] 4.2 Register the companies router in `backend/app/main.py`
- [x] 4.3 Add exception handlers for `CompanyNotFoundError` (404) and `CompanyAlreadyExistsError` (409) in `backend/app/api/middleware.py`
- [x] 4.4 Write unit tests for router layer in `backend/tests/unit/api/test_company_router.py`

## 5. Backend — Integration Tests

- [x] 5.1 Add test fixtures for companies in `backend/tests/conftest.py` (async client, test DB session)
- [x] 5.2 Write integration tests in `backend/tests/integration/api/test_company_endpoints.py` covering all endpoints: list (pagination, empty), get by id (found, not found), create (success, duplicate, missing name), update (success, not found, conflict), delete (success, not found), bulk delete (all exist, some missing, empty list)

## 6. Backend — Documentation

- [x] 6.1 Update `ai-specs/specs/api-spec.yml` with all Companies endpoints (paths, request/response schemas, status codes)
- [x] 6.2 Create or update `ai-specs/specs/data-model.md` with the Companies entity definition and table schema

## 7. Frontend — Types and Service Layer

- [x] 7.1 Create Company types in `frontend/src/types/company.ts`: `Company`, `CreateCompanyPayload`, `UpdateCompanyPayload`, `PaginatedResponse<T>`, `BulkDeletePayload`
- [x] 7.2 Create shared Axios instance in `frontend/src/services/api.ts` with auth interceptors (if not already present)
- [x] 7.3 Create `companyService.ts` in `frontend/src/services/` with methods: getAll (paginated), getById, create, update, delete, bulkDelete

## 8. Frontend — Companies Page and Table

- [x] 8.1 Create `CompaniesPage.tsx` in `frontend/src/pages/` with loading, error, and empty states
- [x] 8.2 Create `CompaniesTable.tsx` in `frontend/src/components/companies/` with columns matching Figma, row checkboxes, header checkbox, and actions column
- [x] 8.3 Create `BulkActionsBar.tsx` in `frontend/src/components/companies/` showing selected count and Delete button
- [x] 8.4 Create `Pagination.tsx` in `frontend/src/components/common/` with page navigation and page size selector (or reuse if existing)

## 9. Frontend — Modals

- [x] 9.1 Create `CompanyFormModal.tsx` in `frontend/src/components/companies/` — shared modal for create and edit modes with form fields (name required, others optional), inline validation, loading state on submit
- [x] 9.2 Create `ConfirmDeleteModal.tsx` in `frontend/src/components/common/` for bulk delete confirmation dialog

## 10. Frontend — Routing and Integration

- [x] 10.1 Add `/companies` route in `frontend/src/App.tsx` rendering `CompaniesPage`
- [x] 10.2 Ensure all interactive elements have `data-testid` attributes per spec
- [x] 10.3 Verify responsive layout matches Figma on small viewports

## 11. Frontend — Cypress E2E Tests

- [x] 11.1 Create `cypress/e2e/companies.cy.ts` with tests for: list view renders, pagination navigation, create company via modal, edit company via modal, delete single company, bulk select and delete, empty state display, loading state, error state

# Enterprise ERP: Development Standards & Coding Guidelines

This document defines the engineering standards, code formatting styles, testing protocols, commit patterns, and layer separation rules for all developers working on the Enterprise Manufacturing ERP.

---

## 1. Code Style and Formatting Standards

To ensure code readability and maintainability across team members, the project enforces automated formatting checks.

### 1. Backend Code Style (Python)
*   **Style Guide:** PEP 8 compliance.
*   **Static Type Checking:** Static type hint annotations are mandatory for all function parameters and return values (enforced via `mypy`).
*   **Code Formatter:** Code must be formatted using `black` (line length limit: 88 characters).
*   **Import Sorting:** Imports must be sorted using `isort`.
*   *Incorrect (No typing, dirty imports):*
    ```python
    def calculate_cost(bom, qty):
        import sys
        return bom.cost * qty
    ```
*   *Correct (Typed, clean structure):*
    ```python
    from app.models.bom import BillOfMaterials

    def calculate_bom_cost(bom: BillOfMaterials, quantity: int) -> float:
        return float(bom.unit_cost * quantity)
    ```

### 2. Frontend Code Style (JavaScript/TypeScript/React)
*   **Formatter:** Enforced via `prettier` and `eslint` configurations.
*   **Naming Conventions:**
    *   React Components: PascalCase (e.g. `InventoryGrid.jsx`).
    *   Variables, Hooks, and Functions: camelCase (e.g. `const [isLoading, setIsLoading] = useState(false);`).
    *   Constants: UPPER_SNAKE_CASE (e.g. `const API_RETRY_LIMIT = 3;`).

---

## 2. Layer Separation & Code Decoupling Rules

Each module layer must operate inside its defined boundaries. Crossing boundaries (e.g. placing SQL logic inside a route controller) fails static analysis checks.

```text
[ Controller (API) ]  ──► Validates inputs/outputs using Pydantic schemas.
         │
         ▼
[ Service Layer ]     ──► Executes business validations & controls transactions.
         │
         ▼
[ Repository Layer ]  ──► Executes queries. Binds tenant filters. No business logic.
         │
         ▼
[ Database Model ]    ──► SQLAlchemy class declaration. Defines tables & indexes.
```

### The "No-Leakage" Rules:
1.  **No SQL in Controllers:** The API controller must only delegate to Services. It must not run `.query()` or call session `.commit()`.
2.  **No HTTP Concepts in Services:** Services and repositories must not reference FastAPI `Request` objects, fetch header tokens, or raise `HTTPException`. These are HTTP-specific constructs and belong exclusively in the Controller layer.
3.  **Use Pydantic schemas for Boundaries:** Database entities (SQLAlchemy models) must not be returned directly in API endpoints. They must map through Pydantic output schemas (e.g. `ItemResponse`) to filter database fields before output.

---

## 3. Git Workflow & Conventional Commits

We follow a structured Git branching and commit formatting methodology.

### 1. Branching Model (Git Flow)
*   `main`: Production-ready releases only.
*   `develop`: Integration branch for features.
*   `feature/{task_id}-{short-desc}`: Feature branch (e.g. `feature/mdm-102-bom-builder`).
*   `bugfix/{issue_id}-{short-desc}`: Defect resolution branch.

### 2. Commit Message Standard (Conventional Commits)
All commit messages must begin with a structured type tag followed by a task reference:
*   `feat(mdm-102): add bills of materials creation endpoint`
*   `fix(auth-55): resolve JWT token expiry parsing in middleware`
*   `test(inv-201): add unit tests for stock adjustments ledger`
*   `docs(core-10): update API architecture guidelines`

---

## 4. Testing & Test Coverage Requirements

The codebase operates under a test-driven development (TDD) target model.

### 1. Backend Testing Protocol (Pytest)
*   All unit and integration tests must run via `pytest`.
*   **Mocking External Calls:** Tests must never hit external online APIs (such as Gemini/OpenAI). Mock all external network interfaces using `unittest.mock`.
*   **Test Isolation:** Every test must run inside a transaction that rollback on completion to keep the test database clean.
*   **Minimum Target Coverage:** 80% code coverage.
    ```bash
    pytest --cov=app --cov-fail-under=80
    ```

---

## 5. Security & Secret Management

1.  **Zero Secrets in Source Code:** Configuration keys, database passwords, and API credentials must never be committed to repository files.
2.  **Environment Variable Injection:** Configurations must read from environments using Pydantic BaseSettings:
    ```python
    from pydantic import BaseSettings

    class Settings(BaseSettings):
        database_url: str
        jwt_secret_key: str
        gemini_api_key: str

        class Config:
            env_file = ".env"
    ```
3.  **Development Setup:** Dev configurations store keys inside a local, git-ignored `.env` file template (`.env.example`).

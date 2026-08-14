## Description
Provide a summary of the changes introduced in this Pull Request, including the relevant task reference.

## Type of Change
Please check the options that are relevant:
- [ ] `feat`: A new feature
- [ ] `fix`: A bug fix
- [ ] `refactor`: A code change that neither fixes a bug nor adds a feature
- [ ] `test`: Adding missing tests or correcting existing tests
- [ ] `docs`: Documentation only changes
- [ ] `chore`: Changes to the build process or auxiliary tools and libraries

## Conventional Commit Verification
Does your branch name and commit message match the guidelines?
*   Branch format: `feature/{task_id}-{desc}` or `bugfix/{issue_id}-{desc}`
*   Commit message format: `{type}({task_ref}): {description}`

## Verification and Testing
Explain the automated or manual tests performed to verify changes:
*   **Test Commands Run:**
*   **Coverage Target Met (>80%):** Yes / No
*   **Manual Verification Steps:**

## Checklist:
- [ ] Code follows the layered MVC architecture (no queries in controllers, no HTTP in services).
- [ ] MyPy static type checking passes on all functions.
- [ ] Code is formatted using `black` and sorted via `isort`.
- [ ] No secrets, API keys, or database passwords are hardcoded.
- [ ] Database migrations are created and tested (if schema changes exist).

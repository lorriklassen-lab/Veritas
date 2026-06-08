# Veritas — Code Workflow

## Branch Strategy
- `main` — production-ready code. Only merged via reviewed PRs.
- Feature branches named `feat/<short-description>` (e.g. `feat/stripe-integration`).
- Fix branches named `fix/<short-description>`.

## Process
1. Create a feature branch from `main`
2. Commit and push your work
3. Open a Pull Request to `main`
4. The lead reviews the PR and merges (squash merge)

## Before Pushing
- Backend: ensure `pip install -r requirements.txt` works
- Frontend: ensure `npm run build` succeeds (skip tsc if needed — vite build alone is sufficient)
- Update `.gitignore` to exclude `node_modules/`, `venv/`, `__pycache__/`, `.env`, `*.db`, `.DS_Store`

## First Commit
The initial commit pushes the full application to `main` directly since there's no existing code.
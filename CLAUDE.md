# strava-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-25

## Development Methodology

This project follows **[SpecKit](https://github.com/github/spec-kit) Specification-Driven Development (SDD)**. Every feature starts with a spec before any code is written.

### Terminology

- **Constitution** — the `tasks.md` file for a given feature spec. It is the authoritative list of all tasks, phases, and cross-cutting concerns for that feature. Always check `specs/<feature>/tasks.md` before starting or closing out work.
- **Spec** — the `spec.md` file defining user stories and acceptance criteria for a feature.
- **Plan** — the `plan.md` file describing the implementation approach.
- **Checklist** — files under `specs/<feature>/checklists/` used for requirements verification and manual testing sign-off.

### Feature specs live at

```text
specs/
  001-strava-oauth-login/
  002-athlete-profile/
  003-recent-activities/
  ...
```

Each spec folder contains: `spec.md`, `plan.md`, `tasks.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/`, and `checklists/`.

## Active Technologies

- TypeScript 5.x (strict mode) + Next.js 15 (App Router), NextAuth.js v5, Tailwind CSS (001-strava-oauth-login)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x (strict mode): Follow standard conventions

## Recent Changes

- 001-strava-oauth-login: Added TypeScript 5.x (strict mode) + Next.js 15 (App Router), NextAuth.js v5, Tailwind CSS

<!-- MANUAL ADDITIONS START -->
## PR Checklist

Before opening a PR, verify all Phase 5 tasks in the spec's `tasks.md` are complete. Phase 5 always includes cross-cutting concerns such as updating `README.md` — do not open a PR until every item is done.
<!-- MANUAL ADDITIONS END -->

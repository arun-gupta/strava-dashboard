# Strava Dashboard Constitution

## Core Principles

### I. Webapp-First
The application is a Next.js 15 webapp with TypeScript throughout. All features are delivered via web UI. No CLI tools or standalone libraries unless strictly necessary.

### II. Authentication via NextAuth.js
All Strava OAuth is handled exclusively through NextAuth.js with the Strava provider. Tokens are never exposed to the browser. Server components call the Strava API directly using server-side sessions.

### III. Test-First (NON-NEGOTIABLE)
TDD is mandatory: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. No feature code without a failing test first.

### IV. Testing Layers
- **Unit/Integration**: Vitest + Testing Library for components and API logic
- **E2E**: Playwright for full user flows (OAuth login, dashboard rendering)
- Strava API calls are mocked in unit tests; real API used only in E2E against a test athlete account

### V. Simplicity
Start simple, YAGNI principles. One Next.js repo (no monorepo). Use Next.js API routes for backend logic. Avoid premature abstraction.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript (strict mode)
- **Auth**: NextAuth.js with Strava OAuth provider
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Vercel

## Development Workflow

- Feature branches off `main`, merged via PR
- Every PR must include tests
- All tests must pass before merge
- Strava API credentials stored in `.env.local`, never committed
- `.env.example` committed with placeholder values
- `README.md` features list MUST be updated in every spec's Polish phase to reflect the newly completed feature — no spec is considered done until README is current

## Governance

This constitution supersedes all other practices. All implementation decisions must align with these principles. Complexity must be justified. Amendments require updating this file with a new version and date.

**Version**: 1.1.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-25

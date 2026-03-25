# Development Guide

## Running Tests

```bash
# Unit and integration tests
npm run test

# E2E tests
npm run test:e2e
```

## Project Structure

```
strava-dashboard/
├── app/
│   ├── api/auth/         # NextAuth.js route handler
│   ├── dashboard/        # Protected dashboard page
│   ├── layout.tsx        # Root layout with SessionProvider
│   └── page.tsx          # Landing page
├── components/
│   ├── athlete/          # AthleteProfileCard, AthleteStatsCard, AthleteProfileSkeleton
│   ├── auth/             # LoginButton, LogoutButton
│   └── ui/               # ErrorMessage, AuthErrorBoundary
├── lib/
│   ├── auth.ts           # NextAuth.js config, Strava provider, token refresh
│   ├── strava.ts         # Strava API client (fetchAthleteProfile, fetchAthleteStats)
│   └── utils/
│       └── format.ts     # formatDistance, formatElapsedTime
├── specs/                # SpecKit SDD specs, plans, and tasks
├── tests/
│   ├── unit/             # Vitest unit tests
│   └── e2e/              # Playwright e2e tests
└── proxy.ts              # Route protection (Next.js 16 Proxy)
```

## Workflow

This project follows [SpecKit](https://github.com/github/spec-kit) Specification-Driven Development (SDD):

1. Write a spec (`/speckit.specify`)
2. Plan the implementation (`/speckit.plan`)
3. Break into tasks (`/speckit.tasks`)
4. Implement test-first (`/speckit.implement`)
5. Sign off the manual testing checklist before opening a PR

All specs live in `specs/` — each feature has its own directory with a spec, plan, tasks, contracts, and checklists.

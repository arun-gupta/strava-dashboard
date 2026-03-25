# Implementation Plan: Athlete Profile

**Branch**: `002-athlete-profile` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-athlete-profile/spec.md`

## Summary

Fetch and display the authenticated athlete's Strava profile (photo, name, location) and all-time running stats (run count, distance, elapsed time) on the dashboard. Data is fetched server-side using the session access token. Loading is handled via React Suspense with a skeleton UI; errors are surfaced via a Next.js `error.tsx` boundary.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 15+ (App Router, Server Components), NextAuth.js v5, Tailwind CSS
**Storage**: N/A — no persistence; data fetched live from Strava API on each load
**Testing**: Vitest + React Testing Library (unit), Playwright (e2e)
**Target Platform**: Web browser (desktop + mobile), deployed on Vercel
**Project Type**: Web application (feature addition to existing Next.js app)
**Performance Goals**: Profile + stats load within 2 seconds (SC-001)
**Constraints**: Strava access token from session; `cache: "no-store"` per v1 spec assumption; token never exposed to browser
**Scale/Scope**: Single authenticated athlete; personal dashboard

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Webapp-First (Next.js, TypeScript) | ✅ Pass | Server Components, App Router, TypeScript strict mode |
| Auth via NextAuth.js | ✅ Pass | Access token sourced from NextAuth.js session; no custom token handling |
| Test-First (TDD) | ✅ Pass | Tests written before implementation per tasks.md |
| Testing Layers (Vitest + Playwright) | ✅ Pass | Unit tests for components + utilities; e2e for full render |
| Simplicity (one repo, no premature abstraction) | ✅ Pass | No new infrastructure; Strava calls in `lib/strava.ts`; no API routes |

**Constitution Check Result**: ✅ All gates pass — proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/002-athlete-profile/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── strava-api.md    # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
app/dashboard/
└── page.tsx                          # UPDATE: wrap profile+stats in Suspense

app/dashboard/
└── error.tsx                         # NEW: friendly error boundary for dashboard

components/athlete/
├── AthleteProfileCard.tsx            # NEW: async Server Component — photo, name, location
├── AthleteStatsCard.tsx              # NEW: async Server Component — run count, distance, time
└── AthleteProfileSkeleton.tsx        # NEW: Client Component — loading skeleton

lib/
└── strava.ts                         # NEW: fetchAthleteProfile(), fetchAthleteStats()

lib/utils/
└── format.ts                         # NEW: formatDistance(), formatElapsedTime()

tests/unit/
├── components/
│   ├── AthleteProfileCard.test.tsx   # NEW
│   └── AthleteStatsCard.test.tsx     # NEW
└── utils/
    └── format.test.ts                # NEW (pure function tests — no mocks needed)
```

**Structure Decision**: Single Next.js App Router project. All Strava API calls centralized in `lib/strava.ts`. Components are async Server Components — no client-side data fetching. Loading state via Suspense + skeleton. Error state via `app/dashboard/error.tsx`.

## Implementation Phases

### Phase 1 — Formatting Utilities (TDD)
Write `format.test.ts` first. Implement `lib/utils/format.ts` to make tests pass.
Pure functions — no mocks, no framework dependencies.

### Phase 2 — Strava API Layer (TDD)
Write tests for `lib/strava.ts` with mocked `fetch`. Implement `fetchAthleteProfile()` and `fetchAthleteStats()`.

### Phase 3 — Components (TDD)
Write `AthleteProfileCard.test.tsx` and `AthleteStatsCard.test.tsx` first.
Implement components as async Server Components.
Implement `AthleteProfileSkeleton.tsx` for the Suspense fallback.

### Phase 4 — Dashboard Integration
Update `app/dashboard/page.tsx` to include the profile and stats cards wrapped in `<Suspense>`.
Create `app/dashboard/error.tsx` for the error boundary.

### Phase 5 — Polish
- Verify README.md features list is updated
- Sign off `checklists/manual-testing.md` after manual testing with real Strava credentials

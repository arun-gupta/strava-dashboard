# Implementation Plan: Recent Activities

**Branch**: `003-recent-activities` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-recent-activities/spec.md`

## Summary

Fetch and display the authenticated athlete's 10 most recent Strava activities on the dashboard. Each row shows an activity-type icon, name, date, distance, elapsed time, and pace. Data is fetched server-side. Loading is handled via React Suspense with a skeleton; empty and error states are handled inline and via the existing `error.tsx` boundary.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 15+ (App Router, Server Components), NextAuth.js v5, Tailwind CSS, `react-icons` (Font Awesome 6)
**Storage**: N/A — no persistence; data fetched live from Strava API on each load
**Testing**: Vitest + React Testing Library (unit), Playwright (e2e)
**Target Platform**: Web browser (desktop + mobile), deployed on Vercel
**Project Type**: Web application (feature addition to existing Next.js app)
**Performance Goals**: Activities list loads within 3 seconds (SC-001)
**Constraints**: Strava access token from session; `cache: "no-store"`; token never exposed to browser
**Scale/Scope**: Single authenticated athlete; 10 most recent activities

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Webapp-First (Next.js, TypeScript) | ✅ Pass | Server Components, App Router, TypeScript strict mode |
| Auth via NextAuth.js | ✅ Pass | Access token sourced from NextAuth.js session |
| Test-First (TDD) | ✅ Pass | Tests written before implementation per tasks.md |
| Testing Layers (Vitest + Playwright) | ✅ Pass | Unit tests for components + utilities; e2e for full render |
| Simplicity (one repo, no premature abstraction) | ✅ Pass | One new dependency (`react-icons`); reuses existing utilities |

**Constitution Check Result**: ✅ All gates pass — proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/003-recent-activities/
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
components/activities/
├── RecentActivitiesList.tsx       # NEW: async Server Component — fetches + renders list
├── ActivityRow.tsx                # NEW: single activity row (icon, name, type, date, distance, time, pace)
└── ActivitiesSkeleton.tsx         # NEW: loading skeleton (10 placeholder rows)

lib/utils/
├── format.ts                      # EXISTING: reuse formatDistance, formatElapsedTime
└── activity.ts                    # NEW: getActivityMeta(), formatPace(), formatDate()

lib/strava.ts                      # UPDATE: add fetchRecentActivities()

app/dashboard/page.tsx             # UPDATE: add RecentActivitiesList in Suspense
app/dashboard/error.tsx            # EXISTING: catches API errors (no changes needed)

tests/unit/
├── components/
│   ├── RecentActivitiesList.test.tsx
│   └── ActivityRow.test.tsx
└── utils/
    └── activity.test.ts
```

**Structure Decision**: Follows the same Server Component + Suspense pattern established in spec 002. Activity-specific components in `components/activities/`. Utilities co-located in `lib/utils/activity.ts`.

## Implementation Phases

### Phase 1 — Activity Utilities (TDD)
Write `activity.test.ts` first. Implement `lib/utils/activity.ts`:
- `getActivityMeta(sportType)` → `{ icon, label }`
- `formatPace(elapsedSeconds, distanceMetres)` → `"M:SS /km"` or `null`
- `formatDate(isoString)` → `"25 Mar 2026"`

### Phase 2 — Strava API Layer (TDD)
Extend `lib/strava.ts` with `fetchRecentActivities(accessToken)`. Write test first with mocked `fetch`.

### Phase 3 — Components (TDD)
Write `ActivityRow.test.tsx` and `RecentActivitiesList.test.tsx` first.
Implement `ActivityRow`, `RecentActivitiesList`, and `ActivitiesSkeleton`.

### Phase 4 — Dashboard Integration
Update `app/dashboard/page.tsx` to include `<RecentActivitiesList>` wrapped in `<Suspense>`.

### Phase 5 — Polish
- Install `react-icons` and verify icons render correctly
- Verify README features list is updated
- Sign off `checklists/manual-testing.md`

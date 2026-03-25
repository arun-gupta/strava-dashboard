# Quickstart: Recent Activities

**Branch**: `003-recent-activities` | **Date**: 2026-03-25

## Prerequisites

- Specs 001 and 002 complete and merged
- `.env.local` has `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `NEXTAUTH_SECRET`
- `npm run dev` starts without errors

## New Dependency

```bash
npm install react-icons
```

## New Files for This Feature

```text
components/activities/
├── RecentActivitiesList.tsx       # NEW: async Server Component — activity list
├── ActivityRow.tsx                # NEW: single activity row with icon, name, stats
└── ActivitiesSkeleton.tsx         # NEW: loading skeleton for the list

lib/
└── utils/
    └── activity.ts                # NEW: sport type → icon + label mapping, formatPace(), formatDate()

lib/strava.ts                      # UPDATE: add fetchRecentActivities()

tests/unit/
├── components/
│   ├── RecentActivitiesList.test.tsx  # NEW
│   └── ActivityRow.test.tsx           # NEW
└── utils/
    └── activity.test.ts               # NEW
```

## Running Tests

```bash
npm test           # unit tests (Vitest)
npm run test:e2e   # e2e tests (Playwright)
```

## Key Patterns Used

- **Server Component + Suspense**: `app/dashboard/page.tsx` wraps `<RecentActivitiesList>` in `<Suspense fallback={<ActivitiesSkeleton />}>`. The component is `async` and calls `lib/strava.ts` directly.
- **Reuse**: `formatDistance()` and `formatElapsedTime()` from `lib/utils/format.ts` (spec 002) — no duplication.
- **Icon mapping**: `lib/utils/activity.ts` exports a `getActivityMeta(sportType)` function returning `{ icon, label }`. Unknown types fall back to a generic icon and CamelCase-split label.
- **Empty state**: Handled inline in `RecentActivitiesList` — if the API returns `[]`, render the empty state component instead of a list.
- **Error boundary**: Existing `app/dashboard/error.tsx` (spec 002) catches thrown errors from the activities fetch.

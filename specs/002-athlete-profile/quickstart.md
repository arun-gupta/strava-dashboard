# Quickstart: Athlete Profile

**Branch**: `002-athlete-profile` | **Date**: 2026-03-25

## Prerequisites

- Spec 001 complete and merged — authentication works, `athleteId` is in the session
- `.env.local` has `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `NEXTAUTH_SECRET`
- `npm run dev` starts without errors

## New Files for This Feature

```text
app/dashboard/
└── page.tsx                          # UPDATE: add AthleteProfileCard + Suspense

components/athlete/
├── AthleteProfileCard.tsx            # NEW: profile photo, name, location
├── AthleteStatsCard.tsx              # NEW: run count, distance, time
└── AthleteProfileSkeleton.tsx        # NEW: loading skeleton

lib/
└── strava.ts                         # NEW: fetchAthleteProfile(), fetchAthleteStats()

lib/utils/
└── format.ts                         # NEW: formatDistance(), formatElapsedTime()

tests/unit/
├── components/
│   ├── AthleteProfileCard.test.tsx   # NEW
│   └── AthleteStatsCard.test.tsx     # NEW
└── utils/
    └── format.test.ts                # NEW
```

## Running Tests

```bash
npm test                  # unit tests (Vitest)
npm run test:e2e          # e2e tests (Playwright)
```

## Key Patterns Used

- **Server Component + Suspense**: `app/dashboard/page.tsx` wraps `<AthleteProfileCard>` in `<Suspense fallback={<AthleteProfileSkeleton />}>`. The component is `async` and calls `lib/strava.ts` directly.
- **No API routes**: `lib/strava.ts` is called server-side only. The Strava access token never leaves the server.
- **Error boundary**: `app/dashboard/error.tsx` catches thrown errors from Strava API calls.
- **Formatting utilities**: `lib/utils/format.ts` contains pure functions — easy to unit-test in isolation.

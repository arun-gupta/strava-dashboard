# Quickstart: Activity Filtering and Search

**Branch**: `004-activity-filter-search`

## Prerequisites

- Completed specs 001, 002, 003 (OAuth, athlete profile, recent activities)
- `.env.local` configured with Strava credentials and NextAuth secret
- At least 2 different activity types in your Strava account (e.g. a Run and a Ride) for meaningful filter testing

## Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and sign in with Strava. The dashboard will show the filter panel above the activity list.

## Run Tests

```bash
# Unit tests (filter utilities + components)
npm test

# Watch mode during development
npm run test:watch

# E2E (requires dev server running)
npx playwright test
```

## Test the Filters Manually

1. **Type filter** — select one or more activity type buttons; verify the list updates instantly
2. **Search (fuzzy)** — type a partial word from an activity name; verify partial matches appear
3. **Search (exact)** — toggle to exact match; verify only activities containing the exact string appear
4. **Date range** — set a start date after your oldest activity; verify older activities disappear
5. **Combined** — apply type filter + search + date range simultaneously; verify all conditions apply
6. **Empty state** — filter to a combination with no results; verify the empty state message appears
7. **Clear** — remove all filters one by one; verify the full list of 10 restores

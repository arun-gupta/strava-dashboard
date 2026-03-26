# Implementation Plan: Activity Filtering and Search

**Branch**: `004-activity-filter-search` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)

## Summary

Add client-side filtering and search to the recent activities list on the dashboard. Athletes can filter by activity type (multi-select), search by name (fuzzy/exact toggle), and filter by date range. All filtering operates on the 10 already-fetched activities with no additional API calls. Filter state lives in a new `ActivityFilterPanel` Client Component; the Strava fetch stays server-side in `RecentActivitiesList`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16, React 19, Tailwind CSS, react-icons
**Storage**: N/A — client-side state only, no persistence
**Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web (Next.js App Router)
**Project Type**: Web application
**Performance Goals**: Filter results update within 100ms of any user input
**Constraints**: No new runtime dependencies. No additional Strava API calls. Filters reset on page reload.
**Scale/Scope**: Max 10 activities in the list at all times

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Webapp-First | PASS | Next.js Client Component for interactivity, Server Component for data fetching |
| II. Auth via NextAuth.js | PASS | Token stays server-side in `RecentActivitiesList`; `ActivityFilterPanel` receives plain data |
| III. Test-First | PASS | All filter logic and components will follow Red-Green-Refactor |
| IV. Testing Layers | PASS | Unit tests for filter utilities and components; E2E for full filter flow |
| V. Simplicity | PASS | No new dependencies; `useState` for state; native `<input type="date">` |

**Gate**: PASS — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-activity-filter-search/
├── plan.md              ← this file
├── research.md          ← decisions on fuzzy search, state, date input, architecture
├── data-model.md        ← ActivityFilter entity, filter logic, type options
├── quickstart.md        ← how to run and test locally
├── contracts/           ← N/A (no new external interfaces)
└── tasks.md             ← created by /speckit.tasks
```

### Source Code

```text
components/activities/
├── ActivityFilterPanel.tsx     # NEW — 'use client', owns filter state, renders controls + filtered list
├── ActivityRow.tsx             # EXISTING — unchanged
├── ActivitiesSkeleton.tsx      # EXISTING — unchanged
└── RecentActivitiesList.tsx    # EXISTING — passes activities array to ActivityFilterPanel

lib/utils/
├── filter.ts                   # NEW — pure filter/search functions (testable in isolation)
└── activity.ts                 # EXISTING — getActivityMeta(), formatters

tests/unit/
├── utils/filter.test.ts        # NEW — unit tests for all filter logic
└── components/
    └── ActivityFilterPanel.test.tsx  # NEW — component tests for filter UI
```

## Component Architecture

```
RecentActivitiesList (Server Component)
  └── fetches activities from Strava (server-side, token never leaves server)
  └── ActivityFilterPanel (Client Component — 'use client')
        └── owns: types[], searchQuery, matchMode, startDate, endDate state
        └── renders: type toggle buttons, search input + toggle, date range inputs
        └── applies: filterActivities() from lib/utils/filter.ts
        └── ActivityRow[] (renders filtered list)
        └── EmptyState (renders when filtered list is empty)
```

## Implementation Phases

### Phase 1 — Filter Utility (foundational, no UI)
Pure functions in `lib/utils/filter.ts`:
- `filterByType(activities, types)` — returns activities matching any selected type
- `filterBySearch(activities, query, mode)` — fuzzy or exact name match
- `filterByDateRange(activities, startDate, endDate)` — inclusive date range
- `filterActivities(activities, filter)` — composes all three, AND logic

### Phase 2 — US1: Type Filter UI
`ActivityFilterPanel` renders type toggle buttons derived from the activity list. Selecting/deselecting updates `types` state and re-filters the list in real time.

### Phase 3 — US2: Search UI
Search input + fuzzy/exact toggle rendered in `ActivityFilterPanel`. Typing updates `searchQuery`; toggle updates `matchMode`.

### Phase 4 — US3 + US4: Date Range + Combined
Start/end date inputs. Validation hint when start > end. All four filter conditions composed simultaneously via `filterActivities()`.

### Phase 5 — Polish
- Activity count indicator ("3 of 10 activities")
- Empty state component
- Manual testing checklist sign-off
- README.md update

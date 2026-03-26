# Implementation Plan: Activity Trends Chart

**Branch**: `005-activity-trends-chart` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)

## Summary

Add two visualisation cards to the dashboard: a composed bar + trend line chart showing weekly/monthly distance over time, and a heatmap calendar showing training consistency by day. Both derive data from the existing 10 fetched activities — no additional API calls. Chart state (grouping toggle, type filter) lives in a new `ActivityTrendsChart` Client Component. The heatmap lives in a separate `ActivityHeatmap` Client Component. Pure data-transformation utilities go in `lib/utils/trends.ts` for testability.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16, React 19, Recharts (already installed), Tailwind CSS
**Storage**: N/A — client-side state only, no persistence
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (Next.js App Router)
**Project Type**: Web application
**Performance Goals**: Toggle re-render under 100ms (client-side only, no network)
**Constraints**: No new runtime dependencies. No additional Strava API calls. State resets on page reload.
**Scale/Scope**: Max 10 activities at all times

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Webapp-First | PASS | Next.js Client Components for interactivity, Server Component for data fetching |
| II. Auth via NextAuth.js | PASS | Token stays server-side in `RecentActivitiesList`; chart components receive plain data |
| III. Test-First | PASS | All utility functions and components follow Red-Green-Refactor |
| IV. Testing Layers | PASS | Unit tests for trend utilities and components; E2E for full dashboard rendering |
| V. Simplicity | PASS | No new dependencies; CSS grid for heatmap; Recharts ComposedChart for bar+line |

**Gate**: PASS — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/005-activity-trends-chart/
├── plan.md              ← this file
├── research.md          ← decisions on chart library, heatmap, architecture
├── data-model.md        ← TrendPeriod, TrendFilter, HeatmapDay entities
├── quickstart.md        ← how to run and test locally
└── tasks.md             ← created by /speckit.tasks
```

### Source Code

```text
components/activities/
├── ActivityTrendsChart.tsx     # NEW — 'use client', owns grouping toggle + type filter state
├── ActivityHeatmap.tsx         # NEW — 'use client', renders heatmap grid
├── ActivityFilterPanel.tsx     # EXISTING — unchanged
├── ActivityRow.tsx             # EXISTING — unchanged
├── ActivitiesSkeleton.tsx      # EXISTING — unchanged
└── RecentActivitiesList.tsx    # EXISTING — passes activities to ActivityTrendsChart

lib/utils/
├── trends.ts                   # NEW — groupByWeek, groupByMonth, buildHeatmap
└── filter.ts                   # EXISTING — unchanged

tests/unit/
├── utils/trends.test.ts        # NEW — unit tests for all trend utility functions
└── components/
    ├── ActivityTrendsChart.test.tsx   # NEW — component tests for chart UI
    └── ActivityHeatmap.test.tsx       # NEW — component tests for heatmap
```

## Component Architecture

```
RecentActivitiesList (Server Component)
  └── fetches activities from Strava (server-side)
  └── ActivityFilterPanel (existing Client Component)
        └── filtered activity list
  └── ActivityTrendsChart (new Client Component — 'use client')
        └── owns: grouping ('weekly'|'monthly'), activityType state
        └── renders: toggle buttons, type filter, total summary, ComposedChart
        └── uses: groupByWeek / groupByMonth from lib/utils/trends.ts
  └── ActivityHeatmap (new Client Component — 'use client')
        └── renders: CSS grid of day cells with Tailwind intensity colours
        └── renders: tooltip on hover (date + elapsed time)
        └── uses: buildHeatmap from lib/utils/trends.ts
```

## Implementation Phases

### Phase 1 — Trend Utility Functions (foundational, no UI)

Pure functions in `lib/utils/trends.ts`:
- `groupByWeek(activities, typeFilter?)` → `TrendPeriod[]` — groups by ISO week (Monday start), fills gaps with zero-distance periods
- `groupByMonth(activities, typeFilter?)` → `TrendPeriod[]` — groups by calendar month, fills gaps with zero periods
- `buildHeatmap(activities)` → `HeatmapDay[]` — one entry per calendar day from earliest to latest activity date; sums elapsed time per day

### Phase 2 — US1: Weekly Distance Chart with Trend Line

`ActivityTrendsChart` renders a Recharts `ComposedChart` with:
- `Bar` for distance per period, orange fill
- `Line` for trend line connecting bar midpoints, dashed
- `LabelList` on bars showing distance (km) above non-zero bars
- Total distance summary in the card header

### Phase 3 — US2: Monthly Toggle

Add weekly/monthly toggle buttons to `ActivityTrendsChart`. Clicking switches between `groupByWeek` and `groupByMonth`. Chart re-renders immediately.

### Phase 4 — US3 + US4: Type Filter + Heatmap

- **US3**: Add activity type filter to `ActivityTrendsChart` — single-select dropdown or buttons derived from unique types in the activity list. Passes type to `groupByWeek`/`groupByMonth`.
- **US4**: `ActivityHeatmap` component — CSS grid, one cell per day, 4 intensity levels based on elapsed time relative to daily max. Tooltip on hover.

### Phase 5 — Polish

- Empty state for chart when no activities
- Responsive layout (Tailwind grid)
- `README.md` update
- Manual testing checklist sign-off

# Research: Activity Trends Chart

**Branch**: `005-activity-trends-chart`
**Date**: 2026-03-26

## Decision 1: Recharts component for composed bar + line chart

**Decision**: Use `ComposedChart` from Recharts with `Bar`, `Line`, and `LabelList` components.

**Rationale**: Recharts is already in the stack (constitution-approved). `ComposedChart` is the native Recharts solution for overlaying multiple chart types. `LabelList` renders value labels above bars with `position="top"`. No new dependency required.

**Alternatives considered**:
- Custom SVG: more control but significantly more code for no gain
- Chart.js: not in the stack, would violate the no-new-dependencies constraint
- D3: same problem, and far more complex for this use case

---

## Decision 2: Heatmap implementation — CSS grid, no library

**Decision**: Implement the heatmap as a responsive CSS grid using Tailwind utility classes for intensity colouring. No chart library used for the heatmap.

**Rationale**: Recharts has no native heatmap component. A CSS grid of `<div>` cells with Tailwind background colour classes (`bg-orange-100` through `bg-orange-600`) is simpler, more performant, and requires no new dependency. Intensity buckets (0, low, medium, high) map cleanly to 4 colour levels derived from the max elapsed time in the dataset.

**Alternatives considered**:
- `react-calendar-heatmap`: adds a dependency for a component we can build in ~50 lines
- Recharts custom shape: overly complex for a grid layout
- SVG grid: works but Tailwind grid is simpler and responsive by default

---

## Decision 3: Architecture — extend RecentActivitiesList

**Decision**: `RecentActivitiesList` (Server Component) passes the fetched activities array to both `ActivityFilterPanel` (existing) and new `ActivityTrendsChart` (new client component). No additional API call.

**Rationale**: Activities are already fetched once in `RecentActivitiesList`. Passing them to a second client component is the minimal change — no new server component, no second API call, no prop-drilling through the dashboard page.

**Alternatives considered**:
- Fetch activities again in a separate `ActivityTrendsSection` server component: violates the no-additional-API-calls constraint
- Move fetch to `dashboard/page.tsx`: larger refactor, touches auth token handling, higher blast radius
- Single `DashboardClient` wrapper component: over-engineers a simple pass-through

---

## Decision 4: Trend data utility functions — lib/utils/trends.ts

**Decision**: Pure functions in a new `lib/utils/trends.ts` file: `groupByWeek`, `groupByMonth`, `buildHeatmap`. Tested in isolation with Vitest, same pattern as `lib/utils/filter.ts`.

**Rationale**: Keeps chart logic testable without rendering. Follows the established pattern from spec 004.

**Alternatives considered**:
- Inline logic in the component: untestable, harder to maintain

---

## Decision 5: Week start day

**Decision**: Monday (ISO 8601 week standard).

**Rationale**: Spec assumption. ISO weeks are standard in European training apps; most running platforms (Garmin, Strava) use Monday. Implemented via `date-fns`-style manual calculation to avoid adding a dependency — `startOfWeek` logic is trivial with arithmetic on `getDay()`.

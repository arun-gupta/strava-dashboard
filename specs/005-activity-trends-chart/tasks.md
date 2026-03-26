# Tasks: Activity Trends Chart

**Input**: Design documents from `/specs/005-activity-trends-chart/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Included — constitution mandates TDD (tests written first, must fail before implementation).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Pure trend utility functions that ALL user stories depend on. No UI involved.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Tests for Trend Utilities (TDD — write first, verify they FAIL)

- [ ] T001 [P] Write unit tests for `groupByWeek(activities, activityType?)` in `tests/unit/utils/trends.test.ts` — empty activities returns empty array; single week groups correctly; multiple weeks in order; fills gap weeks with zero distance; respects activityType filter; uses Monday as week start
- [ ] T002 [P] Write unit tests for `groupByMonth(activities, activityType?)` in `tests/unit/utils/trends.test.ts` — empty activities returns empty array; single month groups correctly; multiple months in order; fills gap months with zero distance; respects activityType filter
- [ ] T003 [P] Write unit tests for `buildHeatmap(activities)` in `tests/unit/utils/trends.test.ts` — empty activities returns empty array; each active day has correct totalElapsedTime; inactive days within range have zero values; multiple activities on same day sum correctly

### Implementation

- [ ] T004 Implement `lib/utils/trends.ts` — `groupByWeek`, `groupByMonth`, `buildHeatmap` (depends on T001–T003 failing)

**Checkpoint**: All trend utility tests pass. Foundation ready for user story implementation.

---

## Phase 2: User Story 1 — Weekly Distance Chart with Trend Line (Priority: P1) 🎯 MVP

**Goal**: A composed bar + trend line chart showing weekly distance totals on the dashboard. Each bar has a distance label above it. A trend line connects bar midpoints. A total distance summary appears in the card header.

**Independent Test**: Log in, verify a chart card appears showing weekly bars with distance labels, a trend line overlay, and a summary like "42.5 km across 4 weeks".

### Tests for User Story 1 (TDD — write first, verify they FAIL)

- [ ] T005 [P] [US1] Write component tests for `ActivityTrendsChart` in `tests/unit/components/ActivityTrendsChart.test.tsx`:
  - Renders a chart card on the page
  - Displays total distance summary in the header (e.g. "X km across N weeks")
  - Renders one bar per week derived from activities
  - Weekly toggle button is active by default

### Implementation for User Story 1

- [ ] T006 [US1] Create `components/activities/ActivityTrendsChart.tsx` — `'use client'` component; accepts `activities: Activity[]` prop; uses `groupByWeek()` by default; renders Recharts `ComposedChart` with `Bar`, `Line`, and `LabelList`; shows distance labels above non-zero bars; shows total distance summary in header (depends on T004, T005)
- [ ] T007 [US1] Update `components/activities/RecentActivitiesList.tsx` — render `ActivityTrendsChart` below `ActivityFilterPanel`, passing the same `activities` array (depends on T006)

**Checkpoint**: US1 functional — composed chart renders with bars, trend line, labels, and summary.

---

## Phase 3: User Story 2 — Toggle Weekly / Monthly (Priority: P2)

**Goal**: Toggle buttons to switch between weekly and monthly grouping. Chart re-renders immediately with no page reload.

**Independent Test**: With the weekly chart visible, click "Monthly" — verify bars regroup by calendar month with correct labels and totals. Click "Weekly" — verify chart returns to weekly view.

### Tests for User Story 2 (TDD — write first, verify they FAIL)

- [ ] T008 [P] [US2] Write component tests for monthly toggle in `tests/unit/components/ActivityTrendsChart.test.tsx`:
  - Weekly and Monthly toggle buttons are rendered
  - Weekly is active by default
  - Clicking Monthly switches the active state
  - Clicking Weekly restores the weekly view

### Implementation for User Story 2

- [ ] T009 [US2] Update `components/activities/ActivityTrendsChart.tsx` — add `grouping` state (`"weekly" | "monthly"`); render Weekly/Monthly toggle buttons; switch between `groupByWeek()` and `groupByMonth()` on toggle; update header summary to reflect current grouping (depends on T006, T008)

**Checkpoint**: US2 functional — weekly/monthly toggle works, chart and summary update instantly.

---

## Phase 4: User Story 3 + User Story 4 — Type Filter + Heatmap (Priority: P3)

**Goal**: Single-select activity type filter on the trends chart; separate heatmap card showing training consistency by day with intensity colouring and hover tooltip.

**Independent Test (US3)**: Select "Run" from the type filter — verify only running distances are shown in each bar. Clear the filter — verify all types return.

**Independent Test (US4)**: Verify a heatmap card shows days as coloured cells. Active days are highlighted; darker = more elapsed time. Hover over an active day to see date and elapsed time in a tooltip.

### Tests for User Story 3 (TDD — write first, verify they FAIL)

- [ ] T010 [P] [US3] Write component tests for type filter in `tests/unit/components/ActivityTrendsChart.test.tsx`:
  - Type filter buttons rendered (one per unique sport_type in activities)
  - Selecting a type updates the chart to show only that type's distance
  - Clearing the filter restores all types

### Tests for User Story 4 (TDD — write first, verify they FAIL)

- [ ] T011 [P] [US4] Write component tests for `ActivityHeatmap` in `tests/unit/components/ActivityHeatmap.test.tsx`:
  - Renders a cell for every day in the activity range
  - Active days have a non-empty background colour class
  - Inactive days have the empty colour class (`bg-gray-100`)
  - Cell with higher elapsed time has a darker colour class than cell with lower elapsed time
  - Tooltip text shows date and formatted elapsed time on hover

### Implementation for User Story 3 + 4

- [ ] T012 [US3] Update `components/activities/ActivityTrendsChart.tsx` — add `activityType` state; render type filter buttons derived from unique `sport_type` values in activities; pass activityType to `groupByWeek`/`groupByMonth`; clear filter restores all types (depends on T009, T010)
- [ ] T013 [US4] Create `components/activities/ActivityHeatmap.tsx` — `'use client'` component; accepts `activities: Activity[]`; uses `buildHeatmap()` to derive `HeatmapDay[]`; renders a responsive CSS grid with one cell per day; applies Tailwind intensity classes (`bg-gray-100`, `bg-orange-200`, `bg-orange-400`, `bg-orange-600`) based on elapsed time relative to daily max; shows tooltip on hover with date and formatted elapsed time (depends on T004, T011)
- [ ] T014 [US4] Update `components/activities/RecentActivitiesList.tsx` — render `ActivityHeatmap` alongside `ActivityTrendsChart`, passing the same `activities` array (depends on T013)

**Checkpoint**: All 4 user stories functional. Type filter and heatmap work correctly.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T015 [P] Add empty state to `ActivityTrendsChart` — shown when no activities match the type filter (distinct from loading skeleton)
- [ ] T016 [P] Run full test suite: `npm test` — all unit tests must pass
- [ ] T017 [P] Update `README.md` — add "Activity trends chart and heatmap" to the features list (constitution requirement)
- [ ] T018 Sign off all items in `specs/005-activity-trends-chart/checklists/manual-testing.md` with real Strava credentials

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately; **blocks all user stories**
- **Phase 2 (US1)**: Depends on Phase 1 — MVP deliverable
- **Phase 3 (US2)**: Depends on Phase 2 (`ActivityTrendsChart` exists)
- **Phase 4 (US3+US4)**: Depends on Phase 3 (grouping toggle already wired)
- **Phase 5 (Polish)**: Depends on all user stories complete

### Parallel Opportunities

- T001, T002, T003 — all trend utility tests can be written in parallel
- T005, T008, T010, T011 — component tests for different stories can be written in parallel once T006 exists
- T013, T012 — US3 and US4 implementation can proceed in parallel (different files)
- T016, T017 — polish tasks are independent

---

## Notes

- **TDD is non-negotiable**: Every test task MUST be completed and confirmed FAILING before its implementation task begins
- `ActivityTrendsChart` grows incrementally — each phase adds state and UI to the same component
- `ActivityHeatmap` is standalone — it has no dependency on `ActivityTrendsChart` state
- `RecentActivitiesList` stays a Server Component — only `ActivityTrendsChart` and `ActivityHeatmap` are `'use client'`
- Use Recharts `ComposedChart` with `Bar` + `Line` + `LabelList` — no new dependency
- Use CSS grid + Tailwind for heatmap — no new dependency
- Intensity buckets: empty = `bg-gray-100`, low (≤33% of max) = `bg-orange-200`, medium (≤66%) = `bg-orange-400`, high (>66%) = `bg-orange-600`
- Commit after each checkpoint

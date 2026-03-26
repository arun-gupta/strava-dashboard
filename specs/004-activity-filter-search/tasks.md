# Tasks: Activity Filtering and Search

**Input**: Design documents from `/specs/004-activity-filter-search/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Included — constitution mandates TDD (tests written first, must fail before implementation).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Pure filter utility functions that ALL user stories depend on. No UI involved.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Tests for Filter Utilities (TDD — write first, verify they FAIL)

- [ ] T001 [P] Write unit tests for `filterByType(activities, types)` in `tests/unit/utils/filter.test.ts` — empty types returns all; single type filters correctly; multiple types return union; no match returns empty array
- [ ] T002 [P] Write unit tests for `filterBySearch(activities, query, mode)` in `tests/unit/utils/filter.test.ts` — fuzzy: case-insensitive partial match; exact: case-sensitive substring; empty query returns all; activity with no name excluded when query is active
- [ ] T003 [P] Write unit tests for `filterByDateRange(activities, startDate, endDate)` in `tests/unit/utils/filter.test.ts` — start only; end only; both inclusive; start after end returns empty; null bounds return all
- [ ] T004 [P] Write unit tests for `filterActivities(activities, filter)` in `tests/unit/utils/filter.test.ts` — all conditions AND-ed; all filters inactive returns full list; combined type + search + date range

### Implementation

- [ ] T005 Implement `lib/utils/filter.ts` — `filterByType`, `filterBySearch`, `filterByDateRange`, `filterActivities` (depends on T001–T004 failing)

**Checkpoint**: All filter utility tests pass. Foundation ready for user story implementation.

---

## Phase 2: User Story 1 — Filter by Activity Type (Priority: P1) 🎯 MVP

**Goal**: Multi-select type filter buttons above the activity list. Selecting types filters the list instantly. Deselecting all restores the full list.

**Independent Test**: Log in, verify type buttons appear showing only types present in the list. Select one type — verify list filters. Select two types — verify both shown. Deselect all — verify full list returns.

### Tests for User Story 1 (TDD — write first, verify they FAIL)

- [ ] T006 [P] [US1] Write component tests for `ActivityFilterPanel` in `tests/unit/components/ActivityFilterPanel.test.tsx`:
  - Renders type buttons derived from the activity list (only types present)
  - Clicking a type button filters the rendered activity rows
  - Clicking a second type button shows activities of both types
  - Clicking an active type button deselects it; all deselected restores full list
  - Activity count indicator shows "X of Y activities"

### Implementation for User Story 1

- [ ] T007 [US1] Create `components/activities/ActivityFilterPanel.tsx` — `'use client'` component; accepts `activities: Activity[]` prop; derives unique types via `getActivityMeta()`; renders type toggle buttons; manages `types` state; applies `filterByType()`; renders filtered `ActivityRow` list and count indicator (depends on T005, T006)
- [ ] T008 [US1] Update `components/activities/RecentActivitiesList.tsx` — pass `activities` array to `ActivityFilterPanel` instead of mapping `ActivityRow` directly (depends on T007)

**Checkpoint**: US1 functional — type filter renders, filters correctly, count updates.

---

## Phase 3: User Story 2 — Search by Activity Name (Priority: P2)

**Goal**: Text search input with a fuzzy/exact toggle. Typing filters the list in real time. Clearing restores the previous state.

**Independent Test**: Log in, type a partial word — verify matching activities appear. Toggle to exact — verify only exact substring matches shown. Clear — verify list restores.

### Tests for User Story 2 (TDD — write first, verify they FAIL)

- [ ] T009 [P] [US2] Write component tests for search UI in `tests/unit/components/ActivityFilterPanel.test.tsx`:
  - Search input is rendered
  - Typing in fuzzy mode filters by partial case-insensitive match
  - Typing in exact mode filters by case-sensitive substring
  - Toggle button switches between fuzzy and exact modes
  - Clearing the input restores the (type-filtered) list

### Implementation for User Story 2

- [ ] T010 [US2] Update `components/activities/ActivityFilterPanel.tsx` — add `searchQuery` and `matchMode` state; render search text input and fuzzy/exact toggle; wire to `filterBySearch()`; compose with type filter via `filterActivities()` (depends on T007, T009)

**Checkpoint**: US2 functional — search input and mode toggle work correctly alongside type filter.

---

## Phase 4: User Story 3 + 4 — Date Range and Combined Filters (Priority: P3)

**Goal**: Start/end date inputs filter activities by date. All active filters (type, search, date range) apply simultaneously via `filterActivities()`. Invalid date range shows a validation hint.

**Independent Test**: Set a date range — verify only activities within range appear. Apply type + search + date range together — verify all conditions apply simultaneously.

### Tests for User Story 3 + 4 (TDD — write first, verify they FAIL)

- [ ] T011 [P] [US3] Write component tests for date range inputs in `tests/unit/components/ActivityFilterPanel.test.tsx`:
  - Start and end date inputs are rendered
  - Setting start date hides activities before that date
  - Setting end date hides activities after that date
  - Both dates set: only inclusive range shown
  - Start after end: shows no activities and renders a validation hint
  - Clearing dates restores the list
- [ ] T012 [P] [US4] Write component tests for combined filters in `tests/unit/components/ActivityFilterPanel.test.tsx`:
  - Type + search active: only activities matching both shown
  - Type + search + date range active: only activities satisfying all three shown
  - Count indicator accurate under combined filters

### Implementation for User Story 3 + 4

- [ ] T013 [US3] Update `components/activities/ActivityFilterPanel.tsx` — add `startDate` and `endDate` state; render native `<input type="date">` inputs; wire to `filterByDateRange()`; show validation hint when `startDate > endDate`; all filters composed via `filterActivities()` (depends on T010, T011, T012)

**Checkpoint**: All 4 user stories functional. Combined filtering works correctly.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T014 [P] Add empty state message to `components/activities/ActivityFilterPanel.tsx` — shown when filtered list is empty (distinct from loading skeleton)
- [ ] T015 [P] Run full test suite: `npm test` — all unit tests must pass
- [ ] T016 [P] Update `README.md` — add "Filtering and search" to the features list (constitution requirement)
- [ ] T017 Sign off all items in `specs/004-activity-filter-search/checklists/manual-testing.md` with real Strava credentials

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately; **blocks all user stories**
- **Phase 2 (US1)**: Depends on Phase 1 — MVP deliverable
- **Phase 3 (US2)**: Depends on Phase 2 (`ActivityFilterPanel` already exists)
- **Phase 4 (US3+US4)**: Depends on Phase 3 (search already wired into `filterActivities()`)
- **Phase 5 (Polish)**: Depends on all user stories complete

### Parallel Opportunities

- T001, T002, T003, T004 — all filter utility tests can be written in parallel
- T006, T009, T011, T012 — component tests for different stories can be written in parallel once T007 exists
- T015, T016 — Polish tasks are independent

---

## Notes

- **TDD is non-negotiable**: Every test task MUST be completed and confirmed FAILING before its implementation task begins
- `ActivityFilterPanel` grows incrementally across phases — each phase adds state and UI to the same component
- `filterActivities()` composes all four conditions from day one; new filter conditions just add to the state object
- `RecentActivitiesList` stays a Server Component — only `ActivityFilterPanel` is `'use client'`
- Reuse `getActivityMeta()` from `lib/utils/activity.ts` to derive type labels for the filter buttons
- Commit after each checkpoint

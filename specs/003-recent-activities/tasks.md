# Tasks: Recent Activities

**Input**: Design documents from `/specs/003-recent-activities/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/strava-api.md ✅

**Tests**: Included — constitution mandates TDD (tests written first, must fail before implementation).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US3)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Shared infrastructure that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 Install `react-icons`: `npm install react-icons`
- [ ] T002 Create `lib/utils/activity.ts` — `getActivityMeta(sportType: string): { icon: IconType, label: string }` with full sport type mapping table from research.md; CamelCase-split fallback for unknown types
- [ ] T003 Add `formatPace(elapsedSeconds: number, distanceMetres: number): string | null` to `lib/utils/activity.ts` — returns `"M:SS /km"` or `null` when distance is 0
- [ ] T004 Add `formatDate(isoString: string): string` to `lib/utils/activity.ts` — returns `"25 Mar 2026"` using `Intl.DateTimeFormat`
- [ ] T005 Add `fetchRecentActivities(accessToken: string): Promise<Activity[]>` to `lib/strava.ts` — calls `GET /athlete/activities?per_page=10`, uses `cache: "no-store"`, throws on non-2xx

**Checkpoint**: Activity utilities, Strava API function, and react-icons in place. Foundation ready.

---

## Phase 2: User Story 1 — View Recent Activities on Dashboard (Priority: P1) 🎯 MVP

**Goal**: Authenticated athlete lands on the dashboard and sees a list of recent activities with type icon, type label, date, distance, and elapsed time.

**Independent Test**: Log in, visit `/dashboard` — verify list of recent activities with icon, type, date, distance, and time matching the athlete's Strava feed.

### Tests for User Story 1 (TDD — write first, verify they FAIL)

- [ ] T006 [P] [US1] Write unit tests for `lib/utils/activity.ts` in `tests/unit/utils/activity.test.ts`:
  - `getActivityMeta("Run")` → returns `FaPersonRunning` icon and label `"Run"`
  - `getActivityMeta("MountainBikeRide")` → returns `FaBicycle` icon and label `"Mountain Bike"`
  - `getActivityMeta("UnknownType")` → returns generic fallback icon and label `"Unknown Type"` (CamelCase split)
  - `formatPace(3720, 10000)` → `"6:12 /km"`
  - `formatPace(3720, 0)` → `null`
  - `formatDate("2026-03-25T07:30:00Z")` → `"25 Mar 2026"`
- [ ] T007 [P] [US1] Write unit tests for `fetchRecentActivities` in `tests/unit/lib/strava.test.ts` — mock `fetch`; verify correct URL, Authorization header, `per_page=10`; verify returns array; verify throws on 401/500
- [ ] T008 [P] [US1] Write component test for `ActivityRow` in `tests/unit/components/ActivityRow.test.tsx`:
  - renders activity name, type label, date, distance, elapsed time
  - renders `—` for distance and pace when distance is 0
  - renders fallback name (type label) when activity name is empty
  - renders an icon element

### Implementation for User Story 1

- [ ] T009 [US1] Implement `lib/utils/activity.ts` — `getActivityMeta`, `formatPace`, `formatDate` (depends on T006)
- [ ] T010 [US1] Implement `fetchRecentActivities` in `lib/strava.ts` (depends on T007)
- [ ] T011 [US1] Create `components/activities/ActivitiesSkeleton.tsx` — 10 placeholder rows with `animate-pulse`
- [ ] T012 [US1] Create `components/activities/ActivityRow.tsx` — renders icon, name, type label, date, distance, elapsed time, pace; handles zero-distance and missing name (depends on T008, T009)
- [ ] T013 [US1] Create `components/activities/RecentActivitiesList.tsx` — async Server Component; calls `fetchRecentActivities()`; renders list of `<ActivityRow>` components (depends on T010, T012)
- [ ] T014 [US1] Update `app/dashboard/page.tsx` — add `<RecentActivitiesList>` wrapped in `<Suspense fallback={<ActivitiesSkeleton />}>` (depends on T011, T013)

**Checkpoint**: US1 functional — activity list renders on the dashboard with icon, type, date, distance, and time.

---

## Phase 3: User Story 2 — View Activity Name and Pace (Priority: P2)

**Goal**: Each activity row shows its name and average pace in min/km.

**Independent Test**: Log in, verify each activity shows its name and pace (e.g. "5:32 /km"). Verify zero-distance activities show `—` for pace.

### Tests for User Story 2 (TDD — write first, verify they FAIL)

- [ ] T015 [P] [US2] Write component test for pace display in `tests/unit/components/ActivityRow.test.tsx`:
  - renders pace in `"M:SS /km"` format when distance > 0
  - renders `—` for pace when distance is 0

### Implementation for User Story 2

- [ ] T016 [US2] Update `components/activities/ActivityRow.tsx` — add pace display using `formatPace()` (depends on T015, T009)

**Checkpoint**: US2 functional — name and pace visible on each activity row.

---

## Phase 4: User Story 3 — Loading and Empty States (Priority: P3)

**Goal**: Skeleton shown while loading; friendly empty state when athlete has no activities.

**Independent Test**: Throttle to Slow 3G — verify skeleton rows visible. Verify empty state component renders correctly.

### Tests for User Story 3 (TDD — write first, verify they FAIL)

- [ ] T017 [P] [US3] Write component test for `ActivitiesSkeleton` in `tests/unit/components/ActivitiesSkeleton.test.tsx` — renders multiple rows with `animate-pulse`
- [ ] T018 [P] [US3] Write component test for empty state in `tests/unit/components/RecentActivitiesList.test.tsx` — when `fetchRecentActivities` returns `[]`, renders friendly empty message

### Implementation for User Story 3

- [ ] T019 [US3] Update `components/activities/RecentActivitiesList.tsx` — add empty state (friendly message) when API returns empty array (depends on T018)
- [ ] T020 [US3] Update `components/activities/ActivitiesSkeleton.tsx` if needed based on T017 feedback (depends on T017)

**Checkpoint**: All 3 user stories functional. Loading skeleton and empty state work correctly.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T021 [P] Verify all edge cases: zero-distance activity shows `—`; nameless activity shows type label; unknown sport type shows fallback icon
- [ ] T022 [P] Run full test suite: `npm test` — all unit tests must pass
- [ ] T023 [P] Update `README.md` — add "Recent Activities" to features list (constitution requirement)
- [ ] T024 Sign off all items in `specs/003-recent-activities/checklists/manual-testing.md` with real Strava credentials

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately; **blocks all user stories**
- **Phase 2 (US1)**: Depends on Phase 1 — MVP deliverable
- **Phase 3 (US2)**: Depends on Phase 2 (`ActivityRow` already exists)
- **Phase 4 (US3)**: Depends on Phase 2 (`RecentActivitiesList` already exists)
- **Phase 5 (Polish)**: Depends on all user stories complete

### Parallel Opportunities

- T006, T007, T008 — all US1 tests can be written in parallel
- T009, T010, T011 — utilities, Strava lib, skeleton have no mutual dependencies
- T015, T017, T018 — US2/US3 tests in parallel
- T021, T022, T023 — Polish tasks in parallel

---

## Notes

- **TDD is non-negotiable**: Every test task MUST be completed and confirmed FAILING before its implementation tasks begin
- **[P]** tasks = different files, no shared dependencies — safe to parallelize
- `react-icons` components must only be used in Client Components or passed as props — they are not compatible with async Server Components directly
- `ActivityRow` should be a Client Component (or regular Server Component with icon passed as a server-safe element) to support `react-icons`
- Reuse `formatDistance()` and `formatElapsedTime()` from `lib/utils/format.ts` — do not duplicate
- Commit after each checkpoint

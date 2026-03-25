# Tasks: Athlete Profile

**Input**: Design documents from `/specs/002-athlete-profile/`
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

- [ ] T001 Create `lib/strava.ts` — `fetchAthleteProfile()` calls `GET /athlete`, `fetchAthleteStats()` calls `GET /athletes/{id}/stats`; both accept an access token, use `{ cache: "no-store" }`, and throw on non-2xx responses
- [ ] T002 Create `lib/utils/format.ts` — `formatDistance(metres: number): string` (→ "X.X km") and `formatElapsedTime(seconds: number): string` (→ "Xh Ym")
- [ ] T003 Create `app/dashboard/error.tsx` — Next.js error boundary for the dashboard segment; renders a friendly message and a "Try again" refresh button

**Checkpoint**: Strava API layer, formatting utilities, and error boundary in place. Foundation ready.

---

## Phase 2: User Story 1 — View Profile on Dashboard (Priority: P1) 🎯 MVP

**Goal**: Authenticated athlete lands on the dashboard and sees their profile photo, full name, and location.

**Independent Test**: Log in, visit `/dashboard` — verify profile photo, name, and location match the athlete's Strava profile page.

### Tests for User Story 1 (TDD — write first, verify they FAIL)

- [ ] T004 [P] [US1] Write unit tests for `lib/utils/format.ts` in `tests/unit/utils/format.test.ts`:
  - `formatDistance(1000)` → `"1.0 km"`
  - `formatDistance(0)` → `"0.0 km"`
  - `formatDistance(1234567.8)` → `"1234.6 km"`
  - `formatElapsedTime(3600)` → `"1h 0m"`
  - `formatElapsedTime(0)` → `"0h 0m"`
  - `formatElapsedTime(45296)` → `"12h 34m"`
- [ ] T005 [P] [US1] Write unit tests for `lib/strava.ts` in `tests/unit/lib/strava.test.ts` — mock `fetch`; verify correct URL, Authorization header, and returned shape for `fetchAthleteProfile()` and `fetchAthleteStats()`; verify throws on 401/500
- [ ] T006 [P] [US1] Write component test for `AthleteProfileCard` in `tests/unit/components/AthleteProfileCard.test.tsx` — renders name, location, and `<img>` with correct `src`; renders initials fallback when `photoUrl` is null; hides location when null

### Implementation for User Story 1

- [ ] T007 [US1] Implement `lib/utils/format.ts` — `formatDistance` and `formatElapsedTime` pure functions (depends on T004)
- [ ] T008 [US1] Implement `lib/strava.ts` — `fetchAthleteProfile()` and `fetchAthleteStats()` with correct headers, error handling, and TypeScript return types (depends on T005)
- [ ] T009 [US1] Create `components/athlete/AthleteProfileSkeleton.tsx` — loading skeleton (photo circle + text lines) using Tailwind `animate-pulse`
- [ ] T010 [US1] Create `components/athlete/AthleteProfileCard.tsx` — async Server Component; calls `fetchAthleteProfile()`; displays photo (or initials fallback), full name, location (hidden if null) (depends on T006, T008)
- [ ] T011 [US1] Update `app/dashboard/page.tsx` — wrap `<AthleteProfileCard>` in `<Suspense fallback={<AthleteProfileSkeleton />}>` (depends on T009, T010)

**Checkpoint**: US1 functional — profile photo, name, and location render on the dashboard.

---

## Phase 3: User Story 2 — View Athlete Stats Summary (Priority: P2)

**Goal**: Athlete sees their all-time run count, total distance, and total elapsed time on the dashboard.

**Independent Test**: Log in, verify dashboard shows run count, distance (km), and time ("Xh Ym") matching values on the athlete's Strava profile page.

### Tests for User Story 2 (TDD — write first, verify they FAIL)

- [ ] T012 [P] [US2] Write component test for `AthleteStatsCard` in `tests/unit/components/AthleteStatsCard.test.tsx`:
  - renders run count, formatted distance, formatted elapsed time
  - renders "0 runs", "0.0 km", "0h 0m" when stats are all zero (edge case: no running data)

### Implementation for User Story 2

- [ ] T013 [US2] Create `components/athlete/AthleteStatsCard.tsx` — async Server Component; calls `fetchAthleteStats()`; displays run count, `formatDistance(distance)`, `formatElapsedTime(elapsed_time)`; defaults to zero if `all_run_totals` is missing (depends on T012, T008, T007)
- [ ] T014 [US2] Update `app/dashboard/page.tsx` — add `<AthleteStatsCard>` below the profile card, wrapped in its own `<Suspense fallback={<AthleteProfileSkeleton />}>` (depends on T013)

**Checkpoint**: US2 functional — all-time stats display correctly, including zero values for new athletes.

---

## Phase 4: User Story 3 — Loading and Error States (Priority: P3)

**Goal**: Dashboard shows a loading skeleton while data is fetching; shows a friendly error message if the Strava API fails.

**Independent Test**: Throttle network to Slow 3G — verify skeleton is visible. Break the API call URL — verify friendly error message appears.

### Tests for User Story 3 (TDD — write first, verify they FAIL)

- [ ] T015 [P] [US3] Write component test for `AthleteProfileSkeleton` in `tests/unit/components/AthleteProfileSkeleton.test.tsx` — renders skeleton elements with `animate-pulse` class
- [ ] T016 [P] [US3] Write test for `app/dashboard/error.tsx` in `tests/unit/dashboard/error.test.tsx` — renders friendly message and a button; button calls `reset()`

### Implementation for User Story 3

- [ ] T017 [US3] Update `components/athlete/AthleteProfileSkeleton.tsx` if needed based on T015 test feedback (depends on T015)
- [ ] T018 [US3] Update `app/dashboard/error.tsx` if needed based on T016 test feedback (depends on T016)

**Checkpoint**: All 3 user stories functional. Loading and error states work correctly.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Verify all edge cases from spec: no photo → initials shown; no location → field hidden; no running data → zeros shown
- [ ] T020 [P] Run full test suite: `npm test` — all unit tests must pass
- [ ] T021 [P] Update `README.md` — add "Athlete Profile" to the features list (constitution requirement)
- [ ] T022 Sign off all items in `specs/002-athlete-profile/checklists/manual-testing.md` with real Strava credentials

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately; **blocks all user stories**
- **Phase 2 (US1)**: Depends on Phase 1 — MVP deliverable
- **Phase 3 (US2)**: Depends on Phase 1 + `lib/strava.ts` and format utils from Phase 2
- **Phase 4 (US3)**: Depends on Phase 2 components (skeleton) and Phase 1 error boundary
- **Phase 5 (Polish)**: Depends on all user stories complete

### Parallel Opportunities

- T004, T005, T006 — all US1 tests can be written in parallel (different files)
- T007, T008, T009 — formatting utils, Strava lib, skeleton have no mutual dependencies
- T015, T016 — US3 tests in parallel
- T019, T020, T021 — Polish tasks in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational (T001–T003)
2. Complete Phase 2: User Story 1 (TDD: T004–T006 first, confirm failing, then T007–T011)
3. **STOP and VALIDATE**: Profile photo, name, and location visible on dashboard
4. Deploy to Vercel for demo

### Incremental Delivery

1. Foundational → API layer + formatting + error boundary ready
2. US1 (Profile Display) → MVP, deploy
3. US2 (Stats Summary) → adds value, deploy
4. US3 (Loading + Error States) → polished production quality, deploy

---

## Notes

- **TDD is non-negotiable**: Every test task MUST be completed and confirmed FAILING before its implementation tasks begin
- **[P]** tasks = different files, no shared dependencies — safe to parallelize
- `lib/strava.ts` is server-only — never import in Client Components
- `formatDistance` and `formatElapsedTime` are pure functions — no mocks needed in tests
- Commit after each checkpoint

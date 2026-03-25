# Tasks: Strava OAuth Login

**Input**: Design documents from `/specs/001-strava-oauth-login/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included — constitution mandates TDD (tests written first, must fail before implementation).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Next.js project with required dependencies and configuration.

- [ ] T001 Initialize Next.js 15 project with TypeScript strict mode (`npx create-next-app@latest`)
- [ ] T002 Install auth dependencies: `next-auth@beta`
- [ ] T003 [P] Install and configure Tailwind CSS
- [ ] T004 [P] Install test dependencies: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/user-event`
- [ ] T005 [P] Install Playwright: `@playwright/test` and initialize config
- [ ] T006 [P] Create `.env.example` with placeholder values for `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [ ] T007 Configure `vitest.config.ts` at repo root
- [ ] T008 Add `test`, `test:e2e` scripts to `package.json`

**Checkpoint**: Project initializes and `npm run dev` starts successfully.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T009 Create `lib/auth.ts` — NextAuth.js v5 config with Strava provider, `jwt` callback for token refresh logic, `session` callback to expose athlete data
- [ ] T010 Create `app/api/auth/[...nextauth]/route.ts` — NextAuth.js route handler (exports `GET` and `POST` from `lib/auth.ts`)
- [ ] T011 Create `middleware.ts` at repo root — protect `/dashboard` routes, redirect unauthenticated users to `/`
- [ ] T012 Create `app/layout.tsx` — root layout wrapping app with NextAuth.js `SessionProvider`

**Checkpoint**: Auth config, API route, middleware, and session provider are in place. Foundation ready.

---

## Phase 3: User Story 1 — First-Time Login (Priority: P1) 🎯 MVP

**Goal**: Unauthenticated athlete visits landing page, clicks "Connect with Strava", authorizes, and lands on the dashboard with their name shown.

**Independent Test**: Visit `/`, click "Connect with Strava", complete Strava OAuth, verify redirect to `/dashboard` and athlete name is displayed.

### Tests for User Story 1 (TDD — write first, verify they FAIL)

- [ ] T013 [P] [US1] Write unit test for `lib/auth.ts` Strava provider config in `tests/unit/auth/auth.test.ts` — verify provider is configured, `jwt` callback stores tokens, `session` callback exposes athlete fields
- [ ] T014 [P] [US1] Write component test for `LoginButton` in `tests/unit/components/LoginButton.test.tsx` — renders "Connect with Strava", calls `signIn("strava")` on click
- [ ] T015 [P] [US1] Write e2e test for first-time login flow in `tests/e2e/auth/login-flow.spec.ts` — mock Strava OAuth, verify landing → dashboard redirect, athlete name visible

### Implementation for User Story 1

- [ ] T016 [US1] Create `components/auth/LoginButton.tsx` — "Connect with Strava" button calling `signIn("strava")` (depends on T014)
- [ ] T017 [US1] Create `app/page.tsx` — landing page with `LoginButton`, redirect to `/dashboard` if already authenticated (depends on T016)
- [ ] T018 [US1] Create `app/dashboard/page.tsx` — protected page showing athlete name from session (depends on T012, T017)

**Checkpoint**: US1 fully functional — first-time login flow works end-to-end.

---

## Phase 4: User Story 2 — Returning User Auto-Login (Priority: P2)

**Goal**: Athlete with valid session visits app and goes directly to dashboard without re-authenticating.

**Independent Test**: Log in, close browser, reopen app — verify direct redirect to `/dashboard` without login prompt.

### Tests for User Story 2 (TDD — write first, verify they FAIL)

- [ ] T019 [P] [US2] Write unit test for `middleware.ts` in `tests/unit/auth/middleware.test.ts` — verify valid session → dashboard pass-through, expired session → `/` redirect
- [ ] T020 [P] [US2] Write e2e test for returning user in `tests/e2e/auth/login-flow.spec.ts` — simulate valid session cookie, verify direct dashboard access

### Implementation for User Story 2

- [ ] T021 [US2] Update `lib/auth.ts` — add token refresh logic in `jwt` callback: if `accessTokenExpires` passed, call Strava refresh endpoint and update tokens (depends on T009, T019)
- [ ] T022 [US2] Update `middleware.ts` — verify session validity including token expiry check, redirect expired sessions to `/` (depends on T011, T019)

**Checkpoint**: US2 functional — returning users with valid sessions reach dashboard directly; expired sessions redirect to login.

---

## Phase 5: User Story 3 — Login Denial (Priority: P3)

**Goal**: Athlete denies Strava authorization and is returned to landing page with a helpful message.

**Independent Test**: Initiate OAuth, deny on Strava page, verify return to `/` with error message displayed.

### Tests for User Story 3 (TDD — write first, verify they FAIL)

- [ ] T023 [P] [US3] Write component test for `ErrorMessage` in `tests/unit/components/ErrorMessage.test.tsx` — renders correct message for `access_denied` and `OAuthError` query params
- [ ] T024 [P] [US3] Write e2e test for denial flow in `tests/e2e/auth/login-flow.spec.ts` — simulate OAuth denial, verify landing page shows error message and retry works

### Implementation for User Story 3

- [ ] T025 [US3] Create `components/ui/ErrorMessage.tsx` — displays user-friendly message based on `error` query param (`access_denied` → auth required message, `OAuthError` → generic retry message) (depends on T023)
- [ ] T026 [US3] Update `app/page.tsx` — render `ErrorMessage` when `?error=` query param is present (depends on T017, T025)

**Checkpoint**: US3 functional — denied auth returns to landing page with friendly message and retry works.

---

## Phase 6: User Story 4 — Logout (Priority: P3)

**Goal**: Authenticated athlete clicks logout, session is cleared, and they are returned to the landing page.

**Independent Test**: Log in, click "Logout", verify session cleared and redirect to `/`, verify `/dashboard` is no longer accessible.

### Tests for User Story 4 (TDD — write first, verify they FAIL)

- [ ] T027 [P] [US4] Write component test for `LogoutButton` in `tests/unit/components/LogoutButton.test.tsx` — renders "Logout", calls `signOut()` on click
- [ ] T028 [P] [US4] Write e2e test for logout in `tests/e2e/auth/login-flow.spec.ts` — login, logout, verify session cleared, verify `/dashboard` redirects to `/`

### Implementation for User Story 4

- [ ] T029 [US4] Create `components/auth/LogoutButton.tsx` — logout button calling `signOut({ callbackUrl: "/" })` (depends on T027)
- [ ] T030 [US4] Update `app/dashboard/page.tsx` — add `LogoutButton` to dashboard UI (depends on T018, T029)

**Checkpoint**: All 4 user stories functional. Full auth lifecycle works end-to-end.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T031 [P] Add loading state to `LoginButton` during OAuth redirect in `components/auth/LoginButton.tsx`
- [ ] T032 [P] Add basic error boundary for unexpected auth failures in `app/layout.tsx`
- [ ] T033 [P] Update `CLAUDE.md` and `README.md` with final project structure
- [ ] T034 Validate all steps in `specs/001-strava-oauth-login/quickstart.md` work correctly
- [ ] T035 Run full test suite (`npm run test` + `npm run test:e2e`) — all tests must pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user stories**
- **Phase 3 (US1)**: Depends on Phase 2 — MVP deliverable
- **Phase 4 (US2)**: Depends on Phase 2 — can run after US1 or in parallel
- **Phase 5 (US3)**: Depends on Phase 2 + US1 landing page (T017)
- **Phase 6 (US4)**: Depends on Phase 2 + US1 dashboard (T018)
- **Phase 7 (Polish)**: Depends on all user stories complete

### Parallel Opportunities

- T003, T004, T005, T006 — all Phase 1 setup tasks (different files)
- T013, T014, T015 — all US1 tests can be written in parallel
- T019, T020 — US2 tests in parallel
- T023, T024 — US3 tests in parallel
- T027, T028 — US4 tests in parallel
- T031, T032, T033 — Polish tasks in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**critical — blocks everything**)
3. Complete Phase 3: User Story 1 (TDD: T013–T015 first, then T016–T018)
4. **STOP and VALIDATE**: First-time login works end-to-end
5. Deploy to Vercel for demo

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 (First-Time Login) → MVP, deploy
3. US2 (Returning User) → improved experience, deploy
4. US3 + US4 (Denial + Logout) → complete auth lifecycle, deploy

---

## Notes

- **TDD is non-negotiable**: Every test task MUST be completed and confirmed FAILING before its implementation tasks begin
- **[P]** tasks = different files, no shared dependencies — safe to parallelize
- Commit after each checkpoint
- Keep `.env.local` out of git — `.env.example` is committed instead

# Feature Specification: Recent Activities

**Feature Branch**: `003-recent-activities`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "recent activities — display a list of the athlete's recent runs on the dashboard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Recent Runs on Dashboard (Priority: P1)

An authenticated runner lands on the dashboard and sees a list of their most recent runs — each showing the date, distance, and elapsed time. This gives the athlete an immediate sense of their recent activity without leaving the app.

**Why this priority**: The core value of the dashboard — seeing recent activity — is only delivered by this story. Without it, the dashboard shows totals but no individual runs.

**Independent Test**: Log in, visit the dashboard — verify a list of recent runs is displayed, each with a date, distance, and elapsed time matching the athlete's Strava activity feed.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** a list of their most recent runs is displayed
2. **Given** a run in the list, **When** the athlete views it, **Then** the run's date is shown in a human-readable format (e.g. "25 Mar 2026")
3. **Given** a run in the list, **When** the athlete views it, **Then** the run's distance is shown in kilometres
4. **Given** a run in the list, **When** the athlete views it, **Then** the run's elapsed time is shown in human-readable format (e.g. "1h 04m")

---

### User Story 2 - View Run Name and Pace (Priority: P2)

A runner wants to see not just the distance and time of a run, but also its name and average pace — the key stats they care about after each run.

**Why this priority**: Name and pace add meaningful context to each run. Pace is the metric runners track most closely; without it the list is less useful.

**Independent Test**: Log in, verify the dashboard shows each run's name and average pace (min/km) alongside distance and time.

**Acceptance Scenarios**:

1. **Given** a run in the list, **When** the athlete views it, **Then** the run's name is displayed (e.g. "Morning Run")
2. **Given** a run in the list, **When** the athlete views it, **Then** the average pace is displayed in min/km format (e.g. "5:32 /km")

---

### User Story 3 - Loading and Empty States (Priority: P3)

While the activity list is loading, a skeleton is shown. If the athlete has no runs, a friendly empty state is shown instead of a blank list.

**Why this priority**: Polished loading and empty states are essential for production quality but do not block the core use case.

**Independent Test**: Throttle network to Slow 3G and verify skeleton is shown. Test with a new athlete account with no runs to verify the empty state.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete, **When** the dashboard is loading activities, **Then** a loading skeleton is shown in place of the list
2. **Given** an athlete with no runs, **When** the dashboard loads, **Then** a friendly empty state message is shown (not a blank list)

---

### Edge Cases

- What if the athlete has no runs at all?
- What if a run has no name set on Strava?
- What if a run has zero distance (e.g. an accidentally started activity)?
- What if the Strava API returns fewer activities than the requested count?
- What if the activities list fails to load (API error)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a list of the athlete's most recent runs on the dashboard
- **FR-002**: System MUST display each run's date in a human-readable format
- **FR-003**: System MUST display each run's distance in kilometres
- **FR-004**: System MUST display each run's elapsed time in human-readable format (e.g. "1h 04m")
- **FR-005**: System MUST display each run's name
- **FR-006**: System MUST display each run's average pace in min/km format
- **FR-007**: System MUST show a loading skeleton while activities are being fetched
- **FR-008**: System MUST show a friendly empty state when the athlete has no runs
- **FR-009**: System MUST show a friendly error state if the Strava API request fails
- **FR-010**: System MUST fetch activities server-side using the authenticated session's access token
- **FR-011**: System MUST filter to runs only (exclude rides, swims, and other activity types)

### Key Entities

- **Activity**: A single run — name, date, distance, elapsed time, type; sourced from `GET /athlete/activities`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Recent activities load and display within 3 seconds of the dashboard rendering
- **SC-002**: Each activity's distance and time values match those shown on the athlete's Strava feed
- **SC-003**: Loading skeleton is shown 100% of the time while data is fetching — no blank flash
- **SC-004**: Empty state is shown 100% of the time when the athlete has no runs — no blank list

## Assumptions

- The athlete is already authenticated (spec 001 complete)
- The Strava `read` OAuth scope is sufficient to access recent activities
- Only runs are displayed (activity type = `Run`) — rides, swims, and other types are excluded
- The list shows the 10 most recent runs (configurable in future specs)
- Distance is displayed in kilometres (Strava returns metres)
- Elapsed time is displayed as hours and minutes (e.g. "1h 04m")
- Pace is calculated as elapsed time divided by distance (min/km)
- A run with no name displays a fallback (e.g. "Run")
- Activities are fetched fresh on each dashboard load (no caching in v1)

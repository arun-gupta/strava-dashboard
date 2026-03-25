# Feature Specification: Athlete Profile

**Feature Branch**: `002-athlete-profile`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Athlete profile — display the authenticated athlete's Strava profile including name, photo, and key stats on the dashboard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Profile on Dashboard (Priority: P1)

An authenticated runner lands on the dashboard and immediately sees their Strava profile: profile photo, full name, and location. The profile loads as part of the dashboard without any extra navigation.

**Why this priority**: This is the core of the feature — seeing your own identity confirmed after login builds trust and personalises the experience.

**Independent Test**: Log in and visit the dashboard — verify profile photo, name, and location are displayed correctly, matching what is shown on the athlete's Strava profile page.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** their Strava profile photo is displayed
2. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** their full name is displayed
3. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** their city and country are displayed (if set on Strava)

---

### User Story 2 - View Athlete Stats Summary (Priority: P2)

A runner wants a quick snapshot of their all-time Strava stats on the dashboard — total runs, total distance, and total time spent running.

**Why this priority**: Stats give the dashboard immediate value beyond just a profile card; a runner can see their lifetime achievements at a glance.

**Independent Test**: Log in and verify the dashboard shows all-time run count, total distance, and total elapsed time, matching the values visible on the athlete's Strava profile.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** their all-time total run count is displayed
2. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** their all-time total distance is displayed in kilometres
3. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** their all-time total elapsed time is displayed in a human-readable format

---

### User Story 3 - Profile Data Loading and Error States (Priority: P3)

While the athlete profile is loading, the dashboard shows a loading indicator. If the Strava API fails to return profile data, a friendly error message is shown rather than a blank or broken page.

**Why this priority**: Graceful loading and error handling are essential for a polished, production-ready experience.

**Independent Test**: Simulate a slow or failed Strava API response and verify loading and error states render correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete, **When** the dashboard is loading profile data, **Then** a loading skeleton or spinner is displayed in place of the profile
2. **Given** the Strava API returns an error, **When** the dashboard renders, **Then** a friendly message is shown and the athlete is not shown a blank or broken page
3. **Given** the Strava API error is transient, **When** the athlete refreshes the page, **Then** the profile loads successfully

---

### Edge Cases

- What if the athlete has no profile photo set on Strava?
- What if the athlete's location (city/country) is not set on Strava?
- What if the Strava API returns partial data (e.g. stats missing)?
- What if the access token expires mid-load?
- What if the athlete has no running data (zero runs, zero distance, zero time)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the authenticated athlete's profile photo on the dashboard
- **FR-002**: System MUST display the authenticated athlete's full name on the dashboard
- **FR-003**: System MUST display the athlete's city and country if set on their Strava profile
- **FR-004**: System MUST display a fallback avatar if the athlete has no profile photo
- **FR-005**: System MUST display the athlete's all-time run count, total distance, and total elapsed time
- **FR-006**: System MUST show a loading state while profile data is being fetched
- **FR-007**: System MUST show a user-friendly error state if the Strava API request fails
- **FR-008**: System MUST fetch athlete profile data server-side using the authenticated session's access token
- **FR-009**: System MUST display zero values gracefully (e.g. "0 runs", "0 km", "0h 0m") when the athlete has no running data

### Key Entities

- **AthleteProfile**: The authenticated athlete's identity data — name, photo, location; sourced from `GET /athlete`
- **AthleteStats**: All-time running totals — run count, distance, elapsed time; sourced from `GET /athletes/{id}/stats`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Athlete profile (photo, name, location) loads and displays within 2 seconds of the dashboard rendering
- **SC-002**: Athlete stats (runs, distance, time) are accurate to the values shown on the athlete's Strava profile
- **SC-003**: A loading state is shown 100% of the time while data is being fetched — no blank content flashes
- **SC-004**: An error state is shown 100% of the time when the Strava API fails — no unhandled crashes

## Assumptions

- The athlete is already authenticated (spec 001 is complete)
- The Strava `read` OAuth scope is sufficient to access athlete profile and stats
- Distance is displayed in kilometres (Strava returns metres; conversion applied)
- Elapsed time is displayed as hours and minutes (e.g. "12h 34m")
- Stats shown are all-time totals, not filtered by date range
- Profile data is fetched fresh on each dashboard load (no caching in v1)

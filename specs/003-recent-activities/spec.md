# Feature Specification: Recent Activities

**Feature Branch**: `003-recent-activities`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "recent activities — display a list of the athlete's recent activities on the dashboard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Recent Activities on Dashboard (Priority: P1)

An authenticated athlete lands on the dashboard and sees a list of their most recent Strava activities — runs, rides, swims, hikes, and more — each showing the activity type, date, distance, and elapsed time. This gives the athlete an immediate snapshot of what they've been up to.

**Why this priority**: The core value of the dashboard — seeing recent activity — is only delivered by this story. Without it, the dashboard shows lifetime totals but no individual activities.

**Independent Test**: Log in, visit the dashboard — verify a list of recent activities is displayed, each with an activity type, date, distance, and elapsed time matching the athlete's Strava activity feed.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete on the dashboard, **When** the page loads, **Then** a list of their most recent activities is displayed
2. **Given** an activity in the list, **When** the athlete views it, **Then** an icon representing the activity type is shown alongside the activity name
3. **Given** an activity in the list, **When** the athlete views it, **Then** the activity type is shown as a label (e.g. "Run", "Ride", "Swim")
3. **Given** an activity in the list, **When** the athlete views it, **Then** the activity date is shown in a human-readable format (e.g. "25 Mar 2026")
4. **Given** an activity in the list, **When** the athlete views it, **Then** the activity distance is shown in kilometres
5. **Given** an activity in the list, **When** the athlete views it, **Then** the activity elapsed time is shown in human-readable format (e.g. "1h 04m")

---

### User Story 2 - View Activity Name and Pace (Priority: P2)

An athlete wants to see the name and average pace of each activity — the key stats they care about after each session.

**Why this priority**: Name and pace add meaningful context to each activity. Pace is one of the metrics athletes track most closely; without it the list is less useful.

**Independent Test**: Log in, verify the dashboard shows each activity's name and average pace (min/km) alongside distance and time.

**Acceptance Scenarios**:

1. **Given** an activity in the list, **When** the athlete views it, **Then** the activity name is displayed (e.g. "Morning Run", "Evening Ride")
2. **Given** an activity in the list, **When** the athlete views it, **Then** the average pace is displayed in min/km format (e.g. "5:32 /km")

---

### User Story 3 - Loading and Empty States (Priority: P3)

While the activity list is loading, a skeleton is shown. If the athlete has no recorded activities, a friendly empty state is shown instead of a blank list.

**Why this priority**: Polished loading and empty states are essential for production quality but do not block the core use case.

**Independent Test**: Throttle network to Slow 3G and verify skeleton is shown. Verify empty state for an athlete with no activities.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete, **When** the dashboard is loading activities, **Then** a loading skeleton is shown in place of the list
2. **Given** an athlete with no activities, **When** the dashboard loads, **Then** a friendly empty state message is shown (not a blank list)

---

### Edge Cases

- What if the athlete has no activities at all?
- What if an activity has no name set on Strava?
- What if an activity has zero distance (e.g. a strength training session)?
- What if the Strava API returns fewer activities than the requested count?
- What if the activities list fails to load (API error)?
- What if an activity type is unknown or not recognised — what icon and label should be shown?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a list of the athlete's most recent activities on the dashboard
- **FR-002**: System MUST display an icon representing each activity's type (e.g. a shoe for Run, a bicycle for Ride, goggles for Swim)
- **FR-013**: System MUST display each activity's type as a text label (e.g. "Run", "Ride", "Swim", "Hike")
- **FR-003**: System MUST display each activity's date in a human-readable format
- **FR-004**: System MUST display each activity's distance in kilometres
- **FR-005**: System MUST display each activity's elapsed time in human-readable format (e.g. "1h 04m")
- **FR-006**: System MUST display each activity's name
- **FR-007**: System MUST display each activity's average pace in min/km format
- **FR-008**: System MUST show a loading skeleton while activities are being fetched
- **FR-009**: System MUST show a friendly empty state when the athlete has no activities
- **FR-010**: System MUST show a friendly error state if the Strava API request fails
- **FR-011**: System MUST fetch activities server-side using the authenticated session's access token
- **FR-012**: System MUST display all activity types — not filtered to runs only

### Key Entities

- **Activity**: A single Strava activity — name, type, date, distance, elapsed time; sourced from `GET /athlete/activities`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Recent activities load and display within 3 seconds of the dashboard rendering
- **SC-002**: Each activity's distance and time values match those shown on the athlete's Strava feed
- **SC-003**: Loading skeleton is shown 100% of the time while data is fetching — no blank flash
- **SC-004**: Empty state is shown 100% of the time when the athlete has no activities — no blank list

## Assumptions

- The athlete is already authenticated (spec 001 complete)
- The Strava `read` OAuth scope is sufficient to access recent activities
- All activity types are displayed — runs, rides, swims, hikes, and any other Strava activity types
- The list shows the 10 most recent activities
- Distance is displayed in kilometres (Strava returns metres)
- Elapsed time is displayed as hours and minutes (e.g. "1h 04m")
- Pace is calculated as elapsed time divided by distance (min/km)
- Activities with zero distance (e.g. strength training) show "—" for distance and pace
- An activity with no name displays a fallback based on type (e.g. "Run", "Ride")
- Activities are fetched fresh on each dashboard load (no caching in v1)

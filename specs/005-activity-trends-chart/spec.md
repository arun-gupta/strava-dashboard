# Feature Specification: Activity Trends Chart

**Feature Branch**: `005-activity-trends-chart`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "Weekly and monthly activity trends chart showing distance over time, with a trend line overlay and distance labels on each bar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Weekly Distance Trend (Priority: P1)

As an athlete on the dashboard, I want to see a bar chart of my total distance per week for recent weeks, so I can understand my training load at a glance.

**Why this priority**: The weekly view is the most actionable timeframe for runners — it maps directly to training plans and reveals short-term patterns. It is the MVP deliverable.

**Independent Test**: Log in, navigate to the dashboard, and verify a bar chart appears showing weekly distance totals labelled by week. Delivers standalone value without the monthly view.

**Acceptance Scenarios**:

1. **Given** I am logged in with activities spanning multiple weeks, **When** I view the dashboard, **Then** a composed chart is visible with one bar per week, a trend line connecting bar midpoints, and a distance label above each bar.
2. **Given** I have activities in the current week and previous weeks, **When** I view the weekly chart, **Then** bars are ordered chronologically left to right.
3. **Given** a week has no recorded activities, **When** that week falls within the chart range, **Then** it appears as a zero-height bar with no label above it.
4. **Given** multiple periods are shown, **When** I view the trend line, **Then** it connects the top midpoint of each bar showing whether distance is trending up or down.
5. **Given** the chart is rendered, **When** I view the chart header, **Then** a total distance summary is shown (e.g. "42.5 km across 4 weeks").

---

### User Story 2 - Toggle to Monthly View (Priority: P2)

As an athlete, I want to toggle the chart to show monthly totals, so I can see longer-term training trends beyond what the weekly view reveals.

**Why this priority**: Monthly trends reveal season-level patterns that weekly views obscure. Builds directly on the weekly chart with a simple toggle control.

**Independent Test**: With the weekly chart visible, click the "Monthly" toggle and verify the chart updates to show one bar per calendar month with correct labels and totals.

**Acceptance Scenarios**:

1. **Given** the weekly chart is displayed, **When** I click the "Monthly" toggle, **Then** the chart re-renders with one bar per calendar month.
2. **Given** I am viewing the monthly chart, **When** I click the "Weekly" toggle, **Then** the chart reverts to the weekly view.
3. **Given** a month has no recorded activities, **When** that month falls within the chart range, **Then** it appears as a zero-height bar.

---

### User Story 3 - Filter Trends by Activity Type (Priority: P3)

As an athlete who does multiple sports, I want to filter the trends chart by activity type, so I can see distance trends for runs separately from rides or other activities.

**Why this priority**: Multi-sport athletes need per-sport visibility to track training balance. Depends on P1 and P2 chart infrastructure being in place.

**Independent Test**: With the trends chart visible, select "Run" from the type filter and verify the chart updates to show only running distance in each period.

**Acceptance Scenarios**:

1. **Given** the trends chart is visible, **When** I select a specific activity type, **Then** only distances for that type are included in each bar.
2. **Given** a type filter is active, **When** I clear the filter, **Then** all activity types are included again.

---

### User Story 4 - View Activity Heatmap (Priority: P3)

As an athlete, I want to see a heatmap calendar showing my activity days, so I can quickly gauge my training consistency and intensity over time.

**Why this priority**: The heatmap gives a different lens than the bar chart — consistency and frequency rather than volume. It is self-contained in its own card and independent of US1–US3.

**Independent Test**: Log in and verify a separate heatmap card is visible on the dashboard. Each day with an activity is highlighted; days with more elapsed time are shown with a darker shade. Days with no activity are shown as empty cells.

**Acceptance Scenarios**:

1. **Given** I am logged in with activities on various days, **When** I view the dashboard, **Then** a heatmap card is visible showing a calendar grid where active days are highlighted.
2. **Given** multiple activities on the same day, **When** I view the heatmap, **Then** the cell for that day reflects the combined elapsed time (darker shade).
3. **Given** a day with no activities, **When** I view the heatmap, **Then** that cell is rendered as empty (no fill).
4. **Given** I hover over an active day, **When** the tooltip appears, **Then** it shows the date and total elapsed time for that day.
5. **Given** the fetched activities span multiple weeks, **When** I view the heatmap, **Then** the full date range from the earliest to the latest activity is shown.

---

### Edge Cases

- What happens when the athlete has fewer than 2 weeks of data? — Chart shows available weeks only; no minimum required.
- What happens when all activities fall in a single week or month? — Chart shows one bar with the correct total.
- What happens when distance is zero for all periods? — Chart renders with zero-height bars and a visible axis; no error state shown.
- What happens when the Strava data fetch fails? — Chart is not rendered; the error is handled at the data layer using the existing pattern.
- What happens when multiple activities fall on the same heatmap day? — Their elapsed times are summed and the cell intensity reflects the combined total.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a composed chart of bars and a trend line showing total activity distance grouped by week on the dashboard.
- **FR-002**: System MUST display period labels in chronological order on the chart x-axis.
- **FR-003**: Users MUST be able to toggle between weekly and monthly grouping.
- **FR-004**: System MUST regroup and re-render the chart immediately when the toggle changes, with no page reload.
- **FR-005**: System MUST show zero-height bars for weeks or months with no recorded activities within the displayed range.
- **FR-006**: System MUST display distance values in kilometres on the chart y-axis and in tooltips.
- **FR-007-a**: System MUST display a distance label (in km) above each bar with a non-zero value.
- **FR-007-b**: System MUST overlay a trend line connecting the midpoints of all bars to show the overall direction of training volume.
- **FR-007-c**: System MUST display a total distance summary in the chart header showing the sum across all displayed periods and the period count (e.g. "42.5 km across 4 weeks").
- **FR-008-a**: Users MUST be able to filter the trends chart by activity type (P3).
- **FR-008**: System MUST derive chart data from the already-fetched activity list — no additional API calls.
- **FR-009**: System MUST display a heatmap card showing one cell per day across the range spanned by the fetched activities (P3).
- **FR-010**: System MUST colour each heatmap cell by intensity based on total elapsed time for that day — empty for no activity, light for low, dark for high.
- **FR-011**: System MUST display a tooltip on heatmap cells showing the date and total elapsed time when hovered.

### Key Entities

- **TrendPeriod**: A single bar on the chart — represents a week or month, with a label and a total distance in km.
- **TrendFilter**: The current chart state — grouping mode (weekly or monthly) and optionally a selected activity type.
- **HeatmapDay**: A single cell in the heatmap — represents one calendar day with a date and total elapsed time (0 for inactive days).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The trends chart is visible on the dashboard without any additional user action after login.
- **SC-002**: Toggling between weekly and monthly view updates the chart in under 100ms with no network call.
- **SC-003**: Distance values shown in the chart match the sum of distances in the activity list for each period.
- **SC-004**: The chart renders correctly for athletes with 1 to 180 activities spanning multiple weeks and months.
- **SC-005**: The heatmap correctly reflects activity presence and relative intensity for all days in the fetched activity range.

## Assumptions

- Chart data is derived from the fetched activities (up to 180, ~6 months) already fetched for the dashboard — no additional Strava API calls are made.
- Distance is always displayed in kilometres to match the rest of the dashboard.
- Weekly grouping uses Monday as the start of the week (ISO standard).
- The chart covers only the range spanned by the fetched activities, not a fixed lookback window.
- Toggle state resets to weekly on page reload — no persistence required.
- Heatmap intensity is based on elapsed time (not distance) to capture all activity types including strength training which has zero distance.
- The heatmap covers the full date range from the earliest to the latest of the fetched activities.
- Mobile responsiveness is in scope.

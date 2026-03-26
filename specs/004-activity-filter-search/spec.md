# Feature Specification: Activity Filtering and Search

**Feature Branch**: `004-activity-filter-search`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Filtering and search — athlete can filter their recent activities on the dashboard client-side. Filters: activity type (multi-select), date range. Search: text search on activity name with a toggle between fuzzy and exact match. All filtering and search operates on the 10 already-fetched activities with no additional API calls."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter Activities by Type (Priority: P1)

An athlete on the dashboard wants to see only certain types of activities. They select one or more activity types from a filter (e.g. Run, Ride, Swim) and the list immediately updates to show only matching activities. Deselecting all filters restores the full list.

**Why this priority**: Type filtering is the most common way athletes segment their training. A runner who also cycles wants to quickly isolate just their runs. This delivers immediate value on its own.

**Independent Test**: Log in, visit the dashboard, select "Run" from the type filter — verify only running activities are shown. Select "Run" and "Ride" — verify both appear. Deselect all — verify all 10 activities return.

**Acceptance Scenarios**:

1. **Given** a list of activities on the dashboard, **When** the athlete selects one activity type, **Then** only activities of that type are shown
2. **Given** one type is selected, **When** the athlete selects a second type, **Then** activities of both types are shown
3. **Given** one or more types are selected, **When** the athlete deselects all types, **Then** the full unfiltered list is shown
4. **Given** a type filter is active, **When** no activities match the selected types, **Then** a friendly empty state is shown

---

### User Story 2 - Search Activities by Name (Priority: P2)

An athlete wants to find a specific activity by name. They type into a search box and the list filters in real time. They can toggle between fuzzy matching (finds "morning run" when typing "morn") and exact matching (only finds activities whose name contains the exact typed string).

**Why this priority**: Search lets athletes locate a specific session quickly, especially when they name their activities consistently. It adds precision on top of the broad type filter.

**Independent Test**: Log in, type "morning" in the search box — verify only activities with "morning" in the name appear. Toggle to exact match and type "Morning Run" — verify only exact matches appear.

**Acceptance Scenarios**:

1. **Given** activities on the dashboard, **When** the athlete types in the search box, **Then** the list filters in real time to show only matching activities
2. **Given** fuzzy match is active, **When** the athlete types a partial word, **Then** activities whose names contain that partial string (case-insensitive) are shown
3. **Given** exact match is active, **When** the athlete types a string, **Then** only activities whose names contain that exact string (case-insensitive) are shown
4. **Given** a search term is entered, **When** no activities match, **Then** a friendly empty state is shown
5. **Given** a search term is entered, **When** the athlete clears the search box, **Then** the full (or type-filtered) list is restored

---

### User Story 3 - Filter Activities by Date Range (Priority: P3)

An athlete wants to narrow the list to activities within a specific date range — for example, this week's sessions or last month's training.

**Why this priority**: Date range filtering adds temporal context that type filtering and search cannot provide. Useful for reviewing a training block or week.

**Independent Test**: Log in, set a date range covering only the last 7 days — verify only activities within that range are shown. Clear the date range — verify all activities return.

**Acceptance Scenarios**:

1. **Given** activities on the dashboard, **When** the athlete sets a start date, **Then** only activities on or after that date are shown
2. **Given** a start date is set, **When** the athlete also sets an end date, **Then** only activities within the date range (inclusive) are shown
3. **Given** a date range is set, **When** no activities fall within the range, **Then** a friendly empty state is shown
4. **Given** a date range is set, **When** the athlete clears the date range, **Then** the full (or otherwise filtered) list is restored

---

### User Story 4 - Combine Filters and Search (Priority: P3)

An athlete uses type filter, date range, and search together. All active filters and search terms apply simultaneously and the list updates instantly.

**Why this priority**: Filters are most powerful in combination. An athlete might want "all Runs in the last 30 days named Morning".

**Independent Test**: Select "Run", set a date range, and type a search term — verify the list shows only activities matching all three conditions simultaneously.

**Acceptance Scenarios**:

1. **Given** a type filter and a search term are both active, **When** the list renders, **Then** only activities matching both conditions are shown
2. **Given** all three filters are active, **When** the list renders, **Then** only activities satisfying all three conditions simultaneously are shown
3. **Given** combined filters produce no results, **When** the list renders, **Then** a single friendly empty state is shown

---

### Edge Cases

- What if only one activity type is present in the fetched list — should the type filter still appear?
- What if the date range start date is after the end date?
- What if all 10 activities are filtered out — is the empty state clearly distinct from the loading skeleton?
- What if an activity has no name — does it appear in search results or is it excluded?
- What if the search box is cleared while a type filter is also active — does the type filter remain?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a multi-select activity type filter showing only the types present in the current activity list
- **FR-002**: System MUST filter the activity list in real time when one or more types are selected, with no page reload or additional API call
- **FR-003**: System MUST allow the athlete to deselect all type filters to restore the full list
- **FR-004**: System MUST display a text search input that filters activities by name in real time
- **FR-005**: System MUST support fuzzy match mode: case-insensitive partial string matching on activity name
- **FR-006**: System MUST support exact match mode: case-insensitive exact substring matching on activity name
- **FR-007**: System MUST provide a toggle to switch between fuzzy and exact match modes
- **FR-008**: System MUST display a date range input with a start date and end date
- **FR-009**: System MUST filter activities to those whose date falls within the selected range (inclusive)
- **FR-010**: System MUST apply all active filters and search simultaneously
- **FR-011**: System MUST show a friendly empty state when no activities match the active filters and search
- **FR-012**: System MUST operate entirely client-side on the already-fetched 10 activities — no additional API calls
- **FR-013**: System MUST show a count of currently displayed activities vs total (e.g. "3 of 10 activities")
- **FR-014**: System MUST show a validation hint when the start date is after the end date

### Key Entities

- **ActivityFilter**: The combined state of active type selections, date range, search term, and match mode applied to the activity list
- **FilteredActivityList**: The subset of the 10 fetched activities that satisfies all active filter and search conditions

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Filtering and search results update within 100ms of any user input — no perceptible delay
- **SC-002**: All active filters apply simultaneously — combined filter results are always correct
- **SC-003**: The activity count indicator accurately reflects the number of visible activities at all times
- **SC-004**: The empty state is shown 100% of the time when no activities match — no blank list

## Assumptions

- All filtering and search operates on the 10 activities already fetched from Strava — no additional API calls are made
- The type filter shows only activity types present in the current list, not all possible Strava types
- Fuzzy match is the default search mode
- Date range inputs use the browser's native date picker
- An activity with no name is excluded from search results (no name to match against)
- If the start date is after the end date, no activities are shown and a validation hint is displayed
- Filters and search reset on page reload — they are not persisted to a URL or local storage in v1
- The athlete is already authenticated and the activity list is already loaded (spec 003 complete)

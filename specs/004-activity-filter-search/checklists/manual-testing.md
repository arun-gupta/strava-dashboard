# Manual Testing Checklist: Activity Filtering and Search

**Purpose**: Human-in-the-loop verification before merging to main
**Feature**: [spec.md](../spec.md)
**Environment**: Local dev (`npm run dev`) with real Strava credentials in `.env.local`

---

## Setup

- [x] `npm run dev` starts without errors
- [x] Logged in with a real Strava account that has at least 2 different activity types (e.g. a Run and a Ride) in the most recent 10 activities

---

## US1 — Filter Activities by Type

- [x] Type filter buttons appear above the activity list, showing only types present in the current 10 activities
- [x] Selecting one type shows only activities of that type
- [x] Selecting a second type shows activities of both types
- [x] Deselecting all types restores the full list of 10 activities
- [x] Activity count indicator updates correctly (e.g. "2 of 10 activities")
- [x] Filtering is instant with no page reload or visible delay

---

## US2 — Search Activities by Name

- [x] Search input is visible above the activity list
- [x] Typing a partial word (fuzzy mode) filters the list in real time to matching activities
- [x] Search is case-insensitive (e.g. "morning" matches "Morning Run")
- [x] Toggling to exact match shows only activities whose name contains the exact typed string
- [x] Clearing the search box restores the full (or type-filtered) list
- [x] Activity count indicator updates correctly when search is active

---

## US3 — Filter Activities by Date Range

- [x] Start date and end date inputs are visible
- [x] Setting a start date hides activities before that date
- [x] Setting an end date hides activities after that date
- [x] Both dates set together shows only activities within the range (inclusive)
- [x] Clearing both dates restores the full (or otherwise filtered) list
- [x] Setting a start date after the end date shows no activities and displays a validation hint

---

## US4 — Combined Filters

- [x] Type filter + search applied together shows only activities matching both
- [x] Type filter + date range + search all active simultaneously shows only activities satisfying all three
- [x] Activity count indicator is accurate under combined filters

---

## Edge Cases

> **Note**: Filter logic edge cases (empty list, no-name exclusion, invalid date range) are covered by unit tests and do not require manual verification.

- [x] No activities matching a filter — covered by unit test (empty state displayed)
- [x] Activity with no name excluded from search results — covered by unit test
- [x] Start date after end date produces no results — covered by unit test
- [x] All 10 activities are filtered out — empty state message is shown, not a blank list
- [x] Switching between fuzzy and exact match while a search term is entered — results update immediately
- [x] Applying filters then refreshing the page — all filters reset to defaults

---

## Notes

_Add any observations, issues found, or browser/device details here before signing off._

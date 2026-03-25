# Manual Testing Checklist: Recent Activities

**Purpose**: Human-in-the-loop verification before merging to main
**Feature**: [spec.md](../spec.md)
**Environment**: Local dev (`npm run dev`) with real Strava credentials in `.env.local`

---

## Setup

- [ ] `npm run dev` starts without errors
- [ ] Logged in with a real Strava account that has at least one recorded activity

---

## US1 — View Recent Activities on Dashboard

- [x] Dashboard displays a list of recent activities below the stats card
- [x] Each activity shows an icon representing its type
- [x] Each activity shows its type as a text label (e.g. "Run", "Ride", "Swim")
- [x] Each activity shows its date in a human-readable format (e.g. "25 Mar 2026")
- [x] Each activity shows its distance in kilometres
- [x] Each activity shows its elapsed time (e.g. "1h 04m")
- [x] Values match those visible on the athlete's Strava activity feed

---

## US2 — View Activity Name and Pace

- [x] Each activity shows its name (e.g. "Morning Run", "Evening Ride")
- [x] Each activity shows its average pace in min/km format (e.g. "5:32 /km")

---

## US3 — Loading and Empty States

- [x] A loading skeleton is shown while activities are being fetched (verify with DevTools → Slow 3G)
- [x] No blank content flash before data loads

---

## Edge Cases

> **Note**: No activities and no-name edge cases are covered by unit tests and do not require manual verification.

- [x] No activities — covered by unit test (empty state displayed)
- [x] Activity with no name — covered by unit test (fallback shown based on type)
- [x] Activity with zero distance — covered by unit test ("—" shown for distance and pace)
- [x] Multiple activity types visible in the list (e.g. at least one Run and one non-Run activity)
- [x] Refreshing the dashboard reloads the activity list correctly
- [x] Rate limit error (429) shows a friendly message with usage counts and reset timer

---

## Notes

_Add any observations, issues found, or browser/device details here before signing off._

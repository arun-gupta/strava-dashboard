# Manual Testing Checklist: Recent Activities

**Purpose**: Human-in-the-loop verification before merging to main
**Feature**: [spec.md](../spec.md)
**Environment**: Local dev (`npm run dev`) with real Strava credentials in `.env.local`

---

## Setup

- [ ] `npm run dev` starts without errors
- [ ] Logged in with a real Strava account

---

## US1 — View Recent Runs on Dashboard

- [ ] Dashboard displays a list of recent runs
- [ ] Each run shows the date in a human-readable format (e.g. "25 Mar 2026")
- [ ] Each run shows the distance in kilometres
- [ ] Each run shows the elapsed time (e.g. "1h 04m")
- [ ] Values match those visible on the athlete's Strava activity feed

---

## US2 — View Run Name and Pace

- [ ] Each run shows its name (e.g. "Morning Run")
- [ ] Each run shows average pace in min/km format (e.g. "5:32 /km")

---

## US3 — Loading and Empty States

- [ ] A loading skeleton is shown while activities are being fetched (verify with DevTools → Slow 3G)
- [ ] No blank content flash before data loads
- [ ] Error state displays a friendly message (simulate by temporarily breaking the API call)

---

## Edge Cases

> **Note**: No runs and no-name edge cases are covered by unit tests and do not require manual verification.

- [x] No runs — covered by unit test (empty state displayed)
- [x] Run with no name — covered by unit test (fallback "Run" shown)
- [ ] Refreshing the dashboard reloads the activity list correctly

---

## Notes

_Add any observations, issues found, or browser/device details here before signing off._

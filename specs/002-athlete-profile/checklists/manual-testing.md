# Manual Testing Checklist: Athlete Profile

**Purpose**: Human-in-the-loop verification before merging to main
**Feature**: [spec.md](../spec.md)
**Environment**: Local dev (`npm run dev`) with real Strava credentials in `.env.local`

---

## Setup

- [x] `npm run dev` starts without errors
- [x] Logged in with a real Strava account

---

## US1 — View Profile on Dashboard

- [x] Dashboard displays the athlete's Strava profile photo
- [x] Dashboard displays the athlete's full name
- [x] Dashboard displays the athlete's city and country (if set on Strava)
- [x] Profile photo matches what is shown on the athlete's Strava profile page
- [x] No errors in browser console or server logs

---

## US2 — View Athlete Stats Summary

- [x] Dashboard displays all-time total run count
- [x] Dashboard displays all-time total distance in kilometres
- [x] Dashboard displays all-time total elapsed time in human-readable format (e.g. "12h 34m")
- [x] Values match those visible on the athlete's Strava profile page

---

## US3 — Loading and Error States

- [x] A loading skeleton or spinner is shown while profile data is being fetched
- [x] No blank content flash before data loads
- [x] Visiting the dashboard with network throttled (DevTools → Slow 3G) shows loading state
- [x] Error state displays a friendly message (simulate by temporarily breaking the API call)

---

## Edge Cases

> **Note**: No photo, no location, and zero stats are covered by unit tests (`AthleteProfileCard.test.tsx`, `AthleteStatsCard.test.tsx`) and do not require manual verification with a real account.

- [x] No profile photo fallback — covered by unit test (renders initials)
- [x] No location — covered by unit test (field hidden when null)
- [x] No running data — covered by unit test (zeros displayed gracefully)
- [x] Refreshing the dashboard reloads profile data correctly

---

## Notes

_Add any observations, issues found, or browser/device details here before signing off._

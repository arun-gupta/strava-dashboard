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

- [ ] Dashboard displays all-time total run count
- [ ] Dashboard displays all-time total distance in kilometres
- [ ] Dashboard displays all-time total elapsed time in human-readable format (e.g. "12h 34m")
- [ ] Values match those visible on the athlete's Strava profile page

---

## US3 — Loading and Error States

- [ ] A loading skeleton or spinner is shown while profile data is being fetched
- [ ] No blank content flash before data loads
- [ ] Visiting the dashboard with network throttled (DevTools → Slow 3G) shows loading state
- [ ] Error state displays a friendly message (simulate by temporarily breaking the API call)

---

## Edge Cases

- [ ] Athlete with no profile photo set shows a fallback avatar (not a broken image)
- [ ] Athlete with no location set on Strava — location field is hidden or shows gracefully
- [ ] Athlete with no running data — stats show zeros gracefully (e.g. "0 runs", "0 km", "0h 0m"), not blank or broken
- [ ] Refreshing the dashboard reloads profile data correctly

---

## Notes

_Add any observations, issues found, or browser/device details here before signing off._

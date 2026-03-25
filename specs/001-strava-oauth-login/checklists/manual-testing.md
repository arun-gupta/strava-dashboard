# Manual Testing Checklist: Strava OAuth Login

**Purpose**: Human-in-the-loop verification before merging to main
**Feature**: [spec.md](../spec.md)
**Environment**: Local dev (`npm run dev`) with real Strava credentials in `.env.local`

---

## Setup

- [ ] `npm run dev` starts without errors
- [ ] `.env.local` has valid Strava credentials
- [ ] Browser DevTools open to monitor network requests and console errors

---

## US1 — First-Time Login

- [ ] Visiting `http://localhost:3000` shows the landing page with "Connect with Strava" button
- [ ] Clicking "Connect with Strava" shows a loading state ("Connecting…") and disables the button
- [ ] Browser redirects to Strava's authorization page (`strava.com`)
- [ ] Strava shows the correct app name and requested permissions
- [ ] After granting access, browser redirects back to `http://localhost:3000/dashboard`
- [ ] Dashboard displays the athlete's real name from Strava
- [ ] No errors in browser console or server logs

---

## US2 — Returning User Auto-Login

- [ ] After logging in, close the browser tab and reopen `http://localhost:3000`
- [ ] App redirects directly to `/dashboard` without showing the landing page
- [ ] Athlete name is still shown correctly (session persisted)
- [ ] Visiting `http://localhost:3000` while logged in redirects to `/dashboard`

---

## US3 — Login Denial

- [ ] Click "Connect with Strava" on the landing page
- [ ] On Strava's authorization page, click "Cancel" or deny access
- [ ] App returns to the landing page (not a blank page or error)
- [ ] A friendly error message is displayed explaining authorization is required
- [ ] Clicking "Connect with Strava" again restarts the flow cleanly

---

## US4 — Logout

- [ ] While logged in, clicking "Logout" on the dashboard clears the session
- [ ] Browser redirects to the landing page after logout
- [ ] Navigating to `http://localhost:3000/dashboard` after logout redirects to `/`
- [ ] No stale session data remains (opening a new tab shows landing page)

---

## Edge Cases

- [ ] Visiting `http://localhost:3000/dashboard` without being logged in redirects to `/`
- [ ] Visiting `http://localhost:3000/?error=OAuthError` shows a generic error message
- [ ] App handles Strava being slow or unavailable gracefully (no unhandled crash)

---

## Notes

_Add any observations, issues found, or browser/device details here before signing off._

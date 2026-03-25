# Manual Testing Checklist: Strava OAuth Login

**Purpose**: Human-in-the-loop verification before merging to main
**Feature**: [spec.md](../spec.md)
**Environment**: Local dev (`npm run dev`) with real Strava credentials in `.env.local`

---

## Setup

- [x] `npm run dev` starts without errors
- [x] `.env.local` has valid Strava credentials
- [x] Browser DevTools open to monitor network requests and console errors

---

## US1 — First-Time Login

- [x] Visiting `http://localhost:3000` shows the landing page with "Connect with Strava" button
- [x] Clicking "Connect with Strava" shows a loading state ("Connecting…") and disables the button
- [x] Browser redirects to Strava's authorization page (`strava.com`)
- [x] Strava shows the correct app name and requested permissions
- [x] After granting access, browser redirects back to `http://localhost:3000/dashboard`
- [x] Dashboard displays the athlete's real name from Strava
- [x] No errors in browser console or server logs

---

## US2 — Returning User Auto-Login

- [x] After logging in, close the browser tab and reopen `http://localhost:3000`
- [x] App redirects directly to `/dashboard` without showing the landing page
- [x] Athlete name is still shown correctly (session persisted)
- [x] Visiting `http://localhost:3000` while logged in redirects to `/dashboard`

---

## US3 — Login Denial

- [x] Click "Connect with Strava" on the landing page
- [x] On Strava's authorization page, click "Cancel" or deny access — **Note: Strava does not show a Cancel button; denial simulated via `/?error=access_denied`**
- [x] App returns to the landing page (not a blank page or error)
- [x] A friendly error message is displayed explaining authorization is required
- [x] Clicking "Connect with Strava" again restarts the flow cleanly

---

## US4 — Logout

- [x] While logged in, clicking "Logout" on the dashboard clears the session
- [x] Browser redirects to the landing page after logout
- [x] Navigating to `http://localhost:3000/dashboard` after logout redirects to `/`
- [x] No stale session data remains (opening a new tab shows landing page)

---

## Edge Cases

- [x] Visiting `http://localhost:3000/dashboard` without being logged in redirects to `/`
- [x] Visiting `http://localhost:3000/?error=OAuthError` shows a generic error message
- [x] App handles Strava being slow or unavailable gracefully (no unhandled crash)

---

## Notes

_Add any observations, issues found, or browser/device details here before signing off._

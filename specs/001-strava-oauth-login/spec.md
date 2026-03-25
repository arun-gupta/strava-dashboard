# Feature Specification: Strava OAuth Login

**Feature Branch**: `001-strava-oauth-login`
**Created**: 2026-03-24
**Status**: Draft
**Input**: User description: "Strava OAuth login — athlete authenticates with Strava, app receives access token, session is created, and athlete is redirected to the dashboard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time Login (Priority: P1)

A runner visits the app for the first time and sees a landing page with a "Connect with Strava" button. They click it, are redirected to Strava's authorization page, grant permission, and are brought back to the dashboard showing their data.

**Why this priority**: This is the entry point for all other functionality. Without authentication, no data can be accessed.

**Independent Test**: Can be fully tested by clicking "Connect with Strava", completing Strava authorization, and verifying the athlete lands on the dashboard with their name displayed.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor on the landing page, **When** they click "Connect with Strava", **Then** they are redirected to Strava's authorization page
2. **Given** an athlete on Strava's authorization page, **When** they grant permission, **Then** they are redirected back to the app and land on the dashboard
3. **Given** an athlete who has granted permission, **When** the redirect completes, **Then** a session is created and the athlete's name is visible on the dashboard

---

### User Story 2 - Returning User Auto-Login (Priority: P2)

A runner who has previously authenticated visits the app again. Their session is still valid and they are taken directly to the dashboard without needing to log in again.

**Why this priority**: Improves experience for repeat users; avoids friction on every visit.

**Independent Test**: Can be tested by logging in, closing the browser, reopening, and verifying the athlete is taken directly to the dashboard without re-authenticating.

**Acceptance Scenarios**:

1. **Given** an athlete with a valid session, **When** they visit the app, **Then** they are taken directly to the dashboard without being prompted to log in
2. **Given** an athlete with an expired session, **When** they visit the app, **Then** they are redirected to the landing page to log in again

---

### User Story 3 - Login Denial (Priority: P3)

An athlete clicks "Connect with Strava" but decides to deny the permission request on Strava's authorization page. They are returned to the app with a clear, friendly message explaining they need to authorize to use the app.

**Why this priority**: Edge case that must be handled gracefully to avoid a broken experience.

**Independent Test**: Can be tested by initiating the OAuth flow and clicking "Deny" on Strava's authorization page.

**Acceptance Scenarios**:

1. **Given** an athlete on Strava's authorization page, **When** they deny permission, **Then** they are returned to the landing page with a message explaining authorization is required
2. **Given** the denial message is shown, **When** the athlete clicks "Connect with Strava" again, **Then** the authorization flow restarts cleanly

---

### User Story 4 - Logout (Priority: P3)

An authenticated athlete clicks a logout button. Their session is cleared and they are returned to the landing page.

**Why this priority**: Basic security requirement; users must be able to end their session.

**Independent Test**: Can be tested by logging in, clicking logout, and verifying the session is cleared and the landing page is shown.

**Acceptance Scenarios**:

1. **Given** an authenticated athlete on the dashboard, **When** they click "Logout", **Then** their session is cleared and they are redirected to the landing page
2. **Given** a logged-out athlete, **When** they try to access the dashboard URL directly, **Then** they are redirected to the landing page

---

### Edge Cases

- What happens when Strava's authorization service is temporarily unavailable?
- How does the system handle an expired or revoked Strava access token mid-session?
- What if the athlete grants permission but the callback fails due to a network error?
- What happens when the same athlete connects from two different browsers simultaneously?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a landing page with a "Connect with Strava" call-to-action for unauthenticated visitors
- **FR-002**: System MUST redirect athletes to Strava's official authorization page when they initiate login
- **FR-003**: System MUST handle the OAuth callback from Strava and create a secure session upon successful authorization
- **FR-004**: System MUST redirect authenticated athletes to the dashboard after successful login
- **FR-005**: System MUST handle authorization denial gracefully and display a user-friendly message
- **FR-006**: System MUST provide a logout mechanism that fully clears the athlete's session
- **FR-007**: System MUST protect dashboard routes so unauthenticated users are redirected to the landing page
- **FR-008**: System MUST refresh expired access tokens automatically without requiring the athlete to re-authenticate
- **FR-009**: System MUST display a user-friendly error message if the OAuth flow fails due to an external error

### Key Entities

- **Athlete**: A Strava user who authenticates with the app; identified by their Strava athlete ID
- **Session**: A server-side record of an authenticated athlete; includes access token, refresh token, and expiry
- **Access Token**: A short-lived credential issued by Strava used to call the Strava API on behalf of the athlete

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Athletes can complete the full login flow (landing page → Strava authorization → dashboard) in under 30 seconds
- **SC-002**: 95% of login attempts succeed without error on the first try
- **SC-003**: Returning athletes with valid sessions reach the dashboard in under 2 seconds
- **SC-004**: All dashboard routes are inaccessible to unauthenticated users — 100% redirect rate to landing page
- **SC-005**: Session expiry and token refresh are handled transparently with no interruption to the athlete's experience

## Assumptions

- Athletes have an active Strava account
- The app is registered as a Strava API application with valid client credentials
- Mobile browser support is in scope; native mobile app is out of scope
- A single athlete role exists — no admin or multi-role support required
- Token refresh uses Strava's standard refresh token flow
- Session duration follows industry-standard practices (e.g., 30-day rolling session)

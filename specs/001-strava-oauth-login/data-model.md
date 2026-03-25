# Data Model: Strava OAuth Login

**Branch**: `001-strava-oauth-login` | **Date**: 2026-03-25

## Entities

### Session (JWT Cookie)

Stored encrypted in a browser cookie via NextAuth.js. Never exposed to client-side JavaScript.

| Field | Type | Description |
|---|---|---|
| `athleteId` | string | Strava athlete ID |
| `name` | string | Athlete's display name |
| `image` | string | Profile photo URL |
| `accessToken` | string | Strava API access token (expires every 6 hours) |
| `refreshToken` | string | Strava refresh token (long-lived) |
| `accessTokenExpires` | number | Unix timestamp of access token expiry |

### Athlete (from Strava API)

Returned by Strava after OAuth authorization. Mapped into the session.

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique Strava athlete ID |
| `firstname` | string | First name |
| `lastname` | string | Last name |
| `profile` | string | URL of profile photo |

## State Transitions

```
Unauthenticated
    │
    ▼ clicks "Connect with Strava"
Redirected to Strava
    │
    ├─── denies ──▶ Unauthenticated (with error message)
    │
    ▼ grants permission
OAuth Callback (server)
    │
    ▼ session created
Authenticated (dashboard)
    │
    ├─── token expires ──▶ Token Refresh (transparent) ──▶ Authenticated
    │
    ▼ clicks "Logout"
Unauthenticated
```

## Validation Rules

- Session is valid only if `accessTokenExpires` is in the future, or a successful token refresh occurs
- If token refresh fails (revoked token), session is invalidated and athlete is redirected to landing page
- Dashboard routes require a valid session — enforced at middleware level before any rendering

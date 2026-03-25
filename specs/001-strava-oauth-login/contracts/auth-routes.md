# Auth Route Contracts

**Branch**: `001-strava-oauth-login` | **Date**: 2026-03-25

## Routes

### GET `/`
- **Access**: Public (unauthenticated)
- **Behavior**: Landing page with "Connect with Strava" button
- **Authenticated redirect**: → `/dashboard`

### GET `/dashboard`
- **Access**: Protected (requires valid session)
- **Behavior**: Athlete dashboard
- **Unauthenticated redirect**: → `/`

### GET `/api/auth/signin`
- **Access**: Public
- **Behavior**: Initiates Strava OAuth flow; redirects to Strava authorization page
- **Handled by**: NextAuth.js

### GET `/api/auth/callback/strava`
- **Access**: Public (Strava callback)
- **Behavior**: Receives OAuth code from Strava, exchanges for tokens, creates session
- **Success redirect**: → `/dashboard`
- **Failure redirect**: → `/?error=OAuthError`
- **Handled by**: NextAuth.js

### GET `/api/auth/signout`
- **Access**: Protected
- **Behavior**: Clears session cookie, redirects to landing page
- **Handled by**: NextAuth.js

## Error States

| Error | URL Parameter | Display |
|---|---|---|
| OAuth denied by athlete | `/?error=access_denied` | "You need to authorize Strava access to use this app." |
| OAuth callback failure | `/?error=OAuthError` | "Something went wrong. Please try again." |
| Token refresh failed | Session invalidated → `/` | Landing page (no error message needed) |

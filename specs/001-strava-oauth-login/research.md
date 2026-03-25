# Research: Strava OAuth Login

**Branch**: `001-strava-oauth-login` | **Date**: 2026-03-25

## Decision 1: NextAuth.js Version

- **Decision**: NextAuth.js v5 (beta, also called Auth.js)
- **Rationale**: v5 is designed for Next.js App Router. It uses a single `auth()` function that works in Server Components, API routes, and middleware — no need for `getServerSession()` workarounds. It's the recommended path for Next.js 15.
- **Alternatives considered**: NextAuth.js v4 — works but requires `getServerSession()` boilerplate and is not optimized for App Router.

## Decision 2: Session Strategy (JWT vs Database)

- **Decision**: JWT sessions (default)
- **Rationale**: No database infrastructure needed for v1. JWT sessions are stateless and work out of the box on Vercel. The Strava access token and refresh token are stored encrypted in the session cookie.
- **Alternatives considered**: Database sessions (e.g., with Prisma + PostgreSQL) — more secure for production at scale but adds infrastructure complexity not needed for a personal dashboard.

## Decision 3: Strava Token Refresh

- **Decision**: Handle token refresh in the NextAuth.js `jwt` callback
- **Rationale**: The `jwt` callback runs on every session access. We check if the Strava access token has expired (6-hour TTL) and call Strava's token refresh endpoint before returning the session. This is transparent to the athlete.
- **Alternatives considered**: Refresh on API call failure — reactive approach; causes a failed request before recovery. Proactive refresh in the callback is cleaner.

## Decision 4: Route Protection

- **Decision**: Next.js `middleware.ts` using NextAuth.js `auth` middleware helper
- **Rationale**: Middleware runs at the edge before any page renders, ensuring unauthenticated users are redirected before any data fetching occurs. It's the most performant and reliable approach.
- **Alternatives considered**: Page-level redirect in Server Components — works but adds per-page boilerplate and can cause brief flash of content.

## Decision 5: Strava OAuth Scopes

- **Decision**: Request `read` scope (minimum required)
- **Rationale**: `read` scope provides access to public athlete profile and activities. Sufficient for a running dashboard. Requesting broader scopes unnecessarily reduces user trust.
- **Alternatives considered**: `activity:read_all` — needed if private activities are to be shown. Can be added in a future spec when the activity feature is built.

## Decision 6: Environment Variables

| Variable | Purpose |
|---|---|
| `STRAVA_CLIENT_ID` | Strava API app client ID |
| `STRAVA_CLIENT_SECRET` | Strava API app client secret |
| `NEXTAUTH_SECRET` | Secret for encrypting JWT session cookies |
| `NEXTAUTH_URL` | App base URL (required in production) |

## Resolved Unknowns

- ✅ Session storage: JWT (no database needed for v1)
- ✅ Token refresh: handled in `jwt` callback proactively
- ✅ Route protection: Next.js middleware
- ✅ OAuth scope: `read` (expandable later)
- ✅ NextAuth version: v5 (App Router native)

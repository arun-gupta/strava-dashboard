# Research: Athlete Profile

**Branch**: `002-athlete-profile` | **Date**: 2026-03-25

## Decision 1: Data Fetching Strategy (Server vs Client)

- **Decision**: Server-side data fetching in a Next.js Server Component
- **Rationale**: FR-008 mandates server-side fetching with the session access token. Server Components call the Strava API directly — no API route proxy needed, no token exposure to the browser.
- **Alternatives considered**: Client-side fetch via a Next.js API route — adds a round-trip and unnecessary indirection; token still never reaches the browser but the architecture is more complex than needed.

## Decision 2: Strava API Endpoints

Two Strava API endpoints are required:

| Endpoint | Returns | Used for |
|---|---|---|
| `GET /athlete` | Athlete profile (name, photo, city, country, id) | US1 — profile display |
| `GET /athletes/{id}/stats` | All-time run totals (count, distance, elapsed time) | US2 — stats summary |

Both require a valid access token in the `Authorization: Bearer <token>` header.
The `id` for the stats call is taken from the session (stored during OAuth in spec 001).

## Decision 3: No Caching in v1

- **Decision**: Fetch fresh data on every dashboard load (no caching)
- **Rationale**: Per spec assumptions: "Profile data is fetched fresh on each dashboard load (no caching in v1)." This keeps the implementation simple. Next.js `fetch()` caches by default — we will pass `{ cache: "no-store" }` to opt out.
- **Alternatives considered**: ISR / revalidate — appropriate for v2 if performance becomes a concern.

## Decision 4: Loading State Strategy

- **Decision**: React `Suspense` with a skeleton UI in a Client Component
- **Rationale**: Next.js App Router natively supports Suspense for streaming Server Components. Wrapping the profile card in `<Suspense fallback={<ProfileSkeleton />}>` gives a loading state with zero extra state management.
- **Alternatives considered**: `useState` + `useEffect` in a client component — requires converting the page to a Client Component and duplicates what Suspense handles natively.

## Decision 5: Error State Strategy

- **Decision**: Next.js `error.tsx` boundary at the dashboard segment level + inline fallback in the profile component
- **Rationale**: `error.tsx` catches unhandled server-side errors (e.g. Strava API failure) and renders a friendly message. For partial failures (e.g. stats missing but profile loads), the profile component handles null gracefully inline.
- **Alternatives considered**: Top-level React Error Boundary (as already used in spec 001's `AuthErrorBoundary`) — that covers client rendering errors; `error.tsx` covers server rendering errors, so both are needed.

## Decision 6: Distance and Time Formatting

- **Decision**: Convert in utility functions co-located with the component
- **Rationale**: Strava returns distance in metres (float) and elapsed time in seconds (integer). Conversion to "X km" and "Xh Ym" is pure logic — unit-testable, no dependencies. Co-located helpers keep the component simple.
- **Alternatives considered**: A shared `lib/format.ts` utility — premature for a single feature; can be extracted later if needed across multiple features.

## Decision 7: Fallback Avatar

- **Decision**: Display initials in a styled `<div>` when `profile_medium` is absent or fails to load
- **Rationale**: No external avatar library needed. Simple, reliable, accessible. Uses the athlete's first+last initial.
- **Alternatives considered**: A placeholder image from a CDN — adds an external dependency and requires an internet connection to show even a fallback.

## Resolved Unknowns

- ✅ Fetching: Server Component, no API route proxy
- ✅ Strava endpoints: `GET /athlete` + `GET /athletes/{id}/stats`
- ✅ Caching: none in v1 (`cache: "no-store"`)
- ✅ Loading: React Suspense + skeleton
- ✅ Errors: `error.tsx` + inline null handling
- ✅ Formatting: co-located utility functions
- ✅ Fallback avatar: initials in a styled div

# Research: Activity Filtering and Search

**Branch**: `004-activity-filter-search`
**Date**: 2026-03-26

## Decision 1: Fuzzy vs Exact Search Implementation

**Decision**: Implement both modes in-house with no new dependency.

**Rationale**: With a maximum of 10 activities, there is no performance case for a dedicated search library. The spec defines fuzzy as "finds 'morning run' when typing 'morn'" — this is case-insensitive substring matching, not Levenshtein distance or token ranking. Exact match is case-sensitive substring matching.

- Fuzzy: `activityName.toLowerCase().includes(query.toLowerCase())`
- Exact: `activityName.includes(query)`

**Alternatives considered**:
- `fuse.js` — full fuzzy library, well-maintained. Rejected: overkill for 10 items and adds a dependency for a one-liner.
- `minisearch` — lightweight full-text search. Rejected: same reason.

---

## Decision 2: Filter State Management

**Decision**: `useState` in a `'use client'` wrapper component (`ActivityFilterPanel`). No URL params, no global state.

**Rationale**: The spec explicitly states filters reset on page reload and are not persisted to a URL or local storage in v1. `useState` is the simplest correct tool. The Server Components (`AthleteProfileCard`, `AthleteStatsCard`) are unaffected — only `RecentActivitiesList` needs to become filterable.

**Alternatives considered**:
- URL search params — enables shareable filtered URLs. Rejected: not in scope for v1 per spec assumption.
- `useReducer` — cleaner for complex state. Deferred: three filter fields plus a toggle is manageable with `useState`.
- Zustand / context — global state. Rejected: no cross-component filter sharing needed.

---

## Decision 3: Date Range Input

**Decision**: Native `<input type="date">` for both start and end date.

**Rationale**: No new library. Browser support is universal. The spec makes no styling requirements for the date picker beyond showing a start and end date. YAGNI.

**Alternatives considered**:
- `react-datepicker` — polished UI, more control. Rejected: adds a dependency, no requirement justifies it.
- Custom calendar component — full control over styling. Rejected: significant scope increase for v1.

---

## Decision 4: Component Architecture

**Decision**: Introduce a `ActivityFilterPanel` client component that owns all filter state and passes filtered results down to `ActivityRow`. `RecentActivitiesList` remains a Server Component that fetches data and hands the array to `ActivityFilterPanel`.

**Rationale**: Keeps the Strava fetch server-side (aligns with constitution II). Only the interactive filtering layer is a Client Component. Minimal surface area for `'use client'`.

**Alternatives considered**:
- Convert `RecentActivitiesList` entirely to a Client Component that fetches via an API route. Rejected: moves auth-sensitive token handling to the client, violates constitution II.
- Separate filter utility functions from the component (pure functions). Accepted as part of the design — filter logic lives in `lib/utils/filter.ts` for testability.

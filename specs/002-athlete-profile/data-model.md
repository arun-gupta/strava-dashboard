# Data Model: Athlete Profile

**Branch**: `002-athlete-profile` | **Date**: 2026-03-25

## Entities

### AthleteProfile (from `GET /athlete`)

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique Strava athlete ID |
| `firstname` | string | First name |
| `lastname` | string | Last name |
| `city` | string \| null | City (may not be set) |
| `country` | string \| null | Country (may not be set) |
| `profile_medium` | string | URL of 62x62 profile photo |

### AthleteStats (from `GET /athletes/{id}/stats`)

The full response contains totals for runs, rides, and swims. We extract only the `all_run_totals` object:

| Field | Type | Description |
|---|---|---|
| `count` | number | Total number of runs all-time |
| `distance` | number | Total distance in metres (float) |
| `elapsed_time` | number | Total elapsed time in seconds (integer) |

### Derived / Display Types

```typescript
// Internal display shape — post-formatting
interface AthleteProfileDisplay {
  name: string;           // firstname + " " + lastname
  photoUrl: string | null; // profile_medium, or null → show initials fallback
  location: string | null; // "City, Country" or null if neither set
}

interface AthleteStatsDisplay {
  runCount: number;       // count (zero if no runs)
  distanceKm: string;     // e.g. "1,234.5 km"
  elapsedTime: string;    // e.g. "12h 34m"
}
```

## Formatting Rules

| Raw value | Display rule |
|---|---|
| `distance` (metres) | Divide by 1000, round to 1 decimal: `"1234.5 km"` |
| `elapsed_time` (seconds) | Convert to `"Xh Ym"`: `Math.floor(s/3600)` h, `Math.floor((s%3600)/60)` m |
| `count` = 0 | Display `"0"` — not blank |
| `city` missing, `country` present | Show country only |
| `city` present, `country` missing | Show city only |
| Both missing | `location = null` — hide the field |

## Session Dependency

The `athleteId` stored in the NextAuth.js session (from spec 001) is used directly as the `{id}` path parameter in the stats API call. No new session fields are required.

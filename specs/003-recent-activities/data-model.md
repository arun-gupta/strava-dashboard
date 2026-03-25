# Data Model: Recent Activities

**Branch**: `003-recent-activities` | **Date**: 2026-03-25

## Entities

### Activity (from `GET /athlete/activities`)

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique Strava activity ID |
| `name` | string | Activity name (may be empty) |
| `sport_type` | string | Activity type (preferred field, e.g. `Run`, `Ride`) |
| `type` | string | Legacy activity type (fallback for older activities) |
| `start_date_local` | string | ISO 8601 local start time (e.g. `"2026-03-25T07:30:00Z"`) |
| `distance` | number | Distance in metres (float; 0 for non-distance activities) |
| `elapsed_time` | number | Elapsed time in seconds (integer) |
| `moving_time` | number | Moving time in seconds (integer) |

### Derived / Display Types

```typescript
interface ActivityDisplay {
  id: number;
  name: string;           // activity name, or type label as fallback
  sportType: string;      // e.g. "Run", "MountainBikeRide"
  typeLabel: string;      // human-readable label, e.g. "Mountain Bike"
  icon: IconType;         // react-icons icon component
  date: string;           // e.g. "25 Mar 2026"
  distanceKm: string | null;  // e.g. "12.3 km", or null for zero-distance
  elapsedTime: string;    // e.g. "1h 04m"
  pace: string | null;    // e.g. "5:32 /km", or null for zero-distance
}
```

## Formatting Rules

| Raw value | Display rule |
|---|---|
| `distance` = 0 | `distanceKm = null` → show `—` |
| `distance` > 0 | Reuse `formatDistance()` from `lib/utils/format.ts` |
| `elapsed_time` | Reuse `formatElapsedTime()` from `lib/utils/format.ts` |
| `start_date_local` | `Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })` → `"25 Mar 2026"` |
| Pace (distance > 0) | `elapsed_time / (distance / 1000)` → seconds per km → `"M:SS /km"` |
| Pace (distance = 0) | `pace = null` → show `—` |
| `name` empty | Fall back to `typeLabel` (e.g. `"Run"`, `"Ride"`) |
| Unknown `sport_type` | Split CamelCase → display label; use generic icon |

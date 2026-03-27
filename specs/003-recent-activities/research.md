# Research: Recent Activities

**Branch**: `003-recent-activities` | **Date**: 2026-03-25

## Decision 1: Strava API Endpoint

- **Decision**: `GET /athlete/activities` with `per_page=180`
- **Rationale**: Returns the authenticated athlete's activities in reverse chronological order. The `per_page` parameter limits to the 180 most recent. No pagination needed for v1.
- **Alternatives considered**: `GET /activities/{id}` — fetches a single activity; not suitable for a list.

## Decision 2: Activity Type Icons

- **Decision**: `react-icons` library using the `react-icons/fa6` (Font Awesome 6) icon set
- **Rationale**: Font Awesome 6 has high-quality icons for the most common Strava activity types (running shoe, bicycle, swimmer, hiker, etc.). `react-icons` is a single lightweight dependency that bundles only the icons used. No SVG files to manage manually.
- **Alternatives considered**:
  - Emoji — zero dependency but inconsistent rendering across platforms/OS versions; can look unprofessional
  - Custom SVGs — full control but significant maintenance burden for 10+ activity types
  - Heroicons — excellent general icons but lacks sport-specific icons (no running shoe, swimmer, etc.)

## Decision 3: Activity Type → Icon and Label Mapping

A static mapping is defined in `lib/utils/activity.ts`. Strava returns `sport_type` (preferred) with `type` as fallback for older activities.

| `sport_type` | Icon | Display Label |
|---|---|---|
| `Run` | FaPersonRunning | Run |
| `TrailRun` | FaPersonRunning | Trail Run |
| `VirtualRun` | FaPersonRunning | Virtual Run |
| `Ride` | FaBicycle | Ride |
| `MountainBikeRide` | FaBicycle | Mountain Bike |
| `GravelRide` | FaBicycle | Gravel Ride |
| `EBikeRide` | FaBicycle | E-Bike Ride |
| `VirtualRide` | FaBicycle | Virtual Ride |
| `Swim` | FaPersonSwimming | Swim |
| `Hike` | FaPersonHiking | Hike |
| `Walk` | FaPersonWalking | Walk |
| `AlpineSki` | FaPersonSkiing | Alpine Ski |
| `NordicSki` | FaPersonSkiing | Nordic Ski |
| `BackcountrySki` | FaPersonSkiing | Backcountry Ski |
| `Snowboard` | FaPersonSnowboarding | Snowboard |
| `WeightTraining` | FaDumbbell | Weight Training |
| `Workout` | FaDumbbell | Workout |
| `Yoga` | FaPersonArmsOpen | Yoga |
| `Rowing` | FaWater | Rowing |
| `Kayaking` | FaWater | Kayaking |
| `StandUpPaddling` | FaWater | Stand Up Paddling |
| `Surfing` | FaWater | Surfing |
| `Soccer` | FaFutbol | Soccer |
| *(unknown)* | FaBolt | Activity |

CamelCase `sport_type` values are split into display labels using a utility function (e.g. `MountainBikeRide` → "Mountain Bike Ride") as a fallback for unmapped types.

## Decision 4: Pace Calculation

- **Decision**: Pace = `elapsed_time / distance` in min/km, formatted as `M:SS /km`
- **Rationale**: Standard runner/cyclist metric. Simple division — no library needed.
- **Zero distance**: Return `null` — display `—` in the UI (strength training, yoga, etc.)
- **Alternatives considered**: `moving_time` instead of `elapsed_time` — moving time excludes pauses and is arguably more accurate for pace, but `elapsed_time` is consistent with what we already display for total time.

## Decision 5: Date Formatting

- **Decision**: Use the browser's `Intl.DateTimeFormat` via a utility function — `"25 Mar 2026"` format
- **Rationale**: No extra dependency; `Intl` is available in all modern browsers and Node.js. Consistent with the spec's example format.
- **Alternatives considered**: `date-fns` — excellent library but an extra dependency for what is a simple formatting need.

## Decision 6: Reuse Existing Utilities

- `formatDistance()` and `formatElapsedTime()` from `lib/utils/format.ts` (spec 002) are reused directly.
- `fetchAthleteStats()` pattern in `lib/strava.ts` is extended with `fetchRecentActivities()`.

## Resolved Unknowns

- ✅ Endpoint: `GET /athlete/activities?per_page=180`
- ✅ Icons: `react-icons` / Font Awesome 6
- ✅ Type mapping: static map in `lib/utils/activity.ts` with CamelCase fallback
- ✅ Pace: `elapsed_time / distance`, null for zero-distance activities
- ✅ Date: `Intl.DateTimeFormat`, no extra dependency
- ✅ Reuse: `formatDistance`, `formatElapsedTime` from spec 002

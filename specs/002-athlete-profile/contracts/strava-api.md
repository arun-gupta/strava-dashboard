# API Contracts: Strava Athlete Endpoints

**Branch**: `002-athlete-profile` | **Date**: 2026-03-25

## GET /athlete

Returns the authenticated athlete's profile.

**Request**

```
GET https://www.strava.com/api/v3/athlete
Authorization: Bearer <access_token>
```

**Response (200 OK) — fields used**

```json
{
  "id": 12345678,
  "firstname": "Jane",
  "lastname": "Doe",
  "city": "London",
  "country": "United Kingdom",
  "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/12345678/photo.jpg"
}
```

**Fields consumed**

| Field | Required | Notes |
|---|---|---|
| `id` | Yes | Stored in session already (spec 001) |
| `firstname` | Yes | Combined with `lastname` for display |
| `lastname` | Yes | Combined with `firstname` for display |
| `city` | No | May be empty string or absent — treat as null |
| `country` | No | May be empty string or absent — treat as null |
| `profile_medium` | No | May be absent — show initials fallback |

---

## GET /athletes/{id}/stats

Returns all-time activity totals for the athlete.

**Request**

```
GET https://www.strava.com/api/v3/athletes/{id}/stats
Authorization: Bearer <access_token>
```

**Response (200 OK) — fields used**

```json
{
  "all_run_totals": {
    "count": 312,
    "distance": 2345678.9,
    "elapsed_time": 864000
  }
}
```

**Fields consumed**

| Field | Required | Notes |
|---|---|---|
| `all_run_totals.count` | Yes | Default to 0 if missing |
| `all_run_totals.distance` | Yes | Metres (float) — convert to km |
| `all_run_totals.elapsed_time` | Yes | Seconds (int) — convert to "Xh Ym" |

**Error responses**

| Status | Meaning | Handling |
|---|---|---|
| 401 | Token expired or invalid | NextAuth token refresh should prevent this; if it occurs, `error.tsx` shows friendly message |
| 404 | Athlete not found | Should not occur if `athleteId` is from session; treat as error state |
| 429 | Rate limit exceeded | Treat as error state |
| 5xx | Strava server error | Treat as error state |

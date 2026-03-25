# API Contracts: Strava Activities Endpoint

**Branch**: `003-recent-activities` | **Date**: 2026-03-25

## GET /athlete/activities

Returns the authenticated athlete's activities in reverse chronological order.

**Request**

```
GET https://www.strava.com/api/v3/athlete/activities?per_page=10
Authorization: Bearer <access_token>
```

**Query parameters used**

| Parameter | Value | Description |
|---|---|---|
| `per_page` | `10` | Number of activities to return |

**Response (200 OK) — fields used**

```json
[
  {
    "id": 987654321,
    "name": "Morning Run",
    "sport_type": "Run",
    "type": "Run",
    "start_date_local": "2026-03-25T07:30:00Z",
    "distance": 10234.5,
    "elapsed_time": 3720,
    "moving_time": 3650
  },
  {
    "id": 987654320,
    "name": "Evening Ride",
    "sport_type": "Ride",
    "type": "Ride",
    "start_date_local": "2026-03-24T18:00:00Z",
    "distance": 32100.0,
    "elapsed_time": 5400,
    "moving_time": 5200
  }
]
```

**Fields consumed**

| Field | Required | Notes |
|---|---|---|
| `id` | Yes | Unique key for React list rendering |
| `name` | No | May be empty string — fall back to type label |
| `sport_type` | Yes (preferred) | Used for icon and label mapping |
| `type` | Yes (fallback) | Legacy field for older activities |
| `start_date_local` | Yes | Local time — used for date display |
| `distance` | Yes | Metres (float); 0 for non-distance activities |
| `elapsed_time` | Yes | Seconds (integer) |

**Error responses**

| Status | Meaning | Handling |
|---|---|---|
| 401 | Token expired | NextAuth token refresh should prevent; show error state if it occurs |
| 429 | Rate limit exceeded | Show error state |
| 5xx | Strava server error | Show error state |

**Empty response**

If the athlete has no activities, the API returns an empty array `[]`. This is a valid 200 response — render the empty state component.

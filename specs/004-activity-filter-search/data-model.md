# Data Model: Activity Filtering and Search

**Branch**: `004-activity-filter-search`
**Date**: 2026-03-26

## Entities

### ActivityFilter

The combined client-side state controlling which activities are visible.

| Field         | Type                  | Description                                              |
|---------------|-----------------------|----------------------------------------------------------|
| `types`       | `string[]`            | Selected activity types (e.g. `["Run", "Ride"]`). Empty array means no filter active — show all. |
| `searchQuery` | `string`              | Text entered in the search box. Empty string means no search active. |
| `matchMode`   | `"fuzzy" \| "exact"`  | Whether search applies case-insensitive substring (fuzzy) or case-sensitive substring (exact) matching. Default: `"fuzzy"`. |
| `startDate`   | `string \| null`      | ISO date string (YYYY-MM-DD) for range start. Null means no lower bound. |
| `endDate`     | `string \| null`      | ISO date string (YYYY-MM-DD) for range end. Null means no upper bound. |

**Initial state**:
```ts
{
  types: [],
  searchQuery: "",
  matchMode: "fuzzy",
  startDate: null,
  endDate: null,
}
```

---

### FilteredActivityList

The output of applying an `ActivityFilter` to the full activity list.

| Field        | Type              | Description                          |
|--------------|-------------------|--------------------------------------|
| `activities` | `StravaActivity[]` | Activities passing all active filters |
| `total`      | `number`          | Total activities before filtering (always 10 or fewer) |
| `filtered`   | `number`          | Number of activities currently visible |

---

## Filter Logic

All conditions are AND-ed: an activity must satisfy every active filter to appear.

### Type filter
Active when `types.length > 0`. Activity must have a `sport_type` that maps to one of the selected type labels.

### Search filter
Active when `searchQuery.length > 0`.
- **Fuzzy**: `activity.name.toLowerCase().includes(query.toLowerCase())`
- **Exact**: `activity.name.includes(query)`
- Activities with no name (`""` or null) are excluded when search is active.

### Date filter
Active when `startDate` or `endDate` is set.
- Activity date is derived from `start_date_local` (ISO string, date portion only).
- `startDate`: activity date >= startDate
- `endDate`: activity date <= endDate
- If startDate > endDate: no activities pass (renders empty state + validation hint).

---

## Type Options

Derived dynamically from the current activity list — only types present in the fetched 10 activities are shown as filter options. Type labels come from the existing `getActivityMeta()` utility (e.g. "Run", "Ride", "Swim", "Hike").

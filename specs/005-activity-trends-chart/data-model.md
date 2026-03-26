# Data Model: Activity Trends Chart

**Branch**: `005-activity-trends-chart`
**Date**: 2026-03-26

## Entities

### TrendPeriod

A single bar on the composed chart.

| Field      | Type     | Description                                              |
|------------|----------|----------------------------------------------------------|
| `label`    | `string` | Display label for the x-axis (e.g. "Mar 20" or "Mar 2026") |
| `duration` | `number` | Total elapsed time in minutes for this period (0 for empty periods) |

### TrendFilter

The current state of the trends chart.

| Field          | Type                    | Description                                              |
|----------------|-------------------------|----------------------------------------------------------|
| `grouping`     | `"weekly" \| "monthly"` | Whether to group by week or month. Default: `"weekly"`.  |
| `activityType` | `string \| null`        | Selected activity type filter. Null means show all types.|

**Initial state**:
```ts
{
  grouping: "weekly",
  activityType: null,
}
```

### HeatmapDay

A single cell in the activity heatmap.

| Field              | Type     | Description                                              |
|--------------------|----------|----------------------------------------------------------|
| `date`             | `string` | ISO date string (YYYY-MM-DD)                             |
| `totalElapsedTime` | `number` | Sum of elapsed_time (seconds) for all activities on this day. 0 for inactive days. |
| `count`            | `number` | Number of activities on this day. 0 for inactive days.  |

---

## Transformation Logic

### groupByWeek(activities, activityType?)

1. Filter by `activityType` if provided (match on `sport_type`)
2. Find the Monday of the week containing the earliest activity
3. Find the Monday of the week containing the latest activity
4. For each week in that range, sum `elapsed_time` (converted to minutes) of activities whose `start_date_local` falls in the week
5. Return `TrendPeriod[]` with label format "MMM D" (e.g. "Mar 20") for the week's Monday

### groupByMonth(activities, activityType?)

1. Filter by `activityType` if provided
2. Find the earliest and latest calendar months spanned by the activities
3. For each month in that range, sum `elapsed_time` (converted to minutes) of activities in that month
4. Return `TrendPeriod[]` with label format "MMM YYYY" (e.g. "Mar 2026")

### buildHeatmap(activities)

1. Find the earliest and latest `start_date_local` dates across all activities
2. Generate one `HeatmapDay` entry for every calendar day in that range
3. For each day, sum `elapsed_time` of all activities whose `start_date_local` date portion matches
4. Return `HeatmapDay[]` ordered chronologically

### Intensity Buckets (heatmap colouring)

Given the max `totalElapsedTime` across all days in the dataset:

| Level   | Condition                          | Tailwind class    |
|---------|------------------------------------|-------------------|
| Empty   | `totalElapsedTime === 0`           | `bg-gray-100`     |
| Low     | `> 0` and `<= 33%` of max         | `bg-orange-200`   |
| Medium  | `> 33%` and `<= 66%` of max       | `bg-orange-400`   |
| High    | `> 66%` of max                    | `bg-orange-600`   |

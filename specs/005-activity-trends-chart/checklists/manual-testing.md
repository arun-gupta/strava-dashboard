# Manual Testing Checklist: Activity Trends Chart

**Feature**: 005-activity-trends-chart
**Tester**: Arun Gupta
**Date**: 2026-03-26

Sign off each item with `[x]` after verifying with real Strava credentials.

---

## Setup

- [x] App is running locally (`npm run dev`)
- [x] Signed in with Strava (at least 2 activities across different weeks)
- [x] Dashboard page loads without errors

---

## Tab Navigation

- [x] "Activities" and "Trends & Heatmap" tabs are visible below the "Recent Activities" heading
- [x] "Activities" tab is active by default
- [x] Clicking "Trends & Heatmap" switches to the chart and heatmap view
- [x] Clicking "Activities" switches back to the filter panel

---

## US1: Weekly Duration Chart with Trend Line

- [x] On the "Trends & Heatmap" tab, a chart card is visible
- [x] Chart shows one bar per week of activity data
- [x] Each non-zero bar has a duration label above it (e.g. "1h 7m")
- [x] A trend line overlays the bars connecting their midpoints
- [x] Header shows total duration summary (e.g. "3h 20m across 2 weeks")
- [x] Weekly toggle button is visually active by default

---

## US2: Toggle Weekly / Monthly

- [x] Both "Weekly" and "Monthly" toggle buttons are visible
- [x] Clicking "Monthly" regroups bars by calendar month
- [x] Monthly header updates (e.g. "3h 20m across 1 month")
- [x] Clicking "Weekly" restores the weekly view
- [x] Toggle re-renders without a page reload

---

## US3: Activity Type Filter

- [x] Type filter buttons appear (one per unique sport_type in your activities)
- [x] Selecting a type (e.g. "Run") filters the chart to show only that type's elapsed time
- [x] Selecting "WeightTraining" (or another zero-distance type) shows bars with duration
- [x] Header duration updates to reflect the filtered total
- [x] Clicking the same type button again clears the filter (restores all types)
- [x] Filter works in both weekly and monthly view

---

## US4: Activity Heatmap

- [x] A heatmap card is visible on the "Trends & Heatmap" tab below the chart
- [x] Every day in the date range has a cell
- [x] Inactive days show as light grey
- [x] Active days are highlighted in orange
- [x] Days with more elapsed time show darker orange than days with less elapsed time
- [x] Hovering over an active cell shows a tooltip with date and elapsed time
- [x] Hovering over an inactive cell shows no tooltip

---

## Edge Cases

- [x] Empty state: filter to a sport type with no activities — chart shows "No activities match the selected filter" (not a crash)
- [x] Single activity: chart shows one bar, trend line is a single point, heatmap shows one day
- [x] All activities in the same week: chart shows one bar in weekly view, one bar in monthly view

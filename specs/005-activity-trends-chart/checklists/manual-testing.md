# Manual Testing Checklist: Activity Trends Chart

**Feature**: 005-activity-trends-chart
**Tester**: —
**Date**: —

Sign off each item with `[x]` after verifying with real Strava credentials.

---

## Setup

- [ ] App is running locally (`npm run dev`)
- [ ] Signed in with Strava (at least 2 activities across different weeks)
- [ ] Dashboard page loads without errors

---

## US1: Weekly Distance Chart with Trend Line

- [ ] A chart card appears below the activity filter panel
- [ ] Chart shows one bar per week of activity data
- [ ] Each non-zero bar has a distance label above it (e.g. "15.0")
- [ ] A trend line overlays the bars connecting their midpoints
- [ ] Header shows total distance summary (e.g. "42.5 km across 4 weeks")
- [ ] Weekly toggle button is visually active by default

---

## US2: Toggle Weekly / Monthly

- [ ] Both "Weekly" and "Monthly" toggle buttons are visible
- [ ] Clicking "Monthly" regroups bars by calendar month
- [ ] Monthly header updates (e.g. "42.5 km across 2 months")
- [ ] Clicking "Weekly" restores the weekly view
- [ ] Toggle re-renders without a page reload

---

## US3: Activity Type Filter

- [ ] Type filter buttons appear (one per unique sport_type in your activities)
- [ ] Selecting a type (e.g. "Run") filters the chart to show only running distance
- [ ] Header distance updates to reflect filtered total
- [ ] Clicking the same type button again clears the filter (restores all types)
- [ ] Filter works in both weekly and monthly view

---

## US4: Activity Heatmap

- [ ] A heatmap card appears below the trends chart
- [ ] Every day in the date range has a cell
- [ ] Inactive days show as light grey (`bg-gray-100`)
- [ ] Active days are highlighted in orange
- [ ] Days with more elapsed time show darker orange than days with less elapsed time
- [ ] Hovering over an active cell shows a tooltip with date and elapsed time
- [ ] Hovering over an inactive cell shows no tooltip

---

## Edge Cases

- [ ] Empty state: filter to a sport type with no activities — chart shows "No activities match the selected filter" (not a crash)
- [ ] Single activity: chart shows one bar, trend line is a single point, heatmap shows one day
- [ ] All activities in the same week: chart shows one bar in weekly view, one bar in monthly view

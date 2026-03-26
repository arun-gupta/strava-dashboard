# Quickstart: Activity Trends Chart

**Branch**: `005-activity-trends-chart`

## Prerequisites

- Completed specs 001–004 (OAuth, athlete profile, recent activities, filter/search)
- `.env.local` configured with Strava credentials and NextAuth secret
- At least 2 activities across different weeks for meaningful chart testing

## Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and sign in with Strava. The dashboard will show the trends chart and heatmap below the activity filter panel.

## Run Tests

```bash
# Unit tests
npm test

# Watch mode during development
npm run test:watch
```

## Test the Charts Manually

1. **Weekly chart** — verify bars appear with distance labels above each non-zero bar and a trend line overlay
2. **Total summary** — verify the header shows total distance and period count (e.g. "42.5 km across 4 weeks")
3. **Monthly toggle** — click "Monthly" and verify bars regroup by calendar month
4. **Type filter** — select a single sport type and verify the chart updates to show only that type's distance
5. **Heatmap** — verify active days are highlighted with intensity reflecting elapsed time
6. **Heatmap tooltip** — hover over an active day and verify date and elapsed time appear
7. **Empty state** — filter to a type with no activities and verify an empty state message appears

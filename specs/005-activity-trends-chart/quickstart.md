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

Visit `http://localhost:3000` and sign in with Strava. The dashboard shows two tabs under Recent Activities: **Activities** (filter panel) and **Trends & Heatmap** (chart + heatmap).

## Run Tests

```bash
# Unit tests
npm test

# Watch mode during development
npm run test:watch
```

## Test the Charts Manually

1. **Tab navigation** — verify "Activities" and "Trends & Heatmap" tabs are visible; clicking each switches the content instantly
2. **Weekly chart** — on the Trends tab, verify bars appear with duration labels above each non-zero bar and a trend line overlay
3. **Total summary** — verify the header shows total elapsed time and period count (e.g. "3h 20m across 2 weeks")
4. **Monthly toggle** — click "Monthly" and verify bars regroup by calendar month
5. **Type filter** — select a sport type (including zero-distance types like Weight Training) and verify the chart updates
6. **Heatmap** — verify active days are highlighted with intensity reflecting elapsed time
7. **Heatmap tooltip** — hover over an active day and verify date and elapsed time appear
8. **Empty state** — filter to a type with no activities and verify an empty state message appears

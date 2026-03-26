# Strava Dashboard

**[Live Demo →](https://strava-dashboard-arungupta.vercel.app)**

A web application that visualizes Strava activity data for runners. Authenticate with your Strava account and get insights into your running performance.

Built following [SpecKit](https://github.com/github/spec-kit) Specification-Driven Development (SDD) — every feature starts with a spec, is planned before implementation, and developed test-first.

## Features

- **OAuth authentication with Strava** — secure sign-in with automatic token refresh
- **Athlete profile** — displays your Strava profile photo, name, and location on the dashboard
- **All-time running stats** — total run count, total distance (km), and total elapsed time at a glance
- **Recent activities** — last 10 activities with type icon, name, date, distance, pace, and elapsed time; each links to the Strava activity page
- **Filtering and search** — filter activities by type (multi-select), search by name (fuzzy or exact match), and filter by date range; all filters compose simultaneously
- **Activity trends chart and heatmap** — tabbed view with bar chart and trend line showing weekly or monthly elapsed time totals, activity type filter (including zero-distance types like Weight Training), and a day-by-day heatmap showing training consistency with intensity colouring based on elapsed time

## Getting Started

### Prerequisites

- Node.js 18+
- A [Strava API application](https://www.strava.com/settings/api)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/arun-gupta/strava-dashboard.git
   cd strava-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your Strava API credentials in `.env.local`:
   ```
   STRAVA_CLIENT_ID=your_client_id
   STRAVA_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript
- **Auth**: NextAuth.js with Strava OAuth
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Vercel

## Docs

- [Development Guide](docs/development.md) — running tests, project structure, SpecKit workflow
- [Deployment Guide](docs/deployment.md) — deploying to Vercel (includes Strava callback domain switching)

## License

MIT

# Strava Dashboard

A modern web application that visualizes Strava activity data for runners. Authenticate with your Strava account and get insights into your running performance.

This project is built following [SpecKit](https://github.com/github/spec-kit) Specification-Driven Development (SDD), where every feature starts with a spec, is planned before implementation, and is developed test-first.

## Features

- **OAuth authentication with Strava** — secure sign-in with automatic token refresh
- **Athlete profile** — displays your Strava profile photo, name, and location on the dashboard
- **All-time running stats** — total run count, total distance (km), and total elapsed time at a glance

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript
- **Auth**: NextAuth.js with Strava OAuth
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Vercel

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

## Development

### Running Tests

```bash
# Unit and integration tests
npm run test

# E2E tests
npm run test:e2e
```

### Project Structure

```
strava-dashboard/
├── app/
│   ├── api/auth/         # NextAuth.js route handler
│   ├── dashboard/        # Protected dashboard page
│   ├── layout.tsx        # Root layout with SessionProvider
│   └── page.tsx          # Landing page
├── components/
│   ├── athlete/          # AthleteProfileCard, AthleteStatsCard, AthleteProfileSkeleton
│   ├── auth/             # LoginButton, LogoutButton
│   └── ui/               # ErrorMessage, AuthErrorBoundary
├── lib/
│   ├── auth.ts           # NextAuth.js config, Strava provider, token refresh
│   ├── strava.ts         # Strava API client (fetchAthleteProfile, fetchAthleteStats)
│   └── utils/
│       └── format.ts     # formatDistance, formatElapsedTime
├── specs/                # SpecKit SDD specs, plans, and tasks
├── tests/
│   ├── unit/             # Vitest unit tests
│   └── e2e/              # Playwright e2e tests
└── proxy.ts              # Route protection (Next.js 16 Proxy)
```

## Deploying to Vercel

### 1. Connect the repo

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project** and import `arun-gupta/strava-dashboard`
3. Leave all build settings as default — Vercel detects Next.js automatically
4. Click **Deploy** (it will fail — env vars aren't set yet, that's expected)

### 2. Add environment variables

In your Vercel project go to **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `STRAVA_CLIENT_ID` | Your Strava API client ID |
| `STRAVA_CLIENT_SECRET` | Your Strava API client secret |
| `NEXTAUTH_SECRET` | A random secret (run `openssl rand -base64 32` to generate one) |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://strava-dashboard.vercel.app`) |

Then go to **Deployments**, find the latest deployment, click **⋯ → Redeploy**.

### 3. Update Strava API callback URL

1. Go to [strava.com/settings/api](https://www.strava.com/settings/api)
2. Set **Authorization Callback Domain** to your Vercel domain (e.g. `strava-dashboard.vercel.app`) — no `https://`, just the domain

### 4. Verify

Visit your Vercel URL, click **Connect with Strava**, and confirm the full login flow works.

### Subsequent deploys

Every push to `main` automatically triggers a new Vercel deployment — no manual steps needed.

## License

MIT

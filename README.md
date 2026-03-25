# Strava Dashboard

A modern web application that visualizes Strava activity data for runners. Authenticate with your Strava account and get insights into your running performance.

This project is built following [SpecKit](https://github.com/github/spec-kit) Specification-Driven Development (SDD), where every feature starts with a spec, is planned before implementation, and is developed test-first.

## Features

- OAuth authentication with Strava
- Running activity visualizations and stats
- Personal performance trends and insights

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
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
├── app/                  # Next.js App Router pages and layouts
├── components/           # React components
├── lib/                  # Utility functions and API clients
├── tests/                # Unit and integration tests
└── e2e/                  # Playwright e2e tests
```

## Contributing

1. Create a feature branch off `main`
2. Write tests first (TDD)
3. Implement the feature
4. Ensure all tests pass
5. Open a pull request

## License

MIT

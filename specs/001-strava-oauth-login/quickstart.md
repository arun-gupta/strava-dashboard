# Quickstart: Strava OAuth Login

**Branch**: `001-strava-oauth-login` | **Date**: 2026-03-25

## Prerequisites

1. Node.js 18+
2. A Strava API application — register at https://www.strava.com/settings/api
   - Set "Authorization Callback Domain" to `localhost` for development

## Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
```

Fill in `.env.local`:
```
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=any_random_32_char_string
NEXTAUTH_URL=http://localhost:3000
```

Generate a secret:
```bash
openssl rand -base64 32
```

## Run

```bash
npm run dev
```

Open http://localhost:3000 — click "Connect with Strava" to test the login flow.

## Run Tests

```bash
# Unit tests
npm run test

# E2E tests (requires running dev server)
npm run test:e2e
```

## Key Files

| File | Purpose |
|---|---|
| `lib/auth.ts` | NextAuth.js config, Strava provider, token refresh logic |
| `middleware.ts` | Route protection — redirects unauthenticated users |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth.js API route handler |
| `app/page.tsx` | Landing page |
| `app/dashboard/page.tsx` | Protected dashboard page |
| `components/auth/LoginButton.tsx` | "Connect with Strava" button |
| `components/auth/LogoutButton.tsx` | Logout button |

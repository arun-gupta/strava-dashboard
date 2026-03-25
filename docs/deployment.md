# Deploying to Vercel

## 1. Update Strava API callback URL

1. Go to [strava.com/settings/api](https://www.strava.com/settings/api)
2. Set **Authorization Callback Domain** to your Vercel domain only:
   ```
   strava-dashboard-arungupta.vercel.app
   ```

> **Note**: Strava does not support comma-separated domains. Only one domain can be active at a time. This means local dev OAuth will stop working while this is set to the Vercel domain. To switch back to local dev, change this field back to `localhost`.

## 2. Connect the repo and set environment variables

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project** and import `arun-gupta/strava-dashboard`
3. Leave all build settings as default — Vercel detects Next.js automatically
4. Expand **Environment Variables** and click **Import .env** — select your `.env.local` file to import all variables at once
5. Update `NEXTAUTH_URL` to your exact Vercel deployment URL — find it in the project Overview under **Domains** (e.g. `https://strava-dashboard-arungupta.vercel.app`)
6. Click **Deploy**

## 3. Verify

Visit your Vercel URL, click **Connect with Strava**, and confirm the full login flow works.

## Subsequent deploys

Every push to `main` automatically triggers a new Vercel deployment — no manual steps needed.

## Switching between local dev and Vercel

Since Strava only supports one callback domain at a time, toggle the **Authorization Callback Domain** at [strava.com/settings/api](https://www.strava.com/settings/api) depending on where you're working:

| Where you're working | Authorization Callback Domain |
|---|---|
| Local dev (`npm run dev`) | `localhost` |
| Vercel | `strava-dashboard-arungupta.vercel.app` |

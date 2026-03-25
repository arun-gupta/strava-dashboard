# Deploying to Vercel

## 1. Update Strava API callback URL

1. Go to [strava.com/settings/api](https://www.strava.com/settings/api)
2. Set **Authorization Callback Domain** to a comma-separated list of both domains so local dev continues to work:
   ```
   localhost,strava-dashboard.vercel.app
   ```

## 2. Connect the repo and set environment variables

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project** and import `arun-gupta/strava-dashboard`
3. Leave all build settings as default — Vercel detects Next.js automatically
4. Expand **Environment Variables** and click **Import .env** — select your `.env.local` file to import all variables at once
5. Update `NEXTAUTH_URL` to your Vercel deployment URL (e.g. `https://strava-dashboard.vercel.app`)
6. Click **Deploy**

## 3. Verify

Visit your Vercel URL, click **Connect with Strava**, and confirm the full login flow works.

## Subsequent deploys

Every push to `main` automatically triggers a new Vercel deployment — no manual steps needed.

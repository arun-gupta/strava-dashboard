export class StravaAuthError extends Error {
  constructor() {
    super("Strava authentication required");
    this.name = "StravaAuthError";
  }
}

export class StravaRateLimitError extends Error {
  constructor(usage?: string, limit?: string) {
    let detail = "";
    if (usage && limit) {
      const [usedShort, usedDay] = usage.split(",");
      const [limitShort, limitDay] = limit.split(",");
      const now = new Date();
      const msUntilReset = (15 - (now.getMinutes() % 15)) * 60 * 1000 - now.getSeconds() * 1000;
      const resetIn = `${Math.floor(msUntilReset / 60000)}m ${Math.floor((msUntilReset % 60000) / 1000)}s`;
      detail = ` — 15min: ${usedShort}/${limitShort}, day: ${usedDay}/${limitDay}, resets in ${resetIn}`;
    }
    super(`Strava rate limit exceeded${detail}`);
    this.name = "StravaRateLimitError";
  }
}

function logRateLimitHeaders(res: Response, endpoint: string): void {
  if (process.env.NODE_ENV !== "development") return;
  const limit = res.headers?.get("X-RateLimit-Limit");
  const usage = res.headers?.get("X-RateLimit-Usage");
  if (limit && usage) {
    const [usedShort, usedDay] = usage.split(",");
    const [limitShort, limitDay] = limit.split(",");
    const now = new Date();
    const timestamp = now.toTimeString().slice(0, 8);
    const msUntilReset = (15 - (now.getMinutes() % 15)) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
    const resetIn = `${Math.floor(msUntilReset / 60000)}m ${Math.floor((msUntilReset % 60000) / 1000)}s`;
    console.log(
      `[Strava] ${endpoint} — 15min: ${usedShort}/${limitShort}  day: ${usedDay}/${limitDay}  (${timestamp}, resets in ${resetIn})`
    );
  }
}

export interface AthleteProfile {
  id: number;
  firstname: string;
  lastname: string;
  city: string | null;
  country: string | null;
  profile_medium: string | null;
}

export interface AthleteStats {
  all_run_totals: {
    count: number;
    distance: number;
    elapsed_time: number;
  };
}

export interface Activity {
  id: number;
  name: string;
  sport_type: string;
  type: string;
  start_date_local: string;
  distance: number;
  elapsed_time: number;
  moving_time: number;
}

function handleStravaResponse(res: Response, endpoint: string, context: string): void {
  logRateLimitHeaders(res, endpoint);
  if (res.status === 401) {
    throw new StravaAuthError();
  }
  if (res.status === 429) {
    const usage = res.headers?.get("X-RateLimit-Usage") ?? undefined;
    const limit = res.headers?.get("X-RateLimit-Limit") ?? undefined;
    throw new StravaRateLimitError(usage, limit);
  }
  if (!res.ok) {
    throw new Error(`Failed to ${context}: ${res.status}`);
  }
}

export async function fetchAthleteProfile(accessToken: string): Promise<AthleteProfile> {
  const res = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  handleStravaResponse(res, "GET /athlete", "fetch athlete profile");
  return res.json();
}

export async function fetchAthleteStats(
  accessToken: string,
  athleteId: number
): Promise<AthleteStats> {
  const res = await fetch(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  handleStravaResponse(res, `GET /athletes/${athleteId}/stats`, "fetch athlete stats");
  return res.json();
}

export async function fetchRecentActivities(accessToken: string): Promise<Activity[]> {
  const res = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=10", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  handleStravaResponse(res, "GET /athlete/activities", "fetch recent activities");
  return res.json();
}

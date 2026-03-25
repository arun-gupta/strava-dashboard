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

export async function fetchAthleteProfile(accessToken: string): Promise<AthleteProfile> {
  const res = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch athlete profile: ${res.status}`);
  }

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

  if (!res.ok) {
    throw new Error(`Failed to fetch athlete stats: ${res.status}`);
  }

  return res.json();
}

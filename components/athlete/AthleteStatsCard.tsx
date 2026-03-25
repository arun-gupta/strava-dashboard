import { redirect } from "next/navigation";
import { fetchAthleteStats, StravaAuthError } from "@/lib/strava";
import { formatDistance, formatElapsedTime } from "@/lib/utils/format";

interface Props {
  accessToken: string;
  athleteId: number;
}

export default async function AthleteStatsCard({ accessToken, athleteId }: Props) {
  let stats;
  try {
    stats = await fetchAthleteStats(accessToken, athleteId);
  } catch (err) {
    if (err instanceof StravaAuthError) redirect("/api/auth/signout");
    throw err;
  }

  const totals = stats.all_run_totals ?? { count: 0, distance: 0, elapsed_time: 0 };

  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl border border-gray-200">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Runs</p>
        <p className="text-2xl font-bold text-gray-900">{totals.count.toLocaleString("en-US")}</p>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Distance</p>
        <p className="text-2xl font-bold text-gray-900">{formatDistance(totals.distance)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Time</p>
        <p className="text-2xl font-bold text-gray-900">{formatElapsedTime(totals.elapsed_time)}</p>
      </div>
    </div>
  );
}

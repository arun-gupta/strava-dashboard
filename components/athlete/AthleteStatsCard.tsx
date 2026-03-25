import { fetchAthleteStats } from "@/lib/strava";
import { formatDistance, formatElapsedTime } from "@/lib/utils/format";

interface Props {
  accessToken: string;
  athleteId: number;
}

export default async function AthleteStatsCard({ accessToken, athleteId }: Props) {
  const stats = await fetchAthleteStats(accessToken, athleteId);

  const totals = stats.all_run_totals ?? { count: 0, distance: 0, elapsed_time: 0 };

  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl border border-gray-200">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{totals.count}</p>
        <p className="text-sm text-gray-500 mt-1">Runs</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{formatDistance(totals.distance)}</p>
        <p className="text-sm text-gray-500 mt-1">Total Distance</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{formatElapsedTime(totals.elapsed_time)}</p>
        <p className="text-sm text-gray-500 mt-1">Total Time</p>
      </div>
    </div>
  );
}

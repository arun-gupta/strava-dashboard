import { fetchRecentActivities } from "@/lib/strava";
import ActivityRow from "./ActivityRow";

interface Props {
  accessToken: string;
}

export default async function RecentActivitiesList({ accessToken }: Props) {
  const activities = await fetchRecentActivities(accessToken);

  if (activities.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500">No activities yet. Go get moving!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      {activities.map((activity) => (
        <ActivityRow key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

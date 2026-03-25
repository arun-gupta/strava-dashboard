"use client";

import { getActivityMeta, formatPace, formatDate } from "@/lib/utils/activity";
import { formatDistance, formatElapsedTime } from "@/lib/utils/format";
import type { Activity } from "@/lib/strava";

interface ActivityRowProps {
  activity: Activity;
}

export default function ActivityRow({ activity }: ActivityRowProps) {
  const sportType = activity.sport_type || activity.type;
  const { icon: Icon, label } = getActivityMeta(sportType);
  const name = activity.name || label;
  const pace = formatPace(activity.elapsed_time, activity.distance);

  return (
    <a
      href={`https://www.strava.com/activities/${activity.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="text-orange-500 text-xl flex-shrink-0">
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-500">
          <span>{label}</span>
          <span> · </span>
          <span>{formatDate(activity.start_date_local)}</span>
        </p>
      </div>
      <div className="text-right flex-shrink-0 space-y-0.5">
        <p className="text-sm font-medium text-gray-900">
          {activity.distance > 0 ? formatDistance(activity.distance) : "—"}
        </p>
        <p className="text-xs text-gray-500">{formatElapsedTime(activity.elapsed_time)}</p>
        <p className="text-xs text-gray-400">{pace ?? "—"}</p>
      </div>
    </a>
  );
}

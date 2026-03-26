"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Activity } from "@/lib/strava";
import { groupByWeek, groupByMonth } from "@/lib/utils/trends";

interface Props {
  activities: Activity[];
}

export default function ActivityTrendsChart({ activities }: Props) {
  const [grouping, setGrouping] = useState<"weekly" | "monthly">("weekly");
  const [activityType, setActivityType] = useState<string | null>(null);

  const uniqueTypes = useMemo(
    () => Array.from(new Set(activities.map((a) => a.sport_type))).sort(),
    [activities]
  );

  const periods = useMemo(() => {
    const fn = grouping === "weekly" ? groupByWeek : groupByMonth;
    return fn(activities, activityType ?? undefined);
  }, [activities, grouping, activityType]);

  const totalDistance = periods.reduce((sum, p) => sum + p.distance, 0);
  const periodCount = periods.filter((p) => p.distance > 0).length;
  const periodLabel = grouping === "weekly" ? "week" : "month";
  const summaryText = `${totalDistance.toFixed(1)} km across ${periodCount} ${periodLabel}${periodCount !== 1 ? "s" : ""}`;

  function toggleType(type: string) {
    setActivityType((prev) => (prev === type ? null : type));
  }

  const activeToggleClass =
    "px-3 py-1 rounded text-sm font-semibold bg-orange-500 text-white";
  const inactiveToggleClass =
    "px-3 py-1 rounded text-sm border border-gray-300 text-gray-600 hover:bg-gray-50";

  const activeTypeClass =
    "px-2 py-0.5 rounded text-xs font-semibold bg-orange-500 text-white border border-orange-500";
  const inactiveTypeClass =
    "px-2 py-0.5 rounded text-xs border border-gray-300 text-gray-600 hover:bg-gray-50";

  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-400">
        No activities to display.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-gray-600">{summaryText}</span>

        {/* Grouping toggle */}
        <div className="flex gap-1">
          <button
            className={grouping === "weekly" ? activeToggleClass : inactiveToggleClass}
            onClick={() => setGrouping("weekly")}
          >
            Weekly
          </button>
          <button
            className={grouping === "monthly" ? activeToggleClass : inactiveToggleClass}
            onClick={() => setGrouping("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Type filter */}
      {uniqueTypes.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {uniqueTypes.map((type) => (
            <button
              key={type}
              className={activityType === type ? activeTypeClass : inactiveTypeClass}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Empty state when filter yields no data */}
      {periodCount === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          No activities match the selected filter.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={periods} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(1)} km`, "Distance"]} />
            <Bar dataKey="distance" fill="#f97316" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="distance"
                position="top"
                formatter={(v: number) => (v > 0 ? `${v.toFixed(1)}` : "")}
                style={{ fontSize: 10, fill: "#374151" }}
              />
            </Bar>
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#9ca3af"
              strokeDasharray="4 2"
              dot={false}
              strokeWidth={1.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

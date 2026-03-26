"use client";

import { useState, useMemo } from "react";
import type { Activity } from "@/lib/strava";
import { buildHeatmap, type HeatmapDay } from "@/lib/utils/trends";
import { formatElapsedTime } from "@/lib/utils/format";

interface Props {
  activities: Activity[];
}

function intensityClass(day: HeatmapDay, maxElapsed: number): string {
  if (day.totalElapsedTime === 0) return "bg-gray-100";
  const ratio = day.totalElapsedTime / maxElapsed;
  if (ratio <= 0.33) return "bg-orange-200";
  if (ratio <= 0.66) return "bg-orange-400";
  return "bg-orange-600";
}

function formatCellDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function ActivityHeatmap({ activities }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; elapsed: number } | null>(null);

  const days = useMemo(() => buildHeatmap(activities), [activities]);

  const maxElapsed = useMemo(
    () => Math.max(...days.map((d) => d.totalElapsedTime), 0),
    [days]
  );

  if (days.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
      <p className="text-xs text-gray-500 font-medium">Training Consistency</p>
      <div className="relative">
        <div className="flex flex-wrap gap-1">
          {days.map((day) => (
            <div
              key={day.date}
              data-testid="heatmap-cell"
              className={`w-4 h-4 rounded-sm cursor-default ${intensityClass(day, maxElapsed)}`}
              onMouseEnter={() =>
                day.totalElapsedTime > 0
                  ? setTooltip({ date: day.date, elapsed: day.totalElapsedTime })
                  : null
              }
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>

        {tooltip && (
          <div
            data-testid="heatmap-tooltip"
            className="absolute z-10 bottom-full mb-1 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap"
          >
            {formatCellDate(tooltip.date)} — {formatElapsedTime(tooltip.elapsed)}
          </div>
        )}
      </div>
    </div>
  );
}

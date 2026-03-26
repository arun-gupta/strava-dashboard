"use client";

import { useState } from "react";
import type { Activity } from "@/lib/strava";
import ActivityFilterPanel from "./ActivityFilterPanel";
import ActivityTrendsChart from "./ActivityTrendsChart";
import ActivityHeatmap from "./ActivityHeatmap";

interface Props {
  activities: Activity[];
}

type Tab = "activities" | "trends";

export default function ActivityTabs({ activities }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("activities");

  const activeClass =
    "px-4 py-2 text-sm font-semibold border-b-2 border-orange-500 text-orange-600";
  const inactiveClass =
    "px-4 py-2 text-sm text-gray-500 border-b-2 border-transparent hover:text-gray-700";

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={activeTab === "activities" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("activities")}
        >
          Activities
        </button>
        <button
          className={activeTab === "trends" ? activeClass : inactiveClass}
          onClick={() => setActiveTab("trends")}
        >
          Trends &amp; Heatmap
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "activities" ? (
        <ActivityFilterPanel activities={activities} />
      ) : (
        <div className="space-y-4">
          <ActivityTrendsChart activities={activities} />
          <ActivityHeatmap activities={activities} />
        </div>
      )}
    </div>
  );
}

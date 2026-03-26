"use client";

import { useState, useEffect } from "react";
import type { Activity } from "@/lib/strava";
import { getActivityMeta } from "@/lib/utils/activity";
import { filterActivities } from "@/lib/utils/filter";
import ActivityRow from "./ActivityRow";

interface Props {
  activities: Activity[];
  onFilterChange?: (filtered: Activity[]) => void;
}

function getDateBounds(activities: Activity[]): { min: string | null; max: string | null } {
  if (activities.length === 0) return { min: null, max: null };
  const dates = activities.map((a) => a.start_date_local.slice(0, 10)).sort();
  return { min: dates[0], max: dates[dates.length - 1] };
}

export default function ActivityFilterPanel({ activities, onFilterChange }: Props) {
  const { min: minDate, max: maxDate } = getDateBounds(activities);
  const [types, setTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchMode, setMatchMode] = useState<"fuzzy" | "exact">("fuzzy");
  const [startDate, setStartDate] = useState<string | null>(minDate);
  const [endDate, setEndDate] = useState<string | null>(maxDate);

  const uniqueTypes = Array.from(new Set(activities.map((a) => a.sport_type)));

  const filtered = filterActivities(activities, {
    types,
    searchQuery,
    matchMode,
    startDate,
    endDate,
  });

  useEffect(() => {
    onFilterChange?.(filtered);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, types, searchQuery, matchMode, startDate, endDate]);

  const invalidDateRange =
    startDate !== null && endDate !== null && startDate > endDate;

  function toggleType(type: string) {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  return (
    <div>
      {/* Type filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {uniqueTypes.map((type) => {
          const { label } = getActivityMeta(type);
          const active = types.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                active
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activities…"
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
        />
        <button
          onClick={() => setMatchMode((m) => (m === "fuzzy" ? "exact" : "fuzzy"))}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-orange-400 transition-colors"
        >
          {matchMode === "fuzzy" ? "Exact" : "Fuzzy"}
        </button>
      </div>

      {/* Date range */}
      <div className="flex gap-2 mb-2">
        <input
          type="date"
          value={startDate ?? ""}
          onChange={(e) => setStartDate(e.target.value || null)}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
        />
        <input
          type="date"
          value={endDate ?? ""}
          onChange={(e) => setEndDate(e.target.value || null)}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
        />
      </div>

      {invalidDateRange && (
        <p className="text-sm text-red-500 mb-3">Start date must be before end date.</p>
      )}

      {/* Count indicator */}
      <p className="text-sm text-gray-500 mb-3">
        {filtered.length} of {activities.length} activities
      </p>

      {/* Activity list */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No activities match your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filtered.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

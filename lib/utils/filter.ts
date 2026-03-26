import type { Activity } from "@/lib/strava";

export interface ActivityFilter {
  types: string[];
  searchQuery: string;
  matchMode: "fuzzy" | "exact";
  startDate: string | null;
  endDate: string | null;
}

export function filterByType(activities: Activity[], types: string[]): Activity[] {
  if (types.length === 0) return activities;
  return activities.filter((a) => types.includes(a.sport_type));
}

export function filterBySearch(
  activities: Activity[],
  query: string,
  mode: "fuzzy" | "exact"
): Activity[] {
  if (query === "") return activities;
  return activities.filter((a) => {
    if (!a.name) return false;
    if (mode === "fuzzy") return a.name.toLowerCase().includes(query.toLowerCase());
    return a.name.includes(query);
  });
}

export function filterByDateRange(
  activities: Activity[],
  startDate: string | null,
  endDate: string | null
): Activity[] {
  if (!startDate && !endDate) return activities;
  return activities.filter((a) => {
    const date = a.start_date_local.slice(0, 10);
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });
}

export function filterActivities(activities: Activity[], filter: ActivityFilter): Activity[] {
  let result = filterByType(activities, filter.types);
  result = filterBySearch(result, filter.searchQuery, filter.matchMode);
  result = filterByDateRange(result, filter.startDate, filter.endDate);
  return result;
}

import type { Activity } from "@/lib/strava";

export interface TrendPeriod {
  label: string;
  distance: number;
}

export interface HeatmapDay {
  date: string;
  totalElapsedTime: number;
  count: number;
}

/** Returns the Monday of the week containing the given date. */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Formats a UTC date as "MMM D" (e.g. "Mar 20"). */
function formatWeekLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** Formats a UTC date as "MMM YYYY" (e.g. "Mar 2026"). */
function formatMonthLabel(year: number, month: number): string {
  const d = new Date(Date.UTC(year, month, 1));
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

/** Returns "YYYY-MM-DD" from a date string (takes the first 10 chars). */
function toDateStr(dateStr: string): string {
  return dateStr.slice(0, 10);
}

export function groupByWeek(activities: Activity[], activityType?: string): TrendPeriod[] {
  if (activities.length === 0) return [];

  const filtered = activityType
    ? activities.filter((a) => a.sport_type === activityType)
    : activities;

  // Use all activities (not just filtered) to determine the date range
  const allDates = activities.map((a) => new Date(toDateStr(a.start_date_local)));
  const earliest = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const latest = new Date(Math.max(...allDates.map((d) => d.getTime())));

  const startMonday = getMondayOf(earliest);
  const endMonday = getMondayOf(latest);

  // Build a map: monday ISO string → total distance (km)
  const weekMap = new Map<string, number>();

  // Pre-populate all weeks in range with 0
  const cursor = new Date(startMonday);
  while (cursor <= endMonday) {
    weekMap.set(cursor.toISOString(), 0);
    cursor.setUTCDate(cursor.getUTCDate() + 7);
  }

  // Accumulate distances
  for (const activity of filtered) {
    const actDate = new Date(toDateStr(activity.start_date_local));
    const monday = getMondayOf(actDate);
    const key = monday.toISOString();
    weekMap.set(key, (weekMap.get(key) ?? 0) + activity.distance / 1000);
  }

  // Convert to sorted TrendPeriod[]
  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([isoKey, distance]) => ({
      label: formatWeekLabel(new Date(isoKey)),
      distance,
    }));
}

export function groupByMonth(activities: Activity[], activityType?: string): TrendPeriod[] {
  if (activities.length === 0) return [];

  const filtered = activityType
    ? activities.filter((a) => a.sport_type === activityType)
    : activities;

  // Determine range from all activities
  const allDates = activities.map((a) => toDateStr(a.start_date_local));
  const sorted = [...allDates].sort();
  const [earliestStr] = sorted;
  const latestStr = sorted[sorted.length - 1];

  const [eYear, eMon] = earliestStr.split("-").map(Number);
  const [lYear, lMon] = latestStr.split("-").map(Number);

  // Build map: "YYYY-MM" → distance
  const monthMap = new Map<string, number>();
  let y = eYear;
  let m = eMon;
  while (y < lYear || (y === lYear && m <= lMon)) {
    monthMap.set(`${y}-${String(m).padStart(2, "0")}`, 0);
    m++;
    if (m > 12) { m = 1; y++; }
  }

  for (const activity of filtered) {
    const key = toDateStr(activity.start_date_local).slice(0, 7); // "YYYY-MM"
    monthMap.set(key, (monthMap.get(key) ?? 0) + activity.distance / 1000);
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, distance]) => {
      const [year, month] = key.split("-").map(Number);
      return { label: formatMonthLabel(year, month - 1), distance };
    });
}

export function buildHeatmap(activities: Activity[]): HeatmapDay[] {
  if (activities.length === 0) return [];

  const allDates = activities.map((a) => toDateStr(a.start_date_local)).sort();
  const earliestStr = allDates[0];
  const latestStr = allDates[allDates.length - 1];

  // Build a map: "YYYY-MM-DD" → { totalElapsedTime, count }
  const dayMap = new Map<string, { totalElapsedTime: number; count: number }>();

  // Pre-populate all days in range
  const start = new Date(earliestStr + "T00:00:00Z");
  const end = new Date(latestStr + "T00:00:00Z");
  const cur = new Date(start);
  while (cur <= end) {
    dayMap.set(cur.toISOString().slice(0, 10), { totalElapsedTime: 0, count: 0 });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  for (const activity of activities) {
    const key = toDateStr(activity.start_date_local);
    const entry = dayMap.get(key) ?? { totalElapsedTime: 0, count: 0 };
    entry.totalElapsedTime += activity.elapsed_time;
    entry.count += 1;
    dayMap.set(key, entry);
  }

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { totalElapsedTime, count }]) => ({ date, totalElapsedTime, count }));
}

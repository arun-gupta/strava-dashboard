import { describe, it, expect } from "vitest";
import { filterByType, filterBySearch, filterByDateRange, filterActivities } from "@/lib/utils/filter";
import type { Activity } from "@/lib/strava";

const activities: Activity[] = [
  {
    id: 1,
    name: "Morning Run",
    sport_type: "Run",
    type: "Run",
    start_date_local: "2026-03-20T07:00:00Z",
    distance: 10000,
    elapsed_time: 3600,
    moving_time: 3500,
  },
  {
    id: 2,
    name: "Evening Ride",
    sport_type: "Ride",
    type: "Ride",
    start_date_local: "2026-03-22T18:00:00Z",
    distance: 30000,
    elapsed_time: 5400,
    moving_time: 5200,
  },
  {
    id: 3,
    name: "Trail Run",
    sport_type: "TrailRun",
    type: "TrailRun",
    start_date_local: "2026-03-24T08:00:00Z",
    distance: 15000,
    elapsed_time: 6000,
    moving_time: 5800,
  },
  {
    id: 4,
    name: "",
    sport_type: "WeightTraining",
    type: "WeightTraining",
    start_date_local: "2026-03-25T10:00:00Z",
    distance: 0,
    elapsed_time: 3600,
    moving_time: 3600,
  },
];

// --- filterByType ---

describe("filterByType", () => {
  it("returns all activities when types is empty", () => {
    expect(filterByType(activities, [])).toEqual(activities);
  });

  it("filters to a single type by sport_type", () => {
    const result = filterByType(activities, ["Run"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("filters to multiple types (union)", () => {
    const result = filterByType(activities, ["Run", "Ride"]);
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.id)).toEqual(expect.arrayContaining([1, 2]));
  });

  it("returns empty array when no activities match", () => {
    expect(filterByType(activities, ["Swim"])).toHaveLength(0);
  });

  it("uses sport_type for matching", () => {
    const result = filterByType(activities, ["TrailRun"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });
});

// --- filterBySearch ---

describe("filterBySearch", () => {
  it("returns all activities when query is empty", () => {
    expect(filterBySearch(activities, "", "fuzzy")).toEqual(activities);
    expect(filterBySearch(activities, "", "exact")).toEqual(activities);
  });

  it("fuzzy: matches case-insensitively on partial name", () => {
    const result = filterBySearch(activities, "morning", "fuzzy");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("fuzzy: is case-insensitive", () => {
    const result = filterBySearch(activities, "RIDE", "fuzzy");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("exact: matches case-sensitively", () => {
    const result = filterBySearch(activities, "Morning Run", "exact");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("exact: does not match wrong case", () => {
    const result = filterBySearch(activities, "morning run", "exact");
    expect(result).toHaveLength(0);
  });

  it("excludes activities with no name when query is active", () => {
    const result = filterBySearch(activities, "run", "fuzzy");
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain(4); // activity with empty name excluded
  });

  it("returns no results when query matches nothing", () => {
    expect(filterBySearch(activities, "zzznomatch", "fuzzy")).toHaveLength(0);
  });
});

// --- filterByDateRange ---

describe("filterByDateRange", () => {
  it("returns all activities when both bounds are null", () => {
    expect(filterByDateRange(activities, null, null)).toEqual(activities);
  });

  it("filters by start date only (inclusive)", () => {
    const result = filterByDateRange(activities, "2026-03-22", null);
    const ids = result.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining([2, 3, 4]));
    expect(ids).not.toContain(1);
  });

  it("filters by end date only (inclusive)", () => {
    const result = filterByDateRange(activities, null, "2026-03-22");
    const ids = result.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining([1, 2]));
    expect(ids).not.toContain(3);
    expect(ids).not.toContain(4);
  });

  it("filters by both start and end date (inclusive)", () => {
    const result = filterByDateRange(activities, "2026-03-22", "2026-03-24");
    const ids = result.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining([2, 3]));
    expect(ids).not.toContain(1);
    expect(ids).not.toContain(4);
  });

  it("returns empty array when start date is after end date", () => {
    expect(filterByDateRange(activities, "2026-03-25", "2026-03-20")).toHaveLength(0);
  });

  it("includes activities exactly on the start and end date", () => {
    const result = filterByDateRange(activities, "2026-03-20", "2026-03-20");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});

// --- filterActivities ---

describe("filterActivities", () => {
  it("returns all activities when filter is empty/default", () => {
    const result = filterActivities(activities, {
      types: [],
      searchQuery: "",
      matchMode: "fuzzy",
      startDate: null,
      endDate: null,
    });
    expect(result).toEqual(activities);
  });

  it("applies type filter and search together (AND)", () => {
    const result = filterActivities(activities, {
      types: ["Run"],
      searchQuery: "morning",
      matchMode: "fuzzy",
      startDate: null,
      endDate: null,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("applies all three filters simultaneously", () => {
    const result = filterActivities(activities, {
      types: ["Run"],
      searchQuery: "morning",
      matchMode: "fuzzy",
      startDate: "2026-03-20",
      endDate: "2026-03-21",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("returns empty array when combined filters match nothing", () => {
    const result = filterActivities(activities, {
      types: ["Swim"],
      searchQuery: "morning",
      matchMode: "fuzzy",
      startDate: null,
      endDate: null,
    });
    expect(result).toHaveLength(0);
  });
});

import { describe, it, expect } from "vitest";
import { groupByWeek, groupByMonth, buildHeatmap } from "@/lib/utils/trends";
import type { Activity } from "@/lib/strava";

// --- Fixtures ---

function makeActivity(
  id: number,
  sport_type: string,
  start_date_local: string,
  distance: number,
  elapsed_time: number = 3600
): Activity {
  return { id, name: `Activity ${id}`, sport_type, type: sport_type, start_date_local, distance, elapsed_time, moving_time: elapsed_time };
}

// Week of 2026-03-16 (Mon) to 2026-03-22 (Sun)
const runW1 = makeActivity(1, "Run", "2026-03-16T07:00:00Z", 10000); // Mon Mar 16
const runW1b = makeActivity(2, "Run", "2026-03-18T07:00:00Z", 5000);  // Wed Mar 18

// Week of 2026-03-23 (Mon) to 2026-03-29 (Sun)
const rideW2 = makeActivity(3, "Ride", "2026-03-23T07:00:00Z", 30000); // Mon Mar 23
const runW2 = makeActivity(4, "Run", "2026-03-25T07:00:00Z", 8000);   // Wed Mar 25

// Gap week: 2026-03-30 (Mon) — no activities

// Week of 2026-04-06 (Mon)
const runW4 = makeActivity(5, "Run", "2026-04-06T07:00:00Z", 12000);  // Mon Apr 6

// Monthly fixtures
const janActivity = makeActivity(10, "Run", "2026-01-15T07:00:00Z", 10000);
const febActivity = makeActivity(11, "Ride", "2026-02-20T07:00:00Z", 20000);
// Gap: March has no activity
const aprActivity = makeActivity(12, "Run", "2026-04-10T07:00:00Z", 15000);

// Heatmap fixtures
const dayA = makeActivity(20, "Run", "2026-03-01T07:00:00Z", 10000, 3600);
const dayA2 = makeActivity(21, "Ride", "2026-03-01T18:00:00Z", 20000, 5400); // same day
const dayB = makeActivity(22, "Run", "2026-03-03T07:00:00Z", 8000, 2700);  // day 3, gap on day 2

// --- groupByWeek ---

describe("groupByWeek", () => {
  it("returns empty array for empty activities", () => {
    expect(groupByWeek([])).toEqual([]);
  });

  it("returns one period for a single activity", () => {
    const result = groupByWeek([runW1]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Mar 16");
    expect(result[0].distance).toBeCloseTo(10);
  });

  it("groups multiple activities in the same week", () => {
    const result = groupByWeek([runW1, runW1b]);
    expect(result).toHaveLength(1);
    expect(result[0].distance).toBeCloseTo(15);
  });

  it("produces one entry per week in chronological order", () => {
    const result = groupByWeek([runW1, rideW2]);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Mar 16");
    expect(result[1].label).toBe("Mar 23");
  });

  it("fills gap weeks with zero distance", () => {
    // Weeks: Mar 16, Mar 23, Mar 30 (gap), Apr 6
    const result = groupByWeek([runW1, rideW2, runW4]);
    expect(result).toHaveLength(4);
    const labels = result.map((p) => p.label);
    expect(labels).toContain("Mar 30");
    const gapWeek = result.find((p) => p.label === "Mar 30");
    expect(gapWeek?.distance).toBe(0);
  });

  it("respects activityType filter", () => {
    const result = groupByWeek([runW1, rideW2], "Run");
    // Week of Mar 16 has runW1 (10km); week of Mar 23 has no runs
    expect(result).toHaveLength(2);
    expect(result[0].distance).toBeCloseTo(10);
    expect(result[1].distance).toBe(0);
  });

  it("uses Monday as week start", () => {
    // runW1 is on 2026-03-16 which IS a Monday
    const result = groupByWeek([runW1]);
    expect(result[0].label).toBe("Mar 16");
  });

  it("combines run and ride in the same week without type filter", () => {
    const result = groupByWeek([runW1, rideW2, runW2]);
    // Week Mar 16: 10km; Week Mar 23: 30+8=38km
    expect(result).toHaveLength(2);
    expect(result[1].distance).toBeCloseTo(38);
  });
});

// --- groupByMonth ---

describe("groupByMonth", () => {
  it("returns empty array for empty activities", () => {
    expect(groupByMonth([])).toEqual([]);
  });

  it("returns one period for a single activity", () => {
    const result = groupByMonth([janActivity]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Jan 2026");
    expect(result[0].distance).toBeCloseTo(10);
  });

  it("groups multiple activities in the same month", () => {
    const jan2 = makeActivity(99, "Run", "2026-01-28T07:00:00Z", 5000);
    const result = groupByMonth([janActivity, jan2]);
    expect(result).toHaveLength(1);
    expect(result[0].distance).toBeCloseTo(15);
  });

  it("produces months in chronological order", () => {
    const result = groupByMonth([janActivity, febActivity]);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Jan 2026");
    expect(result[1].label).toBe("Feb 2026");
  });

  it("fills gap months with zero distance", () => {
    // Jan, Feb, (Mar gap), Apr
    const result = groupByMonth([janActivity, febActivity, aprActivity]);
    expect(result).toHaveLength(4);
    const mar = result.find((p) => p.label === "Mar 2026");
    expect(mar?.distance).toBe(0);
  });

  it("respects activityType filter", () => {
    const result = groupByMonth([janActivity, febActivity], "Run");
    // Jan: 10km run; Feb: 0 (ride filtered out)
    expect(result).toHaveLength(2);
    expect(result[0].distance).toBeCloseTo(10);
    expect(result[1].distance).toBe(0);
  });
});

// --- buildHeatmap ---

describe("buildHeatmap", () => {
  it("returns empty array for empty activities", () => {
    expect(buildHeatmap([])).toEqual([]);
  });

  it("single activity produces a single day entry with correct totalElapsedTime", () => {
    const result = buildHeatmap([dayA]);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2026-03-01");
    expect(result[0].totalElapsedTime).toBe(3600);
    expect(result[0].count).toBe(1);
  });

  it("multiple activities on same day sum elapsed time", () => {
    const result = buildHeatmap([dayA, dayA2]);
    expect(result).toHaveLength(1);
    expect(result[0].totalElapsedTime).toBe(3600 + 5400);
    expect(result[0].count).toBe(2);
  });

  it("inactive days within range have zero totalElapsedTime and count", () => {
    // dayA = Mar 1, dayB = Mar 3 — Mar 2 is a gap
    const result = buildHeatmap([dayA, dayB]);
    expect(result).toHaveLength(3); // Mar 1, Mar 2, Mar 3
    const mar2 = result.find((d) => d.date === "2026-03-02");
    expect(mar2).toBeDefined();
    expect(mar2?.totalElapsedTime).toBe(0);
    expect(mar2?.count).toBe(0);
  });

  it("results are in chronological order", () => {
    const result = buildHeatmap([dayB, dayA]); // reversed input
    expect(result[0].date).toBe("2026-03-01");
    expect(result[2].date).toBe("2026-03-03");
  });

  it("active day has correct count", () => {
    const result = buildHeatmap([dayA, dayA2, dayB]);
    const mar1 = result.find((d) => d.date === "2026-03-01");
    expect(mar1?.count).toBe(2);
    const mar3 = result.find((d) => d.date === "2026-03-03");
    expect(mar3?.count).toBe(1);
  });
});

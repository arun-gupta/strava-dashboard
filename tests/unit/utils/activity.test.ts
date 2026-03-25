import { describe, it, expect } from "vitest";
import { getActivityMeta, formatPace, formatDate } from "@/lib/utils/activity";

describe("getActivityMeta", () => {
  it("returns correct icon and label for Run", () => {
    const meta = getActivityMeta("Run");
    expect(meta.label).toBe("Run");
    expect(meta.icon).toBeDefined();
  });

  it("returns correct label for MountainBikeRide", () => {
    const meta = getActivityMeta("MountainBikeRide");
    expect(meta.label).toBe("Mountain Bike");
    expect(meta.icon).toBeDefined();
  });

  it("returns correct label for Swim", () => {
    expect(getActivityMeta("Swim").label).toBe("Swim");
  });

  it("returns correct label for WeightTraining", () => {
    expect(getActivityMeta("WeightTraining").label).toBe("Weight Training");
  });

  it("splits CamelCase for unknown types", () => {
    const meta = getActivityMeta("SomeNewSportType");
    expect(meta.label).toBe("Some New Sport Type");
    expect(meta.icon).toBeDefined();
  });

  it("returns a fallback for empty string", () => {
    const meta = getActivityMeta("");
    expect(meta.label).toBe("Activity");
    expect(meta.icon).toBeDefined();
  });
});

describe("formatPace", () => {
  it("returns pace in M:SS /km format", () => {
    expect(formatPace(3720, 10000)).toBe("6:12 /km");
  });

  it("returns null when distance is 0", () => {
    expect(formatPace(3720, 0)).toBeNull();
  });

  it("pads seconds with leading zero", () => {
    expect(formatPace(3600, 10000)).toBe("6:00 /km");
  });

  it("handles sub-minute pace correctly", () => {
    // 300 seconds for 1000m = 5:00 /km
    expect(formatPace(300, 1000)).toBe("5:00 /km");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to readable format", () => {
    expect(formatDate("2026-03-25T07:30:00Z")).toBe("25 Mar 2026");
  });

  it("handles different months", () => {
    expect(formatDate("2026-01-01T00:00:00Z")).toBe("1 Jan 2026");
  });
});

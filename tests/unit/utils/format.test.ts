import { describe, it, expect } from "vitest";
import { formatDistance, formatElapsedTime } from "@/lib/utils/format";

describe("formatDistance", () => {
  it("converts metres to km with 1 decimal place", () => {
    expect(formatDistance(1000)).toBe("1.0 km");
  });

  it("handles zero", () => {
    expect(formatDistance(0)).toBe("0.0 km");
  });

  it("adds thousands separator for large distances", () => {
    expect(formatDistance(1234567.8)).toBe("1,234.6 km");
  });

  it("handles sub-km distances", () => {
    expect(formatDistance(500)).toBe("0.5 km");
  });
});

describe("formatElapsedTime", () => {
  it("converts seconds to hours and minutes", () => {
    expect(formatElapsedTime(3600)).toBe("1h 0m");
  });

  it("handles zero", () => {
    expect(formatElapsedTime(0)).toBe("0h 0m");
  });

  it("formats correctly for 12h 34m", () => {
    expect(formatElapsedTime(45296)).toBe("12h 34m");
  });

  it("handles minutes only (< 1 hour)", () => {
    expect(formatElapsedTime(1800)).toBe("0h 30m");
  });

  it("adds thousands separator for large hour counts", () => {
    expect(formatElapsedTime(13648140)).toBe("3,791h 9m");
  });
});

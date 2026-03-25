import { describe, it, expect } from "vitest";
import { render, container } from "@testing-library/react";
import ActivitiesSkeleton from "@/components/activities/ActivitiesSkeleton";

describe("ActivitiesSkeleton", () => {
  it("renders 10 skeleton rows", () => {
    const { container } = render(<ActivitiesSkeleton />);
    const rows = container.querySelectorAll(".animate-pulse");
    expect(rows).toHaveLength(10);
  });

  it("each row has animate-pulse class", () => {
    const { container } = render(<ActivitiesSkeleton />);
    const rows = container.querySelectorAll(".animate-pulse");
    rows.forEach((row) => {
      expect(row.classList.contains("animate-pulse")).toBe(true);
    });
  });
});

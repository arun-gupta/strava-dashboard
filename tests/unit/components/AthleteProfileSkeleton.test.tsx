import { describe, it, expect } from "vitest";
import { render, container } from "@testing-library/react";
import AthleteProfileSkeleton from "@/components/athlete/AthleteProfileSkeleton";

describe("AthleteProfileSkeleton", () => {
  it("renders with animate-pulse class", () => {
    const { container } = render(<AthleteProfileSkeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("renders skeleton placeholder elements", () => {
    const { container } = render(<AthleteProfileSkeleton />);
    // Should have placeholder divs for avatar circle and text lines
    const skeletonItems = container.querySelectorAll(".bg-gray-200");
    expect(skeletonItems.length).toBeGreaterThanOrEqual(3);
  });
});

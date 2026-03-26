import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ActivityHeatmap from "@/components/activities/ActivityHeatmap";
import type { Activity } from "@/lib/strava";

function makeActivity(
  id: number,
  start_date_local: string,
  elapsed_time: number
): Activity {
  return {
    id,
    name: `Activity ${id}`,
    sport_type: "Run",
    type: "Run",
    start_date_local,
    distance: 5000,
    elapsed_time,
    moving_time: elapsed_time,
  };
}

// Mar 1: two activities (3600+5400=9000s), Mar 2: inactive, Mar 3: one activity (2700s)
const activities: Activity[] = [
  makeActivity(1, "2026-03-01T07:00:00Z", 3600),
  makeActivity(2, "2026-03-01T18:00:00Z", 5400),
  makeActivity(3, "2026-03-03T07:00:00Z", 2700),
];

describe("ActivityHeatmap", () => {
  it("renders a cell for every day in the activity range", () => {
    render(<ActivityHeatmap activities={activities} />);
    // Range is Mar 1–Mar 3 = 3 days
    const cells = screen.getAllByTestId("heatmap-cell");
    expect(cells).toHaveLength(3);
  });

  it("inactive days have the empty colour class bg-gray-100", () => {
    render(<ActivityHeatmap activities={activities} />);
    const cells = screen.getAllByTestId("heatmap-cell");
    // Mar 2 is inactive
    const inactiveCell = cells[1];
    expect(inactiveCell.className).toMatch(/bg-gray-100/);
  });

  it("active days have a non-empty background colour class", () => {
    render(<ActivityHeatmap activities={activities} />);
    const cells = screen.getAllByTestId("heatmap-cell");
    // Mar 1 (highest) and Mar 3 (lower) should both have orange classes
    expect(cells[0].className).toMatch(/bg-orange-/);
    expect(cells[2].className).toMatch(/bg-orange-/);
  });

  it("cell with higher elapsed time has a darker colour class than cell with lower elapsed time", () => {
    render(<ActivityHeatmap activities={activities} />);
    const cells = screen.getAllByTestId("heatmap-cell");
    // Mar 1: 9000s (high), Mar 3: 2700s (low/medium)
    // High should be bg-orange-600, low should be bg-orange-200 or bg-orange-400
    expect(cells[0].className).toMatch(/bg-orange-600/);
    expect(cells[2].className).not.toMatch(/bg-orange-600/);
  });

  it("shows date and elapsed time in tooltip on hover", () => {
    render(<ActivityHeatmap activities={activities} />);
    const cells = screen.getAllByTestId("heatmap-cell");
    // Hover over Mar 1
    fireEvent.mouseEnter(cells[0]);
    expect(screen.getByTestId("heatmap-tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("heatmap-tooltip").textContent).toMatch(/Mar 1|2026-03-01/);
    expect(screen.getByTestId("heatmap-tooltip").textContent).toMatch(/\d+h|\d+m/);
  });
});

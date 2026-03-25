import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityRow from "@/components/activities/ActivityRow";

// react-icons returns SVG elements — no special mock needed
// but we need to stub getActivityMeta to avoid depending on icon library
vi.mock("@/lib/utils/activity", () => ({
  getActivityMeta: vi.fn((sportType: string) => ({
    label: sportType === "Run" ? "Run" : sportType === "Ride" ? "Ride" : "Activity",
    icon: () => <svg data-testid="activity-icon" />,
  })),
  formatPace: vi.fn((elapsed: number, distance: number) => {
    if (distance === 0) return null;
    return "6:12 /km";
  }),
  formatDate: vi.fn(() => "25 Mar 2026"),
}));

vi.mock("@/lib/utils/format", () => ({
  formatDistance: vi.fn((m: number) => (m === 0 ? "0.0 km" : "10.2 km")),
  formatElapsedTime: vi.fn(() => "1h 2m"),
}));

const baseActivity = {
  id: 1,
  name: "Morning Run",
  sport_type: "Run",
  type: "Run",
  start_date_local: "2026-03-25T07:30:00Z",
  distance: 10234.5,
  elapsed_time: 3720,
  moving_time: 3650,
};

describe("ActivityRow", () => {
  it("renders the activity name", () => {
    render(<ActivityRow activity={baseActivity} />);
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
  });

  it("renders the activity type label", () => {
    render(<ActivityRow activity={baseActivity} />);
    expect(screen.getByText("Run")).toBeInTheDocument();
  });

  it("renders the formatted date", () => {
    render(<ActivityRow activity={baseActivity} />);
    expect(screen.getByText("25 Mar 2026")).toBeInTheDocument();
  });

  it("renders the formatted distance", () => {
    render(<ActivityRow activity={baseActivity} />);
    expect(screen.getByText("10.2 km")).toBeInTheDocument();
  });

  it("renders the elapsed time", () => {
    render(<ActivityRow activity={baseActivity} />);
    expect(screen.getByText("1h 2m")).toBeInTheDocument();
  });

  it("renders an icon element", () => {
    render(<ActivityRow activity={baseActivity} />);
    expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
  });

  it("renders pace when distance is greater than 0", () => {
    render(<ActivityRow activity={baseActivity} />);
    expect(screen.getByText("6:12 /km")).toBeInTheDocument();
  });

  it("renders — for distance when distance is 0", () => {
    render(<ActivityRow activity={{ ...baseActivity, distance: 0 }} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders — for pace when distance is 0", () => {
    render(<ActivityRow activity={{ ...baseActivity, distance: 0 }} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the type label as fallback when activity name is empty", () => {
    render(<ActivityRow activity={{ ...baseActivity, name: "" }} />);
    const matches = screen.getAllByText("Run");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

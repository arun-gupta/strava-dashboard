import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ActivityTrendsChart from "@/components/activities/ActivityTrendsChart";
import type { Activity } from "@/lib/strava";

// Recharts uses browser APIs not available in jsdom
vi.mock("recharts", () => ({
  ComposedChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="composed-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  LabelList: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

const activities: Activity[] = [
  {
    id: 1,
    name: "Monday Run",
    sport_type: "Run",
    type: "Run",
    start_date_local: "2026-03-16T07:00:00Z",
    distance: 10000,
    elapsed_time: 3600,  // 60 min
    moving_time: 3500,
  },
  {
    id: 2,
    name: "Wednesday Run",
    sport_type: "Run",
    type: "Run",
    start_date_local: "2026-03-18T07:00:00Z",
    distance: 5000,
    elapsed_time: 1800,  // 30 min
    moving_time: 1750,
  },
  {
    id: 3,
    name: "Saturday Weight Training",
    sport_type: "WeightTraining",
    type: "WeightTraining",
    start_date_local: "2026-03-21T10:00:00Z",
    distance: 0,
    elapsed_time: 3900,  // 65 min
    moving_time: 3900,
  },
  {
    id: 4,
    name: "Next Week Run",
    sport_type: "Run",
    type: "Run",
    start_date_local: "2026-03-23T07:00:00Z",
    distance: 8000,
    elapsed_time: 2700,  // 45 min
    moving_time: 2650,
  },
];

// --- US1: Weekly Duration Chart ---

describe("ActivityTrendsChart — US1 weekly chart", () => {
  it("renders a chart card on the page", () => {
    render(<ActivityTrendsChart activities={activities} />);
    expect(screen.getByTestId("composed-chart")).toBeInTheDocument();
  });

  it("displays total duration summary in the header", () => {
    render(<ActivityTrendsChart activities={activities} />);
    // Total: 60+30+65+45 = 200 min = 3h 20m across 2 weeks
    expect(screen.getByText(/across/i)).toBeInTheDocument();
  });

  it("weekly toggle button is active by default", () => {
    render(<ActivityTrendsChart activities={activities} />);
    const weeklyBtn = screen.getByRole("button", { name: /weekly/i });
    expect(weeklyBtn).toBeInTheDocument();
    expect(weeklyBtn.className).toMatch(/font-semibold|active|ring|border/);
  });

  it("includes weight training in the summary (zero-distance activities count)", () => {
    render(<ActivityTrendsChart activities={activities} />);
    // 200 min total = 3h 20m
    expect(screen.getByText(/3h 20m across/i)).toBeInTheDocument();
  });
});

// --- US2: Toggle Weekly / Monthly ---

describe("ActivityTrendsChart — US2 toggle", () => {
  it("renders both Weekly and Monthly toggle buttons", () => {
    render(<ActivityTrendsChart activities={activities} />);
    expect(screen.getByRole("button", { name: /weekly/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /monthly/i })).toBeInTheDocument();
  });

  it("weekly is active by default", () => {
    render(<ActivityTrendsChart activities={activities} />);
    const weeklyBtn = screen.getByRole("button", { name: /weekly/i });
    const monthlyBtn = screen.getByRole("button", { name: /monthly/i });
    expect(weeklyBtn.className).not.toEqual(monthlyBtn.className);
  });

  it("clicking Monthly updates the summary to show months", () => {
    render(<ActivityTrendsChart activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /monthly/i }));
    expect(screen.getByText(/across \d+ month/i)).toBeInTheDocument();
  });

  it("clicking Weekly after Monthly restores weekly view", () => {
    render(<ActivityTrendsChart activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /monthly/i }));
    fireEvent.click(screen.getByRole("button", { name: /weekly/i }));
    expect(screen.getByText(/across \d+ week/i)).toBeInTheDocument();
  });
});

// --- US3: Activity Type Filter ---

describe("ActivityTrendsChart — US3 type filter", () => {
  it("renders type filter buttons for each unique sport_type", () => {
    render(<ActivityTrendsChart activities={activities} />);
    expect(screen.getByRole("button", { name: /^run$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /weighttraining/i })).toBeInTheDocument();
  });

  it("selecting Run shows only run duration in summary", () => {
    render(<ActivityTrendsChart activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /^run$/i }));
    // Runs only: 60+30+45 = 135 min = 2h 15m
    expect(screen.getByText(/2h 15m across/i)).toBeInTheDocument();
  });

  it("selecting WeightTraining shows weight training duration in summary", () => {
    render(<ActivityTrendsChart activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /weighttraining/i }));
    // WeightTraining: 65 min = 1h 5m
    expect(screen.getByText(/1h 5m across/i)).toBeInTheDocument();
  });

  it("clicking the same type again clears the filter", () => {
    render(<ActivityTrendsChart activities={activities} />);
    const runBtn = screen.getByRole("button", { name: /^run$/i });
    fireEvent.click(runBtn);
    fireEvent.click(runBtn);
    // Back to all: 3h 20m
    expect(screen.getByText(/3h 20m across/i)).toBeInTheDocument();
  });
});

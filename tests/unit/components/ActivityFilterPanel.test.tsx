import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ActivityFilterPanel from "@/components/activities/ActivityFilterPanel";
import type { Activity } from "@/lib/strava";

vi.mock("@/lib/utils/activity", () => ({
  getActivityMeta: vi.fn((sportType: string) => ({
    label: sportType,
    icon: () => <svg data-testid="activity-icon" />,
  })),
  formatPace: vi.fn(() => null),
  formatDate: vi.fn(() => "20 Mar 2026"),
}));

vi.mock("@/lib/utils/format", () => ({
  formatDistance: vi.fn(() => "10.0 km"),
  formatElapsedTime: vi.fn(() => "1h 0m"),
}));

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
    sport_type: "Run",
    type: "Run",
    start_date_local: "2026-03-24T08:00:00Z",
    distance: 15000,
    elapsed_time: 6000,
    moving_time: 5800,
  },
];

// --- US1: Type Filter ---

describe("ActivityFilterPanel — type filter (US1)", () => {
  it("renders type buttons for each unique sport_type in the list", () => {
    render(<ActivityFilterPanel activities={activities} />);
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ride/i })).toBeInTheDocument();
  });

  it("renders only types present in the activity list", () => {
    render(<ActivityFilterPanel activities={activities} />);
    expect(screen.queryByRole("button", { name: /swim/i })).not.toBeInTheDocument();
  });

  it("clicking a type button filters the activity list", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /ride/i }));
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
  });

  it("clicking a second type button shows activities of both types", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /run/i }));
    fireEvent.click(screen.getByRole("button", { name: /ride/i }));
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
  });

  it("clicking an active type button deselects it", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /ride/i }));
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ride/i }));
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
  });

  it("deselecting all types restores the full list", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /run/i }));
    fireEvent.click(screen.getByRole("button", { name: /run/i }));
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
  });

  it("shows activity count indicator", () => {
    render(<ActivityFilterPanel activities={activities} />);
    expect(screen.getByText(/3 of 3 activities/i)).toBeInTheDocument();
  });

  it("count indicator updates when type filter is active", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /ride/i }));
    expect(screen.getByText(/1 of 3 activities/i)).toBeInTheDocument();
  });
});

// --- US2: Search ---

describe("ActivityFilterPanel — search (US2)", () => {
  it("renders a search input", () => {
    render(<ActivityFilterPanel activities={activities} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("fuzzy: typing filters by partial case-insensitive match", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "morning" } });
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(screen.queryByText("Evening Ride")).not.toBeInTheDocument();
  });

  it("exact: typing filters by case-sensitive substring", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /exact/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Morning Run" } });
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(screen.queryByText("Evening Ride")).not.toBeInTheDocument();
  });

  it("exact: does not match wrong case", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /exact/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "morning run" } });
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
  });

  it("toggle button switches between fuzzy and exact modes", () => {
    render(<ActivityFilterPanel activities={activities} />);
    expect(screen.getByRole("button", { name: /exact/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /exact/i }));
    expect(screen.getByRole("button", { name: /fuzzy/i })).toBeInTheDocument();
  });

  it("clearing the input restores the full list", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "morning" } });
    expect(screen.queryByText("Evening Ride")).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
  });
});

// --- US3: Date Range ---

describe("ActivityFilterPanel — date range (US3)", () => {
  it("renders start and end date inputs", () => {
    render(<ActivityFilterPanel activities={activities} />);
    const dateInputs = document.querySelectorAll("input[type='date']");
    expect(dateInputs).toHaveLength(2);
  });

  it("setting start date hides activities before that date", () => {
    render(<ActivityFilterPanel activities={activities} />);
    const [startInput] = document.querySelectorAll("input[type='date']");
    fireEvent.change(startInput, { target: { value: "2026-03-22" } });
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
  });

  it("setting end date hides activities after that date", () => {
    render(<ActivityFilterPanel activities={activities} />);
    const [, endInput] = document.querySelectorAll("input[type='date']");
    fireEvent.change(endInput, { target: { value: "2026-03-22" } });
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
    expect(screen.queryByText("Trail Run")).not.toBeInTheDocument();
  });

  it("both dates set: shows only inclusive range", () => {
    render(<ActivityFilterPanel activities={activities} />);
    const [startInput, endInput] = document.querySelectorAll("input[type='date']");
    fireEvent.change(startInput, { target: { value: "2026-03-22" } });
    fireEvent.change(endInput, { target: { value: "2026-03-22" } });
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
    expect(screen.queryByText("Trail Run")).not.toBeInTheDocument();
  });

  it("start after end: shows no activities and renders a validation hint", () => {
    render(<ActivityFilterPanel activities={activities} />);
    const [startInput, endInput] = document.querySelectorAll("input[type='date']");
    fireEvent.change(startInput, { target: { value: "2026-03-25" } });
    fireEvent.change(endInput, { target: { value: "2026-03-20" } });
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
    expect(screen.getByText(/start date must be before end date/i)).toBeInTheDocument();
  });

  it("clearing dates restores the list", () => {
    render(<ActivityFilterPanel activities={activities} />);
    const [startInput] = document.querySelectorAll("input[type='date']");
    fireEvent.change(startInput, { target: { value: "2026-03-25" } });
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
    fireEvent.change(startInput, { target: { value: "" } });
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
  });
});

// --- US4: Combined Filters ---

describe("ActivityFilterPanel — combined filters (US4)", () => {
  it("type + search: only activities matching both shown", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /run/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "trail" } });
    expect(screen.getByText("Trail Run")).toBeInTheDocument();
    expect(screen.queryByText("Morning Run")).not.toBeInTheDocument();
    expect(screen.queryByText("Evening Ride")).not.toBeInTheDocument();
  });

  it("type + search + date range: all three conditions applied", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /run/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "run" } });
    const [startInput, endInput] = document.querySelectorAll("input[type='date']");
    fireEvent.change(startInput, { target: { value: "2026-03-20" } });
    fireEvent.change(endInput, { target: { value: "2026-03-21" } });
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(screen.queryByText("Trail Run")).not.toBeInTheDocument();
  });

  it("count indicator is accurate under combined filters", () => {
    render(<ActivityFilterPanel activities={activities} />);
    fireEvent.click(screen.getByRole("button", { name: /ride/i }));
    expect(screen.getByText(/1 of 3 activities/i)).toBeInTheDocument();
  });
});

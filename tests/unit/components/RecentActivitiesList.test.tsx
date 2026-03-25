import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RecentActivitiesList from "@/components/activities/RecentActivitiesList";

vi.mock("@/lib/strava", () => ({
  fetchRecentActivities: vi.fn(),
}));

vi.mock("@/components/activities/ActivityRow", () => ({
  default: ({ activity }: { activity: { name: string } }) => (
    <div data-testid="activity-row">{activity.name}</div>
  ),
}));

import { fetchRecentActivities } from "@/lib/strava";

describe("RecentActivitiesList", () => {
  it("renders empty state when API returns no activities", async () => {
    vi.mocked(fetchRecentActivities).mockResolvedValue([]);

    const ui = await RecentActivitiesList({ accessToken: "token" });
    render(ui);

    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
  });

  it("renders a row for each activity", async () => {
    vi.mocked(fetchRecentActivities).mockResolvedValue([
      {
        id: 1,
        name: "Morning Run",
        sport_type: "Run",
        type: "Run",
        start_date_local: "2026-03-25T07:30:00Z",
        distance: 10000,
        elapsed_time: 3600,
        moving_time: 3500,
      },
      {
        id: 2,
        name: "Evening Ride",
        sport_type: "Ride",
        type: "Ride",
        start_date_local: "2026-03-24T18:00:00Z",
        distance: 30000,
        elapsed_time: 5400,
        moving_time: 5200,
      },
    ]);

    const ui = await RecentActivitiesList({ accessToken: "token" });
    render(ui);

    expect(screen.getAllByTestId("activity-row")).toHaveLength(2);
    expect(screen.getByText("Morning Run")).toBeInTheDocument();
    expect(screen.getByText("Evening Ride")).toBeInTheDocument();
  });
});

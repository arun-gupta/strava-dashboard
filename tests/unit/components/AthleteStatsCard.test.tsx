import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AthleteStatsCard from "@/components/athlete/AthleteStatsCard";

vi.mock("@/lib/strava", () => ({
  fetchAthleteStats: vi.fn(),
}));

import { fetchAthleteStats } from "@/lib/strava";

describe("AthleteStatsCard", () => {
  it("renders run count, distance, and elapsed time", async () => {
    vi.mocked(fetchAthleteStats).mockResolvedValue({
      all_run_totals: {
        count: 312,
        distance: 2345678.9,
        elapsed_time: 864000,
      },
    });

    const ui = await AthleteStatsCard({ accessToken: "token", athleteId: 1 });
    render(ui);

    expect(screen.getByText("312")).toBeInTheDocument();
    expect(screen.getByText("2,345.7 km")).toBeInTheDocument();
    expect(screen.getByText("240h 0m")).toBeInTheDocument();
  });

  it("renders zeros gracefully when athlete has no running data", async () => {
    vi.mocked(fetchAthleteStats).mockResolvedValue({
      all_run_totals: {
        count: 0,
        distance: 0,
        elapsed_time: 0,
      },
    });

    const ui = await AthleteStatsCard({ accessToken: "token", athleteId: 1 });
    render(ui);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0.0 km")).toBeInTheDocument();
    expect(screen.getByText("0h 0m")).toBeInTheDocument();
  });

  it("renders zeros when all_run_totals is missing", async () => {
    vi.mocked(fetchAthleteStats).mockResolvedValue({
      all_run_totals: undefined as never,
    });

    const ui = await AthleteStatsCard({ accessToken: "token", athleteId: 1 });
    render(ui);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0.0 km")).toBeInTheDocument();
    expect(screen.getByText("0h 0m")).toBeInTheDocument();
  });
});

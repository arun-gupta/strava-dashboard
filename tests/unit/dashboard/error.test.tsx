import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardError from "@/app/dashboard/error";

describe("DashboardError", () => {
  it("renders a friendly error message", () => {
    const error = new Error("Something went wrong");
    const reset = vi.fn();

    render(<DashboardError error={error} reset={reset} />);

    expect(screen.getByText(/unable to load your strava data/i)).toBeInTheDocument();
  });

  it("renders a Try again button", () => {
    const error = new Error("Something went wrong");
    const reset = vi.fn();

    render(<DashboardError error={error} reset={reset} />);

    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("calls reset when Try again is clicked", async () => {
    const error = new Error("Something went wrong");
    const reset = vi.fn();
    const user = userEvent.setup();

    render(<DashboardError error={error} reset={reset} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(reset).toHaveBeenCalledOnce();
  });
});

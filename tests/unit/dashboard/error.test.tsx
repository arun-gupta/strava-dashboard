import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardError from "@/app/dashboard/error";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

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

  it("shows rate limit message on StravaRateLimitError", () => {
    const error = Object.assign(new Error("Strava rate limit exceeded"), {
      name: "StravaRateLimitError",
    });

    render(<DashboardError error={error} reset={vi.fn()} />);

    expect(screen.getByText(/rate limit reached/i)).toBeInTheDocument();
    expect(screen.queryByText(/unable to load/i)).not.toBeInTheDocument();
  });

  it("redirects to / and renders nothing on StravaAuthError", () => {
    const error = Object.assign(new Error("Strava authentication required"), {
      name: "StravaAuthError",
    });
    const reset = vi.fn();

    const { container } = render(<DashboardError error={error} reset={reset} />);

    expect(container).toBeEmptyDOMElement();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});

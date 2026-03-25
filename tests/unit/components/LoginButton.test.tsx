import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginButton from "@/components/auth/LoginButton";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

import { signIn } from "next-auth/react";

describe("LoginButton", () => {
  it("renders Connect with Strava text", () => {
    render(<LoginButton />);
    expect(screen.getByRole("button", { name: /connect with strava/i })).toBeInTheDocument();
  });

  it("calls signIn with strava on click", async () => {
    render(<LoginButton />);
    await userEvent.click(screen.getByRole("button", { name: /connect with strava/i }));
    expect(signIn).toHaveBeenCalledWith("strava");
  });

  it("shows a spinner and hides text when loading", async () => {
    vi.mocked(signIn).mockImplementation(() => new Promise(() => {})); // never resolves
    render(<LoginButton />);
    await userEvent.click(screen.getByRole("button", { name: /connect with strava/i }));
    expect(screen.getByRole("status")).toBeInTheDocument(); // spinner
    expect(screen.queryByText(/connect with strava/i)).not.toBeInTheDocument();
  });
});

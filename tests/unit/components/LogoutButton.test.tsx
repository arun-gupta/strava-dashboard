import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutButton from "@/components/auth/LogoutButton";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

import { signOut } from "next-auth/react";

describe("LogoutButton", () => {
  it("renders Logout text", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls signOut with callbackUrl on click", async () => {
    render(<LogoutButton />);
    await userEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});

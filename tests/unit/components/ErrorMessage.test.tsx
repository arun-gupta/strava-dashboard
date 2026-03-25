import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "@/components/ui/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders access_denied message", () => {
    render(<ErrorMessage error="access_denied" />);
    expect(screen.getByText(/you need to authorize/i)).toBeInTheDocument();
  });

  it("renders generic message for OAuthError", () => {
    render(<ErrorMessage error="OAuthError" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("renders generic message for unknown errors", () => {
    render(<ErrorMessage error="unknown_error" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

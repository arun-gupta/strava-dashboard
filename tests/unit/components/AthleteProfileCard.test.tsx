import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AthleteProfileCard from "@/components/athlete/AthleteProfileCard";

// Mock the strava lib — server-side fetch not available in jsdom
vi.mock("@/lib/strava", () => ({
  fetchAthleteProfile: vi.fn(),
}));

import { fetchAthleteProfile } from "@/lib/strava";

describe("AthleteProfileCard", () => {
  it("renders the athlete name", async () => {
    vi.mocked(fetchAthleteProfile).mockResolvedValue({
      id: 1,
      firstname: "Jane",
      lastname: "Doe",
      city: "London",
      country: "United Kingdom",
      profile_medium: "https://example.com/photo.jpg",
    });

    const ui = await AthleteProfileCard({ accessToken: "token" });
    render(ui);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders the location when both city and country are set", async () => {
    vi.mocked(fetchAthleteProfile).mockResolvedValue({
      id: 1,
      firstname: "Jane",
      lastname: "Doe",
      city: "London",
      country: "United Kingdom",
      profile_medium: "https://example.com/photo.jpg",
    });

    const ui = await AthleteProfileCard({ accessToken: "token" });
    render(ui);

    expect(screen.getByText("London, United Kingdom")).toBeInTheDocument();
  });

  it("renders only country when city is absent", async () => {
    vi.mocked(fetchAthleteProfile).mockResolvedValue({
      id: 1,
      firstname: "Jane",
      lastname: "Doe",
      city: null,
      country: "United Kingdom",
      profile_medium: "https://example.com/photo.jpg",
    });

    const ui = await AthleteProfileCard({ accessToken: "token" });
    render(ui);

    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
  });

  it("hides location when neither city nor country is set", async () => {
    vi.mocked(fetchAthleteProfile).mockResolvedValue({
      id: 1,
      firstname: "Jane",
      lastname: "Doe",
      city: null,
      country: null,
      profile_medium: "https://example.com/photo.jpg",
    });

    const ui = await AthleteProfileCard({ accessToken: "token" });
    render(ui);

    expect(screen.queryByTestId("athlete-location")).not.toBeInTheDocument();
  });

  it("renders the profile photo when photoUrl is set", async () => {
    vi.mocked(fetchAthleteProfile).mockResolvedValue({
      id: 1,
      firstname: "Jane",
      lastname: "Doe",
      city: "London",
      country: "United Kingdom",
      profile_medium: "https://example.com/photo.jpg",
    });

    const ui = await AthleteProfileCard({ accessToken: "token" });
    render(ui);

    const img = screen.getByRole("img", { name: /jane doe/i });
    expect(img).toHaveAttribute("src", expect.stringContaining("photo.jpg"));
  });

  it("renders initials fallback when profile_medium is absent", async () => {
    vi.mocked(fetchAthleteProfile).mockResolvedValue({
      id: 1,
      firstname: "Jane",
      lastname: "Doe",
      city: null,
      country: null,
      profile_medium: null,
    });

    const ui = await AthleteProfileCard({ accessToken: "token" });
    render(ui);

    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAthleteProfile, fetchAthleteStats } from "@/lib/strava";

const mockToken = "test-access-token";
const mockAthleteId = 12345678;

const mockProfileResponse = {
  id: mockAthleteId,
  firstname: "Jane",
  lastname: "Doe",
  city: "London",
  country: "United Kingdom",
  profile_medium: "https://example.com/photo.jpg",
};

const mockStatsResponse = {
  all_run_totals: {
    count: 312,
    distance: 2345678.9,
    elapsed_time: 864000,
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("fetchAthleteProfile", () => {
  it("calls GET /athlete with Bearer token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProfileResponse,
      })
    );

    await fetchAthleteProfile(mockToken);

    expect(fetch).toHaveBeenCalledWith(
      "https://www.strava.com/api/v3/athlete",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
        cache: "no-store",
      })
    );
  });

  it("returns the athlete profile data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockProfileResponse,
      })
    );

    const result = await fetchAthleteProfile(mockToken);
    expect(result).toEqual(mockProfileResponse);
  });

  it("throws on non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Authorization Error" }),
      })
    );

    await expect(fetchAthleteProfile(mockToken)).rejects.toThrow();
  });

  it("throws on 500 server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: "Server Error" }),
      })
    );

    await expect(fetchAthleteProfile(mockToken)).rejects.toThrow();
  });
});

describe("fetchAthleteStats", () => {
  it("calls GET /athletes/{id}/stats with Bearer token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStatsResponse,
      })
    );

    await fetchAthleteStats(mockToken, mockAthleteId);

    expect(fetch).toHaveBeenCalledWith(
      `https://www.strava.com/api/v3/athletes/${mockAthleteId}/stats`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
        cache: "no-store",
      })
    );
  });

  it("returns the stats data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockStatsResponse,
      })
    );

    const result = await fetchAthleteStats(mockToken, mockAthleteId);
    expect(result).toEqual(mockStatsResponse);
  });

  it("throws on non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Authorization Error" }),
      })
    );

    await expect(fetchAthleteStats(mockToken, mockAthleteId)).rejects.toThrow();
  });
});

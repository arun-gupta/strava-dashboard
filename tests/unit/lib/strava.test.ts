import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAthleteProfile, fetchAthleteStats, fetchRecentActivities, StravaAuthError, StravaRateLimitError } from "@/lib/strava";

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

  it("redirects to / on 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Authorization Error" }),
      })
    );

    await expect(fetchAthleteProfile(mockToken)).rejects.toThrow(StravaAuthError);
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

  it("throws StravaRateLimitError on 429", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({}),
      })
    );

    await expect(fetchAthleteProfile(mockToken)).rejects.toThrow(StravaRateLimitError);
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

  it("redirects to / on 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Authorization Error" }),
      })
    );

    await expect(fetchAthleteStats(mockToken, mockAthleteId)).rejects.toThrow(StravaAuthError);
  });

  it("throws StravaRateLimitError on 429", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({}),
      })
    );

    await expect(fetchAthleteStats(mockToken, mockAthleteId)).rejects.toThrow(StravaRateLimitError);
  });
});

const mockActivitiesResponse = [
  {
    id: 987654321,
    name: "Morning Run",
    sport_type: "Run",
    type: "Run",
    start_date_local: "2026-03-25T07:30:00Z",
    distance: 10234.5,
    elapsed_time: 3720,
    moving_time: 3650,
  },
  {
    id: 987654320,
    name: "Evening Ride",
    sport_type: "Ride",
    type: "Ride",
    start_date_local: "2026-03-24T18:00:00Z",
    distance: 32100.0,
    elapsed_time: 5400,
    moving_time: 5200,
  },
];

describe("fetchRecentActivities", () => {
  it("calls GET /athlete/activities with per_page=180 and Bearer token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockActivitiesResponse,
      })
    );

    await fetchRecentActivities(mockToken);

    expect(fetch).toHaveBeenCalledWith(
      "https://www.strava.com/api/v3/athlete/activities?per_page=180",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
        cache: "no-store",
      })
    );
  });

  it("returns an array of activities", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockActivitiesResponse,
      })
    );

    const result = await fetchRecentActivities(mockToken);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(987654321);
    expect(result[0].name).toBe("Morning Run");
  });

  it("returns empty array when API returns []", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })
    );

    const result = await fetchRecentActivities(mockToken);
    expect(result).toEqual([]);
  });

  it("redirects to / on 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Authorization Error" }),
      })
    );

    await expect(fetchRecentActivities(mockToken)).rejects.toThrow(StravaAuthError);
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

    await expect(fetchRecentActivities(mockToken)).rejects.toThrow();
  });

  it("throws StravaRateLimitError on 429", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({}),
      })
    );

    await expect(fetchRecentActivities(mockToken)).rejects.toThrow(StravaRateLimitError);
  });
});

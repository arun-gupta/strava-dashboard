import { describe, it, expect } from "vitest";
import { config } from "@/lib/auth";

describe("auth config", () => {
  it("has a strava provider configured", () => {
    const providers = config.providers;
    expect(providers).toHaveLength(1);
    const provider = providers[0] as { id: string; name: string };
    expect(provider.id).toBe("strava");
    expect(provider.name).toBe("Strava");
  });

  it("redirects to / on sign in and error", () => {
    expect(config.pages?.signIn).toBe("/");
    expect(config.pages?.error).toBe("/");
  });

  it("has jwt and session callbacks defined", () => {
    expect(config.callbacks?.jwt).toBeDefined();
    expect(config.callbacks?.session).toBeDefined();
  });
});

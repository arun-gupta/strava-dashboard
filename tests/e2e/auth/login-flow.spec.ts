import { test, expect } from "@playwright/test";

test.describe("Strava OAuth Login Flow", () => {
  test("landing page shows Connect with Strava button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /connect with strava/i })).toBeVisible();
  });

  test("unauthenticated user is redirected from dashboard to landing", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
  });

  test("denied auth shows error message on landing page", async ({ page }) => {
    await page.goto("/?error=access_denied");
    await expect(page.getByText(/you need to authorize/i)).toBeVisible();
  });
});

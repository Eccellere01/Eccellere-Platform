import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the submit-asset-agent.
 * Targets the live production site (not localhost).
 * Run with: npm run agent:submit-asset
 */
export default defineConfig({
  testDir: "./scripts",
  testMatch: "submit-asset-agent.spec.ts",
  timeout: 90_000,          // generous timeout for live network
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "https://eccellere.co.in",
    headless: false,         // set true to run silently in CI/background
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

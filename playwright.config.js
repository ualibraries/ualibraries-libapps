import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: undefined,
    locale: "en-US",
    timezoneId: "America/Phoenix",
  },
  projects: [
    { name: "sm", use: { viewport: { width: 576, height: 900 } } },
    { name: "md", use: { viewport: { width: 768, height: 900 } } },
    { name: "lg", use: { viewport: { width: 992, height: 900 } } },
  ],
});

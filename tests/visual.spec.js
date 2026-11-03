import { expect, test } from "@playwright/test";

const removeWarningAlert = (page) =>
  page
    .locator(".alert-warning")
    .evaluateAll((alerts) => alerts.forEach((alert) => alert.remove()));

test("A-Z Databases", async ({ page }) => {
  await page.goto("https://libguides.library.arizona.edu/az/databases");

  await page.waitForLoadState("networkidle");
  await removeWarningAlert(page);

  await expect(page).toHaveScreenshot("az-database.png");

  const search_bar = page.locator("#s-lib-public-main-searchbar");
  await expect(search_bar).toHaveScreenshot("search-bar.png");
});

test("A-Z Databases filter", async ({ page }) => {
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: viewport.width, height: 1800 });

  await page.goto(
    "https://libguides.library.arizona.edu/az/databases?s=159828&t=39061",
  );

  await page.waitForLoadState("networkidle");
  await removeWarningAlert(page);

  await expect(page).toHaveScreenshot("az-database-filter.png");

  const az_item = page.locator(".az-item");
  await expect(az_item).toHaveScreenshot("az-item.png");
});

test("LibGuides tab layout", async ({ page }) => {
  await page.goto("https://libguides.library.arizona.edu/learn-tutorials");

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveScreenshot("libguides-tab-layout.png", {
    fullPage: true,
    mask: [page.locator("#s-lg-guide-main")],
  });
});

test("LibGuides side-nav layout", async ({ page }) => {
  await page.goto("https://libguides.library.arizona.edu/students-chatgpt");

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveScreenshot("libguides-side-nav-layout.png", {
    fullPage: true,
    mask: [page.locator("#s-lib-public-main")],
  });
});

test("LibGuides Teaching with Primary Sources", async ({ page }) => {
  await page.goto("https://libguides.library.arizona.edu/tps/home");

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveScreenshot("libguides-tps.png");
});

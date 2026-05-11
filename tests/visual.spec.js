import { expect, test } from "@playwright/test";

test("A-Z Databases", async ({ page }) => {
  await page.goto("https://customertesting-ua.libguides.com/az/databases");

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveScreenshot("az-database.png");

  const search_bar = page.locator("#s-lib-public-main-searchbar");
  await expect(search_bar).toHaveScreenshot("search-bar.png");
});

test("A-Z Databases filter", async ({ page }) => {
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: viewport.width, height: 1800 });

  await page.goto(
    "https://customertesting-ua.libguides.com/az/databases?s=260432&t=64874",
  );

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveScreenshot("az-database-filter.png");

  const az_item = page.locator(".az-item");
  await expect(az_item).toHaveScreenshot("az-item.png");
});

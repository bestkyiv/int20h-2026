import { test, expect } from "@playwright/test";

test("debug safari layout", async ({ page }) => {
  await page.goto("http://localhost:4321");

  // 1. Force all images to load eagerly (removes lazy loading)
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.setAttribute("loading", "eager");
    });
  });

  // 2. Wait for the last heart image to be decoded
  // This ensures the image data is actually in memory before you look
  const lastHeart = page.locator('img[alt="Heart 4/4"]');
  await lastHeart.waitFor({ state: "visible" });
  await lastHeart.evaluate((img: HTMLImageElement) => img.decode());

  await page.pause();
});

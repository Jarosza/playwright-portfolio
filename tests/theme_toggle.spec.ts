import { test, expect } from '@playwright/test';

test.describe('theme toggle', () => {
  test('changes body background color after theme switch', async ({ page }) => {
    await page.goto('https://jarosza.github.io/portfolio/');

    const moonToggle = page.locator('button:has(.ph.ph-moon)').first();
    const sunToggle = page.locator('button:has(.ph.ph-sun)').first();
    const getBodyBackgroundColor = async () =>
      page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);

    const initialBackground = await getBodyBackgroundColor();

    await expect(moonToggle).toBeVisible();
    await moonToggle.click();
    await expect(sunToggle).toBeVisible();

    const darkBackground = await getBodyBackgroundColor();
    expect(darkBackground).not.toBe(initialBackground);

    await sunToggle.click();
    await expect(moonToggle).toBeVisible();

    const restoredBackground = await getBodyBackgroundColor();
    expect(restoredBackground).toBe(initialBackground);
  });

});
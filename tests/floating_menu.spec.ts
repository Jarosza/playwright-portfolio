import { test, expect } from '@playwright/test';

test.describe('floating menu', () => {
  test('navigates to all sections', async ({ page }) => {
    await page.goto('https://jarosza.github.io/portfolio/');

    const sections = ['#about', '#portfolio', '#testimonials', '#contact'];

    for (const section of sections) {
      const menuLink = page.locator(`a[href="${section}"]`).first();
      const targetSection = page.locator(`section${section}`);

      await expect(menuLink).toBeVisible();
      await menuLink.click();
      await expect(targetSection).toBeInViewport();
    }
  });

  test('stays visible and pinned at the bottom while scrolling', async ({ page }) => {
    await page.goto('https://jarosza.github.io/portfolio/');

    const navBar = page.locator('nav').first();
    await expect(navBar).toBeVisible();

    const navPosition = await navBar.evaluate((el) => window.getComputedStyle(el).position);
    expect(['fixed', 'sticky']).toContain(navPosition);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(navBar).toBeVisible();
    await expect(navBar).toBeInViewport();

    const isNearBottomEdge = await navBar.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return window.innerHeight - rect.bottom <= 60;
    });
    expect(isNearBottomEdge).toBe(true);
  });
});
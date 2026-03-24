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
});
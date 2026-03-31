import { test, expect } from '@playwright/test';

test.describe('Download CV button', () => {
  test('opens PDF in a new tab', async ({ page }) => {
    const url = 'https://jarosza.github.io/portfolio/';
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;

    await page.goto(url);
    await page.getByRole('link', { name: /cv/i }).first().click();
    await page1.waitForLoadState('domcontentloaded');

    await expect(page1).toHaveURL('https://jarosza.github.io/portfolio/assets/CV.png');
  });
});


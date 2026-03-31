import { test, expect } from '@playwright/test';

test.describe('website access tests', () => {

  test('visit_the_website', async ({ page }) => {

    const url = 'https://jarosza.github.io/portfolio/';
    const contact = ' Contact';

    await page.goto(url);
    await page.getByRole('link').nth(2).click();
    await page.getByRole('link', { name: contact }).click();

    await expect(page.getByText('BALTI QA ENGINEER')).toBeVisible();
  });
});
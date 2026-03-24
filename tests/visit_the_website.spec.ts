import { test, expect } from '@playwright/test';

test.describe('website access tests', () => {

  test('visit_the_website', async ({ page }) => {
    await page.goto('https://jarosza.github.io/portfolio/');
    await page.getByRole('link').nth(2).click();
    await page.getByRole('link', { name: ' Contact' }).click();

    await expect(page.getByText('BALTI QA ENGINEER')).toBeVisible();
  });


});
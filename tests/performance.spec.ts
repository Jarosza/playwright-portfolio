import { test, expect } from '@playwright/test';

test.describe('performance', () => {
  test('measurement of charging time via the Performance API', async ({ page }) => {
    await page.goto('https://jarosza.github.io/portfolio/');

    // Execute script inside the browser.
    const performanceTiming = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType('navigation');
      return entry.toJSON();
    });

    // loadEventEnd is the time from navigation start to the end of load event.
    const loadTime = performanceTiming.loadEventEnd;
    console.log(`Dokładny czas ładowania (Performance API): ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });

  test('The page should load in less than 2 seconds', async ({ page }) => {
    const start = Date.now();

    await page.goto('https://jarosza.github.io/portfolio/', { waitUntil: 'load' });

    const duration = Date.now() - start;
    console.log(`Czas ładowania strony: ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });
});
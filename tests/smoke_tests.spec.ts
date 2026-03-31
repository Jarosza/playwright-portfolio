import { test, expect } from '@playwright/test';

test.describe('smoke tests', () => {
  test('console errors or 404 errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const uncaughtPageErrors: string[] = [];
    const criticalRequestFailures: string[] = [];

    const ignoredDomains = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      consoleErrors.push(msg.text());
    });

    // This catches real JS crashes (more reliable than console logs).
    page.on('pageerror', (err) => {
      uncaughtPageErrors.push(err.message);
    });

    page.on('requestfailed', (request) => {
      const url = request.url();
      const domainIgnored = ignoredDomains.some((d) => url.includes(d));
      if (domainIgnored) return;

      // Don't fail smoke tests on missing non-critical assets like images/fonts.
      const type = request.resourceType();
      const isCritical =
        type === 'document' ||
        type === 'script' ||
        type === 'stylesheet' ||
        type === 'xhr' ||
        type === 'fetch';

      if (!isCritical) return;

      const failureText = request.failure()?.errorText ?? 'unknown error';
      criticalRequestFailures.push(`${url} - ${failureText}`);
    });

    await page.goto('https://jarosza.github.io/portfolio/');
    // Give the page a moment to finish resource loading and emit console/pageerror events.
    await page.waitForTimeout(1000);

    // Filter out noisy but harmless console messages.
    const filteredConsoleErrors = consoleErrors.filter((msg) => {
      return !/favicon/i.test(msg) && !/Failed to load resource/i.test(msg);
    });

    expect(uncaughtPageErrors, 'Znaleziono nieobsłużone wyjątki JS!').toEqual([]);
    expect(filteredConsoleErrors, 'Znaleziono krytyczne błędy w konsoli!').toEqual([]);
    expect(
      criticalRequestFailures,
      'Znaleziono krytyczne błędy ładowania zasobów (np. skrypt/stylesheet)!'
    ).toEqual([]);
  });
  });
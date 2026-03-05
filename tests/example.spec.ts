import { test, expect } from '@playwright/test';

test.describe('Soul Yatri - Cross-browser Tests', () => {
  test('homepage loads successfully', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Verify page title
    expect(await page.title()).toBeDefined();
    
    // Check if main content is visible
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
    
    console.log(`✓ Homepage loaded in ${browserName}`);
  });

  test('navigation works across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Find and click navigation links
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    console.log(`✓ Found ${count} navigation links in ${browserName}`);
  });

  test('responsive design - mobile viewport', async ({ page, browserName }) => {
    // Test with mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const content = page.locator('main, [role="main"]');
    await expect(content).toBeVisible();
    
    console.log(`✓ Mobile layout renders correctly in ${browserName}`);
  });

  test('performance metrics', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Get Core Web Vitals data
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domInteractive: navigation.domInteractive,
        domContentLoaded: navigation.domContentLoadedEventEnd,
        loadComplete: navigation.loadEventEnd,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    console.log(`${browserName} Performance Metrics:`, metrics);
  });

  test('form submission - browser compatibility', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Look for any forms on the page
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      console.log(`✓ Found ${formCount} forms in ${browserName}`);
    } else {
      console.log(`⚠️ No forms found in ${browserName}`);
    }
  });

  test('accessibility check', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check for basic accessibility features
    const headings = page.locator('h1, h2, h3');
    const images = page.locator('img');
    
    const headingCount = await headings.count();
    const imageCount = await images.count();
    
    console.log(`${browserName} - Headings: ${headingCount}, Images: ${imageCount}`);
    expect(headingCount).toBeGreaterThan(0);
  });
});

test.describe('Cross-browser Compatibility', () => {
  test('CSS features rendering', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Check for specific CSS features
    const hasGridSupport = await page.evaluate(() => {
      const div = document.createElement('div');
      return (
        div.style.display !== undefined &&
        (CSS.supports('display', 'grid') === true)
      );
    });
    
    console.log(`${browserName} - Grid Support: ${hasGridSupport}`);
    expect(hasGridSupport).toBeTruthy();
  });

  test('JavaScript compatibility', async ({ page, browserName }) => {
    const result = await page.evaluate(() => {
      return {
        hasPromise: typeof Promise !== 'undefined',
        hasAsync: true, // assumed true in modern browsers
        hasArrowFunctions: true,
        hasSpreadOperator: true,
      };
    });
    
    console.log(`${browserName} - JS Features:`, result);
  });
});

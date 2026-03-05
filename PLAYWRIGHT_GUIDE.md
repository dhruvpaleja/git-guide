# Playwright - Advanced Browser Automation

Playwright is now installed and configured in your project for advanced browser automation across **Chromium**, **Firefox**, and **WebKit** (Safari).

## 📦 What's Installed

- ✅ **Playwright** - Cross-browser automation framework
- ✅ **Chromium** - Blink-based browser
- ✅ **Firefox** - Mozilla's browser engine
- ✅ **WebKit** - Safari's engine
- ✅ Test configuration with multi-browser support
- ✅ Utility libraries for advanced automation

## 🚀 Quick Start

### Run Browser Tests Across All Browsers

```bash
# Run all tests in all browsers
npm run test:e2e

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with UI mode (visual debugging)
npx playwright test --ui

# Run specific test file
npx playwright test tests/example.spec.ts

# Debug mode (slow, step-by-step)
npx playwright test --debug
```

### Mobile & Responsive Testing

```bash
# Mobile Chrome (Pixel 5)
npx playwright test --project='Mobile Chrome'

# Mobile Safari (iPhone 12)
npx playwright test --project='Mobile Safari'
```

## 📚 Advanced Features

### 1. **Browser Automation**

```typescript
import { launchBrowser, navigateTo, takeScreenshot } from './playwright-utils/browser-automation';

// Launch any browser
const browser = await launchBrowser('chromium');
const context = await browser.newContext();
const page = await context.newPage();

// Navigate and automate
await navigateTo(page, 'https://example.com');
await page.click('button');
await takeScreenshot(page, 'screenshot.png');
```

### 2. **Web Scraping**

```typescript
import { scrapePage, deepScrape, saveResults } from './playwright-utils/web-scraping';

// Simple scraping
const data = await scrapePage('https://example.com', {
  title: 'h1',
  description: 'meta[name="description"]',
  links: 'a',
});

// Deep scrape with pagination
const results = await deepScrape('https://example.com', {
  maxPages: 10,
  browser: 'firefox',
});

await saveResults(results, './data/scraped.json');
```

### 3. **Testing Across Browsers**

```typescript
import { test, expect } from '@playwright/test';

test('works in all browsers', async ({ page, browserName }) => {
  await page.goto('https://example.com');
  console.log(`Testing in ${browserName}`);
  expect(await page.title()).toBeTruthy();
});
```

### 4. **Performance Monitoring**

```typescript
import { getPageMetrics } from './playwright-utils/browser-automation';

const metrics = await getPageMetrics(page);
console.log('Page Load Time:', metrics.loadComplete, 'ms');
console.log('First Contentful Paint:', metrics.firstContentfulPaint, 'ms');
```

### 5. **Mobile Testing**

```typescript
// Test with iPhone 12 viewport
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('https://example.com');

// Mobile Chrome (Pixel 5)
await page.setViewportSize({ width: 393, height: 851 });
```

### 6. **Screenshot & PDF Generation**

```typescript
import { takeScreenshot, generatePDF } from './playwright-utils/browser-automation';

// Full-page screenshot
await takeScreenshot(page, 'full-page.png', { fullPage: true });

// Generate PDF
await generatePDF(page, 'document.pdf', { format: 'A4' });
```

### 7. **Form Filling & Interaction**

```typescript
import { fillForm, waitAndClick } from './playwright-utils/browser-automation';

await fillForm(page, {
  'input[name="email"]': 'user@example.com',
  'input[name="password"]': 'password123',
});

await waitAndClick(page, 'button[type="submit"]');
```

## 🎯 Common Tasks

### Capture Screenshots in All Browsers

```typescript
import { browseAllBrowsers } from './playwright-utils/browser-automation';

await browseAllBrowsers(['https://example.com'], async (page, browser) => {
  await page.screenshot({ path: `screenshot-${browser}.png` });
});
```

### Monitor Page Changes

```typescript
import { monitorPageChanges } from './playwright-utils/web-scraping';

const changes = await monitorPageChanges(
  'https://example.com',
  '.dynamic-content',
  5000, // Check every 5 seconds
  60000 // For 60 seconds
);
```

### Extract Page Content

```typescript
import { extractContent } from './playwright-utils/web-scraping';

const content = await extractContent(page, {
  title: 'h1',
  description: 'p.description',
  links: 'a.external',
  images: 'img',
});
```

## 📊 Test Reports

After running tests, view detailed HTML reports:

```bash
npx playwright show-report
```

This opens an interactive report showing:
- ✅ Passed/failed/skipped tests
- 📹 Screenshots and videos of test execution
- ⏱️ Duration and performance metrics
- 🐛 Error messages and traces

## 🔧 Configuration

The `playwright.config.ts` includes:

- **Desktop Browsers**: Chrome, Firefox, Safari
- **Mobile Browsers**: Pixel 5, iPhone 12
- **Base URL**: `http://localhost:5173` (your dev server)
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Available for debugging

## 🎨 Viewport Sizes for Testing

```typescript
// Common viewport sizes
const viewports = {
  'Desktop (1920x1080)': { width: 1920, height: 1080 },
  'Laptop (1366x768)': { width: 1366, height: 768 },
  'Tablet (768x1024)': { width: 768, height: 1024 },
  'Mobile (375x667)': { width: 375, height: 667 },
};
```

## 🚨 Debugging

```bash
# Debug mode - step through tests
npx playwright test --debug

# Show test UI
npx playwright test --ui

# Headed mode (see browser)
npx playwright test --headed
```

## 📝 Next Steps

1. ✅ Create your test files in `tests/` directory
2. ✅ Use the utility functions from `playwright-utils/`
3. ✅ Configure selectors for your application
4. ✅ Run tests with `npm run test:e2e`
5. ✅ View results and debug failures

## 💡 Pro Tips

- Use `page.pause()` to pause test execution for debugging
- Use `page.screenshot()` to capture state at any point
- Use `page.waitForSelector()` to wait for dynamic content
- Use `page.evaluate()` to run custom JavaScript
- Use `page.route()` to intercept and mock API calls

## 📚 Resources

- [Playwright Docs](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

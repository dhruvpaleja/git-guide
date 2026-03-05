# 🎭 Playwright Advanced Functions Reference

## Complete API Documentation

### Browser Automation Functions

#### `launchBrowser(browserType, config)`
Launch a specific browser with custom configuration
```typescript
const browser = await launchBrowser('firefox', { headless: false });
// Options: 'chromium' | 'firefox' | 'webkit'
```

#### `createContext(browser, options)`
Create a browser context with viewport and settings
```typescript
const context = await createContext(browser, { 
  viewport: { width: 1280, height: 720 },
  userAgent: 'Custom UA'
});
```

#### `navigateTo(page, url, options)`
Navigate to URL with wait conditions
```typescript
await navigateTo(page, 'https://example.com', { 
  waitUntil: 'networkidle' 
});
```

#### `takeScreenshot(page, filepath, options)`
Take screenshot (full page or partial)
```typescript
await takeScreenshot(page, 'screenshot.png', { 
  fullPage: true,
  quality: 95 
});
```

#### `generatePDF(page, filepath, options)`
Generate PDF from page
```typescript
await generatePDF(page, 'document.pdf', { 
  format: 'A4',
  scale: 1.0 
});
```

#### `getAllLinks(page)`
Extract all links from page
```typescript
const links = await getAllLinks(page);
// Returns: string[]
```

#### `waitAndClick(page, selector, options)`
Wait for element and click it
```typescript
await waitAndClick(page, 'button.submit', { timeout: 5000 });
```

#### `fillForm(page, fields)`
Fill multiple form fields
```typescript
await fillForm(page, {
  'input[name="email"]': 'user@example.com',
  'input[name="password"]': 'pass123',
  'textarea[name="message"]': 'Hello!'
});
```

#### `getPageMetrics(page)`
Get page performance metrics
```typescript
const metrics = await getPageMetrics(page);
// Returns: { navigationStart, domContentLoaded, loadComplete, ... }
```

#### `browseAllBrowsers(urls, callback)`
Browse same URLs in all browsers
```typescript
await browseAllBrowsers(['url1', 'url2'], async (page, browser) => {
  console.log(`Testing in ${browser}`);
});
```

---

### Web Scraping Functions

#### `scrapePage(url, selectors, options)`
Scrape single page with custom selectors
```typescript
const data = await scrapePage('https://example.com', {
  title: 'h1',
  price: '.price',
  description: '.desc'
}, { browser: 'chromium' });
// Returns: ScrapedData
```

#### `extractContent(page, selectors)`
Extract content from page using selectors
```typescript
const content = await extractContent(page, {
  heading: 'h1',
  paragraphs: 'p',
  links: 'a'
});
// Returns: { [key]: string | null }
```

#### `scrapeMultiplePages(urls, selectors, options)`
Scrape multiple pages in sequence
```typescript
const results = await scrapeMultiplePages(
  ['url1', 'url2', 'url3'],
  { title: 'h1', content: 'main' }
);
// Returns: ScrapedData[]
```

#### `deepScrape(startUrl, options)`
Recursively scrape site starting from URL
```typescript
const results = await deepScrape('https://example.com', {
  maxPages: 50,
  browser: 'firefox',
  timeout: 30000
});
// Returns: ScrapedData[]
```

#### `scrapeJSRendered(url, options)`
Scrape JavaScript-rendered content
```typescript
const html = await scrapeJSRendered('https://example.com', {
  networkIdle: true,
  timeout: 60000
});
// Returns: string (HTML)
```

#### `saveResults(results, filepath, format)`
Save scraped data to file
```typescript
await saveResults(results, './data/output.json', 'json');
await saveResults(results, './data/output.csv', 'csv');
```

#### `monitorPageChanges(url, selector, checkInterval, maxDuration)`
Monitor page for content changes
```typescript
const changes = await monitorPageChanges(
  'https://example.com',
  '.dynamic-content',
  5000,  // Check every 5s
  60000  // For 60s total
);
// Returns: string[] (array of detected changes)
```

---

### API Testing Functions

#### `mockEndpoint(page, urlPattern, response)`
Mock API endpoint response
```typescript
await mockEndpoint(page, '/api/users', {
  status: 200,
  contentType: 'application/json',
  body: { users: [] }
});
```

#### `interceptNetworkRequests(page, callback)`
Intercept all network requests
```typescript
await interceptNetworkRequests(page, (request, response) => {
  console.log(`${request.method()} ${request.url()} - ${response.status()}`);
});
```

#### `blockUrls(page, patterns)`
Block specific URLs from loading
```typescript
await blockUrls(page, ['analytics.js', 'ads', 'tracking']);
```

#### `throttleNetwork(page, speed)`
Simulate network speed
```typescript
await throttleNetwork(page, '3g');
// speeds: 'slow-2g' | '2g' | '3g' | '4g'
```

#### `recordAPICalls(page)`
Record all API calls made by page
```typescript
const calls = await recordAPICalls(page);
await page.goto('https://example.com');
// Returns: Array of API call objects
```

#### `testAPIEndpoint(context, url, options)`
Test API endpoint directly
```typescript
const result = await testAPIEndpoint(context, 'https://api.example.com/data', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token' },
  data: { key: 'value' }
});
// Returns: { status, body, headers }
```

#### `setupAPIMock(page, mocks)`
Setup multiple API mocks at once
```typescript
await setupAPIMock(page, {
  '/api/users': { status: 200, body: { count: 5 } },
  '/api/posts': { status: 200, body: { items: [] } },
  '/api/comments': { status: 404, body: { error: 'Not found' } }
});
```

#### `simulateAPIFailure(page, urlPattern, statusCode, errorMessage)`
Simulate API error response
```typescript
await simulateAPIFailure(page, '/api/critical', 500, 'Server error');
```

#### `testAPIPayloads(context, url, testCases)`
Test API with multiple payloads
```typescript
await testAPIPayloads(context, '/api/submit', [
  { payload: { email: 'test@example.com' }, expectedStatus: 201, description: 'Valid email' },
  { payload: { email: '' }, expectedStatus: 400, description: 'Empty email' },
  { payload: { email: 'invalid' }, expectedStatus: 400, description: 'Invalid email' }
]);
```

#### `monitorAPIPerformance(page)`
Monitor API response times
```typescript
const timings = await monitorAPIPerformance(page);
// Returns: Map<string, number[]> (URL -> array of timestamps)
```

#### `validateResponseSchema(response, schema)`
Validate API response against schema
```typescript
const result = await validateResponseSchema(
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 'number', name: 'string', email: 'string' }
);
// Returns: { valid: boolean, errors: string[] }
```

#### `testAPIAuthentication(context, url, authMethods)`
Test different authentication methods
```typescript
await testAPIAuthentication(context, '/api/protected', [
  { method: 'bearer', value: 'token123' },
  { method: 'basic', value: 'user:pass' },
  { method: 'api-key', key: 'X-API-Key', value: 'key123' }
]);
```

#### `testRateLimiting(context, url, requestCount, delayMs)`
Test API rate limiting behavior
```typescript
const result = await testRateLimiting(
  context,
  '/api/endpoint',
  100,   // Make 100 requests
  10     // With 10ms delay between
);
// Returns: { successCount, rateLimited, totalTime }
```

---

## Type Definitions

### BrowserConfig
```typescript
interface BrowserConfig {
  headless?: boolean;
  slowMo?: number;
  args?: string[];
}
```

### AutomationOptions
```typescript
interface AutomationOptions extends BrowserConfig {
  browser?: 'chromium' | 'firefox' | 'webkit';
  viewport?: { width: number; height: number };
  userAgent?: string;
}
```

### ScrapingOptions
```typescript
interface ScrapingOptions {
  browser?: 'chromium' | 'firefox' | 'webkit';
  headless?: boolean;
  waitForSelector?: string;
  waitForNavigation?: boolean;
  timeout?: number;
}
```

### ScrapedData
```typescript
interface ScrapedData {
  url: string;
  title: string;
  content: Record<string, any>;
  metadata: {
    timestamp: string;
    browser: string;
    loadTime: number;
  };
}
```

### MockResponse
```typescript
interface MockResponse {
  status: number;
  contentType?: string;
  body: string | Record<string, any>;
  headers?: Record<string, string>;
}
```

---

## Import Examples

```typescript
// Import all utilities
import * as pw from './playwright-utils';

// Import specific functions
import { 
  launchBrowser, 
  takeScreenshot 
} from './playwright-utils/browser-automation';

import { 
  deepScrape, 
  saveResults 
} from './playwright-utils/web-scraping';

import { 
  mockEndpoint, 
  testAPIEndpoint 
} from './playwright-utils/api-testing';

// Import Playwright core
import { chromium, firefox, webkit } from 'playwright';
```

---

## Common Patterns

### Pattern 1: Full E2E Test
```typescript
const browser = await launchBrowser('chromium');
const context = await createContext(browser);
const page = await context.newPage();

await navigateTo(page, 'https://example.com');
await fillForm(page, { 'input[name="email"]': 'test@example.com' });
await waitAndClick(page, 'button[type="submit"]');

const screenshot = await takeScreenshot(page, 'result.png');

await context.close();
await browser.close();
```

### Pattern 2: Multi-browser Testing
```typescript
const browsers = ['chromium', 'firefox', 'webkit'] as const;
for (const browserType of browsers) {
  const browser = await launchBrowser(browserType);
  // ... test code ...
  await browser.close();
}
```

### Pattern 3: API Mocking + UI Testing
```typescript
await mockEndpoint(page, '/api/users', {
  status: 200,
  body: { users: [{ id: 1, name: 'John' }] }
});

await navigateTo(page, 'https://example.com');
// Component will use mocked API
```

### Pattern 4: Performance Testing
```typescript
await navigateTo(page, 'https://example.com');
const metrics = await getPageMetrics(page);

console.assert(metrics.firstContentfulPaint < 2500, 'FCP too slow');
console.assert(metrics.loadComplete < 5000, 'Page load too slow');
```

### Pattern 5: Web Scraping Pipeline
```typescript
const results = await deepScrape('https://example.com', { maxPages: 25 });
await saveResults(results, './output.json');

const data = results.map(r => ({
  url: r.url,
  title: r.title,
  content: r.content
}));
```

---

## 🎯 Next Steps

1. Choose the functions you need from above
2. Import them into your test files
3. Use them in your test cases
4. Run tests with `npm run test:e2e:ui`
5. Debug with `npm run test:e2e:debug`

Complete documentation: [PLAYWRIGHT_GUIDE.md](./PLAYWRIGHT_GUIDE.md)

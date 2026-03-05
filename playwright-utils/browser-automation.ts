import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';

/**
 * Advanced Playwright utilities for browser automation
 */

export interface BrowserConfig {
  headless?: boolean;
  slowMo?: number;
  args?: string[];
}

export interface AutomationOptions extends BrowserConfig {
  browser?: 'chromium' | 'firefox' | 'webkit';
  viewport?: { width: number; height: number };
  userAgent?: string;
}

/**
 * Launch a browser with custom configuration
 */
export async function launchBrowser(
  browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium',
  config: BrowserConfig = {}
): Promise<Browser> {
  const defaultConfig: BrowserConfig = {
    headless: true,
    ...config,
  };

  if (browserType === 'chromium') {
    return chromium.launch(defaultConfig);
  } else if (browserType === 'firefox') {
    return firefox.launch(defaultConfig);
  } else {
    return webkit.launch(defaultConfig);
  }
}

/**
 * Create a context with advanced options
 */
export async function createContext(
  browser: Browser,
  options: AutomationOptions = {}
): Promise<BrowserContext> {
  return browser.newContext({
    viewport: options.viewport || { width: 1280, height: 720 },
    userAgent: options.userAgent,
    locale: 'en-US',
    timezoneId: 'UTC',
  });
}

/**
 * Navigate to URL with advanced options
 */
export async function navigateTo(
  page: Page,
  url: string,
  options: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' } = {}
): Promise<void> {
  await page.goto(url, {
    waitUntil: options.waitUntil || 'networkidle',
  });
}

/**
 * Take screenshot with multiple formats
 */
export async function takeScreenshot(
  page: Page,
  filepath: string,
  options: { fullPage?: boolean; quality?: number } = {}
): Promise<Buffer> {
  return page.screenshot({
    path: filepath,
    fullPage: options.fullPage || false,
    quality: options.quality || 90,
  });
}

/**
 * Generate PDF from page
 */
export async function generatePDF(
  page: Page,
  filepath: string,
  options: { format?: string; scale?: number } = {}
): Promise<Buffer> {
  return page.pdf({
    path: filepath,
    format: options.format || 'A4',
    scale: options.scale || 1,
  });
}

/**
 * Extract all links from page
 */
export async function getAllLinks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map((a) => a.href);
  });
}

/**
 * Wait for element and interact
 */
export async function waitAndClick(
  page: Page,
  selector: string,
  options: { timeout?: number } = {}
): Promise<void> {
  await page.locator(selector).click({ timeout: options.timeout || 5000 });
}

/**
 * Fill form inputs
 */
export async function fillForm(
  page: Page,
  fields: Record<string, string>
): Promise<void> {
  for (const [selector, value] of Object.entries(fields)) {
    await page.locator(selector).fill(value);
  }
}

/**
 * Get page metrics
 */
export async function getPageMetrics(page: Page): Promise<Record<string, number>> {
  return page.evaluate(() => {
    const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const navigationTiming = timing as any;
    return {
      navigationStart: navigationTiming.navigationStart || 0,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      loadComplete: timing.loadEventEnd - timing.loadEventStart,
      firstPaint: (performance.getEntriesByName('first-paint')[0]?.startTime || 0),
      firstContentfulPaint: (performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0),
    };
  });
}

/**
 * Intercept and mock API responses
 */
export async function mockAPI(
  page: Page,
  urlPattern: string,
  responseData: Record<string, any>
): Promise<void> {
  await page.route(urlPattern, (route) => {
    route.abort('blockedbyclient');
  });

  await page.evaluate((data) => {
    (window as any).__mockData = data;
  }, responseData);
}

/**
 * Browse all pages in isolation
 */
export async function browseAllBrowsers(
  urls: string[],
  callback: (page: Page, browser: string) => Promise<void>
): Promise<void> {
  const browsers = ['chromium', 'firefox', 'webkit'] as const;

  for (const browserType of browsers) {
    const browser = await launchBrowser(browserType);
    const context = await createContext(browser);
    const page = await context.newPage();

    try {
      for (const url of urls) {
        await navigateTo(page, url);
        await callback(page, browserType);
      }
    } finally {
      await context.close();
      await browser.close();
    }
  }
}

export default {
  launchBrowser,
  createContext,
  navigateTo,
  takeScreenshot,
  generatePDF,
  getAllLinks,
  waitAndClick,
  fillForm,
  getPageMetrics,
  mockAPI,
  browseAllBrowsers,
};

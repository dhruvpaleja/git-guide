import { chromium, firefox, webkit, Page, Browser } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Advanced Web Scraping utilities with Playwright
 */

export interface ScrapingOptions {
  browser?: 'chromium' | 'firefox' | 'webkit';
  headless?: boolean;
  waitForSelector?: string;
  waitForNavigation?: boolean;
  timeout?: number;
}

export interface ScrapedData {
  url: string;
  title: string;
  content: Record<string, any>;
  metadata: {
    timestamp: string;
    browser: string;
    loadTime: number;
  };
}

/**
 * Scrape single page with advanced extraction
 */
export async function scrapePage(
  url: string,
  selectors: Record<string, string>,
  options: ScrapingOptions = {}
): Promise<ScrapedData> {
  const browserType = options.browser || 'chromium';
  const browser = await (browserType === 'chromium'
    ? chromium.launch({ headless: options.headless !== false })
    : browserType === 'firefox'
      ? firefox.launch({ headless: options.headless !== false })
      : webkit.launch({ headless: options.headless !== false }));

  const startTime = Date.now();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: options.waitForNavigation ? 'networkidle' : 'domcontentloaded',
      timeout: options.timeout || 30000,
    });

    if (options.waitForSelector) {
      await page.waitForSelector(options.waitForSelector, { timeout: options.timeout || 5000 });
    }

    const content = await extractContent(page, selectors);
    const loadTime = Date.now() - startTime;

    return {
      url,
      title: await page.title(),
      content,
      metadata: {
        timestamp: new Date().toISOString(),
        browser: browserType,
        loadTime,
      },
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

/**
 * Extract content from page using selectors
 */
export async function extractContent(
  page: Page,
  selectors: Record<string, string>
): Promise<Record<string, any>> {
  const content: Record<string, any> = {};

  for (const [key, selector] of Object.entries(selectors)) {
    try {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        content[key] = await element.innerHTML();
      }
    } catch (error) {
      content[key] = null;
    }
  }

  return content;
}

/**
 * Scrape multiple pages in parallel
 */
export async function scrapeMultiplePages(
  urls: string[],
  selectors: Record<string, string>,
  options: ScrapingOptions = {}
): Promise<ScrapedData[]> {
  const results: ScrapedData[] = [];

  for (const url of urls) {
    const data = await scrapePage(url, selectors, options);
    results.push(data);
    console.log(`✓ Scraped: ${url}`);
  }

  return results;
}

/**
 * Deep scrape site with pagination
 */
export async function deepScrape(
  startUrl: string,
  options: ScrapingOptions & { maxPages?: number; linkSelector?: string } = {}
): Promise<ScrapedData[]> {
  const browserType = options.browser || 'chromium';
  const browser = await (browserType === 'chromium'
    ? chromium.launch({ headless: options.headless !== false })
    : browserType === 'firefox'
      ? firefox.launch({ headless: options.headless !== false })
      : webkit.launch({ headless: options.headless !== false }));

  const context = await browser.newContext();
  const page = await context.newPage();
  const visited = new Set<string>();
  const results: ScrapedData[] = [];
  const maxPages = options.maxPages || 10;

  const traverse = async (url: string) => {
    if (visited.has(url) || visited.size >= maxPages) return;

    visited.add(url);
    console.log(`Scraping: ${url}`);

    try {
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: options.timeout || 30000,
      });

      const startTime = Date.now();
      const title = await page.title();
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'))
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((h) => h && h.startsWith(location.origin))
      );

      const content = {
        title,
        headings: await page.evaluate(() =>
          Array.from(document.querySelectorAll('h1, h2, h3')).map((h) => h.textContent)
        ),
        paragraphs: await page.evaluate(() =>
          Array.from(document.querySelectorAll('p')).map((p) => p.textContent)
        ),
      };

      results.push({
        url,
        title,
        content,
        metadata: {
          timestamp: new Date().toISOString(),
          browser: browserType,
          loadTime: Date.now() - startTime,
        },
      });

      // Recursively traverse found links
      for (const link of links.slice(0, 3)) {
        if (!visited.has(link)) {
          await traverse(link);
        }
      }
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  };

  await traverse(startUrl);
  await context.close();
  await browser.close();

  return results;
}

/**
 * Scrape with JavaScript rendering
 */
export async function scrapeJSRendered(
  url: string,
  options: ScrapingOptions & { networkIdle?: boolean } = {}
): Promise<string> {
  const browserType = options.browser || 'chromium';
  const browser = await (browserType === 'chromium'
    ? chromium.launch({ headless: options.headless !== false })
    : browserType === 'firefox'
      ? firefox.launch({ headless: options.headless !== false })
      : webkit.launch({ headless: options.headless !== false }));

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: options.networkIdle ? 'networkidle' : 'domcontentloaded',
      timeout: options.timeout || 30000,
    });

    return await page.content();
  } finally {
    await context.close();
    await browser.close();
  }
}

/**
 * Save scraping results to file
 */
export async function saveResults(
  results: ScrapedData[],
  filepath: string,
  format: 'json' | 'csv' = 'json'
): Promise<void> {
  const dir = path.dirname(filepath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (format === 'json') {
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
  } else if (format === 'csv') {
    const csv = [
      'URL,Title,LoadTime,Timestamp',
      ...results.map((r) => `"${r.url}","${r.title}",${r.metadata.loadTime},"${r.metadata.timestamp}"`),
    ].join('\n');

    fs.writeFileSync(filepath, csv);
  }

  console.log(`✓ Results saved to: ${filepath}`);
}

/**
 * Monitor page for changes
 */
export async function monitorPageChanges(
  url: string,
  selector: string,
  checkInterval: number = 5000,
  maxDuration: number = 60000
): Promise<string[]> {
  const browserType = 'chromium';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const changes: string[] = [];
  let lastContent = '';
  const startTime = Date.now();

  try {
    await page.goto(url);

    while (Date.now() - startTime < maxDuration) {
      await page.waitForTimeout(checkInterval);

      const content = await page.locator(selector).first().innerHTML().catch(() => '');

      if (content !== lastContent) {
        changes.push(content);
        lastContent = content;
        console.log('✓ Page change detected');
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  return changes;
}

export default {
  scrapePage,
  extractContent,
  scrapeMultiplePages,
  deepScrape,
  scrapeJSRendered,
  saveResults,
  monitorPageChanges,
};

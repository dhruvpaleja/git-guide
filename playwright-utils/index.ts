/**
 * Playwright Advanced Utilities - Complete Index
 * 
 * This module exports all advanced browser automation, scraping, and API testing utilities
 */

// Browser Automation Utilities
export {
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
  type BrowserConfig,
  type AutomationOptions,
} from './browser-automation';

// Web Scraping Utilities
export {
  scrapePage,
  extractContent,
  scrapeMultiplePages,
  deepScrape,
  scrapeJSRendered,
  saveResults,
  monitorPageChanges,
  type ScrapingOptions,
  type ScrapedData,
} from './web-scraping';

// API Testing and Mocking
export {
  mockEndpoint,
  interceptNetworkRequests,
  blockUrls,
  throttleNetwork,
  recordAPICalls,
  testAPIEndpoint,
  setupAPIMock,
  simulateAPIFailure,
  testAPIPayloads,
  monitorAPIPerformance,
  validateResponseSchema,
  testAPIAuthentication,
  testRateLimiting,
  type MockResponse,
  type InterceptOptions,
} from './api-testing';

// Re-export Playwright core modules for convenience
export { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from 'playwright';

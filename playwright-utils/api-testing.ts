import { Page, Route, APIRequestContext } from 'playwright';

/**
 * Advanced API Testing and Mocking utilities for Playwright
 */

export interface MockResponse {
  status: number;
  contentType?: string;
  body: string | Record<string, any>;
  headers?: Record<string, string>;
}

export interface InterceptOptions {
  method?: string;
  status?: number;
  delay?: number;
}

/**
 * Mock API endpoints
 */
export async function mockEndpoint(
  page: Page,
  urlPattern: string,
  response: MockResponse
): Promise<void> {
  await page.route(urlPattern, (route: Route) => {
    const body = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);

    route.fulfill({
      status: response.status || 200,
      contentType: response.contentType || 'application/json',
      body,
      headers: response.headers,
    });
  });
}

/**
 * Intercept and log all network requests
 */
export async function interceptNetworkRequests(
  page: Page,
  callback?: (request: any, response: any) => void
): Promise<void> {
  page.on('response', async (response) => {
    const request = response.request();
    if (callback) {
      callback(request, response);
    } else {
      console.log(`${request.method()} ${request.url()} - ${response.status()}`);
    }
  });
}

/**
 * Block specific URLs
 */
export async function blockUrls(page: Page, patterns: string[]): Promise<void> {
  await page.route(`**/${patterns.join('|')}/**`, (route: Route) => {
    route.abort('blockedbyclient');
  });
}

/**
 * Throttle network speeds
 */
export async function throttleNetwork(
  page: Page,
  speed: 'slow-2g' | '2g' | '3g' | '4g' = '4g'
): Promise<void> {
  const speeds = {
    'slow-2g': { downloadThroughput: 50 * 1024 / 8, uploadThroughput: 20 * 1024 / 8, latency: 2000 },
    '2g': { downloadThroughput: 250 * 1024 / 8, uploadThroughput: 50 * 1024 / 8, latency: 2000 },
    '3g': { downloadThroughput: 750 * 1024 / 8, uploadThroughput: 250 * 1024 / 8, latency: 100 },
    '4g': { downloadThroughput: 4 * 1024 * 1024 / 8, uploadThroughput: 3 * 1024 * 1024 / 8, latency: 50 },
  };

  await page.route('**/*', (route: Route) => {
    setTimeout(() => {
      route.continue();
    }, speeds[speed].latency);
  });
}

/**
 * Record all API calls
 */
export async function recordAPICalls(page: Page): Promise<Record<string, any>[]> {
  const calls: Record<string, any>[] = [];

  await page.on('response', async (response) => {
    const request = response.request();
    if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
      const body = request.postDataBuffer();
      calls.push({
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        body: body ? body.toString() : null,
        status: response.status(),
        timestamp: new Date().toISOString(),
      });
    }
  });

  return calls;
}

/**
 * Test API endpoint directly
 */
export async function testAPIEndpoint(
  context: APIRequestContext,
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    data?: Record<string, any>;
  } = {}
): Promise<{ status: number; body: any; headers: Record<string, string> }> {
  const response = await context.fetch(url, {
    method: options.method || 'GET',
    headers: options.headers,
    data: options.data,
  });

  return {
    status: response.status(),
    body: await response.json().catch(() => response.text()),
    headers: response.headers(),
  };
}

/**
 * Mock entire API with intercepted requests
 */
export async function setupAPIMock(
  page: Page,
  mocks: Record<string, MockResponse>
): Promise<void> {
  for (const [pattern, response] of Object.entries(mocks)) {
    await mockEndpoint(page, pattern, response);
  }
}

/**
 * Simulate API failures
 */
export async function simulateAPIFailure(
  page: Page,
  urlPattern: string,
  statusCode: number = 500,
  errorMessage: string = 'Internal Server Error'
): Promise<void> {
  await page.route(urlPattern, (route: Route) => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({ error: errorMessage }),
    });
  });
}

/**
 * Test API with different payloads
 */
export async function testAPIPayloads(
  context: APIRequestContext,
  url: string,
  testCases: Array<{
    payload: Record<string, any>;
    expectedStatus: number;
    description: string;
  }>
): Promise<void> {
  for (const testCase of testCases) {
    const response = await context.fetch(url, {
      method: 'POST',
      data: testCase.payload,
    });

    const status = response.status();
    const passed = status === testCase.expectedStatus;

    console.log(
      `${passed ? '✓' : '✗'} ${testCase.description} - Expected: ${testCase.expectedStatus}, Got: ${status}`
    );
  }
}

/**
 * Monitor API response times
 */
export async function monitorAPIPerformance(page: Page): Promise<Map<string, number[]>> {
  const timings = new Map<string, number[]>();

  await page.on('response', async (response) => {
    const request = response.request();
    if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
      const url = request.url();
      const time = Date.now();

      if (!timings.has(url)) {
        timings.set(url, []);
      }

      timings.get(url)!.push(time);
    }
  });

  return timings;
}

/**
 * Validate API response schema
 */
export async function validateResponseSchema(
  response: Record<string, any>,
  schema: Record<string, string>
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  for (const [key, type] of Object.entries(schema)) {
    if (!(key in response)) {
      errors.push(`Missing required field: ${key}`);
    } else if (typeof response[key] !== type) {
      if (type === 'defined' && response[key] === undefined) {
        errors.push(`Field ${key} is not defined`);
      } else {
        errors.push(`Field ${key} should be ${type}, got ${typeof response[key]}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Test API authentication
 */
export async function testAPIAuthentication(
  context: APIRequestContext,
  url: string,
  authMethods: Array<{
    method: 'bearer' | 'basic' | 'api-key';
    value: string;
    key?: string; // for api-key method
  }>
): Promise<void> {
  for (const auth of authMethods) {
    let headers: Record<string, string> = {};

    if (auth.method === 'bearer') {
      headers['Authorization'] = `Bearer ${auth.value}`;
    } else if (auth.method === 'basic') {
      headers['Authorization'] = `Basic ${Buffer.from(auth.value).toString('base64')}`;
    } else if (auth.method === 'api-key') {
      headers[auth.key || 'X-API-Key'] = auth.value;
    }

    const response = await context.fetch(url, { headers });
    console.log(`${auth.method} Auth - Status: ${response.status()}`);
  }
}

/**
 * Rate limit testing
 */
export async function testRateLimiting(
  context: APIRequestContext,
  url: string,
  requestCount: number = 100,
  delayMs: number = 10
): Promise<{ successCount: number; rateLimited: number; totalTime: number }> {
  let successCount = 0;
  let rateLimitedCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < requestCount; i++) {
    try {
      const response = await context.fetch(url);
      if (response.status() === 429) {
        rateLimitedCount++;
      } else if (response.ok()) {
        successCount++;
      }
    } catch (error) {
      rateLimitedCount++;
    }

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return {
    successCount,
    rateLimited: rateLimitedCount,
    totalTime: Date.now() - startTime,
  };
}

export default {
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
};

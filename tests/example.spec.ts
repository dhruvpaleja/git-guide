import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Wait for the page shell (main or [role="main"]) to be visible. */
async function expectPageShell(page: import('@playwright/test').Page) {
  const shell = page.locator('main, [role="main"]');
  await expect(shell).toBeVisible({ timeout: 15_000 });
}

// ---------------------------------------------------------------------------
// 1. Public route smoke
// ---------------------------------------------------------------------------

test.describe('Public routes @smoke @public', () => {
  const publicRoutes = [
    { path: '/home', label: 'Home / Landing' },
    { path: '/about', label: 'About' },
    { path: '/business', label: 'Business' },
    { path: '/courses', label: 'Courses' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/contact', label: 'Contact' },
  ];

  for (const { path, label } of publicRoutes) {
    test(`${label} (${path}) loads without fatal error @smoke @public`, async ({ page }) => {
      await page.goto(path);
      await expectPageShell(page);
    });
  }

  test('Splash screen (/) loads @smoke @public', async ({ page }) => {
    await page.goto('/');
    // Splash may not have a <main>; just ensure the page didn't white-screen
    await expect(page.locator('body')).toBeVisible();
    // Title should be defined
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 2. Auth smoke (mock-auth path)
// ---------------------------------------------------------------------------

test.describe('Auth flow @smoke @auth', () => {
  test('Login page loads @smoke @auth', async ({ page }) => {
    await page.goto('/login');
    // Expect the login heading to be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Mock user can log in and reach dashboard @smoke @auth', async ({ page }) => {
    await page.goto('/login');

    // Fill the login form using semantic selectors
    await page.locator('#email').fill('user@test.com');
    await page.locator('#password').fill('user123');
    await page.getByRole('button', { name: /log in/i }).click();

    // After login the user role "user" is redirected to /journey-preparation
    // then they can navigate to /dashboard. Wait for navigation away from /login.
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 });

    // Verify we are no longer on the login page
    expect(page.url()).not.toContain('/login');
  });
});

// ---------------------------------------------------------------------------
// 3. Dashboard route smoke
//    Auth bypass is enabled by default in dev, so protected routes are directly
//    accessible without login.
// ---------------------------------------------------------------------------

test.describe('Dashboard routes @smoke @dashboard', () => {
  const dashboardRoutes = [
    { path: '/dashboard', label: 'Dashboard home' },
    { path: '/dashboard/sessions', label: 'Dashboard sessions' },
    { path: '/dashboard/notifications', label: 'Dashboard notifications' },
    { path: '/dashboard/personalization', label: 'Dashboard personalization' },
  ];

  for (const { path, label } of dashboardRoutes) {
    test(`${label} (${path}) renders without crash @smoke @dashboard`, async ({ page }) => {
      await page.goto(path);
      // Dashboard pages are wrapped in DashboardLayout which renders a main area
      await expectPageShell(page);

      // Verify at least one heading or significant container is present
      const heading = page.locator('h1, h2, h3, [data-testid]').first();
      await expect(heading).toBeVisible({ timeout: 10_000 });
    });
  }
});

// ---------------------------------------------------------------------------
// 4. Resilience smoke
// ---------------------------------------------------------------------------

test.describe('Resilience @smoke @resilience', () => {
  test('App survives a failing API call without blank screen @smoke @resilience', async ({ page }) => {
    // Intercept all fetch requests to /api/* and abort them to simulate network failure
    await page.route('**/api/**', (route) => route.abort('connectionfailed'));

    // Navigate to a page that may call APIs (dashboard home)
    await page.goto('/dashboard');

    // The page shell should still render even if APIs fail
    await expectPageShell(page);
  });

  test('App survives slow API responses @smoke @resilience', async ({ page }) => {
    // Intercept API calls with a 5-second delay
    await page.route('**/api/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      await route.abort('connectionfailed');
    });

    await page.goto('/dashboard');
    // The page shell should be visible even while APIs are pending
    await expectPageShell(page);
  });
});

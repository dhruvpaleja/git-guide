import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:4173';
const RUN_LABEL = process.env.AUDIT_RUN_LABEL ?? 'baseline';
const OUT_DIR = path.resolve(process.cwd(), 'docs/execution/evidence/BATCH_013_RESPONSIVENESS', RUN_LABEL);

const BREAKPOINTS = [
  { name: 'mobile-320', width: 320, height: 800 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-834', width: 834, height: 1112 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const ROUTES = [
  { id: 'landing', path: '/home' },
  { id: 'about', path: '/about' },
  { id: 'business', path: '/business' },
  { id: 'corporate', path: '/business/corporate' },
  { id: 'courses', path: '/courses' },
  { id: 'course-details', path: '/courses/1' },
  { id: 'blogs', path: '/blogs' },
  { id: 'blog-post', path: '/blog/1' },
  { id: 'careers', path: '/careers' },
  { id: 'contact', path: '/contact' },
  { id: 'student-counselling', path: '/student-counselling' },
  { id: 'workshop-demo', path: '/business/workshop-demo' },
  { id: 'student-counselling-demo', path: '/business/student-counselling-demo' },
  { id: 'login', path: '/login' },
  { id: 'signup', path: '/signup' },
  { id: 'signup-account-step', path: '/signup?step=account' },
  { id: 'signup-astrology-step', path: '/signup?step=astrology' },
  { id: 'signup-partner-step', path: '/signup?step=partner-details' },
  { id: 'practitioner-onboarding-step-1', path: '/practitioner-onboarding?step=1&role=therapist' },
  { id: 'practitioner-onboarding-step-2', path: '/practitioner-onboarding?step=2&role=therapist' },
  { id: 'practitioner-onboarding-step-3', path: '/practitioner-onboarding?step=3&role=therapist' },
  { id: 'dashboard-home', path: '/dashboard' },
  { id: 'dashboard-sessions', path: '/dashboard/sessions' },
  { id: 'dashboard-notifications', path: '/dashboard/notifications' },
  { id: 'dashboard-connections', path: '/dashboard/connections' },
  { id: 'dashboard-personalization', path: '/dashboard/personalization?s=4' },
  { id: 'dashboard-mood', path: '/dashboard/mood' },
  { id: 'dashboard-journal', path: '/dashboard/journal' },
  { id: 'dashboard-meditate', path: '/dashboard/meditate' },
  { id: 'dashboard-profile', path: '/dashboard/profile' },
  { id: 'dashboard-settings', path: '/dashboard/settings' },
  { id: 'dashboard-constellation', path: '/dashboard/constellation' },
  { id: 'dashboard-confessional', path: '/dashboard/confessional' },
  { id: 'practitioner-dashboard', path: '/practitioner' },
  { id: 'practitioner-sessions', path: '/practitioner/sessions' },
  { id: 'practitioner-clients', path: '/practitioner/clients' },
  { id: 'practitioner-availability', path: '/practitioner/availability' },
  { id: 'practitioner-profile', path: '/practitioner/profile' },
  { id: 'practitioner-logout', path: '/practitioner/logout' },
  { id: 'astrology-dashboard', path: '/astrology' },
  { id: 'admin-dashboard', path: '/admin' },
];

function classifyStatus(diagnostics) {
  const hasHardOverflow = diagnostics.horizontalOverflowPx > 1;
  const hasOffscreenContent = diagnostics.outOfViewportElements.length > 0;
  const hasTouchTargetRisk = diagnostics.smallTouchTargets.length > 0;

  if (hasHardOverflow) {
    return 'fail';
  }

  if (hasTouchTargetRisk || hasOffscreenContent) {
    return 'warn';
  }

  return 'pass';
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function captureRouteBreakpoint(page, route, breakpoint) {
  await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
  await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1000);

  const diagnostics = await page.evaluate(() => {
    const vw = window.innerWidth;
    const html = document.documentElement;
    const body = document.body;
    const horizontalOverflowPx = Math.max(0, html.scrollWidth - html.clientWidth, body.scrollWidth - body.clientWidth);

    const getSelector = (el) => {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : '';
      const className = typeof el.className === 'string'
        ? el.className.split(/\s+/).filter(Boolean).slice(0, 2).map((c) => `.${c}`).join('')
        : '';
      return `${tag}${id}${className}`;
    };

    const outOfViewportElements = [];
    if (horizontalOverflowPx > 1) {
      const elements = Array.from(document.querySelectorAll('body *'));
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (el.closest('.pointer-events-none')) {
          continue;
        }
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          continue;
        }
        if (rect.width < 4 || rect.height < 4) {
          continue;
        }
        if (style.position === 'fixed' && (rect.right < 0 || rect.left > vw)) {
          continue;
        }
        if (rect.right > vw + 1 || rect.left < -1) {
          outOfViewportElements.push({
            selector: getSelector(el),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          });
        }
        if (outOfViewportElements.length >= 8) {
          break;
        }
      }
    }

    const smallTouchTargets = [];
    if (vw <= 834) {
      const touchCandidates = Array.from(
        document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]')
      );
      for (const el of touchCandidates) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (
          el instanceof HTMLInputElement &&
          (el.type === 'checkbox' || el.type === 'radio' || el.type === 'hidden')
        ) {
          continue;
        }
        if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') {
          continue;
        }
        if (rect.width < 1 || rect.height < 1) {
          continue;
        }
        const minDim = Math.min(rect.width, rect.height);
        if (minDim < 32) {
          smallTouchTargets.push({
            selector: getSelector(el),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
        if (smallTouchTargets.length >= 8) {
          break;
        }
      }
    }

    return {
      horizontalOverflowPx: Math.round(horizontalOverflowPx),
      outOfViewportElements,
      smallTouchTargets,
    };
  });

  const routeDir = path.join(OUT_DIR, route.id);
  await ensureDir(routeDir);
  await page.screenshot({
    path: path.join(routeDir, `${breakpoint.name}.png`),
    fullPage: true,
  });

  return {
    breakpoint: breakpoint.name,
    viewport: `${breakpoint.width}x${breakpoint.height}`,
    status: classifyStatus(diagnostics),
    diagnostics,
  };
}

async function run() {
  await ensureDir(OUT_DIR);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  const report = [];
  for (const route of ROUTES) {
    const routeReport = { routeId: route.id, path: route.path, results: [] };
    for (const breakpoint of BREAKPOINTS) {
      const result = await captureRouteBreakpoint(page, route, breakpoint);
      routeReport.results.push(result);
      process.stdout.write(
        `[${RUN_LABEL}] ${route.id} @ ${breakpoint.name} -> ${result.status} (overflow=${result.diagnostics.horizontalOverflowPx})\n`
      );
    }
    report.push(routeReport);
  }

  await browser.close();

  await fs.writeFile(
    path.join(OUT_DIR, 'report.json'),
    JSON.stringify(
      {
        baseUrl: BASE_URL,
        generatedAt: new Date().toISOString(),
        runLabel: RUN_LABEL,
        breakpoints: BREAKPOINTS,
        routes: ROUTES,
        report,
      },
      null,
      2
    ),
    'utf8'
  );
}

await run();

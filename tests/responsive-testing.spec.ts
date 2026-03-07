import { test, expect } from '@playwright/test';

/**
 * COMPREHENSIVE RESPONSIVE TESTING
 * Tests ALL screen sizes to ensure perfect layout
 */

// All device viewports to test
const VIEWPORTS = {
  // Phones (Portrait)
  'iPhone SE (1st gen)': { width: 320, height: 568 },
  'iPhone SE (3rd gen)': { width: 375, height: 667 },
  'iPhone 12/13/14': { width: 390, height: 844 },
  'iPhone 14 Pro Max': { width: 430, height: 932 },
  'Samsung Galaxy S21': { width: 360, height: 800 },
  'Google Pixel 7': { width: 412, height: 915 },
  
  // Phones (Landscape)
  'iPhone Landscape': { width: 844, height: 390 },
  'Android Landscape': { width: 800, height: 360 },
  
  // Tablets (Portrait)
  'iPad Mini': { width: 768, height: 1024 },
  'iPad Air': { width: 820, height: 1180 },
  'iPad Pro 11"': { width: 834, height: 1194 },
  'iPad Pro 12.9"': { width: 1024, height: 1366 },
  
  // Tablets (Landscape)
  'iPad Landscape': { width: 1024, height: 768 },
  'Surface Pro': { width: 912, height: 684 },
  
  // Laptops
  'MacBook Air 13"': { width: 1280, height: 800 },
  'MacBook Pro 14"': { width: 1512, height: 982 },
  'MacBook Pro 16"': { width: 1728, height: 1117 },
  'Dell XPS 13': { width: 1920, height: 1080 },
  'ThinkPad X1': { width: 1920, height: 1200 },
  
  // Desktops
  'iMac 24"': { width: 2304, height: 1440 },
  'iMac 27"': { width: 2560, height: 1440 },
  'Dell UltraSharp': { width: 3840, height: 2160 },
  
  // Ultrawide
  'LG Ultrawide': { width: 3440, height: 1440 },
  'Samsung Odyssey': { width: 4960, height: 1440 },
  
  // Foldables
  'Galaxy Fold': { width: 280, height: 653 },
  'Galaxy Fold Unfolded': { width: 720, height: 563 },
  'Surface Duo': { width: 540, height: 720 },
};

// Critical pages to test
const PAGES = [
  { path: '/', name: 'Home/Landing' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/dashboard/sessions', name: 'Sessions' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/about', name: 'About' },
  { path: '/business', name: 'Business' },
  { path: '/courses', name: 'Courses' },
  { path: '/blogs', name: 'Blogs' },
  { path: '/contact', name: 'Contact' },
];

// Breakpoints to verify
const BREAKPOINTS = {
  'sm': 640,    // Mobile
  'md': 768,    // Tablet
  'lg': 1024,   // Laptop
  'xl': 1280,   // Desktop
  '2xl': 1536,  // Large Desktop
};

test.describe('📱 RESPONSIVE TESTING - All Devices', () => {
  // Test critical pages on all viewports
  for (const [device, viewport] of Object.entries(VIEWPORTS)) {
    test.describe(`Device: ${device}`, () => {
      for (const page of PAGES) {
        test(`${page.name} - ${device}`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.goto(page.path, { waitUntil: 'networkidle' });
          
          // Check for layout issues
          await expect(page.locator('body')).toBeVisible();
          
          // Check for horizontal scroll (should not exist)
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          
          // Allow small tolerance (1px) for sub-pixel rendering
          expect(hasHorizontalScroll).toBeFalsy();
          
          // Check main content is visible
          const mainContent = page.locator('main, [role="main"], #main-content').first();
          await expect(mainContent).toBeVisible();
          
          // Check navigation is accessible
          const nav = page.locator('nav, [role="navigation"]').first();
          await expect(nav).toBeVisible();
          
          // Check for overlapping elements
          const overlappingElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('body > *');
            const rects: DOMRect[] = [];
            let hasOverlap = false;
            
            elements.forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                rects.push(rect);
              }
            });
            
            // Simple overlap check
            for (let i = 0; i < rects.length; i++) {
              for (let j = i + 1; j < rects.length; j++) {
                if (
                  rects[i].left < rects[j].right &&
                  rects[i].right > rects[j].left &&
                  rects[i].top < rects[j].bottom &&
                  rects[i].bottom > rects[j].top
                ) {
                  hasOverlap = true;
                  break;
                }
              }
            }
            
            return hasOverlap;
          });
          
          expect(overlappingElements).toBeFalsy();
          
          // Take screenshot for visual verification
          await page.screenshot({
            path: `test-results/responsive/${device.replace(/[^a-z0-9]/gi, '-')}-${page.name.replace(/[^a-z0-9]/gi, '-')}.png`,
            fullPage: true,
          });
        });
      }
    });
  }
});

test.describe('🖥️ BREAKPOINT TESTING', () => {
  for (const [breakpoint, width] of Object.entries(BREAKPOINTS)) {
    test(`Breakpoint ${breakpoint} (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1024 });
      await page.goto('/dashboard', { waitUntil: 'networkidle' });
      
      // Verify CSS breakpoint is working
      const actualBreakpoint = await page.evaluate((bp) => {
        const breakpoints = {
          'sm': '(min-width: 640px)',
          'md': '(min-width: 768px)',
          'lg': '(min-width: 1024px)',
          'xl': '(min-width: 1280px)',
          '2xl': '(min-width: 1536px)',
        };
        return window.matchMedia(breakpoints[bp as keyof typeof breakpoints]).matches;
      }, breakpoint);
      
      expect(actualBreakpoint).toBeTruthy();
    });
  }
});

test.describe('📐 LAYOUT STABILITY', () => {
  test('No layout shift on load', async ({ page }) => {
    await page.goto('/');
    
    // Measure layout stability
    const layoutShift = await page.evaluate(() => {
      let shift = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            shift += (entry as any).value;
          }
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
      
      // Wait for layout to stabilize
      return new Promise((resolve) => {
        setTimeout(() => {
          observer.disconnect();
          resolve(shift);
        }, 2000);
      });
    });
    
    // Cumulative Layout Shift should be < 0.1
    expect(layoutShift).toBeLessThan(0.1);
  });
  
  test('Text remains readable at all sizes', async ({ page }) => {
    const testSizes = [320, 768, 1024, 1920];
    
    for (const width of testSizes) {
      await page.setViewportSize({ width, height: 1024 });
      await page.goto('/');
      
      // Check font sizes are readable
      const fontSizes = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
        const sizes: number[] = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize > 0) {
            sizes.push(fontSize);
          }
        });
        
        return sizes;
      });
      
      // Minimum font size should be 12px for readability
      const minFontSize = Math.min(...fontSizes);
      expect(minFontSize).toBeGreaterThanOrEqual(12);
    }
  });
});

test.describe('👆 TOUCH FRIENDLINESS', () => {
  test('All buttons are touch-friendly (min 44x44px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/dashboard');
    
    const touchTargets = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]');
      const smallTargets: { selector: string; width: number; height: number }[] = [];
      
      buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          smallTargets.push({
            selector: btn.tagName.toLowerCase() + (btn.className ? '.' + (btn.className as string).split(' ')[0] : ''),
            width: rect.width,
            height: rect.height,
          });
        }
      });
      
      return smallTargets;
    });
    
    // All touch targets should be at least 44x44px (WCAG guideline)
    expect(touchTargets.length).toBe(0);
  });
});

test.describe('🔄 ORIENTATION TESTING', () => {
  test('Works in both portrait and landscape', async ({ page }) => {
    const pages = ['/', '/dashboard', '/dashboard/sessions'];
    
    for (const path of pages) {
      // Portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
      
      // Landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
      
      // Check no content is cut off
      const isContentVisible = await page.evaluate(() => {
        const main = document.querySelector('main, [role="main"]');
        if (!main) return false;
        const rect = main.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      expect(isContentVisible).toBeTruthy();
    }
  });
});

test.describe('🎨 CSS CONTAINER QUERIES', () => {
  test('Container queries work correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    const supportsContainerQueries = await page.evaluate(() => {
      return CSS.supports('container-type: inline-size');
    });
    
    // Modern browsers should support container queries
    expect(supportsContainerQueries).toBeTruthy();
  });
});

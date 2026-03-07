/**
 * Activity Tracker — Frontend
 *
 * Captures EVERYTHING the user does:
 * - Clicks (what they click, button text, element type)
 * - Typing (which fields they type in, character count, NOT passwords)
 * - Navigation (page changes, time on each page)
 * - Scrolling (scroll depth, direction)
 * - Form submissions
 * - Focus/blur on inputs
 * - Copy/paste events
 * - Errors (JS errors, unhandled rejections)
 * - Tab visibility changes
 * - Window resize / orientation
 * - API calls (endpoint, response time, status)
 *
 * Events are batched and sent every 5 seconds (or on page unload)
 * to minimize network overhead.
 */

import { API_CONSTANTS } from '@/constants';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TrackedEvent {
  eventType: string;
  eventCategory: string;
  target?: string;
  targetText?: string;
  value?: string;
  page: string;
  component?: string;
  section?: string;
  metadata?: Record<string, unknown>;
  deviceType?: string;
  browser?: string;
  screenWidth?: number;
  screenHeight?: number;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  timestamp: string;
  duration?: number;
  sessionId: string;
}

// ─── Session ID ─────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  const KEY = 'sy_activity_session';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

// ─── Device Detection ───────────────────────────────────────────────────────

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return `Firefox ${ua.split('Firefox/')[1]?.split(' ')[0] || ''}`;
  if (ua.includes('Edg/')) return `Edge ${ua.split('Edg/')[1]?.split(' ')[0] || ''}`;
  if (ua.includes('Chrome/')) return `Chrome ${ua.split('Chrome/')[1]?.split(' ')[0] || ''}`;
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return `Safari ${ua.split('Version/')[1]?.split(' ')[0] || ''}`;
  return 'Other';
}

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  };
}

// ─── Element Identification ─────────────────────────────────────────────────

function getElementSelector(el: Element): string {
  // Build a readable selector
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const classes = el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
    : '';
  const type = el.getAttribute('type') ? `[type="${el.getAttribute('type')}"]` : '';
  const name = el.getAttribute('name') ? `[name="${el.getAttribute('name')}"]` : '';
  const dataTestId = el.getAttribute('data-testid') ? `[data-testid="${el.getAttribute('data-testid')}"]` : '';
  const ariaLabel = el.getAttribute('aria-label') ? `[aria-label="${el.getAttribute('aria-label')}"]` : '';

  return `${tag}${id}${classes}${type}${name}${dataTestId}${ariaLabel}`.slice(0, 200);
}

function getElementText(el: Element): string | undefined {
  const text =
    el.getAttribute('aria-label') ||
    el.textContent?.trim().slice(0, 100) ||
    el.getAttribute('title') ||
    el.getAttribute('placeholder');
  return text || undefined;
}

function getClosestComponent(el: Element): string | undefined {
  // Walk up to find a React component marker or section
  let current: Element | null = el;
  while (current) {
    const component = current.getAttribute('data-component') || current.getAttribute('data-section');
    if (component) return component;
    current = current.parentElement;
  }
  return undefined;
}

function getClosestSection(el: Element): string | undefined {
  let current: Element | null = el;
  while (current) {
    const section = current.getAttribute('data-section') ||
      current.closest('section')?.getAttribute('data-section') ||
      current.closest('[data-section]')?.getAttribute('data-section');
    if (section) return section;
    if (current.tagName === 'SECTION' || current.tagName === 'MAIN' || current.tagName === 'HEADER' || current.tagName === 'FOOTER') {
      return current.tagName.toLowerCase();
    }
    current = current.parentElement;
  }
  return undefined;
}

function isSensitiveField(el: Element): boolean {
  const type = el.getAttribute('type')?.toLowerCase();
  const name = (el.getAttribute('name') || '').toLowerCase();
  const id = (el.id || '').toLowerCase();
  return (
    type === 'password' ||
    /password|passwd|secret|token|creditcard|cvv|ssn|otp|card.?number/i.test(name) ||
    /password|passwd|secret|token|creditcard|cvv|ssn|otp|card.?number/i.test(id)
  );
}

// ─── Main Tracker Class ─────────────────────────────────────────────────────

class ActivityTracker {
  private buffer: TrackedEvent[] = [];
  private sessionId: string;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private lastPage: string = '';
  private pageEnterTime: number = Date.now();
  private maxScrollDepth: number = 0;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private typingTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private typingCounts: Map<string, number> = new Map();
  private initialized = false;

  constructor() {
    this.sessionId = getOrCreateSessionId();
  }

  /** Start tracking everything */
  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.lastPage = window.location.pathname;
    this.pageEnterTime = Date.now();

    // Track page navigation (for SPAs, listen to popstate + intercept pushState)
    this.trackNavigation();

    // Track clicks
    document.addEventListener('click', this.handleClick, true);

    // Track input/typing
    document.addEventListener('input', this.handleInput, true);
    document.addEventListener('change', this.handleChange, true);

    // Track focus/blur
    document.addEventListener('focusin', this.handleFocus, true);
    document.addEventListener('focusout', this.handleBlur, true);

    // Track form submissions
    document.addEventListener('submit', this.handleSubmit, true);

    // Track scroll
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // Track copy/paste
    document.addEventListener('copy', this.handleCopy, true);
    document.addEventListener('paste', this.handlePaste, true);

    // Track errors
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

    // Track visibility (tab switch)
    document.addEventListener('visibilitychange', this.handleVisibility);

    // Track resize
    window.addEventListener('resize', this.handleResize);

    // Flush on unload
    window.addEventListener('beforeunload', this.handleBeforeUnload);

    // Periodic flush every 5 seconds
    this.flushTimer = setInterval(() => this.flush(), 5000);

    // Record the initial page view
    this.push({
      eventType: 'navigate',
      eventCategory: 'navigation',
      page: window.location.pathname,
      referrer: document.referrer || undefined,
      metadata: {
        hash: window.location.hash,
        search: window.location.search,
        title: document.title,
      },
    });

    console.debug('[ActivityTracker] Initialized — tracking all user interactions');
  }

  /** Stop tracking */
  destroy() {
    if (!this.initialized) return;
    this.flush();

    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('input', this.handleInput, true);
    document.removeEventListener('change', this.handleChange, true);
    document.removeEventListener('focusin', this.handleFocus, true);
    document.removeEventListener('focusout', this.handleBlur, true);
    document.removeEventListener('submit', this.handleSubmit, true);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('copy', this.handleCopy, true);
    document.removeEventListener('paste', this.handlePaste, true);
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    if (this.flushTimer) clearInterval(this.flushTimer);
    this.initialized = false;
  }

  // ─── Event Handlers ───────────────────────────────────────────────────

  private handleClick = (e: MouseEvent) => {
    const el = e.target as Element;
    if (!el || !el.tagName) return;

    const tag = el.tagName.toLowerCase();
    // Skip tracking clicks on the document body itself
    if (tag === 'html' || tag === 'body') return;

    this.push({
      eventType: 'click',
      eventCategory: 'ui_interaction',
      target: getElementSelector(el),
      targetText: getElementText(el),
      component: getClosestComponent(el),
      section: getClosestSection(el),
      metadata: {
        tag,
        href: el.getAttribute('href') || undefined,
        type: el.getAttribute('type') || undefined,
        role: el.getAttribute('role') || undefined,
        disabled: el.hasAttribute('disabled'),
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
      },
    });
  };

  private handleInput = (e: Event) => {
    const el = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (!el || !el.tagName) return;

    const selector = getElementSelector(el);
    const isSensitive = isSensitiveField(el);

    // Debounce: accumulate character count, send after 1s of inactivity
    const count = (this.typingCounts.get(selector) || 0) + 1;
    this.typingCounts.set(selector, count);

    // Clear existing timeout
    const existing = this.typingTimeouts.get(selector);
    if (existing) clearTimeout(existing);

    this.typingTimeouts.set(selector, setTimeout(() => {
      this.push({
        eventType: 'type',
        eventCategory: 'form',
        target: selector,
        targetText: el.getAttribute('placeholder') || el.getAttribute('name') || undefined,
        value: isSensitive ? '[MASKED]' : el.value?.slice(0, 200),
        component: getClosestComponent(el),
        section: getClosestSection(el),
        metadata: {
          fieldType: el.getAttribute('type') || el.tagName.toLowerCase(),
          fieldName: el.getAttribute('name') || el.id || undefined,
          charCount: count,
          valueLength: el.value?.length || 0,
          isSensitive,
        },
      });
      this.typingCounts.delete(selector);
      this.typingTimeouts.delete(selector);
    }, 1000));
  };

  private handleChange = (e: Event) => {
    const el = e.target as HTMLSelectElement | HTMLInputElement;
    if (!el || !el.tagName) return;

    const tag = el.tagName.toLowerCase();
    if (tag !== 'select' && el.getAttribute('type') !== 'checkbox' && el.getAttribute('type') !== 'radio') return;

    const isSensitive = isSensitiveField(el);

    this.push({
      eventType: 'change',
      eventCategory: 'form',
      target: getElementSelector(el),
      targetText: el.getAttribute('name') || el.getAttribute('placeholder') || undefined,
      value: isSensitive ? '[MASKED]' : (el as HTMLSelectElement).value?.slice(0, 200),
      component: getClosestComponent(el),
      section: getClosestSection(el),
      metadata: {
        fieldType: el.getAttribute('type') || tag,
        fieldName: el.getAttribute('name') || el.id || undefined,
        checked: el.getAttribute('type') === 'checkbox' ? (el as HTMLInputElement).checked : undefined,
      },
    });
  };

  private handleFocus = (e: FocusEvent) => {
    const el = e.target as Element;
    if (!el || !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;

    this.push({
      eventType: 'focus',
      eventCategory: 'form',
      target: getElementSelector(el),
      targetText: el.getAttribute('placeholder') || el.getAttribute('name') || undefined,
      component: getClosestComponent(el),
      section: getClosestSection(el),
      metadata: {
        fieldType: el.getAttribute('type') || el.tagName.toLowerCase(),
        fieldName: el.getAttribute('name') || el.id || undefined,
      },
    });
  };

  private handleBlur = (e: FocusEvent) => {
    const el = e.target as HTMLInputElement;
    if (!el || !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;

    this.push({
      eventType: 'blur',
      eventCategory: 'form',
      target: getElementSelector(el),
      targetText: el.getAttribute('placeholder') || el.getAttribute('name') || undefined,
      component: getClosestComponent(el),
      section: getClosestSection(el),
      metadata: {
        fieldType: el.getAttribute('type') || el.tagName.toLowerCase(),
        fieldName: el.getAttribute('name') || el.id || undefined,
        hasValue: !!el.value,
        valueLength: el.value?.length || 0,
      },
    });
  };

  private handleSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form || form.tagName !== 'FORM') return;

    const formData: Record<string, string> = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const name = input.getAttribute('name') || input.id || 'unnamed';
      const isSensitive = isSensitiveField(input);
      if (isSensitive) {
        formData[name] = '[MASKED]';
      } else {
        formData[name] = (input as HTMLInputElement).value ? 'filled' : 'empty';
      }
    });

    this.push({
      eventType: 'submit',
      eventCategory: 'form',
      target: getElementSelector(form),
      component: getClosestComponent(form),
      section: getClosestSection(form),
      metadata: {
        action: form.action || undefined,
        method: form.method || undefined,
        fieldCount: inputs.length,
        fields: formData,
      },
    });
  };

  private handleScroll = () => {
    // Debounce scroll tracking
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const depth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    if (depth > this.maxScrollDepth) {
      this.maxScrollDepth = depth;
    }

    this.scrollTimeout = setTimeout(() => {
      this.push({
        eventType: 'scroll',
        eventCategory: 'engagement',
        metadata: {
          scrollDepth: depth,
          maxScrollDepth: this.maxScrollDepth,
          scrollPosition: Math.round(scrollTop),
          pageHeight: Math.round(document.documentElement.scrollHeight),
        },
      });
    }, 500);
  };

  private handleCopy = (e: ClipboardEvent) => {
    const selection = window.getSelection()?.toString()?.slice(0, 100);
    this.push({
      eventType: 'copy',
      eventCategory: 'ui_interaction',
      value: selection || undefined,
      metadata: { selectionLength: selection?.length || 0 },
    });
  };

  private handlePaste = (e: ClipboardEvent) => {
    const el = e.target as Element;
    this.push({
      eventType: 'paste',
      eventCategory: 'form',
      target: el ? getElementSelector(el) : undefined,
      metadata: {
        fieldName: el?.getAttribute('name') || el?.id || undefined,
        isSensitive: el ? isSensitiveField(el) : false,
      },
    });
  };

  private handleError = (e: ErrorEvent) => {
    this.push({
      eventType: 'error',
      eventCategory: 'system',
      metadata: {
        message: e.message?.slice(0, 500),
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      },
    });
  };

  private handleUnhandledRejection = (e: PromiseRejectionEvent) => {
    this.push({
      eventType: 'error',
      eventCategory: 'system',
      metadata: {
        type: 'unhandled_rejection',
        reason: String(e.reason)?.slice(0, 500),
      },
    });
  };

  private handleVisibility = () => {
    const isVisible = document.visibilityState === 'visible';
    this.push({
      eventType: 'visibility',
      eventCategory: 'engagement',
      metadata: {
        visible: isVisible,
        hiddenDuration: isVisible ? Date.now() - this.pageEnterTime : undefined,
      },
    });

    if (!isVisible) {
      // User switched tabs — flush
      this.flush();
    }
  };

  private handleResize = () => {
    this.push({
      eventType: 'resize',
      eventCategory: 'system',
      metadata: {
        width: window.innerWidth,
        height: window.innerHeight,
        deviceType: getDeviceType(),
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      },
    });
  };

  private handleBeforeUnload = () => {
    // Record page exit with time spent
    const duration = Date.now() - this.pageEnterTime;
    this.push({
      eventType: 'page_exit',
      eventCategory: 'navigation',
      duration,
      metadata: {
        maxScrollDepth: this.maxScrollDepth,
        timeOnPage: duration,
      },
    });
    this.flush(true); // synchronous flush
  };

  // ─── Navigation Tracking (SPA) ────────────────────────────────────────

  private trackNavigation() {
    // Monkey-patch pushState and replaceState
    const originalPush = history.pushState.bind(history);
    const originalReplace = history.replaceState.bind(history);

    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      originalPush(...args);
      this.onRouteChange();
    };

    history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
      originalReplace(...args);
      this.onRouteChange();
    };

    window.addEventListener('popstate', () => this.onRouteChange());
  }

  private onRouteChange() {
    const newPage = window.location.pathname;
    if (newPage === this.lastPage) return;

    // Record time on previous page
    const duration = Date.now() - this.pageEnterTime;
    this.push({
      eventType: 'page_exit',
      eventCategory: 'navigation',
      page: this.lastPage,
      duration,
      metadata: {
        maxScrollDepth: this.maxScrollDepth,
        timeOnPage: duration,
      },
    });

    // Reset page tracking
    this.maxScrollDepth = 0;
    this.pageEnterTime = Date.now();
    this.lastPage = newPage;

    // Record new page view
    this.push({
      eventType: 'navigate',
      eventCategory: 'navigation',
      page: newPage,
      referrer: this.lastPage,
      metadata: {
        hash: window.location.hash,
        search: window.location.search,
        title: document.title,
      },
    });
  }

  // ─── Public API ────────────────────────────────────────────────────────

  /**
   * Track an API call (call this from the API service)
   */
  trackApiCall(endpoint: string, method: string, status: number, responseTimeMs: number, error?: string) {
    this.push({
      eventType: 'api_call',
      eventCategory: 'api_call',
      target: `${method} ${endpoint}`,
      metadata: {
        endpoint,
        method,
        status,
        responseTimeMs,
        error: error?.slice(0, 500),
        success: status >= 200 && status < 400,
      },
    });
  }

  /**
   * Track a custom business event (e.g., "booking_started", "rating_submitted")
   */
  trackEvent(eventType: string, data?: Record<string, unknown>) {
    this.push({
      eventType,
      eventCategory: 'engagement',
      metadata: data,
    });
  }

  // ─── Internal ─────────────────────────────────────────────────────────

  private push(event: Partial<TrackedEvent>) {
    const utm = getUTMParams();
    this.buffer.push({
      eventType: event.eventType || 'unknown',
      eventCategory: event.eventCategory || 'ui_interaction',
      target: event.target,
      targetText: event.targetText,
      value: event.value,
      page: event.page || window.location.pathname,
      component: event.component,
      section: event.section,
      metadata: event.metadata,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      userAgent: navigator.userAgent,
      referrer: event.referrer,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      timestamp: new Date().toISOString(),
      duration: event.duration,
      sessionId: this.sessionId,
    });

    // Auto-flush if buffer gets large
    if (this.buffer.length >= 50) {
      this.flush();
    }
  }

  private flush(sync = false) {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    const url = `${API_CONSTANTS.BASE_URL}/activity/track`;
    const body = JSON.stringify({ events });

    // Get auth token if available
    const token = localStorage.getItem('sy_access_token') || localStorage.getItem('accessToken');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    if (sync && navigator.sendBeacon) {
      // Use sendBeacon for synchronous flush (page unload)
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      // Async fetch — fire and forget
      fetch(url, {
        method: 'POST',
        headers,
        body,
        keepalive: true, // survive page navigation
      }).catch(() => {
        // Silently fail — never break the app
      });
    }
  }
}

// ─── Singleton ──────────────────────────────────────────────────────────────

export const activityTracker = new ActivityTracker();

// Auto-initialize when this module is imported
activityTracker.init();

export default activityTracker;

/**
 * Analytics Setup
 * Configure tracking for user behavior and events
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

  /**
   * Track event
   */
  trackEvent(name: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date(),
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  /**
   * Track page view
   */
  trackPageView(page: string, properties?: Record<string, unknown>): void {
    this.trackEvent('page_view', { page, ...properties });
  }

  /**
   * Track user action
   */
  trackUserAction(action: string, properties?: Record<string, unknown>): void {
    this.trackEvent('user_action', { action, ...properties });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, unknown>): void {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Send event to backend
   */
  private sendEvent(event: AnalyticsEvent): void {
    // TODO: Send to analytics backend
     
    if (import.meta.env.MODE === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * Clear events
   */
  clearEvents(): void {
    this.events = [];
  }
}

export const analyticsService = new AnalyticsService();

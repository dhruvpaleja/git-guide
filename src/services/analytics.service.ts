/**
 * Analytics Tracking Service
 * 
 * Tracks user behavior for product analytics, conversion funnels, and feature effectiveness.
 * 
 * Events tracked:
 * - booking_conversion: When a user completes a booking
 * - nudge_effectiveness: When a user acts on or dismisses a nudge
 * - therapist_match_acceptance: When a user clicks "Connect" on a recommended therapist
 * - session_completed: When a session is marked complete
 * - session_rated: When a user rates a session
 * - talk_now_clicked: When a user clicks "Talk Now" button
 * 
 * Usage:
 * ```typescript
 * import { analytics } from '@/services/analytics.service';
 * 
 * // Track a booking conversion
 * analytics.trackBookingConversion({
 *   therapistId: 'uuid',
 *   sessionType: 'discovery',
 *   matchScore: 94,
 * });
 * 
 * // Track nudge interaction
 * analytics.trackNudgeInteraction({
 *   nudgeId: 'uuid',
 *   nudgeType: 'first_session_free',
 *   action: 'clicked' | 'dismissed' | 'ignored',
 * });
 * ```
 */

interface BookingConversionEvent {
  therapistId: string;
  sessionType: 'discovery' | 'pay_as_you_like' | 'standard';
  matchScore: number;
  bookingSource: 'search' | 'recommended' | 'available_now' | 'talk_now';
  priceAtBooking: number;
}

interface NudgeInteractionEvent {
  nudgeId: string;
  nudgeType: string;
  action: 'clicked' | 'dismissed' | 'ignored';
  timeToAction?: number; // seconds since nudge was shown
}

interface TherapistMatchEvent {
  therapistId: string;
  matchScore: number;
  position: number; // position in search results
  action: 'viewed' | 'clicked' | 'booked';
}

interface SessionEvent {
  sessionId: string;
  therapistId: string;
  sessionType: string;
  duration: number;
}

class AnalyticsService {
  private enabled: boolean;
  private queue: Array<{ event: string; properties: Record<string, unknown>; timestamp: number }> = [];
  private _eventCount: number = 0;

  constructor() {
    this.enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    
    // Flush queue every 30 seconds
    setInterval(() => this.flush(), 30000);
    
    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  /**
   * Track any custom event
   */
  track(event: string, properties: Record<string, unknown> = {}) {
    if (!this.enabled) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.pathname,
        userAgent: navigator.userAgent,
      },
    };

    console.warn('[Analytics]', event, eventData.properties);
    
    // In production, send to analytics backend
    // this.sendToBackend(eventData);
  }

  /**
   * Track booking conversion
   */
  trackBookingConversion(data: BookingConversionEvent) {
    this.track('booking_conversion', {
      therapist_id: data.therapistId,
      session_type: data.sessionType,
      match_score: data.matchScore,
      booking_source: data.bookingSource,
      price_at_booking: data.priceAtBooking,
      conversion_value: data.sessionType === 'discovery' ? 0 : data.priceAtBooking,
    });
  }

  /**
   * Track nudge interaction
   */
  trackNudgeInteraction(data: NudgeInteractionEvent) {
    this.track('nudge_interaction', {
      nudge_id: data.nudgeId,
      nudge_type: data.nudgeType,
      action: data.action,
      time_to_action: data.timeToAction,
      effectiveness_score: data.action === 'clicked' ? 1 : data.action === 'dismissed' ? 0 : -1,
    });
  }

  /**
   * Track therapist match acceptance
   */
  trackTherapistMatch(data: TherapistMatchEvent) {
    this.track('therapist_match_interaction', {
      therapist_id: data.therapistId,
      match_score: data.matchScore,
      position: data.position,
      action: data.action,
      acceptance_rate: data.action === 'clicked' || data.action === 'booked' ? 1 : 0,
    });
  }

  /**
   * Track session completion
   */
  trackSessionCompleted(data: SessionEvent) {
    this.track('session_completed', {
      session_id: data.sessionId,
      therapist_id: data.therapistId,
      session_type: data.sessionType,
      duration: data.duration,
    });
  }

  /**
   * Track session rating
   */
  trackSessionRating(sessionId: string, rating: number, feedbackLength: number) {
    this.track('session_rated', {
      session_id: sessionId,
      rating,
      feedback_length: feedbackLength,
      sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative',
    });
  }

  /**
   * Track Talk Now click
   */
  trackTalkNowClicked() {
    this.track('talk_now_clicked', {
      timestamp: Date.now(),
      intent: 'instant_session',
    });
  }

  /**
   * Track search/filter usage
   */
  trackSearch(filters: Record<string, string | number>) {
    this.track('therapist_search', {
      filters,
      results_count: 0, // Will be updated by caller
    });
  }

  /**
   * Flush queued events to backend
   */
  private flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    // Send to analytics backend
    events.forEach(event => this.sendToBackend(event));

    console.warn('[Analytics] Flushed', events.length, 'events');
  }

  /**
   * Send event to analytics backend
   */
  private sendToBackend(_eventData: { event: string; properties: Record<string, unknown> }) {
    // In production, this would send to analytics backend
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ events: [_eventData] }),
    // }).catch(console.error);
    
    // For now, just track in memory
    this._eventCount++;
  }

  /**
   * Identify user (call after login)
   */
  identify(userId: string, properties?: Record<string, string>) {
    if (!this.enabled) return;

    console.warn('[Analytics] User identified:', userId, properties);
    // this.sendToBackend({
    //   event: '$identify',
    //   properties: {
    //     $user_id: userId,
    //     ...properties,
    //   },
    // });
  }

  /**
   * Reset analytics state (call after logout)
   */
  reset() {
    this.queue = [];
    console.warn('[Analytics] Reset');
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

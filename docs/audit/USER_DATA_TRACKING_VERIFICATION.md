# User Data Tracking Verification

**Generated:** March 6, 2026  
**Question:** "Harr user data track ho raha hai?" (Is every user data being tracked?)

---

## ✅ WHAT'S ALREADY TRACKED

### 1. Authentication & Security Events
**Status:** ✅ IMPLEMENTED

| Event | Tracked By | Storage | Purpose |
|-------|------------|---------|---------|
| Login Success | `AIEventLogger` | `AuditLog` table | Security monitoring |
| Login Failure | `AIEventLogger` | `AuditLog` table | Brute force detection |
| Password Change | `AIEventLogger` | `AuditLog` table | Account changes |
| Token Refresh | `auth.controller.ts` | `RefreshToken` table | Session management |
| Account Lockout | `auth.controller.ts` | `User` table (failedAttempts) | Security |

**Evidence:**
- `server/src/controllers/auth.controller.ts` - Lines 80-150
- `server/src/services/ai-event-logger.service.ts` - Full implementation
- `server/prisma/schema.prisma` - `AuditLog` model (lines 290-310)

---

### 2. Health & Wellness Data
**Status:** ✅ IMPLEMENTED

| Data Type | Model | Frontend | Backend API | Purpose |
|-----------|-------|----------|-------------|---------|
| Mood Entries | `MoodEntry` | ✅ MoodPage | ✅ GET/POST /health-tools/mood | Track daily mood (1-10) |
| Journal Entries | `JournalEntry` | ✅ JournalPage | ✅ GET/POST/PATCH /health-tools/journal | Personal journal with tags |
| Meditation Sessions | `MeditationLog` | ✅ MeditationPage | ✅ GET/POST /health-tools/meditation | Track meditation duration/type |

**Evidence:**
- `server/src/controllers/health-tools.controller.ts` - Full CRUD
- `src/pages/dashboard/MoodPage.tsx`, `JournalPage.tsx`, `MeditationPage.tsx`
- `server/prisma/schema.prisma` - Models (lines 330-400)

---

### 3. User Profile & Onboarding
**Status:** ✅ IMPLEMENTED

| Data Type | Model | Frontend | Backend API | Purpose |
|-----------|-------|----------|-------------|---------|
| Basic Profile | `UserProfile` | ✅ Onboarding flow | ✅ GET/PUT /users/profile | Name, bio, avatar, timezone |
| Astrology Data | `UserProfile` | ✅ Astrology step | ✅ POST /users/astrology-profile | Birth time, place, sign |
| Therapy Preferences | `UserProfile` | ✅ Onboarding | ✅ API | Gender pref, language, approach |
| Goals & Struggles | `UserProfile` | ✅ Onboarding | ✅ API | Arrays of goals/struggles |
| Emergency Contact | `UserProfile` | ✅ Onboarding | ✅ API | Name, phone, relation |

**Evidence:**
- `server/src/controllers/users.controller.ts`
- `src/features/onboarding/screens/`
- `server/prisma/schema.prisma` - UserProfile model (lines 150-180)

---

### 4. Session & Booking Data
**Status:** ⚠️ SCHEMA EXISTS, API STUBBED

| Data Type | Model | Frontend | Backend API | Status |
|-----------|-------|----------|-------------|--------|
| Therapy Sessions | `Session` | ⚠️ SessionsPage (mock) | ❌ Returns 501 | Schema ready, API not implemented |
| Session Status | `Session` | ⚠️ Hardcoded | ❌ N/A | Status enum exists |
| Video Room Info | `Session` | ❌ Not implemented | ❌ N/A | Fields exist (videoRoomUrl, videoProvider) |
| Cancellations | `Session` | ❌ Not implemented | ❌ N/A | Fields exist (cancelledBy, cancelReason) |

**Evidence:**
- `server/prisma/schema.prisma` - Session model (lines 240-270)
- `server/src/controllers/therapy.controller.ts` - All methods throw `notImplemented`
- `src/pages/dashboard/SessionsPage.tsx` - Uses mock data

---

### 5. Payment Data
**Status:** ⚠️ SCHEMA EXISTS, NO INTEGRATION

| Data Type | Model | Frontend | Backend API | Status |
|-----------|-------|----------|-------------|--------|
| Payment Records | `Payment` | ❌ Not implemented | ❌ Returns 501 | Razorpay fields ready |
| Order IDs | `Payment` | ❌ N/A | ❌ N/A | razorpayOrderId field exists |
| Payment Status | `Payment` | ❌ N/A | ❌ N/A | Status enum (PENDING/COMPLETED/FAILED) |
| Refunds | `Payment` | ❌ N/A | ❌ N/A | refundAmount, refundReason fields exist |

**Evidence:**
- `server/prisma/schema.prisma` - Payment model (lines 280-310)
- `server/src/controllers/payments.controller.ts` - All methods throw `notImplemented`

---

### 6. Notifications
**Status:** ⚠️ PARTIALLY IMPLEMENTED

| Data Type | Model | Frontend | Backend API | Status |
|-----------|-------|----------|-------------|--------|
| In-App Notifications | `Notification` | ✅ NotificationsPage | ⚠️ WebSocket works, API stubbed | Can receive via WS, but API routes return 501 |
| Notification Types | `Notification` | ✅ Shows types | ✅ Enum exists | SYSTEM, WELLNESS, MATCH, INSIGHT, ALERT |
| Read Status | `Notification` | ✅ Mark as read | ⚠️ Partial | isRead, readAt fields exist |
| Delivery Channel | `Notification` | ❌ Not shown | ✅ Enum exists | IN_APP, EMAIL, PUSH, SMS |

**Evidence:**
- `server/prisma/schema.prisma` - Notification model (lines 320-340)
- `src/pages/dashboard/NotificationsPage.tsx` - Reads from API+WebSocket
- `server/src/controllers/notifications.controller.ts` - Partially stubbed

---

### 7. General Analytics (Frontend)
**Status:** ❌ STUBBED

| Event Type | Service | Implementation | Status |
|------------|---------|----------------|--------|
| Page Views | `analytics.service.ts` | ❌ TODO comment | Not implemented |
| User Actions | `analytics.service.ts` | ❌ TODO comment | Not implemented |
| Errors | `analytics.service.ts` | ❌ TODO comment | Not implemented |
| Event Storage | `analytics.service.ts` | ⚠️ In-memory array only | Lost on refresh |

**Evidence:**
- `src/services/analytics.service.ts` - All methods have `// TODO: Send to analytics backend`
- No backend analytics endpoint exists
- No database model for analytics events

---

### 8. Admin Analytics
**Status:** ❌ FAKE DATA ONLY

| Metric | Frontend | Backend | Status |
|--------|----------|---------|--------|
| User Count | ❌ Hardcoded (1,284) | ❌ No endpoint | Fake |
| Session Count | ❌ Hardcoded (156) | ❌ No endpoint | Fake |
| Revenue | ❌ Hardcoded (₹4.2L) | ❌ No endpoint | Fake |
| Active Users | ❌ Not tracked | ❌ No endpoint | No data |

**Evidence:**
- `src/pages/dashboard/AdminDashboard.tsx` - All metrics hardcoded
- No admin analytics endpoints in backend

---

## ❌ WHAT'S NOT TRACKED (GAPS)

### Critical Missing Tracking

| What Should Be Tracked | Current Status | Priority | Gap |
|------------------------|----------------|----------|-----|
| **Every button click** | ❌ Not tracked | HIGH | No click analytics |
| **Time spent on pages** | ❌ Not tracked | MEDIUM | No session duration tracking |
| **Scroll depth** | ❌ Not tracked | LOW | No engagement metrics |
| **Feature adoption** | ❌ Not tracked | HIGH | Don't know which features users use |
| **User journey flow** | ❌ Not tracked | HIGH | No funnel analysis |
| **Drop-off points** | ❌ Not tracked | HIGH | Don't know where users quit |
| **Search queries** | ❌ Not tracked | MEDIUM | No search analytics |
| **Video call quality** | ❌ Not tracked | MEDIUM | No video metrics (when implemented) |
| **Therapist performance** | ❌ Not tracked | MEDIUM | No session ratings aggregation |
| **Crisis interventions** | ❌ Not tracked | CRITICAL | No crisis event tracking |

---

### Missing Database Models

| Model Needed | Purpose | Priority |
|--------------|---------|----------|
| `UserActivity` | Track every user action with timestamp | HIGH |
| `FeatureUsage` | Track which features are used how often | MEDIUM |
| `SessionAnalytics` | Track session duration, bounce rate | MEDIUM |
| `SearchQuery` | Track what users search for | LOW |
| `ErrorLog` | Centralized error tracking | HIGH |
| `PerformanceMetric` | Track page load times, API latency | MEDIUM |

---

## 🔧 RECOMMENDATIONS FOR COMPLETE TRACKING

### Phase 1: Critical (Week 1-2)

1. **Implement Event Store**
   ```prisma
   model UserActivity {
     id        String   @id @default(uuid())
     userId    String
     action    String   // "button_click", "page_view", "feature_use"
     page      String?
     element   String?  // CSS selector or component name
     metadata  Json?
     timestamp DateTime @default(now())
     
     user User @relation(fields: [userId], references: [id])
     @@index([userId, timestamp])
   }
   ```

2. **Add Click Tracking to Frontend**
   ```typescript
   // src/lib/track.ts
   export function trackClick(element: string, page: string) {
     analyticsService.trackEvent('click', {
       element,
       page,
       timestamp: new Date(),
     });
   }
   ```

3. **Create Analytics Dashboard**
   - Daily active users
   - Feature adoption rates
   - User retention curves
   - Drop-off funnels

### Phase 2: Enhanced (Week 3-4)

1. **Session Recording** (PostHog or LogRocket)
2. **Heatmaps** (Hotjar or Microsoft Clarity)
3. **Funnel Analysis** (PostHog funnels)
4. **Cohort Analysis** (Retention by signup week)

### Phase 3: Advanced (Month 2)

1. **ML-Powered Insights**
   - Churn prediction
   - Feature recommendation
   - Optimal notification timing
2. **A/B Testing Infrastructure**
   - Feature flags
   - Experiment tracking
   - Statistical significance calculator

---

## 📊 CURRENT TRACKING COVERAGE

| Category | Coverage | Score |
|----------|----------|-------|
| Authentication Events | ✅ 100% | 10/10 |
| Health Data (Mood/Journal/Meditation) | ✅ 100% | 10/10 |
| User Profile Data | ✅ 100% | 10/10 |
| Session/Booking Data | ⚠️ Schema only | 3/10 |
| Payment Data | ⚠️ Schema only | 2/10 |
| Notifications | ⚠️ Partial | 5/10 |
| Frontend Analytics | ❌ Stubbed | 1/10 |
| Admin Analytics | ❌ Fake data | 0/10 |
| Click/Behavior Tracking | ❌ None | 0/10 |
| Error Tracking | ⚠️ Sentry configured but empty DSN | 2/10 |

**Overall Tracking Score: 43/100**

---

## ✅ VERIFICATION CHECKLIST

### What IS Being Tracked:
- [x] Login/logout events
- [x] Failed login attempts
- [x] Password changes
- [x] Mood entries (score, note, tags)
- [x] Journal entries (content, mood, tags)
- [x] Meditation sessions (duration, type)
- [x] User profile updates
- [x] Astrology data (birth time, place)
- [x] Therapy preferences
- [x] Emergency contacts
- [x] Refresh token rotation
- [x] Account lockouts

### What IS NOT Being Tracked:
- [ ] Button clicks
- [ ] Page view duration
- [ ] Scroll depth
- [ ] Feature usage frequency
- [ ] User journey paths
- [ ] Drop-off points in flows
- [ ] Search queries
- [ ] Video call metrics
- [ ] Therapist session ratings aggregation
- [ ] Crisis interventions
- [ ] Error events (frontend)
- [ ] Performance metrics (page load, API latency)
- [ ] A/B test assignments
- [ ] Notification engagement (open rates, click rates)

---

## 🎯 NEXT STEPS FOR COMPLETE TRACKING

### Immediate (This Week):
1. **Add PostHog** - 1 line of code, tracks everything automatically
   ```bash
   npm install posthog-js
   ```
   ```typescript
   // src/main.tsx
   import posthog from 'posthog-js';
   posthog.init('YOUR_KEY', { api_host: 'https://app.posthog.com' });
   ```

2. **Enable Sentry** - Set `VITE_SENTRY_DSN` in `.env.production`

3. **Create `UserActivity` model** - Track every action

### Short-term (This Month):
1. **Implement click tracking** on all CTAs
2. **Add funnel tracking** for key flows (signup, booking)
3. **Create admin analytics dashboard** with real data

### Long-term (Next Quarter):
1. **ML-powered insights** (churn prediction, recommendations)
2. **Session recording** for UX research
3. **Automated alerts** for anomalies

---

**Document Created:** March 6, 2026  
**Tracking Score:** 43/100  
**Priority:** Add PostHog TODAY for immediate 80/100 coverage

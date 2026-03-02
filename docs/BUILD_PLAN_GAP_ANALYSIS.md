# Soul Yatri BUILD_PLAN.md - Comprehensive Gap Analysis

> **Generated on**: 2026-02-18
> **Document analyzed**: docs/BUILD_PLAN.md (9,226 lines)
> **Purpose**: Identify all missing, incomplete, or inconsistent specifications in the build plan
> **Estimated completeness**: 65% - Many phases lack critical implementation details

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Gaps (High Priority)](#critical-gaps-high-priority)
3. [Missing or Incomplete Phase Definitions](#missing-or-incomplete-phase-definitions)
4. [Inconsistencies Between Sections](#inconsistencies-between-sections)
5. [Missing Cross-References](#missing-cross-references)
6. [Incomplete Sections](#incomplete-sections)
7. [Missing Technical Details](#missing-technical-details)
8. [Missing Documentation](#missing-documentation)
9. [Missing Database/Schema Details](#missing-databaseschema-details)
10. [Missing Integration Details](#missing-integration-details)
11. [Missing Performance/Monitoring](#missing-performancemonitoring)
12. [Missing Security Details](#missing-security-details)
13. [Missing Deployment/DevOps](#missing-deploymentdevops)
14. [Missing Compliance/Legal](#missing-compliancelegal)
15. [Missing Testing Specifications](#missing-testing-specifications)
16. [Pagination & Search Inconsistencies](#pagination--search-inconsistencies)
17. [Missing Feature Specifications](#missing-feature-specifications)
18. [Recommendations](#recommendations)

---

## Executive Summary

The BUILD_PLAN.md file contains 9,226 lines covering 31 phases of development. While the document is well-structured and comprehensive in its scope, approximately **35% of critical implementation details are missing or incomplete**.

### Top 10 Most Critical Missing Specifications

1. **Phase 7 (Astrologer System)**: ~90% incomplete - missing Prisma models, APIs, and workflow
2. **Phase 10 (Soul Circle Community)**: ~85% incomplete - missing models, APIs, and algorithm
3. **Phase 22 (Events System)**: ~80% incomplete - minimal specification
4. **Payment Prisma Models**: Completely missing despite being core to Phase 13
5. **NGO Magic Link Flow**: Incomplete workflow specification
6. **Email Templates**: No HTML templates provided
7. **Search/Filtering Algorithms**: Missing across multiple phases
8. **API Field Mapping for Integrations**: Missing for Phase 15
9. **Community Feed Algorithm**: Missing specification
10. **Fraud Detection Confidence Scoring**: Missing implementation details

### Impact Assessment

- **MVP Launch Risk**: HIGH - Phase 7 (Astrologer) is in MVP scope but severely incomplete
- **Development Velocity**: Will slow down significantly when teams reach incomplete phases
- **Quality Risk**: Missing error codes and validation schemas may lead to poor error handling
- **Security Risk**: Missing encryption details and session management specs

---

## Critical Gaps (High Priority)

These gaps MUST be addressed before development begins on their respective phases, especially for MVP phases:

### 1. Phase 7 (Astrologer System) - CRITICAL - MVP BLOCKER

**Status**: Only ~60 lines of description for an extremely complex system

**Missing Components**:

#### Prisma Models (Completely Missing)
```typescript
// MISSING: All of these models need to be defined

model AstrologerProfile {
  // Fields needed:
  // - id, userId, bio, qualifications
  // - expertise areas, languages
  // - experience years, certificates
  // - availability schedule
  // - browniePoints, tier (bronze/silver/gold/platinum/diamond)
  // - predictionAccuracyRate, totalPredictions
  // - isActive, isVerified
  // - createdAt, updatedAt
}

model KundaliChart {
  // Fields needed:
  // - id, userId, birthDate, birthTime, birthPlace
  // - latitude, longitude, timezone
  // - chartData (JSON), planets, houses, aspects
  // - rashiChart, navamsaChart, dashaSystem
  // - createdAt, updatedAt
}

model AstrologyReport {
  // Fields needed:
  // - id, sessionId, astrologerId
  // - kundaliChartId, predictions[]
  // - overallAssessment, confidence
  // - submittedAt, therapistViewedAt
}

model AstrologyPrediction {
  // Fields needed:
  // - id, reportId, area (career/relationships/health/mental/spiritual)
  // - predictionText, severity (low/medium/high)
  // - estimatedDuration, confidence
  // - accuracyRating (null | accurate | partial | inaccurate)
  // - therapistFeedback, accuracyMarkedAt
}

model PredictionVote {
  // Fields needed (for multi-astrologer voting system):
  // - id, sessionId, astrologerId, prediction
  // - confidence, submittedAt
  // - finalConsensus (boolean)
}
```

#### API Endpoints (Completely Missing)
```
ASTROLOGER ENDPOINTS:
GET    /api/v1/astrology/dashboard                 → Get assigned sessions
GET    /api/v1/astrology/sessions                  → List all astrologer's sessions
GET    /api/v1/astrology/sessions/:id              → Get session detail
GET    /api/v1/astrology/sessions/:id/kundali      → Get client's kundali chart
POST   /api/v1/astrology/sessions/:id/predictions  → Submit predictions
PATCH  /api/v1/astrology/predictions/:id           → Update prediction
GET    /api/v1/astrology/accuracy-stats            → Get accuracy statistics
GET    /api/v1/astrology/brownie-points/history    → Get brownie points history

THERAPIST ENDPOINTS (to view predictions):
GET    /api/v1/therapy/sessions/:id/astro-report   → Get pre-session astrology report

ADMIN ENDPOINTS:
GET    /api/v1/admin/astrologers                   → List all astrologers
GET    /api/v1/admin/astrologers/:id               → Get astrologer detail
PATCH  /api/v1/admin/astrologers/:id/approve       → Approve astrologer
PATCH  /api/v1/admin/astrologers/:id/suspend       → Suspend astrologer
POST   /api/v1/admin/astrologers/:id/brownie-points → Manual brownie point adjustment
GET    /api/v1/admin/astrologers/:id/audit-log     → View accuracy history
```

#### Zod Schemas (Missing)
- AstrologyPredictionSchema
- KundaliChartSchema
- AstrologerProfileSchema
- PredictionVoteSchema

#### Error Codes (Missing)
```
ASTRO_001: Kundali chart generation failed
ASTRO_002: Invalid birth details provided
ASTRO_003: Astrologer not assigned to this session
ASTRO_004: Prediction already submitted
ASTRO_005: Cannot update prediction after therapist viewed
ASTRO_006: Astrologer account not verified
ASTRO_007: Insufficient brownie points for tier
ASTRO_008: Prediction voting period expired
ASTRO_009: Invalid prediction area
ASTRO_010: Chart calculation service unavailable
```

#### Missing Workflows
1. **Astrologer Assignment Workflow**
   - When: 3 hours before therapy session
   - How: Round-robin? Skill-based? Load-based?
   - What if no astrologer available?
   - Can astrologer decline assignment?

2. **Prediction Submission Workflow**
   - Can astrologer submit partial predictions?
   - What's the deadline (before session start)?
   - Can astrologer edit after submission?
   - What if astrologer doesn't submit by deadline?

3. **Accuracy Marking Workflow**
   - When does therapist mark accuracy?
   - Is it mandatory or optional?
   - What if therapist never marks accuracy?
   - Can astrologer appeal accuracy rating?

4. **Brownie Points System**
   - Accurate prediction: +3 points (specified)
   - Partially accurate: +1 point (specified)
   - Inaccurate: How many points deducted?
   - Missed deadline: Penalty?
   - Tier thresholds are defined, but what happens at tier transition?

5. **Voting System (Multi-Astrologer)**
   - How many astrologers vote per session?
   - How to calculate consensus?
   - What if votes conflict significantly?
   - Does AI prediction count as a vote?

#### Missing UI Components
- Kundali chart visualization component
- Prediction form component (with area selector, confidence slider)
- Accuracy feedback component (for therapist)
- Brownie points dashboard
- Tier badge display
- Prediction history timeline

#### Missing Test Scenarios
- Kundali calculation accuracy tests
- Prediction submission deadline enforcement
- Brownie point calculation tests
- Tier upgrade/downgrade tests
- Multi-astrologer voting consensus tests

---

### 2. Phase 10 (Soul Circle Community) - CRITICAL - POST-MVP

**Status**: Only ~45 lines of description

**Missing Components**:

#### Prisma Models (Completely Missing)
```typescript
model CommunityPost {
  // Fields needed:
  // - id, authorId, content, isAnonymous
  // - postType (text | image | poll | question)
  // - categoryId, tags[]
  // - likesCount, commentsCount, sharesCount
  // - isPinned, isFeatured
  // - moderationStatus (pending | approved | flagged | removed)
  // - removedReason, moderatedBy
  // - createdAt, updatedAt, deletedAt (soft delete)
}

model CommunityComment {
  // Fields needed:
  // - id, postId, authorId, content
  // - isAnonymous, replyToCommentId (nested comments)
  // - likesCount
  // - moderationStatus, removedReason
  // - createdAt, updatedAt, deletedAt
}

model CommunityLike {
  // Fields needed:
  // - id, userId, postId?, commentId?
  // - createdAt
}

model CommunityFollow {
  // Fields needed:
  // - id, followerId, followingId
  // - createdAt
}

model CommunityReport {
  // Fields needed:
  // - id, reporterId, postId?, commentId?
  // - reason (spam | harassment | inappropriate | self_harm | misinformation)
  // - description, status (pending | reviewed | dismissed | action_taken)
  // - reviewedBy, reviewedAt, action
  // - createdAt
}

model CommunityBlock {
  // Fields needed:
  // - id, blockerId, blockedId
  // - reason, createdAt
}

model UserReputation {
  // Fields needed:
  // - id, userId, reputationScore
  // - postsCount, helpfulPostsCount
  // - violationsCount, warningsCount
  // - level (new | regular | trusted | leader)
  // - updatedAt
}
```

#### API Endpoints (Completely Missing)
```
COMMUNITY POST ENDPOINTS:
GET    /api/v1/community/feed                      → Get personalized feed
GET    /api/v1/community/posts/:id                 → Get single post
POST   /api/v1/community/posts                     → Create post
PATCH  /api/v1/community/posts/:id                 → Edit post
DELETE /api/v1/community/posts/:id                 → Delete post
POST   /api/v1/community/posts/:id/like            → Like post
DELETE /api/v1/community/posts/:id/like            → Unlike post
POST   /api/v1/community/posts/:id/share           → Share post
POST   /api/v1/community/posts/:id/report          → Report post

COMMENT ENDPOINTS:
GET    /api/v1/community/posts/:id/comments        → Get post comments
POST   /api/v1/community/posts/:id/comments        → Add comment
PATCH  /api/v1/community/comments/:id              → Edit comment
DELETE /api/v1/community/comments/:id              → Delete comment
POST   /api/v1/community/comments/:id/like         → Like comment

FOLLOW ENDPOINTS:
POST   /api/v1/community/users/:id/follow          → Follow user
DELETE /api/v1/community/users/:id/follow          → Unfollow user
GET    /api/v1/community/users/:id/followers       → Get followers
GET    /api/v1/community/users/:id/following       → Get following

MODERATION ENDPOINTS:
GET    /api/v1/community/reports                   → Get reported content
PATCH  /api/v1/community/reports/:id/review        → Review report
POST   /api/v1/community/users/:id/block           → Block user
DELETE /api/v1/community/users/:id/block           → Unblock user
GET    /api/v1/community/moderation/queue          → Get moderation queue
```

#### Missing Feed Algorithm
- How is the feed sorted? (chronological? engagement-based? ML-based?)
- How to handle follow graph updates in real-time?
- Anonymous post ranking (how to prioritize without user identity?)
- Content diversity (prevent echo chambers)
- Spam filtering logic
- Banned user content hiding

#### Missing Content Moderation Workflow
1. Auto-moderation triggers (toxicity score threshold?)
2. User report escalation (how many reports trigger review?)
3. Admin review process (approve/remove/warn user)
4. User appeal process (completely missing)
5. Community guidelines enforcement rules
6. Strike system (3 warnings = ban?)

#### Missing Error Codes
```
COMMUNITY_001: Post not found
COMMUNITY_002: Cannot edit post after 5 minutes
COMMUNITY_003: Cannot delete post with comments
COMMUNITY_004: User is blocked
COMMUNITY_005: User is banned from community
COMMUNITY_006: Anonymous posting not allowed in this category
COMMUNITY_007: Post flagged for moderation
COMMUNITY_008: Comment contains prohibited content
COMMUNITY_009: Spam detection limit exceeded
COMMUNITY_010: Insufficient reputation for this action
```

---

### 3. Phase 13 (Payment Gateway) - CRITICAL - MVP BLOCKER

**Missing Prisma Models**:

```typescript
model PaymentTransaction {
  // Currently mentioned in spec but NOT defined in schema!
  // Fields needed:
  // - id, userId, amount, currency
  // - razorpayOrderId, razorpayPaymentId, razorpaySignature
  // - stripePaymentIntentId, stripeChargeId
  // - status (pending | completed | failed | refunded)
  // - type (therapy_session | astrology | course | shop | membership)
  // - relatedId (sessionId, courseId, etc.)
  // - refundId, refundAmount, refundReason
  // - metadata (JSON)
  // - createdAt, updatedAt
}

model CurrencyConfig {
  // For multi-currency support
  // Fields needed:
  // - id, code (INR, USD, EUR, etc.)
  // - symbol, exchangeRateToINR
  // - isActive, lastUpdatedAt
}

model PaymentWebhookEvent {
  // For tracking webhook events
  // Fields needed:
  // - id, provider (razorpay | stripe)
  // - eventType, eventId, payload (JSON)
  // - processedAt, status (pending | processed | failed)
  // - errorMessage, retryCount
  // - createdAt
}
```

**Missing API Details**:
- No specification for payment retry mechanism after failure
- No mention of failed payment recovery email workflow
- No specification for refund status webhook handling
- Missing: How to handle partial refunds
- Missing: Payment reconciliation process (mentioned daily, but no API)
- Missing: Currency conversion rate caching strategy (storage location undefined)

**Missing Error Codes**:
```
PAYMENT_001: Invalid payment amount
PAYMENT_002: Currency not supported
PAYMENT_003: Payment gateway timeout
PAYMENT_004: Signature verification failed
PAYMENT_005: Duplicate transaction detected
PAYMENT_006: Insufficient wallet balance
PAYMENT_007: Refund already processed
PAYMENT_008: Refund period expired
PAYMENT_009: Payment gateway unavailable
PAYMENT_010: Invalid webhook signature
```

---

### 4. Phase 22 (Events System) - MEDIUM PRIORITY - POST-MVP

**Status**: Only ~80 lines of basic description

**Missing Components**:
- Refund policy for event cancellations
- Capacity management (waitlist, overbooking prevention)
- Event check-in system (QR codes? manual?)
- Virtual event platform integration (Zoom link generation?)
- Event reminders workflow (when to send?)
- Event feedback/rating collection
- Event recurring schedule support (weekly meditation every Monday?)
- Group discount codes for events

**Missing Prisma Fields**:
```typescript
model Event {
  // Missing fields:
  // - maxCapacity, currentAttendees
  // - waitlistEnabled, waitlistCount
  // - refundPolicy (full | partial | none)
  // - refundDeadline (days before event)
  // - checkInRequired, checkInCode
  // - zoomLink, zoomMeetingId
  // - remindersSent (24hr, 1hr boolean flags)
}
```

---

### 5. Phase 6 (AI Assistant) - MEDIUM PRIORITY - MVP BLOCKER

**Missing Implementation Details**:

**Voice Mode Gaps**:
- How does voice mode handle overlapping speech? (echo cancellation?)
- Audio codec/bitrate specification? (Opus? MP3? bitrate?)
- Voice input timeout: How long does "hold to talk" wait before timeout?
- Processing queue size for voice requests: What if user sends 5 requests in 1 second?
- Conversation state persistence: What if app restarts mid-conversation?

**Missing Prisma Fields**:
```typescript
model AIConversation {
  // Missing:
  // - lastAccessedAt (for activity tracking, cleanup)
  // - exportStatus (null | requested | processing | ready)
  // - exportUrl (signed URL if exported)
}
```

**Missing Error Codes**:
```
AI_006: Voice too faint to process
AI_007: Microphone permission denied
AI_008: Voice processing timeout
AI_009: Conversation export failed
AI_010: Rate limit exceeded (100/hour)
```

---

## Inconsistencies Between Sections

### 1. Authentication Method Conflict

**Inconsistency**: Cookie vs Header for Web App

- **Phase 1 (Auth)** says:
  > "Mobile: use Authorization header only"
  > "Web: also set httpOnly cookie as fallback"

- **Phase 5 (Video)** mentions:
  > "Pass token via Authorization header for Daily.co room access"

- **API-First Architecture section** says:
  > "Auth via Authorization: Bearer <token> header (not cookies for mobile)"

**Impact**: Confusion about whether web should use cookies or headers
**Recommendation**: Clarify that web uses BOTH (cookie for browser, header for API calls)

---

### 2. Crisis Detection Model Selection Conflict

**Inconsistency**: Which AI model handles crisis detection?

- **Phase 6 (AI Assistant)** says:
  > "GPT-4o integration for responses"
  > "Crisis keyword detection: list of 50+ keywords/phrases"

- **Phase 30 (AI Fine-Tuning)** says:
  > "Fine-tune GPT-4o-mini for sentiment/crisis detection (fast inference)"

**Impact**: Unclear if crisis detection uses keyword list OR AI model OR both
**Recommendation**: Clarify that keyword detection is PRIMARY (instant), AI sentiment is SECONDARY

---

### 3. Therapist Matching Algorithm Conflict

**Inconsistency**: Basic vs Priority Matching

- **Phase 4 (Therapy Booking)** says:
  > "Basic matching algorithm: filter by specialization + availability + rating sort"

- **Phase 23 (Memberships)** says:
  > "Healer/Enlightened members get priority therapist matching"

**Impact**: Unclear if "priority matching" is a different algorithm or same algorithm with queue jumping
**Recommendation**: Define "priority" as preferential slot allocation, not different algorithm

---

### 4. Video Session Recording Control Conflict

**Inconsistency**: Who starts recording?

- **Phase 4 (Therapy Session)** says:
  > "Session recording (with consent popup at start)"

- **Phase 5 (Video Calling)** says:
  > "Recording consent popup at start"
  > "Therapist controls recording start"

**Impact**: Unclear if user consents OR therapist starts, or both
**Recommendation**: Clarify that consent popup shows for BOTH parties, then therapist manually starts recording

---

### 5. Membership Gating Inconsistency

**Inconsistency**: Which features are gated by membership?

- **Phase 23 (Memberships)** defines gating middleware but doesn't specify which endpoints use it
- **Phase 6 (AI Assistant)** doesn't mention if chat has message limits for Free tier
- **Phase 4 (Therapy Sessions)** doesn't specify if sessions are unlimited for all tiers

**Impact**: Developers won't know where to apply gating checks
**Recommendation**: Add explicit "Feature Gating Matrix" table in Phase 23

---

### 6. Notification Channel Assignment Inconsistency

**Inconsistency**: Which notifications use which channels?

- **Phase 17 (Notifications)** defines 33 notification types but doesn't specify channels (email/SMS/push) for each
- Some phases mention "email notification" without referencing Phase 17's type list

**Impact**: Missing channel mapping table
**Recommendation**: Add "Notification Channel Matrix" in Phase 17

---

## Missing Cross-References

### 1. Session → Astrology Integration

**Issue**: Phase 4 mentions astrology integration but doesn't link to Phase 7's workflow

**Missing Links**:
- Phase 4 should reference: "See Phase 7 for astrologer assignment workflow"
- API endpoint missing: `GET /api/v1/therapy/sessions/:id/astro-report` (to fetch report during session view)
- Database relation missing: `Session.astrologyReportId` field

**Recommendation**: Add explicit foreign key in Session model pointing to AstrologyReport

---

### 2. Health Tools → Dashboard Aggregation

**Issue**: Phase 16 (Health Tools) lacks cross-reference to Phase 3 (Dashboard)

**Missing Links**:
- How do health tool metrics appear on dashboard?
- Which dashboard widget shows mood trends?
- API endpoint needed: `GET /api/v1/dashboard/health-summary`

**Recommendation**: Add "Dashboard Integration" section to Phase 16

---

### 3. Health Tools → Therapist Dashboard

**Issue**: How do therapists see client health tool usage?

**Missing Links**:
- Does Phase 8 (Therapist Dashboard) show client mood logs?
- Should therapist see client meditation frequency?
- API endpoint needed: `GET /api/v1/therapist/clients/:id/health-data`

**Recommendation**: Add health data viewer to therapist client detail page spec

---

### 4. Community → Admin Moderation

**Issue**: Phase 10 (Community) mentions moderation flags but Phase 14 (Admin) doesn't list moderation queue

**Missing Links**:
- Admin page missing: "Community Moderation Queue"
- API endpoint missing: `GET /api/v1/admin/community/flagged-posts`
- Workflow missing: How do moderators review and action flagged content?

**Recommendation**: Add CommunityModerationPage to Phase 14 admin screen list

---

### 5. Events → Notifications

**Issue**: Phase 22 (Events) mentions notifications but Phase 17 doesn't list event-specific types

**Missing Notification Types**:
- `event_ticket_confirmed`
- `event_reminder_24hr`
- `event_reminder_1hr`
- `event_cancelled`
- `event_rescheduled`

**Recommendation**: Add event notification types to Phase 17 list

---

### 6. Corporate → Analytics

**Issue**: Phase 15 (Corporate) mentions anonymized reports but Phase 20 (Departments) doesn't mention corporate data

**Missing Links**:
- How does corporate admin access employee wellness data?
- Is corporate data isolated from main analytics?
- API endpoint missing: `GET /api/v1/corporate/:id/wellness-report`

**Recommendation**: Add corporate data isolation strategy and reporting APIs

---

## Incomplete Sections

### 1. AI Model Strategy - Missing Deployment Strategy

**Current State**: Explains model selection but not deployment

**Missing Details**:
- How to deploy fine-tuned models to production?
- Model versioning strategy (v1, v2, v3?)
- A/B testing framework for comparing model performance
- Rollback procedure if new model performs worse
- Model monitoring (track accuracy, cost per request)

**Recommendation**: Add "Model Deployment & Versioning" section to AI Model Strategy

---

### 2. Multi-Currency Strategy - Missing Tax & Rounding Rules

**Current State**: Explains currency routing but not edge cases

**Missing Details**:
- Rounding rules: Always round up? Round to nearest?
- Tax calculation per currency/country (GST for India, VAT for EU?)
- Handling zero-amount transactions (free tier, $0.00 charges)
- Currency symbol display (₹ vs INR, $ vs USD)
- Invoice currency: Show in user's currency or INR?

**Recommendation**: Add "Currency Handling Rules" section with rounding/tax table

---

### 3. Data Retention Policy - Missing GDPR Erasure Workflow

**Current State**: Says "users can request deletion" but no workflow specified

**Missing Details**:
- How does user request deletion? (API endpoint? support email?)
- Verification process (email confirmation? identity verification?)
- What data is exempt from deletion? (legal financial records?)
- How long until deletion completes? (30 days mentioned, but workflow?)
- How to handle "right to be forgotten" for anonymized data in analytics?

**Recommendation**: Add "User Data Deletion Workflow" with step-by-step process

---

### 4. Background Jobs - Missing Failure Handling

**Current State**: Lists jobs and schedules but not error handling

**Missing Details**:
- What happens if a job fails? (retry? alert?)
- Maximum retry count before giving up
- Partial job success handling (e.g., 80% of emails sent, 20% failed)
- Dead letter queue for failed jobs
- Job monitoring dashboard (success rate, execution time)

**Recommendation**: Add "Job Error Handling & Monitoring" section

---

### 5. Validation Schemas - Missing Zod Schema Definitions

**Current State**: Mentioned frequently but only Phase 1 has actual schemas

**Missing Schemas**:
- OnboardingStepSchema (Phase 2)
- TherapySessionSchema (Phase 4)
- VideoCallConfigSchema (Phase 5)
- AIChatMessageSchema (Phase 6)
- AstrologyPredictionSchema (Phase 7)
- TherapistNoteSchema (Phase 8)
- BlogPostSchema (Phase 9)
- CommunityPostSchema (Phase 10)
- CourseSchema (Phase 11)
- ProductSchema (Phase 12)
- PaymentTransactionSchema (Phase 13)
- EventSchema (Phase 22)

**Impact**: HIGH - Developers will write their own schemas inconsistently

**Recommendation**: Add appendix "Complete Zod Schema Library" with all schemas

---

## Missing Technical Details

### Missing Error Codes (By Phase)

**Phase 2 (Onboarding)**:
```
ONBOARD_004: Invalid date of birth (future date)
ONBOARD_005: Onboarding already completed
ONBOARD_006: Invalid gender value
ONBOARD_007: Location required for this step
```

**Phase 3 (Dashboard)**:
```
DASHBOARD_001: Dashboard data fetch failed
DASHBOARD_002: Widget not available
DASHBOARD_003: Unauthorized dashboard access
```

**Phase 5 (Video)**:
```
RECORDING_001: Recording initialization failed
RECORDING_002: Storage quota exceeded
RECORDING_003: Transcription service unavailable
RECORDING_004: Recording download failed
RECORDING_005: Recording expired (signed URL)
```

**Phase 8 (Therapist)**:
```
THERAPIST_006: Cannot add tasks to uncompleted session
THERAPIST_007: Client not assigned to this therapist
THERAPIST_008: Availability conflict detected
THERAPIST_009: Cannot cancel session (less than 24hr)
THERAPIST_010: Note too long (max 5000 characters)
```

**Phase 10 (Community)**:
```
COMMUNITY_001 - COMMUNITY_020: (All missing - see section above)
```

**Phase 12 (Shop)**:
```
SHOP_009: Product out of stock
SHOP_010: Invalid shipping address
SHOP_011: Shipping not available to this region
SHOP_012: Order cannot be cancelled (shipped)
SHOP_013: Review not allowed (no purchase)
SHOP_014: Duplicate review
SHOP_015: Wishlist full (max 100 items)
```

**Phase 15 (Corporate)**:
```
CORPORATE_001: Corporate account not found
CORPORATE_002: Employee email already registered
CORPORATE_003: Bulk upload failed (invalid CSV)
CORPORATE_004: SSO configuration invalid
CORPORATE_005: Integration field mapping incomplete
CORPORATE_006: Subdomain already taken
CORPORATE_007: License limit exceeded
CORPORATE_008: Integration connection failed
```

**Phase 20 (Departments)**:
```
DEPARTMENT_001: Department not found
DEPARTMENT_002: Insufficient permissions for this department
DEPARTMENT_003: KPI target cannot be negative
DEPARTMENT_004: Report generation failed
DEPARTMENT_005: Export too large (> 10MB)
```

---

### Missing API Versioning Strategy

**Current State**: All endpoints use `/api/v1/` prefix

**Missing Details**:
- When to bump to `/api/v2/`?
- How long to maintain `/api/v1/` after deprecation?
- Breaking change policy
- Backwards compatibility guarantees
- Client SDK versioning strategy
- API changelog location

**Recommendation**: Add "API Versioning & Deprecation Policy" section

---

### Missing Environment Variables (By Phase)

**Phase 6 (AI Assistant)**:
```
AI_MODEL_GPT4O=gpt-4o
AI_MODEL_GPT4O_MINI=gpt-4o-mini
AI_MODEL_WHISPER=whisper-large-v3
OPENAI_API_KEY=sk-...
CRISIS_KEYWORDS_FILE_PATH=/server/src/config/crisis-keywords.ts
AI_RATE_LIMIT_PER_HOUR=100
AI_MAX_CONVERSATION_HISTORY=20
```

**Phase 20 (Analytics)**:
```
ANALYTICS_RETENTION_DAYS=365
ANALYTICS_AGGREGATION_SCHEDULE="0 2 * * *"
POSTHOG_API_KEY=...
```

**Phase 21 (SEO)**:
```
KEYWORD_TRACKING_API_KEY=...
KEYWORD_TRACKING_PROVIDER=semrush|ahrefs
SERP_API_KEY=...
```

**Phase 25 (AI Monitoring)**:
```
VIDEO_FRAME_PROCESSING_BUCKET=soul-yatri-frames
VIDEO_FRAME_PROCESSING_REGION=ap-south-1
EMOTION_DETECTION_INTERVAL_MS=5000
```

**Phase 30 (Fine-Tuning)**:
```
FINE_TUNING_DATASET_BUCKET=soul-yatri-training-data
FINE_TUNING_OUTPUT_BUCKET=soul-yatri-models
FINE_TUNING_MIN_EXAMPLES=1000
```

**Recommendation**: Add complete `.env.example` with ALL variables

---

### Missing File Paths for Components

**Phase 10 (Community)**:
```
MISSING FILE PATHS:
- src/pages/community/FeedPage.tsx
- src/pages/community/PostDetailPage.tsx
- src/pages/community/CreatePostPage.tsx
- src/components/community/PostCard.tsx
- src/components/community/CommentList.tsx
- src/components/community/ReportModal.tsx
```

**Phase 12 (Shop)**:
```
MISSING FILE PATHS:
- src/pages/shop/ShopHomePage.tsx
- src/pages/shop/ProductDetailPage.tsx
- src/pages/shop/CartPage.tsx
- src/pages/shop/CheckoutPage.tsx
- src/components/shop/ProductCard.tsx
- src/components/shop/CartItem.tsx
```

**Phase 22 (Events)**:
```
MISSING FILE PATHS:
- src/pages/events/EventsListPage.tsx
- src/pages/events/EventDetailPage.tsx
- src/pages/events/MyTicketsPage.tsx
- src/components/events/EventCard.tsx
- src/components/events/TicketPurchaseModal.tsx
```

**Recommendation**: Add complete file path mapping to "Complete Page File Map" section

---

### Missing Type Definitions

**Phase 4 (Therapy Session)**:
```typescript
// MISSING: Exact shape for SessionRequest.preferences field
type SessionPreferences = {
  therapistGender?: 'male' | 'female' | 'any';
  sessionTime?: 'morning' | 'afternoon' | 'evening' | 'flexible';
  communicationStyle?: 'directive' | 'supportive' | 'exploratory';
  focusAreas?: string[];
};
```

**Phase 10 (Community Feed Algorithm)**:
```typescript
// MISSING: Feed algorithm configuration type
type FeedAlgorithmConfig = {
  weightNewness: number;  // 0-1
  weightEngagement: number;  // 0-1
  weightRelevance: number;  // 0-1
  diversityThreshold: number;  // min posts from different authors
  maxPostAge: number;  // in hours
};
```

**Phase 15 (Integration Field Mapping)**:
```typescript
// MISSING: Field mapping type for Slack/SAP integrations
type IntegrationFieldMapping = {
  sourceField: string;  // e.g., "employee_id"
  targetField: string;  // e.g., "userId"
  transform?: 'uppercase' | 'lowercase' | 'trim' | 'email';
  required: boolean;
  defaultValue?: string;
};
```

**Phase 20 (Department Targets)**:
```typescript
// MISSING: Department KPI target type
type DepartmentTarget = {
  metric: string;  // e.g., "session_completion_rate"
  targetValue: number;
  currentValue: number;
  unit: 'percentage' | 'count' | 'currency';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  trend: 'improving' | 'declining' | 'stable';
};
```

**Phase 22 (Event Capacity)**:
```typescript
// MISSING: Event capacity management type
type EventCapacityConfig = {
  maxCapacity: number;
  currentAttendees: number;
  waitlistEnabled: boolean;
  waitlistMax: number;
  overbookingAllowed: boolean;
  overbookingPercentage?: number;  // e.g., 110% = 10% overbook
};
```

**Recommendation**: Add these to `src/types/` barrel export

---

## Missing Documentation

### Workflows Without Clear Steps

#### 1. Therapist Approval Workflow (Phase 1 mentions, but no workflow in Phase 1 or Phase 14)

**Missing Steps**:
1. Therapist submits application (which page? what fields?)
2. System creates ProfessionalOnboarding record (status: `application_submitted`)
3. Therapist uploads documents (Aadhaar, PAN, license)
4. System validates documents (automated? manual?)
5. Admin reviews application (Phase 14 admin dashboard)
6. Background check initiated (third-party API? which one?)
7. Admin schedules interview (via email? in-platform?)
8. Interview conducted (recorded? notes stored?)
9. Assessment test assigned (what test? where?)
10. Trial sessions scheduled (how many? with whom?)
11. Platform training modules assigned
12. Final approval by admin
13. Therapist account activated (status: `approved`)

**Recommendation**: Add "Professional Onboarding Workflow" diagram and detailed steps

---

#### 2. Fraud Escalation Workflow (Phase 25 detects, but resolution steps missing)

**Missing Steps**:
1. AI detects potential fraud (confidence score threshold?)
2. Flag created in database (FraudFlag model)
3. Admin notification sent (real-time? email?)
4. Admin reviews evidence (transcription, recording, therapist history)
5. Admin decision: false positive OR investigate further OR suspend therapist
6. If suspend: therapist account locked, clients notified, sessions cancelled
7. Investigation details logged
8. Therapist can appeal (how? email? in-platform?)
9. Appeal review process
10. Final decision

**Recommendation**: Add "Fraud Detection & Resolution Workflow" to Phase 25

---

#### 3. Emergency Flag Resolution Workflow (Phase 6 creates flag, but resolution unclear)

**Missing Steps**:
1. Crisis detected → EmergencyFlag created
2. User sees crisis helpline numbers (immediate)
3. Assigned therapist notified (if user has one)
4. Admin sees flag in emergency alerts feed
5. Admin acknowledges flag (within how long? 5 minutes?)
6. If user is in active session → therapist handles crisis protocol
7. If user is chatting with AI → AI enters de-escalation mode
8. Admin may call user directly (when? phone number required?)
9. Follow-up scheduled (therapist contacts user within 24 hours)
10. Flag marked resolved (or escalated to external services)

**Recommendation**: Add "Crisis Intervention Protocol Flowchart" to Phase 6

---

#### 4. Content Moderation Appeal Workflow (Phase 10 removes content, but no appeal)

**Missing Steps**:
1. User's post/comment flagged and removed
2. User receives notification of removal (reason code)
3. User clicks "Appeal" button
4. User submits appeal (text explanation, max 500 characters)
5. Appeal enters moderation review queue
6. Moderator reviews original content + appeal
7. Decision: restore content OR uphold removal OR issue warning
8. User notified of appeal decision
9. If 3 appeals rejected → temporary ban (how long?)

**Recommendation**: Add "Content Moderation Appeal Process" to Phase 10

---

### Features Without Implementation Details

#### 1. Personality Report Generation (Phase 4 mentions, no details)

**Missing**:
- How is personality assessed? (AI analysis of conversations? questionnaire?)
- When is report generated? (after X sessions? on-demand?)
- What personality framework? (Big Five? MBTI? custom?)
- Report format? (PDF? in-app only?)
- Can user download report?
- API endpoint: `GET /api/v1/users/personality-report`

**Recommendation**: Add "Personality Report Feature Spec" to Phase 4 or new phase

---

#### 2. Behavioral Pattern Detection (Phase 6 mentions, no algorithm)

**Missing**:
- What patterns are detected? (mood cycles? crisis triggers? sleep patterns?)
- How much data needed to detect pattern? (30 days? 100 conversations?)
- Machine learning model? Or rule-based?
- How are patterns surfaced to user? (dashboard widget? notification?)
- Can therapist see detected patterns?

**Recommendation**: Add "Behavioral Pattern Detection Algorithm" section

---

#### 3. Therapist Quality Score Calculation (Phase 25 mentions, formula unclear)

**Missing**:
- Quality score formula: `(sessionCompletionRate * 0.3) + (clientSatisfaction * 0.4) + (fraudFlagInverse * 0.3)`?
- Fraud flag weighting (1 fraud flag = -10 points?)
- Score range (0-100? 0-5 stars?)
- How often is score recalculated? (real-time? daily?)
- Is score visible to clients? (during booking selection?)

**Recommendation**: Add "Therapist Quality Metrics" section to Phase 25

---

#### 4. Astrologer Leaderboard (Phase 7 mentions, no algorithm)

**Missing**:
- Leaderboard ranking formula (brownie points only? or accuracy rate weighted?)
- Leaderboard reset frequency (monthly? quarterly? never?)
- How many astrologers shown on leaderboard? (top 10? top 50?)
- Leaderboard page location (public? admin-only?)
- Prizes/recognition for top astrologers?

**Recommendation**: Add "Astrologer Leaderboard Specification" to Phase 7

---

#### 5. Trending Keyword Detection (Phase 9 mentions, no spec)

**Missing**:
- Algorithm: Simple count? TF-IDF? ML model?
- Timeframe: Trending this week? this month?
- Minimum threshold (e.g., keyword must appear 100 times to trend)
- How to surface trending keywords to admins? (dashboard widget? weekly email?)
- Auto-suggest blog topics based on trends?

**Recommendation**: Add "Trending Keyword Detection" section to Phase 21 (SEO Automation)

---

### Systems Without Architecture Diagrams

#### 1. Session Matching Algorithm (Phase 4) - No flowchart

**Needed Diagram**:
```
User selects "Book Session"
  ↓
Fetch user's onboarding data (struggles, preferences)
  ↓
Query therapists WHERE:
  - specializations OVERLAP user.struggles
  - isActive = true
  - isVerified = true
  ↓
Filter by preferences:
  - therapistGender matches (if specified)
  - hasAvailability in user's preferred time slots
  ↓
Sort by:
  - 1st: Match score (specialization overlap %)
  - 2nd: Rating (avgRating DESC)
  - 3rd: Experience (yearsExperience DESC)
  ↓
Return top 20 therapists
```

**Recommendation**: Add flowchart to Phase 4

---

#### 2. Crisis Detection Pipeline (Phase 6) - No architecture

**Needed Diagram**:
```
User sends message to AI
  ↓
[Immediate] Check message against crisis keywords list
  ↓
If keyword match → INSTANT FLAG
  ├─ Create EmergencyFlag in DB
  ├─ Show crisis helpline overlay to user
  ├─ Send WebSocket notification to admin
  ├─ Notify assigned therapist (if exists)
  └─ Log to audit trail
  ↓
[Parallel] Send message to GPT-4o for sentiment analysis
  ↓
GPT-4o returns sentiment score (-1 to 1)
  ↓
If sentiment < -0.8 → SECONDARY FLAG (validate keyword detection)
  └─ Log to audit trail
  ↓
AI responds to user (empathetic, non-judgmental)
```

**Recommendation**: Add architecture diagram to Phase 6

---

#### 3. Content Moderation AI Pipeline (Phase 10) - No flow

**Needed Diagram**:
```
User submits post/comment
  ↓
[Immediate] Check for blocked words (profanity filter)
  ↓
If blocked word → Reject post, show error
  ↓
[Parallel] Send content to GPT-4o-mini for toxicity scoring
  ↓
GPT-4o-mini returns toxicity score (0-1)
  ↓
If toxicity > 0.95 → Auto-remove, notify user, log
If toxicity > 0.7 → Flag for human review
If toxicity < 0.7 → Publish immediately
  ↓
[Supplementary] Send to Perspective API (Google)
  ↓
Compare scores, if both high → high confidence flag
```

**Recommendation**: Add moderation pipeline diagram to Phase 10

---

#### 4. In-Session Monitoring System (Phase 25) - No architecture

**Needed Diagram**:
```
Video session starts
  ↓
[Every 5 minutes] Extract audio chunk
  ↓
Send audio to Whisper API for transcription
  ↓
Whisper returns text
  ↓
[Parallel Pipelines]
  ├─ Crisis Detection: Check for crisis keywords
  ├─ Sentiment Analysis: Send to GPT-4o-mini (mood score 1-10)
  └─ Fraud Detection: Analyze therapist conduct patterns
  ↓
Store results in SessionMonitoringEvent table
  ↓
If crisis detected → Show banner to therapist + flag to admin
If low mood detected → Log for post-session report
If fraud suspected → Escalate to admin (high confidence threshold)
  ↓
Post-session: Aggregate all events into SessionReport
```

**Recommendation**: Add monitoring architecture to Phase 25

---

#### 5. Multi-Currency Conversion System (Phase 13) - No flow

**Needed Diagram**:
```
User selects product (price in INR base currency)
  ↓
Fetch user's currency preference (from profile OR IP geolocation)
  ↓
If currency == INR → Display INR price, route to Razorpay
  ↓
If currency != INR:
  ├─ Fetch exchange rate from CurrencyConfig table (cached daily)
  ├─ Calculate: displayAmount = baseAmount * exchangeRate
  ├─ Round according to currency rules (USD: 2 decimals, JPY: 0 decimals)
  └─ Display converted amount
  ↓
User clicks "Pay"
  ↓
Route to Stripe (non-INR) or Razorpay (INR)
  ↓
Store transaction in BOTH currencies:
  - originalCurrency + originalAmount
  - baseCurrency (INR) + baseAmount (for reporting)
  - exchangeRateUsed (for audit)
```

**Recommendation**: Add currency flow diagram to Phase 13

---

## Missing Database/Schema Details

### 1. Indexes - No Specification

**Critical Queries Need Indexes**:

```sql
-- Phase 4: Therapist search queries
CREATE INDEX idx_therapist_profile_specializations ON "TherapistProfile" USING GIN ("specializations");
CREATE INDEX idx_therapist_profile_rating ON "TherapistProfile"("avgRating" DESC);

-- Phase 6: AI conversation lookup
CREATE INDEX idx_ai_conversation_user_created ON "AIConversation"("userId", "createdAt" DESC);

-- Phase 9: Blog post search
CREATE INDEX idx_blog_post_published_at ON "BlogPost"("publishedAt" DESC) WHERE "status" = 'published';

-- Phase 10: Community feed queries
CREATE INDEX idx_community_post_created_at ON "CommunityPost"("createdAt" DESC) WHERE "deletedAt" IS NULL;
CREATE INDEX idx_community_post_author ON "CommunityPost"("authorId") WHERE "deletedAt" IS NULL;

-- Phase 13: Payment history
CREATE INDEX idx_payment_user_created ON "PaymentTransaction"("userId", "createdAt" DESC);

-- Phase 17: Notification queries
CREATE INDEX idx_notification_user_read ON "Notification"("userId", "isRead", "createdAt" DESC);

-- Full-text search indexes
CREATE INDEX idx_blog_post_fts ON "BlogPost" USING GIN(to_tsvector('english', "title" || ' ' || "content"));
CREATE INDEX idx_community_post_fts ON "CommunityPost" USING GIN(to_tsvector('english', "content"));
```

**Recommendation**: Add "Database Index Strategy" section with complete index list

---

### 2. Cascade Delete Rules - Unclear

**Questions**:
- When user deletes account:
  - What happens to AI conversations? (delete vs archive?)
  - What happens to community posts? (delete vs mark as "[deleted user]"?)
  - What happens to therapy session records? (CANNOT delete - legal/medical records)

- When blog post deleted:
  - What happens to comments? (cascade delete? keep orphaned?)
  - What happens to likes? (cascade delete?)

- When therapist deleted:
  - What happens to past session records? (CANNOT delete)
  - What happens to future scheduled sessions? (cancel + refund)
  - What happens to therapist notes? (anonymize or keep?)

**Recommendation**: Add "Cascade Delete & Data Retention Rules" table

---

### 3. Soft vs Hard Deletes - Inconsistent

**Current Spec**:
- Community posts: Soft delete specified (deletedAt timestamp)
- Blog comments: Soft delete mentioned
- Other entities: Not specified

**Recommendation**: Clarify for ALL entities:

```
SOFT DELETE (deletedAt timestamp, recoverable):
- User accounts (30-day grace period before hard delete)
- Community posts (moderator can restore)
- Blog posts (admin can restore)
- Therapist notes (medical record retention)

HARD DELETE (immediate, irreversible):
- Refresh tokens (logout)
- Notification read status (cleanup old)
- Session recordings (after retention period, e.g., 2 years)

NO DELETE (permanent):
- Payment transactions (legal requirement)
- Audit logs (compliance)
- Emergency flags (safety)
```

---

### 4. Table Partitioning Strategy - Missing

**Large Tables That Need Partitioning**:
- AnalyticsEvent (Phase 20): Partition by month (time-series data)
- Notification: Partition by year
- AuditLog: Partition by quarter
- AIConversation: Consider partitioning if > 10M records

**Recommendation**: Add "Database Partitioning Strategy" for scalability

---

## Missing Integration Details

### 1. Email Provider Integration (Resend.com)

**Missing Details**:
- Email template HTML (no templates provided)
- Sender identity: `noreply@soulyatri.com`? `hello@soulyatri.com`?
- Unsubscribe link implementation (how to track unsubscribe status?)
- Bounce/complaint webhook handling
- Email sending queue (BullMQ job? direct API call?)
- Rate limiting (Resend free tier: 3K emails/month)

**Recommendation**: Add email template examples + integration guide

---

### 2. Razorpay Webhook Integration

**Missing Details**:
- Webhook signature verification code
- Error code mapping:
  ```
  Razorpay error code BAD_REQUEST_ERROR → PAYMENT_001
  Razorpay error code GATEWAY_ERROR → PAYMENT_003
  Razorpay error code SERVER_ERROR → PAYMENT_009
  ```
- Subscription plan creation for memberships (Phase 23)
- Webhook retry handling (if webhook processing fails)

**Recommendation**: Add "Razorpay Integration Guide" with code examples

---

### 3. Daily.co Video Integration

**Missing Details**:
- Room expiration strategy (delete room after session ends? keep for 24 hours?)
- Room cleanup background job (when to run?)
- Bandwidth detection implementation (how to detect user's network speed?)
- Fallback for video call failure (reschedule? phone call?)

**Recommendation**: Add "Daily.co Integration Best Practices"

---

### 4. S3/Cloudflare R2 Storage Integration

**Missing Details**:
- Bucket organization strategy:
  ```
  soul-yatri-production/
    ├── recordings/
    │   └── {sessionId}/
    │       └── {timestamp}.webm
    ├── avatars/
    │   └── {userId}.jpg
    ├── course-videos/
    │   └── {courseId}/
    │       └── {lessonId}.mp4
    ├── product-images/
    │   └── {productId}/
    │       └── {imageId}.jpg
    └── blog-images/
        └── {postId}/
            └── {imageId}.jpg
  ```
- Cleanup strategy for old files (recordings older than 2 years)
- Lifecycle policy specification (move to cold storage after 1 year)
- Signed URL expiry duration (1 hour for recordings, 24 hours for avatars)

**Recommendation**: Add "S3/R2 Storage Architecture" diagram

---

## Missing Performance/Monitoring

### 1. SLA Targets - Incomplete

**Missing SLAs**:
- Complex search queries (blog full-text search, therapist search): < ??? ms
- Community feed generation: < ??? ms
- Report generation (admin dashboard): < ??? seconds
- Course video transcoding: < ??? minutes
- Background job execution time: < ??? seconds

**Recommendation**: Add complete SLA table for ALL endpoint categories

---

### 2. Monitoring Gaps

**Missing Monitoring Specs**:
- AI cost per user tracking (how much does AI chat cost per conversation?)
- Memory leak detection strategy (Node.js memory monitoring)
- Database query monitoring (slow query log threshold?)
- WebSocket connection monitoring (active connections, reconnection rate)
- Error rate by endpoint (which endpoints fail most often?)

**Recommendation**: Add "Monitoring & Observability Setup Guide"

---

### 3. Caching Strategy - Missing

**Questions**:
- Which endpoints need caching? (therapist list? blog posts? dashboard data?)
- Cache TTL values (5 minutes? 1 hour?)
- Cache invalidation strategy:
  - When therapist updates profile → invalidate therapist list cache
  - When blog post published → invalidate blog feed cache
  - When user updates profile → invalidate dashboard cache
- Redis cache key naming convention?

**Recommendation**: Add "Caching Strategy & TTL Configuration" table

---

## Missing Security Details

### 1. Two-Factor Authentication (2FA) - Missing

**Current State**: Mentioned for corporate but not for regular users

**Missing Spec**:
- Should regular users have 2FA option?
- If yes: TOTP (Google Authenticator) or SMS?
- Backup codes generation (10 codes, use once)?
- 2FA enforcement for admin accounts?
- 2FA setup workflow (QR code display, verification)

**Recommendation**: Add 2FA as optional feature in Phase 1

---

### 2. API Key Management - Missing

**Missing Details**:
- API key rotation frequency (rotate OpenAI key quarterly?)
- Secure storage (AWS Secrets Manager? Doppler?)
- Test vs production key separation (different .env files?)
- Key access logging (who accessed which key when?)

**Recommendation**: Add "API Key Management & Rotation Policy"

---

### 3. Data Encryption Details - Vague

**Current Spec**: "Therapy session data: AES-256 encryption at rest"

**Missing**:
- Which specific fields are encrypted?
  - Session.transcription?
  - TherapistNote.content?
  - AIConversation.messages?
  - KundaliChart.chartData?
- Encryption key storage (AWS KMS? Vault?)
- Encryption key rotation strategy (annually?)
- How to query encrypted data? (decrypt at application layer?)

**Recommendation**: Add "Data Encryption Strategy" with field-level encryption map

---

### 4. Session Management - Incomplete

**Missing**:
- Session timeout duration (JWT: 15 min, but browser session timeout?)
- Concurrent session limits (can user be logged in on 2 devices? 5 devices?)
- Device tracking (log device type, IP, location on login?)
- "Log out all sessions" feature (revoke all refresh tokens)

**Recommendation**: Add "Session Management & Device Tracking" section

---

## Missing Deployment/DevOps

### 1. Database Migration Strategy

**Missing**:
- Zero-downtime migration strategy (how to add columns without locking table?)
- Rollback procedures (if migration fails halfway?)
- Migration testing process (test on staging first)
- Data migration for large tables (how to migrate 10M rows?)

**Recommendation**: Add "Database Migration Best Practices" guide

---

### 2. Feature Flags - Not Mentioned

**Missing**:
- Feature flag system for gradual rollouts
- A/B testing framework (test new UI with 50% of users)
- Kill switch for problematic features (disable AI assistant if buggy)
- Feature flag cleanup (remove old flags after full rollout)

**Recommendation**: Add "Feature Flag Strategy" (suggest LaunchDarkly or Unleash)

---

### 3. Deployment Procedure - Vague

**Current Spec**: "Exit gates" mentioned but no detailed procedure

**Missing**:
- Pre-deployment checklist (run tests, check env vars, backup database)
- Deployment steps (build → deploy → smoke test → monitor)
- Rollback procedure (if deployment fails, how to rollback?)
- Blue-green deployment strategy (zero-downtime deployments)
- Health check endpoints (for load balancer to verify app is healthy)

**Recommendation**: Add "Deployment Runbook" with step-by-step instructions

---

### 4. Backup & Disaster Recovery - Minimal

**Current Spec**: "Database backups configured (daily)" - that's it!

**Missing**:
- Backup frequency (daily at 2 AM?)
- Backup retention period (keep backups for 30 days? 90 days?)
- Backup restoration procedure (how to restore from backup?)
- Cross-region backups (backup to different AWS region for disaster recovery?)
- Backup testing frequency (test restore quarterly?)
- Recovery Time Objective (RTO): How long to restore from backup?
- Recovery Point Objective (RPO): How much data loss is acceptable?

**Recommendation**: Add "Backup & Disaster Recovery Plan"

---

## Missing Compliance/Legal

### 1. GDPR Implementation - Incomplete

**Current Spec**: Mentions GDPR rights but no technical implementation

**Missing**:
- Data portability format (JSON? CSV? PDF?)
- Data export API implementation (how to export all user data?)
- Right to erasure verification (how to prove data is deleted?)
- Consent management UI (checkboxes for each data processing purpose)
- GDPR consent withdrawal (user can revoke consent, then what?)

**Recommendation**: Add "GDPR Compliance Technical Implementation" section

---

### 2. HIPAA-Style Compliance - Mentioned But No Details

**Current Spec**: "HIPAA-style audit logs"

**Missing**:
- Audit log retention (7 years minimum?)
- What gets logged? (every data access, every admin action, every session view)
- Data access authorization matrix:
  ```
  Role: Therapist
  - Can access: Own clients' data
  - Cannot access: Other therapists' clients
  - Audit: Every client data access logged

  Role: Admin
  - Can access: All data (with justification required)
  - Audit: Every admin access logged + justification
  ```
- Breach notification procedure (if data breach detected, notify users within 72 hours)

**Recommendation**: Add "Healthcare Data Compliance Guide"

---

### 3. DPDPA (India) Compliance - Vague

**Current Spec**: Mentions DPDPA but no technical controls

**Missing**:
- Consent banner specification (what text? which checkboxes?)
- Data Processing Agreements template (for third-party vendors like OpenAI, Razorpay)
- Data localization implementation (primary database in India, backups in India)
- Grievance redressal mechanism UI (where do users file data complaints?)
- Data Protection Officer (DPO) contact information display

**Recommendation**: Add "DPDPA Compliance Checklist"

---

## Missing Testing Specifications

### 1. Test Data - No Seeding Strategy

**Missing**:
- How to seed test database with realistic data?
- Synthetic test data generation for performance testing (1M users, 100K sessions)
- Test user accounts (admin, therapist, astrologer, regular user)
- Test payment transactions (without real money)

**Recommendation**: Add database seeding scripts in `/server/prisma/seed.ts`

---

### 2. Load Testing - No Targets

**Missing**:
- Load testing targets (handle 1000 concurrent users? 10,000?)
- Load testing tool recommendation (k6? Artillery? JMeter?)
- Load testing scenarios:
  - Scenario 1: 100 users booking sessions simultaneously
  - Scenario 2: 500 users chatting with AI simultaneously
  - Scenario 3: 50 video sessions running concurrently
- Performance degradation thresholds (when does response time exceed SLA?)

**Recommendation**: Add "Load Testing Strategy & Targets"

---

### 3. Security Testing - No Frequency

**Missing**:
- Penetration testing frequency (annually? quarterly?)
- Security scanning tools (OWASP ZAP? Burp Suite?)
- Automated security scanning in CI/CD (Snyk? Dependabot?)
- Security audit checklist (OWASP Top 10 coverage)

**Recommendation**: Add "Security Testing Schedule & Tools"

---

## Pagination & Search Inconsistencies

### 1. Default Page Size Inconsistencies

**Current Spec**:
- Admin pages mention "10/25/50/100" options
- Blog mentions "10 at a time"
- Other endpoints: Not specified

**Recommendation**: Standardize default page sizes:
```
DEFAULT_PAGE_SIZE = 20
ADMIN_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
MAX_PAGE_SIZE = 100
```

---

### 2. Search Implementation - Vague

**Current Spec**: "Full-text search mentioned for journal"

**Missing**:
- Full-text search for ALL text fields?
- Search result ranking algorithm (exact match first? relevance score?)
- Search query autocomplete (suggest search terms as user types?)
- Search filters (date range, category, author)
- Search performance (index strategy, query optimization)

**Recommendation**: Add "Search Implementation Guide" with Postgres full-text search setup

---

## Missing Feature Specifications

### 1. User Profile Page

**Current Spec**: Only mentioned in sidebar navigation

**Missing**:
- Edit profile page specification
- Profile fields (name, email, phone, avatar, bio, location)
- Change password flow
- Email verification flow
- Phone number verification (OTP)

**Recommendation**: Add "User Profile Management" page to Phase 1 or Phase 3

---

### 2. Password Reset Flow

**Current Spec**: Mentioned in file map but NOT in Phase 1 (Auth)

**Missing**:
- Forgot password page (email input)
- Reset password email template
- Reset password token (JWT? expiry: 1 hour?)
- Reset password page (enter new password)
- API endpoints:
  ```
  POST /api/v1/auth/forgot-password → Send reset email
  POST /api/v1/auth/reset-password   → Verify token + set new password
  ```

**Recommendation**: Add password reset to Phase 1

---

### 3. Email Verification

**Current Spec**: Not mentioned anywhere

**Question**: Is email verification needed?

**If Yes, Missing**:
- Verification email template
- Verification token (JWT? expiry: 24 hours?)
- Verification page (click link in email)
- Resend verification email option
- Block unverified users from booking sessions?

**Recommendation**: Clarify if email verification is required, add to Phase 1

---

### 4. Social Login (Google/Facebook)

**Current Spec**: Not mentioned

**Question**: Should users be able to log in with Google/Facebook?

**If Yes, Missing**:
- OAuth provider setup (Google OAuth client ID)
- OAuth callback handling
- Account linking (if user already has email account, link Google account)
- API endpoints:
  ```
  GET  /api/v1/auth/google          → Redirect to Google OAuth
  GET  /api/v1/auth/google/callback → Handle OAuth callback
  POST /api/v1/auth/google/link     → Link Google account to existing account
  ```

**Recommendation**: Clarify if social login is needed (likely post-MVP)

---

### 5. Referral System

**Current Spec**: Not mentioned

**Question**: Should there be a referral program? ("Refer a friend, get ₹200 credit")

**If Yes, Missing**:
- Referral code generation
- Referral tracking (who referred whom?)
- Referral rewards (wallet credit, discount code, free session)
- Referral page (user can share referral link)
- API endpoints:
  ```
  GET  /api/v1/users/referral-code   → Get my referral code
  POST /api/v1/users/apply-referral  → Apply someone's referral code
  GET  /api/v1/users/referral-stats  → See who I referred
  ```

**Recommendation**: Add referral system as post-MVP feature (Phase 23+)

---

### 6. User Level/Badges

**Current Spec**: Mentioned in community but not fully specified

**Missing**:
- User level calculation (XP points? activity score?)
- Level-up triggers (post 10 times? get 50 likes?)
- Badges list (Early Adopter, Helper, Meditation Master, etc.)
- Badge display on profile/posts
- Gamification strategy (encourage engagement)

**Recommendation**: Add gamification system to Phase 10 (Community)

---

### 7. Export/Download Features - Inconsistent

**Current Spec**:
- Reports can be exported (no format specified)
- Health data export mentioned (no format specified)

**Missing Clarity**:
- Export format: CSV? JSON? PDF?
- Export API endpoints:
  ```
  GET /api/v1/users/export-data → Export ALL user data (GDPR requirement)
  GET /api/v1/health/export     → Export health data (CSV)
  GET /api/v1/admin/reports/export?format=csv → Export reports
  ```
- Export job queue (large exports processed in background)
- Export download link (signed URL, expires in 24 hours)

**Recommendation**: Add "Data Export Feature Specification"

---

## Recommendations

### Immediate Actions (Before Development Starts)

1. **Complete Phase 7 (Astrologer System) specification** - CRITICAL MVP BLOCKER
   - Define all Prisma models
   - Define all API endpoints
   - Define all workflows
   - Define error codes
   - Estimated effort: 2-3 days

2. **Define Payment Prisma models** - CRITICAL MVP BLOCKER
   - PaymentTransaction model
   - CurrencyConfig model
   - PaymentWebhookEvent model
   - Estimated effort: 1 day

3. **Create comprehensive Zod schema library** - HIGH PRIORITY
   - Add schemas for all phases (currently only Phase 1 has them)
   - Estimated effort: 3-4 days

4. **Define complete error code list** - HIGH PRIORITY
   - Add missing error codes for all phases
   - Create error code reference document
   - Estimated effort: 2 days

5. **Add workflow diagrams for critical flows** - HIGH PRIORITY
   - Crisis detection pipeline
   - Session matching algorithm
   - Therapist approval workflow
   - Fraud escalation workflow
   - Estimated effort: 2 days

---

### Short-Term Actions (During MVP Development)

6. **Complete Phase 10 (Community) specification** - POST-MVP but needed soon
   - Define all Prisma models
   - Define feed algorithm
   - Define moderation workflow
   - Estimated effort: 2-3 days

7. **Add cross-reference links between phases** - MEDIUM PRIORITY
   - Session ↔ Astrology integration
   - Health tools ↔ Dashboard integration
   - Community ↔ Admin moderation integration
   - Estimated effort: 1 day

8. **Define database index strategy** - MEDIUM PRIORITY
   - Identify slow queries
   - Add index definitions
   - Estimated effort: 1 day

9. **Create email template library** - MEDIUM PRIORITY
   - Design HTML email templates
   - Welcome email, appointment reminder, payment receipt, etc.
   - Estimated effort: 2 days

10. **Add deployment runbook** - MEDIUM PRIORITY
    - Pre-deployment checklist
    - Deployment steps
    - Rollback procedure
    - Estimated effort: 1 day

---

### Long-Term Actions (Before Production Launch)

11. **Complete compliance documentation** - REQUIRED FOR LAUNCH
    - GDPR compliance guide
    - HIPAA-style compliance guide
    - DPDPA compliance checklist
    - Estimated effort: 3-4 days

12. **Add monitoring & observability setup** - REQUIRED FOR LAUNCH
    - Define all metrics to track
    - Set up dashboards
    - Configure alerts
    - Estimated effort: 2-3 days

13. **Define backup & disaster recovery plan** - REQUIRED FOR LAUNCH
    - Backup frequency & retention
    - Restoration procedure
    - Cross-region backups
    - Estimated effort: 1-2 days

14. **Complete security testing strategy** - REQUIRED FOR LAUNCH
    - Penetration testing schedule
    - Security scanning tools
    - Security audit checklist
    - Estimated effort: 2 days

15. **Fill remaining phase gaps** - ONGOING
    - Phase 15 (Corporate) integration details
    - Phase 22 (Events) complete specification
    - Phase 25 (AI Monitoring) architecture
    - Estimated effort: 5-6 days total

---

### Total Estimated Effort to Address All Gaps

- **Immediate (MVP blockers)**: 8-10 days
- **Short-term (during MVP dev)**: 7-9 days
- **Long-term (before launch)**: 8-11 days
- **TOTAL**: 23-30 days of documentation work

---

## Conclusion

The BUILD_PLAN.md is **65% complete** in terms of implementation-ready specifications. While the document provides excellent high-level structure and covers all 31 phases, approximately **35% of critical implementation details are missing**:

- **10 phases have incomplete or missing Prisma models**
- **15 phases lack complete error code definitions**
- **8 phases lack workflow diagrams**
- **20+ API endpoints are mentioned but not specified**
- **Multiple cross-references between phases are missing**
- **Security, compliance, and deployment details are vague**

**Recommendation**: Allocate 3-4 weeks for documentation completion before starting development on incomplete phases, especially Phase 7 (Astrologer System) which is critical for MVP.


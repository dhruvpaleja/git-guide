# ULTIMATE FEATURE & ALGORITHM BIBLE — Soul Yatri

**Generated**: March 6, 2026  
**Purpose**: The most exhaustive, algorithm-level specification of every feature, every data point to track, every dashboard metric, every matching algorithm, every AI model input, every engagement loop — designed so that ANY engineer or AI agent can build each system without ambiguity.  
**Companion files**: [`15_master_execution_roadmap.md`](15_master_execution_roadmap.md) for sequencing, [`14_execution_prompts.md`](14_execution_prompts.md) for implementation prompts, [`MASTER_TODO_LIST.md`](MASTER_TODO_LIST.md) for checkboxes.

---

## TABLE OF CONTENTS

- [Part 1: Data Tracking & AI Training Strategy](#part-1-data-tracking--ai-training-strategy)
- [Part 2: User Dashboard — Every Feature in Depth](#part-2-user-dashboard--every-feature-in-depth)
- [Part 3: Therapist System — Matching, Sessions, Revenue](#part-3-therapist-system--matching-sessions-revenue)
- [Part 4: Astrologer System — Full Specification](#part-4-astrologer-system--full-specification)
- [Part 5: Admin Panel — God-Mode Dashboard](#part-5-admin-panel--god-mode-dashboard)
- [Part 6: AI Systems — Algorithms & Models](#part-6-ai-systems--algorithms--models)
- [Part 7: Engagement, Retention & Gamification](#part-7-engagement-retention--gamification)
- [Part 8: Community, Social & Content Systems](#part-8-community-social--content-systems)
- [Part 9: Payment, Subscription & Monetization](#part-9-payment-subscription--monetization)
- [Part 10: E-Commerce / Wellness Shop](#part-10-e-commerce--wellness-shop)
- [Part 11: Corporate & Institutional Wellness](#part-11-corporate--institutional-wellness)
- [Part 12: NGO & Social Impact Module](#part-12-ngo--social-impact-module)
- [Part 13: Events & Workshops System](#part-13-events--workshops-system)
- [Part 14: Blog & Content CMS](#part-14-blog--content-cms)
- [Part 15: Courses & Learning Platform](#part-15-courses--learning-platform)
- [Part 16: Careers & Hiring Module](#part-16-careers--hiring-module)
- [Part 17: Notification Intelligence System](#part-17-notification-intelligence-system)
- [Part 18: Missing Prisma Models to Add](#part-18-missing-prisma-models-to-add)
- [Part 19: Complete Event Tracking Taxonomy](#part-19-complete-event-tracking-taxonomy)
- [Part 20: Feature Priority Matrix (22 Dimensions)](#part-20-feature-priority-matrix-22-dimensions)

---

# Part 1: Data Tracking & AI Training Strategy

## 1.1 Philosophy: "Data Is Our Money"

Every user interaction generates data that:
1. **Personalizes** their experience (recommendations, mood insights, therapist matching)
2. **Trains our AI models** (crisis detection, sentiment analysis, matching improvement)
3. **Powers admin analytics** (business intelligence, fraud detection, quality metrics)
4. **Enables therapists** (client progress tracking, session preparation)
5. **Proves platform value** (outcomes data, improvement metrics, ROI for corporate clients)

## 1.2 Master Event Schema

Every trackable event follows this structure:

```typescript
interface TrackingEvent {
  id: string;                    // UUID
  userId: string;                // Who
  sessionId?: string;            // Browser session (not therapy session)
  eventName: string;             // e.g., "mood.logged", "session.booked"
  eventCategory: EventCategory;  // "engagement" | "health" | "commerce" | "social" | "navigation" | "system"
  properties: Record<string, any>; // Event-specific data
  
  // Context (auto-captured)
  timestamp: Date;
  timezone: string;              // User's local timezone
  deviceType: string;            // "mobile" | "tablet" | "desktop"
  os: string;                    
  browser: string;
  screenResolution: string;
  pageUrl: string;
  referrer: string;
  
  // User context (auto-enriched server-side)
  userRole: Role;
  onboardingComplete: boolean;
  accountAgeDays: number;
  subscriptionTier: string;
}
```

## 1.3 Events To Track — COMPLETE TAXONOMY

### Navigation & Engagement Events
| Event Name | Trigger | Properties | AI Use |
|-----------|---------|------------|--------|
| `page.viewed` | Any page load | `{ page, timeOnPage, scrollDepth }` | Content recommendations |
| `feature.discovered` | First time user opens a feature | `{ feature, daysSinceSignup }` | Onboarding optimization |
| `feature.used` | Any feature interaction | `{ feature, action, duration }` | Feature value scoring |
| `session.started` | App open | `{ source, timeOfDay, dayOfWeek }` | Usage pattern modeling |
| `session.ended` | App close/idle | `{ duration, pagesVisited, actionsPerformed }` | Engagement scoring |
| `cta.clicked` | Any CTA/button click | `{ ctaId, ctaLabel, page, position }` | Conversion optimization |
| `search.performed` | Search query | `{ query, resultCount, clickedResult }` | Search improvement |

### Health & Wellness Events
| Event Name | Trigger | Properties | AI Use |
|-----------|---------|------------|--------|
| `mood.logged` | Mood entry saved | `{ score, tags[], note_length, timeOfDay }` | Mood prediction model |
| `mood.trend.viewed` | User views mood chart | `{ period, moods_in_period }` | Engagement correlation |
| `journal.created` | Journal entry saved | `{ word_count, mood, tags[], has_title, time_to_write }` | Sentiment analysis training |
| `journal.edited` | Journal entry updated | `{ edit_count, time_since_creation }` | Longitudinal analysis |
| `meditation.started` | Meditation begins | `{ type, track_name, duration_target }` | Session recommendation |
| `meditation.completed` | Full meditation done | `{ duration_actual, type, mood_before?, mood_after? }` | Effectiveness scoring |
| `meditation.abandoned` | Quit before finish | `{ duration_reached, total_duration, abandon_point_pct }` | Difficulty calibration |
| `confessional.submitted` | Confessional entry | `{ word_count, time_to_write }` | Emotional pattern detection |
| `crisis.detected` | AI flags crisis keywords | `{ severity, keywords[], user_response }` | Crisis model improvement |
| `wellness.score.calculated` | Daily wellness score | `{ score, components{mood,journal,meditation,social} }` | Outcome prediction |

### Therapy & Session Events
| Event Name | Trigger | Properties | AI Use |
|-----------|---------|------------|--------|
| `therapist.viewed` | User views therapist profile | `{ therapistId, viewDuration, fromPage }` | Matching optimization |
| `therapist.compared` | User views multiple therapists | `{ therapistIds[], time_comparing }` | Preference modeling |
| `session.booked` | Session confirmed | `{ therapistId, dayOfWeek, timeSlot, price, isFirst }` | Demand forecasting |
| `session.cancelled` | Session cancelled | `{ therapistId, reason, hoursBeforeSession, cancelledBy }` | Churn prediction |
| `session.no_show` | No show event | `{ therapistId, side: "user"|"therapist" }` | Reliability scoring |
| `session.started` | Video call begins | `{ therapistId, onTime, techIssues }` | Quality monitoring |
| `session.ended` | Video call ends | `{ duration, earlyEnd, networkQuality }` | Session quality |
| `session.rated` | User rates session | `{ rating, therapistId, feedback_length }` | Therapist scoring |
| `session.notes.saved` | Therapist saves notes | `{ sessionId, noteLength, hasRecommendations }` | Treatment tracking |
| `booking.funnel.step` | Each booking step | `{ step, therapistId, timeOnStep, abandonedAt? }` | Funnel optimization |

### Payment Events
| Event Name | Trigger | Properties | AI Use |
|-----------|---------|------------|--------|
| `payment.initiated` | Checkout opened | `{ amount, type, currency }` | Revenue forecasting |
| `payment.completed` | Payment success | `{ amount, method, processingTime }` | LTV modeling |
| `payment.failed` | Payment failure | `{ amount, errorCode, retryCount }` | Failure analysis |
| `subscription.started` | New subscription | `{ tier, price, trialUsed }` | Conversion modeling |
| `subscription.upgraded` | Tier upgrade | `{ oldTier, newTier, daysSinceStart }` | Upsell optimization |
| `subscription.cancelled` | Cancellation | `{ tier, reason, monthsSubscribed }` | Churn prediction model |
| `refund.requested` | Refund request | `{ amount, reason, sessionId? }` | Quality flagging |

### Social & Community Events  
| Event Name | Trigger | Properties | AI Use |
|-----------|---------|------------|--------|
| `post.created` | Community post | `{ category, wordCount, hasMedia }` | Content moderation |
| `post.liked` | Like on post | `{ postId, authorId }` | Content ranking |
| `comment.created` | Comment posted | `{ postId, wordCount, sentiment? }` | Community health |
| `connection.requested` | Connection request sent | `{ targetUserId, connectionType }` | Social graph |
| `connection.accepted` | Connection accepted | `{ requesterId, connectionType }` | Network analysis |
| `group.joined` | Support group joined | `{ groupId, groupTopic }` | Community matching |

### Astrology Events
| Event Name | Trigger | Properties | AI Use |
|-----------|---------|------------|--------|
| `chart.generated` | Birth chart created | `{ chartType, birthData }` | Astrology personalization |
| `prediction.viewed` | User reads prediction | `{ predictionType, zodiacSign, timeSpentReading }` | Content optimization |
| `prediction.voted` | Accuracy vote | `{ predictionId, vote: "accurate"|"inaccurate" }` | Prediction model training |
| `astrologer.booked` | Astrology session booked | `{ astrologerId, sessionType, price }` | Demand analysis |
| `horoscope.read` | Daily horoscope viewed | `{ zodiacSign, readTime }` | Retention correlation |

## 1.4 AI Training Data Pipeline

```
User Actions → Event Store (PostgreSQL) → ETL Pipeline → Training Dataset
                    ↓                         ↓
              Real-time Streaming        Weekly Batch Processing
              (WebSocket analytics)      (Data warehouse export)
                    ↓                         ↓
              Live Dashboards           Model Training Jobs
              (Admin Panel)             (Matching, Crisis, Sentiment)
```

### Prisma Model for Events (NEW — Add to Schema)
```prisma
model AnalyticsEvent {
  id            String   @id @default(uuid())
  userId        String?
  eventName     String
  eventCategory String
  properties    Json
  
  // Context
  deviceType    String?
  pageUrl       String?
  referrer      String?
  sessionToken  String?  // Browser session grouping
  
  createdAt     DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([eventName, createdAt])
  @@index([eventCategory])
  @@index([sessionToken])
}
```

### Data Retention Policy
| Data Type | Hot Storage (PostgreSQL) | Warm Storage (S3/R2 JSON) | Cold Archive |
|-----------|------------------------|--------------------------|-------------|
| Analytics events | 90 days | 1 year | 5 years |
| Mood entries | Forever | N/A | N/A |
| Journal entries | Forever (encrypted) | N/A | Purge on delete |
| Session recordings | 30 days | 6 months | Delete |
| Payment data | Forever | N/A | N/A |
| Audit logs | 1 year | 5 years | 10 years |
| AI chat transcripts | 90 days | 1 year | Anonymized for training |

### GDPR / Privacy Compliance
- All tracking respects `UserSettings.patternAlerts` flag
- Users can request full data export (existing route: `GET /users/my-data/export`)
- Users can request deletion (add route: `DELETE /users/my-data`)
- Anonymization pipeline for AI training data strips PII before model training
- Consent banner tracks: `analytics_consent`, `marketing_consent`, `personalization_consent`

---

# Part 2: User Dashboard — Every Feature in Depth

## 2.1 Dashboard Home — Personalized Wellness Hub

### Current State
- Static layout with hardcoded greeting
- No personalization
- No wellness score
- No recommendations

### Target State — Algorithm Specification

#### Daily Wellness Score Algorithm
```
WellnessScore = weighted_average({
  mood_component:        weight=0.30,  // Average mood last 7 days (1-10 scaled to 0-100)
  journal_component:     weight=0.15,  // Journal frequency (entries this week / 3 target * 100, capped at 100)
  meditation_component:  weight=0.15,  // Meditation minutes this week / 70 target * 100, capped at 100
  sleep_component:       weight=0.15,  // Self-reported sleep quality if tracked (1-10 scaled to 0-100)
  session_component:     weight=0.15,  // Had therapy session this month? 100 : missed_penalty
  social_component:      weight=0.10,  // Community engagement (posts + comments + connections) / 5 target * 100
})

// Decay: If no activity in 3+ days, apply 5% penalty per day of inactivity
// Boost: Streak multiplier (consecutive daily check-in days * 2, capped at +20)
```

#### Smart Recommendation Engine
```typescript
interface DashboardRecommendation {
  type: "meditation" | "journal" | "mood" | "session" | "community" | "course" | "astrology";
  title: string;         // "Your mood has been low — try a guided meditation"
  urgency: "gentle" | "suggested" | "important" | "urgent";
  reason: string;        // AI-generated reason based on user data
  action: string;        // CTA label: "Start 5-min meditation"
  actionUrl: string;     // Deep link to feature
  confidence: number;    // 0-1 model confidence
}

// Algorithm: Score each recommendation by:
// 1. Relevance: Does user's recent data suggest they need this?
// 2. Recency: Have they done this recently? (avoid nagging)
// 3. Time: Is this the right time of day for this activity?
// 4. Preference: Does their profile/history show they engage with this?
// 5. Novelty: Have they ever tried this? (bonus for new features)
```

#### Dashboard Sections (Top to Bottom)
1. **Greeting + Wellness Score** — "Good morning, [Name]. Your wellness score is 72/100 ↑3"
2. **Today's Recommendations** — 2-3 personalized cards
3. **Quick Actions** — Log mood, Write journal, Start meditation, Book session
4. **Mood Trend Miniature** — Last 7 days sparkline
5. **Upcoming Sessions** — Next therapy/astrology session with countdown
6. **Active Streaks** — 🔥 7-day mood logging streak
7. **Community Pulse** — 2 recent posts from their support groups
8. **Daily Horoscope Snippet** — Personalized zodiac insight (if astrology data exists)

### Data Points Tracked on Dashboard Home
- Time spent on dashboard
- Which recommendation cards were clicked vs ignored
- Which quick action was used
- Scroll depth
- Time of day pattern

---

## 2.2 Mood Tracking — Deep Specification

### Current State
- ✅ Working with real API (`GET/POST /health-tools/mood`)
- ✅ Score (1-10), note, tags
- ❌ No trend analysis
- ❌ No pattern detection
- ❌ No AI insights

### Target State — Algorithm Specification

#### Mood Pattern Detection Algorithm
```typescript
interface MoodPattern {
  type: "declining" | "improving" | "volatile" | "stable" | "cyclical";
  confidence: number;      // 0-1
  period: "daily" | "weekly" | "monthly";
  details: string;         // "Your mood tends to drop on Monday mornings"
  triggers?: string[];     // Correlated tags: ["work", "stress"]
  recommendation: string;  // What to do about it
}

function detectMoodPatterns(entries: MoodEntry[], window: number = 30): MoodPattern[] {
  // 1. TREND: Linear regression over {window} days
  //    - slope > 0.05 → "improving"
  //    - slope < -0.05 → "declining"
  //    - |slope| < 0.05 → check volatility
  
  // 2. VOLATILITY: Standard deviation of scores
  //    - stddev > 2.5 → "volatile"
  //    - stddev < 1.0 → "stable"
  
  // 3. CYCLICAL: FFT or autocorrelation at 7-day and 30-day periods
  //    - significant peak at period=7 → "weekly cyclical" 
  //    - Identify which day scores lowest/highest
  
  // 4. TAG CORRELATION: For each tag, compute average mood when present vs absent
  //    - If tag="work" drops mood by >1.5 avg → flag as trigger
  
  // 5. TIME-OF-DAY: Group by morning/afternoon/evening
  //    - If evening moods consistently lower → recommend evening meditation
  
  return patterns;
}
```

#### Mood Prediction Model (AI/ML)
```
Input features:
  - Last 7 mood scores
  - Day of week (one-hot encoded)
  - Time of day
  - Recent tags frequency
  - Sleep data if available
  - Upcoming events (therapy session scheduled? → positive factor)
  - Weather integration (optional — free API)
  - Social activity level (posts, comments)

Output:
  - Predicted mood score for today (1-10)
  - Confidence interval
  - "If you meditate today, predicted mood improves by 0.8"

Model: Start with simple linear regression, graduate to XGBoost, then neural network
Training data: All mood entries across all users (anonymized, aggregated)
```

#### Crisis Detection in Mood System
```
IF mood_score <= 2 for 3+ consecutive entries:
  → Flag: CRISIS_POTENTIAL (severity: HIGH)
  → Show helpline numbers immediately
  → Notify assigned therapist (if exists)
  → Log to admin crisis dashboard

IF mood_score drops by 4+ points in single day:
  → Flag: ACUTE_DROP (severity: MEDIUM)  
  → Show "Would you like to talk to someone?" modal
  → Suggest AI chat or emergency session booking

IF tags include ["suicidal", "hopeless", "ending", "can't go on"]:
  → Flag: IMMEDIATE_CRISIS (severity: CRITICAL)
  → Show crisis intervention popup IMMEDIATELY
  → Auto-notify admin + nearest therapist
  → Log with full context for review
```

#### Mood Insights Dashboard
- **7-day view**: Bar chart with emoji mapping + tags overlay
- **30-day view**: Line chart with trend line + pattern annotations
- **90-day view**: Heatmap (day of week × week number, color = mood)
- **Tag cloud**: Size = frequency, color = associated mood (red=low, green=high)
- **Correlations**: "When you tag 'exercise', your mood averages 7.2 vs 5.4 overall"
- **Best/Worst times**: "Your highest moods are Wednesday evenings (avg 7.8)"

---

## 2.3 Journal System — Deep Specification

### Current State
- ✅ Working CRUD API
- ✅ Rich text entry with mood and tags
- ❌ No sentiment analysis
- ❌ No AI prompts/suggestions
- ❌ No therapist-visible entries (with consent)

### Target Enhancements

#### Sentiment Analysis Pipeline
```typescript
// Run on every journal entry save (async)
interface JournalSentiment {
  entryId: string;
  overallSentiment: number;     // -1.0 to +1.0
  emotions: {
    joy: number;                // 0-1
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
    trust: number;
    anticipation: number;
  };
  topics: string[];             // Extracted topics ["relationships", "work", "family"]
  keyPhrases: string[];         // Important phrases for therapist prep
  wordCount: number;
  readabilityScore: number;     // Flesch-Kincaid
  growthIndicators: string[];   // Positive markers like "I realized", "I'm grateful", "I've learned"
  concernIndicators: string[];  // Negative markers needing attention
}

// Implementation options:
// Phase 1: OpenAI GPT-4o-mini classification (cheapest, ~$0.001/entry)
// Phase 2: Fine-tuned model on our journal data
// Phase 3: On-device model for privacy-sensitive users
```

#### AI Journal Prompts
- System generates personalized daily prompts based on:
  - Current mood trend (if declining: "What's one small thing that brought you comfort today?")
  - Therapy homework (if therapist assigned a prompt)
  - Seasonal/cultural events
  - User's goals (from onboarding profile)
  - Random from curated wellness prompt library (200+ prompts)

#### Therapist-Visible Entries
- User can opt to share specific entries with their therapist
- Shared entries appear in therapist's session prep view
- Therapist can see sentiment trends but NOT raw text unless shared
- Privacy toggle per entry: "Share with my therapist"

---

## 2.4 Meditation System — Deep Specification

### Current State
- ✅ Working logging API
- ❌ No actual meditation player
- ❌ No guided content
- ❌ No personalization

### Target State

#### Meditation Content Library
```typescript
interface MeditationTrack {
  id: string;
  title: string;               // "Morning Calm"
  description: string;
  type: "guided" | "unguided" | "breathing" | "body-scan" | "loving-kindness" | "sleep" | "focus" | "anxiety-relief";
  duration: number;            // seconds
  audioUrl: string;            // R2/S3 URL
  thumbnailUrl: string;
  instructor: string;          // Name of voice/creator
  language: string;            // "en" | "hi" | "mr" etc.
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];              // ["morning", "anxiety", "sleep"]
  plays: number;
  avgRating: number;
  
  // AI Recommendation scoring inputs
  bestFor: string[];           // ["anxiety", "insomnia", "stress"]
  timeOfDay: string[];         // ["morning", "evening"]
  moodRange: [number, number]; // Recommended when mood is in this range
}
```

#### Meditation Recommendation Algorithm
```
Input:
  - User's current mood (last entry or predicted)
  - Time of day
  - Day of week
  - Previous meditation history (what types, what durations)
  - Completion rates by type
  - User's struggles (from onboarding profile)
  - Session scheduled today? (pre-session calm meditation)

Scoring each track:
  relevance_score = 
    mood_match(track.bestFor, user.currentMood) * 0.30 +
    time_match(track.timeOfDay, now) * 0.20 +
    history_affinity(track.type, user.meditationHistory) * 0.20 +
    completion_rate(track.type, user) * 0.15 +
    novelty(track, user.recentTracks) * 0.15

// Surface top 3 recommendations + "Explore more" 
```

#### Breathing Exercise Engine (No Audio Required)
```typescript
interface BreathingPattern {
  name: string;              // "4-7-8 Relaxation"
  description: string;
  phases: {
    action: "inhale" | "hold" | "exhale";
    duration: number;        // seconds
    instruction: string;     // "Breathe in slowly..."
  }[];
  cycles: number;            // How many repetitions
  totalDuration: number;     // Total seconds
  bestFor: string[];
}

// Built-in patterns (no content licensing needed):
const PATTERNS = [
  { name: "Box Breathing",     phases: [4,4,4,4], bestFor: ["anxiety","focus"] },
  { name: "4-7-8 Relaxation",  phases: [4,7,8],   bestFor: ["sleep","calm"] },
  { name: "Belly Breathing",   phases: [4,0,6],   bestFor: ["panic","stress"] },
  { name: "Energizing Breath", phases: [1,0,1],   bestFor: ["energy","morning"] },
  { name: "Equal Breathing",   phases: [4,0,4],   bestFor: ["balance","beginners"] },
];
```

---

## 2.5 Constellation Feature — Deep Specification

### Current State
- Frontend page exists with Three.js visualization
- Uses dev mock data
- No backend endpoints
- Visually impressive but non-functional

### Target State — Relationships/Connections Visualization

#### Connection Model
```prisma
model Connection {
  id            String   @id @default(uuid())
  requesterId   String
  targetId      String
  type          ConnectionType @default(PLATONIC)
  status        ConnectionStatus @default(PENDING)
  
  compatibility Float?   // AI-calculated compatibility score 0-100
  
  requester     User     @relation("ConnectionsInitiated", fields: [requesterId], references: [id])
  target        User     @relation("ConnectionsReceived", fields: [targetId], references: [id])
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([requesterId, targetId])
  @@index([requesterId])
  @@index([targetId])
}

enum ConnectionType {
  PLATONIC
  PROFESSIONAL
  SUPPORT_BUDDY
}

enum ConnectionStatus {
  PENDING
  ACCEPTED
  BLOCKED
  DECLINED
}
```

#### Compatibility Algorithm (Constellation Matching)
```
For each potential connection pair (A, B):

compatibility_score = weighted_sum({
  struggle_overlap:     weight=0.25,  // Jaccard(A.struggles, B.struggles) * 100
  goal_overlap:         weight=0.20,  // Jaccard(A.goals, B.goals) * 100
  interest_overlap:     weight=0.15,  // Jaccard(A.interests, B.interests) * 100
  language_match:       weight=0.10,  // Any shared language? 100 : 0
  location_proximity:   weight=0.10,  // Same city=100, same state=70, same country=40, else=20
  age_bracket:          weight=0.05,  // Same decade=100, adjacent=70, else=40
  activity_similarity:  weight=0.15,  // Cosine similarity of usage patterns vector
})

// Privacy: Only connect users who opt-in to constellation feature
// Safety: Block connection between user and their therapist
// Anti-abuse: Rate limit connection requests (10/day)
```

---

## 2.6 Confessional — Deep Specification

### Current State
- Works as anonymous journal with "Confessional" title filter
- Stores via journal API

### Target State
- Dedicated model (not overloading journal)
- Anonymous community wall option (opt-in)
- AI-moderated for safety
- Auto-expiring entries option (24h/48h/7d/permanent)
- Voice-to-text option

---

## 2.7 Sessions Page — Deep Specification

### Current State
- Hardcoded heroSession data
- Fake upcoming/past sessions
- No real booking flow

### Target Full Booking Flow
```
1. User clicks "Book Session"
2. Browse therapists (filtered by: specialization, language, approach, gender pref, price range, availability)
3. View therapist profile (bio, qualifications, rating, reviews, availability calendar)
4. Select time slot from therapist's availability
5. Confirm booking → Razorpay payment
6. Payment success → Session created (status: SCHEDULED)
7. Email confirmation sent to both parties
8. 24h before: Reminder notification
9. 15min before: "Join Session" button becomes active
10. Session: Join 100ms video room
11. During session: AI monitors for crisis keywords (optional, consent-based)
12. After session: Therapist writes notes, user rates & provides feedback
13. If cancelled: Cancellation policy enforcement (>24h = full refund, <24h = 50%, <2h = no refund)
```

---

# Part 3: Therapist System — Matching, Sessions, Revenue

## 3.1 Therapist-User Matching Algorithm

This is the CORE algorithm that determines business success.

```typescript
interface MatchScore {
  therapistId: string;
  totalScore: number;           // 0-100
  breakdown: {
    specialization: number;     // How well therapist specializations match user struggles
    language: number;           // Language compatibility
    genderPref: number;         // Does therapist match user's gender preference
    approach: number;           // CBT/Holistic/Mixed match
    availability: number;       // Has slots in user's preferred times
    price: number;              // Within user's budget range
    rating: number;             // Therapist's platform rating
    experience: number;         // Years of experience relevance
    successRate: number;        // % of sessions rated 4+/5 by similar users
    proximity: number;          // Same timezone/city (for potential in-person)
  };
  compatibility_reason: string;  // AI-generated: "Dr. Singh specializes in anxiety relief with CBT, matches your preferred approach and speaks Hindi"
}

function calculateMatchScore(user: UserProfile, therapist: TherapistProfile): MatchScore {
  const breakdown = {
    specialization: jaccardSimilarity(user.struggles, therapist.specializations) * 100,  // weight: 0.25
    language:       hasCommonElement(user.therapistLanguages, therapist.languages) ? 100 : 20,  // weight: 0.15
    genderPref:     matchesGenderPref(user.therapistGenderPref, therapist) ? 100 : 50,  // weight: 0.10
    approach:       user.therapistApproach === therapist.approach ? 100 : 60,  // weight: 0.10
    availability:   computeAvailabilityOverlap(user.preferredTimes, therapist.availabilities),  // weight: 0.10
    price:          priceInBudget(therapist.pricePerSession, user.budgetRange) ? 100 : inversePricePenalty(),  // weight: 0.10
    rating:         normalize(therapist.rating, 0, 5) * 100,  // weight: 0.08
    experience:     Math.min(therapist.experience * 10, 100),  // weight: 0.05
    successRate:    getSuccessRateForSimilarUsers(therapist.id, user.struggles),  // weight: 0.05
    proximity:      calculateProximity(user, therapist),  // weight: 0.02
  };
  
  const weights = [0.25, 0.15, 0.10, 0.10, 0.10, 0.10, 0.08, 0.05, 0.05, 0.02];
  const totalScore = Object.values(breakdown).reduce((sum, val, i) => sum + val * weights[i], 0);
  
  return { therapistId: therapist.id, totalScore, breakdown, compatibility_reason: generateReason(breakdown) };
}
```

### Matching Feed (Like Tinder for Therapy)
- Top 5 matches displayed as cards
- Swipe/click to "Book" or "View Profile"
- "Why this match" expandable section showing compatibility breakdown
- Re-match button: "Not seeing the right fit? Adjust preferences"
- A/B test: card-based vs list-based match display

## 3.2 Therapist Dashboard — Complete Specification

### Tab: Overview
| Metric | Calculation | Update Frequency |
|--------|------------|------------------|
| Today's Sessions | `COUNT(sessions WHERE therapistId=me AND date=today AND status IN (SCHEDULED, IN_PROGRESS))` | Real-time |
| Weekly Revenue | `SUM(payments.amount WHERE therapistId sessions AND createdAt IN thisWeek)` | Daily |
| Average Rating | `AVG(sessions.userRating WHERE therapistId=me AND userRating IS NOT NULL)` | After each rating |
| Client Satisfaction | `COUNT(sessions WHERE rating>=4) / COUNT(sessions WHERE rated) * 100` | Weekly |
| Active Clients | `COUNT(DISTINCT userId FROM sessions WHERE therapistId=me AND status=COMPLETED AND createdAt > 30 days ago)` | Daily |
| Session Completion Rate | `COUNT(COMPLETED) / COUNT(SCHEDULED + COMPLETED + CANCELLED + NO_SHOW) * 100` | Weekly |
| Response Time | `AVG(time between session request and therapist confirmation)` | Per session |
| Cancellation Rate | `COUNT(CANCELLED WHERE cancelledBy=therapist) / COUNT(total) * 100` | Monthly |

### Tab: Today's Sessions
- Timeline view of today's schedule (8AM-10PM)
- Each session card shows:
  - Client name + avatar
  - Session time + duration
  - Session number with this client (e.g., "Session #4")
  - Client's recent mood trend (sparkline from last 5 mood entries)
  - "Prep Notes" — previous session notes + client's shared journal entries
  - "Join Video" button (active 15 min before)
  - "Client Profile Quick View" — struggles, goals, therapy history

### Tab: My Clients
- List of all clients with:
  - Total sessions together
  - Average session rating
  - Last session date
  - Mood trend (improving/declining/stable icon)
  - Next scheduled session
  - "View Full History" — all session notes, ratings, progress
- Client Progress Report (auto-generated):
  ```
  Client has completed {n} sessions over {weeks} weeks.
  Mood trend: {improving/declining/stable} (avg {before} → {after})
  Top discussion topics: {extracted from notes}
  Goals progress: {mapped to onboarding goals}
  Recommended next steps: {AI-generated based on session history}
  ```

### Tab: Manage Availability
- Weekly calendar view (Mon-Sun, 8AM-10PM)
- Drag to create availability slots
- Set recurring patterns (e.g., "Every Tuesday 2PM-6PM")
- Block dates (vacation, holidays)
- Set max sessions per day
- Buffer time between sessions (configurable, default 10min)
- Bulk actions: "Copy this week's schedule to next 4 weeks"

### Tab: Revenue & Payouts
| Data Point | Source |
|-----------|--------|
| Total Earned (All Time) | `SUM(payments WHERE therapist's sessions)` |
| This Month | `SUM(payments WHERE thisMonth)` |
| Pending Payout | `SUM(captured payments not yet transferred)` |
| Payout History | List with date, amount, status, bank ref |
| Platform Commission | 15% default (configurable per therapist tier) |
| Tax Summary | Downloadable monthly/yearly statement |
| Revenue Chart | Monthly bar chart, 12-month view |

### Tab: Reviews
- All reviews with rating, date, anonymous client feedback
- Response capability (therapist can reply to reviews publicly)
- Average across categories: "Empathy", "Expertise", "Punctuality", "Communication"
- Flagged reviews (potential fake/abusive) — admin moderation

---

## 3.3 Session Lifecycle — State Machine

```
                                    ┌── CANCELLED (by user, >24h before)
                                    │       → Full refund
REQUESTED → CONFIRMED → SCHEDULED ──┤── CANCELLED (by user, <24h)
    ↓           ↓                   │       → 50% refund
 REJECTED   (payment                │── CANCELLED (by therapist)
            captured)               │       → Full refund + priority rebook
                                    │── NO_SHOW (AI detects after 10min)
                                    │       → Partial refund to user / flag therapist
                                    └── IN_PROGRESS → COMPLETED
                                                         ↓
                                                   (therapist writes notes)
                                                   (user rates + feedback)
                                                   (AI generates summary)
```

---

# Part 4: Astrologer System — Full Specification

## 4.1 Missing Prisma Models (Must Add)

```prisma
model AstrologerProfile {
  id                String   @id @default(uuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Professional
  specializations   String[] // ["vedic","western","chinese","numerology","tarot","palmistry"]
  systems           String[] // ["vedic","kp","nadi","western-tropical","western-sidereal"]
  languages         String[]
  experience        Int
  bio               String
  photoUrl          String?
  qualifications    String[]
  
  // Pricing
  pricePerSession   Int      // INR
  pricePer Question Int      // For text-based consultations
  currency          String   @default("INR")
  
  // Ratings
  rating            Float    @default(0)
  totalReviews      Int      @default(0)
  totalConsultations Int     @default(0)
  predictionAccuracy Float?  // Community-voted accuracy %
  
  isVerified        Boolean  @default(false)
  isAvailable       Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  charts            BirthChart[]
  predictions       Prediction[]
  consultations     AstroConsultation[]
  
  @@index([isVerified, isAvailable])
  @@index([rating])
}

model BirthChart {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  astrologerId    String?
  astrologer      AstrologerProfile? @relation(fields: [astrologerId], references: [id])
  
  // Input data
  dateOfBirth     DateTime
  timeOfBirth     String   // "14:30" (24hr)
  placeOfBirth    String
  latitude        Float
  longitude       Float
  timezone        String   // "Asia/Kolkata"
  
  // Calculated data (cached)
  chartData       Json     // Full planetary positions, houses, aspects
  ascendant       String   // Rising sign
  moonSign        String
  sunSign         String
  nakshatra       String   // Birth star
  dashaPeriod     Json     // Current Vimshottari Dasha period
  
  chartType       String   // "natal" | "transit" | "synastry" | "composite"
  system          String   // "vedic" | "western" | "kp"
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
}

model Prediction {
  id              String   @id @default(uuid())
  astrologerId    String
  astrologer      AstrologerProfile @relation(fields: [astrologerId], references: [id])
  userId          String?  // If for specific user
  
  type            String   // "daily" | "weekly" | "monthly" | "yearly" | "transit" | "custom"
  zodiacSign      String?  // If generic horoscope
  category        String   // "career" | "love" | "health" | "finance" | "spiritual" | "general"
  
  title           String
  content         String
  validFrom       DateTime
  validTo         DateTime
  
  // Accuracy tracking
  accuracyVotes   Int      @default(0)
  accurateVotes   Int      @default(0)
  inaccurateVotes Int      @default(0)
  
  isPublished     Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  
  @@index([zodiacSign, type, validFrom])
  @@index([astrologerId])
}

model AstroConsultation {
  id              String   @id @default(uuid())
  userId          String
  astrologerId    String
  astrologer      AstrologerProfile @relation(fields: [astrologerId], references: [id])
  
  type            String   // "video" | "chat" | "text-question"
  question        String?  // For text-based
  answer          String?  // Astrologer's response
  
  scheduledAt     DateTime?
  duration        Int?     // minutes
  status          SessionStatus @default(SCHEDULED)
  
  // Payment
  amount          Int
  paymentId       String?
  
  // Rating
  rating          Int?
  feedback        String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([astrologerId])
}
```

## 4.2 Astrologer Dashboard Specification

### Tab: Overview Metrics
- Today's Consultations count
- This Week's Revenue
- Prediction Accuracy Score (community votes)
- Active Client Count
- Pending Questions (text consultations)

### Tab: Birth Chart Generator
- Input: Date, time, place of birth
- Compute: Planetary positions using Swiss Ephemeris (swe-wasm npm package for browser)
- Display: SVG birth chart wheel (D3.js or custom canvas)
- Interpretations: AI-generated based on planetary positions + astrologer can add manual notes
- Export: PDF report generation

### Tab: Predictions
- Write daily/weekly/monthly horoscopes
- Per-zodiac or per-user predictions
- Accuracy tracking with community voting
- AI-assisted writing: "Generate prediction for Aries, career, this week" → astrologer edits

### Tab: Consultations
- Chat-based consultations (real-time messaging)
- Video consultations (100ms integration, same as therapy)
- Text question & answer (async, 24h response SLA)

### Tab: Revenue
- Same structure as therapist revenue
- Commission structure: 20% platform fee (astrologers), 15% (therapists)

## 4.3 User-Facing Astrology Features

### Daily Horoscope
- Auto-generated content per zodiac using AI + astrologer oversight
- Personalized based on user's actual birth chart (if data provided)
- Push notification: "Your daily cosmic insight is ready ✨"

### Birth Chart Analysis
- Free: Basic sun/moon/rising signs
- Premium: Full birth chart with house analysis, aspect interpretation, Dasha predictions
- Shareable: User can share birth chart as image/link

### Compatibility Matching (Kundli Milan)
- Input: Two users' birth data
- Algorithm: Ashtakoot Milan (36-point system for Vedic compatibility)
- Display: Score out of 36, breakdown by each Koot
- Use case: Romantic compatibility check (optional, opt-in)

### Transit Alerts
- When significant planetary transits affect user's chart
- Push notification: "Jupiter enters your 7th house today — significant for relationships"
- Algorithm: Compare current planetary positions against natal chart aspects

---

# Part 5: Admin Panel — God-Mode Dashboard

## 5.1 Admin Dashboard Structure

The admin routes already define 100+ endpoints. Here's the COMPLETE metrics and algorithms specification:

### 5.1.1 Head Office Dashboard (Real-time Overview)

```typescript
interface HeadOfficeMetrics {
  // Live Metrics (updated every 60s via WebSocket)
  activeUsers: number;              // Users with session in last 15 min
  activeSessions: number;           // In-progress therapy/astrology sessions
  liveVideoRooms: number;           // Active 100ms rooms
  
  // Daily KPIs
  dailySignups: number;
  dailyActivations: number;         // Completed onboarding
  dailySessionsBooked: number;
  dailyRevenue: number;             // INR
  dailyChurnPredictions: number;    // Users at risk
  
  // Platform Health
  apiLatencyP99: number;            // ms
  errorRate: number;                // % of 5xx responses
  paymentSuccessRate: number;       // %
  videoQualityAvg: number;          // 1-5 quality score from 100ms
  
  // Growth Metrics
  weeklyActiveUsers: number;        // WAU
  monthlyActiveUsers: number;       // MAU
  weekOverWeekGrowth: number;       // %
  netPromoterScore: number;         // -100 to 100
}
```

### 5.1.2 User Analytics Dashboard

```typescript
interface UserAnalytics {
  // Acquisition
  signupsToday: number;
  signupsBySource: { source: string; count: number }[];  // organic, google, referral, social
  activationRate: number;           // % who complete onboarding within 24h
  activationFunnel: {
    step: string;                   // "signup" → "onboarding_start" → "step_1" → ... → "complete"
    count: number;
    dropoffPct: number;
  }[];
  
  // Engagement  
  dauMauRatio: number;              // Stickiness metric (target: >20%)
  avgSessionDuration: number;       // minutes
  avgSessionsPerWeek: number;
  featureAdoption: {
    feature: string;
    usersWhoTried: number;
    pctOfTotal: number;
    retentionAfter7Days: number;   // % who used it again
  }[];
  
  // Retention
  cohortRetention: {
    cohortMonth: string;
    retentionByWeek: number[];     // [100, 72, 58, 45, 38, ...]
  }[];
  day1Retention: number;            // %
  day7Retention: number;
  day30Retention: number;
  
  // Health Outcomes (THE key differentiator)
  avgMoodImprovement: number;       // Average mood score change over 30 days
  usersWith3PlusSessions: number;   // % who booked 3+ therapy sessions
  journalFrequencyDistribution: {
    entriesPerWeek: string;         // "0", "1-2", "3-5", "5+"
    userCount: number;
  }[];
  meditationAdoption: number;       // % of active users who meditated this month
}
```

### 5.1.3 Revenue Analytics

```typescript
interface RevenueAnalytics {
  // Revenue Overview
  mrr: number;                      // Monthly Recurring Revenue
  arr: number;                      // Annual Run Rate
  totalRevenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;                 // % MoM
  };
  
  // Revenue Breakdown
  revenueBySource: {
    source: string;                 // "therapy_sessions" | "astrology_sessions" | "subscriptions" | "courses" | "shop"
    amount: number;
    percentage: number;
  }[];
  
  // Unit Economics
  avgRevenuePerUser: number;        // ARPU
  lifetimeValue: number;            // LTV (calculated from retention curves)
  customerAcquisitionCost: number;  // CAC (if ad spend tracking implemented)
  ltvCacRatio: number;              // Target: >3.0
  
  // Payment Metrics
  paymentSuccessRate: number;
  avgTransactionSize: number;
  refundRate: number;
  chargebackRate: number;
  
  // Therapist/Astrologer Economics
  totalPlatformCommission: number;
  pendingPayouts: number;
  avgTherapistEarning: number;      // Per month
  avgAstrologerEarning: number;
}
```

### 5.1.4 Fraud Detection System

```typescript
interface FraudAlert {
  id: string;
  type: "fake_review" | "payment_fraud" | "identity_fraud" | "session_manipulation" | "referral_abuse" | "multi_account";
  severity: "low" | "medium" | "high" | "critical";
  userId: string;
  details: string;
  evidence: Json;
  status: "pending" | "investigating" | "confirmed" | "dismissed";
  assignedTo: string;       // Admin user ID
  createdAt: DateTime;
}

// Fraud Detection Rules:
// 1. Multiple accounts from same IP/device → "multi_account" HIGH
// 2. Review written within 1 min of session end → "fake_review" MEDIUM
// 3. 3+ payment failures from same card → "payment_fraud" HIGH
// 4. Session ended in <5 min but rated 5/5 → "session_manipulation" MEDIUM
// 5. 10+ referral signups from same IP block → "referral_abuse" HIGH
// 6. Rapid tier changes (free→paid→refund→repeat) → "payment_fraud" MEDIUM
```

### 5.1.5 Employee Tracker

```typescript
interface EmployeeMetrics {
  employeeId: string;
  name: string;
  department: string;
  role: string;
  
  // Activity
  lastActive: DateTime;
  actionsThisWeek: number;
  avgResponseTime: number;          // Minutes to respond to assigned tasks
  
  // Performance
  ticketsResolved: number;
  customerSatisfaction: number;     // CSAT from interactions
  
  // Target tracking
  targets: {
    metric: string;
    target: number;
    actual: number;
    percentAchieved: number;
  }[];
}
```

### 5.1.6 Therapist Quality Assurance

```typescript
interface TherapistQA {
  therapistId: string;
  name: string;
  
  // Quality Scores
  overallRating: number;            // 0-5
  sessionCompletionRate: number;    // %
  clientRetentionRate: number;      // % of clients who book 2nd session
  avgSessionDuration: number;       // Should be near 50min
  onTimeRate: number;               // % of sessions started within 5min of scheduled
  
  // Alerts
  complaints: number;               // Open complaints against this therapist
  flaggedSessions: number;          // Sessions flagged by AI monitoring
  lastAuditDate: DateTime;          // Last quality review by admin
  
  // Client Outcomes
  avgClientMoodImprovement: number; // Avg mood change of their clients
  clientsWithPositiveOutcome: number; // % of clients whose metrics improved
  
  // Compliance
  notesSubmittedRate: number;       // % of sessions with therapist notes
  lateNoteSubmissions: number;      // Notes submitted >24h after session
  
  qualityTier: "gold" | "silver" | "bronze" | "probation";
}
```

### 5.1.7 AI Monitoring Dashboard

```typescript
interface AIMonitoring {
  // Chat Stats
  totalChatsToday: number;
  avgChatDuration: number;
  avgMessagesPerChat: number;
  userSatisfactionRate: number;     // % who rated chat helpful
  
  // Safety
  crisisDetections: {
    id: string;
    userId: string;
    severity: "low" | "medium" | "high" | "critical";
    triggerKeywords: string[];
    aiConfidence: number;
    humanReviewed: boolean;
    outcome: string;
    timestamp: DateTime;
  }[];
  
  // Performance
  avgResponseLatency: number;       // ms
  tokensUsedToday: number;
  costToday: number;                // USD
  errorRate: number;                // % of failed completions
  
  // Model Quality
  hallucinations: number;           // Flagged by users or review
  inappropriateResponses: number;   // Flagged by content filter
  topicsDistribution: { topic: string; count: number }[];
}
```

### 5.1.8 Complete Admin Action Matrix

| Section | View | Actions | Export |
|---------|------|---------|--------|
| Users | List, search, filter by role/status/date | Suspend, unsuspend, change role, verify, delete, impersonate | CSV, JSON |
| Therapists | List with quality metrics | Verify, suspend, set commission, assign quality tier, approve credentials | CSV |
| Astrologers | List with accuracy metrics | Verify, suspend, set commission, review predictions | CSV |
| Sessions | List all sessions | View recording, read notes, flag, refund | CSV |
| Payments | Transaction list | Refund, investigate, export | CSV, bank format |
| Blog | Pending posts | Approve, reject, edit, publish, schedule | N/A |
| Courses | Course list + enrollments | Approve, reject, feature, set pricing | CSV |
| Community | Reported content | Remove, warn user, ban, approve | N/A |
| Events | Event calendar | Create, edit, cancel, send notifications | iCal |
| Shop | Products + orders | Add/edit product, process order, manage inventory | CSV |
| Complaints | Queue | Assign, investigate, resolve, escalate | CSV |
| Fraud | Alert queue | Dismiss, confirm, ban user, freeze payment | CSV |
| Hiring | Applications | Review, schedule interview, reject, hire | CSV |
| Corporate | B2B accounts | Create, manage employees, generate reports | PDF |
| NGO | Partners + impact | Add partner, update metrics, generate impact report | PDF |
| Settings | Platform config | Feature flags, commission rates, pricing, maintenance mode | N/A |
| Broadcast | N/A | Send notification to all/segment, send email blast | N/A |
| Audit Trail | Activity log | Filter, search, export | CSV, JSON |

---

# Part 6: AI Systems — Algorithms & Models

## 6.1 SoulBot — AI Wellness Chat

### Architecture
```
User Message → Content Safety Filter → Intent Classifier → 
  → [Crisis Detector] → If crisis: Emergency Protocol
  → [Wellness Chat] → GPT-4o-mini with wellness system prompt
  → [Session Recommender] → If user seems to need therapist: Suggest booking
  → Response → Sentiment Logger → Display to user
```

### System Prompt Template
```
You are SoulBot, a compassionate AI wellness companion for Soul Yatri.

Context about this user:
- Name: {name}
- Recent mood trend: {moodTrend}
- Current wellness score: {wellnessScore}
- Active struggles: {struggles}
- Therapy sessions this month: {sessionCount}
- Last journal sentiment: {lastJournalSentiment}

Guidelines:
1. Be warm, empathetic, non-judgmental
2. Use active listening techniques
3. Never diagnose or prescribe medication
4. If user expresses crisis indicators, IMMEDIATELY trigger crisis protocol
5. Suggest journaling, meditation, or breathing exercises when appropriate
6. Recommend booking a therapy session when issues are beyond AI scope
7. Remember conversation context within this session
8. Use the user's preferred language if they switch
9. Reference their actual data: "I noticed your mood has been lower this week..."

Crisis keywords that trigger emergency protocol:
[suicide, kill myself, end it, don't want to live, self-harm, cutting, overdose, 
 no point in living, better off dead, can't take it anymore, want to die]

When detected:
- Acknowledge their pain
- Share helpline: iCall (9152987821), AASRA (9820466726), Vandrevala Foundation (9999666555)
- Offer to connect them with their therapist
- NEVER try to be their therapist
```

### Crisis Detection Algorithm
```typescript
interface CrisisAssessment {
  severity: "none" | "low" | "medium" | "high" | "critical";
  confidence: number;          // 0-1
  triggerType: "keyword" | "sentiment" | "pattern" | "explicit";
  triggers: string[];
  recommendedAction: "continue" | "suggest_therapist" | "show_helpline" | "alert_admin" | "emergency_contact";
}

function assessCrisis(message: string, conversationHistory: Message[], userContext: UserContext): CrisisAssessment {
  // Layer 1: Keyword match (fast, high-recall)
  const keywordHits = CRISIS_KEYWORDS.filter(kw => message.toLowerCase().includes(kw));
  
  // Layer 2: Sentiment analysis (moderate speed, moderate precision)
  const sentiment = analyzeSentiment(message);
  
  // Layer 3: Contextual analysis (slower, highest precision)
  // - Is this a pattern? (3+ negative messages in sequence)
  // - Is mood score declining and now combined with hopeless language?
  // - Has user cancelled recent sessions? (withdrawal pattern)
  
  // Layer 4: LLM classification (most accurate for nuanced cases)
  // - "Is this user expressing genuine suicidal ideation or using hyperbole?"
  // - Confidence threshold: Only flag if >0.7 confidence
  
  // Scoring:
  // Critical: Explicit suicide mention → ALWAYS flag
  // High: Strong negative sentiment + crisis keywords + declining mood pattern
  // Medium: Moderate negative sentiment + some concerning language
  // Low: Slightly concerning but may be venting
  
  return assessment;
}
```

### Voice Input (Future Phase)
- `POST /ai/voice` endpoint exists as stub
- Implementation: Speech-to-Text (Whisper API or Google STT)
- Use case: Users who prefer speaking over typing
- Accessibility: Critical for users with typing difficulties

## 6.2 AI Session Monitor (During Therapy)

### Purpose
Real-time AI assistant that helps therapists during live sessions (with full consent from both parties).

### What It Does
1. **Live Transcription**: Real-time speech-to-text of session
2. **Key Moment Detection**: Flags important moments for therapist to revisit
3. **Sentiment Tracking**: Real-time sentiment graph of client's emotional state
4. **Crisis Monitoring**: Detects crisis language in real-time → alerts therapist
5. **Session Summary**: Auto-generates session notes post-session
6. **Homework Suggestions**: Based on session content, suggests activities

### Routes (Already Stubbed)
- `POST /ai/session-monitor/start` — Begin monitoring session
- `POST /ai/session-monitor/frame` — Process video frame (emotion detection)
- `POST /ai/session-monitor/audio` — Process audio chunk (transcription + sentiment)
- `GET /ai/session-monitor/:sessionId/client` — Client-side view
- `GET /ai/session-monitor/:sessionId/therapist` — Therapist-side view (includes notes)

### Privacy Controls
- Both client and therapist must consent before session
- Client can turn off monitoring mid-session
- Transcripts are encrypted and auto-deleted after therapist review (configurable: 24h/48h/7d)
- Client never sees raw transcript — only therapist has access
- AI-generated summary shared with client (therapist-approved version only)

## 6.3 AI Pattern Detection

### Route: `GET /ai/patterns/:userId`

```typescript
interface UserPatterns {
  userId: string;
  generatedAt: DateTime;
  patterns: {
    type: "mood" | "behavior" | "engagement" | "risk" | "improvement";
    name: string;           // "Monday Blues Pattern"
    description: string;    // "Your mood consistently drops on Monday mornings..."
    confidence: number;     // 0-1
    dataPoints: number;     // How many data points support this
    firstDetected: DateTime;
    isActive: boolean;      // Still occurring?
    trend: "worsening" | "stable" | "improving";
    recommendation: string; // "Try scheduling a meditation for Monday mornings"
  }[];
  
  // Longitudinal Analysis
  overallTrajectory: "improving" | "stable" | "declining";
  riskScore: number;        // 0-100 (higher = more at risk of churn or crisis)
  engagementScore: number;  // 0-100
  
  // Predictive
  churnProbability: number;     // 0-1 — likelihood of leaving platform in 30 days
  crisisRisk: number;           // 0-1 — likelihood of mental health crisis
  nextSessionRecommended: boolean; // True if AI thinks they should book
}
```

## 6.4 Churn Prediction Model

```
Input Features:
  - Days since last login
  - Sessions per week (trend)
  - Mood entries per week (trend)
  - Journal entries per week (trend)
  - Meditation completions per week (trend)
  - Session cancellations (last 30 days)
  - Payment failures (last 30 days)
  - Feature diversity (how many different features used)
  - Community activity (declining?)
  - Subscription tier
  - Account age
  - Onboarding completion
  - App version (outdated?)

Output:
  - churn_probability: 0.0 to 1.0
  - risk_level: "low" | "medium" | "high" | "critical"
  - recommended_intervention: 
    - "send_personalized_email"
    - "offer_discount"
    - "recommend_new_feature"
    - "therapist_outreach"
    - "none"

Model: Gradient Boosted Trees (XGBoost) → retrain monthly
Threshold: probability > 0.6 → trigger intervention
```

---

# Part 7: Engagement, Retention & Gamification

## 7.1 Streak System

```prisma
model UserStreak {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  type          String   // "mood_logging" | "journal_writing" | "meditation" | "daily_checkin" | "session_attendance"
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  lastActivityDate DateTime?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([userId, type])
}
```

### Streak Logic
```typescript
function updateStreak(userId: string, type: string): void {
  const streak = getStreak(userId, type);
  const today = startOfDay(new Date());
  const lastActivity = startOfDay(streak.lastActivityDate);
  
  if (isSameDay(today, lastActivity)) return; // Already counted today
  
  if (isYesterday(lastActivity, today)) {
    // Continue streak
    streak.currentStreak += 1;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  } else {
    // Streak broken
    streak.currentStreak = 1;
  }
  
  streak.lastActivityDate = today;
  save(streak);
  
  // Check for milestone achievements
  checkAchievements(userId, type, streak.currentStreak);
}
```

## 7.2 Achievement / Badge System

```prisma
model Achievement {
  id              String   @id @default(uuid())
  code            String   @unique  // "MOOD_STREAK_7"
  name            String   // "Mood Master"
  description     String   // "Log your mood for 7 consecutive days"
  iconUrl         String
  category        String   // "wellness" | "social" | "learning" | "milestone"
  rarity          String   // "common" | "rare" | "epic" | "legendary"
  xpReward        Int
  criteria        Json     // { type: "streak", metric: "mood_logging", threshold: 7 }
}

model UserAchievement {
  id              String   @id @default(uuid())
  userId          String
  achievementId   String
  unlockedAt      DateTime @default(now())
  
  user            User        @relation(fields: [userId], references: [id])
  achievement     Achievement @relation(fields: [achievementId], references: [id])
  
  @@unique([userId, achievementId])
}
```

### Achievement Catalog
| Code | Name | Description | Criteria | Rarity | XP |
|------|------|-------------|----------|--------|-----|
| `FIRST_MOOD` | Mood Explorer | Log your first mood entry | mood_count >= 1 | Common | 10 |
| `MOOD_STREAK_7` | Mood Master | 7-day mood logging streak | mood_streak >= 7 | Rare | 50 |
| `MOOD_STREAK_30` | Mood Legend | 30-day mood logging streak | mood_streak >= 30 | Epic | 200 |
| `MOOD_STREAK_100` | Mood Immortal | 100-day streak | mood_streak >= 100 | Legendary | 1000 |
| `FIRST_JOURNAL` | Word Weaver | Write first journal entry | journal_count >= 1 | Common | 10 |
| `JOURNAL_10` | Storyteller | Write 10 journal entries | journal_count >= 10 | Rare | 75 |
| `JOURNAL_50` | Author | 50 journal entries | journal_count >= 50 | Epic | 300 |
| `FIRST_MEDITATION` | Inner Peace Seeker | Complete first meditation | meditation_count >= 1 | Common | 10 |
| `MEDITATION_HOURS_10` | Zen Apprentice | 10 hours total meditation | meditation_hours >= 10 | Rare | 100 |
| `MEDITATION_HOURS_100` | Zen Master | 100 hours meditation | meditation_hours >= 100 | Legendary | 1000 |
| `FIRST_SESSION` | Brave Step | Complete first therapy session | session_count >= 1 | Common | 25 |
| `SESSION_10` | Committed Healer | 10 therapy sessions | session_count >= 10 | Epic | 250 |
| `ONBOARDING` | Journey Begins | Complete full onboarding | onboarding_complete = true | Common | 20 |
| `FIRST_CONNECTION` | Star Bridge | Make first constellation connection | connection_count >= 1 | Rare | 30 |
| `COMMUNITY_HERO` | Community Hero | 50 helpful posts/comments | community_actions >= 50 | Epic | 200 |
| `PERFECT_WEEK` | Perfect Week | Mood + Journal + Meditation every day for a week | all_streaks_7 | Legendary | 500 |

### XP & Level System
```
Level 1:   0 XP      — "New Soul"
Level 2:   100 XP    — "Awakening"
Level 3:   300 XP    — "Seeker"
Level 4:   600 XP    — "Explorer"
Level 5:   1000 XP   — "Warrior"
Level 6:   1500 XP   — "Healer"
Level 7:   2500 XP   — "Sage"
Level 8:   4000 XP   — "Mystic"
Level 9:   6000 XP   — "Enlightened"
Level 10:  10000 XP  — "Transcendent"

XP Sources:
  - Mood logging:      5 XP per entry
  - Journal entry:     10 XP
  - Meditation:        1 XP per minute (capped at 30 XP/day)
  - Therapy session:   25 XP
  - Community post:    5 XP
  - Helpful response:  10 XP
  - Achievement unlock: varies (see table)
  - Streak bonus:      2 XP × streak_day per activity
  - Referral:          50 XP per activated referral
```

## 7.3 Daily Check-In & Wellness Challenges

### Daily Check-In Widget
- Shows every time user opens app (once per day)
- Quick 3-tap check-in:
  1. "How are you feeling?" → Emoji picker (5 options)
  2. "What's on your mind?" → Optional text (max 280 chars)
  3. "Your goal today?" → Choose from personalized suggestions

### Weekly Wellness Challenges
```typescript
interface WellnessChallenge {
  id: string;
  title: string;             // "Mindful Week"
  description: string;
  startDate: DateTime;
  endDate: DateTime;
  tasks: {
    day: number;             // 1-7
    task: string;            // "Log your mood 3 times today"
    type: string;            // "mood" | "journal" | "meditation" | "community"
    target: number;          // 3
    metric: string;          // "mood_entries_count"
  }[];
  reward: string;            // Achievement badge or XP bonus
  participants: number;      // How many users joined
  completionRate: number;    // % who finished
}
```

## 7.4 Referral System

```prisma
model Referral {
  id              String   @id @default(uuid())
  referrerId      String
  referredEmail   String
  referredUserId  String?  // Set when they sign up
  
  status          String   // "pending" | "signed_up" | "activated" | "rewarded"
  referralCode    String   @unique
  
  rewardType      String   // "free_session" | "subscription_discount" | "xp_bonus"
  rewardClaimed   Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  referrer        User     @relation(fields: [referrerId], references: [id])
  
  @@index([referrerId])
  @@index([referralCode])
}
```

### Referral Rewards
- Referrer gets: 50 XP + 1 free therapy session credit (after referral completes first session)
- Referee gets: 20% off first therapy session
- Corporate: Bulk referral codes for employee wellness programs

---

# Part 8: Community, Social & Content Systems

## 8.1 Community Forum

### Existing Routes (All 501 Stubs)
- `GET /community/feed` — Personalized feed
- `GET/POST /community/posts` — Create/list posts
- `GET /community/posts/:id` — Single post
- `POST /community/posts/:id/like` — Like
- `GET/POST /community/posts/:id/comments` — Comments
- `POST /community/posts/:id/report` — Report
- `GET /community/moderation` — Admin moderation queue

### Community Feature Specification

```prisma
model Post {
  id              String   @id @default(uuid())
  authorId        String
  author          User     @relation(fields: [authorId], references: [id])
  
  content         String
  mediaUrls       String[]
  tags            String[]
  category        String   // "support" | "gratitude" | "question" | "story" | "tip" | "motivation"
  
  isAnonymous     Boolean  @default(false)
  
  likes           Int      @default(0)
  commentCount    Int      @default(0)
  reportCount     Int      @default(0)
  
  isModerated     Boolean  @default(false)
  moderatedAt     DateTime?
  moderatedBy     String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  comments        Comment[]
  
  @@index([authorId])
  @@index([category, createdAt])
}

model Comment {
  id              String   @id @default(uuid())
  postId          String
  post            Post     @relation(fields: [postId], references: [id])
  authorId        String
  
  content         String
  isAnonymous     Boolean  @default(false)
  
  likes           Int      @default(0)
  reportCount     Int      @default(0)
  
  createdAt       DateTime @default(now())
  
  @@index([postId, createdAt])
}
```

### Content Moderation Algorithm
```
Every post/comment goes through:
1. Keyword filter (profanity, hate speech, spam URLs)
2. AI moderation (GPT classification: "safe" | "needs_review" | "block")
3. Community reports (3+ reports → auto-queue for admin review)
4. Therapist-verified responses get a "Professional Response" badge

Auto-block triggers:
  - Contains phone numbers or external links (anti-spam)
  - High toxicity score from AI
  - User has >3 blocked posts in last 30 days
  
Community Guidelines:
  - No medical advice (only therapists/astrologers can give professional advice)
  - No personal attacks
  - Trigger warnings required for sensitive topics
  - Anonymous posting allowed but tracked (admin can see identity)
```

### Support Groups
```prisma
model SupportGroup {
  id              String   @id @default(uuid())
  name            String   // "Anxiety Warriors"
  description     String
  Category        String   // "anxiety" | "depression" | "grief" | "addiction" | "relationships"
  
  moderatorId     String   // Therapist or verified moderator
  isPrivate       Boolean  @default(false)
  maxMembers      Int      @default(50)
  memberCount     Int      @default(0)
  
  createdAt       DateTime @default(now())
}
```

---

# Part 9: Payment, Subscription & Monetization

## 9.1 Revenue Streams

| Stream | Model | Price Range (INR) | Commission |
|--------|-------|------------------|------------|
| Therapy Sessions | Per session | ₹500-₹3,000 | 15% |
| Astrology Consultations | Per session / Per question | ₹200-₹2,000 / ₹50-₹200 | 20% |
| Premium Subscription | Monthly/Yearly | ₹299-₹999/mo | 100% (platform) |
| Courses | One-time or included in premium | ₹499-₹4,999 | 30% |
| Wellness Shop | Product price | ₹199-₹9,999 | 35% |
| Corporate Wellness | Per employee/mo | ₹199-₹999/employee | 100% |
| Events/Workshops | Ticket price | ₹99-₹2,999 | 20% |

## 9.2 Subscription Tiers

```prisma
model SubscriptionTier {
  id              String   @id @default(uuid())
  name            String   // "Free" | "Soul" | "Soul+" | "Soul Pro"
  price           Int      // Monthly price in INR (0 for free)
  yearlyPrice     Int      // Annual price (discount)
  
  features        Json     // Feature flags included
  
  maxSessionDiscount    Int      // % discount on therapy sessions
  maxAstroDiscount      Int
  communityAccess       Boolean
  aiChatMessages        Int      // Per day limit (-1 = unlimited)
  meditationLibrary     String   // "basic" | "full"
  courseDiscount         Int
  
  isActive        Boolean  @default(true)
  
  createdAt       DateTime @default(now())
}
```

### Tier Matrix
| Feature | Free | Soul (₹299/mo) | Soul+ (₹599/mo) | Soul Pro (₹999/mo) |
|---------|------|-----------------|------------------|---------------------|
| Mood Tracking | ✅ | ✅ | ✅ | ✅ |
| Journal | ✅ (5/mo) | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| Meditation | Basic (5 tracks) | Full library | Full library | Full + exclusive |
| AI Chat | 5 msgs/day | 50 msgs/day | Unlimited | Unlimited + priority |
| Community | Read only | Full access | Full + private groups | Full + verified badge |
| Therapy Discount | 0% | 5% | 10% | 15% |
| Astrology | Basic horoscope | Full chart | Full chart + transits | VIP astrologer access |
| Birth Chart | Basic | Detailed | Detailed + compatibility | Full suite |
| Course Discount | 0% | 10% | 20% | 30% + early access |
| Constellation | View only | Connect (5/mo) | Connect (20/mo) | Unlimited |
| Support | Community | Email | Priority email | Dedicated + phone |
| Ads | Yes (subtle) | No | No | No |
| Export Data | Basic | Full | Full | Full + analytics |

## 9.3 Detailed Payment Flow

```
1. User selects service (session/subscription/course/product)
2. Frontend: POST /payments/create { type, amount, currency, metadata }
3. Backend: Create Razorpay order → return orderId
4. Frontend: Open Razorpay checkout modal
5. User completes payment in Razorpay
6. Razorpay redirects with paymentId + signature
7. Frontend: POST /payments/verify { orderId, paymentId, signature }
8. Backend: Verify signature using Razorpay SDK
9. Backend: Update Payment record → CAPTURED
10. Backend: Trigger post-payment actions:
    - Session: Create/confirm session, send confirmations
    - Subscription: Activate tier, update user record
    - Course: Grant enrollment
    - Shop: Create order, trigger fulfillment
11. Backend: Send receipt email
12. Razorpay webhook (async): POST /payments/webhook
    - Handles delayed events, refunds, failures
```

---

# Part 10: E-Commerce / Wellness Shop

## 10.1 Product System

```prisma
model Product {
  id              String   @id @default(uuid())
  name            String
  slug            String   @unique
  description     String
  shortDescription String
  
  price           Int      // INR paise
  salePrice       Int?     // Discounted price
  currency        String   @default("INR")
  
  category        String   // "books" | "crystals" | "essential_oils" | "meditation_tools" | "journals" | "wellness_kits"
  tags            String[]
  images          String[] // URLs
  
  stock           Int      @default(0)
  sku             String   @unique
  weight          Float?   // grams (for shipping calc)
  
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  
  avgRating       Float    @default(0)
  reviewCount     Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  reviews         ProductReview[]
  orderItems      OrderItem[]
}

model Order {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  status          String   // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded"
  
  subtotal        Int
  shippingCost    Int
  tax             Int
  total           Int
  
  // Shipping
  shippingAddress Json
  trackingNumber  String?
  trackingUrl     String?
  
  // Payment
  paymentId       String
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  items           OrderItem[]
}

model OrderItem {
  id              String   @id @default(uuid())
  orderId         String
  order           Order    @relation(fields: [orderId], references: [id])
  productId       String
  product         Product  @relation(fields: [productId], references: [id])
  
  quantity        Int
  priceAtPurchase Int
  
  @@index([orderId])
}

model Cart {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  items           Json     // [{productId, quantity}]
  
  updatedAt       DateTime @updatedAt
}

model ProductReview {
  id              String   @id @default(uuid())
  productId       String
  product         Product  @relation(fields: [productId], references: [id])
  userId          String
  
  rating          Int      // 1-5
  title           String?
  body            String?
  isVerifiedPurchase Boolean @default(false)
  
  createdAt       DateTime @default(now())
  
  @@index([productId])
  @@unique([productId, userId])
}
```

## 10.2 Product Recommendation Algorithm
```
For each user, recommend products based on:
1. Purchase history (collaborative filtering)
2. Browsed products (content-based)
3. User's struggles/goals (semantic match: "anxiety" → lavender essential oil, anxiety workbook)
4. Therapist recommendations (therapist can recommend products to clients)
5. Popular in their demographic (age, location)
6. Seasonal trends (meditation blankets in winter)
```

---

# Part 11: Corporate & Institutional Wellness

## 11.1 B2B Model

```prisma
model CorporateAccount {
  id              String   @id @default(uuid())
  companyName     String
  contactName     String
  contactEmail    String
  
  plan            String   // "starter" | "growth" | "enterprise"
  employeeCount   Int
  pricePerEmployee Int     // INR per month
  
  // Features
  therapySessionsPerEmployee  Int     // Per month
  astroSessionsPerEmployee    Int
  
  isActive        Boolean  @default(true)
  contractStart   DateTime
  contractEnd     DateTime
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  employees       CorporateEmployee[]
}

model CorporateEmployee {
  id              String   @id @default(uuid())
  accountId       String
  account         CorporateAccount @relation(fields: [accountId], references: [id])
  userId          String?  // Linked Soul Yatri user
  
  employeeEmail   String
  department      String?
  
  sessionsUsed    Int      @default(0)
  isActive        Boolean  @default(true)
  
  createdAt       DateTime @default(now())
}
```

### Corporate Dashboard (Company Admin View)
- Aggregate employee wellness metrics (anonymized)
- Department-wise wellness scores
- Session utilization rate
- ROI metrics: "23% reduction in sick days since program started"
- Monthly reports exportable as PDF

### Corporate Pricing
| Plan | Price/Employee/Mo | Sessions/Employee | Features |
|------|------------------|-------------------|----------|
| Starter | ₹199 | 2 therapy | Mood + Journal + Meditation + AI Chat |
| Growth | ₹499 | 4 therapy + 2 astro | All features + Analytics dashboard |
| Enterprise | ₹999 | Unlimited | All + dedicated account manager + custom workshops |

---

# Part 12: NGO & Social Impact Module

## 12.1 Specification

```prisma
model NGOPartner {
  id              String   @id @default(uuid())
  name            String
  contactEmail    String
  website         String?
  focus           String   // "mental_health" | "women" | "youth" | "addiction" | "rural"
  
  beneficiaryCount Int     @default(0)
  activeSince     DateTime
  
  // Impact tracking
  sessionsProvided Int     @default(0)
  avgBeneficiaryImprovement Float? // Mood improvement average
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Impact Metrics Dashboard
- Total beneficiaries reached
- Sessions provided (pro-bono)
- Improvement metrics (anonymized)
- Partner-wise breakdown
- Downloadable impact report for grant applications

---

# Part 13: Events & Workshops System

## 13.1 Specification

```prisma
model Event {
  id              String   @id @default(uuid())
  title           String
  slug            String   @unique
  description     String
  
  type            String   // "workshop" | "webinar" | "retreat" | "group_session" | "meditation_circle"
  format          String   // "online" | "in_person" | "hybrid"
  
  hostId          String   // Therapist/Astrologer/Admin who hosts
  
  startDate       DateTime
  endDate         DateTime
  timezone        String   @default("Asia/Kolkata")
  
  maxAttendees    Int
  currentAttendees Int     @default(0)
  
  price           Int      // 0 for free events
  currency        String   @default("INR")
  
  // Location (for in-person)
  venue           String?
  address         String?
  city            String?
  
  // Online
  meetingUrl      String?  // 100ms room or Zoom link
  
  imageUrl        String?
  
  isPublished     Boolean  @default(false)
  isFeatured      Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  registrations   EventRegistration[]
}

model EventRegistration {
  id              String   @id @default(uuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id])
  userId          String
  
  status          String   // "registered" | "attended" | "no_show" | "cancelled"
  paymentId       String?
  
  feedback        String?
  rating          Int?
  
  createdAt       DateTime @default(now())
  
  @@unique([eventId, userId])
}
```

---

# Part 14: Blog & Content CMS

## 14.1 Specification

```prisma
model BlogPost {
  id              String   @id @default(uuid())
  authorId        String
  author          User     @relation(fields: [authorId], references: [id])
  
  title           String
  slug            String   @unique
  excerpt         String
  content         String   // HTML or Markdown
  
  coverImage      String?
  tags            String[]
  category        String   // "mental_health" | "wellness" | "astrology" | "meditation" | "relationships" | "self_care"
  
  // SEO
  metaTitle       String?
  metaDescription String?
  canonicalUrl    String?
  
  // Status
  status          String   // "draft" | "pending_review" | "published" | "archived"
  publishedAt     DateTime?
  
  // Engagement
  views           Int      @default(0)
  likes           Int      @default(0)
  shareCount      Int      @default(0)
  
  // Reading
  readTimeMinutes Int
  
  isEditorPick    Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Content Strategy
- AI-assisted writing: Author writes draft → AI suggests improvements, SEO optimizations
- Auto-generate meta tags from content
- Related articles algorithm (TF-IDF similarity)
- Popular articles sidebar
- Author profiles with published count

---

# Part 15: Courses & Learning Platform

## 15.1 Specification

```prisma
model Course {
  id              String   @id @default(uuid())
  instructorId    String
  instructor      User     @relation(fields: [instructorId], references: [id])
  
  title           String
  slug            String   @unique
  description     String
  shortDescription String
  
  coverImage      String?
  previewVideoUrl String?
  
  category        String   // "meditation" | "cbt_techniques" | "stress_management" | "yoga" | "journaling" | "astrology_basics"
  level           String   // "beginner" | "intermediate" | "advanced"
  language        String   @default("english")
  
  price           Int      // 0 for free
  currency        String   @default("INR")
  
  // Structure
  totalModules    Int
  totalDuration   Int      // minutes
  
  // Engagement
  enrollmentCount Int      @default(0)
  avgRating       Float    @default(0)
  reviewCount     Int      @default(0)
  completionRate  Float    @default(0)
  
  status          String   // "draft" | "pending_review" | "published" | "archived"
  publishedAt     DateTime?
  
  isFeatured      Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  modules         CourseModule[]
  enrollments     Enrollment[]
}

model CourseModule {
  id              String   @id @default(uuid())
  courseId         String
  course          Course   @relation(fields: [courseId], references: [id])
  
  title           String
  description     String
  orderIndex      Int
  
  type            String   // "video" | "text" | "quiz" | "exercise" | "meditation"
  content         Json     // Varies by type
  duration        Int      // minutes
  
  createdAt       DateTime @default(now())
  
  @@index([courseId, orderIndex])
}

model Enrollment {
  id              String   @id @default(uuid())
  courseId         String
  course          Course   @relation(fields: [courseId], references: [id])
  userId          String
  
  progress        Json     // { completedModules: string[], currentModule: string }
  percentComplete Float    @default(0)
  
  startedAt       DateTime @default(now())
  completedAt     DateTime?
  
  // Certificate
  certificateUrl  String?
  
  // Payment
  paymentId       String?
  
  @@unique([courseId, userId])
}
```

### Course Recommendation Algorithm
```
Score each course for user:
  relevance = 
    struggle_match(course.category, user.struggles) * 0.30 +
    goal_match(course.category, user.goals) * 0.25 +
    interest_match(course.tags, user.interests) * 0.15 +
    level_match(course.level, user.courseHistory) * 0.10 +
    therapist_recommended(course.id, user.therapist) * 0.10 +
    popularity(course.enrollmentCount, course.avgRating) * 0.10
```

---

# Part 16: Careers & Hiring Module

## 16.1 Specification

```prisma
model JobPosition {
  id              String   @id @default(uuid())
  title           String
  department      String   // "engineering" | "therapy" | "astrology" | "marketing" | "operations" | "content"
  type            String   // "full_time" | "part_time" | "contract" | "internship"
  location        String   // "remote" | "mumbai" | "delhi" | "bangalore"
  
  description     String
  requirements    String[]
  benefits        String[]
  
  salaryMin       Int?
  salaryMax       Int?
  currency        String   @default("INR")
  
  isActive        Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  applications    JobApplication[]
}

model JobApplication {
  id              String   @id @default(uuid())
  positionId      String
  position        JobPosition @relation(fields: [positionId], references: [id])
  
  name            String
  email           String
  phone           String?
  resumeUrl       String
  coverLetter     String?
  linkedinUrl     String?
  portfolioUrl    String?
  
  status          String   // "submitted" | "reviewing" | "shortlisted" | "interview" | "offered" | "hired" | "rejected"
  
  notes           String?  // Internal recruiter notes
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([positionId])
  @@index([status])
}
```

---

# Part 17: Notification Intelligence System

## 17.1 Smart Notification Engine

Not just "send notification" — an intelligent system that decides WHAT to send, WHEN, and HOW.

```typescript
interface NotificationDecision {
  userId: string;
  
  // What to send
  type: NotificationType;
  title: string;
  body: string;
  actionUrl: string;
  
  // When to send
  scheduledAt: DateTime;        // Optimal time based on user's engagement pattern
  
  // How to send
  channels: ("in_app" | "push" | "email" | "sms")[];  // Multi-channel, preference-aware
  
  // Why to send
  reason: string;               // "User hasn't logged mood in 3 days"
  priority: "low" | "medium" | "high" | "urgent";
}
```

### Notification Rules Engine
```
RULE: Mood Reminder
  IF user.lastMoodEntry > 2 days ago
  AND user.settings.patternAlerts = true
  AND currentHour BETWEEN user.preferredNotificationTime ± 1 hour
  THEN send(MOOD_REMINDER, "How are you feeling today? 💙", "/dashboard/mood")
  FREQUENCY: max 1 per 2 days

RULE: Session Reminder
  IF session.scheduledAt - now() < 24 hours
  THEN send(SESSION_REMINDER, "Your session with {therapist} is tomorrow at {time}", "/dashboard/sessions")
  CHANNELS: [in_app, email, push]

RULE: Streak at Risk
  IF user.currentStreak >= 5
  AND user.lastActivity = yesterday 
  AND currentHour = user.usualActivityHour
  THEN send(ACHIEVEMENT, "Don't break your {streak}🔥 day streak! Quick check-in?", "/dashboard")

RULE: Milestone Celebration
  IF achievement.justUnlocked
  THEN send(ACHIEVEMENT, "🎉 You earned: {achievement.name}!", "/dashboard/profile")

RULE: Churn Prevention
  IF user.churnProbability > 0.6
  AND user.lastLogin > 7 days ago
  THEN send(SYSTEM, "We miss you! Here's what's new...", "/dashboard")
  CHANNELS: [email]

RULE: Weekly Digest
  EVERY Sunday at 10am user-local-time
  THEN send(SYSTEM, "Your weekly wellness summary 📊", "/dashboard")
  CHANNELS: [email]
  CONTENT: { moodAvg, journalCount, meditationMinutes, streaks, wellnessScore }
```

### Notification Preferences (Already in UserSettings)
- pushNotifs: Master push toggle
- soundEffects: In-app sound
- patternAlerts: AI-driven behavioral notifications
- Additional granularity needed:
  - emailDigest: "daily" | "weekly" | "never"
  - quietHoursStart: "22:00"
  - quietHoursEnd: "08:00"
  - channelPreferences: { mood_reminders: "push", session_reminders: "push+email", marketing: "email_only" }

---

# Part 18: Missing Prisma Models to Add

Complete list of models that must be ADDED to `server/prisma/schema.prisma`:

### New Models Required

| Model | Purpose | Relations |
|-------|---------|-----------|
| `AnalyticsEvent` | Track every user action (Part 1) | → User |
| `AstrologerProfile` | Mirror of TherapistProfile for astrologers (Part 4) | → User, → BirthChart[], → Prediction[], → AstroConsultation[] |
| `BirthChart` | Birth chart calculations and cached data (Part 4) | → User, → AstrologerProfile? |
| `Prediction` | Horoscope predictions with accuracy tracking (Part 4) | → AstrologerProfile |
| `AstroConsultation` | Astrology session bookings (Part 4) | → AstrologerProfile, → User |
| `Connection` | Constellation user connections (Part 2.5) | → User (requester), → User (target) |
| `UserStreak` | Streak tracking per feature (Part 7.1) | → User |
| `Achievement` | Achievement/badge definitions (Part 7.2) | → UserAchievement[] |
| `UserAchievement` | Unlocked achievements per user (Part 7.2) | → User, → Achievement |
| `Referral` | Referral tracking (Part 7.4) | → User (referrer) |
| `SubscriptionTier` | Subscription plan definitions (Part 9.2) | N/A |
| `UserSubscription` | Active subscriptions per user | → User, → SubscriptionTier |
| `Post` | Community posts (Part 8.1) | → User, → Comment[] |
| `Comment` | Comments on posts (Part 8.1) | → Post |
| `SupportGroup` | Support group definitions (Part 8.1) | N/A |
| `Product` | Shop products (Part 10.1) | → ProductReview[], → OrderItem[] |
| `Order` | Shop orders (Part 10.1) | → User, → OrderItem[] |
| `OrderItem` | Items in order (Part 10.1) | → Order, → Product |
| `Cart` | Shopping cart (Part 10.1) | → User |
| `ProductReview` | Product reviews (Part 10.1) | → Product |
| `CorporateAccount` | B2B accounts (Part 11.1) | → CorporateEmployee[] |
| `CorporateEmployee` | Corporate users (Part 11.1) | → CorporateAccount |
| `NGOPartner` | NGO partners (Part 12) | N/A |
| `Event` | Events/workshops (Part 13) | → EventRegistration[] |
| `EventRegistration` | Event attendees (Part 13) | → Event |
| `BlogPost` | Blog CMS (Part 14) | → User (author) |
| `Course` | Learning platform (Part 15) | → User (instructor), → CourseModule[], → Enrollment[] |
| `CourseModule` | Course content (Part 15) | → Course |
| `Enrollment` | Course enrollments (Part 15) | → Course |
| `JobPosition` | Job listings (Part 16) | → JobApplication[] |
| `JobApplication` | Job applications (Part 16) | → JobPosition |
| `WellnessChallenge` | Weekly challenges (Part 7.3) | N/A |
| `SessionReview` | Therapy/astrology session reviews (separate from ProductReview) | → Session |

### New Enums Required
```prisma
enum ConnectionType { PLATONIC, PROFESSIONAL, SUPPORT_BUDDY }
enum ConnectionStatus { PENDING, ACCEPTED, BLOCKED, DECLINED }
enum OrderStatus { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, REFUNDED }
enum PostCategory { SUPPORT, GRATITUDE, QUESTION, STORY, TIP, MOTIVATION }
enum CourseLevel { BEGINNER, INTERMEDIATE, ADVANCED }
enum EventFormat { ONLINE, IN_PERSON, HYBRID }
```

**Total**: Current schema has 13 models + 8 enums. Target: **45+ models + 14+ enums**.

---

# Part 19: Complete Event Tracking Taxonomy

See [Part 1.3](#13-events-to-track--complete-taxonomy) for the full taxonomy. Summary statistics:

| Category | Events | Key AI Uses |
|----------|--------|-------------|
| Navigation & Engagement | 7 | Content optimization, UX improvement |
| Health & Wellness | 11 | Mood prediction, crisis detection, recommendation engine |
| Therapy & Sessions | 10 | Matching optimization, demand forecasting, quality monitoring |
| Payment | 6 | Revenue forecasting, churn prediction, LTV modeling |
| Social & Community | 6 | Content ranking, social graph, community health |
| Astrology | 5 | Prediction accuracy, content optimization |
| **Total** | **45** | Every event feeds into AI model training |

---

# Part 20: Feature Priority Matrix (22 Dimensions)

Per agentprompt.txt requirement, every feature needs scoring across ALL 22 dimensions. Here's the framework:

### Dimension Definitions
| # | Dimension | What It Measures |
|---|-----------|-----------------|
| 1 | Frontend | UI component completeness, routing, data binding |
| 2 | Backend | API endpoints, business logic, validation |
| 3 | Database | Schema, relations, migrations, indexing |
| 4 | Integrations | Third-party service connections |
| 5 | Cost Efficiency | INR-per-user sustainability |
| 6 | Testing | Unit, integration, E2E coverage |
| 7 | Documentation | API docs, user docs, code comments |
| 8 | DevOps | CI/CD, Docker, deployment pipeline |
| 9 | Security | Auth, encryption, rate limiting, input validation |
| 10 | File/Folder Structure | Code organization, naming, modularity |
| 11 | SEO | Meta tags, structured data, sitemap |
| 12 | UI | Visual quality, consistency, polish |
| 13 | UX | Flow clarity, cognitive load, empty/error states |
| 14 | Overall Design | Brand feel, emotional resonance, trust |
| 15 | CTA/Buttons | Label quality, placement, hierarchy, clarity |
| 16 | Accessibility | WCAG AA compliance, keyboard nav, screen reader |
| 17 | Performance | Load time, bundle size, runtime efficiency |
| 18 | Content/Copy | Messaging clarity, tone, persuasiveness |
| 19 | Conversion/Trust | Social proof, trust signals, conversion flow |
| 20 | Functionality | Does it actually work end-to-end? |
| 21 | User Delight | Emotional resonance, surprise & delight moments |
| 22 | Maintainability/Scalability | Code quality, tech debt, growth readiness |

### Feature Scores (Current → Target)

| Feature | FE | BE | DB | Int | Cost | Test | Doc | DevOps | Sec | File | SEO | UI | UX | Design | CTA | A11y | Perf | Copy | Conv | Func | Delight | Maint | Overall |
|---------|----|----|----|----|------|------|-----|--------|-----|------|-----|----|----|--------|-----|------|------|------|------|------|---------|-------|---------|
| Auth/Login | 70 | 80 | 80 | 0 | 80 | 0 | 30 | 50 | 35 | 70 | 0 | 75 | 60 | 70 | 60 | 50 | 70 | 60 | 50 | 40 | 40 | 60 | **52** |
| Onboarding (9-step) | 85 | 75 | 85 | 0 | 90 | 0 | 20 | 50 | 60 | 70 | 0 | 80 | 70 | 80 | 65 | 50 | 65 | 70 | 60 | 70 | 70 | 65 | **60** |
| Mood Tracking | 80 | 85 | 85 | 0 | 90 | 0 | 20 | 50 | 70 | 70 | 0 | 80 | 75 | 80 | 70 | 55 | 70 | 70 | 60 | 85 | 65 | 70 | **62** |
| Journal | 80 | 80 | 80 | 0 | 90 | 0 | 20 | 50 | 65 | 70 | 0 | 80 | 75 | 80 | 65 | 50 | 70 | 70 | 55 | 80 | 65 | 70 | **60** |
| Meditation | 60 | 70 | 70 | 0 | 90 | 0 | 10 | 50 | 60 | 65 | 0 | 65 | 50 | 65 | 50 | 40 | 65 | 50 | 40 | 40 | 40 | 60 | **46** |
| Confessional | 65 | 60 | 50 | 0 | 90 | 0 | 5 | 50 | 50 | 60 | 0 | 70 | 60 | 70 | 50 | 40 | 65 | 60 | 40 | 50 | 55 | 55 | **47** |
| Constellation | 70 | 0 | 0 | 0 | 50 | 0 | 5 | 50 | 20 | 55 | 0 | 85 | 30 | 85 | 30 | 30 | 40 | 30 | 20 | 10 | 60 | 40 | **33** |
| Sessions/Booking | 50 | 5 | 70 | 0 | 50 | 0 | 5 | 50 | 20 | 55 | 0 | 60 | 20 | 60 | 40 | 30 | 60 | 40 | 20 | 5 | 10 | 40 | **31** |
| Therapist Dashboard | 60 | 5 | 70 | 0 | 50 | 0 | 5 | 50 | 20 | 55 | 0 | 65 | 30 | 65 | 40 | 30 | 60 | 40 | 20 | 5 | 20 | 40 | **33** |
| Astrology Dashboard | 50 | 5 | 20 | 0 | 50 | 0 | 5 | 50 | 20 | 50 | 0 | 60 | 20 | 60 | 30 | 25 | 60 | 30 | 15 | 5 | 15 | 35 | **27** |
| Admin Dashboard | 55 | 5 | 20 | 0 | 50 | 0 | 5 | 50 | 25 | 50 | 0 | 55 | 25 | 55 | 35 | 25 | 55 | 30 | 15 | 5 | 10 | 35 | **27** |
| Payments | 0 | 5 | 75 | 0 | 50 | 0 | 5 | 50 | 20 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **15** |
| AI Chat | 0 | 5 | 0 | 0 | 30 | 0 | 5 | 50 | 20 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **11** |
| Community | 0 | 5 | 0 | 0 | 50 | 0 | 5 | 50 | 15 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **12** |
| Shop | 0 | 5 | 0 | 0 | 50 | 0 | 5 | 50 | 15 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **12** |
| Courses | 0 | 5 | 0 | 0 | 50 | 0 | 5 | 50 | 15 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **12** |
| Blog | 40 | 5 | 0 | 0 | 80 | 0 | 5 | 50 | 15 | 55 | 10 | 60 | 40 | 55 | 40 | 35 | 55 | 50 | 30 | 10 | 20 | 40 | **30** |
| Events | 0 | 5 | 0 | 0 | 50 | 0 | 5 | 50 | 15 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **12** |
| Corporate | 0 | 5 | 0 | 0 | 50 | 0 | 5 | 50 | 15 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **12** |
| NGO | 0 | 5 | 0 | 0 | 80 | 0 | 5 | 50 | 15 | 50 | 0 | 0 | 0 | 0 | 0 | 0 | 50 | 0 | 0 | 0 | 0 | 30 | **13** |
| Careers | 40 | 5 | 0 | 0 | 90 | 0 | 5 | 50 | 15 | 55 | 10 | 55 | 35 | 55 | 35 | 30 | 55 | 45 | 25 | 5 | 10 | 35 | **28** |
| Notifications | 60 | 60 | 75 | 0 | 80 | 0 | 10 | 50 | 50 | 65 | 0 | 55 | 50 | 55 | 40 | 35 | 60 | 40 | 35 | 50 | 30 | 55 | **43** |
| Landing Page | 90 | 0 | 0 | 0 | 90 | 0 | 10 | 50 | 50 | 70 | 20 | 90 | 75 | 90 | 70 | 50 | 55 | 75 | 65 | 80 | 80 | 65 | **58** |
| About Page | 85 | 0 | 0 | 0 | 90 | 0 | 5 | 50 | 50 | 65 | 15 | 85 | 70 | 85 | 55 | 45 | 60 | 70 | 60 | 80 | 70 | 60 | **54** |
| Contact Page | 70 | 5 | 0 | 0 | 90 | 0 | 5 | 50 | 40 | 60 | 10 | 70 | 50 | 70 | 45 | 40 | 60 | 55 | 40 | 20 | 30 | 50 | **39** |

### Weighted Platform Score
```
Current Overall: 28/100
Target after full implementation: 92/100

Score formula (22 dimensions with weights): 
  Frontend(0.08) + Backend(0.10) + Database(0.07) + Integrations(0.07) + 
  CostEfficiency(0.03) + Testing(0.06) + Documentation(0.03) + DevOps(0.04) + 
  Security(0.08) + FileStructure(0.02) + SEO(0.04) + UI(0.05) + UX(0.06) + 
  Design(0.04) + CTA(0.03) + Accessibility(0.03) + Performance(0.04) + 
  ContentCopy(0.02) + ConversionTrust(0.03) + Functionality(0.08) + 
  UserDelight(0.03) + Maintainability(0.04) = 100%
```

---

# Appendix A: Quick Reference — What To Build Next (Priority Order)

This maps directly to [`15_master_execution_roadmap.md`](15_master_execution_roadmap.md):

| # | Feature | Revenue Impact | User Impact | Complexity | Priority |
|---|---------|---------------|-------------|------------|----------|
| 1 | Auth Security Fix | Critical (liability) | Critical (trust) | Low | P0 |
| 2 | Razorpay Payments | Critical (enables revenue) | High | Medium | P0 |
| 3 | 100ms Video Sessions | Critical (core product) | Critical | Medium | P0 |
| 4 | Email (Resend) | High (enables all notifications) | High | Low | P1 |
| 5 | Therapist Matching Algorithm | High (core UX) | Critical | High | P1 |
| 6 | Therapist Dashboard | High (enables supply side) | High | Medium | P1 |
| 7 | AI Wellness Chat | Medium (differentiator) | High | Medium | P1 |
| 8 | Subscription Tiers | High (MRR engine) | Medium | Medium | P1 |
| 9 | Mood Pattern Detection | Low (retention) | High | Medium | P2 |
| 10 | Gamification (Streaks/Achievements) | Medium (retention) | High | Medium | P2 |
| 11 | Community Forum | Low (engagement) | High | Medium | P2 |
| 12 | Astrologer System | Medium (revenue stream) | Medium | High | P2 |
| 13 | Blog CMS | Medium (SEO/traffic) | Low | Low | P2 |
| 14 | Course Platform | Medium (revenue stream) | Medium | High | P2 |
| 15 | Wellness Shop | Low (additional revenue) | Low | Medium | P3 |
| 16 | Corporate Wellness | High (B2B revenue) | Low | High | P3 |
| 17 | Events System | Low (revenue stream) | Medium | Medium | P3 |
| 18 | Admin God-Mode Dashboard | Internal | Internal | High | P2 |
| 19 | Analytics/Event Tracking | Critical (AI training) | Invisible | Medium | P1 |
| 20 | NGO Module | None (CSR) | Low | Low | P3 |

---

# Appendix B: External Service Requirements

| Service | What For | When Needed | Free Tier | Monthly Cost at Scale |
|---------|----------|-------------|-----------|----------------------|
| Razorpay | Payments | Phase 3 | Test mode free | 2% per transaction |
| 100ms | Video | Phase 3 | 10K min/mo free | $0.004/min |
| Resend | Email | Phase 2 | 3K emails/mo | $20/mo for 50K |
| OpenAI | AI Chat + Sentiment + Crisis | Phase 5 | None | ~₹2,000-8,000/mo |
| Cloudflare R2 | Object storage | Phase 4 | 10GB free | $0.015/GB |
| PostHog | Analytics | Phase 1 | 1M events/mo free | $0/mo to start |
| Sentry | Error monitoring | Phase 1 | 5K events/mo free | $26/mo |
| Swiss Ephemeris (swe-wasm) | Astrology calculations | Phase 12 | Free (open source) | $0 |
| Neon | Database hosting | Deploy | 0.5GB free | $19/mo |
| Vercel | Frontend hosting | Deploy | Hobby free | $20/mo |
| Render | Backend hosting | Deploy | 512MB free | $7/mo |

---

_This document is the single source of truth for what Soul Yatri must become. Every algorithm, every data point, every feature, every metric specified here should be implemented to make this platform genuinely world-class._

_Last updated: March 6, 2026_  
_Companion: [`15_master_execution_roadmap.md`](15_master_execution_roadmap.md) | [`14_execution_prompts.md`](14_execution_prompts.md) | [`MASTER_TODO_LIST.md`](MASTER_TODO_LIST.md)_

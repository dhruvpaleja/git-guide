# Soul Yatri Connections — 100/100 Social Feature Plan

> Re-verification note (2026-03-07): this document is a full-feature product and engineering spec for the intended social layer. It should be treated as the target design, not as evidence that the described matching, messaging, moderation, feed, or circle systems already exist in the current codebase.

**Feature:** Connections (Hinge + Instagram + LinkedIn hybrid for mental wellness)  
**Version:** 1.0 — Master Product & Engineering Spec  
**Date:** 2026-03-06  
**Status:** Pre-build — planning complete, implementation pending

---

## Vision

> **"The only social network where connection is earned through vulnerability, not vanity."**

Connections is not a generic social feed. It is a **trauma-informed, AI-curated social layer** built on top of a user's lived emotional data (their constellation, mood history, therapy journey, astrological profile). Every connection is meaningful. Every interaction deepens healing.

**Three pillars stolen from the best:**
- **Hinge** — intentional matching based on compatibility, not endless swiping; mutual opt-in; match prompts that reveal depth
- **Instagram** — visual expression, stories, posts, beautiful profiles, follower/following, content discovery
- **LinkedIn** — professional credibility signals, practitioner connections, mentorship, skills/expertise endorsements

**The Soul Yatri twist:** all three are powered by real data — your constellation nodes, your mood trend, your astrological profile, your therapy progress. The AI matches you to people who genuinely resonate, not just people who look good in a photo.

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Connection Types](#2-connection-types)
3. [Profile Architecture (The Soul Card)](#3-profile-architecture-the-soul-card)
4. [Matching Algorithm](#4-matching-algorithm)
5. [The Discovery Feed (Instagram layer)](#5-the-discovery-feed-instagram-layer)
6. [Stories (Soul Moments)](#6-stories-soul-moments)
7. [Direct Connections (Hinge layer)](#7-direct-connections-hinge-layer)
8. [Professional Network (LinkedIn layer)](#8-professional-network-linkedin-layer)
9. [Messaging System](#9-messaging-system)
10. [Groups & Circles](#10-groups--circles)
11. [Privacy Architecture](#11-privacy-architecture)
12. [AI Moderation & Safety](#12-ai-moderation--safety)
13. [Gamification & Engagement](#13-gamification--engagement)
14. [Data Model (Prisma)](#14-data-model-prisma)
15. [Backend API Spec](#15-backend-api-spec)
16. [Frontend Screen Map (26 screens)](#16-frontend-screen-map-26-screens)
17. [Implementation Roadmap](#17-implementation-roadmap)
18. [Revenue Model](#18-revenue-model)

---

## 1. Feature Overview

### Where It Lives
- Route: `/dashboard/connections` (already in router)
- Tab: "Connections" in dashboard bottom nav / sidebar
- Sub-routes:
  - `/dashboard/connections` — Main feed (discovery)
  - `/dashboard/connections/matches` — Active matches & requests
  - `/dashboard/connections/messages` — DM threads
  - `/dashboard/connections/explore` — Discover users/groups
  - `/dashboard/connections/profile/:userId` — Public soul profile
  - `/dashboard/connections/groups` — Support circles
  - `/dashboard/connections/professional` — Practitioner network

### Current State (Gap)
- `src/pages/dashboard/ConnectionsPage.tsx` — exists but shows 6 hardcoded mock cards with no real API, no matching algorithm, no messaging, no profiles
- No server-side routes for connections exist
- No database models for connections exist

### Target State
- Full social graph with mutual connections + one-way follows
- AI-powered matching on 7 dimensions
- In-app DM system with crisis escalation
- Visual feed (posts + stories)
- Support circles (private group spaces)
- Professional network for practitioners
- 100% real data, zero mock data

---

## 2. Connection Types

### 2a. Resonance Connections (Hinge-style — mutual opt-in)
- AI matches two users based on constellation overlap, mood patterns, astrological compatibility
- Neither user sees the other's full identity until mutual "Connect" is pressed
- Pre-match, users only see: connection type label, shared traits, synergy score, a single "soul prompt" answer
- After mutual connect: full profiles visible, DMs unlock
- **Intent signals:** romantic, platonic, growth-partner, accountability-partner, grief-support, co-healing

### 2b. Follow Network (Instagram-style — asymmetric)
- Any user can follow any public profile
- Following = see their posts + soul moments in your feed
- Follower/following counts displayed
- Posts/moments are separate from the follow graph (can post without followers)

### 2c. Professional Network (LinkedIn-style — bidirectional)
- Practitioner-to-practitioner: therapists can connect with astrologers, coaches
- User-to-practitioner: users can "follow" practitioners for content
- Practitioners can endorse each other's specialties
- Verified credentials display prominently

### 2d. Circle Membership (Group-style)
- Support groups organized by shared experience (anxiety, grief, relationships, career stress)
- Public circles: browse and join
- Private circles: invite-only
- Moderated by either a verified practitioner or a trusted community elder

---

## 3. Profile Architecture (The Soul Card)

The public profile is not a generic social card. It is a **Soul Card** — the most meaningful profile in any app the user has.

### Soul Card Sections

#### 3a. Identity Layer (always visible to connections)
```
┌─────────────────────────────────────────────┐
│  [avatar with orbital ring — activity glow] │
│  Name (display name, never real name req.)  │
│  @handle · Joined 3 months ago              │
│  📍 City (optional)                          │
│  [Soul Health Index badge: 72 ●]            │
│  [Verified Practitioner badge if applicable] │
└─────────────────────────────────────────────┘
```

#### 3b. Astrology Layer
```
☉ Sun: Scorpio  ☽ Moon: Pisces  ↑ Rising: Libra
Dominant Planet: Neptune  |  Nakshatra: Jyeshtha
Current Dasha: Ketu  |  Life Path: 7
```
Source: `UserProfile.sunSign`, `UserProfile.moonSign`, `UserProfile.risingSign` + computed from birth details

#### 3c. Soul Essence (from onboarding answers)
- Current struggles: displayed as soft tags (e.g., "Anxiety", "Career transition", "Grief")
- Goals: "Healing", "Self-discovery", "Find my people"
- Therapy mode: open about it / private
- Connection intent: clearly shown upfront (romantic / platonic / growth / professional)

#### 3d. Constellation Snapshot (unique to Soul Yatri)
- Mini read-only view of user's public constellation nodes
- Shows top 5 active nodes (highest intensity, non-private)
- Clicking opens full constellation in view-only mode
- This is the deepest profile signal — no other app has this

#### 3e. Wellness Indicators (visible only to mutual connections)
- Mood trend badge: "Improving ↑" / "Stable →" / "Difficult ↓"
- Active streak: "14-day mood log streak 🔥"
- Recent milestone: "Just completed 30-day meditation challenge"

#### 3f. Soul Prompts (Hinge-style depth signals)
Three question-answer pairs chosen by the user from a curated bank of 60 questions:
```
"The thing I'm working on right now is..."
"One thing therapy taught me is..."
"I feel most like myself when..."
"My relationship with silence is..."
"The pattern I'm finally breaking is..."
```
Displayed as cards on the profile. Connection requests can be sent as a direct response to one prompt.

#### 3g. Content Layer (Instagram-style)
- Posts grid (3-column, square thumbnails)
- Soul Moments count (stories)
- Post count · Follower count · Following count

#### 3h. Professional Layer (practitioners only)
- Credentials with verification badge
- Specialties as clickable tags
- Session availability indicator
- Ratings summary (e.g., "4.9 ★ · 127 sessions")
- Years of experience
- Endorsements from other practitioners

---

## 4. Matching Algorithm

The Soul Yatri matching algorithm is the deepest in any Indian wellness app. It runs on 7 signal dimensions, re-computed nightly per user.

### 4a. Signal Dimensions

```
MATCH_SCORE = Σ (dimension_score × weight)
```

| # | Dimension | Weight | Data Source | Method |
|---|---|---|---|---|
| 1 | **Constellation Resonance** | 30% | User's constellation nodes | Cosine similarity on category+emotion+intensity vector |
| 2 | **Mood Pattern Alignment** | 20% | 30-day mood history | Time-series correlation (DTW distance metric) |
| 3 | **Astro Compatibility** | 15% | Sun/Moon/Rising signs | Vedic compatibility matrix (guna milan adapted) |
| 4 | **Struggle Overlap** | 15% | `UserProfile.struggles` | Jaccard similarity on struggle tag sets |
| 5 | **Life Stage** | 10% | Age bracket + goals | Cluster match (k-means on age/goals/relationship status) |
| 6 | **Engagement Timing** | 5% | Active hours from analytics | Overlap in peak usage hours (schedule compatibility) |
| 7 | **Intent Match** | 5% | Connection intent setting | Hard filter: only match compatible intents |

### 4b. Match Score Interpretation

| Score | Label | Color | Action |
|---|---|---|---|
| 90-100 | "Soul Match" | Gold | Auto-surfaced, premium badge |
| 80-89 | "Deep Resonance" | Purple | Top of discovery |
| 70-79 | "Strong Frequency" | Teal | Standard match feed |
| 60-69 | "Compatible" | Blue | Lower in feed |
| <60 | Not shown | — | Filtered out |

### 4c. Constellation Resonance Calculation (detailed)

```typescript
// For each user, build a feature vector from their nodes:
function buildConstellationVector(nodes: ConstellationNode[]): number[] {
  const categories = ['self', 'family', 'career', 'health', 'relationship', 'spiritual', 'creative'];
  const emotions = ['joy', 'sadness', 'anxiety', 'anger', 'grief', 'hope', 'burnout', ...];
  
  // Category distribution (normalized)
  const categoryVector = categories.map(cat => 
    nodes.filter(n => n.category === cat).reduce((sum, n) => sum + n.intensity, 0) / 50
  );
  
  // Dominant emotion signal
  const emotionVector = emotions.map(em =>
    nodes.filter(n => n.emotion === em).length / nodes.length
  );
  
  return [...categoryVector, ...emotionVector];
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}
```

### 4d. Anti-Gaming Measures
- Match scores not shown as exact number to users — only the label
- Cannot filter matches by score threshold (prevents superficial optimization)
- Minimum 24h cooldown after a missed connection (user dismisses a match)
- Matching runs server-side only; client never receives the raw vectors

### 4e. Match Diversity Algorithm
Prevents "echo chamber" matching:
- Maximum 2 consecutive matches with identical struggle tags
- At least 1 "growth match" (someone slightly outside comfort zone) per 5 recommendations
- Geography diversity: if all matches are within 5 miles, expand radius for next batch

### 4f. Background Job
```
Schedule: nightly at 2 AM IST
Job: computeMatchBatch
  For each active user (lastLogin < 7d):
    1. Build feature vectors
    2. Compute pairwise similarity (optimized with ANN index for scale)
    3. Apply filters (intent, age bracket, geography)
    4. Store top 20 matches in UserMatchCache
    5. Create Notification for new high-score matches (score > 85)
```

---

## 5. The Discovery Feed (Instagram layer)

### 5a. Feed Architecture

Three tabs within the Connections discovery view:

**Tab 1 — "For You" (algorithmic)**
- AI-curated posts from users you don't follow yet
- Ranked by: topic relevance (vs your constellation) + engagement quality + recency
- Interspersed with: new match suggestions, practitioner content, group invitations
- Never shows: crisis content, explicit health disclosures without CW

**Tab 2 — "Following" (chronological)**
- Posts from users + practitioners you follow
- Stories bar at top (Instagram-style horizontal scroll)
- Pure chronological, no algorithm
- Shows full post with no truncation

**Tab 3 — "Trending"**
- Platform-wide trending posts in the last 24h
- Filtered to wellness topics (no entertainment content)
- Trending hashtags: #MorningMood, #TherapyWin, #SoulNote, #KarmaPattern, #HealingJourney

### 5b. Post Types

| Type | Description | Privacy Options |
|---|---|---|
| Soul Note | Short-form text (280 chars, no images) — like a tweet | Public / Connections only / Private |
| Soul Post | Long-form text + optional image/artwork | Public / Connections only |
| Constellation Share | Share a node or insight from your constellation | Public / Connections only |
| Milestone Post | Celebrate a streak, session completion, breakthrough | Public / Connections only |
| Mood Check-in | Share today's mood (emoji + caption) | Public / Connections only |
| Quote / Affirmation | Visual card with text overlay | Public / Connections only |
| Session Reflection | Post-therapy reflection (optional, with CW tags) | Connections only / Private |

### 5c. Post Interaction Model

```
Post Interactions:
- ❤️ Resonate (not "Like" — more intentional)
- 🕊️ Hold Space (silent acknowledgment, no notification)  
- 💬 Comment
- 🔁 Echo (share to your feed with your own note)
- 🔖 Save (private collection)
- ⚡ Send Pulse (anonymous support, triggers a gentle notification)
```

**"Hold Space" is a Soul Yatri original** — for posts about pain/grief where you want to acknowledge without triggering notification anxiety in the author.

### 5d. Comment Architecture
- Threaded replies (2 levels max — prevents toxic rabbit holes)
- Reaction bar on comments (same 3 options: Resonate, Hold Space, Reply)
- Comment collapse: long comment threads default collapsed after 3 root comments
- AI moderation on all comments before they appear (< 500ms)

### 5e. Content Warnings (CW Tags)
Users can add CW tags to posts that contain sensitive content:
```
Available CW tags: [grief] [mental health] [relationship] [trigger warning] [heavy] [family] [trauma]
```
Posts with CW tags show blurred preview with tag visible. User must tap to expand.

---

## 6. Stories (Soul Moments)

Inspired by Instagram Stories but redesigned for emotional authenticity.

### 6a. What Are Soul Moments?
- 24-hour ephemeral content (auto-expires)
- Can be: text card, image, mood check-in snapshot, daily affirmation, constellation node share, question/poll
- Viewed in order: newest unwatched first
- View count visible to poster (private, not shown publicly)

### 6b. Moment Types

```typescript
type SoulMomentType =
  | 'text'           // Styled text card with gradient background
  | 'image'          // Photo/artwork upload
  | 'mood-snapshot'  // Auto-generated card from today's mood log
  | 'affirmation'    // Daily affirmation card (generated by AI)
  | 'constellation'  // Share a node's recent insight
  | 'poll'           // 2-option question ("How are you coping today?")
  | 'question'       // Ask a question to your followers
  | 'quote'          // Inspirational quote with visual
  | 'milestone'      // Auto-generated from streak/session completion
```

### 6c. Mood Snapshot Automation
When a user logs their mood, they can optionally create a moment from it:
- Auto-generates a gradient card (color tied to mood value)
- Adds today's date, a subtle animation
- Optional caption pre-filled with mood note
- One-tap publish

### 6d. Stories Bar Component
```tsx
// Horizontal scroll at top of "Following" feed
<StoriesBar>
  {following.map(user => (
    <StoryRing
      userId={user.id}
      avatar={user.avatarUrl}
      name={user.displayName}
      hasUnwatched={user.hasUnwatchedMoments}
      isOnline={user.isActiveNow}
    />
  ))}
</StoriesBar>
```

Ring states:
- Unseen: gradient ring (matches user's soul color from astrology)
- Seen: greyed ring
- Active now: green pulse dot

---

## 7. Direct Connections (Hinge layer)

### 7a. The Connection Request Flow

**Step 1: Match Card Presented**
- User sees match card with: synergy score label, shared traits, single soul prompt answer
- Options: "Connect" (sends request) | "Not Now" (dismisses for 7 days) | "Skip Forever"

**Step 2: Crafting the Connection Request**
- Before sending, user selects one of three response modes:
  1. **Reply to Prompt** — respond directly to one of the match's soul prompt answers
  2. **Send a Pulse** — one-tap, no text, pure energetic acknowledgment  
  3. **Write Your Own** — free-form message (150 char limit before match is mutual)

**Step 3: Match Notification**
- Match receives notification: "Someone resonated with your answer to '[prompt]'"
- They see the sender's response but not the sender's identity yet (blurred)
- They can: "Accept" (reveals both profiles, unlocks DMs) | "Decline" (sender not notified)

**Step 4: After Mutual Connection**
- Both profiles fully revealed
- DM thread created automatically with the opening message
- Both users added to each other's "Connections" tab
- A "Connection Anniversary" notification sent on the 1-week and 1-month anniversary

### 7b. Match Queue UX

Similar to Hinge's "Roses" and "Likes You" mechanic:

```
┌── Your Match Queue ──────────────────────────────┐
│  3 people want to connect                        │
│  [Blurred card] · [Blurred card] · [Blurred card]│
│  See who resonated → (Premium unlocks all at once│
│                        Free sees 1 at a time)    │
└──────────────────────────────────────────────────┘
```

### 7c. Connection Limits (Prevents Spam)
- Free tier: 5 connection requests sent per day; 2 "Pulses" per day
- Premium: unlimited connection requests; unlimited pulses
- After 3 consecutive declines from different users in 24h: 12h cooldown + gentle nudge ("Your profile may need refreshing")

### 7d. Unmatch / Block
- Unmatch: removes from connections, hides from each other's match queue forever
- Block: hides from all surfaces (feed, matches, circles); user cannot find blocker
- Report: routes to moderation queue with context

---

## 8. Professional Network (LinkedIn layer)

### 8a. Practitioner Profiles

Extended from the base Soul Card:

```
Verified Credentials:
  [RCI Licensed Clinical Psychologist · Verified ✓]
  [NIMHANS Certified · 2019]

Specialties: [Anxiety] [Trauma] [Relationship Therapy] [CBT] [EMDR]

Experience: 8 years · 450+ sessions on Soul Yatri

Peer Endorsements:
  Dr. Priya M. endorsed "EMDR Therapy"
  Astrologer Kiran endorsed "Transpersonal Psychology"

Published Content: 12 articles · 3 courses

Availability: Mon-Fri 10AM-7PM IST  [Book Session →]
```

### 8b. Practitioner → Practitioner Network
- Therapists can "Connect" with astrologers, coaches, other therapists
- Co-referral system: therapist can refer a client to an astrologer with a note (with client consent)
- Case consultation: practitioners can create private consultation threads (end-to-end encrypted)
- Joint session scheduling: two practitioners can co-host a session for a shared client

### 8c. User → Practitioner Following
- Users follow practitioners for their content
- Practitioner feed shows: articles, tips, videos, live session announcements
- Followers see practitioner's upcoming free workshops/webinars
- "Ask a Question" feature: follower submits anonymous question, practitioner answers publicly (great for engagement)

### 8d. Skill Endorsement System
```typescript
interface PractitionerEndorsement {
  endorserId: string;           // Must be verified practitioner
  endorseeId: string;
  skill: string;                // From approved skill taxonomy
  experienceLevel: 'basic' | 'proficient' | 'expert';
  note?: string;                // Optional 100-char note
  createdAt: DateTime;
  isPublic: boolean;
}
```

Approved skill taxonomy (50+ skills):
- Therapy modalities: CBT, DBT, EMDR, ACT, IFS, Somatic, Narrative, Transpersonal
- Astrology specialties: Vedic, Western, Jaimini, Prashna, Synastry, Mundane
- Wellness: Meditation instruction, Breathwork, Sound healing, Yoga therapy
- Population specialties: Adolescents, Couples, LGBTQIA+, Corporate, Trauma survivors

---

## 9. Messaging System

### 9a. Message Types
```typescript
type MessageType =
  | 'text'
  | 'image'
  | 'constellation-share'   // Share a node from your constellation
  | 'mood-share'            // Share current mood card
  | 'voice'                 // 60-second voice note
  | 'affirmation-gift'      // Send an affirmation card to someone
  | 'session-invite'        // Invite to book a shared session
  | 'resource-share'        // Share an article/course/meditation
  | 'reaction'              // React to a message (6 custom reactions)
```

### 9b. Chat Architecture
```
Message threading: linear (no sub-threads in DMs)
Message status: sent → delivered → seen (dot fills gradient)
Typing indicator: "..." with soul pulse animation
Reactions: 6 options: ❤️ 🙏 🌟 🤗 💙 🕊️
Media: images up to 5MB, voice notes up to 60s
Retention: messages retained permanently (users can delete their own)
```

### 9c. Crisis Detection in Messages
Every message is scanned for crisis keywords server-side:
- If crisis detected in DM: sender sees "Are you okay? Here are some resources" (non-intrusive)
- If explicit crisis detected: surfaced to admin moderation queue
- Responder (recipient) notified: "Your friend may be struggling — we've shared some resources with them"
- Hotline numbers surfaced: iCall (9152987821), Vandrevala (1860-2662-345)

### 9d. Message Requests
- DMs from non-connections arrive as "Message Requests"
- User sees: sender's soul card preview, their opening message
- Can: Accept → opens DM | Decline → no notification sent | Block

### 9e. Group Messages
- Circles have a group chat
- Group chats limited to 50 members
- Admins (circle moderators) can pin messages
- AI moderation applies to all group messages

---

## 10. Groups & Circles

### 10a. Circle Types

| Type | Who Creates | Size Limit | Moderation | Privacy |
|---|---|---|---|---|
| Support Circle | Practitioners only | 50 | Practitioner + AI | Invite-only |
| Community Circle | Any verified user | 200 | Community moderators + AI | Public or private |
| Study Circle | Any user | 30 | Creator + AI | Private |
| Crisis Circle | Admin only | 20 | Admin + Therapist | Invite-only |

### 10b. Circle Features
- **Group feed**: posts visible to members only
- **Weekly check-in**: auto-generated Monday prompt for all members
- **Shared resources**: pinned articles, meditations, exercises
- **Group constellation**: aggregate mood visualization for all members
- **Live sessions**: practitioners can host live sessions within a circle
- **Progress tracking**: see how the group is doing collectively (mood trends, streaks)

### 10c. Circle Discovery Algorithm
Recommendations based on:
- Shared struggle tags with existing members
- Constellation overlap with circle's aggregate profile
- Practitioner recommendation (from user's therapist/astrologer)
- Geographic proximity (local circles)

---

## 11. Privacy Architecture

### 11a. Privacy Levels per Content

| Content | Default | Options |
|---|---|---|
| Profile (base) | Public | Public / Connections only / Private |
| Constellation | Private | Connections only / Public |
| Mood entries | Private | Never public |
| Journal entries | Private | Never public |
| Posts | Connections only | Public / Connections only / Private |
| Soul Moments | Connections only | Public / Connections only / Private |
| Following list | Public | Public / Private |
| Follower list | Public | Public / Private |
| Online status | Off | On / Connections only / Off |
| Struggle tags | Connections only | Public / Connections only / Private |

### 11b. Anonymous Mode
- Users can post and comment anonymously within Circles
- Anonymous identity is consistent within a session (same anon avatar per Circle)
- Admin can de-anonymize if safety violation is detected
- Anonymous posts still run through AI moderation with full context stored server-side

### 11c. Shadow Profiles
No shadow profiles. If a user's email appears in a connection request from someone they haven't consented to share data with, they are NOT auto-connected. All connections are opt-in.

### 11d. Data Portability
- User can export all their connections, posts, messages, circles in JSON format
- Download available from Settings → Privacy → Export My Data
- Format follows DPDPA data portability requirements

---

## 12. AI Moderation & Safety

### 12a. Real-time Content Scanning
Every piece of user-generated content passes through a 3-layer safety system:

```
Layer 1: Keyword filter (< 5ms)
  - Blocklist of crisis keywords, hate speech terms, PII patterns (phone numbers, email patterns)
  - If triggered: hold for Layer 2

Layer 2: ML classification (< 200ms)
  - OpenAI content moderation API
  - Scores: toxicity, self-harm, sexual content, violence, hate speech
  - Thresholds: self-harm > 0.3 → hold; toxicity > 0.7 → auto-remove

Layer 3: Human review (< 4h)
  - Content held by Layer 1 or 2
  - Admin moderation queue
  - Decision: approve / remove / warn-user / escalate-to-crisis
```

### 12b. Crisis Response Protocol

When a post/message/comment triggers crisis detection (score > 0.85):

1. Content is held (not published) and routed to crisis moderation queue
2. Author receives: "We noticed you might be having a hard time. You're not alone." + crisis resources
3. If the user has an active therapist on Soul Yatri: optional auto-notification to therapist (requires advance consent from user during onboarding)
4. Admin creates a `CrisisEvent` record with full context
5. Trained crisis volunteer (or admin) reaches out within 2 hours

### 12c. Practitioner-specific Safety
- All practitioner-to-user messages are stored and auditable
- Practitioners cannot DM users who are not their clients (except in professional context)
- If a therapist's language is flagged as potentially inappropriate: flagged for clinical supervisor review

---

## 13. Gamification & Engagement

### 13a. Connection Badges
Awarded to connection pairs (not individuals):

| Badge | Criteria | Visual |
|---|---|---|
| First Resonance | Mutual connection established | Two orbiting dots |
| 30-Day Bond | Connected for 30 days + 10+ messages | Gold ring |
| Constellation Overlap | 5+ shared node categories | Overlapping constellations |
| Growth Partners | Both improved Soul Health Index by 10+ points while connected | Rising arrows |
| Healing Duo | Both attended a session during the same week | Two hearts with pulse |
| Accountability Chain | Both maintained streak for 7+ days | Interlinked chains |

### 13b. Circle Badges
- **Founding Member**: one of the first 10 members of a circle
- **Consistent Presence**: posted in the circle for 4+ consecutive weeks
- **Most Helpful**: most "Hold Space" reactions from circle members in a month
- **Circle Elder**: 90+ days in the same circle

### 13c. Profile Completeness Score
Visible on profile settings page (not public):
```
Soul Card Completeness: 72%
☑ Avatar uploaded
☑ Display name set
☑ 3 soul prompts answered
☑ Astrology profile complete
☑ Connection intent set
☐ Constellation has 5+ nodes (requires adding 2 more)
☐ First post published
☐ Joined a Circle
```

### 13d. Engagement Nudges (Notification-based)
- "3 new resonances are waiting in your match queue" (daily, max 1/day)
- "Your connection [name] just hit a 30-day streak — send them a pulse! ⚡"
- "You and [name] have 3 matching constellation nodes — you haven't talked in 14 days 👋"
- "[Name] replied to your Soul Note" (immediate)
- "Your Circle has a new post" (daily digest, not individual)

---

## 14. Data Model (Prisma)

Add to `server/prisma/schema.prisma`:

```prisma
// ── Social Graph ──────────────────────────────────────────────────────────

model Connection {
  id             String           @id @default(uuid())
  requesterId    String
  requester      User             @relation("SentConnections", fields: [requesterId], references: [id], onDelete: Cascade)
  recipientId    String
  recipient      User             @relation("ReceivedConnections", fields: [recipientId], references: [id], onDelete: Cascade)
  status         ConnectionStatus @default(PENDING)
  intent         ConnectionIntent
  matchScore     Float?           // 0-100 from matching algorithm
  openingMessage String?          @db.Text
  promptResponse String?          @db.Text  // response to a soul prompt
  promptId       String?
  connectedAt    DateTime?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  @@unique([requesterId, recipientId])
  @@index([recipientId, status])
}

model Follow {
  id          String   @id @default(uuid())
  followerId  String
  follower    User     @relation("Following", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   User     @relation("Followers", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followingId])
}

model Block {
  id        String   @id @default(uuid())
  blockerId String
  blocker   User     @relation("BlockedByUser", fields: [blockerId], references: [id], onDelete: Cascade)
  blockedId String
  blocked   User     @relation("BlockedUsers", fields: [blockedId], references: [id], onDelete: Cascade)
  reason    String?
  createdAt DateTime @default(now())

  @@unique([blockerId, blockedId])
}

// ── Matching ──────────────────────────────────────────────────────────────

model UserMatchCache {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  matchUserId String
  score       Float    // 0-100
  scoreLabel  String   // "Soul Match" | "Deep Resonance" etc.
  dimensions  Json     // { constellationScore, moodScore, astroScore, ... }
  intent      ConnectionIntent
  dismissed   Boolean  @default(false)
  shownAt     DateTime?
  expiresAt   DateTime // recomputed every 24h
  createdAt   DateTime @default(now())

  @@index([userId, dismissed, expiresAt])
}

// ── Posts & Feed ──────────────────────────────────────────────────────────

model Post {
  id               String         @id @default(uuid())
  authorId         String
  author           User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  type             PostType
  content          String         @db.Text
  contentWarnings  String[]       // e.g. ["grief", "trigger warning"]
  mediaUrls        String[]
  isAnonymous      Boolean        @default(false)
  privacy          PostPrivacy    @default(CONNECTIONS_ONLY)
  resonanceCount   Int            @default(0)
  holdSpaceCount   Int            @default(0)
  commentCount     Int            @default(0)
  echoCount        Int            @default(0)
  isPinned         Boolean        @default(false)
  circleId         String?
  circle           Circle?        @relation(fields: [circleId], references: [id])
  parentPostId     String?        // for echoes
  parentPost       Post?          @relation("PostEchoes", fields: [parentPostId], references: [id])
  echoes           Post[]         @relation("PostEchoes")
  comments         Comment[]
  reactions        PostReaction[]
  moderationStatus ModerationStatus @default(APPROVED)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@index([authorId, createdAt])
  @@index([privacy, createdAt])
  @@index([circleId, createdAt])
}

model Comment {
  id               String         @id @default(uuid())
  postId           String
  post             Post           @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId         String
  author           User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  content          String         @db.Text
  isAnonymous      Boolean        @default(false)
  parentCommentId  String?
  parentComment    Comment?       @relation("CommentReplies", fields: [parentCommentId], references: [id])
  replies          Comment[]      @relation("CommentReplies")
  resonanceCount   Int            @default(0)
  reactions        CommentReaction[]
  moderationStatus ModerationStatus @default(APPROVED)
  createdAt        DateTime       @default(now())

  @@index([postId, createdAt])
}

model PostReaction {
  id        String       @id @default(uuid())
  postId    String
  post      Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      ReactionType
  isAnonymous Boolean    @default(false)  // for "Hold Space"
  createdAt DateTime     @default(now())

  @@unique([postId, userId, type])
}

model CommentReaction {
  id        String       @id @default(uuid())
  commentId String
  comment   Comment      @relation(fields: [commentId], references: [id], onDelete: Cascade)
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      ReactionType
  createdAt DateTime     @default(now())

  @@unique([commentId, userId])
}

// ── Soul Moments (Stories) ────────────────────────────────────────────────

model SoulMoment {
  id          String           @id @default(uuid())
  authorId    String
  author      User             @relation(fields: [authorId], references: [id], onDelete: Cascade)
  type        MomentType
  content     Json             // type-specific content blob
  privacy     PostPrivacy      @default(CONNECTIONS_ONLY)
  viewCount   Int              @default(0)
  viewers     MomentView[]
  expiresAt   DateTime         // +24h from createdAt
  createdAt   DateTime         @default(now())

  @@index([authorId, expiresAt])
}

model MomentView {
  id         String     @id @default(uuid())
  momentId   String
  moment     SoulMoment @relation(fields: [momentId], references: [id], onDelete: Cascade)
  viewerId   String
  viewer     User       @relation(fields: [viewerId], references: [id], onDelete: Cascade)
  viewedAt   DateTime   @default(now())

  @@unique([momentId, viewerId])
}

// ── Messaging ──────────────────────────────────────────────────────────────

model MessageThread {
  id           String    @id @default(uuid())
  type         ThreadType @default(DIRECT)
  circleId     String?
  participants ThreadParticipant[]
  messages     Message[]
  lastMessageAt DateTime?
  createdAt    DateTime  @default(now())

  @@index([lastMessageAt])
}

model ThreadParticipant {
  id              String        @id @default(uuid())
  threadId        String
  thread          MessageThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastReadAt      DateTime?
  isAdmin         Boolean       @default(false)
  joinedAt        DateTime      @default(now())

  @@unique([threadId, userId])
}

model Message {
  id               String        @id @default(uuid())
  threadId         String
  thread           MessageThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  senderId         String
  sender           User          @relation(fields: [senderId], references: [id], onDelete: Cascade)
  type             MessageType   @default(TEXT)
  content          String?       @db.Text
  mediaUrl         String?
  metadata         Json?         // type-specific metadata
  isDeleted        Boolean       @default(false)
  crisisDetected   Boolean       @default(false)
  moderationStatus ModerationStatus @default(APPROVED)
  reactions        MessageReaction[]
  createdAt        DateTime      @default(now())

  @@index([threadId, createdAt])
}

model MessageReaction {
  id         String      @id @default(uuid())
  messageId  String
  message    Message     @relation(fields: [messageId], references: [id], onDelete: Cascade)
  userId     String
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  emoji      String
  createdAt  DateTime    @default(now())

  @@unique([messageId, userId, emoji])
}

// ── Circles ────────────────────────────────────────────────────────────────

model Circle {
  id           String         @id @default(uuid())
  name         String
  description  String         @db.Text
  type         CircleType
  privacy      CirclePrivacy  @default(PUBLIC)
  coverImageUrl String?
  tags         String[]
  memberCount  Int            @default(0)
  memberLimit  Int            @default(200)
  moderatorId  String
  moderator    User           @relation("CirclesModerating", fields: [moderatorId], references: [id])
  members      CircleMember[]
  posts        Post[]
  isActive     Boolean        @default(true)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@index([type, privacy, isActive])
}

model CircleMember {
  id        String       @id @default(uuid())
  circleId  String
  circle    Circle       @relation(fields: [circleId], references: [id], onDelete: Cascade)
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      CircleRole   @default(MEMBER)
  joinedAt  DateTime     @default(now())

  @@unique([circleId, userId])
}

// ── Soul Prompts ───────────────────────────────────────────────────────────

model SoulPrompt {
  id        String   @id @default(uuid())
  text      String   // The question text
  category  String   // 'introspection' | 'growth' | 'relationship' | 'healing' | 'fun'
  isActive  Boolean  @default(true)
  usedCount Int      @default(0)
  createdAt DateTime @default(now())
}

model UserSoulPromptAnswer {
  id         String     @id @default(uuid())
  userId     String
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  promptId   String
  prompt     SoulPrompt @relation(fields: [promptId], references: [id])
  answer     String     @db.Text
  isPublic   Boolean    @default(true)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  @@unique([userId, promptId])
}

// ── Professional Endorsements ──────────────────────────────────────────────

model PractitionerEndorsement {
  id           String   @id @default(uuid())
  endorserId   String
  endorser     User     @relation("EndorsementsGiven", fields: [endorserId], references: [id])
  endorseeId   String
  endorsee     User     @relation("EndorsementsReceived", fields: [endorseeId], references: [id])
  skill        String
  level        String   // 'basic' | 'proficient' | 'expert'
  note         String?
  isPublic     Boolean  @default(true)
  createdAt    DateTime @default(now())

  @@unique([endorserId, endorseeId, skill])
}

// ── Content Moderation ─────────────────────────────────────────────────────

model ModerationEvent {
  id           String           @id @default(uuid())
  contentType  String           // 'post' | 'comment' | 'message' | 'moment'
  contentId    String
  authorId     String
  author       User             @relation(fields: [authorId], references: [id])
  scores       Json             // { toxicity, selfHarm, hateSpeech, spam, ... }
  autoDecision String           // 'approve' | 'hold' | 'remove'
  humanStatus  String           @default("not_needed")
  humanDecision String?
  reviewedBy   String?
  isCrisis     Boolean          @default(false)
  createdAt    DateTime         @default(now())

  @@index([authorId])
  @@index([isCrisis, humanStatus])
}

// ── Enums ──────────────────────────────────────────────────────────────────

enum ConnectionStatus {
  PENDING
  CONNECTED
  DECLINED
  BLOCKED
}

enum ConnectionIntent {
  ROMANTIC
  PLATONIC
  GROWTH_PARTNER
  ACCOUNTABILITY
  GRIEF_SUPPORT
  CO_HEALING
  PROFESSIONAL
}

enum PostType {
  SOUL_NOTE
  SOUL_POST
  CONSTELLATION_SHARE
  MILESTONE
  MOOD_CHECKIN
  QUOTE
  SESSION_REFLECTION
}

enum PostPrivacy {
  PUBLIC
  CONNECTIONS_ONLY
  PRIVATE
}

enum ReactionType {
  RESONATE
  HOLD_SPACE
  CELEBRATE
  SUPPORT
  GRATEFUL
  PEACE
}

enum MomentType {
  TEXT
  IMAGE
  MOOD_SNAPSHOT
  AFFIRMATION
  CONSTELLATION
  POLL
  QUESTION
  QUOTE
  MILESTONE
}

enum ThreadType {
  DIRECT
  GROUP
  CIRCLE
}

enum MessageType {
  TEXT
  IMAGE
  CONSTELLATION_SHARE
  MOOD_SHARE
  VOICE
  AFFIRMATION_GIFT
  SESSION_INVITE
  RESOURCE_SHARE
}

enum CircleType {
  SUPPORT
  COMMUNITY
  STUDY
  CRISIS
}

enum CirclePrivacy {
  PUBLIC
  PRIVATE
  INVITE_ONLY
}

enum CircleRole {
  MEMBER
  MODERATOR
  ADMIN
}

enum ModerationStatus {
  APPROVED
  HELD
  REMOVED
}
```

---

## 15. Backend API Spec

### Base: `/api/v1/connections`

#### Social Graph
```
GET    /connections/matches               # AI match queue for current user
POST   /connections/request              # Send connection request
PATCH  /connections/:id/accept           # Accept connection
PATCH  /connections/:id/decline          # Decline connection
DELETE /connections/:id                  # Disconnect / unmatch
GET    /connections/list                 # User's active connections
POST   /connections/follow/:userId       # Follow a user
DELETE /connections/follow/:userId       # Unfollow
GET    /connections/followers            # My followers
GET    /connections/following            # Who I follow
POST   /connections/block/:userId        # Block
DELETE /connections/block/:userId        # Unblock
```

#### Feed & Posts
```
GET    /feed                             # Personalized "For You" feed
GET    /feed/following                   # Chronological following feed
GET    /feed/trending                    # Trending posts
POST   /posts                            # Create post
GET    /posts/:id                        # Get post
PATCH  /posts/:id                        # Edit post
DELETE /posts/:id                        # Delete post
POST   /posts/:id/react                  # Add reaction
DELETE /posts/:id/react                  # Remove reaction
POST   /posts/:id/echo                   # Echo (repost)
GET    /posts/:id/comments               # Get comments
POST   /posts/:id/comments               # Add comment
DELETE /posts/:id/comments/:commentId    # Delete comment
POST   /posts/:id/report                 # Report post
```

#### Soul Moments (Stories)
```
GET    /moments/feed                     # Moments from following
POST   /moments                          # Create a moment
DELETE /moments/:id                      # Delete a moment
POST   /moments/:id/view                 # Record a view
GET    /moments/:id/viewers              # Who viewed (author only)
```

#### Messaging
```
GET    /messages/threads                 # All DM threads
GET    /messages/threads/:id             # Messages in thread
POST   /messages/threads/:id/send        # Send a message
POST   /messages/thread                  # Start new DM thread
PATCH  /messages/threads/:id/read        # Mark all as read
POST   /messages/:id/react               # React to message
DELETE /messages/:id                     # Delete message
```

#### Circles
```
GET    /circles                          # Discover circles
GET    /circles/mine                     # Circles I'm in
POST   /circles                          # Create circle (practitioners + verified users)
GET    /circles/:id                      # Circle detail
PATCH  /circles/:id                      # Update circle (admin only)
POST   /circles/:id/join                 # Join circle
DELETE /circles/:id/leave                # Leave circle
GET    /circles/:id/feed                 # Circle post feed
POST   /circles/:id/invite               # Invite user to circle
```

#### Professional Network
```
GET    /professional/practitioners       # Browse practitioners
GET    /professional/practitioners/:id   # Practitioner profile
POST   /professional/endorse             # Endorse a skill
DELETE /professional/endorse/:id         # Remove endorsement
GET    /professional/endorsements/:userId # View endorsements
```

#### Soul Prompts
```
GET    /prompts                          # Get 3 random active prompts
POST   /prompts/answer                   # Save an answer
GET    /prompts/answers/:userId          # Get user's public answers
DELETE /prompts/answers/:promptId        # Remove an answer
```

---

## 16. Frontend Screen Map (26 screens)

| Screen | Route | Component Path |
|---|---|---|
| 1 | `/dashboard/connections` | `src/pages/dashboard/ConnectionsPage.tsx` (replace current) |
| 2 | `/dashboard/connections/matches` | `src/features/connections/pages/MatchQueuePage.tsx` |
| 3 | `/dashboard/connections/messages` | `src/features/connections/pages/MessagesPage.tsx` |
| 4 | `/dashboard/connections/messages/:threadId` | `src/features/connections/pages/MessageThreadPage.tsx` |
| 5 | `/dashboard/connections/explore` | `src/features/connections/pages/DiscoverFeedPage.tsx` |
| 6 | `/dashboard/connections/explore/trending` | `src/features/connections/pages/TrendingFeedPage.tsx` |
| 7 | `/dashboard/connections/profile/:userId` | `src/features/connections/pages/SoulProfilePage.tsx` |
| 8 | `/dashboard/connections/post/:postId` | `src/features/connections/pages/PostDetailPage.tsx` |
| 9 | `/dashboard/connections/create-post` | `src/features/connections/pages/CreatePostPage.tsx` |
| 10 | `/dashboard/connections/moments/create` | `src/features/connections/pages/CreateMomentPage.tsx` |
| 11 | `/dashboard/connections/moments/:userId` | `src/features/connections/pages/MomentViewerPage.tsx` |
| 12 | `/dashboard/connections/circles` | `src/features/connections/pages/CirclesPage.tsx` |
| 13 | `/dashboard/connections/circles/:circleId` | `src/features/connections/pages/CircleDetailPage.tsx` |
| 14 | `/dashboard/connections/circles/create` | `src/features/connections/pages/CreateCirclePage.tsx` |
| 15 | `/dashboard/connections/professional` | `src/features/connections/pages/ProfessionalNetworkPage.tsx` |
| 16 | `/dashboard/connections/settings` | `src/features/connections/pages/ConnectionsSettingsPage.tsx` |

**Key Components:**
| Component | Path |
|---|---|
| SoulCard | `src/features/connections/components/SoulCard.tsx` |
| MatchCard | `src/features/connections/components/MatchCard.tsx` |
| PostCard | `src/features/connections/components/PostCard.tsx` |
| StoriesBar | `src/features/connections/components/StoriesBar.tsx` |
| MessageBubble | `src/features/connections/components/MessageBubble.tsx` |
| CircleCard | `src/features/connections/components/CircleCard.tsx` |
| SoulPromptCard | `src/features/connections/components/SoulPromptCard.tsx` |
| ConnectionRequestModal | `src/features/connections/components/ConnectionRequestModal.tsx` |
| ContentWarningWrapper | `src/features/connections/components/ContentWarningWrapper.tsx` |
| ReactionBar | `src/features/connections/components/ReactionBar.tsx` |

---

## 17. Implementation Roadmap

### Phase 1 — Foundation (Week 1-2, ~40h)
- [ ] Add all Prisma models (Section 14)
- [ ] Run migrations
- [ ] Implement social graph APIs (follow/block/connection request)
- [ ] Replace hardcoded ConnectionsPage with real match queue from API
- [ ] Create SoulCard + MatchCard components
- [ ] Wire connection request flow (send → accept → declined)

### Phase 2 — Feed & Posts (Week 3-4, ~40h)
- [ ] Implement Post CRUD API
- [ ] Implement "Following" feed API (chronological)
- [ ] Build PostCard component with all reaction types
- [ ] Build CreatePostPage (all 7 post types)
- [ ] Implement AI moderation pipeline (keyword → OpenAI → human queue)
- [ ] Build DiscoverFeedPage ("For You" algorithmic feed)

### Phase 3 — Matching Algorithm (Week 5, ~24h)
- [ ] Build constellation feature vector computation
- [ ] Implement mood pattern correlation
- [ ] Implement astro compatibility matrix
- [ ] Wire nightly `computeMatchBatch` background job
- [ ] Build MatchQueuePage with swipe/pass UX

### Phase 4 — Messaging (Week 6-7, ~32h)
- [ ] Implement MessageThread + Message CRUD
- [ ] Build MessagesPage + MessageThreadPage
- [ ] Add real-time delivery via existing WebSocket service
- [ ] Implement crisis detection in messages
- [ ] Build all 8 message types

### Phase 5 — Soul Moments (Week 8, ~20h)
- [ ] Implement SoulMoment CRUD
- [ ] Build CreateMomentPage
- [ ] Build StoriesBar + MomentViewerPage
- [ ] Wire mood-snapshot auto-generation

### Phase 6 — Circles (Week 9-10, ~32h)
- [ ] Implement Circle CRUD + member management
- [ ] Build CirclesPage + CircleDetailPage
- [ ] Implement circle feed (scoped posts)
- [ ] Anonymous posting within circles

### Phase 7 — Professional Network (Week 11, ~16h)
- [ ] Implement endorsement system
- [ ] Build ProfessionalNetworkPage
- [ ] Extend SoulProfilePage for practitioners

### Phase 8 — SoulProfile Page (Week 12, ~24h)
- [ ] Build full SoulProfilePage (all 8 sections)
- [ ] Soul prompts: setup + answer + display
- [ ] Constellation snapshot (read-only mini view)
- [ ] Profile completeness score

---

## 18. Revenue Model

| Feature | Tier | Price |
|---|---|---|
| View all match requests at once (vs 1 at a time) | Premium (Seeker ₹499/mo) | Included |
| Send unlimited connection requests | Premium | Included |
| See who viewed your profile (past 7 days) | Premium | Included |
| "Soul Boost" — appear at top of match queue for 24h | Micro-transaction | ₹49 per boost |
| "Profile Highlight" — golden ring on discovery | Micro-transaction | ₹99 for 7 days |
| Read receipts in DMs | Premium | Included |
| Create private Support Circle (requires practitioner) | Practitioner paid tier | Included |
| Endorse practitioners (unlimited) | Practitioner tier | Included |
| Priority moderation response | Premium | Included |

**Estimated additional ARR at 10,000 users:**
- 20% convert to Premium (₹499/mo × 2,000 users) = ₹9,98,000/mo
- Soul Boost micro-transactions (~500/mo × ₹49) = ₹24,500/mo
- **Total incremental: ~₹10,22,500/month (~₹1.2 Cr/year)**

---

*This document is the single source of truth for the Connections feature. All implementation must follow the specs, models, and screen map defined here.*

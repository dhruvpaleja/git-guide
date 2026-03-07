# Soul Constellation — 100/100 Feature Plan

**Feature:** Soul Constellation (Emotional Mapping + AI Insights)  
**Version:** 2.0 — Complete product and engineering spec  
**Date:** 2026-03-06  
**Current State:** ~60/100 (frontend implemented, backend 501, local state only, no persistence)  
**Target:** 100/100 (real-time AI insights, full persistence, social sharing, practitioner view, mobile-ready)

---

## What Soul Constellation Is (and Why It Matters)

> **"The first emotional map that learns you."**

Soul Constellation is Soul Yatri's most original and defensible feature. No competitor — Calm, BetterHelp, YourDOST, Co-Star, Woebot — has anything like it. It is:

1. **An emotional knowledge graph**: a user-created network of nodes (life domains, people, feelings, events) connected by weighted edges (harmony, friction, evolving, neutral)
2. **An AI insight engine**: patterns in the graph trigger GPT-4o-mini-generated insights — "you haven't added a Joy node in 18 days; here's what that might mean"
3. **A therapy preparation tool**: before a session, the therapist can view the client's constellation to understand the emotional landscape without re-asking everything
4. **A training dataset**: every node, connection, intensity change is a structured labeled datapoint for mental health AI training
5. **A social signal**: users can share individual nodes or insight cards to the Connections feed, enabling emotional resonance matches

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Node Architecture](#2-node-architecture)
3. [Connection Architecture](#3-connection-architecture)
4. [AI Insight Engine](#4-ai-insight-engine)
5. [Temporal Evolution (Time Travel)](#5-temporal-evolution-time-travel)
6. [Practitioner View](#6-practitioner-view)
7. [Social Layer Integration](#7-social-layer-integration)
8. [Vedic Astrology Integration](#8-vedic-astrology-integration)
9. [Mobile Experience](#9-mobile-experience)
10. [Gamification & Engagement Loops](#10-gamification--engagement-loops)
11. [Data Model (Prisma)](#11-data-model-prisma)
12. [Backend API Spec](#12-backend-api-spec)
13. [Frontend Architecture](#13-frontend-architecture)
14. [Implementation Roadmap](#14-implementation-roadmap)
15. [AI Training Value](#15-ai-training-value)

---

## 1. Current State Assessment

### What's Working (60/100)
- ✅ `ConstellationCanvas.tsx` — interactive SVG canvas with drag/zoom/pan
- ✅ `useConstellation.ts` — state management hook (CRUD operations wired to service layer)
- ✅ `constellation.service.ts` — API service with **dev mock fallback** (fetches from real API first, falls back to mock if 404/501)
- ✅ Node display, connection display, animated connection lines
- ✅ Insight cards panel (UI only)
- ✅ NodeDetailPanel, InsightsPanel components exist
- ✅ Loading + Error states implemented correctly
- ✅ Category configs (8 categories) + Emotion configs (30+ emotions)
- ✅ Filter by category
- ✅ Zoom + pan with mouse/touch

### What's Missing (to reach 100/100)
- ❌ **Backend routes return 501** — ALL constellation data is mock; nothing persists to DB
- ❌ **No Prisma models** — ConstellationNode/Connection/Insight don't exist in schema
- ❌ **No AI node generation engine** — nodes should be created by AI from mood logs, journals, chat, onboarding, therapy transcripts; NOT by users manually
- ❌ **Manual AddNodeModal must be removed** — replaced with AI generation entry points (journal, chat, daily prompt)
- ❌ **No AI insight generation** — insights are hardcoded in mock data
- ❌ **No temporal history** — can't see how constellation evolved over time
- ❌ **No practitioner view** — therapist cannot see client's constellation
- ❌ **No social sharing** — can't share nodes/insights to Connections feed
- ❌ **No Vedic astrology overlay** — planetary houses not mapped to nodes
- ❌ **No mobile-optimized experience** — canvas is desktop-first
- ❌ **No collaborative annotation** — therapist/astrologer can't add notes to nodes
- ❌ **No mood correlation** — constellation not linked to mood history
- ❌ **No notification triggers** — "your anxiety node has been at 8/10 for 5 days straight"

---

## 2. AI-First Node Generation — Core Architecture Principle

> **"Users do not add nodes. The AI does. The constellation is a mirror, not a canvas."**

This is the single most important architectural decision in the feature. Every node in a user's constellation is created, labelled, and positioned by AI. Users interact with a reflection of their inner world — they don't construct it manually.

### 2a. Why AI-First (not user-created)

**The problem with user-created nodes:**
- Cognitive overhead: users don't know what to add, how to categorize, what intensity means
- Sampling bias: users only add what they consciously recognize — AI catches patterns they miss
- Abandonment: empty "add your first node" states have high drop-off
- Inaccuracy: users rarely name their own emotions correctly (it's called the "affect labelling" problem in psychology)
- No longitudinal growth: a manually-maintained map requires discipline; an AI-maintained map grows automatically as the user lives their life on the platform

**The AI-first advantage:**
- Zero friction: the constellation grows silently every time the user journals, logs a mood, chats with SoulBot, or completes a session
- Richer insight: AI detects sub-patterns the user would never consciously surface
- Delightful surprise: users open the app and discover "the AI noticed your anxiety spike 3 days ago — it added a node for it"
- Better data: structured, consistent, normalised emotional data (vs. inconsistent user-typed labels)

### 2b. The 6 Node Generation Sources

Nodes are generated from 6 data pipelines, each running after a user interaction:

| Source | Trigger | AI Prompt Style | Latency | Example Output |
|---|---|---|---|---|
| **Mood Log** | `POST /health-tools/mood` | Emotion classification + intensity mapping | < 3 seconds (async) | "Anxiety (career)" node at intensity 6 |
| **Journal Entry** | `POST /health-tools/journal` | Deep NLP: topic extraction + emotion tagging | < 10 seconds (async) | 3-4 nodes: "Mother Conflict", "Financial Fear", "Creative Longing" |
| **SoulBot Chat** | After each conversation turn | Continuous pattern extraction | < 5 seconds (async, batched) | Updates existing nodes or creates new ones based on topics raised |
| **Onboarding Answers** | `/personalize` form completion | One-time full-context extraction | < 15 seconds | 6-10 seed nodes covering all life areas mentioned |
| **Therapy Session Transcript** | Post-session Whisper transcription | Deepest extraction: Jungian themes, attachment patterns, core wounds | < 60 seconds (post-session) | High-quality nodes like "Avoidant Attachment Pattern", "Inner Critic" |
| **Vedic Astrology Profile** | On birth-chart computation | House-to-category mapping + current dasha/transit | < 5 seconds | Auto-generates planetary nodes like "Saturn (Career House)", "Rahu (Transformation)" |

### 2c. AI Node Extraction Pipeline

Each source runs through the same 4-step pipeline:

```
Step 1: Source Preprocessing
  → Normalise text (fix typos, expand abbreviations)
  → Remove PII (phone numbers, email addresses, names → replace with [person])
  → Chunk if needed (long journal entries split into 500-token chunks)

Step 2: GPT-4o Extraction Pass
  → System prompt: role as clinical psychologist + emotion taxonomy
  → Extract: {label, category, emotion, intensity, description, tags, nodeType}
  → Return: JSON array of candidate nodes (0-5 nodes per source event)
  → Constraint: label max 30 chars, description max 150 chars, intensity 1-10

Step 3: Merge / Deduplicate Against Existing Nodes
  → Embed new candidates + existing nodes (text-embedding-3-small)
  → Cosine similarity: if new candidate matches existing node (similarity > 0.85):
      → UPDATE existing node's intensity (weighted average)
      → Append to node's note history
      → Do NOT create a duplicate node
  → If no match: CREATE new node

Step 4: Position Assignment
  → New nodes placed with force-directed layout to avoid overlap
  → Category-based clustering: nodes of same category gravitate together
  → Orbit radius from "Self" core node based on intensity (higher = closer)
```

### 2d. Node Extraction Prompt (exact)

```typescript
const NODE_EXTRACTION_SYSTEM = `You are a clinical psychologist AI analyzing a user's emotional state.
Extract 0-5 emotional constellation nodes from the input text.
Each node represents ONE significant emotional theme, pattern, person, event, or internal experience.

Return ONLY a JSON array. Each object:
{
  "label": "string (max 30 chars, specific, no generic words like 'emotions')",
  "category": "self|career|relationship|health|family|spiritual|creative|external",
  "emotion": "joy|sadness|anger|fear|anxiety|peace|confusion|hope|grief|excitement|burnout|neutral|shame|guilt|loneliness|overwhelm|frustration|resentment|numb|curious",
  "intensity": integer 1-10,
  "description": "string (max 150 chars, factual, not interpretive)",
  "nodeType": "emotion|person|event|pattern|goal|fear|value|memory|archetype",
  "tags": ["array", "of", "2-4", "tags"]
}

Rules:
- Extract only CLEARLY present themes (not speculative)
- Prefer specific over generic: "Mother's Criticism" > "Family Issues"
- Set intensity based on frequency/emphasis: passing mention=2, repeated=5, central theme=8
- Do NOT extract: PII, location data, or content about other people's mental health
- If the text contains crisis signals (self-harm, suicidal ideation): return [] and flag separately
- Return [] if no meaningful emotional content`;
```

### 2e. User Controls Over AI-Generated Nodes

Users CANNOT create nodes from scratch. They CAN:

| Control | UX Action | Effect |
|---|---|---|
| **Adjust intensity** | Drag slider in NodeDetailPanel | Updates node intensity +/- 2 points from AI value |
| **Pin node** | Tap pin icon | Node stays prominent; excluded from auto-archive |
| **Hide node** | Tap hide icon | Node removed from view but retained in DB (useful for irrelevant AI guesses) |
| **React to node** | "This resonates" / "Not accurate" | Feeds back into AI extraction quality; RLHF signal |
| **Add a note** | Text field in NodeDetailPanel | Private annotation on AI-created node |
| **Rename node** | Edit label in NodeDetailPanel | Can correct AI's label (e.g., "Mother's Criticism" → "Mum's Expectations") |
| **Share node** | Share to Connections feed | Creates a post from the node |

Users CANNOT:
- Create a node from scratch with a blank form
- Set the category or emotion type directly (can only provide feedback on AI's classification)
- Delete a node permanently (can only hide; deletion requires Settings > Privacy > Node Management)

### 2f. First-Run Experience (Empty Constellation)

When a new user opens the constellation for the first time (0 nodes):

**Instead of "Add your first node +" button**, they see:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ✨ Your constellation is being mapped                         │
│                                                                 │
│   Your emotional universe takes shape as you:                   │
│   📓 Write in your journal                                       │
│   😊 Log your daily mood                                         │
│   💬 Chat with SoulBot                                           │
│   🔭 Complete your onboarding                                    │
│                                                                 │
│   [ Start Journaling → ]    [ Chat with SoulBot → ]             │
│                                                                 │
│   Or, if you've already set up your profile:                    │
│   [ Generate from my profile → ]  (triggers onboarding re-run) │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2g. Node Origin Badge

Every node shows a small origin badge indicating which source created it:

| Source | Badge | Icon | Tooltip |
|---|---|---|---|
| Mood log | `mood` | 😊 | "Detected from your mood log on [date]" |
| Journal | `journal` | 📓 | "Extracted from your journal entry" |
| SoulBot chat | `chat` | 💬 | "Noticed during your SoulBot conversation" |
| Onboarding | `profile` | 🌟 | "Mapped from your onboarding profile" |
| Therapy session | `session` | 🎙️ | "From your therapy session on [date]" |
| Astrology | `astro` | 🔮 | "From your Vedic astrology profile" |
| Pattern (recurring) | `pattern` | 🔁 | "AI detected a recurring pattern across [N] sessions" |

These badges are displayed as small chips on each node in the canvas and in the NodeDetailPanel.

---

## 3. Node Architecture (Technical Details)

### 3a. Node Categories (8)

| Category | Color | Icon | Description |
|---|---|---|---|
| `self` | `#6366f1` (indigo) | Fingerprint | Core identity, self-perception, inner world |
| `family` | `#ec4899` (pink) | Home | Family members, family dynamics, ancestry |
| `career` | `#f59e0b` (amber) | Briefcase | Work, career goals, professional identity |
| `health` | `#10b981` (emerald) | Heart | Physical health, mental health, body relationship |
| `relationship` | `#f43f5e` (rose) | Users | Romantic, platonic, social connections |
| `spiritual` | `#8b5cf6` (violet) | Sparkles | Spiritual practice, beliefs, cosmic connection |
| `creative` | `#06b6d4` (cyan) | Palette | Creative expression, hobbies, passions |
| `external` | `#64748b` (slate) | Globe | World events, environment, societal pressures |

### 3b. Emotion Taxonomy (40 emotions across 5 dimensions)

```typescript
const EMOTION_TAXONOMY = {
  // Valence: Positive
  joy:         { valence: 1,  arousal: 0.8, color: '#fbbf24' },
  gratitude:   { valence: 1,  arousal: 0.4, color: '#a3e635' },
  hope:        { valence: 0.8, arousal: 0.6, color: '#34d399' },
  love:        { valence: 1,  arousal: 0.7, color: '#f472b6' },
  peace:       { valence: 0.9, arousal: 0.1, color: '#7dd3fc' },
  pride:       { valence: 0.8, arousal: 0.6, color: '#c084fc' },
  excitement:  { valence: 0.9, arousal: 0.9, color: '#fb923c' },
  awe:         { valence: 0.8, arousal: 0.5, color: '#818cf8' },
  contentment: { valence: 0.8, arousal: 0.2, color: '#86efac' },

  // Valence: Neutral/Mixed
  neutral:     { valence: 0.5, arousal: 0.3, color: '#94a3b8' },
  curious:     { valence: 0.6, arousal: 0.7, color: '#60a5fa' },
  nostalgic:   { valence: 0.6, arousal: 0.3, color: '#d8b4fe' },
  ambivalent:  { valence: 0.5, arousal: 0.4, color: '#a8a29e' },
  numb:        { valence: 0.3, arousal: 0.1, color: '#475569' },

  // Valence: Negative
  sadness:     { valence: 0.2, arousal: 0.2, color: '#93c5fd' },
  anxiety:     { valence: 0.1, arousal: 0.9, color: '#fde68a' },
  fear:        { valence: 0.1, arousal: 0.8, color: '#fca5a5' },
  anger:       { valence: 0.1, arousal: 0.9, color: '#f87171' },
  grief:       { valence: 0.1, arousal: 0.3, color: '#a5b4fc' },
  shame:       { valence: 0.1, arousal: 0.5, color: '#cbd5e1' },
  guilt:       { valence: 0.2, arousal: 0.5, color: '#d1d5db' },
  loneliness:  { valence: 0.2, arousal: 0.2, color: '#bfdbfe' },
  overwhelm:   { valence: 0.2, arousal: 0.9, color: '#fdba74' },
  burnout:     { valence: 0.1, arousal: 0.2, color: '#e2e8f0' },
  frustration: { valence: 0.2, arousal: 0.7, color: '#fcd34d' },
  resentment:  { valence: 0.1, arousal: 0.5, color: '#fca5a5' },
  despair:     { valence: 0.05, arousal: 0.15, color: '#6b7280' },
  // + 16 more...
}
```

Each emotion maps to `(valence, arousal)` — the 2D emotion space used by Russell's Circumplex Model of Affect. This enables mathematical computation of emotional distance between nodes.

### 3c. Node Intensity (1-10 scale)

The intensity scale has semantic labels at key thresholds:
- **1-2**: "Barely present" — subtle background awareness
- **3-4**: "Noticeable" — affects daily thoughts occasionally
- **5-6**: "Significant" — affects behavior and decisions
- **7-8**: "Dominant" — major focus of mental energy
- **9-10**: "Consuming" — crisis-level intensity

When a node reaches intensity ≥ 8, the system:
1. Marks the node visually with a pulsing red glow
2. Creates an AI insight: "Your [category] node has been at high intensity for [N] days"
3. If `health` or `self` category at ≥ 9: creates a therapy booking nudge notification
4. If `crisis` keywords in node description + intensity ≥ 8: triggers crisis protocol

### 3d. Node Types (extended)

```typescript
type NodeType =
  | 'emotion'      // A feeling or emotional state
  | 'person'       // A person in your life
  | 'event'        // A past or upcoming event
  | 'pattern'      // A recurring behavioral pattern
  | 'goal'         // Something you're working toward
  | 'fear'         // A specific fear or avoidance
  | 'value'        // A core value or belief
  | 'memory'       // A significant memory
  | 'archetype'    // Jungian archetype (shadow, anima, persona, etc.)
  | 'planet'       // Auto-created from astrology profile (Rahu, Ketu, Saturn, etc.)
```

### 3e. Node Size Algorithm

Node size is dynamically computed (not just stored) from:
```typescript
computeNodeSize(node: ConstellationNode): number {
  const intensityFactor = node.intensity / 10;         // 0.1 - 1.0
  const ageFactor = 1 - Math.min(daysSince(node.createdAt) / 90, 0.5); // older = smaller
  const connectionFactor = 1 + (connectionCount * 0.1);  // more connections = larger
  const pinnedBonus = node.isPinned ? 0.2 : 0;
  
  return Math.max(0.6, Math.min(2.0,
    (intensityFactor * 0.5 + ageFactor * 0.3 + connectionFactor * 0.2) + pinnedBonus
  ));
}
```

### 3a. Connection Types (4)

| Type | Color | Meaning | Visual |
|---|---|---|---|
| `harmony` | Green → Teal | These two nodes support each other; mutual reinforcement | Solid flowing curve |
| `friction` | Red → Pink | These two nodes create tension; opposing forces | Dashed jagged curve |
| `neutral` | Grey | Exists together; no strong relationship | Thin faint line |
| `evolving` | Purple → Indigo | Relationship is changing; transitional | Animated pulse |

### 3b. Connection Strength (1-5)

Mapped to visual stroke width and opacity:
- 1: Thin, faint — barely related
- 3: Medium — moderate relationship
- 5: Thick, bright — deeply intertwined

### 3c. Connection Suggestions (AI-generated)

After creating 5+ nodes, the AI scans for:

1. **High-probability harmonic pairs**: nodes in categories known to reinforce each other (e.g., `spiritual` + `health` often harmonize; `career` + `health` often friction)
2. **Temporal co-occurrence**: two nodes both created or intensified within 3 days of each other — likely related
3. **Semantic similarity**: node labels/descriptions with high cosine similarity in embedding space

The suggestion appears as a dim dashed line between potential nodes with a "+" button to confirm or "×" to dismiss.

```typescript
interface ConnectionSuggestion {
  sourceId: string;
  targetId: string;
  suggestedType: ConnectionType;
  confidence: number;     // 0-1
  reason: string;         // "These nodes were both intensified on the same day"
  dismissed: boolean;
}
```

### 3d. Connection Conflict Detection

When a user creates a `harmony` connection between two nodes that semantically conflict (e.g., connecting `Joy` and `Grief` as harmony), the AI gently notes:
> "These nodes seem contradictory. Sometimes opposing feelings can coexist — you might label this as 'evolving' instead of 'harmony'. What does this connection mean to you?"

This generates rich therapeutic data about the user's relationship between conflicting emotions.

---

## 4. AI Insight Engine

### 4a. Insight Categories

| Category | Description | Trigger |
|---|---|---|
| `intensity_spike` | A node jumped 3+ intensity points in 7 days | Node intensity Δ ≥ 3 in 7d window |
| `prolonged_high` | A node has been at high intensity for 5+ days | Intensity ≥ 7 for 5+ consecutive days |
| `cluster_pattern` | 3+ nodes in same category all at high intensity | 3+ nodes in category with avg intensity ≥ 7 |
| `isolation_signal` | No Joy/Hope/Peace nodes exist; only negative nodes | 0 positive valence nodes for 14+ days |
| `new_low` | User's average constellation valence hit a new 30-day low | Daily valence average < (personal 30d min - 0.1) |
| `connection_gap` | Two heavily connected nodes both spiked simultaneously | Both nodes in harmony connection spiked together |
| `friction_escalation` | A friction connection's source nodes both intensified | Friction connection + both nodes ≥ 7 |
| `growth_signal` | A positive node was created or intensified | New joy/hope/peace/love/gratitude node |
| `balance_achievement` | User has both high-intensity positive AND negative nodes | Indicates emotional complexity; healthy signal |
| `stagnation` | No nodes added or updated in 14+ days | Last update > 14d ago |
| `astro_correlation` | Node emotion aligns with current planetary transit | Matches transit keywords to node emotions |
| `therapy_prep` | Upcoming therapy session + high-intensity cluster | Session in < 48h AND cluster pattern active |

### 4b. Insight Generation Prompt

```typescript
const generateInsightPrompt = (node: ConstellationNode, context: InsightContext): string => `
You are a compassionate mental wellness AI assistant for Soul Yatri, an Indian mental health platform.

Analyze this user's emotional constellation node and generate a brief, warm insight.
The insight should help the user understand their emotional pattern WITHOUT being diagnostic.
Tone: gentle, curious, non-judgmental, supportive.
Length: 2-3 sentences max.
Language: simple English (B2 level); avoid clinical jargon.

Node: "${node.label}" (Category: ${node.category}, Emotion: ${node.emotion}, Intensity: ${node.intensity}/10)
Node description: "${node.description}"

Trigger: ${context.triggerType}
Context: ${JSON.stringify(context.additionalContext)}

User profile summary: ${context.userProfileSummary}

Generate ONE insight that:
1. Acknowledges the emotional reality
2. Offers a curious/exploratory frame
3. Suggests one gentle next step (not prescriptive)

Do NOT: diagnose, use DSM terms, tell user what they feel, make strong claims about their mental health.
`;
```

### 4c. Insight Delivery

Insights are delivered through 3 channels:

1. **In-app InsightsPanel**: visible on the right side of the canvas (already built); shows all unread insights as cards
2. **Push notification**: "Your constellation has a new insight 🌟" — opens directly to the relevant node
3. **Weekly Constellation Report**: email + in-app digest of the week's most significant insight + change summary

### 4d. Insight Quality Score

Every insight gets rated by the user (👍 / 👎). Ratings stored as:
```prisma
model ConstellationInsightFeedback {
  id        String   @id @default(uuid())
  insightId String
  userId    String
  rating    Int      // 1 (helpful) or -1 (not helpful)
  comment   String?
  createdAt DateTime @default(now())
}
```

Used to:
- Fine-tune insight generation prompts (RL from human feedback)
- Track which trigger types generate the most helpful insights
- Create a quality score per trigger type

---

## 5. Temporal Evolution (Time Travel)

This is the most unique capability in the constellation feature.

### 5a. Snapshot System

Every 24h at midnight IST, the system creates a lightweight snapshot of the user's constellation:

```prisma
model ConstellationSnapshot {
  id        String   @id @default(uuid())
  userId    String
  date      DateTime @db.Date   // just the date, one per day
  snapshot  Json     // compressed node state array
  valence   Float    // avg valence score of all nodes (0-1)
  arousal   Float    // avg arousal score of all nodes (0-1)
  nodeCount Int
  createdAt DateTime @default(now())

  @@unique([userId, date])
  @@index([userId, date])
}
```

The `snapshot` JSON is compressed (only stores delta from previous day) to minimize storage.

### 5b. Time Travel UI

A timeline scrubber appears at the bottom of the constellation canvas:

```
[←] [Jan 1] ──────●────────────────[Mar 6]─── [→]
     Past                            Today
```

- Dragging the scrubber animates the constellation to its state on that date
- Nodes that didn't exist yet fade out
- Nodes that existed show their historical intensity (represented by size/opacity)
- Connection lines show their historical type and strength
- A "Comparison Mode" overlays today's constellation on a past date (ghost nodes)

### 5c. Time Travel Insights

```
"Your Anxiety node was at 3/10 on January 15. Today it's at 7/10.
The spike started around February 3 — the same week you added 
the 'New Job Pressure' node. These two seem connected."
```

This is the single most powerful insight format — showing change over time with correlation.

### 5d. Emotional Trajectory Score

A single derived number (0-100) representing the 30-day emotional trajectory:
```
Trajectory = (currentValence - valence30dAgo) × 50 + 50
           = 0  → deeply worsening
           = 50 → stable
           = 100 → dramatically improving
```

Displayed on the constellation header as a subtle badge. Used in the Soul Health Index calculation.

---

## 6. Practitioner View

### 6a. Access Model

A user can grant their therapist or astrologer view-only access to their constellation:

```prisma
model ConstellationAccess {
  id             String   @id @default(uuid())
  userId         String   // constellation owner
  practitionerId String
  accessLevel    String   // 'view' | 'annotate'
  grantedAt      DateTime @default(now())
  revokedAt      DateTime?
  isActive       Boolean  @default(true)
  
  @@unique([userId, practitionerId])
}
```

Granting access is prompted:
- During therapy booking: "Would you like Dr. [Name] to see your constellation before your session?"
- After 3 sessions: "Your therapist may benefit from seeing your emotional map"
- The user can revoke at any time from Settings

### 6b. Practitioner View Features

When a therapist/astrologer opens a client's constellation:

1. **Read-only canvas** — same beautiful canvas, but nodes cannot be moved/edited
2. **Annotation layer** — practitioner can add sticky notes to nodes (visible only to them, not the client):
   ```
   "Client associates this with their mother's illness in 2021 — explore in next session"
   ```
3. **Session prep view** — shows constellation state as of 24h before the next scheduled session
4. **Change highlights** — nodes that changed intensity ≥ 2 since last session are highlighted in gold
5. **Crisis indicators** — any node with intensity ≥ 9 is highlighted with a pulsing red border
6. **Practitioner insights panel** — AI-generated session preparation brief:
   ```
   "Since your last session 2 weeks ago:
   - 'Family Conflict' node: 4 → 8 (significant escalation)
   - New node added: 'Financial Anxiety' (intensity 6)
   - 'Career Burnout' node: 7 → 5 (improving)
   
   Suggested focus areas: family conflict escalation, new financial stressor"
   ```

### 6c. Co-annotation Workflow

With user consent (`accessLevel: 'annotate'`), practitioner and user can co-annotate:

1. Therapist adds a suggested connection: "I notice Career Burnout and Family Conflict may be related"
2. User sees a suggested connection (dashed purple) with therapist's note
3. User can: Accept → creates the connection | Decline → removes the suggestion
4. This creates a collaborative map that grows more accurate over multiple sessions

---

## 7. Social Layer Integration

### 7a. Sharing Modes

**Share a Node:**
User can share a single node as a post in the Connections feed:
- Generates a visual card: node label + emotion color + brief description
- Includes "This is from my Soul Constellation" attribution
- Privacy-respecting: user controls what text/detail is shown
- Example: "I've been sitting with this 'Creative Block' node for 3 weeks (intensity: 7). Anyone else know this feeling?"

**Share an Insight:**
User can share an AI-generated insight as a Soul Note:
- Insight card with attribution
- Community can respond (Resonate / Hold Space / Comment)
- Often highest-engagement content type (vulnerability + insight = resonance)

**Share Constellation Snapshot:**
Share a blurred/abstracted view of the full constellation (nodes visible but labels hidden unless user chooses to show):
- "Here's my constellation this week — a lot going on in the Career and Self nodes"
- Viewers can see the shape/intensity distribution but not private details

### 7b. Match Contribution

The constellation is the #1 input to the Connections matching algorithm (30% weight). This creates a powerful flywheel:
- Users who engage more deeply with their constellation → better matches → stronger connections → more incentive to maintain the constellation

### 7c. Circle Integration

**Group Constellation**: Each Circle has a real-time aggregate constellation:
- Shows the average intensity per category across all members
- "Your Anxiety Circle's collective 'Work Stress' node spiked this week — maybe discuss it in your next check-in"
- Members can see their own node vs. the group aggregate (no individual data exposed)

---

## 8. Vedic Astrology Integration

### 8a. Planetary House Mapping

When a user provides their full birth details (DOB + time + place), the system:

1. Computes their natal chart via Prokerala API (or AstroAPI.com)
2. Maps each of the 12 houses to constellation node categories:

| House | Category | Life Domain |
|---|---|---|
| 1st (Lagna) | `self` | Identity, body, appearance |
| 2nd | `external` | Wealth, speech, family values |
| 3rd | `creative` | Communication, siblings, courage |
| 4th | `family` | Mother, home, emotional foundation |
| 5th | `creative` | Children, romance, creativity, intellect |
| 6th | `health` | Health, enemies, obstacles, service |
| 7th | `relationship` | Marriage, partnerships, open enemies |
| 8th | `spiritual` | Transformation, death, occult, inheritance |
| 9th | `spiritual` | Father, dharma, higher learning, luck |
| 10th | `career` | Career, status, public image, authority |
| 11th | `external` | Gains, friends, elder siblings, desires |
| 12th | `spiritual` | Loss, liberation, foreign lands, sleep |

3. Creates "planetary nodes" automatically (greyed out, auto-generated):
   ```
   Saturn in 10th House → creates a 'Career (Saturn)' node with tooltip:
   "Saturn influences your career house — discipline, delays, and ultimate mastery"
   ```

### 8b. Transit Overlays

Real-time planet transit positions are fetched daily. When a transiting planet aspects a user's natal node:
```
Current: Saturn transiting over your natal Moon (Pisces)
→ Creates an 'Active Transit' glow on any 'emotional' or 'relationship' nodes
→ Generates transit insight: "Saturn is currently transiting your Moon sign.
   This may explain the emotional heaviness you're feeling in your relationship nodes.
   Saturn asks for clarity and commitment — this is a time for honest reflection."
```

### 8c. Dasha Correlation

The user's current Mahadasha and Antardasha periods are shown as a timeline overlay:
- Current dasha period is highlighted on the time-travel timeline
- Nodes created/intensified during planetary periods get a retroactive color tag
- "Most of your Career burnout nodes appeared during your Rahu Mahadasha (2023-2026)"

---

## 9. Mobile Experience

The current canvas is desktop-first. For mobile (60%+ of traffic will be mobile):

### 9a. Mobile Layout

- Canvas fills full screen with minimal chrome
- Node labels collapse to emoji/icon at zoom-out (text only at zoom ≥ 1.5)
- **No manual add FAB** — replaced by floating "Add to Journal" button that opens the journal entry screen (which triggers AI node generation)
- Swipe left/right to switch between Canvas / Insights / Timeline views
- Bottom sheet for node detail (instead of right sidebar)
- Touch-optimized: pinch-to-zoom, two-finger pan, long-press to select node

### 9b. Minimal Mode

For mobile users who find the canvas overwhelming, a "List Mode" alternative:
- Shows nodes as a scrollable list sorted by intensity (highest first)
- Group by category
- Edit intensity directly in list view
- Tap to open node detail

### 9c. Daily Prompt (Mobile)

Every morning, a contextual notification:
> "Good morning. Your [highest-intensity node] is at [N]/10. What's one word for it today?"

User responds with a single word (emoji or text). This:
1. Updates the node's "latest note" field
2. Creates a micro-journal entry linked to the node
3. Feeds into the temporal history

---

## 10. Gamification & Engagement Loops

### 10a. Constellation Completeness

```
Your constellation is 65% complete:
☑ Self node exists
☑ 5+ nodes added  
☑ First connection made
☑ First insight received
☐ Add a node for each life area (missing: spiritual, external)
☐ Rate your first insight
☐ Share a node with the community
☐ First practitioner view granted
```

### 10b. Streaks & Milestones

- **7-day constellation check-in**: update or add a node 7 days in a row → "Cartographer" badge
- **30-day consistency**: constellation updated on 28+ of 30 days → "Master Cartographer" badge
- **First friction resolved**: connect two previously friction nodes as harmony → "Peace Maker" badge
- **First AI insight rated helpful**: → "Insight Seeker" badge
- **100 nodes created lifetime**: → "Soul Mapper" badge

### 10c. Weekly Constellation Summary Card

Every Monday, auto-generated summary card (shareable):
```
┌─────────────────────────────────────────────────────┐
│ Your Constellation This Week                        │
│ March 1 – March 7, 2026                             │
│                                                     │
│ 🌟 3 new nodes added                                │
│ ⚡ Anxiety rose by 3 points                          │
│ 🌱 Hope added for the first time this month         │
│ 🔮 AI insight: "Your spiritual nodes are quiet..."  │
│                                                     │
│ Overall trajectory: Improving ↑ (+12 pts)           │
│                                                     │
│      soul yatri • The Constellation               │
└─────────────────────────────────────────────────────┘
```

---

## 11. Data Model (Prisma)

Add to `server/prisma/schema.prisma`:

```prisma
// ── Constellation Core ────────────────────────────────────────────────────

model ConstellationNode {
  id                  String                    @id @default(uuid())
  userId              String
  user                User                      @relation(fields: [userId], references: [id], onDelete: Cascade)
  label               String
  description         String?                   @db.Text
  category            String                    // 'self' | 'family' | 'career' | 'health' | 'relationship' | 'spiritual' | 'creative' | 'external'
  nodeType            String                    @default("emotion")  // see NodeType enum above
  emotion             String
  intensity           Int                       @default(5)    // 1-10
  x                   Float                     @default(50)   // percentage position 0-100
  y                   Float                     @default(50)
  size                Float?                    // computed by server, optional override
  isPinned            Boolean                   @default(false)
  isHidden            Boolean                   @default(false)  // user hid this node from view
  // ── AI generation provenance ──────────────────────────────
  isAutoGenerated     Boolean                   @default(true)   // all nodes are AI-generated
  generationSource    String                    // 'mood_log'|'journal'|'chat'|'onboarding'|'session_transcript'|'astro'|'pattern'
  sourceId            String?                   // ID of the source record (e.g., MoodEntry.id)
  generationConfidence Float?                   // 0-1, confidence of extraction
  // ── Astrology fields ──────────────────────────────────────
  astroHouse          Int?                      // 1-12 if auto-generated from natal chart
  planet              String?                   // "Saturn", "Rahu", etc. if astro node
  // ── User annotations ─────────────────────────────────────
  userNote            String?                   @db.Text  // user can add a note but cannot create the node
  userRenamedLabel    String?                   // user's corrected label if they renamed the AI label
  // ── Feedback ──────────────────────────────────────────────
  feedbackAccurate    Boolean?                  // null=not rated, true=accurate, false=inaccurate
  feedbackNote        String?
  tags                String[]
  isPublic            Boolean                   @default(false)
  sourceConnections   ConstellationEdge[]       @relation("EdgeSource")
  targetConnections   ConstellationEdge[]       @relation("EdgeTarget")
  insights            ConstellationInsight[]    @relation("InsightNodes")
  intensityHistory    NodeIntensityHistory[]
  createdAt           DateTime                  @default(now())
  updatedAt           DateTime                  @updatedAt

  @@index([userId, category])
  @@index([userId, createdAt])
  @@index([userId, isHidden])
  @@index([sourceId])
}

model ConstellationEdge {
  id           String              @id @default(uuid())
  userId       String
  user         User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  sourceId     String
  source       ConstellationNode   @relation("EdgeSource", fields: [sourceId], references: [id], onDelete: Cascade)
  targetId     String
  target       ConstellationNode   @relation("EdgeTarget", fields: [targetId], references: [id], onDelete: Cascade)
  type         String              // 'harmony' | 'friction' | 'neutral' | 'evolving'
  strength     Int                 @default(3)   // 1-5
  label        String?
  note         String?
  isSuggested  Boolean             @default(false)
  suggestionConfidence Float?
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  @@unique([userId, sourceId, targetId])
}

model ConstellationInsight {
  id              String                      @id @default(uuid())
  userId          String
  user            User                        @relation(fields: [userId], references: [id], onDelete: Cascade)
  triggerType     String                      // see insight categories above
  title           String
  body            String                      @db.Text
  relatedNodeIds  String[]
  nodes           ConstellationNode[]         @relation("InsightNodes")
  isRead          Boolean                     @default(false)
  isActedOn       Boolean                     @default(false)
  actionType      String?                     // 'therapy_booked' | 'shared' | 'journaled' | 'dismissed'
  rating          Int?                        // 1 (helpful) | -1 (not helpful)
  ratingComment   String?
  generatedByAI   Boolean                     @default(true)
  promptTokens    Int?
  createdAt       DateTime                    @default(now())
  readAt          DateTime?

  @@index([userId, isRead])
}

model NodeIntensityHistory {
  id        String              @id @default(uuid())
  nodeId    String
  node      ConstellationNode   @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  intensity Int
  note      String?
  changedBy String              // 'user' | 'ai_suggestion' | 'daily_prompt'
  recordedAt DateTime           @default(now())

  @@index([nodeId, recordedAt])
}

model ConstellationSnapshot {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      DateTime @db.Date
  snapshot  Json     // { nodes: [{id, label, category, emotion, intensity}], edgeCount }
  valence   Float    // avg emotional valence 0-1
  arousal   Float    // avg emotional arousal 0-1
  nodeCount Int
  trajectory Float   // computed trajectory score 0-100
  createdAt DateTime @default(now())

  @@unique([userId, date])
  @@index([userId, date])
}

model ConstellationAccess {
  id              String    @id @default(uuid())
  userId          String    // constellation owner
  user            User      @relation("ConstellationOwner", fields: [userId], references: [id], onDelete: Cascade)
  practitionerId  String
  practitioner    User      @relation("ConstellationPractitioner", fields: [practitionerId], references: [id], onDelete: Cascade)
  accessLevel     String    // 'view' | 'annotate'
  grantedAt       DateTime  @default(now())
  revokedAt       DateTime?
  isActive        Boolean   @default(true)

  @@unique([userId, practitionerId])
}

model PractitionerAnnotation {
  id             String            @id @default(uuid())
  practitionerId String
  practitioner   User              @relation(fields: [practitionerId], references: [id], onDelete: Cascade)
  nodeId         String
  node           ConstellationNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  note           String            @db.Text
  sessionId      String?           // link to the therapy session context
  isPrivate      Boolean           @default(true)  // only practitioner sees by default
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
}
```

---

## 12. Backend API Spec

### Base: `/api/v1/constellation`

```
# Node read/update (no manual create — AI only)
GET    /                                    # Get full constellation (nodes + edges + insights)
GET    /nodes/:id                          # Get single node with history
PATCH  /nodes/:id                          # User-adjustable fields only: intensity (+/-2), label rename, pin, hide, note
PATCH  /nodes/:id/move                     # Update x/y position (debounced canvas drag)

# AI Node Generation (internal + from frontend triggers)
POST   /generate/from-source               # Trigger AI extraction from a specific source
  body: { sourceType: 'mood_log'|'journal'|'chat'|'onboarding'|'session_transcript'|'astro', sourceId: string }

# Edges (AI creates; user can accept/dismiss suggestions)
GET    /suggestions/connections            # Get AI-suggested connections
PATCH  /suggestions/:id/accept             # Accept → creates the edge
PATCH  /suggestions/:id/dismiss            # Dismiss suggestion

# Node feedback (RLHF)
POST   /nodes/:id/feedback                 # { accurate: boolean, correctedLabel?: string }
PATCH  /nodes/:id/hide                     # Hide node from canvas (archived)
PATCH  /nodes/:id/unhide                   # Restore hidden node

# Insights
GET    /insights                           # Get all insights (paginated)
GET    /insights/unread-count              # Get unread count
PATCH  /insights/:id/read                  # Mark as read
PATCH  /insights/:id/rate                  # Rate an insight (1/-1)

# Temporal
GET    /snapshots                          # Get list of snapshot dates (calendar heatmap)
GET    /snapshots/:date                    # Get constellation state on a specific date
GET    /history/trajectory                 # 30-day trajectory score history

# Sharing
POST   /nodes/:id/share                    # Create a Connections post from a node
POST   /insights/:id/share                 # Share an insight as a Soul Note

# Practitioner access
GET    /access                             # Get who has access to my constellation
POST   /access                             # Grant access to practitioner
DELETE /access/:practitionerId             # Revoke access
# (Practitioner-specific)
GET    /practitioner/:clientUserId         # View client's constellation (requires access)
POST   /practitioner/:clientUserId/annotate # Add annotation to a node
GET    /practitioner/:clientUserId/brief   # Get session prep brief

# Astrology integration
POST   /astro/sync                         # Re-sync astrology planet nodes from natal chart
GET    /astro/transits                     # Get current active transit overlays
```

---

## 13. Frontend Architecture

### 13a. Files to Create / Modify

**Modify (already exist):**
```
src/features/constellation/
├── services/constellation.service.ts    # Remove mock fallback; remove createNode; add generateFromSource
├── hooks/useConstellation.ts            # Remove createNode/isAddingNode; add snapshot/timeline/feedback/hide
├── pages/ConstellationPage.tsx          # MAJOR: remove FAB+AddNodeModal; add AI empty state, generation prompts, origin badges
├── components/
│   ├── ConstellationCanvas.tsx          # Add timeline animation, mobile touch, origin badge overlay
│   ├── NodeDetailPanel.tsx              # Remove Edit button; add origin badge, feedback, hide, intensity nudge
│   └── InsightsPanel.tsx               # Add rating UI, share insight button
```

**Create (new):**
```
src/features/constellation/
├── components/
│   ├── AiNodePrompt.tsx                 # Empty-state card: "Journal or chat to grow your constellation"
│   ├── NodeOriginBadge.tsx             # Small chip showing source (journal/mood/chat/session/astro)
│   ├── NodeFeedbackModal.tsx           # "Was this node accurate?" RLHF feedback UI
│   ├── TimelineScrubber.tsx             # Timeline slider at bottom of canvas
│   ├── AstroOverlay.tsx                # Planetary house overlay toggle
│   ├── PractitionerViewBanner.tsx       # "Dr. X has access to your constellation"
│   ├── ConstellationShareCard.tsx       # Card generator for sharing
│   ├── NodeIntensityHistory.tsx         # Sparkline chart for a node's history
│   ├── ConnectionSuggestion.tsx         # Dashed suggested connection with accept/dismiss buttons
│   ├── WeeklySummaryCard.tsx            # Monday summary card
│   └── MobileNodeList.tsx              # Mobile list-mode alternative
├── pages/
│   ├── ConstellationTimelinePage.tsx    # Full-page time travel view
│   └── ConstellationSettingsPage.tsx    # Access grants, astro sync, privacy, hidden nodes
```

### 13b. TypeScript Types (extend existing `types/index.ts`)

```typescript
// Add to existing types

// Generation source for AI-created nodes
export type NodeGenerationSource =
  | 'mood_log'
  | 'journal'
  | 'chat'
  | 'onboarding'
  | 'session_transcript'
  | 'astro'
  | 'pattern';  // recurring cross-source pattern

interface ConstellationNode {
  // ... existing fields ...
  nodeType: NodeType;
  // AI provenance (all nodes are AI-generated)
  isAutoGenerated: true;
  generationSource: NodeGenerationSource;
  sourceId?: string;
  generationConfidence?: number;
  // User micro-controls
  isHidden: boolean;
  userNote?: string;
  userRenamedLabel?: string;
  feedbackAccurate?: boolean;
  // Astro
  astroHouse?: number;
  planet?: string;
  // History (loaded on-demand)
  intensityHistory?: IntensityDataPoint[];
}

interface IntensityDataPoint {
  intensity: number;
  note?: string;
  changedBy: 'user_nudge' | 'ai_reanalysis' | 'daily_prompt';
  recordedAt: string;
}

interface ConnectionSuggestion {
  id: string;
  sourceId: string;
  targetId: string;
  suggestedType: ConnectionType;
  confidence: number;
  reason: string;
}

interface ConstellationSnapshot {
  date: string;
  nodes: Array<{ id: string; label: string; category: string; emotion: string; intensity: number }>;
  valence: number;
  arousal: number;
  trajectory: number;
  nodeCount: number;
}

interface PractitionerBrief {
  clientName: string;
  lastSessionDate: string;
  changedNodes: Array<{ node: ConstellationNode; previousIntensity: number; delta: number }>;
  newNodes: ConstellationNode[];
  highIntensityNodes: ConstellationNode[];
  aiSummary: string;
}
```

### 13c. State Extensions (useConstellation hook)

```typescript
interface UseConstellationReturn {
  // ... existing ...
  
  // Timeline
  snapshots: ConstellationSnapshot[];
  timelineDate: string | null;        // null = today
  setTimelineDate: (date: string | null) => void;
  isTimelineMode: boolean;
  
  // Insights (extended)
  rateInsight: (insightId: string, rating: 1 | -1, comment?: string) => Promise<void>;
  shareInsight: (insightId: string) => Promise<void>;
  
  // Sharing
  shareNode: (nodeId: string, caption?: string) => Promise<void>;
  
  // Suggestions
  connectionSuggestions: ConnectionSuggestion[];
  acceptSuggestion: (suggestionId: string) => Promise<void>;
  dismissSuggestion: (suggestionId: string) => Promise<void>;
  
  // Astro
  transitOverlays: TransitOverlay[];
  syncAstroNodes: () => Promise<void>;
  
  // Practitioner
  accessGrants: ConstellationAccess[];
  grantAccess: (practitionerId: string, level: 'view' | 'annotate') => Promise<void>;
  revokeAccess: (practitionerId: string) => Promise<void>;
}
```

---

## 14. Implementation Roadmap

> **All phases verified against existing codebase state and dependencies.**

### Phase 1 — Backend Foundation + Prisma (Week 1-2, ~32h)
- [ ] Add all Prisma models: `ConstellationNode`, `ConstellationEdge`, `ConstellationInsight`, `NodeIntensityHistory`, `ConstellationSnapshot`, `ConstellationAccess`, `PractitionerAnnotation` (see §11)
- [ ] Run migrations against dev Postgres
- [ ] Implement read/update API (`GET /`, `PATCH /nodes/:id`, `PATCH /nodes/:id/move`, `PATCH /nodes/:id/hide`)
- [ ] Implement snapshot creation (nightly cron job — runs at midnight IST)
- [ ] Remove mock fallback from `constellation.service.ts`; show empty constellation on first use
- [ ] Test: all read/update/hide operations

### Phase 2 — AI Node Generation Engine (Week 3-4, ~28h)
- [ ] Implement `POST /constellation/generate/from-source` endpoint
- [ ] Build GPT-4o node extraction pipeline (system prompt from §2d)
- [ ] Implement deduplication via `text-embedding-3-small` cosine similarity
- [ ] Implement force-directed position assignment for new nodes
- [ ] Wire to existing health-tools endpoints: after `POST /health-tools/mood` → fire generation job
- [ ] Wire to existing health-tools endpoints: after `POST /health-tools/journal` → fire generation job
- [ ] Wire to SoulBot chat post-response: extract from conversation
- [ ] Wire to onboarding completion: seed initial nodes from `UserProfile.struggles + goals`
- [ ] Background job every 5 minutes: process pending generation queue
- [ ] WebSocket push: when nodes are created, push `constellation.nodes_updated` event to active clients
- [ ] Remove `AddNodeModal.tsx` from ConstellationPage (no longer needed)
- [ ] Remove FAB `+` button from ConstellationPage

### Phase 3 — AI Insight Engine (Week 5, ~20h)
- [ ] Implement all 12 insight trigger types as server-side detection functions (see §4a)
- [ ] Wire to nightly background job (runs after snapshot creation)
- [ ] Implement GPT-4o-mini insight generation with full prompt (see §4b)
- [ ] Store insights in DB with `generatedByAI: true`
- [ ] Wire `GET /insights` + mark-read + rate APIs to existing InsightsPanel
- [ ] Implement RLHF feedback storage (`POST /nodes/:id/feedback`)

### Phase 4 — AI-First Frontend UX (Week 6, ~20h)
- [ ] Build `AiNodePrompt.tsx` — empty state component with Journal/Chat/Profile CTAs
- [ ] Build `NodeOriginBadge.tsx` — small origin chip (😊 journal / 📓 mood / 💬 chat / etc.)
- [ ] Build `NodeFeedbackModal.tsx` — "Was this accurate?" two-button RLHF UI
- [ ] Update `NodeDetailPanel.tsx`: remove Edit button; add origin badge + feedback + hide + intensity nudge (+1/-1 range)
- [ ] Update `ConstellationPage.tsx`: AI empty state, WebSocket live-update listener, "AI is mapping…" loading indicator
- [ ] Update `InsightsPanel.tsx`: add rating thumbs + share button

### Phase 5 — Timeline Feature (Week 7, ~24h)
- [ ] Implement `GET /snapshots` and `GET /snapshots/:date` APIs
- [ ] Build `TimelineScrubber.tsx` component
- [ ] Add canvas animation: transition nodes between historical positions/intensities via framer-motion
- [ ] Build trajectory score graph (recharts LineChart)
- [ ] Wire to `useConstellation` hook state

### Phase 6 — Practitioner View (Week 8, ~20h)
- [ ] Implement access grant/revoke API (`POST /access`, `DELETE /access/:practitionerId`)
- [ ] Build practitioner brief generation (AI + DB query for changed nodes)
- [ ] Build practitioner constellation view (read-only canvas with annotation layer)
- [ ] Implement annotation API + sticky note UI
- [ ] Wire to therapy booking: offer access grant during booking confirmation

### Phase 7 — Social & Astro (Week 9, ~16h)
- [ ] Implement node/insight sharing to Connections feed (`POST /nodes/:id/share`)
- [ ] Integrate Prokerala API for natal chart computation
- [ ] Map 12 houses to categories; auto-create planetary nodes with `isAutoGenerated: true`
- [ ] Build transit overlay (daily cron job + `GET /astro/transits`)

### Phase 8 — Mobile & Polish (Week 10, ~20h)
- [ ] Build `MobileNodeList.tsx` list-mode alternative (toggle in header)
- [ ] Optimize canvas for touch: pinch-to-zoom, two-finger pan, long-press-to-select
- [ ] Build `WeeklySummaryCard.tsx` + Monday morning push notification
- [ ] Build `ConstellationSettingsPage.tsx`: access grants, hidden nodes, astro sync, privacy
- [ ] Daily morning prompt notification with personalised node focus
- [ ] Full QA: all 12 insight types, all 6 generation sources, all edge cases

### Dependency Map

```
Phase 1 (DB)
  └── Phase 2 (AI Generation)  ← must have DB to persist nodes
        └── Phase 3 (Insights) ← needs nodes to generate insights about
        └── Phase 4 (UI)       ← needs generated nodes to display in canvas
              └── Phase 5 (Timeline) ← needs snapshots which need nodes
Phase 6 (Practitioner) ← needs Phase 1 + Phase 4
Phase 7 (Social)       ← needs Phase 4 frontend + Connections feature
Phase 8 (Mobile)       ← can start in parallel from Phase 4 onwards
```

### Total Estimate: ~180 hours (~22 dev days, ~4.5 weeks solo, ~2.5 weeks 2-person)

---

## 15. AI Training Value

The constellation is the highest-value training dataset in Indian mental health AI.

### What We Collect

| Data | Type | Training Use |
|---|---|---|
| Node (label, category, emotion, intensity) | Structured + free-text | Entity recognition, emotion classification |
| Node description | Free-text | Emotion labeling, mental health language corpus |
| Intensity changes over time | Time series | Longitudinal mental health modeling |
| User-rated insight (helpful/not) | Label | Insight quality model (RLHF) |
| Connection type between nodes | Graph | Mental health knowledge graph |
| Temporal correlation (mood ↔ constellation) | Cross-domain | Multi-modal mental health signal fusion |
| Crisis triggers (which node states precede crisis) | Labels | Crisis prediction model |
| Practitioner annotations | Expert labels | Highest-quality labeled data |
| Post-therapy node changes | Before/after | Therapy effectiveness measurement |
| Astrology transit correlations | Structured | India-specific cultural mental health signals |

### Value Estimate at Scale

- At 10,000 active users with 50 nodes each = **500,000 labeled emotion data points**
- At 10,000 active users × 365 days = **3.65M daily constellation state records**
- At 10,000 users × 20 insights/year rated = **200,000 expert-quality RLHF labels**
- Practitioner annotations (with 500 practitioners, 10 annotations/session, 100 sessions/year) = **500,000 expert clinical labels**

**This dataset would be worth tens of crores to any AI/mental health company and is completely proprietary to Soul Yatri.**

---

*This document is the complete spec for Soul Constellation 2.0. The feature is already partially built — this plan takes it from 60/100 to 100/100 across all dimensions: persistence, AI insights, time travel, practitioner integration, social layer, astrology, and mobile.*

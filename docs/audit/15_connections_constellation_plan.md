# Audit Addendum 15 — Connections & Soul Constellation Deep Dive

**Batch:** 15 (post-main-audit addendum)  
**Date:** 2026-03-06  
**Scope:** In-depth analysis of two features requested for 100/100 treatment:
1. Connections (social network — Hinge + Instagram + LinkedIn hybrid)
2. Soul Constellation (emotional map — 60→100/100 upgrade plan)

---

## Part A: Connections Feature

### Current State: 22/100

| Sub-Dimension | Score | Evidence |
|---|---|---|
| Backend API | 0/100 | Zero connection endpoints exist in server/src/routes/ |
| Frontend UI | 45/100 | ConnectionsPage.tsx exists (23KB) with polished UI but 6 hardcoded mock cards |
| Data model | 0/100 | No Prisma models for social graph, posts, messages, circles |
| Matching algorithm | 0/100 | Hardcoded mock synergy scores |
| Real-time messaging | 0/100 | DM UI not built; no backend |
| Privacy controls | 0/100 | No privacy settings |
| Content moderation | 0/100 | Not started |
| Feed (posts) | 5/100 | Not started |
| Stories | 0/100 | Not started |
| Circles/groups | 0/100 | Not started |
| Professional network | 0/100 | Not started |

### Key Files Audited

**`src/pages/dashboard/ConnectionsPage.tsx`** (23KB)
- Contains well-designed UI with 4 filter tabs (All/Romantic/Platonic/Professional)
- Has Synergy Ring SVG animation component (good)
- Uses `MOCK_MATCHES` constant with 6 hardcoded cards (all fake `pravatar.cc` images)
- No API calls anywhere in the file
- No state management for accepting/declining connections
- No routing to individual profile pages
- Connection cards have "Reveal Profile" / "Connect Now" / "Send Support Pulse" buttons — ALL non-functional (no onClick handlers)

**`src/types/community.types.ts`** (130 lines)
- Has `CommunityThread`, `CommunityPost`, `CommunityUser`, `Badge` types
- Has sophisticated `ContentModerationResult` type (ML scoring fields)
- Has `ContentReport` type
- NONE of these are used by any server controller (community routes all return 501)

### Architecture Decision: Build from Scratch vs. Extend

**Decision: Build as `src/features/connections/` feature module**

Rationale:
- Current `ConnectionsPage.tsx` is too monolithic (23KB) for a feature this large
- Feature module pattern (`src/features/<name>/`) is established convention
- Current file can be refactored to a thin wrapper that renders `DiscoverFeedPage` from the feature module

### Implementation Priority Order

```
1. Prisma models (Section 14 of CONNECTIONS_SOCIAL_PLAN.md) ← REQUIRED FIRST
2. Social graph API (follow/block/connect) ← required for everything
3. Real match queue (replaces 6 hardcoded cards) ← highest visible impact
4. Post feed ("Following" tab) ← daily engagement
5. DM system ← conversion/retention
6. Matching algorithm ← differentiation
7. Soul Moments (stories) ← viral loop
8. Circles ← community
9. Professional network ← practitioner revenue
```

### Gap Register Entries (Connections)

| ID | Severity | Description | Fix | Effort |
|---|---|---|---|---|
| CONN-001 | 🔴 CRITICAL | No Prisma models for social graph | Add 20+ models from CONNECTIONS_SOCIAL_PLAN.md §14 | 4h |
| CONN-002 | 🔴 HIGH | All ConnectionsPage CTAs are non-functional | Wire all 6 card buttons to connection request flow | 2h |
| CONN-003 | 🔴 HIGH | Zero backend routes for connections | Build social graph API (30 endpoints) | 40h |
| CONN-004 | 🟠 HIGH | No matching algorithm | Build 7-dimension match score engine | 24h |
| CONN-005 | 🟠 HIGH | No DM system | Build threading + real-time WebSocket DMs | 32h |
| CONN-006 | 🟡 MEDIUM | Mock images (pravatar.cc) in production code | Replace with placeholder system or real user avatars | 1h |
| CONN-007 | 🟡 MEDIUM | No content moderation pipeline | Wire OpenAI moderation API | 16h |
| CONN-008 | 🟡 MEDIUM | No privacy controls | Build privacy settings per content type | 8h |

### Revenue Opportunity

At 10,000 users with 20% Premium conversion:
- 2,000 users × ₹499/mo = **₹9,98,000/month** in incremental subscriptions
- "Soul Boost" micro-transactions: estimated ₹25,000/month
- **Total: ~₹10 Lakhs/month from Connections alone**

---

## Part B: Soul Constellation

### Current State: 62/100

| Sub-Dimension | Score | Evidence |
|---|---|---|
| Canvas interaction | 90/100 | Excellent SVG canvas with drag/zoom/pan/animation |
| Node CRUD (frontend) | 85/100 | Full CRUD with AddNodeModal, NodeDetailPanel |
| Connection CRUD (frontend) | 80/100 | Works, 4 connection types, animated lines |
| Insights panel (UI) | 75/100 | InsightsPanel component exists, reads from state |
| Backend persistence | 0/100 | ALL endpoints return 501; mock data only |
| AI insight generation | 5/100 | Hardcoded insights in mock data |
| Temporal history | 0/100 | Not implemented |
| Practitioner view | 0/100 | Not implemented |
| Social sharing | 0/100 | Not implemented |
| Vedic astrology integration | 10/100 | Type definitions exist; no computation |
| Mobile optimization | 40/100 | Canvas renders but not touch-optimized |
| Data persistence | 0/100 | Nodes lost on page refresh (local state only!) |

### Critical Bug: Data Not Persisted

**The most important gap**: `constellation.service.ts` tries the real API first (`GET /api/v1/constellation`), and when it gets a 501 (as it always does), falls back to mock data. This means:

1. User adds nodes to their constellation
2. User refreshes the page
3. ALL THEIR NODES ARE GONE — reset to the mock demo data
4. User thinks they lost their data → churns immediately

This is a P0 bug that must be fixed before the constellation is usable in production.

**Fix (2-step):**
1. Backend: implement `GET/POST /api/v1/constellation` endpoints (Phase 1 of roadmap)
2. Frontend: remove mock fallback; show empty constellation on 404 (first-time user)

### Architecture Assessment

**`src/features/constellation/`** is the best-architected feature in the codebase:
- Clean separation: service → hook → page → components
- TypeScript types fully defined in `types/index.ts`
- Loading, error, empty states all handled
- Framer Motion animations throughout
- Canvas is sophisticated (bezier curves, gradient connections, animated path lengths)

The only thing missing is the backend. Once the API exists, the frontend should "just work" with minimal changes.

### Gap Register Entries (Constellation)

| ID | Severity | Description | Fix | Effort |
|---|---|---|---|---|
| CONST-001 | 🔴 CRITICAL | Data not persisted — lost on page refresh | Build backend CRUD APIs + Prisma models | 32h |
| CONST-002 | 🔴 CRITICAL | Mock data masquerades as real user data | Remove mock fallback; show empty state on new user | 1h |
| CONST-003 | 🔴 HIGH | No AI insight generation | Wire nightly job + GPT-4o-mini prompt | 20h |
| CONST-004 | 🟠 HIGH | No temporal history/time travel | Nightly snapshot job + scrubber UI | 24h |
| CONST-005 | 🟠 HIGH | Therapist cannot view client constellation | Build access grant + practitioner view | 20h |
| CONST-006 | 🟠 HIGH | Mobile not touch-optimized | Add pinch/swipe/long-press handlers | 12h |
| CONST-007 | 🟡 MEDIUM | No social sharing from constellation | Wire to Connections post creation | 4h |
| CONST-008 | 🟡 MEDIUM | No Vedic astrology node overlay | Integrate Prokerala API + house mapping | 16h |
| CONST-009 | 🟡 MEDIUM | No connection suggestions from AI | Build edge suggestion engine | 12h |
| CONST-010 | 🟢 LOW | Weekly summary card not generated | Build card generator + email job | 8h |

---

## Part C: How Connections + Constellation Power Each Other

This is the competitive moat: these two features form a **flywheel** that no competitor can replicate:

```
User builds Constellation (emotional map)
        ↓
AI computes constellation feature vectors
        ↓
Matching algorithm finds users with resonant/complementary constellations
        ↓
High-quality matches → meaningful Connections
        ↓
Connections share constellation nodes with each other
        ↓
Shared vulnerability deepens the connection
        ↓
Users update their constellations more frequently
        ↓
Better data → better matches → repeat
```

### Cross-Feature Integration Points

| Integration | Description | Files |
|---|---|---|
| Match score from constellation | 30% of connection match score computed from constellation vectors | `server/src/jobs/match-computation.job.ts` |
| Share a node to Connections feed | Node detail panel has "Share" button → creates Post | `ConstellationNode + PostCard` |
| Practitioner referral via connection | Therapist can suggest a connection to their client | `Connection + TherapistProfile` |
| Circle aggregate constellation | Group constellation view shows collective emotional state | `Circle + ConstellationSnapshot` |
| Crisis detected across both | Crisis keywords in nodes AND messages trigger the same protocol | Shared `crisis-detection.service.ts` |
| Mood + constellation correlation | Dashboard shows how mood trend correlates with constellation intensity | `getDashboard()` + constellation query |
| Onboarding → constellation | Onboarding questions (struggles, goals) pre-populate first constellation nodes | `OnboardingPage + constellation CRUD` |

---

## Summary Gap Count

| Feature | CRITICAL | HIGH | MEDIUM | LOW | Total |
|---|---|---|---|---|---|
| Connections | 3 | 3 | 2 | 0 | 8 |
| Soul Constellation | 2 | 3 | 3 | 1 | 9 |
| **Combined** | **5** | **6** | **5** | **1** | **17** |

### Combined Implementation Estimate

| Phase | Feature | Effort |
|---|---|---|
| 1 | Constellation: Backend persistence | 32h |
| 2 | Constellation: AI insights | 20h |
| 3 | Constellation: Timeline | 24h |
| 4 | Connections: Prisma models + graph API | 44h |
| 5 | Connections: Match algorithm | 24h |
| 6 | Connections: Post feed | 40h |
| 7 | Connections: DM system | 32h |
| 8 | Constellation: Practitioner view | 20h |
| 9 | Connections: Soul Moments | 20h |
| 10 | Connections: Circles | 32h |
| 11 | Constellation + Connections: Cross-integration | 16h |
| 12 | Polish + mobile | 20h |
| **TOTAL** | | **~324 hours (~40 dev days)** |

At 1 senior developer working full-time (8h/day): **~8 weeks** to full completion.  
With a 2-person team: **~4 weeks**.

---

## Reference Documents

- Full Connections spec: `docs/CONNECTIONS_SOCIAL_PLAN.md`
- Full Constellation spec: `docs/SOUL_CONSTELLATION_100.md`
- Security issues: `docs/audit/06_gap_register.md` (CRITICAL-1 to CRITICAL-5)
- Execution prompts: `docs/audit/14_execution_prompts.md`
- World-class recommendations: `docs/audit/13_world_class_recommendations.md`

# Agent Build Starter

This is the clean handoff doc for starting implementation agents after the repo audit.

Use this document for two things:
1. Decide which docs an agent should trust before it starts work.
2. Copy a prompt that tells the agent exactly what to implement.

## Read Order

Every implementation agent should read these first, in this order:

1. `agentprompt.txt`
2. `docs/BUILD_PLAN.md`
3. `docs/ARCHITECTURE.md`
4. `docs/API.md`
5. `docs/audit/07_documentation_drift.md`
6. `docs/audit/_progress.json`

Then read the feature-specific spec for the area being built.

## Feature-Specific Docs

### Constellation
- `docs/SOUL_CONSTELLATION_100.md`
- `src/features/constellation/types/index.ts`
- `src/features/constellation/services/constellation.service.ts`
- `src/features/constellation/components/*`
- `server/prisma/schema.prisma`

### Connections / Social
- `docs/CONNECTIONS_SOCIAL_PLAN.md`
- `src/pages/dashboard/ConnectionsPage.tsx`
- `src/types/community.types.ts`
- `server/src/routes/community.ts`
- `server/src/controllers/community.controller.ts`
- `server/src/validators/community.validator.ts`
- `server/prisma/schema.prisma`

### Therapy / Sessions / Video
- `docs/BUILD_PLAN.md`
- `docs/API.md`
- `src/pages/dashboard/SessionsPage.tsx`
- `server/src/routes/therapy.ts`
- `server/prisma/schema.prisma`

### Payments
- `docs/BUILD_PLAN.md`
- `docs/API.md`
- `server/src/controllers/payments.controller.ts`
- `server/src/validators/payments.validator.ts`
- `server/prisma/schema.prisma`

### AI / SoulBot / Automation
- `docs/BUILD_PLAN.md`
- `docs/ULTIMATE_GOD_MODE_ARCHITECTURE.md`
- `src/types/ai.types.ts`
- `server/src/config/index.ts`
- `server/src/routes/ai.ts`
- `server/prisma/schema.prisma`

### Admin
- `docs/BUILD_PLAN.md`
- `docs/API.md`
- `src/pages/AdminDashboardPage.tsx`
- `server/src/routes/admin.ts`
- `server/prisma/schema.prisma`

## Docs To Treat As Historical Or Non-Canonical

These can still be useful, but agents should not use them as the main truth source:

- `docs/MVP_DEFINITION.md`
- `docs/FLOW_ISOLATION_VERIFICATION.md`
- `docs/IMPLEMENTATION_COMPLETE.md`
- `docs/ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md`

## Build Rules For Agents

Every implementation agent should follow these rules:

1. Trust code over docs when they conflict.
2. Treat `docs/audit/07_documentation_drift.md` as the warning ledger for stale claims.
3. Implement from the real schema, routes, and components in the repo, not just from aspirational docs.
4. Prefer extending existing route/controller/service structure over creating a parallel architecture.
5. Run build or targeted validation after each implementation batch.
6. Do not "mock-complete" a feature without clearly marking it as partial.

## Best Agent Start Order

If you want the best compounding implementation order, start agents in this sequence:

1. Constellation backend foundation
2. Connections backend foundation
3. Therapy session backend
4. Payments
5. Video integration
6. SoulBot / AI runtime
7. Admin real metrics and moderation

This order matches the strongest product moat: Constellation and Connections become the data backbone for AI, retention, and social graph features.

## Immediate Next Build Slice In This Repo

If the question is not long-run strategy but "what should we build right now in this codebase", start with the first real Therapy backend slice.

Why this should go first right now:

1. The frontend Sessions experience already exists and is visibly product-important.
2. Prisma already has `TherapistProfile`, `TherapistAvailability`, `Session`, and `Payment`, so this is not a schema-from-zero domain.
3. `server/src/routes/therapy.ts` is entirely stubbed, which means one focused implementation batch can unlock obvious user value fast.
4. Admin, AI, and Community are still more skeletal and would force a wider foundation build before they become useful.
5. Constellation is strategically the deepest moat, but in the current repository it still depends on new schema, new APIs, and replacement of a full mock-first service layer.

The exact first batch should be:

1. `GET /therapy/therapists`
2. `GET /therapy/therapists/:id`
3. `POST /therapy/request`
4. `GET /therapy/sessions`
5. `GET /therapy/sessions/:id`

Do not start with video, monitoring, recording, therapist revenue, or advanced reports. Those should come after the booking and retrieval slice is real.

## Copy-Paste Prompts

### 1. Constellation Backend Foundation

```text
Read these first: agentprompt.txt, docs/BUILD_PLAN.md, docs/ARCHITECTURE.md, docs/API.md, docs/audit/07_documentation_drift.md, docs/SOUL_CONSTELLATION_100.md.

Then inspect the current implementation in src/features/constellation/**, server/prisma/schema.prisma, and server/src/**.

Task: implement the real backend foundation for Soul Constellation using the existing repo architecture. Add Prisma models, API routes, controllers, validators, and service wiring needed for persistence of nodes, connections, and insights. Keep the current frontend working, replace mock-only assumptions where practical, and preserve current types. Do not build speculative AI orchestration yet beyond the persistence-ready contract.

Deliverables:
- Prisma schema changes for constellation entities
- real server routes/controllers/validators
- frontend service updated to use real APIs
- targeted documentation updates only where needed
- build validation at the end

Rules:
- trust current code over stale docs
- use docs/SOUL_CONSTELLATION_100.md as target architecture, not proof of existing implementation
- avoid creating a second architecture path
```

### 2. Connections Backend Foundation

```text
Read these first: agentprompt.txt, docs/BUILD_PLAN.md, docs/ARCHITECTURE.md, docs/API.md, docs/audit/07_documentation_drift.md, docs/CONNECTIONS_SOCIAL_PLAN.md.

Then inspect src/pages/dashboard/ConnectionsPage.tsx, src/types/community.types.ts, server/src/routes/community.ts, server/src/controllers/community.controller.ts, server/src/validators/community.validator.ts, and server/prisma/schema.prisma.

Task: replace the current mock-only Connections foundation with real backend primitives. Start with the minimum durable social graph needed for profiles, posts, follows, and simple match-ready data structures. Do not attempt the entire 100/100 social system in one pass.

Deliverables:
- Prisma models for core social entities
- server routes/controllers/validators for the first usable community APIs
- frontend Connections page moved off hardcoded seed data where possible
- clear classification of what remains planned versus implemented
- build validation at the end

Rules:
- preserve the long-term direction in docs/CONNECTIONS_SOCIAL_PLAN.md
- avoid inventing unsupported infrastructure
- keep the first slice real, durable, and extendable
```

### 3. Therapy Sessions Backend

```text
Read these first: agentprompt.txt, docs/BUILD_PLAN.md, docs/ARCHITECTURE.md, docs/API.md, docs/audit/07_documentation_drift.md.

Then inspect src/pages/dashboard/SessionsPage.tsx, server/src/routes/therapy.ts, any therapy-related types/pages, and server/prisma/schema.prisma.

Task: implement the first real therapy session backend slice behind the current UI. Focus on therapist listing, session booking primitives, and session retrieval before attempting advanced monitoring or recordings.

Deliverables:
- therapy route/controller implementation for the first live endpoints
- schema changes only if genuinely needed
- frontend service integration for sessions
- no fake data paths left for the implemented slice
- build validation at the end

Rules:
- do not pretend video or payment is complete in this batch
- remove or isolate mock assumptions only for the slice you implement
```

### 4. Payments

```text
Read these first: agentprompt.txt, docs/BUILD_PLAN.md, docs/API.md, docs/audit/07_documentation_drift.md.

Then inspect server/src/controllers/payments.controller.ts, server/src/validators/payments.validator.ts, server/prisma/schema.prisma, and any frontend payment entry surfaces.

Task: implement the first real payment flow using the existing repo structure. Start with order creation, verification, persistence, and payment history. Keep the design compatible with India-first rollout.

Deliverables:
- payment controller implementation
- provider integration wiring
- schema updates if needed
- safe validation and error handling
- build validation at the end

Rules:
- no placeholder success paths
- document remaining gaps clearly if refunds, subscriptions, or disputes are deferred
```

### 5. SoulBot / AI Runtime Foundation

```text
Read these first: agentprompt.txt, docs/BUILD_PLAN.md, docs/ARCHITECTURE.md, docs/audit/07_documentation_drift.md, docs/ULTIMATE_GOD_MODE_ARCHITECTURE.md.

Then inspect src/types/ai.types.ts, any SoulBot UI components, server/src/routes/ai.ts, server/src/config/index.ts, and server/prisma/schema.prisma.

Task: implement the first real AI runtime foundation for SoulBot in a way that fits the current repository. Focus on durable contracts, request flow, safety hooks, and event logging. Do not try to implement the entire god-mode blueprint in one batch.

Deliverables:
- first live AI route/controller slice
- provider abstraction or runtime-safe foundation
- persistence for conversation or event metadata if needed
- frontend integration for one real workflow
- build validation at the end

Rules:
- treat docs/ULTIMATE_GOD_MODE_ARCHITECTURE.md as aspirational
- ship one real vertical slice, not a fake automation surface
```

### 6. Admin Real Metrics

```text
Read these first: agentprompt.txt, docs/BUILD_PLAN.md, docs/API.md, docs/audit/07_documentation_drift.md.

Then inspect src/pages/AdminDashboardPage.tsx, server/src/routes/admin.ts, and server/prisma/schema.prisma.

Task: replace the first set of hardcoded admin metrics with real backend-derived values. Start with user counts, session counts, payment totals if available, and moderation-ready placeholders backed by actual data queries where possible.

Deliverables:
- first implemented admin endpoints
- frontend admin dashboard connected to live metrics
- no hardcoded metrics for the implemented slice
- build validation at the end

Rules:
- keep auth and role enforcement aligned with existing middleware strategy
- do not leave unauthenticated admin functionality exposed for implemented routes
```

## Short Version

If you only want one instruction to send before any build task, use this:

```text
Before you implement anything, read agentprompt.txt, docs/BUILD_PLAN.md, docs/ARCHITECTURE.md, docs/API.md, and docs/audit/07_documentation_drift.md. Treat the feature master spec as target design, not implementation proof. Trust the repository code over stale docs. Build one real vertical slice end-to-end, remove mock-only assumptions for that slice, validate the build, and update only the minimum docs needed to keep truth aligned.
```

## Aggressive Long-Run Prompt

Use this when you want one agent to make the biggest safe Constellation implementation jump in a single pass.

```text
You are implementing the real Soul Constellation backend foundation in the current repository. This is not a planning task. Read the repo, make the changes, validate them, and leave the codebase in a buildable state.

Read these first, in order:
1. agentprompt.txt
2. docs/BUILD_PLAN.md
3. docs/ARCHITECTURE.md
4. docs/API.md
5. docs/audit/07_documentation_drift.md
6. docs/SOUL_CONSTELLATION_100.md

Then inspect these implementation files before writing code:
- src/features/constellation/types/index.ts
- src/features/constellation/services/constellation.service.ts
- src/features/constellation/components/*
- src/pages/dashboard/ConstellationPage.tsx
- server/prisma/schema.prisma
- server/src/routes/index.ts
- server/src/controllers/*
- server/src/validators/*

Objective:
Implement the first real end-to-end Constellation vertical slice so the feature is no longer only a frontend mock. Build persistence-ready backend support for nodes, connections, and insights using the existing repo architecture. Keep the current frontend experience working while replacing mock-only assumptions where practical.

Hard requirements:
- Do real code changes, not just documentation.
- Trust current repository code over stale docs when they conflict.
- Treat docs/SOUL_CONSTELLATION_100.md as target architecture, not proof of existing implementation.
- Reuse the repo's existing route/controller/validator/service patterns.
- Do not create a parallel architecture or speculative framework.
- Keep the change set focused on a real usable first slice.
- Preserve buildability and type safety.

Minimum deliverables:
1. Add Prisma models for constellation nodes, connections, and insights.
2. Add server validators for constellation payloads.
3. Add live server routes and controllers for:
	- get constellation
	- create node
	- update node
	- delete node
	- create connection
	- delete connection
	- mark insight read
4. Mount the new routes in the existing server route tree.
5. Update the frontend constellation service to use the real API contract.
6. Keep safe fallback behavior only where absolutely necessary, and make it obvious when data is mock vs real.
7. Update only the minimum docs needed if the API contract changes.
8. Run validation at the end and fix any build/type errors caused by your changes.

Non-goals for this pass unless required by the code:
- full AI generation pipeline
- embeddings infrastructure
- therapist view
- social sharing
- astrology overlays
- realtime collaboration

Execution strategy:
1. Read the current frontend types and UI expectations.
2. Design the smallest durable Prisma schema that matches those expectations and can evolve later.
3. Implement server CRUD plus insight-read flows.
4. Wire frontend service methods to the new backend.
5. Remove or isolate the most misleading mock-only assumptions for the implemented slice.
6. Run build/type validation.
7. If something cannot be completed cleanly in one pass, leave a clear TODO at the exact seam, not a fake implementation.

Definition of done:
- frontend build passes
- server types compile if affected
- Constellation feature has real persistence path
- no newly introduced fake-complete behavior
- code and docs are consistent enough that the next agent can build on top of this without re-auditing the basics

At the end, report:
- what was implemented
- what remains intentionally deferred
- any schema or API decisions that the next agent must know
```

## Aggressive Long-Run Prompt — Connections

```text
You are implementing the real Connections backend foundation in the current repository. This is not a planning task. Read the repo, make the changes, validate them, and leave the codebase in a buildable state.

Read these first, in order:
1. agentprompt.txt
2. docs/BUILD_PLAN.md
3. docs/ARCHITECTURE.md
4. docs/API.md
5. docs/audit/07_documentation_drift.md
6. docs/CONNECTIONS_SOCIAL_PLAN.md

Then inspect these implementation files before writing code:
- src/pages/dashboard/ConnectionsPage.tsx
- src/types/community.types.ts
- server/src/routes/community.ts
- server/src/controllers/community.controller.ts
- server/src/validators/community.validator.ts
- server/prisma/schema.prisma

Objective:
Implement the first real end-to-end Connections vertical slice so the feature is no longer only a mock feed. Build durable backend support for core social graph primitives and replace the most misleading hardcoded frontend assumptions.

Hard requirements:
- Do real code changes, not just documentation.
- Trust current repository code over stale docs when they conflict.
- Treat docs/CONNECTIONS_SOCIAL_PLAN.md as target architecture, not proof of existing implementation.
- Reuse the repo's existing route/controller/validator/service patterns.
- Do not create a parallel architecture or speculative framework.
- Keep the change set focused on a real usable first slice.
- Preserve buildability and type safety.

Minimum deliverables:
1. Add Prisma models for the first real social entities needed for a durable slice.
2. Add validators for the community/social payloads you implement.
3. Add live server routes and controllers for the first usable Connections APIs.
4. Replace or isolate hardcoded feed/profile/mock match assumptions for the implemented slice.
5. Keep anything not yet real clearly marked as partial rather than fake-complete.
6. Run validation at the end and fix any build/type errors caused by your changes.

Suggested first slice:
- profile basics
- simple post listing/creation
- follow/connect primitives
- safe placeholder response contracts for not-yet-built advanced matching layers

Non-goals for this pass unless required by the code:
- full Hinge-style matching engine
- DM system
- stories
- circles moderation suite
- AI scoring pipeline
- monetization

Definition of done:
- frontend build passes
- implemented Connections APIs persist real data
- Connections page is no longer purely hardcoded for the implemented slice
- no new fake-complete behavior introduced
```

## Aggressive Long-Run Prompt — Therapy

```text
You are implementing the first real therapy backend slice in the current repository. This is not a planning task. Read the repo, make the changes, validate them, and leave the codebase in a buildable state.

Read these first, in order:
1. agentprompt.txt
2. docs/BUILD_PLAN.md
3. docs/ARCHITECTURE.md
4. docs/API.md
5. docs/audit/07_documentation_drift.md

Then inspect these implementation files before writing code:
- src/pages/dashboard/SessionsPage.tsx
- src/pages/practitioner/*
- server/src/routes/therapy.ts
- server/prisma/schema.prisma
- any therapy-related validators, types, and controllers

Objective:
Implement the first real therapy session vertical slice behind the current UI so booking and session retrieval are no longer fully stubbed.

Hard requirements:
- Do real code changes, not just docs.
- Reuse the current repo structure.
- Keep the first slice small but real.
- Preserve buildability and type safety.

Minimum deliverables:
1. Implement the first real therapy endpoints.
2. Support therapist listing and basic session booking/retrieval.
3. Wire the implemented slice into the current frontend services/pages.
4. Remove or isolate the most misleading fake data paths for the implemented slice.
5. Run validation at the end.

Non-goals for this pass unless required by the code:
- video room integration
- recordings
- advanced session tasks
- AI monitoring
- full practitioner revenue stack

Definition of done:
- implemented therapy routes no longer return 501 for the chosen slice
- frontend build passes
- the selected therapy flow uses real persistence
```

## Aggressive Long-Run Prompt — Payments

```text
You are implementing the first real payment foundation in the current repository. This is not a planning task. Read the repo, make the changes, validate them, and leave the codebase in a buildable state.

Read these first, in order:
1. agentprompt.txt
2. docs/BUILD_PLAN.md
3. docs/API.md
4. docs/audit/07_documentation_drift.md

Then inspect these implementation files before writing code:
- server/src/controllers/payments.controller.ts
- server/src/routes/payments.ts
- server/src/validators/payments.validator.ts
- server/prisma/schema.prisma
- any frontend payment entry surfaces

Objective:
Implement the first real payment vertical slice with durable persistence and provider-compatible contracts.

Hard requirements:
- Do real code changes, not just docs.
- Use the repo's existing backend patterns.
- Keep the first slice real and auditable.
- Preserve buildability and type safety.

Minimum deliverables:
1. Implement order/initiation flow.
2. Implement payment verification flow.
3. Persist payment records cleanly.
4. Provide payment history for the authenticated user.
5. Run validation at the end.

Non-goals for this pass unless required by the code:
- subscriptions
- refunds automation
- dispute workflows
- multi-provider abstractions beyond what is needed for the first slice

Definition of done:
- payment routes for the implemented slice are real
- persistence exists for initiated and verified payments
- build passes
```

## Aggressive Long-Run Prompt — Video

```text
You are implementing the first real video-session foundation in the current repository. This is not a planning task. Read the repo, make the changes, validate them, and leave the codebase in a buildable state.

Read these first, in order:
1. agentprompt.txt
2. docs/BUILD_PLAN.md
3. docs/API.md
4. docs/audit/07_documentation_drift.md

Then inspect these implementation files before writing code:
- src/pages/dashboard/SessionsPage.tsx
- any session join or practitioner session UI
- server/src/routes/therapy.ts
- server/src/config/index.ts
- server/prisma/schema.prisma

Objective:
Implement the first real video-session integration seam so therapy sessions can progress from booked session data to a provider-backed session join flow.

Hard requirements:
- Do real code changes, not just docs.
- Reuse existing session/backend structure.
- Preserve buildability and type safety.

Minimum deliverables:
1. Add provider-ready server flow for room/session join creation.
2. Add the minimum frontend wiring to enter a real session flow.
3. Keep the implementation explicitly scoped to the first usable join path.
4. Run validation at the end.

Non-goals for this pass unless required by the code:
- recording pipeline
- live captions
- bandwidth diagnostics
- therapist co-pilot

Definition of done:
- there is a real provider-backed session join path for the implemented slice
- build passes
- docs do not overclaim beyond the implemented slice
```

## Aggressive Long-Run Prompt — SoulBot / AI Runtime

```text
You are implementing the first real SoulBot / AI runtime foundation in the current repository. This is not a planning task. Read the repo, make the changes, validate them, and leave the codebase in a buildable state.

Read these first, in order:
1. agentprompt.txt
2. docs/BUILD_PLAN.md
3. docs/ARCHITECTURE.md
4. docs/audit/07_documentation_drift.md
5. docs/ULTIMATE_GOD_MODE_ARCHITECTURE.md

Then inspect these implementation files before writing code:
- src/types/ai.types.ts
- any SoulBot UI surfaces
- server/src/routes/ai.ts
- server/src/config/index.ts
- server/prisma/schema.prisma

Objective:
Implement one real AI vertical slice for SoulBot that fits the current repository without pretending the full automation blueprint already exists.

Hard requirements:
- Do real code changes, not just docs.
- Treat god-mode architecture as future-state, not immediate scope.
- Preserve buildability and type safety.

Minimum deliverables:
1. Implement one live AI route/controller flow.
2. Add the minimum provider/runtime abstraction needed.
3. Add persistence or logging for the implemented interaction if required.
4. Wire one frontend AI interaction to the real backend.
5. Run validation at the end.

Non-goals for this pass unless required by the code:
- supervisor swarm
- self-healing pipelines
- real-time therapist co-pilot
- multimodal crisis engine
- autonomous content systems

Definition of done:
- one real SoulBot interaction path exists end-to-end
- build passes
- no fake-complete AI automation claims introduced
```

## Aggressive Long-Run Prompt — Admin

```text
You are implementing the first real admin backend slice in the current repository. This is not a planning task. Read the repo, make the changes, validate them, and leave the codebase in a buildable state.

Read these first, in order:
1. agentprompt.txt
2. docs/BUILD_PLAN.md
3. docs/API.md
4. docs/audit/07_documentation_drift.md

Then inspect these implementation files before writing code:
- src/pages/AdminDashboardPage.tsx
- server/src/routes/admin.ts
- server/prisma/schema.prisma
- existing auth/role middleware

Objective:
Replace the first hardcoded admin dashboard slice with real backend-derived metrics and safe role-protected endpoints.

Hard requirements:
- Do real code changes, not just docs.
- Reuse existing auth and role middleware patterns.
- Preserve buildability and type safety.

Minimum deliverables:
1. Implement the first real admin metrics endpoints.
2. Wire the frontend admin dashboard to live data for the implemented slice.
3. Ensure implemented admin routes are properly protected.
4. Run validation at the end.

Suggested first slice:
- user totals
- onboarding totals
- mood/journal/meditation totals
- session totals if available
- payment totals only if real payment data exists by then

Definition of done:
- admin dashboard is no longer purely hardcoded for the implemented slice
- implemented admin endpoints are protected
- build passes
```
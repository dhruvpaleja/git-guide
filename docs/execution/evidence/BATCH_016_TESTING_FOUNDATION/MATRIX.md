# BATCH:016 — Testing Foundation Evidence Matrix

## Test Suite Inventory

| # | Test Name | Tags | Route/Scope | Status |
|---|-----------|------|-------------|--------|
| 1 | Home / Landing (/home) loads without fatal error | @smoke @public | /home | pass |
| 2 | About (/about) loads without fatal error | @smoke @public | /about | pass |
| 3 | Business (/business) loads without fatal error | @smoke @public | /business | pass |
| 4 | Courses (/courses) loads without fatal error | @smoke @public | /courses | pass |
| 5 | Blogs (/blogs) loads without fatal error | @smoke @public | /blogs | pass |
| 6 | Contact (/contact) loads without fatal error | @smoke @public | /contact | pass |
| 7 | Splash screen (/) loads | @smoke @public | / | pass |
| 8 | Login page loads | @smoke @auth | /login | pass |
| 9 | Mock user can log in and reach dashboard | @smoke @auth | /login → /journey-preparation | pass |
| 10 | Dashboard home (/dashboard) renders without crash | @smoke @dashboard | /dashboard | pass |
| 11 | Dashboard sessions (/dashboard/sessions) renders | @smoke @dashboard | /dashboard/sessions | pass |
| 12 | Dashboard notifications (/dashboard/notifications) renders | @smoke @dashboard | /dashboard/notifications | pass |
| 13 | Dashboard personalization (/dashboard/personalization) renders | @smoke @dashboard | /dashboard/personalization | pass |
| 14 | App survives a failing API call without blank screen | @smoke @resilience | /dashboard (API aborted) | pass |
| 15 | App survives slow API responses | @smoke @resilience | /dashboard (API delayed) | pass |

## Coverage Summary by Area

| Area | Tests | Routes Covered | Status |
|------|-------|----------------|--------|
| Public | 7 | /, /home, /about, /business, /courses, /blogs, /contact | pass |
| Auth | 2 | /login, login→redirect flow | pass |
| Onboarding entry | 1 (via auth redirect) | /journey-preparation (reached via login) | pass |
| Dashboard core | 4 | /dashboard, /dashboard/sessions, /dashboard/notifications, /dashboard/personalization | pass |
| Resilience | 2 | /dashboard with failing/slow APIs | pass |

## Flake Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Dev server cold start timing | medium | `webServer.timeout` set to 60s; `reuseExistingServer` enabled for local runs |
| Lazy-loaded chunk download variance | low | `expectPageShell` uses 15s timeout; Playwright auto-retries assertions |
| Mock-auth dependency (VITE_ENABLE_MOCK_AUTH) | medium | Default `true` in dev; tests document dependency on mock-auth runtime flag |
| Login redirect timing | low | `waitForURL` with 15s timeout and predicate-based check (not exact URL) |
| API route interception collisions | low | Tests use separate describe blocks with independent page contexts |
| Cross-browser parity | low | Deferred — smoke command targets chromium first; firefox/webkit projects available |

## Deferred Tests

| Test | Reason | Priority |
|------|--------|----------|
| Practitioner dashboard routes (/practitioner/*) | Requires practitioner role login; separate test flow needed | medium |
| Astrology dashboard (/astrology) | Requires astrologer role | medium |
| Admin dashboard (/admin) | Requires admin role | medium |
| Signup flow end-to-end | Server-dependent; requires running backend | medium |
| Cross-browser (firefox, webkit) smoke | Deferred to avoid CI complexity; projects are configured and ready | low |
| Mobile viewport smoke | Mobile Chrome/Safari projects configured; deferred from initial smoke | low |

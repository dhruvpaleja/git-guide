# BATCH:016 — Testing Foundation Notes

## Commands Run

```bash
# Baseline verification
npm run quality:ci                    # pass

# Smoke test execution (chromium)
npx playwright test --project=chromium --grep "@smoke" --reporter=line
# Result: 15 passed (29.2s)

# Full verification sequence
npm run type-check                    # pass
npm run lint:ci                       # pass
npm run build                         # pass
cd server && npm run build            # pass
cd server && npm run lint:ci          # pass
npm run quality:ci                    # pass
npx playwright test --project=chromium --grep "@smoke" --reporter=line  # 15 passed
```

## Pass/Fail Summary

| Check | Result |
|-------|--------|
| npm run type-check | pass |
| npm run lint:ci | pass |
| npm run build | pass |
| cd server && npm run build | pass |
| cd server && npm run lint:ci | pass |
| npm run quality:ci | pass |
| Smoke tests (chromium, 15 tests) | 15/15 pass |

## Environment Assumptions

- Node.js runtime available locally
- `npm run dev` starts Vite dev server on `http://localhost:5173`
- `VITE_AUTH_BYPASS` defaults to `true` (dev mode) — protected routes accessible without login
- `VITE_ENABLE_MOCK_AUTH` defaults to `true` (dev mode) — test accounts functional
- Mock test account: `user@test.com` / `user123` (role: user)
- Playwright browsers installed locally (`npx playwright install`)
- No backend server required for smoke tests (frontend-only with mock auth)
- Tests run against Chromium; firefox/webkit projects configured but not included in smoke command

## Architecture Decisions

1. **Smoke-first strategy**: All tests tagged with `@smoke` and area tags (`@public`, `@auth`, `@dashboard`, `@resilience`) for granular filtering
2. **Selector strategy**: Uses `#id` selectors for form inputs (stable HTML ids), role-based selectors for buttons/headings, and `main` / `[role="main"]` for page shell detection
3. **Deterministic local run**: `reuseExistingServer: true` for local dev; `webServer` config starts Vite automatically if not running; fixed viewport 1280x720
4. **Failure artifacts**: Traces and screenshots captured only on failure (`retain-on-failure`, `only-on-failure`) to keep clean runs fast

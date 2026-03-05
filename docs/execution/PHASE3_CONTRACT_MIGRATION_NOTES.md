# Phase 3 Contract Migration Notes

## Objective
Unify frontend/backend auth, API envelope, and websocket contracts under one source without changing runtime UX flows.

## Canonical Contract Source
- `server/src/shared/contracts/auth.contracts.ts`
- `server/src/shared/contracts/api.contracts.ts`
- `server/src/shared/contracts/websocket.contracts.ts`

## Frontend Consumption Path
- Added alias `@contracts/*`:
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `vite.config.ts`
- Frontend now imports shared contracts directly (no duplicate local role/envelope definitions as primary source).

## Backend Consumption Path
- Core auth/token/response/ws files now consume shared contracts:
  - `server/src/services/tokens.service.ts`
  - `server/src/middleware/auth.middleware.ts`
  - `server/src/middleware/rbac.middleware.ts`
  - `server/src/controllers/auth.controller.ts`
  - `server/src/lib/response.ts`
  - `server/src/lib/websocket.ts`

## Backward Compatibility Guarantees Preserved
- API response envelope remains `success/data/error/timestamp/requestId`.
- Existing websocket event names remain unchanged:
  - client -> server: `ping`, `mark_read`
  - server -> client: `connected`, `notification`, `ack`, `pong`, `error`
- Mock auth and ProtectedRoute QA bypass behavior remains unchanged.

## Migration Rules for Next Batches
1. Add/modify auth roles only in `auth.contracts.ts`, then adapt UI permissions in one follow-up batch.
2. Add/modify API envelope fields only in `api.contracts.ts`; keep adapters in `src/services/api.service.ts` until all endpoints are strict.
3. Add/modify websocket events only in `websocket.contracts.ts`; update both `server/src/lib/websocket.ts` and `src/services/websocket.service.ts` in same batch.
4. If `@contracts` path moves, update all three alias points (`tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`) in one atomic batch.

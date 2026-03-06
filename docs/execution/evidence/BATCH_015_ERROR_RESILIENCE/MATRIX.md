# BATCH:015 - Error Resilience Matrix

## Error Category Coverage

| Category | Canonical code(s) | Source normalization path | Envelope shape |
| --- | --- | --- | --- |
| Auth | `AUTH_001`, `AUTH_003`, `AUTH_004`, `AUTH_005`, `AUTH_011`, `AUTH_012` | `server/src/middleware/auth.middleware.ts`, `server/src/middleware/error.ts`, `src/utils/errors/index.ts` | `success:false`, `error:{code,message,details?}`, `requestId`, `timestamp` |
| Validation | `VAL_001`..`VAL_005` | `server/src/middleware/error.ts` (Zod/body/parser/Prisma validation), `server/src/lib/errors.ts` | Standardized |
| Not Found | `RES_001` | `server/src/middleware/error.ts` (`notFound` + Prisma P2025) | Standardized |
| Conflict | `RES_002`, `RES_003` | `server/src/middleware/error.ts` (Prisma P2002/P2014), `server/src/lib/errors.ts` | Standardized |
| Rate limit | `RATE_001` | `server/src/middleware/security.middleware.ts`, `server/src/middleware/user-rate-limit.middleware.ts`, `server/src/middleware/error.ts` | Standardized |
| Server | `SRV_001`, `SRV_003` | `server/src/middleware/error.ts`, `server/src/lib/errors.ts` | Standardized |
| Upstream / transient | `SRV_002`, `SRV_004` | `src/services/api.service.ts` transient/network handling + retry policy | Standardized client error envelope |
| Unknown | status-derived fallback -> canonical (`defaultErrorCodeForStatus`) else `SRV_001` | `server/src/middleware/error.ts` + `server/src/lib/errors.ts` | Standardized |

## Legacy -> Canonical Compatibility Mapping

| Legacy code | Canonical code |
| --- | --- |
| `UNAUTHORIZED` | `AUTH_001` |
| `AUTHENTICATION_ERROR` | `AUTH_001` |
| `FORBIDDEN` | `AUTH_002` |
| `AUTHORIZATION_ERROR` | `AUTH_002` |
| `AUTH_TOKEN_EXPIRED` | `AUTH_003` |
| `TOKEN_EXPIRED` | `AUTH_003` |
| `AUTH_TOKEN_INVALID` | `AUTH_004` |
| `TOKEN_INVALID` | `AUTH_004` |
| `AUTH_TOKEN_REVOKED` | `AUTH_005` |
| `TOKEN_REVOKED` | `AUTH_005` |
| `AUTH_INVALID_CREDENTIALS` | `AUTH_008` |
| `AUTH_EMAIL_EXISTS` | `AUTH_009` |
| `USER_NOT_FOUND` | `RES_001` |
| `USER_ALREADY_EXISTS` | `RES_002` |
| `VALIDATION_FAILED` | `VAL_001` |
| `VALIDATION_ERROR` | `VAL_001` |
| `CONFLICT` | `RES_003` |
| `RATE_LIMIT_EXCEEDED` | `RATE_001` |
| `RATE_LIMITED` | `RATE_001` |
| `TOO_MANY_REQUESTS` | `RATE_002` |
| `INTERNAL_ERROR` | `SRV_001` |
| `INTERNAL_SERVER_ERROR` | `SRV_001` |
| `DATABASE_ERROR` | `SRV_003` |
| `SERVICE_UNAVAILABLE` | `SRV_002` |
| `EXTERNAL_SERVICE_ERROR` | `SRV_004` |
| `API_ERROR` | `SRV_001` |
| `CIRCUIT_OPEN` | `SRV_002` |
| `UPLOAD_ERROR` | `SRV_002` |
| `HTTP_401` | `AUTH_001` |
| `HTTP_429` | `RATE_001` |
| `HTTP_5xx` | `SRV_001`/`SRV_002` status-derived |

## Retry Policy Matrix

| Condition | Retry? | Policy |
| --- | --- | --- |
| `GET` + network/timeout/abort failure | Yes | exponential backoff + jitter, bounded attempts |
| `GET` + HTTP `5xx` | Yes | retry until max attempts |
| `GET` + canonical transient (`SRV_001`/`SRV_002`/`SRV_003`/`SRV_004`) | Yes | retry until max attempts |
| `GET` + HTTP `4xx` (non-auth refresh path) | No | fail fast |
| `POST`/`PUT`/`DELETE` + network failure | No | fail fast (no blind non-idempotent replay) |
| HTTP `401` + refreshable auth code + token + non-`/auth/*` endpoint | Yes (single replay) | execute `/auth/refresh` once, then replay original request once |
| HTTP `401` + refresh failed | No | return canonical auth error, action map may logout |
| HTTP `429` | No | no blind retry; caller/UI-driven retry only |

## WebSocket Reconnect Behavior

| Behavior | Implementation |
| --- | --- |
| Backoff strategy | Exponential (`1s` base) with jitter (`0.7x`..`1.3x`) |
| Max delay | 30 seconds |
| Max reconnect attempts | 8 |
| Hot-loop prevention | bounded attempts + single scheduled reconnect timer |
| Manual disconnect behavior | cancels reconnect timer and suppresses auto-reconnect |
| Surfaced connection states | `idle`, `connecting`, `connected`, `reconnecting`, `disconnected`, `failed` |
| Consumer wiring | `NotificationsPage` subscribes to `connection_state` and `notification` events (no cast) |

## Residual Risks

- `R-022` (open): legacy/stub routes outside BATCH:015 scope still emit ad-hoc `{ success:false, error:{ message } }` responses without canonical `error.code`/`requestId`.
- Canonical alias set is broad but finite; any newly introduced ad-hoc error string must be added to alias maps in both server/shared and frontend utilities.
- Current safe refresh replay path intentionally excludes `/auth/*` endpoints to avoid recursion; auth-route normalization remains controller-level follow-up work.

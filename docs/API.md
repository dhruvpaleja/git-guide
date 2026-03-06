# API Documentation

## Base URL

```
Development: http://localhost:3000/api/v1
Production:  https://api.soul-yatri.com/api/v1
```

Routes are also mirrored at `/api` (without version prefix).

## Authentication

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses follow a canonical envelope:

```json
{
  "success": true,
  "data": { },
  "timestamp": "2026-03-06T10:30:00.000Z",
  "requestId": "req_abc123"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "SRV_005",
    "message": "Not implemented",
    "details": { }
  },
  "timestamp": "2026-03-06T10:30:00.000Z",
  "requestId": "req_abc123"
}
```

Paginated responses include a `meta` field:

```json
{
  "success": true,
  "data": [ ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "...",
  "requestId": "..."
}
```

---

## Canonical Error Codes

| Code | Category | Meaning |
|------|----------|---------|
| `AUTH_001` | Auth | Unauthorized |
| `AUTH_002` | Auth | Forbidden |
| `AUTH_003` | Auth | Token expired |
| `AUTH_004` | Auth | Token invalid |
| `AUTH_005` | Auth | Token revoked |
| `AUTH_006` | Auth | Account locked |
| `AUTH_007` | Auth | Account not verified |
| `AUTH_008` | Auth | Invalid credentials |
| `AUTH_009` | Auth | Email already exists |
| `AUTH_010` | Auth | Password too weak |
| `AUTH_011` | Auth | Refresh token missing |
| `AUTH_012` | Auth | Session expired |
| `VAL_001` | Validation | Validation failed |
| `VAL_002` | Validation | Invalid input |
| `VAL_003` | Validation | Missing required field |
| `VAL_004` | Validation | Invalid format |
| `VAL_005` | Validation | Payload too large |
| `RES_001` | Resource | Not found |
| `RES_002` | Resource | Already exists |
| `RES_003` | Resource | Conflict |
| `RES_004` | Resource | Gone |
| `BIZ_001` | Business | Slot unavailable |
| `BIZ_002` | Business | Session not cancellable |
| `BIZ_003` | Business | Payment failed |
| `BIZ_004` | Business | Payment duplicate |
| `BIZ_005` | Business | Insufficient balance |
| `BIZ_006` | Business | Booking too soon |
| `BIZ_007` | Business | Onboarding incomplete |
| `BIZ_008` | Business | Daily limit reached |
| `BIZ_009` | Business | Therapist unavailable |
| `RATE_001` | Rate limit | Rate limited |
| `RATE_002` | Rate limit | Too many requests |
| `SRV_001` | Server | Internal server error |
| `SRV_002` | Server | Service unavailable |
| `SRV_003` | Server | Database error |
| `SRV_004` | Server | External service error |
| `SRV_005` | Server | Not implemented (stub) |

---

## Endpoints

Legend:
- **Auth**: `requireAuth` — requires valid Bearer token
- **Role**: `requireRole(role)` — requires specific role after auth
- **Status**: `LIVE` = implemented, `STUB` = returns 501 `SRV_005`

---

### Health

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/health` | — | LIVE | Server health check |
| GET | `/health/ready` | — | LIVE | Readiness probe (DB, memory) |

---

### Authentication (`/auth`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| POST | `/auth/register` | — | LIVE | Register new account (rate-limited) |
| POST | `/auth/login` | — | LIVE | Login with email/password (rate-limited) |
| POST | `/auth/refresh` | — | LIVE | Refresh access token |
| POST | `/auth/logout` | — | LIVE | Logout / invalidate session |
| GET | `/auth/me` | Auth | LIVE | Get current user info |
| POST | `/auth/forgot-password` | — | STUB | Request password reset (rate-limited) |
| POST | `/auth/reset-password` | — | STUB | Reset password with token (rate-limited) |

---

### Users (`/users`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| POST | `/users/onboarding` | Auth | LIVE | Submit onboarding step |
| GET | `/users/onboarding` | Auth | LIVE | Get onboarding progress |
| POST | `/users/astrology-profile` | Auth | LIVE | Save astrology birth profile |
| GET | `/users/profile` | Auth | LIVE | Get user profile |
| PUT | `/users/profile` | Auth | LIVE | Update user profile |
| GET | `/users/dashboard` | Auth | LIVE | Get dashboard summary |
| POST | `/users/avatar` | Auth | LIVE | Upload avatar image |
| GET | `/users/settings` | Auth | LIVE | Get user settings |
| PUT | `/users/settings` | Auth | LIVE | Update user settings |
| GET | `/users/export-my-data` | Auth | LIVE | Export personal data (GDPR/DPDPA) |
| DELETE | `/users/delete-account` | Auth | LIVE | Delete account (GDPR/DPDPA) |

---

### Health Tools (`/health-tools`)

All routes require authentication.

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/health-tools/mood` | Auth | LIVE | Get mood entries |
| POST | `/health-tools/mood` | Auth | LIVE | Log mood entry |
| GET | `/health-tools/journal` | Auth | LIVE | Get journal entries |
| POST | `/health-tools/journal` | Auth | LIVE | Create journal entry |
| PUT | `/health-tools/journal/:id` | Auth | LIVE | Update journal entry |
| GET | `/health-tools/meditation` | Auth | LIVE | Get meditation sessions |
| POST | `/health-tools/meditation` | Auth | LIVE | Log meditation session |

---

### Notifications (`/notifications`)

All routes require authentication. Uses canonical `sendSuccess`/`sendError` responses.

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/notifications` | Auth | LIVE | List notifications (paginated) |
| PUT | `/notifications/:id/read` | Auth | LIVE | Mark notification as read |
| PUT | `/notifications/read-all` | Auth | LIVE | Mark all notifications as read |

---

### Therapy (`/therapy`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| POST | `/therapy/request` | — | STUB | Request therapy session |
| GET | `/therapy/sessions` | — | STUB | List sessions |
| GET | `/therapy/sessions/:id` | — | STUB | Get session details |
| GET | `/therapy/sessions/:id/tasks` | — | STUB | Get session tasks |
| POST | `/therapy/sessions/:id/tasks` | — | STUB | Create session task |
| GET | `/therapy/sessions/:id/recording` | — | STUB | Get session recording |
| GET | `/therapy/sessions/:id/report` | — | STUB | Get session report |
| GET | `/therapy/sessions/:id/monitor/client` | — | STUB | Client monitor view |
| GET | `/therapy/sessions/:id/monitor/therapist` | — | STUB | Therapist monitor view |
| GET | `/therapy/therapists` | — | STUB | List therapists |
| GET | `/therapy/therapists/:id` | — | STUB | Get therapist details |
| GET | `/therapy/therapist/dashboard` | — | STUB | Therapist dashboard |
| GET | `/therapy/therapist/clients` | — | STUB | Therapist's clients |
| GET | `/therapy/therapist/revenue` | — | STUB | Therapist revenue |
| GET | `/therapy/therapist/reviews` | — | STUB | Therapist reviews |
| GET | `/therapy/therapist/profile` | — | STUB | Therapist profile |
| PUT | `/therapy/therapist/profile` | — | STUB | Update therapist profile |
| GET | `/therapy/therapist/clients/:id` | — | STUB | Therapist client detail |

---

### Astrology (`/astrology`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/astrology/charts` | — | STUB | List charts |
| GET | `/astrology/charts/:id` | — | STUB | Get chart |
| GET | `/astrology/reports` | — | STUB | List reports |
| POST | `/astrology/reports` | — | STUB | Create report |
| GET | `/astrology/predictions` | — | STUB | List predictions |
| POST | `/astrology/predictions/:id/vote` | — | STUB | Vote on prediction |
| GET | `/astrology/sessions` | — | STUB | List sessions |
| GET | `/astrology/dashboard` | — | STUB | Astrologer dashboard |
| GET | `/astrology/profile` | — | STUB | Astrologer profile |
| PUT | `/astrology/profile` | — | STUB | Update astrologer profile |
| GET | `/astrology/clients` | — | STUB | Astrologer's clients |
| GET | `/astrology/clients/:id` | — | STUB | Client detail |
| GET | `/astrology/predictions/accuracy` | — | STUB | Prediction accuracy |
| GET | `/astrology/revenue` | — | STUB | Astrologer revenue |

---

### AI (`/ai`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| POST | `/ai/chat` | — | STUB | AI chat message |
| POST | `/ai/voice` | — | STUB | AI voice input |
| GET | `/ai/emergency` | — | STUB | Get emergency flags |
| POST | `/ai/emergency` | — | STUB | Create emergency flag |
| PUT | `/ai/emergency/:id` | — | STUB | Update emergency flag |
| GET | `/ai/patterns/:userId` | — | STUB | Get AI-detected patterns |
| POST | `/ai/session-monitor/start` | — | STUB | Start session monitor |
| POST | `/ai/session-monitor/frame` | — | STUB | Submit video frame |
| POST | `/ai/session-monitor/audio` | — | STUB | Submit audio chunk |
| GET | `/ai/session-monitor/:sessionId/client` | — | STUB | Client monitor |
| GET | `/ai/session-monitor/:sessionId/therapist` | — | STUB | Therapist monitor |

---

### Blog (`/blog`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/blog/posts` | — | STUB | List blog posts |
| GET | `/blog/posts/:slug` | — | STUB | Get post by slug |
| POST | `/blog/posts` | — | STUB | Create post |
| PUT | `/blog/posts/:id` | — | STUB | Update post |
| GET | `/blog/categories` | — | STUB | List categories |
| GET | `/blog/seo/sitemap` | — | STUB | SEO sitemap data |
| GET | `/blog/seo/keywords` | — | STUB | SEO keywords |

---

### Courses (`/courses`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/courses` | — | STUB | List courses |
| GET | `/courses/:id` | — | STUB | Get course |
| POST | `/courses/:id/enroll` | — | STUB | Enroll in course |
| GET | `/courses/:id/progress` | — | STUB | Get progress |
| PUT | `/courses/:id/progress` | — | STUB | Update progress |
| POST | `/courses/create` | — | STUB | Create course |
| GET | `/courses/:id/reviews` | — | STUB | List reviews |
| POST | `/courses/:id/reviews` | — | STUB | Submit review |

---

### Community (`/community`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/community/feed` | — | STUB | Community feed |
| GET | `/community/posts` | — | STUB | List posts |
| POST | `/community/posts` | — | STUB | Create post |
| GET | `/community/posts/:id` | — | STUB | Get post |
| POST | `/community/posts/:id/like` | — | STUB | Like post |
| GET | `/community/posts/:id/comments` | — | STUB | List comments |
| POST | `/community/posts/:id/comments` | — | STUB | Add comment |
| POST | `/community/posts/:id/report` | — | STUB | Report post |
| GET | `/community/moderation` | — | STUB | Moderation queue |

---

### Shop (`/shop`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/shop/products` | — | STUB | List products |
| GET | `/shop/products/:id` | — | STUB | Get product |
| GET | `/shop/cart` | — | STUB | Get cart |
| POST | `/shop/cart` | — | STUB | Add to cart |
| PUT | `/shop/cart/:itemId` | — | STUB | Update cart item |
| DELETE | `/shop/cart/:itemId` | — | STUB | Remove from cart |
| GET | `/shop/orders` | — | STUB | List orders |
| GET | `/shop/orders/:id` | — | STUB | Get order |
| POST | `/shop/products/:id/reviews` | — | STUB | Submit review |

---

### Payments (`/payments`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| POST | `/payments/create` | — | STUB | Create payment |
| POST | `/payments/verify` | — | STUB | Verify payment |
| POST | `/payments/webhook` | — | STUB | Payment webhook |
| POST | `/payments/refund` | — | STUB | Refund payment |
| GET | `/payments/history` | — | STUB | Payment history |
| GET | `/payments/subscriptions` | — | STUB | List subscriptions |
| POST | `/payments/subscriptions` | — | STUB | Create subscription |
| PUT | `/payments/subscriptions/:id` | — | STUB | Update subscription |
| GET | `/payments/memberships/tiers` | — | STUB | Membership tiers |
| POST | `/payments/memberships/subscribe` | — | STUB | Subscribe to tier |
| GET | `/payments/memberships/mine` | — | STUB | My membership |
| GET | `/payments/payouts` | — | STUB | List payouts |
| POST | `/payments/payouts/request` | — | STUB | Request payout |
| GET | `/payments/payouts/earnings` | — | STUB | Earnings summary |
| GET | `/payments/payouts/account` | — | STUB | Payout account |
| POST | `/payments/payouts/account` | — | STUB | Set payout account |
| GET | `/payments/currencies` | — | STUB | Available currencies |
| PUT | `/payments/currency-preference` | — | STUB | Set currency |

---

### Events (`/events`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/events` | — | STUB | List events |
| GET | `/events/:slug` | — | STUB | Get event |
| POST | `/events/:id/register` | — | STUB | Register for event |
| GET | `/events/:id/attendees` | — | STUB | List attendees |
| POST | `/events/:id/feedback` | — | STUB | Submit feedback |
| POST | `/events` | — | STUB | Create event |
| PUT | `/events/:id` | — | STUB | Update event |

---

### Corporate (`/corporate`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/corporate/accounts` | — | STUB | List accounts |
| POST | `/corporate/accounts` | — | STUB | Create account |
| GET | `/corporate/accounts/:id` | — | STUB | Get account |
| GET | `/corporate/accounts/:id/employees` | — | STUB | Account employees |
| POST | `/corporate/accounts/:id/employees` | — | STUB | Add employee |
| GET | `/corporate/accounts/:id/reports` | — | STUB | Account reports |
| GET | `/corporate/institutions` | — | STUB | List institutions |
| POST | `/corporate/institutions` | — | STUB | Create institution |
| GET | `/corporate/integrations` | — | STUB | List integrations |
| POST | `/corporate/integrations` | — | STUB | Create integration |
| PUT | `/corporate/integrations/:id` | — | STUB | Update integration |

---

### Careers (`/careers`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/careers/positions` | — | STUB | List positions |
| GET | `/careers/positions/:id` | — | STUB | Get position |
| POST | `/careers/positions/:id/apply` | — | STUB | Apply to position |

---

### NGO (`/ngo`)

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/ngo/partners` | — | STUB | List NGO partners |
| GET | `/ngo/partners/:id` | — | STUB | Get partner |
| POST | `/ngo/partners` | — | STUB | Create partner |
| GET | `/ngo/partners/:id/beneficiaries` | — | STUB | Partner beneficiaries |
| GET | `/ngo/partners/:id/impact` | — | STUB | Partner impact data |

---

### Admin (`/admin`)

All admin routes are stubs. 62 endpoints across these groups:

#### Head Office & Analytics
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/head-office` | STUB | Head office overview |
| GET | `/admin/dashboard` | STUB | Admin dashboard |
| GET | `/admin/platform-health` | STUB | Platform health metrics |
| GET | `/admin/analytics` | STUB | Analytics overview |
| GET | `/admin/analytics/:metric` | STUB | Specific metric |

#### Alerts & Actions
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/alerts` | STUB | System alerts |
| PUT | `/admin/alerts/:id/acknowledge` | STUB | Acknowledge alert |
| GET | `/admin/pending-actions` | STUB | Pending admin actions |

#### User Management
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/users` | STUB | List users |
| GET | `/admin/users/:id` | STUB | Get user |
| PUT | `/admin/users/:id` | STUB | Update user |
| PUT | `/admin/users/:id/suspend` | STUB | Suspend user |
| PUT | `/admin/users/:id/role` | STUB | Change user role |

#### Employee Tracking
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/employees` | STUB | List employees |
| GET | `/admin/employees/:id` | STUB | Get employee |
| GET | `/admin/employees/:id/actions` | STUB | Employee actions |

#### Departments & Targets
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/departments` | STUB | List departments |
| GET | `/admin/departments/:id` | STUB | Get department |
| GET | `/admin/departments/:id/targets` | STUB | Department targets |
| POST | `/admin/departments/:id/targets` | STUB | Create target |
| PUT | `/admin/departments/:id/targets/:targetId` | STUB | Update target |

#### Revenue
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/revenue` | STUB | Revenue overview |
| GET | `/admin/revenue/breakdown/source` | STUB | Revenue by source |
| GET | `/admin/revenue/:period` | STUB | Revenue for period |

#### Therapist Management
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/therapists` | STUB | List therapists |
| GET | `/admin/therapists/:id` | STUB | Get therapist |
| PUT | `/admin/therapists/:id/verify` | STUB | Verify therapist |
| PUT | `/admin/therapists/:id/suspend` | STUB | Suspend therapist |
| GET | `/admin/therapist-quality` | STUB | Quality overview |
| GET | `/admin/therapist-quality/:therapistId` | STUB | Therapist quality |

#### Astrologer Management
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/astrologers` | STUB | List astrologers |
| GET | `/admin/astrologers/:id` | STUB | Get astrologer |
| PUT | `/admin/astrologers/:id/verify` | STUB | Verify astrologer |
| GET | `/admin/astrologer-accuracy` | STUB | Accuracy overview |

#### Session Monitoring
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/sessions` | STUB | List sessions |
| GET | `/admin/sessions/:id` | STUB | Session details |
| GET | `/admin/sessions/:id/recording` | STUB | Session recording |
| GET | `/admin/sessions/:id/monitor/client` | STUB | Client monitor |
| GET | `/admin/sessions/:id/monitor/therapist` | STUB | Therapist monitor |

#### Fraud & Compliance
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/fraud-alerts` | STUB | Fraud alerts |
| GET | `/admin/fraud-alerts/:id` | STUB | Fraud alert detail |
| PUT | `/admin/fraud-alerts/:id/review` | STUB | Review fraud alert |

#### AI Monitoring
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/ai-monitoring` | STUB | AI overview |
| GET | `/admin/ai-monitoring/conversations` | STUB | AI conversations |
| GET | `/admin/ai-monitoring/emergency-flags` | STUB | Emergency flags |
| GET | `/admin/ai-monitoring/patterns` | STUB | AI patterns |

#### Complaints
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/complaints` | STUB | List complaints |
| GET | `/admin/complaints/:id` | STUB | Complaint detail |
| PUT | `/admin/complaints/:id` | STUB | Update complaint |
| PUT | `/admin/complaints/:id/assign` | STUB | Assign complaint |

#### Emergency Flags
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/emergency` | STUB | Emergency list |
| GET | `/admin/emergency/:id` | STUB | Emergency detail |
| PUT | `/admin/emergency/:id` | STUB | Update emergency |
| PUT | `/admin/emergency/:id/escalate` | STUB | Escalate emergency |

#### Blog Moderation
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/blog/pending` | STUB | Pending posts |
| GET | `/admin/blog/all` | STUB | All posts |
| PUT | `/admin/blog/:id/approve` | STUB | Approve post |
| PUT | `/admin/blog/:id/reject` | STUB | Reject post |
| DELETE | `/admin/blog/:id` | STUB | Delete post |

#### Course Moderation
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/courses/pending` | STUB | Pending courses |
| GET | `/admin/courses/all` | STUB | All courses |
| PUT | `/admin/courses/:id/approve` | STUB | Approve course |
| PUT | `/admin/courses/:id/reject` | STUB | Reject course |
| DELETE | `/admin/courses/:id` | STUB | Delete course |

#### Event Management
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/admin/events` | STUB | List events |
| GET | `/admin/events/analytics` | STUB | Event analytics |
| GET | `/admin/events/:id` | STUB | Event detail |
| POST | `/admin/events` | STUB | Create event |
| PUT | `/admin/events/:id` | STUB | Update event |

---

### Dev Routes (development only)

Enabled when `ENABLE_DEV_ROUTES=true` in server config.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dev-login/:email` | Quick dev login by email |
| GET | `/dev-login/` | List dev login options |
| GET | `/dev-helper/dev-create-user/:email/:password/:name` | Create dev user |
| GET | `/dev-helper/dev-login/:email` | Create + login dev user |
| GET | `/dev-helper/dev-users` | List all @test.com users |
| GET | `/dev-helper/dev-create-all` | Batch create all dev users |

---

## Rate Limiting

- Global: API rate limiter on all `/api/v1` routes
- Auth-specific: Stricter rate limit on `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`

## Middleware Pipeline

Applied to all routes (in order):
1. **Helmet** — security headers
2. **CORS** — configured origins
3. **requestContext** — correlation IDs, timing
4. **cookieParser**
5. **express.json** — body parsing with size limit
6. **morgan** — HTTP logging
7. **apiLimiter** — global rate limiter
  - `X-RateLimit-Reset`: Reset timestamp

## Pagination

Paginated endpoints return:

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

## Example Requests

### JavaScript/TypeScript with ApiService

```typescript
import { apiService } from '@/services';

// Get posts
const response = await apiService.get('/blog/posts?page=1&limit=20');

// Create post
const newPost = await apiService.post('/blog/posts', {
  title: 'New Post',
  content: 'Post content',
});

// Update post
const updated = await apiService.put('/blog/posts/123', {
  title: 'Updated Title',
});

// Delete post
await apiService.delete('/blog/posts/123');
```

## Webhooks

Subscribe to events:

```
POST /webhooks/subscribe
Body: {
  "event": "post.created",
  "url": "https://yoursite.com/webhook"
}
```

Supported events:
- `post.created`
- `post.updated`
- `post.deleted`
- `user.created`
- `user.updated`

# SUBTASK G8: 3-Therapist Limit Test

## Overview

This test verifies the maximum 3 active therapist limit for therapy bookings:

- **1st therapist**: ✅ Booking ALLOWED
- **2nd therapist**: ✅ Booking ALLOWED
- **3rd therapist**: ✅ Booking ALLOWED (MAXIMUM)
- **4th therapist**: ❌ Booking REJECTED with error `BIZ_010`

## Test Files

### 1. Backend Integration Test
**File:** `server/tests/test-therapist-limit.mjs`

This script tests the `bookSession` function with the 3-therapist limit by:
- Creating a test user with complete onboarding
- Creating 4 test therapists with availability schedules
- Booking sessions with 3 different therapists (all should succeed)
- Attempting to book with a 4th therapist (should fail)
- Verifying TherapyJourney tracks active therapist count correctly
- Testing that multiple sessions with the same therapist are allowed
- Cleaning up test data after completion

**Run:**
```bash
cd server
npm run test:therapist-limit
# or
npx tsx tests/test-therapist-limit.mjs
```

**Expected Output:**
```
🧪 SUBTASK G8: 3-Therapist Limit Test
============================================================

📝 Step 0: Creating test user and 4 therapists...
✅ Test user created: limit-test-<timestamp>@test.com
✅ Therapist 1 created: <id>...
✅ Therapist 2 created: <id>...
✅ Therapist 3 created: <id>...
✅ Therapist 4 created: <id>...

📅 Step 1: Booking with 1st therapist...
   Expected: Should SUCCEED (1/3 active therapists)
   ✅ Booking succeeded
   Session ID: <id>...
   Scheduled at: Sun, 8 Mar, 10:00 am

📅 Step 2: Booking with 2nd therapist...
   Expected: Should SUCCEED (2/3 active therapists)
   ✅ Booking succeeded
   Session ID: <id>...
   Scheduled at: Mon, 9 Mar, 11:00 am

📅 Step 3: Booking with 3rd therapist...
   Expected: Should SUCCEED (3/3 active therapists - MAX)
   ✅ Booking succeeded
   Session ID: <id>...
   Scheduled at: Tue, 10 Mar, 02:00 pm
   ⚠️  User now has MAXIMUM (3) active therapists

📊 Step 4: Verifying TherapyJourney active therapist count...
   Active therapist count: 3
   ✅ Correct count: 3 active therapists

🚫 Step 5: Attempting to book with 4th therapist...
   Expected: Should FAIL with MAX_THERAPISTS_REACHED error
   ✅ EXPECTED: Booking failed as expected
   Error code: BIZ_010
   Error message: You already have 3 active therapists
   ✅ Correct error code received

📊 Step 6: Verifying active sessions...
   Total active sessions: 3
   Unique therapists: 3
   ✅ Correct: 3 unique active therapists

📅 Step 7: Testing duplicate booking with same therapist...
   Expected: Should SUCCEED (same therapist, different time)
   ✅ Booking succeeded (multiple sessions with same therapist allowed)

============================================================
🎉 ALL 3-THERAPIST LIMIT TESTS PASSED!
============================================================

📊 3-Therapist Limit Summary:
   1st therapist → ✅ ALLOWED
   2nd therapist → ✅ ALLOWED
   3rd therapist → ✅ ALLOWED (MAX)
   4th therapist → ❌ REJECTED

✅ SUBTASK G8 verification complete!
```

### 2. Frontend E2E Test
**File:** `tests/therapist-limit.spec.ts`

Playwright E2E test that verifies UI components related to therapist limits.

**Run:**
```bash
npm run test:e2e -- therapist-limit
```

## 3-Therapist Limit Logic

The limit is enforced in `server/src/services/therapy.service.ts`:

```typescript
const MAX_ACTIVE_THERAPISTS = 3;

// Inside bookSession transaction:
const activeTherapistIds = await tx.session.findMany({
  where: { userId, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } },
  select: { therapistId: true },
  distinct: ['therapistId'],
});
const uniqueIds = new Set(activeTherapistIds.map((s) => s.therapistId));

if (!uniqueIds.has(therapistId) && uniqueIds.size >= MAX_ACTIVE_THERAPISTS) {
  throw new AppError({
    message: `You already have ${MAX_ACTIVE_THERAPISTS} active therapists`,
    statusCode: 409,
    code: ErrorCode.MAX_THERAPISTS_REACHED,
  });
}
```

### Key Rules:

1. **Limit applies to unique therapists** - Multiple sessions with the same therapist are allowed
2. **Active statuses**: `SCHEDULED` and `IN_PROGRESS` count toward the limit
3. **Completed/Cancelled sessions** don't count toward the limit
4. **Error code**: `BIZ_010` (MAX_THERAPISTS_REACHED)
5. **TherapyJourney tracking**: `activeTherapistCount` is updated after each booking/cancellation

## Test Scenarios

### Scenario 1: First booking
```
User has 0 active therapists
Book with Therapist A → ✅ ALLOWED
Active therapists: 1
```

### Scenario 2: Second booking
```
User has 1 active therapist
Book with Therapist B → ✅ ALLOWED
Active therapists: 2
```

### Scenario 3: Third booking (MAX)
```
User has 2 active therapists
Book with Therapist C → ✅ ALLOWED
Active therapists: 3 (MAXIMUM)
```

### Scenario 4: Fourth booking (REJECTED)
```
User has 3 active therapists
Book with Therapist D → ❌ REJECTED
Error: "You already have 3 active therapists"
Code: BIZ_010
```

### Scenario 5: Multiple sessions with same therapist
```
User has 3 active therapists (all with Therapist A)
Book another session with Therapist A → ✅ ALLOWED
(Same therapist doesn't increase unique count)
```

## Related Files

- **Service:** `server/src/services/therapy.service.ts` - `bookSession()` function
- **Schema:** `server/prisma/schema.prisma` - `TherapyJourney` model
- **Errors:** `server/src/lib/errors.ts` - `MAX_THERAPISTS_REACHED` error code
- **Controller:** `server/src/controllers/therapy.controller.ts` - Book session endpoint

## API Endpoint

```http
POST /api/v1/therapy/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "therapistId": "uuid",
  "scheduledAt": "2026-03-10T14:00:00.000Z",
  "sessionType": "standard",
  "bookingSource": "web"
}
```

### Responses:

**Success (201):**
```json
{
  "id": "session-id",
  "userId": "user-id",
  "therapistId": "therapist-id",
  "scheduledAt": "2026-03-10T14:00:00.000Z",
  "status": "SCHEDULED",
  "sessionType": "standard"
}
```

**Error (409):**
```json
{
  "code": "BIZ_010",
  "message": "You already have 3 active therapists"
}
```

## Verification Checklist

- [x] User can book with 1st therapist
- [x] User can book with 2nd therapist
- [x] User can book with 3rd therapist
- [x] User CANNOT book with 4th unique therapist
- [x] Correct error code (BIZ_010) returned for limit exceeded
- [x] Multiple sessions with same therapist are allowed
- [x] TherapyJourney.activeTherapistCount tracks correctly
- [x] Only SCHEDULED and IN_PROGRESS sessions count toward limit
- [x] Test data cleaned up after execution
- [x] Test can be run multiple times without conflicts

## Business Context

The 3-therapist limit serves several important purposes:

1. **Prevents over-commitment**: Users can't book with too many therapists simultaneously
2. **Encourages focus**: Promotes deeper therapeutic relationships with fewer guides
3. **Fair resource distribution**: Ensures therapist availability for all users
4. **Quality over quantity**: Encourages meaningful engagement vs. shopping around
5. **Manageable schedule**: Helps users maintain a sustainable wellness routine

## Therapist Counting Logic

```typescript
// Count distinct therapists (not sessions)
const postBookTherapists = await tx.session.findMany({
  where: { userId, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } },
  select: { therapistId: true },
  distinct: ['therapistId'],
});

// Update TherapyJourney with unique therapist count
await tx.therapyJourney.upsert({
  where: { userId },
  create: { userId, activeTherapistCount: postBookTherapists.length },
  update: { activeTherapistCount: postBookTherapists.length },
});
```

### What Counts:
- ✅ Sessions with status `SCHEDULED`
- ✅ Sessions with status `IN_PROGRESS`

### What Doesn't Count:
- ❌ Sessions with status `COMPLETED`
- ❌ Sessions with status `CANCELLED`
- ❌ Sessions with status `NO_SHOW`

## Troubleshooting

### Error: Selected time slot is no longer available
The test creates therapist availability schedules. Ensure the booking times fall within the availability windows (09:00-18:00, all days).

### Error: DATABASE_URL is required
Make sure you're running from the `server` directory and have a `.env` file.

### Test fails with onboarding errors
The test creates a complete user profile with `onboardingComplete: true`. If this fails, check the UserProfile schema.

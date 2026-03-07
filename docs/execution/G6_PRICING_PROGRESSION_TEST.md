# SUBTASK G6: Pricing Stage Progression Test

## Overview

This test verifies the 3-stage progressive pricing model for therapy sessions:

1. **Discovery** (0 sessions): Free 15-minute introductory call
2. **Pay As You Like** (1-2 sessions): User chooses the amount to pay
3. **Standard** (3+ sessions): Fixed price per session

## Test Files

### 1. Backend Integration Test
**File:** `server/tests/test-pricing-progression.mjs`

This script tests the `getUserPricingStage` function by:
- Creating a test user
- Simulating session completions at each stage
- Verifying the pricing stage transitions correctly
- Cleaning up test data after completion

**Run:**
```bash
cd server
npm run test:pricing
# or
npx tsx tests/test-pricing-progression.mjs
```

**Expected Output:**
```
🧪 SUBTASK G6: Pricing Stage Progression Test
============================================================

📝 Step 0: Creating test user...
✅ Test user created: pricing-test-<timestamp>@test.com

📊 Step 1: Checking initial pricing stage...
   Stage: discovery
   Completed Sessions: 0
✅ Initial stage is correct: DISCOVERY

📅 Step 2: Simulating discovery session completion...
✅ Discovery session marked as completed

💰 Step 3: Verifying pricing stage is now pay_as_you_like...
   Stage: pay_as_you_like
   Completed Sessions: 1
✅ Pricing stage correctly changed to: PAY_AS_YOU_LIKE

📅 Step 4: Simulating pay_as_you_like session completion...
✅ Pay-as-you-like session marked as completed

💰 Step 5: Verifying pricing stage with 2 completed sessions...
   Stage: pay_as_you_like
   Completed Sessions: 2
✅ Pricing stage correctly remains: PAY_AS_YOU_LIKE

📅 Step 6: Simulating third session completion...
✅ Third session marked as completed

💵 Step 7: Verifying pricing stage is now standard...
   Stage: standard
   Completed Sessions: 3
✅ Pricing stage correctly changed to: STANDARD

============================================================
🎉 ALL TESTS PASSED!
============================================================

📊 Pricing Stage Progression Summary:
   0 sessions → discovery
   1-2 sessions → pay_as_you_like
   3+ sessions → standard

✅ SUBTASK G6 verification complete!
```

### 2. Frontend E2E Test
**File:** `tests/pricing-progression.spec.ts`

Playwright E2E test that verifies the full frontend flow:
- User registration
- Booking flow through each pricing stage
- UI indicators for each pricing stage

**Run:**
```bash
npm run test:e2e -- pricing-progression
```

### 3. Unit Tests
**File:** `server/tests/pricing-progression.test.ts`

Node.js native test module with unit tests for the pricing logic.

**Run:**
```bash
cd server
node --test tests/pricing-progression.test.ts
```

## Pricing Logic

The pricing stage is determined by the `completedSessionCount` in the `TherapyJourney` model:

```typescript
if (completedSessionCount === 0) {
  return 'discovery';        // Free 15-min call
}
if (completedSessionCount <= 2) {
  return 'pay_as_you_like';  // User chooses amount (sessions 1-2)
}
return 'standard';           // Fixed price (sessions 3+)
```

## Related Files

- **Service:** `server/src/services/therapy.service.ts` - `getUserPricingStage()` function
- **Schema:** `server/prisma/schema.prisma` - `TherapyJourney` model
- **Types:** `src/types/therapy.types.ts` - `PricingStage` type definition
- **Frontend:** `src/pages/dashboard/SessionsPage.tsx` - Uses pricing stage for booking

## Verification Checklist

- [x] New user starts at "discovery" stage
- [x] After 1 completed session → "pay_as_you_like"
- [x] After 2 completed sessions → still "pay_as_you_like"
- [x] After 3+ completed sessions → "standard"
- [x] Test data is cleaned up after test execution
- [x] Test can be run multiple times without conflicts

## Troubleshooting

### Error: DATABASE_URL is required
Make sure you're running from the `server` directory and have a `.env` file with `DATABASE_URL` set.

### Error: Prisma Client not generated
Run `npx prisma generate` to regenerate the Prisma client.

### Test fails with existing user conflicts
The test uses timestamp-based unique emails, but if you're seeing conflicts, check if the database needs cleanup.

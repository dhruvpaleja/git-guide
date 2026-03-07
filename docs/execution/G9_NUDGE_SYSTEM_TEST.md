# SUBTASK G9: Nudge Generation and Dismissal Test

## Overview

This test verifies the behavioral nudge system, specifically the `first_session_free` nudge:

1. **Nudge Generation**: User with completed onboarding gets `first_session_free` nudge
2. **Nudge Dismissal**: User can dismiss the nudge
3. **Cooldown Period**: Dismissed nudge doesn't reappear for 7 days

## Test Files

### 1. Backend Integration Test
**File:** `server/tests/test-nudge-system.mjs`

This script tests the nudge system by:
- Creating a test user with completed onboarding
- Verifying user has no booked sessions (eligibility check)
- Evaluating nudges → Should create `first_session_free`
- Dismissing the nudge → Should set 7-day cooldown
- Re-evaluating nudges → Should NOT create duplicate during cooldown
- Testing security (ownership verification)
- Cleaning up test data after completion

**Run:**
```bash
cd server
npm run test:nudge
# or
npx tsx tests/test-nudge-system.mjs
```

**Expected Output:**
```
🧪 SUBTASK G9: Nudge Generation and Dismissal Test
============================================================

📝 Step 0: Creating test user with completed onboarding...
✅ Test user created: nudge-test-<timestamp>@test.com
✅ Onboarding status: Complete (step 10/10)

📊 Step 1: Verifying user has no booked sessions...
   Session count: 0
   ✅ User has no sessions (eligible for first_session_free nudge)

💡 Step 2: Evaluating nudges...
   Expected: Should create first_session_free nudge
   Total nudges created: 1
   ✅ first_session_free nudge created
   Nudge ID: <id>...
   Status: pending
   Created: Sat, 7 Mar, 10:19 pm

📬 Step 3: Getting active nudges...
   Active nudges count: 1
   ✅ Active nudges available
   ✅ first_session_free is in active nudges

🚫 Step 4: Dismissing first_session_free nudge...
   ✅ Nudge dismissed
   New status: dismissed
   Dismissed at: Sat, 7 Mar, 10:19 pm
   Cooldown until: Sat, 14 Mar, 10:19 pm
   Cooldown duration: 7.0 days
   ✅ Cooldown is correctly set to 7 days

🔄 Step 5: Re-evaluating nudges immediately after dismissal...
   Expected: Should NOT create new first_session_free (in cooldown)
   Total first_session_free nudges: 1
   ✅ No duplicate nudge created (cooldown working)
   Active first_session_free nudges: 0
   ✅ No active nudges (dismissed one is in cooldown)

📋 Step 6: Verifying nudge status history...
   Nudge: first_session_free
     Status: dismissed
     Created: Sat, 7 Mar, 10:19 pm
     Dismissed: Sat, 7 Mar, 10:19 pm
     Cooldown until: Sat, 14 Mar, 10:19 pm
   ✅ Nudge correctly marked as dismissed

🔒 Step 7: Testing nudge dismissal security...
   Expected: Cannot dismiss another user's nudge
   ✅ Security check passed (ownership verified)

============================================================
🎉 ALL NUDGE SYSTEM TESTS PASSED!
============================================================

📊 Nudge System Summary:
   User with completed onboarding → ✅ Gets first_session_free
   Dismiss nudge → ✅ Sets 7-day cooldown
   Re-evaluate during cooldown → ✅ No duplicate created
   Ownership check → ✅ Security enforced

✅ SUBTASK G9 verification complete!
```

### 2. Frontend E2E Test
**File:** `tests/nudge-system.spec.ts`

Playwright E2E test that verifies:
- Nudge cards are displayed in the UI
- Dismiss button functionality
- CTA button presence
- General nudge UI behavior

**Run:**
```bash
npm run test:e2e -- nudge-system
```

## Nudge System Logic

The nudge generation is handled in `server/src/services/nudge.service.ts`:

### Nudge Generation Rule for `first_session_free`:

```typescript
// Rule 1: first_session_free
if (
  profile.onboardingComplete &&
  (!journey || journey.completedSessionCount === 0) &&
  canCreate('first_session_free')
) {
  toCreate.push({ type: 'first_session_free' });
}
```

### Eligibility Criteria:

1. ✅ **Onboarding complete**: `profile.onboardingComplete === true`
2. ✅ **No sessions booked**: `journey.completedSessionCount === 0` or no journey exists
3. ✅ **Not in cooldown**: `canCreate('first_session_free')` passes cooldown check

### Nudge Template:

```typescript
first_session_free: {
  title: 'Your first call is free',
  message: 'Start your wellness journey with a complimentary discovery session — no commitment needed.',
  cta: 'Book Free Session',
  cooldownDays: 7,  // ← 7 day cooldown after dismissal
}
```

## Test Scenarios

### Scenario 1: New user with completed onboarding
```
User: onboardingComplete = true
Sessions: 0
Evaluate nudges → ✅ Creates first_session_free
Status: pending
```

### Scenario 2: User dismisses nudge
```
Nudge: first_session_free
Action: Dismiss
Result → ✅ Status: dismissed
         ✅ Cooldown until: +7 days
```

### Scenario 3: Re-evaluate during cooldown
```
Time: < 7 days after dismissal
Evaluate nudges → ✅ NO new nudge created
Reason: Cooldown period active
```

### Scenario 4: Re-evaluate after cooldown
```
Time: > 7 days after dismissal
Evaluate nudges → ✅ Creates new first_session_free
(If still eligible: no sessions booked)
```

### Scenario 5: Security - ownership check
```
User A tries to dismiss User B's nudge
Result → ❌ REJECTED
Error: "Nudge not found or not owned by user"
```

## Related Files

- **Service:** `server/src/services/nudge.service.ts` - Main nudge logic
- **Schema:** `server/prisma/schema.prisma` - `UserNudge` model
- **Controller:** `server/src/controllers/nudge.controller.ts` - API endpoints
- **Types:** Defined in nudge.service.ts - `NudgeType`, `NudgeTemplate`

## Nudge Types

The system supports multiple nudge types:

| Nudge Type | Trigger | Cooldown |
|------------|---------|----------|
| `first_session_free` | Onboarding complete, 0 sessions | 7 days |
| `low_mood_streak` | 3+ days of low mood scores | 3 days |
| `session_gap_reminder` | >14 days since last session | 7 days |
| `post_session_rate` | Session completed, not rated | Never repeat |
| `astrology_interest` | User interested in astrology | 7 days |
| `pay_as_you_like_return` | 1 session completed, >7 days ago | 7 days |

## API Endpoints

### Get Active Nudges
```http
GET /api/v1/nudges
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "nudge-id",
    "nudgeType": "first_session_free",
    "status": "pending",
    "title": "Your first call is free",
    "message": "Start your wellness journey...",
    "cta": "Book Free Session",
    "createdAt": "2026-03-07T..."
  }
]
```

### Dismiss Nudge
```http
POST /api/v1/nudges/:id/dismiss
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "nudge-id",
  "status": "dismissed",
  "dismissedAt": "2026-03-07T...",
  "cooldownUntil": "2026-03-14T..."
}
```

### Mark Nudge Acted
```http
POST /api/v1/nudges/:id/act
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "nudge-id",
  "status": "acted",
  "actedAt": "2026-03-07T..."
}
```

## Verification Checklist

- [x] User with completed onboarding gets `first_session_free` nudge
- [x] Nudge has correct title, message, and CTA
- [x] User can dismiss the nudge
- [x] Dismissal sets status to `dismissed`
- [x] Dismissal sets `cooldownUntil` to 7 days in future
- [x] Re-evaluation during cooldown doesn't create duplicate
- [x] Active nudges excludes dismissed nudges in cooldown
- [x] Ownership check prevents dismissing other users' nudges
- [x] Test data cleaned up after execution
- [x] Test can be run multiple times without conflicts

## Nudge Status Flow

```
pending → dismissed (cooldown starts)
   ↓
shown (when displayed to user)
   ↓
acted (when user clicks CTA)
```

### Status Values:

- **`pending`**: Newly created, not yet shown
- **`shown`**: Displayed to user (tracked for analytics)
- **`dismissed`**: User dismissed it (triggers cooldown)
- **`acted`**: User clicked the CTA (conversion!)

## Cooldown Logic

```typescript
const canCreate = (type: NudgeType): boolean => {
  const existing = nudges.filter(n => n.nudgeType === type);
  const lastDismissed = existing.find(n => n.dismissedAt);
  
  if (lastDismissed?.cooldownUntil && lastDismissed.cooldownUntil > now) {
    return false; // Still in cooldown
  }
  
  return true;
};
```

### Cooldown Periods:

- **7 days**: `first_session_free`, `session_gap_reminder`, `astrology_interest`, `pay_as_you_like_return`
- **3 days**: `low_mood_streak`, `constellation_pattern`
- **Never**: `post_session_rate` (one-time action)

## Business Context

The nudge system serves several purposes:

1. **User Engagement**: Encourages users to take meaningful actions
2. **Onboarding Conversion**: `first_session_free` converts onboarded users to active users
3. **Retention**: `session_gap_reminder` brings users back after long gaps
4. **Support**: `low_mood_streak` offers help during difficult times
5. **Feedback**: `post_session_rate` collects quality feedback
6. **Monetization**: `pay_as_you_like_return` encourages second booking

## Frontend Integration

Example React hook usage:

```typescript
// Fetch active nudges
const { data: nudges } = useQuery(['nudges'], fetchNudges);

// Dismiss nudge
const dismissMutation = useMutation(
  (nudgeId: string) => dismissNudge(nudgeId),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['nudges']);
    }
  }
);

// Render nudge card
{nudges?.map(nudge => (
  <NudgeCard
    key={nudge.id}
    title={nudge.title}
    message={nudge.message}
    cta={nudge.cta}
    onDismiss={() => dismissMutation.mutate(nudge.id)}
    onAct={() => actNudge(nudge.id)}
  />
))}
```

## Troubleshooting

### Error: DATABASE_URL is required
Make sure you're running from the `server` directory and have a `.env` file.

### Nudge not created
Verify:
- User has `onboardingComplete: true`
- User has 0 completed sessions
- User doesn't have an active cooldown for this nudge type

### Cooldown not working
Check:
- Nudge was properly dismissed (status = `dismissed`)
- `cooldownUntil` is set correctly
- Re-evaluation happens within the 7-day window

### Security error during dismissal
Ensure:
- The user ID matches the nudge owner
- The nudge ID exists and is valid

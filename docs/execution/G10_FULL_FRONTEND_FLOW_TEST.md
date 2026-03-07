# SUBTASK G10: Full Frontend Flow Test

## Overview

This test verifies the complete user booking journey from dashboard to confirmation:

1. **Navigate to Dashboard** → User lands on personalized dashboard
2. **See Recommended Therapists** → Matched therapists displayed
3. **Click "Connect"** → Opens booking flow
4. **See Time Slots** → Real availability shown
5. **Book Session** → Confirmation created
6. **See Upcoming Sessions** → Widget displays booked session

## Test Files

### 1. Backend API Flow Test
**File:** `server/tests/test-full-booking-flow.mjs`

This script tests all API endpoints needed for the frontend flow:
- `getUserJourney` - Get pricing stage
- `getMatchedTherapists` - Get recommended therapists
- `getAvailableSlots` - Get therapist availability
- `bookSession` - Create booking
- Get upcoming sessions
- Verify TherapyJourney updates

**Run:**
```bash
cd server
npm run test:flow
# or
npx tsx tests/test-full-booking-flow.mjs
```

**Expected Output:**
```
🧪 SUBTASK G10: Full Booking Flow Test (Backend API)
============================================================

📝 Step 0: Creating test user with complete profile...
✅ Test user created: flow-test-<timestamp>@test.com
✅ Onboarding: Complete
✅ Therapist created: Dr. Wellness Guide
✅ Availability: 7 days/week (09:00-18:00)

📊 Step 1: Getting user therapy journey (pricing stage)...
   Pricing stage: discovery
   Completed sessions: 0
   Active therapists: 0
   ✅ User is eligible for discovery session (free)

👥 Step 2: Getting recommended therapists...
   Total recommended: 10
   ✅ Found 10 recommended therapist(s)
   First therapist: Dr. Ananya Singh
   Specializations: grief, trauma, depression
   Experience: 15 years
   Price: ₹950
   Rating: 4.9 (289 reviews)
   Match score: 65.1
   Next available: 2026-03-09T03:30:00.000Z

📅 Step 3: Getting available time slots...
   Available slots found: 60
   ✅ Therapist has availability

📝 Step 4: Booking a session...
   ✅ Session booked successfully!
   Session ID: <id>...
   Scheduled at: Tue, 10 Mar, 10:00 am
   Session type: discovery
   Duration: 15 min
   Price: ₹0

📆 Step 5: Getting upcoming sessions...
   Upcoming sessions: 1
   ✅ Next session: Tue, 10 Mar, 10:00 am
   Therapist: Dr. Wellness Guide
   Status: SCHEDULED
   Type: discovery

💡 Step 6: Getting active nudges...
   Total nudges: 0

📊 Step 7: Verifying TherapyJourney updated...
   Active therapists: 1
   Completed sessions: 0
   ✅ TherapyJourney correctly updated (1 active therapist)

🔔 Step 8: Simulating post-booking notifications...
   ✅ Session details available for notification
   User: Full Flow Test User
   Therapist: Dr. Wellness Guide
   Ready for confirmation email/notification

============================================================
🎉 FULL BOOKING FLOW TEST PASSED!
============================================================

📊 API Flow Summary:
   1. getUserJourney → ✅ Pricing stage determined
   2. getMatchedTherapists → ✅ Therapists found
   3. getAvailableSlots → ✅ Time slots available
   4. bookSession → ✅ Session booked
   5. Get upcoming sessions → ✅ Session listed
   6. getActiveNudges → ✅ Nudges evaluated
   7. TherapyJourney update → ✅ Count incremented
   8. Post-booking flow → ✅ Ready for notifications

✅ All API endpoints working correctly!
✅ SUBTASK G10 verification complete!
```

### 2. Frontend E2E Test
**File:** `tests/full-frontend-flow.spec.ts`

Playwright E2E test that verifies the complete frontend user journey:
- Dashboard loads with personalized content
- Therapist cards display correctly
- Connect button opens booking modal
- Time slots are shown
- Booking form works
- Confirmation appears
- Upcoming sessions widget displays booking

**Run:**
```bash
npm run test:e2e -- full-frontend-flow
```

## Complete Flow Steps

### Step 1: Dashboard Access
```
User navigates to /dashboard
→ Dashboard loads with welcome message
→ Personalized content displayed
→ Navigation menu accessible
```

### Step 2: View Recommended Therapists
```
Navigate to /dashboard/sessions
→ Therapist cards load
→ Each card shows:
   - Photo/avatar
   - Name
   - Specializations
   - Experience
   - Rating
   - Price
   - "Connect" button
```

### Step 3: Select Therapist
```
Click "Connect" button
→ Booking modal/page opens
→ Therapist details shown
→ Session type displayed (discovery/free)
```

### Step 4: Choose Time Slot
```
View available slots
→ Calendar shows dates
→ Time slots displayed
→ Available slots highlighted
→ Selected slot confirmed
```

### Step 5: Book Session
```
Click "Confirm" or "Book"
→ Session created
→ TherapyJourney updated
→ activeTherapistCount incremented
```

### Step 6: Confirmation
```
Success message displayed
→ Session details shown
→ Date/time confirmed
→ Therapist name displayed
→ Calendar invite option
```

### Step 7: Upcoming Sessions Widget
```
Return to dashboard
→ Upcoming sessions widget visible
→ Session details displayed
→ Action buttons available (reschedule, cancel)
```

## API Endpoints Used

### 1. Get Therapy Journey
```http
GET /api/v1/therapy/journey
Authorization: Bearer <token>
```

**Response:**
```json
{
  "pricingStage": "discovery",
  "completedSessionCount": 0,
  "activeTherapistCount": 0
}
```

### 2. Get Matched Therapists
```http
GET /api/v1/therapy/therapists?limit=10
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "therapistId": "uuid",
    "name": "Dr. Ananya Singh",
    "specializations": ["grief", "trauma", "depression"],
    "experience": 15,
    "pricePerSession": 950,
    "rating": 4.9,
    "totalReviews": 289,
    "matchScore": 65.1,
    "nextAvailableSlot": "2026-03-09T03:30:00.000Z"
  }
]
```

### 3. Get Available Slots
```http
GET /api/v1/therapy/therapists/:id/slots?date=2026-03-10
Authorization: Bearer <token>
```

**Response:**
```json
["2026-03-10T09:00:00.000Z", "2026-03-10T09:50:00.000Z", ...]
```

### 4. Book Session
```http
POST /api/v1/therapy/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "therapistId": "uuid",
  "scheduledAt": "2026-03-10T10:00:00.000Z",
  "sessionType": "discovery",
  "bookingSource": "web"
}
```

**Response:**
```json
{
  "id": "session-id",
  "userId": "user-id",
  "therapistId": "therapist-id",
  "scheduledAt": "2026-03-10T10:00:00.000Z",
  "duration": 15,
  "sessionType": "discovery",
  "priceAtBooking": 0,
  "status": "SCHEDULED"
}
```

### 5. Get Upcoming Sessions
```http
GET /api/v1/therapy/sessions?status=upcoming
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "session-id",
    "scheduledAt": "2026-03-10T10:00:00.000Z",
    "therapist": {
      "name": "Dr. Wellness Guide"
    },
    "status": "SCHEDULED",
    "sessionType": "discovery"
  }
]
```

## Verification Checklist

- [x] Dashboard loads successfully
- [x] Recommended therapists displayed
- [x] Therapist cards show complete information
- [x] Connect button is clickable
- [x] Booking modal/page opens
- [x] Time slots are displayed
- [x] Session can be booked
- [x] Confirmation message appears
- [x] TherapyJourney.activeTherapistCount updates
- [x] Upcoming sessions widget shows booking
- [x] Session details are correct
- [x] Test data cleaned up after test

## Frontend Components Involved

1. **DashboardPage** - Main dashboard container
2. **SessionsPage** - Therapist listing and booking
3. **BookingFlow** - Booking modal/component
4. **ScheduledSessionsWidget** - Upcoming sessions display
5. **TherapistCard** - Individual therapist display

## Backend Services Involved

1. **therapy.service.ts** - `bookSession`, `getUserJourney`
2. **matching.service.ts** - `getMatchedTherapists`
3. **availability.service.ts** - `getAvailableSlots`
4. **nudge.service.ts** - `getActiveNudges`
5. **prisma schema** - Session, TherapyJourney models

## Session Type Determination

The session type is automatically determined by pricing stage:

```typescript
// From therapy.service.ts
const sessionType = 
  pricingStage === 'discovery' ? 'discovery' :
  pricingStage === 'pay_as_you_like' ? 'pay_as_you_like' :
  'standard';

// Duration based on type
const duration = sessionType === 'discovery' ? 15 : 45; // minutes
```

### Discovery Session (First booking)
- **Duration**: 15 minutes
- **Price**: FREE (₹0)
- **Purpose**: Build trust, no commitment

### Pay As You Like (Sessions 2-3)
- **Duration**: 45 minutes
- **Price**: User chooses
- **Purpose**: Flexible pricing for returning users

### Standard (Sessions 4+)
- **Duration**: 45 minutes
- **Price**: Therapist's standard rate
- **Purpose**: Regular paid sessions

## Common Issues & Solutions

### Issue: "Selected time slot is no longer available"
**Cause**: Slot was already booked or outside availability hours
**Solution**: Use `getAvailableSlots` to fetch real-time availability

### Issue: "You already have 3 active therapists"
**Cause**: User hit the 3-therapist limit
**Solution**: Cancel existing session or complete sessions first

### Issue: "Onboarding incomplete"
**Cause**: User profile not complete
**Solution**: Complete onboarding flow before booking

### Issue: No therapists shown
**Cause**: No verified/available therapists in database
**Solution**: Seed therapist data or verify therapists in database

## Business Context

This flow is the core user journey for the platform:

1. **Discovery → Trust**: Free first session removes barriers
2. **Matching → Relevance**: Personalized therapist recommendations
3. **Booking → Convenience**: Easy scheduling with real availability
4. **Confirmation → Assurance**: Clear confirmation reduces anxiety
5. **Widget → Retention**: Upcoming sessions visible for engagement

## Frontend Testing Notes

The Playwright E2E test is designed to:
- Work with auth bypass enabled (dev mode)
- Handle loading states gracefully
- Verify UI elements without breaking flows
- Test component rendering and interactions

For full booking flow testing, use the backend test which:
- Creates complete test data
- Tests all API endpoints
- Verifies business logic
- Cleans up after execution

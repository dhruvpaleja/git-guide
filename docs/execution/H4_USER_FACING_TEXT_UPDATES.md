# SUBTASK H4: User-Facing Text Updates

## Overview

Updated user-facing text throughout the frontend to use warmer, more accessible terminology:

- **"therapist"** → **"wellness guide"** or **"Soul Guide"**
- **"therapy session"** → **"wellness call"** or **"soul session"**
- **"book a session"** → **"connect with a guide"**

**Note:** Backend code variable names, type names, and API endpoints were NOT changed - only UI-facing text.

## Files Updated

### 1. `src/pages/DashboardPage.tsx`

**Changes:**
- Quick action label: `"Book a Session"` → `"Connect with a Guide"`
- Quick action description: `"Find the right therapist"` → `"Find the right wellness guide"`
- Button text: `"Book a Session"` → `"Connect with a Guide"`
- Comment: `"therapist recommendation"` → `"wellness guide recommendation"`

**Lines affected:** 33-36, 155, 188

### 2. `src/pages/dashboard/SessionsPage.tsx`

**Changes:**
- Comment in booking modal: `"Therapist mini card"` → `"Guide mini card"`

**Lines affected:** 1069

### 3. `src/features/dashboard/components/widgets/HumanMatchCard.tsx`

**Changes:**
- Empty state text: `"Soul Guide matches"` → `"wellness guide matches"`
- Section comment: `"Therapist Profile + CTA"` → `"Wellness Guide Profile + CTA"`

**Lines affected:** 120, 175

### 4. `src/features/onboarding/components/steps/StepGender.tsx`

**Changes:**
- Help text: `"your therapist match"` → `"your wellness guide match"`

**Lines affected:** 22

## Terminology Guide

### User-Facing Terms

| Old Term | New Term | Context |
|----------|----------|---------|
| therapist | wellness guide | General reference |
| therapist | Soul Guide | Branded term |
| book a session | connect with a guide | Call-to-action |
| therapy session | wellness call | Session reference |
| therapist match | wellness guide match | Matching context |
| therapist recommendation | wellness guide recommendation | Recommendation context |

### Backend Terms (UNCHANGED)

These terms remain unchanged in code:
- `therapistId` (variable/property names)
- `TherapistCard` (type names)
- `therapyApi` (service names)
- `/therapy/` (API endpoints)
- `getRecommendedTherapists()` (function names)
- `bookingTherapist` (variable names)

## Rationale

The new terminology serves several purposes:

1. **Reduced stigma**: "Wellness guide" feels less clinical than "therapist"
2. **Accessibility**: More approachable for users new to mental health support
3. **Brand alignment**: "Soul Guide" aligns with the Soul Yatri brand identity
4. **Action-oriented**: "Connect with a guide" emphasizes relationship over transaction
5. **Holistic approach**: "Wellness" encompasses mental, emotional, and spiritual health

## Verification

To verify the changes:

1. **Dashboard Page**: 
   - Navigate to `/dashboard`
   - Check "Connect with a Guide" button text
   - Verify quick action card description

2. **Sessions Page**:
   - Navigate to `/dashboard/sessions`
   - Open booking modal
   - Check guide card labeling

3. **Human Match Card**:
   - Check dashboard widget
   - Verify "wellness guide" terminology in empty state

4. **Onboarding**:
   - Go through onboarding flow
   - Check StepGender help text

## Testing

Run the frontend to ensure no broken references:

```bash
npm run dev
```

Check the browser console for any errors related to the text changes.

## Related Files (Not Changed)

These files contain "therapist" references that should NOT be changed:

- **Backend code**: `server/src/**/*.ts` - Keep technical names
- **Type definitions**: `src/types/therapy.types.ts` - Keep interface names
- **API services**: `src/services/therapy.api.ts` - Keep function names
- **Route config**: `src/config/routes.ts` - Keep route names/paths
- **Permissions**: `src/config/permissions.ts` - Keep permission IDs
- **Test utilities**: `src/utils/testing.utils.ts` - Keep mock data names

## Impact

These changes affect:
- ✅ User interface text
- ✅ Call-to-action buttons
- ✅ Help messages
- ✅ Empty states
- ✅ Section headers (comments)

These changes do NOT affect:
- ❌ API endpoints
- ❌ Database schema
- ❌ Type definitions
- ❌ Function names
- ❌ Variable names
- ❌ Route paths

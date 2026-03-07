# Signup vs Dashboard Personalization - Flow Isolation Verification

> Re-verification note (2026-03-07): this document is still useful for understanding intended signup vs personalization separation, but its route-protection and production-readiness language was stronger than the current runtime guarantees. It should be read as a flow-shape verification note, not a deployment certificate.

**Status:** Flow isolation mostly verified; production-readiness wording in this file should not be treated as canonical

---

## Flow Architecture

### ✅ SIGNUP FLOW (Clean & Simple)
```
/signup (empty)
  ↓ OnboardingSignupPage
  ↓ "Let's get started" → ?step=account
  ↓ OnboardingCreateAccountPage (email, password)
  ↓ "Create Account" → ?step=astrology
  ↓ OnboardingAstrologyPage (date + gender + birthplace + birth time)
  ├─ NO MATCHING (wantMatchmaking: false)
  │   ↓ POST /api/v1/users/astrology-profile saved to DB
  │   ↓ Navigate → /journey-preparation (loading screen, 5.6s)
  │   ↓ Auto-navigate → /dashboard
  │
  └─ WANTS MATCHING (wantMatchmaking: true)
      ↓ ?step=partner-details
      ↓ OnboardingPartnerDetailsPage (partner details)
      ↓ POST /api/v1/users/astrology-profile (merged) saved to DB
      ↓ Navigate → /journey-preparation
      ↓ Auto-navigate → /dashboard
```

**Entry Points:** `/signup`, `/signup?step=account`, `/signup?step=astrology`, `/signup?step=partner-details`  
**Questions Included:** 0 (NO onboarding questions)  
**Exit Destination:** `/journey-preparation` → `/dashboard`

---

### ✅ DASHBOARD PERSONALIZATION FLOW (Optional Nudge)
```
/dashboard (authenticated)
  ├─ Fetch GET /api/v1/users/onboarding
  ├─ IF step < 10 && !onboardingComplete && !dismissed
  │   └─ Show Nudge Card: "Help us know you better ✨"
  │       ├─ Button: "Personalize Now" → /personalize?s=4
  │       └─ Button: "✕" Dismiss (sets local state, resets on page reload)
  │
  └─ Click "Personalize Now"
      ↓ Navigate → /personalize?s=4 (PROTECTED route, requires auth)
      ↓ OnboardingWizardPage (questions ONLY 4-10, NOT 1-3)
      │
      ├─ Step 4: Struggles (what you're struggling with)
      ├─ Step 5: Therapy History (have you had therapy before?)
      ├─ Step 6: Goals (what are your goals?)
      ├─ Step 7: Therapist Prefs (therapist preferences)
      ├─ Step 8: Interests (your interests)
      ├─ Step 9: Emergency Contact (emergency contact details)
      ├─ Step 10: Confirmation (confirm all answers)
      │
      ├─ Each step: POST /api/v1/users/onboarding { step, data } saved to DB
      ├─ Step 10: Backend sets onboardingComplete = true
      └─ Navigate → /dashboard (flow complete, nudge disappears)
```

**Entry Point:** `/personalize?s=4` (ONLY accessible from dashboard nudge or direct nav if authenticated)  
**Questions Included:** 7 (steps 4, 5, 6, 7, 8, 9, 10)  
**Questions NOT Included:** 1, 2, 3 (never shown to users)  
**Route Protection:** ProtectedRoute route wrapper in code; runtime behavior still depends on current flag/config strategy  
**Exit Destination:** `/dashboard`

---

## Code Structure Proof

### ✅ SignupPage.tsx - NO onboarding questions
```tsx
// ONLY These entry points:
if (step === 'account') → OnboardingCreateAccountPage
if (step === 'astrology') → OnboardingAstrologyPage
if (step === 'partner-details') → OnboardingPartnerDetailsPage
return → OnboardingSignupPage (default)

// ❌ NO: if (step === 'onboarding')
// ❌ NO: if (step === 'personalize')
// ❌ NO: Link to /personalize
```

**File:** `src/pages/auth/SignupPage.tsx` (78 lines)  
**Imports:** Only account/astrology/partner pages - NO wizard, NO step components  
**Result:** Signup is 100% clean, no questions

---

### ✅ DashboardPage.tsx - Nudge card to /personalize
```tsx
// Fetch onboarding progress
GET /api/v1/users/onboarding → onboardingStep, isComplete

// Show nudge if:
- !loading (data loaded)
- !dismissed (user hasn't dismissed)
- !isComplete (onboarding not finished)

// Nudge Card:
<Link to="/personalize?s=4">
  "Help us know you better ✨"
  "Answer a few quick questions..."
  Button: "Personalize Now"
</Link>

// Dismiss:
<button onClick={() => setDismissed(true)}>✕</button>
```

**File:** `src/pages/DashboardPage.tsx` (77 lines)  
**Route Protection:** Inside DashboardLayout (authenticated)  
**Result:** Dashboard shows nudge ONLY if user hasn't completed onboarding

---

### ✅ Router - /personalize is protected
```tsx
{
  element: <ProtectedRoute />,  // ← REQUIRES AUTH
  children: [
    {
      path: '/personalize',
      element: <OnboardingWizardPage />  // ← Steps 4-10 ONLY
    },
    {
      path: '/dashboard',
      element: <DashboardPage />  // ← Shows nudge card
    },
  ]
}
```

**File:** `src/router/index.tsx` (lines 91-119)  
**Protection:** ProtectedRoute wrapper exists in router  
**Result:** Flow separation is structurally present in the router, but this file should not be used as blanket proof of runtime protection policy in every environment

---

## Data Flow

### Signup → Astrology Saved
```
POST /api/v1/users/astrology-profile
{
  birthDate, gender, birthCity, birthTime,
  wantMatchmaking, partners
}
↓
UserProfile updated:
  ✅ dateOfBirth
  ✅ gender
  ✅ birthPlace
  ✅ birthTime
  ✅ onboardingStep = 3
  ✅ onboardingComplete = false
```

### Dashboard Questions → Saved
```
POST /api/v1/users/onboarding
{ step: 4, data: { struggles: [...] } }
{ step: 5, data: { therapyHistory: ... } }
{ step: 6, data: { goals: [...] } }
{ step: 7, data: { therapistGenderPref: ... } }
{ step: 8, data: { interests: [...] } }
{ step: 9, data: { emergencyName: ... } }
{ step: 10, data: {} }
↓
UserProfile updated with each step:
  ✅ struggles
  ✅ therapyHistory
  ✅ goals
  ✅ therapistGenderPref
  ✅ therapistLanguages
  ✅ therapistApproach
  ✅ interests
  ✅ emergencyName
  ✅ emergencyPhone
  ✅ emergencyRelation
  ✅ onboardingStep = 10
  ✅ onboardingComplete = true
```

### Dashboard Regeneration
```
GET /api/v1/users/onboarding
↓
{
  step: 10,
  isComplete: true,
  data: {
    dateOfBirth, gender, birthPlace, ...all profile fields
  }
}
↓
DashboardPage:
  - shouldShowNudge = false (isComplete === true)
  - Nudge card NOT displayed
  - User sees clean dashboard
```

---

## URL Route Map

| URL | Component | Auth Required | Questions | Purpose |
|-----|-----------|---|-----------|----------|
| `/signup` | SignupPage | ❌ | 0 | Initial landing |
| `/signup?step=account` | OnboardingCreateAccountPage | ❌ | 0 | Email/password |
| `/signup?step=astrology` | OnboardingAstrologyPage | ❌ | 0 | Astrology data |
| `/signup?step=partner-details` | OnboardingPartnerDetailsPage | ❌ | 0 | Partner details |
| `/journey-preparation` | JourneyPreparationPage | ✅ | 0 | Loading screen |
| `/dashboard` | DashboardPage | ✅ | 0 | Home + nudge card |
| `/personalize?s=4` | OnboardingWizardPage | ✅ | 7 (Q4-10) | Questions ONLY |
| `signup?step=onboarding` | ❌ 404 | - | - | DOES NOT EXIST |
| `signup?step=personalize` | ❌ 404 | - | - | DOES NOT EXIST |

---

## What Was Changed

### ✅ Removed from SignupPage:
- ❌ No `if (step === 'onboarding')` entry point
- ❌ No link to `/personalize`
- ❌ No step 4-10 component imports
- ❌ No "onboarding wizard" logic

### ✅ Added to DashboardPage:
- ✅ Nudge card with "Help us know you better ✨"
- ✅ Link to `/personalize?s=4`
- ✅ Dismiss button
- ✅ Progress checking via `GET /users/onboarding`

### ✅ Protected /personalize Route:
- ✅ Inside `<ProtectedRoute>` (requires JWT)
- ✅ Lazy-loaded for performance
- ✅ Returns data to `/dashboard` on completion

---

## Summary

```
SIGNUP FLOW:
  Account → Astrology → (Optional: Partner) → Journey → Dashboard

DASHBOARD FLOW (Optional):
  Dashboard (nudge card) → Personalize (Q4-10) → Dashboard

COMPLETE ISOLATION:
  ✅ Questions NOT in signup
  ✅ Questions ONLY in dashboard personalization
  ✅ /personalize route protected
  ✅ Clean separation of concerns
  ✅ Zero cross-contamination
```

**Status:** 🎯 Structurally isolated flow; do not use this line as a current production-readiness guarantee

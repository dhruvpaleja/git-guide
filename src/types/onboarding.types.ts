/**
 * User Onboarding Types
 * Multi-step onboarding flow collecting user profile, preferences, and struggles
 */

export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface OnboardingData {
  /** Step 1: Basic info */
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

  /** Step 2: Contact */
  phone: string;
  location: string;

  /** Step 3: Current state */
  currentMood: number; // 1-10
  stressLevel: number; // 1-10

  /** Step 4: What they're struggling with */
  struggles: Struggle[];
  otherStruggles?: string;

  /** Step 5: Goals */
  goals: HealingGoal[];
  otherGoals?: string;

  /** Step 6: Past experience */
  hasTherapyExperience: boolean;
  therapyExperienceDetails?: string;
  currentMedications?: string;

  /** Step 7: Preferences */
  preferredTherapistGender: 'male' | 'female' | 'no-preference';
  preferredLanguages: string[];
  preferredSessionTime: 'morning' | 'afternoon' | 'evening' | 'flexible';

  /** Step 8: Spiritual / holistic preferences */
  interestedInAstrology: boolean;
  interestedInMeditation: boolean;
  interestedInBreathwork: boolean;
  interestedInYoga: boolean;

  /** Step 9: Emergency contacts */
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  /** Step 10: Consent & terms */
  agreedToTerms: boolean;
  agreedToPrivacyPolicy: boolean;
  consentForRecording: boolean;
}

export type Struggle =
  | 'anxiety'
  | 'depression'
  | 'stress'
  | 'relationship'
  | 'grief'
  | 'trauma'
  | 'self-esteem'
  | 'anger'
  | 'addiction'
  | 'sleep'
  | 'loneliness'
  | 'career'
  | 'family'
  | 'spiritual'
  | 'other';

export type HealingGoal =
  | 'reduce-anxiety'
  | 'manage-depression'
  | 'improve-relationships'
  | 'build-confidence'
  | 'find-purpose'
  | 'heal-trauma'
  | 'improve-sleep'
  | 'reduce-stress'
  | 'self-discovery'
  | 'spiritual-growth'
  | 'emotional-regulation'
  | 'other';

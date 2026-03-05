/**
 * Authentication and Authorization Types
 */

import type { AppRole } from '@contracts/auth.contracts';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends AuthToken {
  user: User;
}

export type UserRole = AppRole;

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface TherapistProfile extends User {
  licenseNumber: string;
  specialization: string[];
  yearsOfExperience: number;
  languages: string[];
  hourlyRate: number;
  availability: AvailabilitySlot[];
  verified: boolean;
  bio: string;
}

// ── Credential Verification & Onboarding (Therapist / Astrologer) ────────

export interface ProfessionalOnboarding {
  id: string;
  userId: string;
  role: 'therapist' | 'astrologer';
  /** Step 1: Identity verification */
  aadhaarNumber?: string; // encrypted
  aadhaarDocumentUrl?: string; // uploaded scan
  panNumber?: string; // encrypted
  panDocumentUrl?: string;
  identityVerified: boolean;
  /** Step 2: Professional credentials */
  licenseNumber?: string;
  licenseDocumentUrl?: string;
  licenseVerified: boolean;
  qualifications: QualificationDocument[];
  /** Step 3: Background check */
  backgroundCheckStatus: 'pending' | 'in-progress' | 'cleared' | 'flagged' | 'failed';
  backgroundCheckProvider?: string;
  backgroundCheckDate?: Date;
  backgroundCheckNotes?: string;
  /** Step 4: Interview */
  interviewStatus: 'not-scheduled' | 'scheduled' | 'completed' | 'passed' | 'failed';
  interviewDate?: Date;
  interviewerUserId?: string;
  interviewNotes?: string;
  interviewScore?: number; // 0-100
  /** Step 5: Test / assessment (astrologers take a prediction test) */
  assessmentStatus: 'not-started' | 'in-progress' | 'passed' | 'failed';
  assessmentScore?: number;
  assessmentDate?: Date;
  /** Step 6: Trial period */
  trialStartDate?: Date;
  trialEndDate?: Date;
  trialSessionsCompleted: number;
  trialSessionsRequired: number;
  trialFeedbackScore?: number;
  /** Step 7: Training */
  trainingStatus: 'not-started' | 'in-progress' | 'completed';
  trainingModulesCompleted: string[];
  trainingModulesRequired: string[];
  /** Overall */
  onboardingStatus: 'application-received' | 'documents-pending' | 'background-check'
  | 'interview' | 'assessment' | 'trial' | 'training' | 'approved' | 'rejected';
  submittedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  reviewedBy?: string;
}

export interface QualificationDocument {
  id: string;
  type: 'degree' | 'certificate' | 'license' | 'recommendation' | 'other';
  name: string;
  documentUrl: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate?: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: Permission[];
}

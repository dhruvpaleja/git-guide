/**
 * Authentication and Authorization Types
 */

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

export type UserRole = 'user' | 'therapist' | 'astrologer' | 'admin' | 'moderator';

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

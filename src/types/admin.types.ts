/**
 * Admin & Corporate Dashboard Types
 * Head office, employee tracking, revenue, corporate wellness
 */

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTherapists: number;
  totalAstrologers: number;
  totalSessions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingComplaints: number;
  activeEmergencyFlags: number;
  averageUserRating: number;
  churnRate: number;
}

export interface EmployeeTracker {
  id: string;
  userId: string;
  role: 'therapist' | 'astrologer' | 'moderator' | 'support';
  name: string;
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  revenueGenerated: number;
  expectedRevenue: number;
  hoursWorked: number;
  joinedAt: Date;
  lastActiveAt: Date;
  status: 'active' | 'inactive' | 'on-leave';
}

export interface ActionLog {
  id: string;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  timestamp: Date;
}

export interface Complaint {
  id: string;
  userId: string;
  againstUserId?: string;
  againstRole?: string;
  category: 'service' | 'therapist' | 'astrologer' | 'platform' | 'payment' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  resolution?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface RevenueReport {
  period: string;
  therapySessions: number;
  therapyRevenue: number;
  astrologySessions: number;
  astrologyRevenue: number;
  coursesSold: number;
  courseRevenue: number;
  shopOrders: number;
  shopRevenue: number;
  subscriptions: number;
  subscriptionRevenue: number;
  totalRevenue: number;
  refunds: number;
  netRevenue: number;
}

/** Corporate wellness program */
export interface CorporateAccount {
  id: string;
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  plan: CorporatePlan;
  employeeCount: number;
  activeEmployees: number;
  status: 'active' | 'trial' | 'expired' | 'suspended';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface CorporatePlan {
  id: string;
  name: string;
  maxEmployees: number;
  sessionsPerEmployee: number;
  features: string[];
  monthlyPrice: number;
  currency: string;
}

export interface CorporateEmployee {
  id: string;
  corporateAccountId: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  sessionsUsed: number;
  sessionsRemaining: number;
  enrolledAt: Date;
}

/** School / College integration */
export interface InstitutionAccount {
  id: string;
  name: string;
  type: 'school' | 'college' | 'university';
  contactPerson: string;
  contactEmail: string;
  plan: string;
  studentCount: number;
  status: 'active' | 'trial' | 'expired';
  createdAt: Date;
}

/** Third-party integrations */
export interface Integration {
  id: string;
  accountId: string; // corporate or institution
  type: 'slack' | 'teams' | 'sap' | 'google-workspace' | 'zoom' | 'webhook' | 'api';
  name: string;
  config: Record<string, unknown>;
  status: 'active' | 'inactive' | 'error';
  lastSyncAt?: Date;
  createdAt: Date;
}

/** Internal departments */
export interface Department {
  id: string;
  name: string;
  head: string; // userId of department head
  description: string;
  employeeCount: number;
}

export interface DepartmentTarget {
  id: string;
  departmentId: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  deadline: Date;
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
}

/** Hiring / Careers */
export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange?: string;
  active: boolean;
  createdAt: Date;
}

export interface JobApplication {
  id: string;
  positionId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'received' | 'reviewing' | 'shortlisted' | 'interview' | 'offered' | 'rejected';
  appliedAt: Date;
}

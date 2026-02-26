/**
 * Admin & Corporate Dashboard Types
 * Head office, employee tracking, revenue, corporate wellness
 */

import type { UserRole } from './auth.types';

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalTherapists: number;
  totalAstrologers: number;
  totalModerators: number;
  totalSessions: number;
  activeSessions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingComplaints: number;
  activeEmergencyFlags: number;
  averageUserRating: number;
  churnRate: number;
  /** Events */
  totalEvents: number;
  upcomingEvents: number;
  eventRegistrations: number;
  /** Memberships */
  totalMembers: number;
  activeMemberships: number;
  membershipRevenue: number;
  /** NGO */
  ngoPartners: number;
  ngoBeneficiariesServed: number;
  ngoSessionsDonated: number;
  /** Community (Soul Circle) */
  communityPosts: number;
  communityActiveUsers: number;
  pendingModerationItems: number;
  /** Blog */
  publishedBlogs: number;
  pendingBlogApprovals: number;
  /** Courses */
  totalCourses: number;
  pendingCourseApprovals: number;
  courseEnrollments: number;
  /** Shop */
  shopProducts: number;
  pendingOrders: number;
  shopRevenue: number;
  /** AI */
  aiConversationsToday: number;
  aiEmergencyFlagsToday: number;
  /** Session monitoring */
  fraudAlertsActive: number;
  therapistQualityAverage: number;
}

/**
 * Head Office Dashboard — aggregates EVERYTHING visible at CEO level.
 * Every section of the platform is summarized here.
 */
export interface HeadOfficeDashboard {
  /** Overall platform stats */
  platformStats: AdminDashboardStats;
  /** Revenue breakdown by source */
  revenue: RevenueReport;
  /** All departments and their current targets */
  departments: DepartmentOverview[];
  /** Top-performing employees */
  topPerformers: EmployeeTracker[];
  /** Critical alerts that need immediate attention */
  criticalAlerts: CriticalAlert[];
  /** Platform health */
  platformHealth: PlatformHealth;
  /** Quick access controls */
  pendingActions: PendingAction[];
}

export interface DepartmentOverview {
  department: Department;
  targets: DepartmentTarget[];
  employees: number;
  revenue: number;
  performance: 'exceeding' | 'on-track' | 'at-risk' | 'behind';
}

export interface CriticalAlert {
  id: string;
  type: 'emergency-flag' | 'fraud-alert' | 'complaint-critical' | 'system-error' | 'payment-failure' | 'therapist-violation';
  title: string;
  description: string;
  severity: 'warning' | 'critical';
  resourceType: string;
  resourceId: string;
  actionUrl: string;
  createdAt: Date;
  acknowledged: boolean;
}

export interface PlatformHealth {
  apiUptime: number;
  apiResponseTimeMs: number;
  activeWebSocketConnections: number;
  storageUsedGB: number;
  errorRateLast24h: number;
  lastDeployment: Date;
}

export interface PendingAction {
  type: 'blog-approval' | 'course-approval' | 'complaint' | 'hiring-application'
    | 'ngo-request' | 'therapist-verification' | 'astrologer-verification'
    | 'fraud-review' | 'refund-request' | 'event-approval'
    | 'community-report' | 'shop-order' | 'corporate-request'
    | 'institution-request' | 'integration-request';
  count: number;
  actionUrl: string;
}

export interface EmployeeTracker {
  id: string;
  userId: string;
  role: UserRole;
  name: string;
  department: string;
  designation: string;
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  revenueGenerated: number;
  expectedRevenue: number;
  hoursWorked: number;
  joinedAt: Date;
  lastActiveAt: Date;
  status: 'active' | 'inactive' | 'on-leave' | 'training' | 'probation' | 'notice-period' | 'exited';
  /** Employee lifecycle */
  lifecycle: EmployeeLifecycle;
}

export interface EmployeeLifecycle {
  /** Training phase (new employees) */
  trainingStatus: 'not-started' | 'in-progress' | 'completed' | 'n/a';
  trainingModules: TrainingModule[];
  trainingCompletedAt?: Date;
  /** Probation period */
  probationStartDate?: Date;
  probationEndDate?: Date;
  probationExtended: boolean;
  probationReviewScore?: number; // 0-100
  probationStatus: 'active' | 'passed' | 'extended' | 'failed' | 'n/a';
  /** Performance reviews */
  lastReviewDate?: Date;
  lastReviewScore?: number;
  reviewFrequency: 'monthly' | 'quarterly' | 'bi-annual' | 'annual';
  /** Exit management */
  exitDate?: Date;
  exitType?: 'resignation' | 'termination' | 'contract-end' | 'mutual';
  noticePeriodDays?: number;
  exitInterviewCompleted: boolean;
  exitReason?: string;
  rehireEligible: boolean;
  /** Knowledge transfer */
  knowledgeTransferTo?: string; // userId of replacement
  knowledgeTransferStatus: 'not-needed' | 'pending' | 'in-progress' | 'completed';
}

export interface TrainingModule {
  id: string;
  name: string;
  description: string;
  department: string;
  requiredFor: UserRole[];
  durationHours: number;
  completedAt?: Date;
  score?: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
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
  /** Event ticket revenue */
  eventRegistrations: number;
  eventRevenue: number;
  /** Membership subscription revenue */
  membershipSubscriptions: number;
  membershipRevenue: number;
  /** Corporate contract revenue */
  corporateContracts: number;
  corporateRevenue: number;
  /** NGO (sponsored / donated sessions) */
  ngoSessionsDonated: number;
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

/** Third-party integrations — one-click enterprise connectivity */
export interface Integration {
  id: string;
  accountId: string; // corporate or institution
  type: IntegrationType;
  name: string;
  /** Connection details */
  config: IntegrationConfig;
  status: 'active' | 'inactive' | 'error' | 'setup' | 'syncing';
  /** Sync tracking */
  lastSyncAt?: Date;
  lastSyncStatus?: 'success' | 'partial' | 'failed';
  syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'manual';
  totalRecordsSynced: number;
  /** Error handling */
  lastErrorMessage?: string;
  consecutiveErrors: number;
  createdAt: Date;
}

export type IntegrationType =
  | 'slack'              // Slack bot — notifications, booking, mood check-ins
  | 'teams'              // Microsoft Teams — same as Slack
  | 'sap'                // SAP — enterprise employee data sync (one-click)
  | 'google-workspace'   // Google — SSO, calendar sync
  | 'zoom'               // Zoom — backup video calling
  | 'webhook'            // Custom webhook — push/pull any data
  | 'api'                // REST API key — for custom integrations
  | 'oracle-hcm'         // Oracle HCM — employee data
  | 'workday'            // Workday — HR data
  | 'ldap'               // LDAP/AD — SSO + directory sync
  | 'custom-database';   // Direct DB sync (SVKM-style institutions with 1L+ students)

export interface IntegrationConfig {
  /** Auth */
  authType: 'oauth2' | 'api-key' | 'basic' | 'jwt' | 'saml' | 'ldap';
  credentials: Record<string, unknown>; // encrypted
  /** Endpoints */
  baseUrl?: string;
  webhookUrl?: string;
  callbackUrl?: string;
  /** Data mapping — which fields map to Soul Yatri fields */
  fieldMapping: IntegrationFieldMapping[];
  /** Filters — which records to sync */
  syncFilters?: Record<string, unknown>;
  /** Permissions */
  scopes: string[];
}

export interface IntegrationFieldMapping {
  sourceField: string; // field in external system (e.g., 'SAP.Employee.Name')
  targetField: string; // field in Soul Yatri (e.g., 'user.name')
  transform?: 'none' | 'lowercase' | 'uppercase' | 'date-format' | 'custom';
  required: boolean;
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

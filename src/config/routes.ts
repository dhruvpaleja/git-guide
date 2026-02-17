/**
 * Routes Configuration
 * Centralized routing for the entire application
 */

import type { UserRole } from '@/types';

export interface RouteConfig {
  path: string;
  name: string;
  component?: string;
  icon?: string;
  requiredRole?: UserRole[];
  isPublic: boolean;
  showInNavigation: boolean;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // ── Public routes ──────────────────────────────────────────────────────
  HOME: {
    path: '/',
    name: 'Home',
    isPublic: true,
    showInNavigation: true,
    icon: 'home',
  },
  ABOUT: {
    path: '/about',
    name: 'About',
    isPublic: true,
    showInNavigation: true,
  },
  CAREERS: {
    path: '/careers',
    name: 'Careers',
    isPublic: true,
    showInNavigation: false,
  },
  CAREER_DETAIL: {
    path: '/careers/:id',
    name: 'Job Detail',
    isPublic: true,
    showInNavigation: false,
  },
  BLOG: {
    path: '/blog',
    name: 'Blog',
    isPublic: true,
    showInNavigation: true,
    icon: 'book',
  },
  BLOG_POST: {
    path: '/blog/:slug',
    name: 'Blog Post',
    isPublic: true,
    showInNavigation: false,
  },
  COURSES: {
    path: '/courses',
    name: 'Courses',
    isPublic: true,
    showInNavigation: true,
    icon: 'graduation-cap',
  },
  COURSE_DETAIL: {
    path: '/courses/:id',
    name: 'Course Detail',
    isPublic: true,
    showInNavigation: false,
  },
  SHOP: {
    path: '/shop',
    name: 'Soul Shop',
    isPublic: true,
    showInNavigation: true,
    icon: 'shopping-bag',
  },
  SHOP_PRODUCT: {
    path: '/shop/:id',
    name: 'Product',
    isPublic: true,
    showInNavigation: false,
  },
  COMMUNITY: {
    path: '/community',
    name: 'Soul Circle',
    isPublic: true,
    showInNavigation: true,
    icon: 'users',
  },
  CONTACT: {
    path: '/contact',
    name: 'Contact',
    isPublic: true,
    showInNavigation: false,
  },
  EVENTS: {
    path: '/events',
    name: 'Soul Events',
    isPublic: true,
    showInNavigation: true,
    icon: 'calendar',
  },
  EVENT_DETAIL: {
    path: '/events/:slug',
    name: 'Event Detail',
    isPublic: true,
    showInNavigation: false,
  },
  MEMBERSHIPS: {
    path: '/memberships',
    name: 'Memberships',
    isPublic: true,
    showInNavigation: true,
    icon: 'crown',
  },
  NGO_PARTNERSHIPS: {
    path: '/ngo',
    name: 'NGO Partnerships',
    isPublic: true,
    showInNavigation: false,
  },

  // ── Auth routes ────────────────────────────────────────────────────────
  LOGIN: {
    path: '/login',
    name: 'Login',
    isPublic: true,
    showInNavigation: false,
  },
  SIGNUP: {
    path: '/signup',
    name: 'Sign Up',
    isPublic: true,
    showInNavigation: false,
  },

  // ── Onboarding ─────────────────────────────────────────────────────────
  ONBOARDING: {
    path: '/onboarding',
    name: 'Onboarding',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user', 'therapist', 'astrologer', 'admin', 'moderator'],
  },

  // ── User Dashboard ─────────────────────────────────────────────────────
  DASHBOARD: {
    path: '/dashboard',
    name: 'Dashboard',
    isPublic: false,
    showInNavigation: true,
    icon: 'layout-grid',
    requiredRole: ['user', 'therapist', 'astrologer', 'admin', 'moderator'],
  },
  DASHBOARD_SESSIONS: {
    path: '/dashboard/sessions',
    name: 'My Sessions',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_BOOK_SESSION: {
    path: '/dashboard/book',
    name: 'Book Session',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_HEALTH: {
    path: '/dashboard/health',
    name: 'Health Tools',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_MEDITATE: {
    path: '/dashboard/meditate',
    name: 'Meditation',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_JOURNAL: {
    path: '/dashboard/journal',
    name: 'Journal',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_MOOD: {
    path: '/dashboard/mood',
    name: 'Mood Tracker',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_COURSES: {
    path: '/dashboard/courses',
    name: 'My Courses',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_COMMUNITY: {
    path: '/dashboard/community',
    name: 'Soul Circle',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_SHOP: {
    path: '/dashboard/shop',
    name: 'Soul Shop',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_AI: {
    path: '/dashboard/ai',
    name: 'AI Assistant',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_REPORTS: {
    path: '/dashboard/reports',
    name: 'My Reports',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  DASHBOARD_SETTINGS: {
    path: '/dashboard/settings',
    name: 'Settings',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user', 'therapist', 'astrologer', 'admin', 'moderator'],
  },
  DASHBOARD_COMPLAINTS: {
    path: '/dashboard/complaints',
    name: 'Complaints',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },
  USER_PROFILE: {
    path: '/profile',
    name: 'Profile',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user', 'therapist', 'astrologer', 'admin', 'moderator'],
  },

  // ── Therapist Dashboard ────────────────────────────────────────────────
  THERAPIST_DASHBOARD: {
    path: '/therapist',
    name: 'Therapist Dashboard',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },
  THERAPIST_CLIENTS: {
    path: '/therapist/clients',
    name: 'Clients',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },
  THERAPIST_CLIENT_DETAIL: {
    path: '/therapist/clients/:id',
    name: 'Client Detail',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },
  THERAPIST_SESSIONS: {
    path: '/therapist/sessions',
    name: 'Sessions',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },
  THERAPIST_REVENUE: {
    path: '/therapist/revenue',
    name: 'Revenue',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },
  THERAPIST_REVIEWS: {
    path: '/therapist/reviews',
    name: 'Reviews',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },

  // ── Astrologer Dashboard ───────────────────────────────────────────────
  ASTROLOGER_DASHBOARD: {
    path: '/astrologer',
    name: 'Astrologer Dashboard',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['astrologer', 'admin'],
  },
  ASTROLOGER_ANALYSES: {
    path: '/astrologer/analyses',
    name: 'Pending Analyses',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['astrologer', 'admin'],
  },
  ASTROLOGER_CLIENTS: {
    path: '/astrologer/clients',
    name: 'Client Charts',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['astrologer', 'admin'],
  },
  ASTROLOGER_SESSIONS: {
    path: '/astrologer/sessions',
    name: 'Direct Consultations',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['astrologer', 'admin'],
  },

  // ── Admin Dashboard ────────────────────────────────────────────────────
  ADMIN_DASHBOARD: {
    path: '/admin',
    name: 'Admin Dashboard',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_USERS: {
    path: '/admin/users',
    name: 'User Management',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_THERAPISTS: {
    path: '/admin/therapists',
    name: 'Therapist Management',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_ASTROLOGERS: {
    path: '/admin/astrologers',
    name: 'Astrologer Management',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_REVENUE: {
    path: '/admin/revenue',
    name: 'Revenue Reports',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_COMPLAINTS: {
    path: '/admin/complaints',
    name: 'Complaints',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_EMERGENCY: {
    path: '/admin/emergency',
    name: 'Emergency Flags',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_BLOG: {
    path: '/admin/blog',
    name: 'Blog Moderation',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_COURSES: {
    path: '/admin/courses',
    name: 'Course Moderation',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_SHOP: {
    path: '/admin/shop',
    name: 'Shop Management',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_EMPLOYEES: {
    path: '/admin/employees',
    name: 'Employee Tracker',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_SETTINGS: {
    path: '/admin/settings',
    name: 'Platform Settings',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_DEPARTMENTS: {
    path: '/admin/departments',
    name: 'Departments',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_HEAD_OFFICE: {
    path: '/admin/head-office',
    name: 'Head Office',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_HIRING: {
    path: '/admin/hiring',
    name: 'Hiring Management',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_EVENTS: {
    path: '/admin/events',
    name: 'Event Management',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_MEMBERSHIPS: {
    path: '/admin/memberships',
    name: 'Membership Management',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_NGO: {
    path: '/admin/ngo',
    name: 'NGO Partnerships',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_COMMUNITY: {
    path: '/admin/community',
    name: 'Community Moderation',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_AI_MONITORING: {
    path: '/admin/ai-monitoring',
    name: 'AI Monitoring',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_FRAUD_ALERTS: {
    path: '/admin/fraud-alerts',
    name: 'Fraud Alerts',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_THERAPIST_QUALITY: {
    path: '/admin/therapist-quality',
    name: 'Therapist Quality',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_SESSION_RECORDINGS: {
    path: '/admin/session-recordings',
    name: 'Session Recordings',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_ANALYTICS: {
    path: '/admin/analytics',
    name: 'Platform Analytics',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },
  ADMIN_AUDIT_LOG: {
    path: '/admin/audit-log',
    name: 'Audit Log',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },

  // ── Employee Dashboard (internal staff) ─────────────────────────────
  EMPLOYEE_DASHBOARD: {
    path: '/employee',
    name: 'Employee Dashboard',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'astrologer', 'moderator', 'admin'],
  },
  EMPLOYEE_TARGETS: {
    path: '/employee/targets',
    name: 'My Targets',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'astrologer', 'moderator', 'admin'],
  },
  EMPLOYEE_TASKS: {
    path: '/employee/tasks',
    name: 'My Tasks',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'astrologer', 'moderator', 'admin'],
  },
  EMPLOYEE_TEAM: {
    path: '/employee/team',
    name: 'My Team',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'astrologer', 'moderator', 'admin'],
  },

  // ── Corporate ──────────────────────────────────────────────────────────
  CORPORATE_DASHBOARD: {
    path: '/corporate',
    name: 'Corporate Dashboard',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },

  // ── 404 ────────────────────────────────────────────────────────────────
  NOT_FOUND: {
    path: '/404',
    name: 'Not Found',
    isPublic: true,
    showInNavigation: false,
  },
};

/**
 * Get public routes
 */
export function getPublicRoutes(): RouteConfig[] {
  return Object.values(ROUTE_CONFIG).filter((route) => route.isPublic);
}

/**
 * Get protected routes
 */
export function getProtectedRoutes(): RouteConfig[] {
  return Object.values(ROUTE_CONFIG).filter((route) => !route.isPublic);
}

/**
 * Get navigation items
 */
export function getNavigationItems(): RouteConfig[] {
  return Object.values(ROUTE_CONFIG).filter((route) => route.showInNavigation);
}

/**
 * Check if user can access route
 */
export function canAccessRoute(userRole: UserRole | undefined, route: RouteConfig): boolean {
  if (route.isPublic) return true;
  if (!userRole) return false;
  if (!route.requiredRole) return true;
  return route.requiredRole.includes(userRole);
}

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
  // Public routes
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
  BLOG: {
    path: '/blog',
    name: 'Blog',
    isPublic: true,
    showInNavigation: true,
    icon: 'book',
  },
  COURSES: {
    path: '/courses',
    name: 'Courses',
    isPublic: true,
    showInNavigation: true,
    icon: 'graduation-cap',
  },
  COMMUNITY: {
    path: '/community',
    name: 'Community',
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

  // Auth routes
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

  // Protected routes - User
  DASHBOARD: {
    path: '/dashboard',
    name: 'Dashboard',
    isPublic: false,
    showInNavigation: true,
    icon: 'layout-grid',
    requiredRole: ['user', 'therapist', 'admin'],
  },
  USER_PROFILE: {
    path: '/profile',
    name: 'Profile',
    isPublic: false,
    showInNavigation: true,
    icon: 'user',
    requiredRole: ['user', 'therapist', 'admin'],
  },

  // Health tools
  HEALTH_TOOLS: {
    path: '/health-tools',
    name: 'Health Tools',
    isPublic: false,
    showInNavigation: true,
    icon: 'heart',
    requiredRole: ['user', 'therapist', 'admin'],
  },
  MOOD_TRACKER: {
    path: '/health-tools/mood',
    name: 'Mood Tracker',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user', 'therapist', 'admin'],
  },
  MEDITATION: {
    path: '/health-tools/meditation',
    name: 'Meditation',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user', 'therapist', 'admin'],
  },
  JOURNAL: {
    path: '/health-tools/journal',
    name: 'Journal',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user', 'therapist', 'admin'],
  },

  // Therapy routes
  THERAPY_SESSIONS: {
    path: '/therapy',
    name: 'Therapy Sessions',
    isPublic: false,
    showInNavigation: true,
    icon: 'calendar',
    requiredRole: ['user', 'therapist', 'admin'],
  },
  FIND_THERAPIST: {
    path: '/therapy/find',
    name: 'Find Therapist',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['user'],
  },

  // Therapist routes
  THERAPIST_DASHBOARD: {
    path: '/therapist',
    name: 'Therapist Dashboard',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },
  THERAPIST_PROFILE: {
    path: '/therapist/profile',
    name: 'Therapist Profile',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['therapist', 'admin'],
  },

  // Admin routes
  ADMIN: {
    path: '/admin',
    name: 'Admin Panel',
    isPublic: false,
    showInNavigation: false,
    requiredRole: ['admin'],
  },

  // Course routes
  COURSE_DETAIL: {
    path: '/courses/:id',
    name: 'Course',
    isPublic: true,
    showInNavigation: false,
  },
  MY_COURSES: {
    path: '/my-courses',
    name: 'My Courses',
    isPublic: false,
    showInNavigation: true,
    icon: 'book-open',
    requiredRole: ['user', 'therapist', 'admin'],
  },

  // 404
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

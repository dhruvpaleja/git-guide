/**
 * Role-Based Access Control (RBAC)
 */

import type { UserRole, Permission } from '@/types';

/**
 * Base permissions for each role
 */
const USER_PERMISSIONS: Permission[] = [
  { id: 'view_blog', name: 'View Blog', description: 'Can view blog posts', resource: 'blog', action: 'read' },
  { id: 'view_courses', name: 'View Courses', description: 'Can view courses', resource: 'courses', action: 'read' },
  { id: 'enroll_courses', name: 'Enroll in Courses', description: 'Can enroll in courses', resource: 'courses', action: 'enroll' },
  { id: 'view_community', name: 'View Community', description: 'Can view community', resource: 'community', action: 'read' },
  { id: 'post_community', name: 'Post in Community', description: 'Can post in community', resource: 'community', action: 'create' },
  { id: 'use_health_tools', name: 'Use Health Tools', description: 'Can use health tools', resource: 'health_tools', action: 'use' },
  { id: 'book_therapy', name: 'Book Therapy', description: 'Can book therapy sessions', resource: 'therapy', action: 'book' },
];

const THERAPIST_ADDITIONAL_PERMISSIONS: Permission[] = [
  { id: 'view_patients', name: 'View Patients', description: 'Can view patient list', resource: 'patients', action: 'read' },
  { id: 'manage_sessions', name: 'Manage Sessions', description: 'Can manage therapy sessions', resource: 'therapy', action: 'manage' },
  { id: 'write_notes', name: 'Write Notes', description: 'Can write session notes', resource: 'therapy', action: 'write_notes' },
  { id: 'view_patient_data', name: 'View Patient Data', description: 'Can view patient health data', resource: 'patient_data', action: 'read' },
];

const ADMIN_PERMISSIONS: Permission[] = [
  { id: 'manage_users', name: 'Manage Users', description: 'Can manage all users', resource: 'users', action: 'manage' },
  { id: 'manage_therapists', name: 'Manage Therapists', description: 'Can manage therapists', resource: 'therapists', action: 'manage' },
  { id: 'manage_content', name: 'Manage Content', description: 'Can manage all content', resource: 'content', action: 'manage' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Can view analytics', resource: 'analytics', action: 'read' },
  { id: 'manage_settings', name: 'Manage Settings', description: 'Can manage system settings', resource: 'settings', action: 'manage' },
  { id: 'access_admin_panel', name: 'Access Admin Panel', description: 'Can access admin panel', resource: 'admin', action: 'access' },
];

const ASTROLOGER_ADDITIONAL_PERMISSIONS: Permission[] = [
  { id: 'view_charts', name: 'View Charts', description: 'Can view kundali charts', resource: 'astrology', action: 'read' },
  { id: 'write_predictions', name: 'Write Predictions', description: 'Can write predictions', resource: 'astrology', action: 'create' },
  { id: 'vote_predictions', name: 'Vote on Predictions', description: 'Can vote on predictions', resource: 'astrology', action: 'vote' },
  { id: 'view_client_birth_data', name: 'View Birth Data', description: 'Can view client birth data', resource: 'client_data', action: 'read' },
];

const MODERATOR_PERMISSIONS: Permission[] = [
  { id: 'moderate_community', name: 'Moderate Community', description: 'Can moderate community content', resource: 'community', action: 'moderate' },
  { id: 'moderate_comments', name: 'Moderate Comments', description: 'Can moderate comments', resource: 'comments', action: 'moderate' },
  { id: 'flag_content', name: 'Flag Content', description: 'Can flag inappropriate content', resource: 'content', action: 'flag' },
];

export const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: USER_PERMISSIONS,
  therapist: [...USER_PERMISSIONS, ...THERAPIST_ADDITIONAL_PERMISSIONS],
  practitioner: [...USER_PERMISSIONS, ...THERAPIST_ADDITIONAL_PERMISSIONS],
  astrologer: [...USER_PERMISSIONS, ...ASTROLOGER_ADDITIONAL_PERMISSIONS],
  admin: ADMIN_PERMISSIONS,
  moderator: MODERATOR_PERMISSIONS,
};

/**
 * Check if user has permission
 */
export function hasPermission(userRole: UserRole, permissionId: string): boolean {
  const permissions = DEFAULT_PERMISSIONS[userRole] || [];
  return permissions.some((p) => p.id === permissionId);
}

/**
 * Check if user has any permission
 */
export function hasAnyPermission(userRole: UserRole, permissionIds: string[]): boolean {
  return permissionIds.some((id) => hasPermission(userRole, id));
}

/**
 * Get all permissions for role
 */
export function getPermissionsForRole(userRole: UserRole): Permission[] {
  return DEFAULT_PERMISSIONS[userRole] || [];
}

/**
 * Check resource access
 */
export function canAccessResource(userRole: UserRole, resource: string, action: string): boolean {
  const permissions = DEFAULT_PERMISSIONS[userRole] || [];
  return permissions.some((p) => p.resource === resource && p.action === action);
}

export const SERVER_ROLES = ['USER', 'THERAPIST', 'ASTROLOGER', 'ADMIN', 'SUPER_ADMIN'] as const;
export type ServerRole = (typeof SERVER_ROLES)[number];

export const APP_ROLES = ['user', 'therapist', 'practitioner', 'astrologer', 'admin', 'moderator'] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const CANONICAL_APP_ROLES = ['user', 'practitioner', 'astrologer', 'admin', 'moderator'] as const;
export type CanonicalAppRole = (typeof CANONICAL_APP_ROLES)[number];

const APP_ROLE_ALIASES: Record<AppRole, CanonicalAppRole> = {
  user: 'user',
  therapist: 'practitioner',
  practitioner: 'practitioner',
  astrologer: 'astrologer',
  admin: 'admin',
  moderator: 'moderator',
};

const SERVER_TO_APP_ROLE: Record<ServerRole, CanonicalAppRole> = {
  USER: 'user',
  THERAPIST: 'practitioner',
  ASTROLOGER: 'astrologer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'admin',
};

const APP_TO_SERVER_ROLE: Record<CanonicalAppRole, ServerRole> = {
  user: 'USER',
  practitioner: 'THERAPIST',
  astrologer: 'ASTROLOGER',
  admin: 'ADMIN',
  moderator: 'ADMIN',
};

export interface AccessTokenPayload {
  sub: string;
  role: ServerRole;
  jti: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  familyId: string;
  type: 'refresh';
  jti: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export function isServerRole(value: string): value is ServerRole {
  return (SERVER_ROLES as readonly string[]).includes(value);
}

export function isAppRole(value: string): value is AppRole {
  return (APP_ROLES as readonly string[]).includes(value);
}

export function toCanonicalAppRole(value: string): CanonicalAppRole | null {
  if (!isAppRole(value)) {
    return null;
  }
  return APP_ROLE_ALIASES[value];
}

export function mapServerRoleToAppRole(role: ServerRole): CanonicalAppRole {
  return SERVER_TO_APP_ROLE[role];
}

export function mapAppRoleToServerRole(role: AppRole): ServerRole {
  return APP_TO_SERVER_ROLE[APP_ROLE_ALIASES[role]];
}

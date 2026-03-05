import { STORAGE_KEYS } from '@/constants';

function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

const authBypassEnabled = parseBooleanEnv(import.meta.env.VITE_AUTH_BYPASS, true);
const mockAuthEnabled = parseBooleanEnv(import.meta.env.VITE_ENABLE_MOCK_AUTH, authBypassEnabled);

if (import.meta.env.PROD && authBypassEnabled) {
  console.warn('[runtime-flags] Auth bypass is enabled in production mode.');
}

if (import.meta.env.PROD && mockAuthEnabled) {
  console.warn('[runtime-flags] Mock auth is enabled in production mode.');
}

export const runtimeFlags = {
  authBypassEnabled,
  mockAuthEnabled,
  authTokenStorageKey: STORAGE_KEYS.AUTH_TOKEN,
};

export type RuntimeFlags = typeof runtimeFlags;


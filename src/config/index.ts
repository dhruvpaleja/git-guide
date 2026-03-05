/**
 * Environment Configuration
 */

export const config = {
  app: {
    name: 'Soul Yatri',
    version: '1.0.0',
    description: 'A meditation wellness platform',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    sentry: import.meta.env.VITE_SENTRY_DSN,
  },
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};

export { runtimeFlags } from './runtime.flags';

export default config;

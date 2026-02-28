import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const jwtSecret = process.env.JWT_SECRET || '';

if (isProduction && !jwtSecret) {
  throw new Error('JWT_SECRET is required in production');
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv,
  isProduction,
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    allowedOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  api: {
    prefix: '/api/v1',
  },
  jwtSecret: jwtSecret || 'local-dev-only-secret-change-me',
} as const;

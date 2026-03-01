import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const isTest = nodeEnv === 'test';
const isDevelopment = !isProduction && !isTest;

// Fail-fast for missing critical secrets in production
if (isProduction) {
  const required = ['JWT_SECRET', 'DATABASE_URL'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars in production: ${missing.join(', ')}`);
  }
}

function envInt(key: string, fallback: number): number {
  return parseInt(process.env[key] || String(fallback), 10);
}

// ---------------------------------------------------------------------------
// Unified Config
// ---------------------------------------------------------------------------

export const config = {
  // ---- Core ----
  port: envInt('PORT', 3000),
  nodeEnv,
  isProduction,
  isDevelopment,
  isTest,

  // ---- API ----
  api: {
    prefix: '/api/v1',
    version: '1.0.0',
  },

  // ---- CORS ----
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    allowedOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  },

  // ---- JWT ----
  jwtSecret: process.env.JWT_SECRET || 'local-dev-only-secret-change-me',
  jwt: {
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    issuer: 'soul-yatri-api',
    audience: 'soul-yatri-client',
  },

  // ---- Cookie ----
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'strict' : 'lax') as 'strict' | 'lax' | 'none',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (refresh token lifetime)
  },

  // ---- Rate Limiting ----
  rateLimit: {
    auth: { windowMs: 15 * 60 * 1000, max: 5 },
    api: { windowMs: 15 * 60 * 1000, max: 100 },
    strict: { windowMs: 15 * 60 * 1000, max: 3 },
    sensitive: { windowMs: 60 * 60 * 1000, max: 10 },
    upload: { windowMs: 60 * 60 * 1000, max: 20 },
    ai: { windowMs: 15 * 60 * 1000, max: 30 },
  },

  // ---- Body Parsing ----
  bodyLimit: {
    json: process.env.BODY_LIMIT_JSON || '10kb',
    urlencoded: process.env.BODY_LIMIT_URLENCODED || '10kb',
    upload: process.env.BODY_LIMIT_UPLOAD || '10mb',
  },

  // ---- Database ----
  database: {
    url: process.env.DATABASE_URL || '',
    poolMin: envInt('DB_POOL_MIN', 2),
    poolMax: envInt('DB_POOL_MAX', 10),
    logQueries: isDevelopment && process.env.DB_LOG_QUERIES === 'true',
  },

  // ---- Email ----
  email: {
    provider: process.env.EMAIL_PROVIDER || 'console', // 'resend' | 'sendgrid' | 'ses' | 'console'
    apiKey: process.env.EMAIL_API_KEY || '',
    from: process.env.EMAIL_FROM || 'Soul Yatri <noreply@soulyatri.com>',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@soulyatri.com',
  },

  // ---- Storage ----
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'memory', // 's3' | 'r2' | 'memory'
    bucket: process.env.STORAGE_BUCKET || '',
    region: process.env.STORAGE_REGION || 'ap-south-1',
    accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
    endpoint: process.env.STORAGE_ENDPOINT || undefined, // for R2
    maxFileSize: envInt('MAX_FILE_SIZE', 5 * 1024 * 1024), // 5MB
  },

  // ---- Cache ----
  cache: {
    provider: process.env.CACHE_PROVIDER || 'memory', // 'redis' | 'memory'
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    defaultTtl: envInt('CACHE_DEFAULT_TTL', 300), // 5 minutes
  },

  // ---- Queue ----
  queue: {
    provider: process.env.QUEUE_PROVIDER || 'sync', // 'bullmq' | 'sync'
    redisUrl: process.env.QUEUE_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // ---- Payment (Razorpay) ----
  payment: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    currency: 'INR',
  },

  // ---- Video (Daily.co) ----
  video: {
    apiKey: process.env.DAILY_API_KEY || '',
    apiUrl: process.env.DAILY_API_URL || 'https://api.daily.co/v1',
  },

  // ---- AI / OpenAI ----
  ai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    maxTokens: envInt('AI_MAX_TOKENS', 1000),
  },

  // ---- Logging ----
  logging: {
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    format: isProduction ? 'json' : 'pretty',
  },

  // ---- Security ----
  security: {
    bcryptRounds: envInt('BCRYPT_ROUNDS', isProduction ? 12 : 10),
    ipSalt: process.env.IP_SALT || 'soul-yatri-salt',
    trustProxy: isProduction, // trust X-Forwarded-For in production (behind load balancer)
  },
} as const;

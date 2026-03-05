import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/index.js';
import { errorHandler, notFound } from './middleware/error.js';
import { requestContext } from './middleware/request-context.js';
import { apiLimiter } from './middleware/security.middleware.js';
import { logger, morganStream } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { websocketService } from './lib/websocket.js';
import routes from './routes/index.js';
import testRoutes from './routes/test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------------------------------------------------------------------
// Trust Proxy (required behind load balancer/reverse proxy for rate limiting)
// ---------------------------------------------------------------------------
if (config.security.trustProxy) {
  app.set('trust proxy', 1);
}

// ---------------------------------------------------------------------------
// Security Headers
// ---------------------------------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: config.isProduction ? undefined : false, // Disable CSP in dev for HMR
  crossOriginEmbedderPolicy: false, // Allow loading cross-origin resources
  hsts: config.isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isConfigured = config.cors.allowedOrigins.includes(origin);
      const isLocalDev = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) && !config.isProduction;

      if (isConfigured || isLocalDev) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
    maxAge: 86400, // 24 hours preflight cache
  }),
);

// ---------------------------------------------------------------------------
// Request Context — Correlation IDs, timing, logging (MUST be before other middleware)
// ---------------------------------------------------------------------------
app.use(requestContext);

// ---------------------------------------------------------------------------
// Body Parsing with size limits
// ---------------------------------------------------------------------------
app.use(cookieParser());
app.use(express.json({ limit: config.bodyLimit.json }));
app.use(express.urlencoded({ extended: true, limit: config.bodyLimit.urlencoded }));

// ---------------------------------------------------------------------------
// HTTP Request Logging
// ---------------------------------------------------------------------------
if (config.isProduction) {
  app.use(morgan('combined', { stream: morganStream }));
} else {
  app.use(morgan('dev'));
}

// ---------------------------------------------------------------------------
// Global API Rate Limiter
// ---------------------------------------------------------------------------
app.use(config.api.prefix, apiLimiter);

// ---------------------------------------------------------------------------
// Static Files (Uploads)
// ---------------------------------------------------------------------------
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use(config.api.prefix, routes);
app.use('/api', routes);
if (config.runtime.enableTestRoutes) {
  app.use(config.api.prefix, testRoutes);
  app.use('/api', testRoutes);
}

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// HTTP Server + Graceful Shutdown
// ---------------------------------------------------------------------------
const server = createServer(app);

// Initialize WebSocket server
websocketService.initialize(server);

server.listen(config.port, () => {
  logger.info('server_started', {
    port: config.port,
    env: config.nodeEnv,
    version: config.api.version,
    pid: process.pid,
  });
});

// Graceful shutdown handler
let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info('shutdown_initiated', { signal });

  // Stop accepting new connections
  server.close(async () => {
    logger.info('http_server_closed');

    try {
      // Close WebSocket connections
      await websocketService.shutdown();
      logger.info('websocket_disconnected');

      // Disconnect database
      await prisma.$disconnect();
      logger.info('database_disconnected');
    } catch (err) {
      logger.error('shutdown_error', { error: err instanceof Error ? err.message : String(err) });
    }

    logger.info('shutdown_complete');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('forced_shutdown', { reason: 'Graceful shutdown timed out after 30s' });
    process.exit(1);
  }, 30_000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled errors
process.on('uncaughtException', (error) => {
  logger.error('uncaught_exception', { error: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error('unhandled_rejection', { reason: reason instanceof Error ? reason.message : String(reason) });
});

export default app;

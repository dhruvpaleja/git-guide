// ---------------------------------------------------------------------------
// Structured Logger — Production-grade Winston logging with correlation
// ---------------------------------------------------------------------------

import winston from 'winston';

const { combine, timestamp, json, errors, colorize, printf } = winston.format;

// Structured JSON for production (ELK/CloudWatch/Datadog compatible)
const productionFormat = combine(
  timestamp({ format: 'ISO' }),
  errors({ stack: true }),
  json(),
);

// Human-readable for development
const developmentFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, requestId, ...rest }) => {
    const rid = requestId ? ` [${requestId}]` : '';
    const extra = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : '';
    return `${ts} ${level}${rid}: ${message}${extra}`;
  }),
);

const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  defaultMeta: { service: 'soul-yatri-api' },
  format: isProduction ? productionFormat : developmentFormat,
  transports: [
    new winston.transports.Console(),
    // Production: add file transports, CloudWatch, etc.
    ...(isProduction
      ? [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 10_000_000, maxFiles: 5 }),
          new winston.transports.File({ filename: 'logs/combined.log', maxsize: 10_000_000, maxFiles: 10 }),
        ]
      : []),
  ],
  // Don't crash on logging failure
  exitOnError: false,
});

// Child logger factory — attaches request context automatically
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}

// Stream for Morgan HTTP logging integration
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

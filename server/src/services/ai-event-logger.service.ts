import winston from 'winston';
import { prisma } from '../lib/prisma.js';

// Configure strict Winston JSON logger for AI ingestion parsing
const aiLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Strict JSON for easy pipeline extraction
    ),
    transports: [
        new winston.transports.Console(),
        // In production, we would add File or CloudWatch transports here.
    ],
});

export type AuditCategory = 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'SECURITY_ALERT' | 'ACCOUNT_CHANGE' | 'PAYMENT' | 'SESSION_ACTION';

interface LogEventOptions {
    userId?: string;
    category: AuditCategory;
    action: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
    ipHash?: string;
    userAgent?: string;
}

/**
 * AI Event Logger Service
 * 
 * Logs critical events to both Winston (console/file) and the Prisma Database 
 * as structured JSON models. This forms the foundation dataset for later fine-tuning
 * behavioral anomalies or LLM training.
 */
export const AIEventLogger = {
    logEvent: async (options: LogEventOptions) => {
        try {
            // 1. Emit structured log to stdout (Winston)
            aiLogger.info({
                ...options,
                timestamp: new Date().toISOString(),
            });

            // 2. Persist to data warehouse / AuditLog database model
            await prisma.auditLog.create({
                data: {
                    userId: options.userId,
                    category: options.category,
                    action: options.action,
                    metadata: options.metadata || {},
                    ipHash: options.ipHash,
                    userAgent: options.userAgent,
                }
            });

        } catch (error) {
            // Fallback logging in case DB connection fails; 
            // Do not crash the parent request because of a logging failure
            console.error('CRITICAL: AI Event Database Logging failed', error);
        }
    }
};

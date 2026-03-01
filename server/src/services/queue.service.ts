// ---------------------------------------------------------------------------
// Queue Service — Background job infrastructure (BullMQ-ready, sync fallback)
// ---------------------------------------------------------------------------

import { logger } from '../lib/logger.js';

export type JobPriority = 'critical' | 'high' | 'normal' | 'low';

export interface JobOptions {
  priority?: JobPriority;
  delay?: number;           // ms delay before processing
  attempts?: number;        // max retry attempts (default 3)
  backoff?: number;         // ms between retries (default 1000, exponential)
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
}

export interface Job<T = unknown> {
  id: string;
  queue: string;
  data: T;
  priority: JobPriority;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
}

export type JobHandler<T = unknown> = (job: Job<T>) => Promise<void>;

// Registered job handlers
const _handlers = new Map<string, JobHandler[]>();
let _jobCounter = 0;

/**
 * Job Queue Service
 *
 * Currently processes jobs synchronously (development).
 * Replace with BullMQ + Redis for production:
 *
 *   npm install bullmq
 *   import { Queue, Worker } from 'bullmq';
 *   Swap implementation below with real queue workers.
 *
 * Queue names and their responsibilities:
 *   - 'email'             : Send emails (welcome, reminders, receipts)
 *   - 'notification'      : Push notifications (in-app, mobile)
 *   - 'session-reminder'  : Scheduled session reminders (1hr, 15min before)
 *   - 'mood-analytics'    : Process mood data for insights
 *   - 'ai-analysis'       : AI processing (session notes, crisis detection)
 *   - 'cleanup'           : Periodic data cleanup, token pruning
 *   - 'audit'             : Audit log processing
 */
export const queueService = {

  /**
   * Add a job to a named queue
   */
  enqueue: async <T>(queueName: string, data: T, options: JobOptions = {}): Promise<string> => {
    const jobId = `job-${++_jobCounter}-${Date.now()}`;

    const job: Job<T> = {
      id: jobId,
      queue: queueName,
      data,
      priority: options.priority || 'normal',
      attempts: 0,
      maxAttempts: options.attempts || 3,
      createdAt: new Date(),
    };

    logger.info('job_enqueued', {
      jobId,
      queue: queueName,
      priority: job.priority,
      delay: options.delay || 0,
    });

    // In development: process immediately (sync fallback)
    // In production: BullMQ would handle this asynchronously
    const delay = options.delay || 0;
    if (delay > 0) {
      setTimeout(() => _processJob(job), delay);
    } else {
      // Process async but don't await (fire-and-forget)
      setImmediate(() => _processJob(job));
    }

    return jobId;
  },

  /**
   * Register a handler for a queue
   * Multiple handlers can be registered per queue (fan-out)
   */
  register: <T>(queueName: string, handler: JobHandler<T>): void => {
    const existing = _handlers.get(queueName) || [];
    existing.push(handler as JobHandler);
    _handlers.set(queueName, existing);

    logger.info('job_handler_registered', { queue: queueName, handlerCount: existing.length });
  },

  /**
   * Schedule a recurring job (cron-like)
   * In production: use BullMQ's repeatableJobs
   */
  schedule: <T>(queueName: string, data: T, intervalMs: number, options: JobOptions = {}): void => {
    logger.info('job_scheduled', { queue: queueName, intervalMs });

    // First execution
    queueService.enqueue(queueName, data, options);

    // Recurring (simple setInterval for dev, BullMQ repeat for prod)
    setInterval(() => {
      queueService.enqueue(queueName, data, options);
    }, intervalMs).unref();
  },
};

// ---------------------------------------------------------------------------
// Internal job processor
// ---------------------------------------------------------------------------

async function _processJob<T>(job: Job<T>): Promise<void> {
  const handlers = _handlers.get(job.queue);

  if (!handlers || handlers.length === 0) {
    logger.warn('job_no_handler', { jobId: job.id, queue: job.queue });
    return;
  }

  for (const handler of handlers) {
    try {
      job.attempts++;
      await handler(job);

      logger.info('job_completed', {
        jobId: job.id,
        queue: job.queue,
        attempts: job.attempts,
      });
    } catch (error) {
      logger.error('job_failed', {
        jobId: job.id,
        queue: job.queue,
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
        error: error instanceof Error ? error.message : String(error),
      });

      // Retry with exponential backoff
      if (job.attempts < job.maxAttempts) {
        const backoff = Math.pow(2, job.attempts) * 1000;
        logger.info('job_retry_scheduled', { jobId: job.id, backoffMs: backoff });
        setTimeout(() => _processJob(job), backoff);
      } else {
        logger.error('job_exhausted', { jobId: job.id, queue: job.queue });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Storage Service — File upload infrastructure (S3/R2-ready, local fallback)
// ---------------------------------------------------------------------------

import { randomUUID } from 'crypto';
import { logger } from '../lib/logger.js';

export interface UploadOptions {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  folder?: string;       // e.g. 'avatars', 'documents', 'session-recordings'
  maxSizeBytes?: number; // default 5MB
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  upload(options: UploadOptions): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

// Allowed MIME types per folder
const ALLOWED_TYPES: Record<string, string[]> = {
  avatars: ['image/jpeg', 'image/png', 'image/webp'],
  documents: ['application/pdf', 'image/jpeg', 'image/png'],
  'session-recordings': ['audio/webm', 'audio/mp4', 'video/webm'],
  default: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Storage Service
 *
 * Currently uses in-memory storage (development).
 * Replace provider with S3/R2 for production:
 *
 *   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 *   Swap _memoryProvider with S3 implementation
 */
export const storageService: StorageProvider & { validateFile: typeof validateFile } = {

  upload: async (options: UploadOptions): Promise<UploadResult> => {
    validateFile(options);

    const folder = options.folder || 'uploads';
    const ext = options.filename.split('.').pop() || 'bin';
    const key = `${folder}/${randomUUID()}.${ext}`;

    const result = await _provider.upload({ ...options, folder: key });

    logger.info('file_uploaded', {
      key: result.key,
      size: result.size,
      mimeType: result.mimeType,
    });

    return result;
  },

  delete: async (key: string): Promise<void> => {
    await _provider.delete(key);
    logger.info('file_deleted', { key });
  },

  getSignedUrl: async (key: string, expiresIn = 3600): Promise<string> => {
    return _provider.getSignedUrl(key, expiresIn);
  },

  validateFile,
};

function validateFile(options: UploadOptions): void {
  const maxSize = options.maxSizeBytes || DEFAULT_MAX_SIZE;
  const folder = options.folder || 'default';
  const allowedTypes = ALLOWED_TYPES[folder] || ALLOWED_TYPES.default;

  if (options.buffer.length > maxSize) {
    throw new Error(`File exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (!allowedTypes.includes(options.mimeType)) {
    throw new Error(`File type ${options.mimeType} not allowed. Allowed: ${allowedTypes.join(', ')}`);
  }
}

// ---------------------------------------------------------------------------
// In-Memory Provider (Development) — replace with S3Provider for production
// ---------------------------------------------------------------------------

const _memoryStore = new Map<string, { buffer: Buffer; mimeType: string }>();

const _provider: StorageProvider = {
  upload: async (options: UploadOptions): Promise<UploadResult> => {
    const key = options.folder || `uploads/${randomUUID()}`;
    _memoryStore.set(key, { buffer: options.buffer, mimeType: options.mimeType });
    return {
      url: `/dev-storage/${key}`,
      key,
      size: options.buffer.length,
      mimeType: options.mimeType,
    };
  },

  delete: async (key: string): Promise<void> => {
    _memoryStore.delete(key);
  },

  getSignedUrl: async (key: string, _expiresIn?: number): Promise<string> => {
    return `/dev-storage/${key}?signed=true`;
  },
};

export interface ApiErrorShape<Code extends string = string> {
  code: Code;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiEnvelope<T = unknown, Code extends string = string, Meta = PaginationMeta> {
  success: boolean;
  data?: T;
  error?: ApiErrorShape<Code>;
  meta?: Meta;
  timestamp: string;
  requestId?: string;
}

export function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.success === 'boolean' && typeof candidate.timestamp === 'string';
}

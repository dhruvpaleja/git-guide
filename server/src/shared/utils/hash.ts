import { createHash } from 'crypto';

export const hashIp = (ip: string): string =>
  createHash('sha256').update(ip || 'unknown').digest('hex');

export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

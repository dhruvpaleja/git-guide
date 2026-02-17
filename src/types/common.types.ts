/**
 * Common type definitions used across the application
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features: string[];
  pricing?: ServicePricing;
}

export interface ServicePricing {
  amount: number;
  currency: string;
  period: 'month' | 'year' | 'one-time';
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  author?: string;
}

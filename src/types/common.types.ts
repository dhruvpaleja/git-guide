/**
 * Common type definitions used across the application
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: User;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

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

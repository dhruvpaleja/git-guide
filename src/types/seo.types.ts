/**
 * SEO, GEO, PSEO, SXO, ASO Types
 * Multi-domain strategy, programmatic SEO, AI search optimization,
 * keyword tracking, structured data, and search ranking automation.
 *
 * Acronym Guide:
 *   SEO  — Search Engine Optimization (Google / Bing)
 *   GEO  — Generative Engine Optimization (ChatGPT / Gemini / Perplexity)
 *   PSEO — Programmatic SEO (long-tail keyword pages at scale)
 *   SXO  — Search Experience Optimization (user behavior on page)
 *   ASO  — App Store Optimization (for future mobile app)
 */

// ── Multi-Domain Strategy ────────────────────────────────────────────────

export interface DomainConfig {
  domain: string; // e.g., 'www.soulyatri.com'
  purpose: 'primary' | 'regional' | 'redirect';
  region?: string; // e.g., 'global', 'india'
  ssl: boolean;
  cdn: boolean;
  /** Language/region code for hreflang, e.g., 'en', 'en-IN' */
  langRegionCode?: string;
}

/** Soul Yatri owns: soulyatri.com, soulyatri.in, soulyatri.net */
export interface MultiDomainStrategy {
  primaryDomain: string; // www.soulyatri.com
  domains: DomainConfig[];
  canonicalDomain: string; // all pages point canonical to this
  redirectRules: DomainRedirect[];
  hreflangEnabled: boolean;
}

export interface DomainRedirect {
  from: string; // e.g., 'www.soulyatri.net'
  to: string; // e.g., 'www.soulyatri.com'
  type: 301 | 302;
}

// ── SEO (Search Engine Optimization) ─────────────────────────────────────

export interface SEOPageMeta {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: 'website' | 'article' | 'product' | 'profile';
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: StructuredData[];
  robots: string; // 'index, follow' etc.
  hreflangTags?: HreflangTag[];
}

export interface StructuredData {
  type: 'Organization' | 'WebSite' | 'Article' | 'Product' | 'FAQPage'
    | 'Event' | 'Course' | 'Person' | 'MedicalBusiness' | 'BreadcrumbList'
    | 'Review' | 'AggregateRating' | 'HowTo' | 'VideoObject';
  data: Record<string, unknown>;
}

export interface HreflangTag {
  lang: string;
  url: string;
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number; // 0.0 to 1.0
}

export interface SitemapConfig {
  baseUrl: string;
  entries: SitemapEntry[];
  autoGenerate: boolean;
  regenerateIntervalHours: number;
}

// ── Keyword Tracking & Research ──────────────────────────────────────────

export type KeywordCategory = 'therapy' | 'astrology' | 'meditation' | 'wellness' | 'mental-health' | 'brand' | 'competitor' | 'long-tail';

export interface TrackedKeyword {
  id: string;
  keyword: string;
  category: KeywordCategory;
  currentRank?: number;
  previousRank?: number;
  searchVolume: number;
  difficulty: number; // 0-100
  targetUrl: string;
  status: 'tracking' | 'ranking' | 'lost' | 'new';
  history: KeywordRankHistory[];
  updatedAt: Date;
}

export interface KeywordRankHistory {
  date: Date;
  rank: number;
  searchEngine: 'google' | 'bing' | 'yahoo';
}

export interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  trendDirection: 'rising' | 'stable' | 'declining';
  suggestedContentType: 'blog' | 'programmatic-page' | 'landing-page' | 'faq';
  generatedAt: Date;
}

// ── GEO (Generative Engine Optimization) ─────────────────────────────────

export interface GEOConfig {
  /** Content optimized for AI citation */
  aiCitationKeywords: string[];
  /** Schema markup that AI engines prefer */
  structuredAnswers: StructuredAnswer[];
  /** Brand mention tracking in AI responses */
  brandMentions: AIBrandMention[];
  /** FAQ-style content for AI snippet extraction */
  faqContent: FAQItem[];
}

export interface StructuredAnswer {
  question: string;
  answer: string;
  category: string;
  updatedAt: Date;
}

export interface AIBrandMention {
  engine: 'chatgpt' | 'gemini' | 'perplexity' | 'copilot' | 'claude';
  query: string;
  mentioned: boolean;
  position?: number; // position in response
  checkedAt: Date;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  pageUrl: string;
  jsonLdIncluded: boolean;
}

// ── PSEO (Programmatic SEO) ──────────────────────────────────────────────

export interface ProgrammaticPage {
  id: string;
  templateType: 'therapist-for-issue' | 'meditation-for-goal' | 'city-therapist'
    | 'therapy-type' | 'healing-guide' | 'wellness-topic';
  slug: string; // e.g., '/therapist-for-anxiety'
  title: string;
  metaDescription: string;
  generatedContent: string;
  dataSource: string; // what powers the dynamic content
  internalLinks: string[];
  cta: string;
  status: 'draft' | 'published' | 'archived';
  trafficLast30Days: number;
  conversionsLast30Days: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PSEOTemplate {
  id: string;
  name: string;
  urlPattern: string; // e.g., '/therapist-for-{issue}'
  titlePattern: string;
  descriptionPattern: string;
  contentTemplate: string;
  variables: string[]; // e.g., ['issue', 'city']
  generatedPages: number;
  active: boolean;
}

// ── SXO (Search Experience Optimization) ─────────────────────────────────

export interface SXOMetrics {
  pageUrl: string;
  /** Core Web Vitals */
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift
  /** User behavior */
  bounceRate: number;
  averageTimeOnPage: number; // seconds
  scrollDepth: number; // percentage
  conversionRate: number;
  exitRate: number;
  /** Engagement */
  clickThroughRate: number;
  returnVisitRate: number;
  measuredAt: Date;
}

// ── ASO (App Store Optimization — for future mobile app) ─────────────────

export interface ASOConfig {
  appName: string;
  subtitle: string;
  keywords: string[];
  shortDescription: string;
  longDescription: string;
  screenshotUrls: string[];
  previewVideoUrl?: string;
  category: string;
  icon: string;
  currentRating: number;
  totalDownloads: number;
  store: 'apple' | 'google';
}

// ── SEO Automation Pipeline ──────────────────────────────────────────────

export interface SEOAutomationConfig {
  /** Auto-generate blog topics from trending searches */
  trendingKeywordCron: string; // cron expression
  /** Auto-suggest meta descriptions */
  autoMetaDescriptions: boolean;
  /** Auto internal linking between blog posts */
  autoInternalLinking: boolean;
  /** Auto-generate sitemap on content change */
  autoSitemap: boolean;
  /** Monitor and alert on ranking drops */
  rankDropAlertThreshold: number; // positions dropped
  /** AI content pipeline */
  aiContentDrafts: boolean;
  /** Google Search Console integration */
  searchConsoleConnected: boolean;
  searchConsolePropertyUrl?: string;
}

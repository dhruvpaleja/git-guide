/**
 * Community Feature Types
 */

export interface CommunityThread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  views: number;
  likes: number;
  replies: number;
  pinned: boolean;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityPost {
  id: string;
  threadId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  helpful: number;
  mediaAttachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityUser {
  userId: string;
  joinedAt: Date;
  postsCount: number;
  reputation: number;
  badges: Badge[];
  followers: number;
  following: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface CommunityCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadsCount: number;
  postsCount: number;
}

// ── ML-Based Content Moderation ──────────────────────────────────────────

/** AI auto-flagging system for community content at scale */
export interface ContentModerationResult {
  id: string;
  contentId: string;
  contentType: 'thread' | 'post' | 'comment' | 'profile-bio';
  /** NLP analysis */
  toxicityScore: number; // 0-1
  selfHarmScore: number; // 0-1
  hateSpeechScore: number; // 0-1
  spamScore: number; // 0-1
  sexualContentScore: number; // 0-1
  violenceScore: number; // 0-1
  /** Overall decision */
  autoDecision: 'approve' | 'flag-for-review' | 'auto-remove';
  confidence: number; // 0-1
  /** If flagged, which rules triggered */
  triggeredRules: ModerationRule[];
  /** Human review (if flagged) */
  humanReviewStatus: 'pending' | 'reviewed' | 'not-needed';
  humanReviewedBy?: string;
  humanDecision?: 'approve' | 'remove' | 'warn-user' | 'ban-user';
  reviewedAt?: Date;
  analyzedAt: Date;
}

export interface ModerationRule {
  rule: string;
  category: 'toxicity' | 'self-harm' | 'hate-speech' | 'spam' | 'sexual' | 'violence' | 'misinformation' | 'personal-info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  matchedText?: string;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  contentId: string;
  contentType: 'thread' | 'post' | 'comment';
  reason: 'spam' | 'harassment' | 'self-harm' | 'hate-speech' | 'misinformation' | 'inappropriate' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'action-taken' | 'dismissed';
  reviewedBy?: string;
  actionTaken?: 'removed' | 'warned' | 'banned' | 'no-action';
  reportedAt: Date;
  reviewedAt?: Date;
}

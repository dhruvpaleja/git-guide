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

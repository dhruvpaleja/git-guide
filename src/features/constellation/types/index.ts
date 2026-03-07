/**
 * Constellation Feature Types
 * The Soul Constellation Map — an interactive emotional resonance graph
 */

// ── Node Types ───────────────────────────────────────────────────────────

export type NodeCategory =
  | 'self'
  | 'career'
  | 'relationship'
  | 'health'
  | 'finance'
  | 'family'
  | 'spirituality'
  | 'creativity'
  | 'social'
  | 'education';

export type NodeEmotion =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'fear'
  | 'anxiety'
  | 'peace'
  | 'confusion'
  | 'hope'
  | 'grief'
  | 'excitement'
  | 'burnout'
  | 'neutral';

export type ConnectionType = 'harmony' | 'friction' | 'neutral' | 'evolving';

export type NodeIntensity = 1 | 2 | 3 | 4 | 5;

// ── AI generation provenance ─────────────────────────────────────────────

/** Source that triggered AI generation of a constellation node */
export type NodeGenerationSource =
  | 'mood_log'
  | 'journal'
  | 'chat'
  | 'onboarding'
  | 'session_transcript'
  | 'astro'
  | 'pattern';

export interface ConstellationNode {
  id: string;
  userId: string;
  label: string;
  description: string;
  category: NodeCategory;
  emotion: NodeEmotion;
  intensity: NodeIntensity;
  /** Position on the canvas (0-100 percentage) */
  x: number;
  y: number;
  /** Visual size multiplier (0.5 - 2.0) */
  size: number;
  /** Whether this node is pinned by the user */
  isPinned: boolean;
  /** Whether the user has hidden this node from view */
  isHidden: boolean;
  /** Node creation timestamp */
  createdAt: string;
  /** Last interaction timestamp */
  updatedAt: string;
  /** AI-detected note / context for this node */
  note?: string;
  /** Optional user-added private annotation */
  userNote?: string;
  /** User's corrected label for the AI-detected label */
  userRenamedLabel?: string;
  /** Tags for searching/filtering */
  tags: string[];
  // ── AI provenance ────────────────────────────────────────────────────
  /** All nodes are AI-generated; this field records the originating pipeline */
  generationSource: NodeGenerationSource;
  /** ID of the source record (e.g., MoodEntry.id, JournalEntry.id) */
  sourceId?: string;
  /** AI extraction confidence 0-1 */
  generationConfidence?: number;
  /** User accuracy feedback: true=accurate, false=inaccurate, null=not rated */
  feedbackAccurate?: boolean | null;
  /** Free-text feedback from user */
  feedbackNote?: string;
}

export interface ConstellationConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  strength: number; // 0.0 - 1.0
  label?: string;
  createdAt: string;
}

export interface ConstellationInsight {
  id: string;
  type: 'pattern' | 'warning' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  relatedNodeIds: string[];
  createdAt: string;
  isRead: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

export interface ConstellationData {
  nodes: ConstellationNode[];
  connections: ConstellationConnection[];
  insights: ConstellationInsight[];
  lastUpdated: string;
}

// ── API payloads ─────────────────────────────────────────────────────────

export interface CreateNodePayload {
  label: string;
  description: string;
  category: NodeCategory;
  emotion: NodeEmotion;
  intensity: NodeIntensity;
  x: number;
  y: number;
  note?: string;
  tags?: string[];
}

export interface UpdateNodePayload {
  /** User can nudge intensity (UI restricts to ±1 from AI value) */
  intensity?: NodeIntensity;
  x?: number;
  y?: number;
  isPinned?: boolean;
  isHidden?: boolean;
  userNote?: string;
  userRenamedLabel?: string;
  feedbackAccurate?: boolean;
  feedbackNote?: string;
}

export interface CreateConnectionPayload {
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  strength: number;
  label?: string;
}

// ── UI state ─────────────────────────────────────────────────────────────

export interface ConstellationViewState {
  zoom: number;
  panX: number;
  panY: number;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  activeFilter: NodeCategory | 'all';
  showInsights: boolean;
}

// ── Category config ──────────────────────────────────────────────────────

export interface CategoryConfig {
  label: string;
  icon: string;
  color: string;
  glowColor: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORY_CONFIGS: Record<NodeCategory, CategoryConfig> = {
  self: {
    label: 'Self',
    icon: 'User',
    color: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.2)',
    bgColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  career: {
    label: 'Career',
    icon: 'Briefcase',
    color: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.25)',
    bgColor: 'rgba(20, 184, 166, 0.08)',
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  relationship: {
    label: 'Relationship',
    icon: 'Heart',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    bgColor: 'rgba(244, 63, 94, 0.08)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  health: {
    label: 'Health',
    icon: 'Activity',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.25)',
    bgColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  finance: {
    label: 'Finance',
    icon: 'DollarSign',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    bgColor: 'rgba(234, 179, 8, 0.08)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  family: {
    label: 'Family',
    icon: 'Users',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.25)',
    bgColor: 'rgba(167, 139, 250, 0.08)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  spirituality: {
    label: 'Spirituality',
    icon: 'Sparkles',
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.25)',
    bgColor: 'rgba(192, 132, 252, 0.08)',
    borderColor: 'rgba(192, 132, 252, 0.3)',
  },
  creativity: {
    label: 'Creativity',
    icon: 'Palette',
    color: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.25)',
    bgColor: 'rgba(251, 146, 60, 0.08)',
    borderColor: 'rgba(251, 146, 60, 0.3)',
  },
  social: {
    label: 'Social',
    icon: 'MessageCircle',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    bgColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  education: {
    label: 'Education',
    icon: 'GraduationCap',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    bgColor: 'rgba(52, 211, 153, 0.08)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
};

export const EMOTION_CONFIGS: Record<NodeEmotion, { label: string; emoji: string; color: string }> = {
  joy: { label: 'Joy', emoji: '✨', color: '#fbbf24' },
  sadness: { label: 'Sadness', emoji: '🌧', color: '#60a5fa' },
  anger: { label: 'Anger', emoji: '🔥', color: '#ef4444' },
  fear: { label: 'Fear', emoji: '⚡', color: '#a855f7' },
  anxiety: { label: 'Anxiety', emoji: '🌀', color: '#f97316' },
  peace: { label: 'Peace', emoji: '🕊', color: '#14b8a6' },
  confusion: { label: 'Confusion', emoji: '🌫', color: '#94a3b8' },
  hope: { label: 'Hope', emoji: '🌅', color: '#fcd34d' },
  grief: { label: 'Grief', emoji: '🥀', color: '#6366f1' },
  excitement: { label: 'Excitement', emoji: '⚡', color: '#ec4899' },
  burnout: { label: 'Burnout', emoji: '💔', color: '#dc2626' },
  neutral: { label: 'Neutral', emoji: '◯', color: '#6b7280' },
};


// ── AI node source display config ────────────────────────────────────────

export interface NodeSourceLabel {
  emoji: string;
  label: string;
}

/** Canonical map of NodeGenerationSource → display config. */
export const NODE_SOURCE_LABELS: Record<NodeGenerationSource, NodeSourceLabel> = {
  mood_log:           { emoji: '📊', label: 'Mood log' },
  journal:            { emoji: '📓', label: 'Journal' },
  chat:               { emoji: '💬', label: 'SoulBot' },
  onboarding:         { emoji: '🌟', label: 'Profile' },
  session_transcript: { emoji: '🎙️', label: 'Session' },
  astro:              { emoji: '🔮', label: 'Astrology' },
  pattern:            { emoji: '🔁', label: 'Pattern' },
};

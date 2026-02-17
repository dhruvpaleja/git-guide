/**
 * AI Assistant, Session Monitoring & Emergency System Types
 * 24/7 voice assistant, emergency flagging, pattern detection,
 * in-session AI monitoring of both client and therapist
 */

export interface AIConversation {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  mode: 'text' | 'voice';
  messages: AIMessage[];
  sentiment: SentimentAnalysis;
  flagged: boolean;
  flagDetails?: EmergencyFlag;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'critical';
  flagged: boolean;
}

export interface SentimentAnalysis {
  overallSentiment: 'positive' | 'neutral' | 'negative' | 'critical';
  score: number; // -1 to 1
  detectedEmotions: DetectedEmotion[];
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface DetectedEmotion {
  emotion: string;
  intensity: number; // 0-1
  confidence: number; // 0-1
}

/** Emergency flagging for negative keywords and behavior patterns */
export interface EmergencyFlag {
  id: string;
  userId: string;
  conversationId?: string;
  sessionId?: string;
  triggerType: 'keyword' | 'pattern' | 'sentiment' | 'manual' | 'session-monitor';
  triggerDetails: string;
  severity: 'warning' | 'urgent' | 'critical';
  detectedKeywords: string[];
  status: 'active' | 'reviewed' | 'resolved' | 'escalated';
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  reviewedAt?: Date;
  resolvedAt?: Date;
}

export interface BehaviorPattern {
  userId: string;
  patternType: 'mood-decline' | 'isolation' | 'sleep-disruption' | 'crisis-language' | 'disengagement';
  severity: 'mild' | 'moderate' | 'severe';
  dataPoints: PatternDataPoint[];
  detectedAt: Date;
  confidence: number;
}

export interface PatternDataPoint {
  timestamp: Date;
  source: 'mood-log' | 'journal' | 'ai-chat' | 'session-feedback' | 'activity' | 'session-monitor';
  value: string | number;
  details?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// In-Session AI Monitoring (runs during live therapy video sessions)
// ─────────────────────────────────────────────────────────────────────────

/** AI monitoring of the CLIENT during a therapy session */
export interface ClientSessionMonitor {
  id: string;
  sessionId: string;
  clientId: string;
  /** Real-time emotion tracking from video + audio */
  emotionTimeline: EmotionSnapshot[];
  /** Speech analysis */
  speechPatterns: SpeechAnalysis;
  /** Engagement metrics */
  engagement: EngagementMetrics;
  /** Risk indicators detected during session */
  riskIndicators: RiskIndicator[];
  /** Overall session analysis */
  sessionSummary: ClientSessionSummary;
  createdAt: Date;
}

export interface EmotionSnapshot {
  timestamp: number; // seconds into session
  emotions: DetectedEmotion[];
  dominantEmotion: string;
  facialExpression?: string;
  voiceTone?: 'calm' | 'anxious' | 'sad' | 'angry' | 'flat' | 'elevated';
}

export interface SpeechAnalysis {
  talkTimePercent: number; // % of session client spent talking
  averageSentiment: number; // -1 to 1
  keyTopics: string[];
  emotionalShifts: EmotionalShift[];
  speechRate: 'slow' | 'normal' | 'fast' | 'erratic';
  silencePeriods: SilencePeriod[];
}

export interface EmotionalShift {
  timestamp: number;
  fromEmotion: string;
  toEmotion: string;
  trigger?: string; // what was being discussed
}

export interface SilencePeriod {
  startTimestamp: number;
  endTimestamp: number;
  duration: number; // seconds
  context?: string;
}

export interface EngagementMetrics {
  eyeContactPercent: number;
  attentionScore: number; // 0-100
  responsiveness: 'high' | 'medium' | 'low';
  bodyLanguage?: 'open' | 'closed' | 'fidgeting' | 'relaxed';
}

export interface RiskIndicator {
  timestamp: number;
  type: 'self-harm-language' | 'crisis-signal' | 'substance-mention' | 'extreme-distress' | 'dissociation';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  exactQuote?: string;
  actionTaken: 'flagged' | 'alert-sent' | 'session-paused' | 'emergency-contacted';
}

export interface ClientSessionSummary {
  overallMood: number; // 1-10
  moodTrend: 'improving' | 'stable' | 'declining';
  keyInsights: string[];
  breakthroughMoments: BreakthroughMoment[];
  areasOfConcern: string[];
  recommendedFollowUp: string[];
}

export interface BreakthroughMoment {
  timestamp: number;
  description: string;
  emotion: string;
}

// ─────────────────────────────────────────────────────────────────────────
// AI monitoring of the THERAPIST during a therapy session (quality + fraud)
// ─────────────────────────────────────────────────────────────────────────

/** AI monitoring of the THERAPIST — quality assurance + fraud detection */
export interface TherapistSessionMonitor {
  id: string;
  sessionId: string;
  therapistId: string;
  /** Professional conduct analysis */
  conductAnalysis: TherapistConductAnalysis;
  /** Session quality metrics */
  qualityMetrics: SessionQualityMetrics;
  /** Fraud / red flag detection */
  fraudIndicators: FraudIndicator[];
  /** Compliance check */
  compliance: ComplianceCheck;
  /** Overall therapist performance for this session */
  performanceScore: number; // 0-100
  createdAt: Date;
}

export interface TherapistConductAnalysis {
  toneAppropriate: boolean;
  empathyScore: number; // 0-100
  activeListeningScore: number; // 0-100
  questionQuality: 'poor' | 'adequate' | 'good' | 'excellent';
  boundaryRespected: boolean;
  triggeredTopics: string[]; // topics that may cross ethical boundaries
  inappropriateLanguage: boolean;
  inappropriateDetails?: string;
}

export interface SessionQualityMetrics {
  sessionDurationActual: number; // minutes — did they cut it short?
  sessionDurationExpected: number;
  therapistTalkTimePercent: number;
  clientTalkTimePercent: number;
  techniquesUsed: string[]; // CBT, DBT, mindfulness, etc.
  goalsAddressed: string[];
  tasksAssigned: boolean;
  followUpScheduled: boolean;
  notesCompleted: boolean;
}

export interface FraudIndicator {
  type:
    | 'session-too-short'          // ended way before time
    | 'no-interaction'             // therapist barely spoke
    | 'inappropriate-content'      // unprofessional language
    | 'upselling'                  // pushing unnecessary sessions
    | 'outside-referral'           // referring clients off-platform
    | 'copy-paste-notes'           // same notes for multiple clients
    | 'fake-session'               // session marked complete but no video
    | 'boundary-violation'         // crossing professional boundaries
    | 'unqualified-treatment';     // treating issues outside specialization
  detected: boolean;
  confidence: number; // 0-1
  evidence: string;
  timestamp?: number;
}

export interface ComplianceCheck {
  consentObtained: boolean;
  confidentialityMaintained: boolean;
  recordingDisclosed: boolean;
  emergencyProtocolFollowed: boolean; // if crisis was detected
  ethicalGuidelinesFollowed: boolean;
  violations: ComplianceViolation[];
}

export interface ComplianceViolation {
  rule: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  timestamp: number;
  evidence: string;
}

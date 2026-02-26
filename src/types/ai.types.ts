/**
 * AI Assistant, Session Monitoring & Emergency System Types
 * 24/7 voice assistant, emergency flagging, pattern detection,
 * in-session AI monitoring of both client and therapist
 */

// ── AI Model Configuration & Fine-Tuning ─────────────────────────────────

/** AI model selection and configuration for each use case */
export interface AIModelConfig {
  useCase: AIUseCase;
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  model: string; // e.g., 'gpt-4', 'gpt-4o-mini', 'whisper-1'
  version: string;
  /** Fine-tuning config (therapy-specific language) */
  fineTuned: boolean;
  fineTuneId?: string;
  fineTuneDataset?: string;
  /** Performance */
  averageLatencyMs: number;
  costPer1kTokens: number;
  maxContextTokens: number;
  /** Guardrails */
  contentFilterEnabled: boolean;
  therapySafetyPrompt: string; // system prompt with therapy safety rules
  crisisKeywords: string[]; // hardcoded keywords that trigger instant flag
  /** Evaluation */
  lastEvaluatedAt?: Date;
  evaluationScore?: number;
  active: boolean;
}

export type AIUseCase =
  | 'chat-assistant'           // 24/7 text chat
  | 'voice-assistant'          // 24/7 voice
  | 'session-transcription'    // Whisper for therapy session recording
  | 'sentiment-analysis'       // Real-time sentiment scoring
  | 'emotion-detection'        // Video frame emotion detection
  | 'crisis-detection'         // Emergency keyword/pattern detection
  | 'session-summary'          // Post-session summary generation
  | 'personality-report'       // Deep personality analysis
  | 'therapist-quality'        // Therapist conduct analysis
  | 'fraud-detection'          // Therapist fraud detection
  | 'content-moderation'       // Community/blog content flagging
  | 'seo-content'              // Blog topic/content generation
  | 'recommendation-engine'    // Course/therapist/content recommendations
  | 'kundali-analysis'         // AI-assisted kundali interpretation
  | 'behavior-pattern'         // Long-term behavior pattern detection
  | 'churn-prediction'         // User churn risk scoring
  | 'lead-scoring';            // Conversion likelihood scoring

/** Fine-tuning dataset for therapy-specific language */
export interface FineTuningDataset {
  id: string;
  name: string;
  useCase: AIUseCase;
  /** Training data sources */
  dataSource: 'therapy-transcripts' | 'crisis-conversations' | 'session-notes' | 'community-posts' | 'synthetic';
  sampleCount: number;
  /** Anonymization — ALL training data must be fully anonymized */
  anonymized: boolean;
  anonymizationMethod: 'pii-removal' | 'synthetic-replacement' | 'differential-privacy';
  /** Training runs */
  lastTrainedAt?: Date;
  trainedModelId?: string;
  evaluationMetrics: ModelEvaluationMetrics;
  status: 'collecting' | 'preparing' | 'training' | 'evaluating' | 'deployed' | 'retired';
  createdAt: Date;
}

export interface ModelEvaluationMetrics {
  accuracy: number; // 0-1
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  /** Therapy-specific metrics */
  crisisDetectionRecall: number; // MUST be >0.99 — never miss a crisis
  empathyAppropriateRate: number;
  safetyViolationRate: number; // MUST be 0
}

// ── AI Conversations ─────────────────────────────────────────────────────

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

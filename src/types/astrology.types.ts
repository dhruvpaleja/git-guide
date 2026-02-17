/**
 * Astrologer Feature Types
 * Astrologer dashboard, kundali analysis, prediction system
 */

export interface AstrologerProfile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  specializations: AstrologySpecialization[];
  experience: number; // years
  languages: string[];
  rating: number;
  totalReadings: number;
  verified: boolean;
  bio: string;
  availability: AstrologerSlot[];
  createdAt: Date;
}

export type AstrologySpecialization =
  | 'vedic'
  | 'western'
  | 'numerology'
  | 'tarot'
  | 'palmistry'
  | 'vastu'
  | 'nadi'
  | 'prashna';

export interface AstrologerSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface KundaliChart {
  id: string;
  clientId: string;
  astrologerId: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  chartData: Record<string, unknown>; // Parasara Light compatible data
  dashaData: DashaInfo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DashaInfo {
  dashaLord: string;
  subDashaLord: string;
  startDate: string;
  endDate: string;
  predictions: string[];
}

/** Pre-session analysis written by astrologer before therapy */
export interface PreSessionAstrologyReport {
  id: string;
  sessionId: string;
  astrologerId: string;
  clientId: string;
  kundaliChartId: string;
  currentDasha: string;
  predictions: AstrologyPrediction[];
  personalityTraits: string[];
  challengePeriods: ChallengePeriod[];
  recommendations: string[];
  overallSummary: string;
  createdAt: Date;
}

export interface AstrologyPrediction {
  id: string;
  reportId: string;
  area: 'mental-health' | 'relationships' | 'career' | 'health' | 'spiritual' | 'general';
  prediction: string;
  confidence: 'high' | 'medium' | 'low';
  timeframe: string;
  /** Poll-based voting by multiple astrologers */
  votes: PredictionVote[];
  finalScore: number;
}

export interface PredictionVote {
  astrologerId: string;
  agree: boolean;
  comment?: string;
  votedAt: Date;
}

export interface ChallengePeriod {
  startDate: string;
  endDate: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  mitigations: string[];
}

export interface AstrologerSession {
  id: string;
  clientId: string;
  astrologerId: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'pre-therapy-analysis' | 'direct-consultation';
  notes?: string;
  report?: PreSessionAstrologyReport;
  completedAt?: Date;
}

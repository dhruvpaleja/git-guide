import { apiService } from './api.service';
import type {
  TherapistCard,
  SessionDetail,
  TimeSlot,
  NudgeItem,
  TherapistDashboard,
  TherapistClient,
  TherapyJourney,
  ListTherapistsParams,
  BookSessionPayload,
  RateSessionPayload,
  AvailabilitySlot,
  PaginatedList,
} from '@/types/therapy.types';

export const therapyApi = {
  // ── Discovery ──────────────────────────────────────────────────────────
  getRecommendedTherapists: () =>
    apiService.get<TherapistCard[]>('/therapy/therapists/recommended'),

  getAvailableNowTherapists: () =>
    apiService.get<TherapistCard[]>('/therapy/therapists/available-now'),

  listTherapists: (params: ListTherapistsParams) =>
    apiService.get<PaginatedList<TherapistCard>>('/therapy/therapists', { params: { ...params } }),

  getTherapist: (id: string) =>
    apiService.get<TherapistCard>(`/therapy/therapists/${id}`),

  getTherapistSlots: (id: string, fromDate?: string, days?: number) =>
    apiService.get<TimeSlot[]>(`/therapy/therapists/${id}/slots`, {
      params: { fromDate, days },
    }),

  // ── Sessions ───────────────────────────────────────────────────────────
  bookSession: (data: BookSessionPayload) =>
    apiService.post<SessionDetail>('/therapy/sessions', data),

  bookInstantSession: (data?: { therapistId?: string }) =>
    apiService.post<SessionDetail>('/therapy/sessions/instant', data ?? {}),

  listSessions: (params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }) => apiService.get<PaginatedList<SessionDetail>>('/therapy/sessions', { params }),

  getSession: (id: string) =>
    apiService.get<SessionDetail>(`/therapy/sessions/${id}`),

  cancelSession: (id: string, reason?: string) =>
    apiService.patch<SessionDetail>(`/therapy/sessions/${id}/cancel`, { reason }),

  rescheduleSession: (id: string, newScheduledAt: string) =>
    apiService.patch<SessionDetail>(`/therapy/sessions/${id}/reschedule`, {
      newScheduledAt,
    }),

  rateSession: (id: string, data: RateSessionPayload) =>
    apiService.post<SessionDetail>(`/therapy/sessions/${id}/rate`, data),

  // ── User Journey ───────────────────────────────────────────────────────
  getUserJourney: () =>
    apiService.get<TherapyJourney>('/therapy/journey'),

  // ── Nudges ─────────────────────────────────────────────────────────────
  getNudges: () =>
    apiService.get<NudgeItem[]>('/therapy/nudges'),

  dismissNudge: (id: string) =>
    apiService.patch<NudgeItem>(`/therapy/nudges/${id}/dismiss`, {}),

  markNudgeActed: (id: string) =>
    apiService.patch<NudgeItem>(`/therapy/nudges/${id}/acted`, {}),

  // ── Therapist Dashboard ────────────────────────────────────────────────
  getTherapistDashboard: () =>
    apiService.get<TherapistDashboard>('/therapy/therapist/dashboard'),

  getTherapistSessions: (params?: { status?: string; page?: number }) =>
    apiService.get<PaginatedList<SessionDetail>>('/therapy/therapist/sessions', { params }),

  getTherapistClients: () =>
    apiService.get<TherapistClient[]>('/therapy/therapist/clients'),

  getTherapistClientDetail: (id: string) =>
    apiService.get(`/therapy/therapist/clients/${id}`),

  getTherapistAvailability: () =>
    apiService.get<AvailabilitySlot[]>('/therapy/therapist/availability'),

  updateTherapistAvailability: (slots: AvailabilitySlot[]) =>
    apiService.put('/therapy/therapist/availability', { slots }),

  updateOnlineStatus: (data: { isOnline?: boolean; isAcceptingNow?: boolean }) =>
    apiService.patch('/therapy/therapist/online-status', data),

  getTherapistProfile: () =>
    apiService.get('/therapy/therapist/profile'),

  updateTherapistProfile: (data: Record<string, unknown>) =>
    apiService.put('/therapy/therapist/profile', data),

  getTherapistMetrics: () =>
    apiService.get('/therapy/therapist/metrics'),
};

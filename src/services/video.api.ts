import { apiService } from './api.service';

export const videoApi = {
  /**
   * Start video session
   */
  startSession: (sessionId: string, enableRecording = true) =>
    apiService.post('/daily/start', { sessionId, enableRecording }),

  /**
   * End video session
   */
  endSession: (sessionId: string) =>
    apiService.post('/daily/end', { sessionId }),

  /**
   * Get room info
   */
  getRoom: (sessionId: string) =>
    apiService.get(`/daily/room/${sessionId}`),

  /**
   * Get access token
   */
  getToken: (sessionId: string) =>
    apiService.post('/daily/token', { sessionId }),

  /**
   * Toggle recording
   */
  toggleRecording: (sessionId: string, action: 'start' | 'stop') =>
    apiService.post('/daily/recording', { sessionId, action }),

  /**
   * Get recording URL
   */
  getRecordingUrl: (recordingId: string) =>
    apiService.get(`/daily/recording/${recordingId}`),
};

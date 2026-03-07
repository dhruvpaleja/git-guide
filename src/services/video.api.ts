import { apiService } from './api.service';

export const videoApi = {
  /**
   * Start video session (creates VideoSDK room)
   */
  startSession: (sessionId: string, enableRecording = true) =>
    apiService.post('/video/start', { sessionId, enableRecording }),

  /**
   * End video session
   */
  endSession: (sessionId: string) =>
    apiService.post('/video/end', { sessionId }),

  /**
   * Get room info
   */
  getRoom: (sessionId: string) =>
    apiService.get(`/video/room/${sessionId}`),

  /**
   * Get access token (VideoSDK JWT)
   */
  getToken: (sessionId: string) =>
    apiService.post('/video/token', { sessionId }),

  /**
   * Toggle recording
   */
  toggleRecording: (sessionId: string, action: 'start' | 'stop') =>
    apiService.post('/video/recording', { sessionId, action }),

  /**
   * Get recording URL
   */
  getRecordingUrl: (recordingId: string) =>
    apiService.get(`/video/recording/${recordingId}`),
};

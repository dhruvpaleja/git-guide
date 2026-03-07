/**
 * VideoSDK Service
 *
 * Manages video room creation, recording, and lifecycle using VideoSDK (videosdk.live).
 * VideoSDK provides low-latency video conferencing optimized for India (Mumbai region).
 *
 * ENV Required:
 * - VIDEOSDK_API_KEY: VideoSDK API key
 * - VIDEOSDK_SECRET_KEY: VideoSDK secret key for token generation
 */

import axios from 'axios';
import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

const VIDEOSDK_API_KEY = process.env.VIDEOSDK_API_KEY || '';
const VIDEOSDK_SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY || '';
const VIDEOSDK_BASE_URL = 'https://api.videosdk.live';

const videoSdkApi = axios.create({
  baseURL: VIDEOSDK_BASE_URL,
  headers: {
    'Authorization': VIDEOSDK_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface CreateRoomOptions {
  sessionId: string;
  duration?: number; // minutes
  enableRecording?: boolean;
  enableChat?: boolean;
  enableScreenShare?: boolean;
}

export interface RoomInfo {
  sessionId: string;
  roomName: string;
  roomUrl: string;
}

/**
 * Create a new VideoSDK meeting room
 */
export async function createRoom(options: CreateRoomOptions): Promise<RoomInfo> {
  const { sessionId, duration = 60 } = options;

  // Generate unique meeting ID
  const meetingId = `session-${sessionId}-${Date.now()}`;

  try {
    // Create meeting via VideoSDK API
    await videoSdkApi.post('/v1/rooms', {
      roomId: meetingId,
      name: `Session ${sessionId}`,
      duration: duration,
    });

    const roomUrl = `${VIDEOSDK_BASE_URL}/meet/${meetingId}`;

    // Save to database
    await prisma.videoRoom.create({
      data: {
        sessionId,
        roomName: meetingId,
        roomUrl,
      },
    });

    return { sessionId, roomName: meetingId, roomUrl };
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to create VideoSDK room:', err.response?.data || err.message);
    throw new Error('Failed to create video room');
  }
}

/**
 * Get room info from database
 */
export async function getRoom(sessionId: string): Promise<RoomInfo | null> {
  const room = await prisma.videoRoom.findUnique({
    where: { sessionId },
  });

  if (!room) return null;

  return {
    roomName: room.roomName,
    roomUrl: room.roomUrl || '',
    sessionId,
  };
}

/**
 * End room and eject all participants
 */
export async function endRoom(sessionId: string): Promise<void> {
  const room = await prisma.videoRoom.findUnique({
    where: { sessionId },
  });

  if (!room || !room.roomName) return;

  try {
    // End meeting via VideoSDK API
    await videoSdkApi.post(`/v1/rooms/${room.roomName}/end`);

    // Update database
    await prisma.videoRoom.update({
      where: { sessionId },
      data: { endedAt: new Date() },
    });
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to end room:', err.response?.data || err.message);
  }
}

/**
 * Start recording a session
 * VideoSDK supports cloud recording for paid plans
 */
export async function startRecording(sessionId: string): Promise<string | null> {
  const room = await prisma.videoRoom.findUnique({
    where: { sessionId },
  });

  if (!room || !room.roomName) return null;

  try {
    const response = await videoSdkApi.post(`/v1/recordings`, {
      roomId: room.roomName,
      awsRegion: 'ap-south-1', // Mumbai for India
    });

    const recordingId = response.data.recordingId;

    await prisma.videoRoom.update({
      where: { sessionId },
      data: { recordingId },
    });

    return recordingId;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to start recording:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Stop recording a session
 */
export async function stopRecording(sessionId: string): Promise<string | null> {
  const room = await prisma.videoRoom.findUnique({
    where: { sessionId },
  });

  if (!room || !room.recordingId) return null;

  try {
    await videoSdkApi.post(`/v1/recordings/${room.recordingId}/stop`);
    return room.recordingId;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to stop recording:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Get recording download URL
 */
export async function getRecordingUrl(recordingId: string): Promise<string | null> {
  try {
    const response = await videoSdkApi.get(`/v1/recordings/${recordingId}`);
    return response.data.downloadLink || null;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to get recording URL:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Generate access token for a room (for authenticated users)
 * VideoSDK uses JWT tokens signed with secret key
 */
export async function generateToken(_roomId: string, _userId: string, _userName: string): Promise<string> {
  try {
    // VideoSDK JWT token payload
    const payload = {
      api_key: VIDEOSDK_API_KEY,
      permissions: {
        allow_join: true,
        allow_mic: true,
        allow_webcam: true,
        allow_screen_share: true,
        allow_recording: true,
        allow_whiteboard: true,
      },
    };

    // Sign token with secret key
    const token = jwt.sign(payload, VIDEOSDK_SECRET_KEY, {
      expiresIn: '24h',
    });

    return token;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Failed to generate token:', err.message);
    throw new Error('Failed to generate access token');
  }
}

/**
 * Get meeting details from VideoSDK
 */
export async function getMeetingDetails(meetingId: string): Promise<unknown | null> {
  try {
    const response = await videoSdkApi.get(`/v1/rooms/${meetingId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to get meeting details:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Get all participants in a meeting
 */
export async function getMeetingParticipants(meetingId: string): Promise<string[]> {
  try {
    const response = await videoSdkApi.get(`/v1/rooms/${meetingId}/participants`);
    return response.data.participants || [];
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to get participants:', err.response?.data || err.message);
    return [];
  }
}

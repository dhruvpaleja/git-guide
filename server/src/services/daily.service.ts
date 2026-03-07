/**
 * VideoSDK Service
 * 
 * Manages video room creation, recording, and lifecycle.
 * 
 * ENV Required:
 * - VIDEOSDK_API_KEY: VideoSDK API key
 * - VIDEOSDK_SECRET_KEY: VideoSDK secret key for token generation
 */

import axios from 'axios';
import { prisma } from '../lib/prisma.js';
import crypto from 'crypto';

const VIDEOSDK_API_KEY = process.env.VIDEOSDK_API_KEY || '';
const VIDEOSDK_SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY || '';

const dailyApi = axios.create({
  baseURL: `https://api.videosdk.live`,
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
  roomName: string;
  roomUrl: string;
  sessionId: string;
}

/**
 * Create a new Daily.co video room
 */
export async function createRoom(options: CreateRoomOptions): Promise<RoomInfo> {
  const { sessionId, duration = 60, enableRecording = true, enableChat = true, enableScreenShare = true } = options;
  
  // Generate unique room name
  const roomName = `session-${sessionId}-${Date.now()}`;
  
  try {
    // Create room via Daily.co API
    const response = await dailyApi.post('/rooms', {
      name: roomName,
      properties: {
        exp: Math.floor(Date.now() / 1000) + (duration * 60 * 60), // Expires in duration hours
        enable_chat: enableChat,
        enable_screen_sharing: enableScreenShare,
        enable_recording: enableRecording,
        enable_emoji_reactions: true,
        eject_at_room_exp: true,
        enable_dialout: false,
        enable_dialin: false,
        lang: 'en',
      },
    });

    const roomUrl = response.data.url;

    // Save to database
    await prisma.dailyVideoRoom.create({
      data: {
        sessionId,
        roomName,
        roomUrl,
      },
    });

    return { roomName, roomUrl, sessionId };
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to create Daily room:', err.response?.data || err.message);
    throw new Error('Failed to create video room');
  }
}

/**
 * Get room info from database
 */
export async function getRoom(sessionId: string): Promise<RoomInfo | null> {
  const room = await prisma.dailyVideoRoom.findUnique({
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
  const room = await prisma.dailyVideoRoom.findUnique({
    where: { sessionId },
  });

  if (!room || !room.roomName) return;

  try {
    // End room via API
    await dailyApi.post(`/rooms/${room.roomName}/end`);
    
    // Update database
    await prisma.dailyVideoRoom.update({
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
 */
export async function startRecording(sessionId: string): Promise<string | null> {
  const room = await prisma.dailyVideoRoom.findUnique({
    where: { sessionId },
  });

  if (!room || !room.roomName) return null;

  try {
    const response = await dailyApi.post(`/recordings`, {
      roomName: room.roomName,
      properties: {
        width: 1280,
        height: 720,
        layout: 'speaker',
      },
    });

    const recordingId = response.data.id;

    await prisma.dailyVideoRoom.update({
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
  const room = await prisma.dailyVideoRoom.findUnique({
    where: { sessionId },
  });

  if (!room || !room.recordingId) return null;

  try {
    await dailyApi.post(`/recordings/${room.recordingId}/stop`);
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
    const response = await dailyApi.get(`/recordings/${recordingId}`);
    return response.data.download_link || null;
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
    // VideoSDK JWT token format
    const payload = {
      api_key: VIDEOSDK_API_KEY,
      permissions: {
        allow_join: true,
        allow_mic: true,
        allow_webcam: true,
        allow_screen_share: true,
      },
    };

    // Sign with secret key
    const token = crypto
      .createHmac('sha256', VIDEOSDK_SECRET_KEY)
      .update(JSON.stringify(payload))
      .digest('hex');

    return token;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Failed to generate token:', err.message);
    throw new Error('Failed to generate access token');
  }
}

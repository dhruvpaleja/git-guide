/**
 * Daily.co Service
 * 
 * Manages video room creation, recording, and lifecycle.
 * 
 * ENV Required:
 * - DAILY_API_KEY: Daily.co API key
 * - DAILY_DOMAIN: Daily.co domain (e.g., soulyatri.daily.co)
 */

import axios from 'axios';
import { prisma } from '../lib/prisma.js';

const DAILY_API_KEY = process.env.DAILY_API_KEY || '';
const DAILY_DOMAIN = process.env.DAILY_DOMAIN || 'soulyatri.daily.co';

const dailyApi = axios.create({
  baseURL: `https://api.daily.co/v1`,
  headers: {
    'Authorization': `Bearer ${DAILY_API_KEY}`,
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
  } catch (error: any) {
    console.error('Failed to create Daily room:', error.response?.data || error.message);
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
  } catch (error: any) {
    console.error('Failed to end room:', error.response?.data || error.message);
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
  } catch (error: any) {
    console.error('Failed to start recording:', error.response?.data || error.message);
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
  } catch (error: any) {
    console.error('Failed to stop recording:', error.response?.data || error.message);
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
  } catch (error: any) {
    console.error('Failed to get recording URL:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Generate access token for a room (for authenticated users)
 */
export async function generateToken(roomName: string, userId: string, userName: string): Promise<string> {
  try {
    const response = await dailyApi.post(`/meeting-tokens`, {
      properties: {
        room_name: roomName,
        user_id: userId,
        user_name: userName,
        is_owner: false, // Only therapists should be owners
      },
    });

    return response.data.token;
  } catch (error: any) {
    console.error('Failed to generate token:', error.response?.data || error.message);
    throw new Error('Failed to generate access token');
  }
}

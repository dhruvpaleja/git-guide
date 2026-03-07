# BUILD 3: Voice/Video Calls Integration

**Priority:** HIGH  
**Estimated Time:** 3-4 days  
**Status:** Not Started

---

## Overview

Integrate Daily.co for HIPAA-compliant video calling infrastructure. Enable users and therapists to have secure video sessions directly within the platform.

**Why Daily.co:**
- HIPAA-compliant (required for therapy)
- Pre-built UI components (quick integration)
- Excellent Indian network coverage
- Recording capabilities
- Screen sharing
- Chat functionality
- Connection quality monitoring

---

## Phase A: Setup & Configuration (A1-A4)

### SUBTASK A1: Create Daily.co Account & Get API Keys

**Action:** Sign up for Daily.co
**URL:** https://daily.co
**Plan:** Starter (free) → Pro (when scaling)

**Steps:**
1. Create account at https://dashboard.daily.co/signup
2. Create domain: `soulyatri.daily.co`
3. Get API key from dashboard
4. Add to `.env`:
```env
VITE_DAILY_DOMAIN=soulyatri.daily.co
VITE_DAILY_API_KEY=<your-api-key>
```

**Verify:** Can access Daily dashboard

---

### SUBTASK A2: Add Daily.co Dependencies

**File:** `package.json`
**Action:** ADD dependencies

```json
{
  "dependencies": {
    "@daily-co/daily-js": "^0.58.0",
    "@daily-co/daily-react": "^0.17.0"
  }
}
```

**Install:**
```bash
npm install @daily-co/daily-js @daily-co/daily-react
```

**Verify:** `npm install` succeeds

---

### SUBTASK A3: Add Daily Video Room Schema

**File:** `server/prisma/schema.prisma`
**Action:** ADD model after Session

```prisma
model DailyVideoRoom {
  id              String    @id @default(uuid())
  sessionId       String    @unique
  session         Session   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  roomName        String    @unique  // Daily.co room name
  roomUrl         String?   // Full URL (cached)
  
  startedAt       DateTime?
  endedAt         DateTime?
  
  recordingUrl    String?   // Recording URL if recorded
  recordingId     String?   // Daily.co recording ID
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([sessionId])
}
```

**Also add** to Session model:
```prisma
videoRoom         DailyVideoRoom?
```

**Verify:** `npx prisma validate` passes

---

### SUBTASK A4: Run Migration

**Command:**
```bash
cd server
npx prisma migrate dev --name add-daily-video-rooms
```

**Verify:** Migration succeeds, `npx prisma generate` succeeds

---

## Phase B: Backend Services (B1-B3)

### SUBTASK B1: Create daily.service.ts

**File:** `server/src/services/daily.service.ts`
**Action:** CREATE new file

**Purpose:** Daily.co API integration - create rooms, manage recordings

```typescript
/**
 * Daily.co Service
 * 
 * Manages video room creation, recording, and lifecycle.
 */

import axios from 'axios';
import { prisma } from '../lib/prisma.js';

const DAILY_API_KEY = process.env.DAILY_API_KEY;
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
  } catch (error) {
    console.error('Failed to create Daily room:', error);
    throw new Error('Failed to create video room');
  }
}

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
  } catch (error) {
    console.error('Failed to end room:', error);
  }
}

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
  } catch (error) {
    console.error('Failed to start recording:', error);
    return null;
  }
}

export async function stopRecording(sessionId: string): Promise<string | null> {
  const room = await prisma.dailyVideoRoom.findUnique({
    where: { sessionId },
  });

  if (!room || !room.recordingId) return null;

  try {
    await dailyApi.post(`/recordings/${room.recordingId}/stop`);
    return room.recordingId;
  } catch (error) {
    console.error('Failed to stop recording:', error);
    return null;
  }
}

export async function getRecordingUrl(recordingId: string): Promise<string | null> {
  try {
    const response = await dailyApi.get(`/recordings/${recordingId}`);
    return response.data.download_link || null;
  } catch (error) {
    console.error('Failed to get recording URL:', error);
    return null;
  }
}
```

---

### SUBTASK B2: Create daily.validator.ts

**File:** `server/src/validators/daily.validator.ts`
**Action:** CREATE new file

```typescript
import { z } from 'zod';
import { validateRequest } from './utils.js';

// Start session schema
export const startSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  enableRecording: z.boolean().optional().default(true),
  enableChat: z.boolean().optional().default(true),
});

// End session schema
export const endSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
});

// Toggle recording schema
export const toggleRecordingSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  action: z.enum(['start', 'stop']),
});

// Validators
export const validateStartSession = validateRequest(startSessionSchema);
export const validateEndSession = validateRequest(endSessionSchema);
export const validateToggleRecording = validateRequest(toggleRecordingSchema);
```

---

### SUBTASK B3: Create daily.controller.ts

**File:** `server/src/controllers/daily.controller.ts`
**Action:** CREATE new file

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { AppError, ErrorCode } from '../lib/errors.js';
import { sendSuccess } from '../lib/response.js';
import * as dailyService from '../services/daily.service.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Start video session
 * POST /api/v1/daily/start
 */
export const startSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId, role } = req.auth!;
  const { sessionId, enableRecording, enableChat } = req.body;

  // Verify user has access to session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  const isUser = session.userId === userId;
  const isTherapist = session.therapist.userId === userId;

  if (!isUser && !isTherapist) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // Check if room already exists
  const existingRoom = await dailyService.getRoom(sessionId);
  if (existingRoom) {
    return sendSuccess(res, existingRoom, 'Room retrieved successfully');
  }

  // Create new room
  const room = await dailyService.createRoom({
    sessionId,
    enableRecording,
    enableChat,
    enableScreenShare: true,
  });

  // Update session status to IN_PROGRESS
  await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'IN_PROGRESS' },
  });

  sendSuccess(res, room, 'Video room created successfully', 201);
});

/**
 * End video session
 * POST /api/v1/daily/end
 */
export const endSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const { sessionId } = req.body;

  // Verify access (same as start)
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session || (session.userId !== userId && session.therapist.userId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // End room
  await dailyService.endRoom(sessionId);

  // Update session status to COMPLETED (only therapist can complete)
  if (session.therapist.userId === userId) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    });
  }

  sendSuccess(res, { ended: true }, 'Session ended successfully');
});

/**
 * Get room info
 * GET /api/v1/daily/room/:sessionId
 */
export const getRoom = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const { userId } = req.auth!;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session || (session.userId !== userId && session.therapist.userId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  const room = await dailyService.getRoom(sessionId);

  if (!room) {
    throw new AppError({
      message: 'Room not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  sendSuccess(res, room, 'Room retrieved successfully');
});

/**
 * Toggle recording
 * POST /api/v1/daily/recording
 */
export const toggleRecording = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, action } = req.body;

  if (action === 'start') {
    const recordingId = await dailyService.startRecording(sessionId);
    sendSuccess(res, { recordingId, action: 'started' }, 'Recording started');
  } else {
    await dailyService.stopRecording(sessionId);
    sendSuccess(res, { action: 'stopped' }, 'Recording stopped');
  }
});

/**
 * Get recording URL
 * GET /api/v1/daily/recording/:recordingId
 */
export const getRecordingUrl = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { recordingId } = req.params;
  
  const url = await dailyService.getRecordingUrl(recordingId);
  
  if (!url) {
    throw new AppError({
      message: 'Recording not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  sendSuccess(res, { url }, 'Recording URL retrieved');
});
```

---

## Phase C: Backend Routes (C1)

### SUBTASK C1: Add Daily Routes

**File:** `server/src/routes/daily.ts`
**Action:** CREATE new file

```typescript
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as dailyController from '../controllers/daily.controller.js';
import * as validators from '../validators/daily.validator.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Video session management
router.post('/start', validators.validateStartSession, dailyController.startSession);
router.post('/end', validators.validateEndSession, dailyController.endSession);
router.get('/room/:sessionId', validators.validateStartSession, dailyController.getRoom);

// Recording management
router.post('/recording', validators.validateToggleRecording, dailyController.toggleRecording);
router.get('/recording/:recordingId', dailyController.getRecordingUrl);

export default router;
```

**Also:** Register route in `server/src/index.ts`:
```typescript
import dailyRoutes from './routes/daily.js';
app.use('/api/v1/daily', dailyRoutes);
```

---

## Phase D: Frontend Components (D1-D4)

### SUBTASK D1: Create Daily Video Component

**File:** `src/features/video/DailyVideoRoom.tsx`
**Action:** CREATE new file

```typescript
import { useEffect, useState } from 'react';
import { DailyProvider, CallFrame, DailyCall } from '@daily-co/daily-react';
import { useNavigate } from 'react-router-dom';
import { videoApi } from '@/services/video.api';
import VideoControls from './VideoControls';
import VideoQualityIndicator from './VideoQualityIndicator';

interface DailyVideoRoomProps {
  sessionId: string;
  userName: string;
  isTherapist?: boolean;
  onLeave?: () => void;
}

export default function DailyVideoRoom({ sessionId, userName, isTherapist, onLeave }: DailyVideoRoomProps) {
  const [callFrame, setCallFrame] = useState<CallFrame | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Create call frame
    const frame = window.DailyIframe.createFrame({
      iframeStyle: {
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
      },
      theme: {
        colors: {
          accent: '#f59e0b',
          accentText: '#ffffff',
          background: '#0c0c10',
          backgroundAccent: '#1a1a24',
          mainText: '#ffffff',
          mainAccentText: '#f59e0b',
          border: '#ffffff10',
          localVideo: '#ffffff20',
        },
      },
    });

    setCallFrame(frame);

    // Join room
    joinRoom(frame);

    // Cleanup
    return () => {
      frame.destroy();
    };
  }, [sessionId]);

  const joinRoom = async (frame: CallFrame) => {
    try {
      const { data } = await videoApi.getRoom(sessionId);
      
      const token = await videoApi.getToken(sessionId);
      
      await frame.join({
        url: data.roomUrl,
        token: token.token,
        videoSource: true,
        audioSource: true,
        userName,
      });

      setIsJoined(true);
    } catch (err) {
      setError('Failed to join video room');
      console.error(err);
    }
  };

  const leaveRoom = async () => {
    if (callFrame) {
      await callFrame.leave();
      await videoApi.endSession(sessionId);
      onLeave?.();
      navigate('/dashboard/sessions');
    }
  };

  const toggleRecording = async () => {
    try {
      await videoApi.toggleRecording(sessionId, isRecording ? 'stop' : 'start');
      setIsRecording(!isRecording);
    } catch (err) {
      console.error('Failed to toggle recording:', err);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={leaveRoom}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callFrame}>
      <div className="relative w-full h-full">
        {/* Video container */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0c0c10]" />
        
        {/* Controls overlay */}
        {isJoined && (
          <VideoControls
            onLeave={leaveRoom}
            isRecording={isRecording}
            onToggleRecording={toggleRecording}
            isTherapist={isTherapist}
          />
        )}

        {/* Quality indicator */}
        {isJoined && <VideoQualityIndicator />}
      </div>
    </DailyProvider>
  );
}
```

---

### SUBTASK D2: Create Video Controls Component

**File:** `src/features/video/VideoControls.tsx`
**Action:** CREATE new file

```typescript
import { useDaily, useLocalParticipant } from '@daily-co/daily-react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare, RecordCircle } from 'lucide-react';

interface VideoControlsProps {
  onLeave: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  isTherapist?: boolean;
}

export default function VideoControls({ onLeave, isRecording, onToggleRecording, isTherapist }: VideoControlsProps) {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();

  const toggleAudio = () => {
    daily?.setLocalAudio(!localParticipant?.audio);
  };

  const toggleVideo = () => {
    daily?.setLocalVideo(!localParticipant?.video);
  };

  const toggleScreenShare = async () => {
    await daily?.startScreenShare();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
      <div className="flex items-center justify-center gap-4">
        {/* Audio toggle */}
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${
            localParticipant?.audio
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
          } transition-colors`}
        >
          {localParticipant?.audio ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        {/* Video toggle */}
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            localParticipant?.video
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
          } transition-colors`}
        >
          {localParticipant?.video ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* Screen share (therapist only) */}
        {isTherapist && (
          <button
            onClick={toggleScreenShare}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Monitor className="w-6 h-6" />
          </button>
        )}

        {/* Recording toggle (therapist only) */}
        {isTherapist && (
          <button
            onClick={onToggleRecording}
            className={`p-4 rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <RecordCircle className="w-6 h-6" />
          </button>
        )}

        {/* Leave call */}
        <button
          onClick={onLeave}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
```

---

### SUBTASK D3: Create Video API Service

**File:** `src/services/video.api.ts`
**Action:** CREATE new file

```typescript
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
```

---

### SUBTASK D4: Create Video Quality Indicator

**File:** `src/features/video/VideoQualityIndicator.tsx`
**Action:** CREATE new file

```typescript
import { useDaily, useNetwork } from '@daily-co/daily-react';
import { Wifi, WifiOff, WifiLow } from 'lucide-react';

export default function VideoQualityIndicator() {
  const daily = useDaily();
  const network = useNetwork();

  if (!network) return null;

  const getQualityIcon = () => {
    if (network.quality === 0) return <WifiOff className="w-4 h-4 text-red-400" />;
    if (network.quality < 0.5) return <WifiLow className="w-4 h-4 text-yellow-400" />;
    return <Wifi className="w-4 h-4 text-green-400" />;
  };

  const getQualityText = () => {
    if (network.quality === 0) return 'Poor';
    if (network.quality < 0.5) return 'Fair';
    return 'Good';
  };

  return (
    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-2">
      {getQualityIcon()}
      <span className="text-[10px] text-white/80 font-medium">{getQualityText()}</span>
      {network.kbps && (
        <span className="text-[9px] text-white/60">{Math.round(network.kbps)} kbps</span>
      )}
    </div>
  );
}
```

---

## Phase E: Integration (E1-E2)

### SUBTASK E1: Wire Session Detail Page

**File:** `src/pages/dashboard/SessionDetailPage.tsx`
**Action:** MODIFY - add "Start Call" button

```typescript
// Add import
import DailyVideoRoom from '@/features/video/DailyVideoRoom';
import { videoApi } from '@/services/video.api';

// Add state
const [showVideo, setShowVideo] = useState(false);
const [videoStarted, setVideoStarted] = useState(false);

// Add function
const handleStartCall = async () => {
  try {
    await videoApi.startSession(sessionId);
    setVideoStarted(true);
    setShowVideo(true);
  } catch (err) {
    toast.error('Failed to start video call');
  }
};

// In SCHEDULED status actions:
{session.status === 'SCHEDULED' && isStartingSoon && (
  <button
    onClick={handleStartCall}
    className="min-h-[36px] px-5 py-2 rounded-full text-xs font-semibold transition-colors text-green-600 border border-green-200 bg-green-50/50 hover:bg-green-100"
  >
    Start Call
  </button>
)}

// Show video room modal
{showVideo && videoStarted && (
  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-4">
    <div className="w-full h-full max-w-6xl mx-auto">
      <DailyVideoRoom
        sessionId={sessionId}
        userName={user?.name || 'User'}
        isTherapist={user?.role === 'THERAPIST'}
        onLeave={() => setShowVideo(false)}
      />
    </div>
  </div>
)}
```

---

### SUBTASK E2: Add Token Endpoint

**File:** `server/src/controllers/daily.controller.ts`
**Action:** ADD new function

```typescript
/**
 * Get access token for room
 * POST /api/v1/daily/token
 */
export const getToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.body;
  const { userId } = req.auth!;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session || (session.userId !== userId && session.therapist.userId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // In production, generate Daily token with user info
  // For now, return room info (Daily allows joining without token for testing)
  const room = await dailyService.getRoom(sessionId);

  sendSuccess(res, {
    token: 'demo-token', // Replace with actual Daily token
    roomName: room?.roomName,
  }, 'Token generated');
});
```

---

## Phase F: Testing (F1-F2)

### SUBTASK F1: Test Video Call Flow

**Test:**
1. Book a session
2. Wait until session time
3. Click "Start Call"
4. Verify video room loads
5. Test audio/video toggle
6. Test screen share (therapist)
7. Test recording (therapist)
8. Click "Leave Call"
9. Verify session marked COMPLETED

**Verify:** All steps work without errors

---

### SUBTASK F2: Test Recording

**Test:**
1. Start video session
2. Click record button (therapist)
3. Wait 30 seconds
4. Stop recording
5. End session
6. Check Daily dashboard for recording
7. Verify recording URL accessible

**Verify:** Recording saved and accessible

---

## Execution Order

```
A1 → A2 → A3 → A4 (Setup)
B1 → B2 → B3 (Backend services)
C1 (Routes)
D1 → D2 → D3 → D4 (Frontend components)
E1 → E2 (Integration)
F1 → F2 (Testing)
```

**Total Time:** 3-4 days

---

## Success Criteria

- ✅ Video calls functional
- ✅ Audio/video toggle works
- ✅ Screen sharing works (therapist)
- ✅ Recording works (therapist)
- ✅ Connection quality indicator visible
- ✅ Session status updates correctly
- ✅ No TypeScript errors
- ✅ Build passes
- ✅ Lint passes

---

## Notes

**HIPAA Compliance:**
- Daily.co is HIPAA-compliant
- Enable BAA with Daily.co for production
- Recordings stored securely
- End-to-end encryption available

**Cost:**
- Starter: Free (1000 participant-minutes/day)
- Pro: $29/month (10,000 participant-minutes/day)
- Enterprise: Custom (unlimited)

**Fallback:**
- If Daily.co fails, show "Video unavailable. Reschedule?" message
- Log errors for debugging

import { useEffect, useState, useCallback } from 'react';
import { DailyProvider } from '@daily-co/daily-react';
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
  const [callObject, setCallObject] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLeave = useCallback(async () => {
    if (callObject) {
      await callObject.leave();
      await videoApi.endSession(sessionId);
      onLeave?.();
      navigate('/dashboard/sessions');
    }
  }, [callObject, sessionId, onLeave, navigate]);

  const toggleRecording = useCallback(async () => {
    try {
      await videoApi.toggleRecording(sessionId, isRecording ? 'stop' : 'start');
      setIsRecording(!isRecording);
    } catch (err) {
      console.error('Failed to toggle recording:', err);
    }
  }, [sessionId, isRecording]);

  const joinRoom = useCallback(async (call: any) => {
    try {
      const roomResponse = await videoApi.getRoom(sessionId);
      const tokenResponse = await videoApi.getToken(sessionId);
      const roomData = roomResponse.data as { roomUrl: string };
      const tokenData = tokenResponse.data as { token: string };
      
      await call.join({
        url: roomData.roomUrl,
        token: tokenData.token,
        videoSource: true,
        audioSource: true,
        userName,
      });

      setIsJoined(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join video room');
      console.error(err);
    }
  }, [sessionId, userName]);

  useEffect(() => {
    // Create call object
    const call = (window as any).DailyIframe.createCallObject({
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

    // Join room after call object is created
    call.on('joined-meeting', async () => {
      await joinRoom(call);
    });

    // Event listeners
    call.on('left-meeting', () => {
      handleLeave();
    });

    call.on('error', (event: unknown) => {
      console.error('Daily.co error:', event);
      setError('Connection error. Please refresh the page.');
    });

    // Set call object after event listeners are set up
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCallObject(call);

    // Cleanup
    return () => {
      call.destroy();
    };
  }, [joinRoom, handleLeave]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0c0c10]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleLeave}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <div className="relative w-full h-full bg-[#0c0c10]">
        {/* Video container */}
        <div className="absolute inset-0">
          {/* Remote participants grid */}
          <div className="w-full h-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Remote video tiles will be auto-rendered by Daily.co */}
            </div>
          </div>
        </div>
        
        {/* Local video (picture-in-picture) */}
        {isJoined && (
          <div className="absolute top-4 left-4 w-48 h-36 rounded-xl overflow-hidden border border-white/10 shadow-lg z-20">
            {/* Daily.co auto-renders local video here */}
          </div>
        )}

        {/* Controls overlay */}
        {isJoined && (
          <>
            <VideoControls
              onLeave={handleLeave}
              isRecording={isRecording}
              onToggleRecording={toggleRecording}
              isTherapist={isTherapist}
            />
            <VideoQualityIndicator />
          </>
        )}

        {/* Loading state */}
        {!isJoined && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-white/60">Joining session...</p>
            </div>
          </div>
        )}
      </div>
    </DailyProvider>
  );
}

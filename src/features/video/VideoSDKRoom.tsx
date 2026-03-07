import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { videoApi } from '@/services/video.api';
import VideoControls from './VideoControls';
import VideoQualityIndicator from './VideoQualityIndicator';

interface VideoSDKRoomProps {
  sessionId: string;
  userName: string;
  isTherapist?: boolean;
  onLeave?: () => void;
}

interface VideoSDKConfig {
  token: string;
  meetingId: string;
  micEnabled: boolean;
  webcamEnabled: boolean;
  name: string;
  mode: 'SEND_AND_RECV';
  multiStream: boolean;
}

// Custom participant view with beautiful design
function ParticipantView({ participantId, isLocal = false }: { participantId: string; isLocal?: boolean }) {
  const participant = useParticipant(participantId);

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const screenElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoElementRef.current && participant.webcamStream) {
      const mediaStream = new MediaStream([participant.webcamStream.track]);
      videoElementRef.current.srcObject = mediaStream;
    }
  }, [participant.webcamStream, participantId]);

  useEffect(() => {
    if (screenElementRef.current && participant.screenShareStream) {
      const mediaStream = new MediaStream([participant.screenShareStream.track]);
      screenElementRef.current.srcObject = mediaStream;
    }
  }, [participant.screenShareStream, participantId]);

  const isScreenSharing = participant.screenShareOn;
  const isAudioEnabled = participant.micOn;
  const isVideoEnabled = participant.webcamOn;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a24] ${isLocal ? 'ring-2 ring-amber-500/50' : ''}`}>
      {/* Video Container */}
      <div className="aspect-video w-full bg-[#0c0c10]">
        {isScreenSharing ? (
          <video
            ref={screenElementRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
        ) : isVideoEnabled ? (
          <video
            ref={videoElementRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover"
            aria-label={`${participant.displayName || 'Participant'} video`}
          >
            <track kind="captions" label="No captions available" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
              <span className="text-3xl font-bold text-amber-400/60">
                {participant.displayName?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Participant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/90">
              {participant.displayName}
              {isLocal && <span className="ml-2 text-[10px] text-amber-400">(You)</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isAudioEnabled && (
              <div className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/20">
                <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
            )}
            {isScreenSharing && (
              <div className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/20">
                <span className="text-[10px] text-amber-400 font-medium">Presenting</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Speaker Indicator */}
      {participant.isMainParticipant || (
        <div className="absolute top-3 right-3">
          {participant.isActiveSpeaker && (
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse border-2 border-[#1a1a24]" />
          )}
        </div>
      )}
    </div>
  );
}

// Main meeting component
function MeetingView({ sessionId, isTherapist, onLeave }: Omit<VideoSDKRoomProps, 'userName'>) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const meeting = useMeeting({
    onMeetingJoined: () => {
      console.warn('Meeting joined successfully');
    },
    onMeetingLeft: () => {
      console.warn('Meeting left');
      onLeave?.();
      navigate('/dashboard/sessions');
    },
    onError: (error: unknown) => {
      console.error('Meeting error:', error);
      setError('Connection error. Please refresh the page.');
    },
  });

  const handleLeave = useCallback(async () => {
    meeting.leave();
    await videoApi.endSession(sessionId);
    onLeave?.();
  }, [meeting, sessionId, onLeave]);

  const toggleRecording = useCallback(async () => {
    try {
      await videoApi.toggleRecording(sessionId, isRecording ? 'stop' : 'start');
      setIsRecording(!isRecording);
    } catch (err) {
      console.error('Failed to toggle recording:', err);
    }
  }, [sessionId, isRecording]);

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

  const participants = Array.from(meeting.participants.values());
  const localParticipantId = meeting.localParticipant?.id || 'local';

  return (
    <div className="relative w-full h-full bg-[#0c0c10]">
      {/* Main Video Grid */}
      <div className="absolute inset-0 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-full">
          {/* Local Participant */}
          <ParticipantView participantId={localParticipantId} isLocal />
          
          {/* Remote Participants */}
          {participants.map((participant: { id: string }) => (
            participant.id !== localParticipantId && (
              <ParticipantView key={participant.id} participantId={participant.id} />
            )
          ))}
        </div>
      </div>

      {/* Controls & Quality Indicator */}
      <VideoControls
        onLeave={handleLeave}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        isTherapist={isTherapist}
        meeting={meeting}
      />
      <VideoQualityIndicator />
    </div>
  );
}

// Main export with provider
export default function VideoSDKRoom({ sessionId, userName, isTherapist, onLeave }: VideoSDKRoomProps) {
  const [meetingConfig, setMeetingConfig] = useState<VideoSDKConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        // Get room info and token from backend
        const roomResponse = await videoApi.getRoom(sessionId);
        const tokenResponse = await videoApi.getToken(sessionId);
        
        const roomData = roomResponse.data as { roomUrl: string; roomName: string };
        const tokenData = tokenResponse.data as { token: string };

        // Configure VideoSDK with lowest latency settings
        const config: VideoSDKConfig = {
          token: tokenData.token,
          meetingId: roomData.roomName,
          micEnabled: true,
          webcamEnabled: true,
          name: userName,
          mode: 'SEND_AND_RECV',
          multiStream: true, // Enable for better quality
        };

        setMeetingConfig(config);
        setLoading(false);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || 'Failed to initialize video call');
        setLoading(false);
      }
    };

    initializeMeeting();
  }, [sessionId, userName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0c0c10]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Joining session with lowest latency...</p>
        </div>
      </div>
    );
  }

  if (error || !meetingConfig) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0c0c10]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 mb-4">{error || 'Failed to initialize'}</p>
        </div>
      </div>
    );
  }

  const MeetingProviderAny = MeetingProvider as unknown as React.ComponentType<{
    children: React.ReactNode;
    config: Record<string, unknown>;
    token: string;
    onError: (error: unknown) => void;
  }>;
  
  return (
    <MeetingProviderAny
      config={{
        meetingId: meetingConfig.meetingId,
        micEnabled: meetingConfig.micEnabled,
        webcamEnabled: meetingConfig.webcamEnabled,
        name: meetingConfig.name,
        participantId: userName,
        mode: meetingConfig.mode,
        multiStream: meetingConfig.multiStream,
        debugMode: false,
      }}
      token={meetingConfig.token}
      onError={(error: unknown) => {
        console.error('VideoSDK error:', error);
        setError('Connection error. Please refresh.');
      }}
    >
      <MeetingView
        sessionId={sessionId}
        isTherapist={isTherapist}
        onLeave={onLeave}
      />
    </MeetingProviderAny>
  );
}

import { useDaily, useLocalParticipant } from '@daily-co/daily-react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, CircleDot } from 'lucide-react';

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
          className={`p-4 rounded-full transition-colors ${
            localParticipant?.audio
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
          }`}
          title={localParticipant?.audio ? 'Mute' : 'Unmute'}
        >
          {localParticipant?.audio ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        {/* Video toggle */}
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            localParticipant?.video
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
          }`}
          title={localParticipant?.video ? 'Turn off camera' : 'Turn on camera'}
        >
          {localParticipant?.video ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* Screen share (therapist only) */}
        {isTherapist && (
          <button
            onClick={toggleScreenShare}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Share screen"
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
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <CircleDot className="w-6 h-6" />
          </button>
        )}

        {/* Leave call */}
        <button
          onClick={onLeave}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          title="Leave call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

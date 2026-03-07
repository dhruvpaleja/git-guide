import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, CircleDot } from 'lucide-react';

interface VideoControlsProps {
  onLeave: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  isTherapist?: boolean;
  meeting?: unknown; // VideoSDK meeting object
}

export default function VideoControls({ onLeave, isRecording, onToggleRecording, isTherapist, meeting }: VideoControlsProps) {
  const meetingObj = meeting as {
    toggleMic: () => void;
    toggleWebcam: () => void;
    disableScreenShare: () => Promise<void>;
    enableScreenShare: () => Promise<void>;
    micOn: boolean;
    webcamOn: boolean;
    screenShareOn: boolean;
  } | undefined;

  const toggleAudio = () => {
    meetingObj?.toggleMic();
  };

  const toggleVideo = () => {
    meetingObj?.toggleWebcam();
  };

  const toggleScreenShare = async () => {
    if (meetingObj?.screenShareOn) {
      await meetingObj.disableScreenShare();
    } else {
      await meetingObj?.enableScreenShare();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
      <div className="flex items-center justify-center gap-4">
        {/* Audio toggle */}
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
            meetingObj?.micOn
              ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 backdrop-blur-sm'
          }`}
          title={meetingObj?.micOn ? 'Mute' : 'Unmute'}
        >
          {meetingObj?.micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        {/* Video toggle */}
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
            meetingObj?.webcamOn
              ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 backdrop-blur-sm'
          }`}
          title={meetingObj?.webcamOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {meetingObj?.webcamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* Screen share (therapist only) */}
        {isTherapist && (
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
              meetingObj?.screenShareOn
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 backdrop-blur-sm'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
            }`}
            title={meetingObj?.screenShareOn ? 'Stop sharing' : 'Share screen'}
          >
            <Monitor className="w-6 h-6" />
          </button>
        )}

        {/* Recording toggle (therapist only) */}
        {isTherapist && (
          <button
            onClick={onToggleRecording}
            className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isRecording
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 backdrop-blur-sm animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <CircleDot className="w-6 h-6" />
          </button>
        )}

        {/* Leave call */}
        <button
          onClick={onLeave}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm shadow-lg shadow-red-500/30"
          title="Leave call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

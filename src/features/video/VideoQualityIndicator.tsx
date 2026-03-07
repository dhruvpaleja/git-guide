import { useMeeting } from '@videosdk.live/react-sdk';
import { Wifi, WifiOff, WifiLow } from 'lucide-react';

/**
 * VideoQualityIndicator - Shows network quality for VideoSDK sessions
 *
 * Uses the meeting network quality metric from VideoSDK
 */
export default function VideoQualityIndicator() {
  const meeting = useMeeting();

  if (!meeting) return null;

  // VideoSDK network quality: 0 = poor, 1 = fair, 2 = good, 3 = excellent
  // Note: networkQuality may not be available in all SDK versions
  const networkQuality = (meeting as any).networkQuality || 2;

  const getQualityIcon = () => {
    if (networkQuality === 0) return <WifiOff className="w-4 h-4 text-red-400" />;
    if (networkQuality === 1) return <WifiLow className="w-4 h-4 text-yellow-400" />;
    return <Wifi className="w-4 h-4 text-green-400" />;
  };

  const getQualityText = () => {
    if (networkQuality === 0) return 'Poor';
    if (networkQuality === 1) return 'Fair';
    if (networkQuality === 2) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-2 z-10">
      {getQualityIcon()}
      <span className="text-[10px] text-white/80 font-medium">{getQualityText()}</span>
    </div>
  );
}

import { useDaily, useNetwork } from '@daily-co/daily-react';
import { Wifi, WifiOff, WifiLow } from 'lucide-react';

export default function VideoQualityIndicator() {
  const daily = useDaily();
  const network = useNetwork();

  if (!network || !daily) return null;

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
    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-2 z-10">
      {getQualityIcon()}
      <span className="text-[10px] text-white/80 font-medium">{getQualityText()}</span>
    </div>
  );
}

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

/**
 * Network status banner - shows at top of page
 * Informs users about their connection quality
 */
export function NetworkStatusBanner() {
  const { status, isOnline, isSlow, downlink, rtt } = useNetworkStatus();

  // Don't show banner on good connections
  if (isOnline && !isSlow) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] py-2 px-4 text-center text-xs font-medium ${
      !isOnline
        ? 'bg-red-500 text-white'
        : status === 'slow-2g' || status === '2g'
        ? 'bg-red-400 text-white'
        : status === '3g'
        ? 'bg-yellow-400 text-black'
        : 'bg-blue-400 text-white'
    }`}>
      <div className="flex items-center justify-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-3 h-3" />
            <span>You're offline. Some features may not work.</span>
          </>
        ) : status === 'slow-2g' || status === '2g' ? (
          <>
            <AlertTriangle className="w-3 h-3" />
            <span>Very slow connection ({downlink?.toFixed(1)} Mbps). Loading minimal content.</span>
          </>
        ) : status === '3g' ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>Slow connection ({downlink?.toFixed(1)} Mbps). Some features disabled.</span>
          </>
        ) : null}
        
        {rtt && (
          <span className="ml-2 opacity-75">
            ({rtt}ms latency)
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Data saver mode toggle
 */
export function DataSaverToggle() {
  const { isSlow, saveData } = useNetworkStatus();

  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      {saveData && (
        <>
          <AlertTriangle className="w-3 h-3" />
          <span>Data Saver mode is on</span>
        </>
      )}
      {isSlow && (
        <>
          <Wifi className="w-3 h-3" />
          <span>Low bandwidth mode active</span>
        </>
      )}
    </div>
  );
}

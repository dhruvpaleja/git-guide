import { useState, useEffect } from 'react';

type NetworkStatus = 'online' | 'offline' | 'slow-2g' | '2g' | '3g' | '4g';

interface NetworkInfo {
  status: NetworkStatus;
  isOnline: boolean;
  isSlow: boolean;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Hook to detect network status and quality
 * Works on Chrome, Edge, Opera (Network Information API)
 * Falls back to online/offline on other browsers
 */
export function useNetworkStatus(): NetworkInfo {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    status: navigator.onLine ? 'online' : 'offline',
    isOnline: navigator.onLine,
    isSlow: false,
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      let status: NetworkStatus = 'online';
      let isSlow = false;

      if (!navigator.onLine) {
        status = 'offline';
        isSlow = true;
      } else if (connection) {
        // Network Information API available
        const effectiveType = connection.effectiveType as NetworkStatus;
        status = effectiveType || '4g';
        isSlow = status === 'slow-2g' || status === '2g' || status === '3g';
      }

      setNetworkInfo({
        status,
        isOnline: navigator.onLine,
        isSlow,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
      });
    };

    // Initial check
    updateNetworkInfo();

    // Listen for changes
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return networkInfo;
}

/**
 * Hook to conditionally load components based on network quality
 * @param minNetwork - Minimum network quality required ('2g' | '3g' | '4g')
 */
export function useConditionalLoad(minNetwork: NetworkStatus = '3g'): boolean {
  const { status, isOnline } = useNetworkStatus();
  
  const networkRank = {
    'slow-2g': 0,
    '2g': 1,
    '3g': 2,
    '4g': 3,
    'online': 4,
    'offline': -1,
  };

  const currentRank = networkRank[status];
  const minRank = networkRank[minNetwork];

  return isOnline && currentRank >= minRank;
}

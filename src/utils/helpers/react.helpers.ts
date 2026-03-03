/**
 * React Helper Functions
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Check if component is mounted
 */
export const useIsMounted = () => {
  const isMounted = useRef(false);
  const [isMountedState, setIsMountedState] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    setIsMountedState(true);
    return () => {
      isMounted.current = false;
      setIsMountedState(false);
    };
  }, []);

  return isMountedState;
};

/**
 * Debounce hook
 */
export const useDebounce = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Get previous value
 */
export const usePrevious = <T,>(value: T) => {
  const ref = useRef<T>(null);
  const [previousValue, setPreviousValue] = useState<T | null>(null);

  useEffect(() => {
    // Update previous value after the component renders
    const timer = setTimeout(() => {
      setPreviousValue(ref.current);
      ref.current = value;
    }, 0);
    return () => clearTimeout(timer);
  }, [value]);

  return previousValue;
};

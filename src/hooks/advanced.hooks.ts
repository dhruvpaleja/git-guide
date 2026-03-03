/**
 * Advanced React Hooks
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useAsyncOperation - Handle async operations with loading/error states
 */
export function useAsyncOperation<T, E = unknown>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('loading');
    setData(null);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      setStatus('success');
      return result;
    } catch (e) {
      setError(e as E);
      setStatus('error');
      throw e;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      // Use setTimeout to avoid setting state directly in effect
      setTimeout(() => {
        execute();
      }, 0);
    }
  }, [execute, immediate]);

  return { data, error, status, execute };
}

/**
 * useFetch - Simplified fetch hook
 */
export function useFetch<T>(url: string, options?: RequestInit) {
  return useAsyncOperation<T>(() => fetch(url, options).then((r) => r.json()), true);
}

/**
 * useLocalStorage - Sync state with localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

/**
 * useWindowSize - Track window size
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * usePrevious - Get previous value
 */
export function usePrevious<T>(value: T): T | null {
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
}

/**
 * useClickOutside - Handle click outside
 */
export function useClickOutside<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);

  return ref;
}

/**
 * useOnScreen - Check if element is visible
 */
export function useOnScreen<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isVisible;
}

/**
 * useKeyPress - Track key press
 */
export function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetKey]);

  return keyPressed;
}

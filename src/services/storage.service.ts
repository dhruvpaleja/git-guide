/**
 * Storage Service
   * Unified interface for browser storage
 */



class StorageService {
  /**
   * Set item in localStorage
   */
  setItem<T>(key: string, value: T, useSession = false): void {
    const storage = useSession ? sessionStorage : localStorage;
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
    }
  }

  /**
   * Get item from localStorage
   */
  getItem<T>(key: string, useSession = false): T | null {
    const storage = useSession ? sessionStorage : localStorage;
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string, useSession = false): void {
    const storage = useSession ? sessionStorage : localStorage;
    try {
      storage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
    }
  }

  /**
   * Clear all storage
   */
  clear(useSession = false): void {
    const storage = useSession ? sessionStorage : localStorage;
    try {
      storage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export const storageService = new StorageService();
export default storageService;

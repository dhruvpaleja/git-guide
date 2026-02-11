/**
 * Date Helper Functions
 */

export const dateHelpers = {
  /**
   * Format date
   */
  format: (date: Date, format = 'YYYY-MM-DD'): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
    if (format === 'MM-DD-YYYY') return `${month}-${day}-${year}`;
    
    return date.toISOString();
  },

  /**
   * Get relative time
   */
  getRelativeTime: (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return dateHelpers.format(date);
  },

  /**
   * Add days to date
   */
  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
};

export default dateHelpers;

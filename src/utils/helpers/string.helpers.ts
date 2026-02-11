/**
 * String Helper Functions
 */

export const stringHelpers = {
  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert to sentence case
   */
  toSentenceCase: (str: string): string => {
    return str.replace(/([A-Z])/g, ' $1').trim();
  },

  /**
   * Truncate string
   */
  truncate: (str: string, maxLength: number): string => {
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
  },

  /**
   * URL slug formatter
   */
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Check if string is empty
   */
  isEmpty: (str?: string): boolean => {
    return !str || str.trim().length === 0;
  },
};

export default stringHelpers;

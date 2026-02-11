/**
 * Number Helper Functions
 */

export const numberHelpers = {
  /**
   * Format as currency
   */
  formatCurrency: (value: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  },

  /**
   * Format with thousand separator
   */
  formatNumber: (value: number, decimals = 0): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  /**
   * Round to decimal places
   */
  round: (value: number, decimals = 0): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * Clamp value between min and max
   */
  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },
};

export default numberHelpers;

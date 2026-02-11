/**
 * Validation Helper Functions
 */

export const validators = {
  /**
   * Validate email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate URL
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate phone
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Validate password
   */
  isValidPassword: (password: string, minLength = 8): boolean => {
    return password.length >= minLength && /[A-Z]/.test(password) && /[0-9]/.test(password);
  },

  /**
   * Validate required
   */
  isRequired: (value: string | number | undefined): boolean => {
    return value !== undefined && value !== null && String(value).trim().length > 0;
  },
};

export default validators;

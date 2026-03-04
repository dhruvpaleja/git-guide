/**
 * Array and Object Helper Functions
 */

export const arrayHelpers = {
  /**
   * Remove duplicates
   */
  unique: <T,>(arr: T[]): T[] => {
    return [...new Set(arr)];
  },

  /**
   * Group array by key
   */
  groupBy: <T extends Record<string, unknown>>(arr: T[], key: keyof T) => {
    return arr.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Flatten nested array
   */
  flatten: <T,>(arr: unknown[]): T[] => {
    const result: T[] = [];
    const flatten = (items: unknown[]) => {
      for (const item of items) {
        if (Array.isArray(item)) {
          flatten(item);
        } else {
          result.push(item as T);
        }
      }
    };
    flatten(arr);
    return result;
  },

  /**
   * Chunk array
   */
  chunk: <T,>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
};

export const objectHelpers = {
  /**
   * Merge objects deeply
   */
  deepMerge: <T extends Record<string, unknown>>(target: T, source: Partial<T>): T => {
    const result = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
          result[key] = objectHelpers.deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>) as T[Extract<keyof T, string>];
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }

    return result;
  },

  /**
   * Pick specific keys
   */
  pick: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      result[key] = obj[key];
    });
    return result;
  },

  /**
   * Omit specific keys
   */
  omit: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      const keyStr = key as string;
      if (keyStr in result) {
        const { [keyStr]: _omitted, ...rest } = result;
        Object.assign(result, rest);
      }
    });
    return result;
  },
};

export default { arrayHelpers, objectHelpers };

// Convert snake_case database fields to camelCase for GraphQL
export function toCamelCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }

  return result;
}

// Convert camelCase to snake_case for database
export function toSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = obj[key];
    }
  }

  return result;
}

// Generate URL-friendly slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Format database rows to GraphQL response format
export function formatResponse<T extends Record<string, any>>(row: T | null): Record<string, any> | null {
  if (!row) return null;
  return toCamelCase(row);
}

export function formatResponseArray<T extends Record<string, any>>(rows: T[]): Record<string, any>[] {
  return rows.map((row) => toCamelCase(row));
}

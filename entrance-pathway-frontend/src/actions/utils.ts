// Convert snake_case database fields to camelCase
export function toCamelCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }

  return result;
}

// Convert camelCase to snake_case for database
export function toSnakeCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};

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

// Format database row to response format (snake_case to camelCase)
export function formatResponse<T extends Record<string, unknown>, R = Record<string, unknown>>(row: T | null): R | null {
  if (!row) return null;
  return toCamelCase(row) as R;
}

// Format array of database rows
export function formatResponseArray<T extends Record<string, unknown>, R = Record<string, unknown>>(rows: T[]): R[] {
  return rows.map((row) => toCamelCase(row)) as R[];
}

// Action result type for consistent error handling
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Wrap async actions with error handling
export async function withErrorHandling<T>(
  action: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

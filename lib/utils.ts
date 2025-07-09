/**
 * Get environment variable with optional default value
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  
  return value;
}

/**
 * Check if environment variable exists
 */
export function hasEnvVar(key: string): boolean {
  return !!process.env[key];
}

/**
 * Get environment variable as number
 */
export function getEnvVarAsNumber(key: string, defaultValue?: number): number {
  const value = getEnvVar(key, defaultValue?.toString());
  const num = parseInt(value, 10);
  
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  
  return num;
}

/**
 * Get environment variable as boolean
 */
export function getEnvVarAsBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Combine class names utility function
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
} 
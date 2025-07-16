import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for merging class names using clsx
 * This is inspired by shadcn/ui's cn() utility
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
} 
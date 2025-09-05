import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addDays, differenceInDays } from "date-fns";

/**
 * Combine classNames with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return format(date, "d MMMM yyyy");
}

/**
 * Get the number of days between now and a target date
 */
export function daysUntil(targetDate: Date): number {
  return differenceInDays(targetDate, new Date());
}

/**
 * Calculate completion percentage
 */
export function calculatePercentage(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.round((completed / total) * 100), 100);
}

/**
 * Get color based on percentage
 */
export function getColorFromPercentage(percentage: number): string {
  if (percentage >= 80) return "bg-nhs-green";
  if (percentage >= 50) return "bg-nhs-blue";
  if (percentage >= 25) return "bg-nhs-light-blue";
  if (percentage > 0) return "bg-nhs-warm-yellow";
  return "bg-nhs-red";
}

/**
 * Get status badge variant based on completion status
 */
export function getStatusBadgeVariant(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "completed";
    case "in progress":
      return "in-progress";
    case "not started":
      return "not-started";
    case "attention needed":
      return "attention-needed";
    default:
      return "default";
  }
}

/**
 * Parse a date string to a Date object
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

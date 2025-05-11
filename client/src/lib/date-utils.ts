import { addDays, addMonths, addYears, format, isBefore, isAfter, differenceInDays, parseISO, isValid } from 'date-fns';

/**
 * Format a date as Day Month Year (e.g., 15 October 2023)
 */
export function formatDateFull(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'd MMMM yyyy');
}

/**
 * Format a date as DD/MM/YYYY
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'dd/MM/yyyy');
}

/**
 * Calculate days until a target date
 */
export function getDaysUntil(targetDate: Date | string): number {
  const dateObj = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  if (!isValid(dateObj)) return 0;
  return differenceInDays(dateObj, new Date());
}

/**
 * Calculate revalidation period based on expiry date
 * (NMC revalidation is every 3 years)
 */
export function calculateRevalidationPeriod(expiryDate: Date | string): { start: Date; end: Date } {
  const end = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  if (!isValid(end)) throw new Error('Invalid expiry date');
  
  // Revalidation period is 3 years
  const start = addYears(end, -3);
  
  return { start, end };
}

/**
 * Check if a date is within the revalidation period
 */
export function isWithinRevalidationPeriod(date: Date | string, revalidationPeriod: { start: Date; end: Date }): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  
  return (
    (isAfter(dateObj, revalidationPeriod.start) || dateObj.getTime() === revalidationPeriod.start.getTime()) && 
    (isBefore(dateObj, revalidationPeriod.end) || dateObj.getTime() === revalidationPeriod.end.getTime())
  );
}

/**
 * Get a formatted date range string
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(start) || !isValid(end)) return 'Invalid date range';
  
  return `${formatDateShort(start)} - ${formatDateShort(end)}`;
}

/**
 * Get a human-readable time period
 * (e.g., "3 months", "1 year", "5 days")
 */
export function getHumanReadablePeriod(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(start) || !isValid(end)) return 'Invalid period';
  
  const days = differenceInDays(end, start);
  
  if (days < 0) return 'Invalid period';
  if (days === 0) return 'Same day';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week';
  if (weeks < 4) return `${weeks} weeks`;
  
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  
  const years = Math.floor(days / 365);
  if (years === 1) return '1 year';
  return `${years} years`;
}

/**
 * Get notification timing based on UK revalidation rules
 */
export function getRevalidationNotificationPhase(daysRemaining: number): 'urgent' | 'warning' | 'notice' | 'ok' {
  if (daysRemaining <= 30) return 'urgent';     // Last 30 days
  if (daysRemaining <= 60) return 'warning';    // Last 60 days
  if (daysRemaining <= 90) return 'notice';     // Last 90 days
  return 'ok';                                  // More than 90 days
}

/**
 * Format a date as YYYY-MM-DD for input fields
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Safely convert any date representation to a Date object
 */
export function toDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) return dateInput;
  try {
    const date = parseISO(dateInput);
    return isValid(date) ? date : new Date();
  } catch (error) {
    return new Date();
  }
}

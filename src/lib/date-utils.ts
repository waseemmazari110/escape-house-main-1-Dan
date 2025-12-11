/**
 * UK Date & Time Formatting Utilities
 * Global Rules:
 * - Dates: DD/MM/YYYY
 * - DateTime: DD/MM/YYYY HH:mm:ss (24-hour format)
 * - Timezone: Europe/London
 */

// UK Timezone constant
export const UK_TIMEZONE = 'Europe/London';

/**
 * Get current date/time in UK timezone as formatted string
 * @returns DD/MM/YYYY HH:mm:ss
 */
export function nowUKFormatted(): string {
  return formatDateTimeUK(new Date());
}

/**
 * Get current date in UK timezone as formatted string
 * @returns DD/MM/YYYY
 */
export function todayUKFormatted(): string {
  return formatDateUKLong(new Date());
}

/**
 * Format date to UK short format: DD/MM/YYYY
 */
export function formatDateUK(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date to UK long format: DD/MM/YYYY (alias for consistency)
 */
export function formatDateUKLong(date: Date | string): string {
  return formatDateUK(date);
}

/**
 * Format date and time to UK format: DD/MM/YYYY HH:mm:ss (24-hour)
 */
export function formatDateTimeUK(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const datePart = formatDateUK(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${datePart} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format time only to UK format: HH:mm:ss (24-hour)
 */
export function formatTimeUK(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format time without seconds: HH:mm (24-hour)
 */
export function formatTimeShortUK(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Convert ISO date string (YYYY-MM-DD) from database to UK format (DD/MM/YYYY)
 * Specifically for database date fields like check_in_date and check_out_date
 */
export function formatDatabaseDateToUK(isoDateString: string): string {
  if (!isoDateString) return '';
  
  // Direct string parsing for YYYY-MM-DD format
  const parts = isoDateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  // Fallback to Date object parsing
  return formatDateUKLong(isoDateString);
}

/**
 * Format date range to UK format: dd/mm/yy - dd/mm/yy
 */
export function formatDateRangeUK(from: Date | string, to: Date | string): string {
  return `${formatDateUK(from)} - ${formatDateUK(to)}`;
}

/**
 * Format date with month name: dd Month yyyy (e.g., 27 November 2025)
 */
export function formatDateWithMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
}

/**
 * Format date for month and year only: Month yyyy
 */
export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', { 
    month: 'long', 
    year: 'numeric' 
  });
}

/**
 * Add days to a date and return UK formatted string
 * @param date Base date
 * @param days Number of days to add
 * @returns DD/MM/YYYY formatted date
 */
export function addDaysUK(date: Date | string, days: number): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return formatDateUK(result);
}

/**
 * Add months to a date and return UK formatted string
 * @param date Base date
 * @param months Number of months to add
 * @returns DD/MM/YYYY formatted date
 */
export function addMonthsUK(date: Date | string, months: number): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(d);
  result.setMonth(result.getMonth() + months);
  return formatDateUK(result);
}

/**
 * Add years to a date and return UK formatted string
 * @param date Base date
 * @param years Number of years to add
 * @returns DD/MM/YYYY formatted date
 */
export function addYearsUK(date: Date | string, years: number): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(d);
  result.setFullYear(result.getFullYear() + years);
  return formatDateUK(result);
}

/**
 * Calculate next billing date based on interval
 * @param currentDate Current billing date
 * @param interval 'month' or 'year'
 * @param intervalCount Number of intervals
 * @returns DD/MM/YYYY formatted next billing date
 */
export function calculateNextBillingDate(
  currentDate: Date | string,
  interval: 'month' | 'year',
  intervalCount: number = 1
): string {
  if (interval === 'month') {
    return addMonthsUK(currentDate, intervalCount);
  } else {
    return addYearsUK(currentDate, intervalCount);
  }
}

/**
 * Get days between two dates
 */
export function getDaysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}
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
 * Get current date/time in UK timezone
 */
export function nowUK(): Date {
  return new Date(new Date().toLocaleString('en-GB', { timeZone: UK_TIMEZONE }));
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
/**
 * Formats a number as currency with standard U.S. money formatting
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$123.45")
 */
import dayjs from "dayjs";

export function formatCurrency(value: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    // Fallback for invalid currency codes or other errors
    console.warn(`Failed to format currency with ${currency}, falling back to USD`, error);
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      // Final fallback: manual formatting
      return `$${value.toFixed(2)}`;
    }
  }
}

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
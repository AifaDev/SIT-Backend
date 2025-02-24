// src/utils/dateUtils.js

/**
 * An array of month names for reference.
 */
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Returns the 0-based index of a given month name.
 * If not found, returns -1.
 * For example, getMonthIndex('March') -> 2
 */
export function getMonthIndex(monthName) {
  return MONTHS.indexOf(monthName);
}

/**
 *
 * Converts "MonthName Year" (e.g. "March 2023") into a sortable integer, YYYYMM.
 * Example: "March 2023" -> 202303
 */
export function parseMonthYearString(dateString) {
  // Expected format: "MonthName Year"
  // e.g.: "March 2023"
  const [monthName, yearString] = dateString.split(" ");

  const year = parseInt(yearString, 10);
  const monthIndex = getMonthIndex(monthName); // 0-based
  if (isNaN(year) || monthIndex < 0) {
    // Return 0 or throw an error if the date string is invalid
    console.warn(
      `Invalid dateString: "${dateString}". Format should be "Month Year".`
    );
    return 0;
  }

  // Convert monthIndex to 1-based for final calculation (1–12)
  const month = monthIndex + 1;

  return year * 100 + month; // e.g., 2023*100 + 3 = 202303
}

/**
 * (Optional) If you also want a function that returns "January" from a 1–12 monthNumber:
 */
export function getMonthName(monthNumber) {
  return MONTHS[monthNumber - 1] || null;
}

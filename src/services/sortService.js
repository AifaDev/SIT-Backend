// src/services/sortService.js (example file location)
import { parseMonthYearString } from "../utils/dateUtils.js";

/**
 * Sorts indices by the 'latest rank date' descending (newest first).
 */
export function sortIndicesByLatestRankDate(data) {
  // Create a deep copy (to avoid mutating the original array)
  const copiedData = data.map((item) => {
    // parseMonthYearString now returns [year, month]
    const [year, month] = parseMonthYearString(item.ranks[0].date) || [0, 0];

    // Convert year/month to a sortable integer.
    // Example: 2024 year & 11 month => 202411
    const sortableDate = year * 100 + month;

    return {
      ...item,
      sortableDate,
    };
  });

  // Sort descending by the sortableDate (larger = more recent)
  copiedData.sort((a, b) => b.sortableDate - a.sortableDate);

  // Clean up the temporary 'sortableDate' property before returning
  return copiedData.map(({ sortableDate, ...rest }) => rest);
}

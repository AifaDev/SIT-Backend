// src/services/sortService.js (example file location)
import { parseMonthYearString } from "../utils/dateUtils.js";

/**
 * Sorts indices by the 'latest rank date' descending (newest first).
 */
export function sortIndicesByLatestRankDate(data) {
  // Create a deep copy (to avoid mutating the original array)
  const copiedData = data.map((item) => ({
    ...item,
    // Convert the first rank's date into a sortable integer
    sortableDate: parseMonthYearString(item.ranks[0].date),
  }));

  // Sort descending by the sortableDate
  copiedData.sort((a, b) => b.sortableDate - a.sortableDate);

  // Clean up the temporary 'sortableDate' property before returning
  return copiedData.map(({ sortableDate, ...rest }) => rest);
}

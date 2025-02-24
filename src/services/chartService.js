// getReleases.js

import { parseMonthYearString } from "../utils/dateUtils.js";
// import or define calculateReleaseWindow below

/**
 * Given an array of index objects (each with `ranks` containing { date } strings),
 * returns an array of { name, period }.
 *   - period is a "startMonth-endMonth" (e.g. "4-9") derived from a Q2-Q3 style range
 */
export function calculateReleaseCycle(data) {
  if (data.length < 2) return null; // Not enough data to determine a cycle

  // Extract years and calculate differences between consecutive years
  const yearDifferences = data.slice(1).map((current, index) => {
    const previous = data[index];
    return current.year - previous.year;
  });

  // Consider the latest 3 or 4 differences (if available)
  const recentDifferences = yearDifferences.slice(-4);

  // Create a frequency map to find the most common difference
  const frequencyMap = recentDifferences.reduce((acc, diff) => {
    acc[diff] = (acc[diff] || 0) + 1;
    return acc;
  }, {});

  // Find the most common difference (mode)
  const mostCommonCycle = Object.keys(frequencyMap).reduce((a, b) =>
    frequencyMap[a] > frequencyMap[b] ? a : b
  );

  const cycleYears = parseInt(mostCommonCycle, 10);
  if (cycleYears === 1) {
    return "Annually";
  } else if (cycleYears === 2) {
    return "Every two years";
  } else if (cycleYears === 3) {
    return "Every three years";
  } else {
    return "Inconsistent";
  }
}
export function calculateReleaseWindow(data) {
  if (data.length < 2) return null; // Not enough data to determine a release window

  // Calculate the release cycle using the calculateReleaseCycle function
  const releaseCycle = calculateReleaseCycle(data);
  if (!releaseCycle) return null;

  // Determine the quarters for the latest releases
  const quarters = data.map((item) => Math.ceil(item.month / 3));
  const uniqueQuarters = [...new Set(quarters)].sort((a, b) => a - b);

  // Determine the quarter range (single or multiple quarters)
  let quarterRange;
  if (uniqueQuarters.length === 1) {
    quarterRange = `Q${uniqueQuarters[0]}`;
  } else if (uniqueQuarters.length > 1) {
    // Make sure we only show the distinct quarters in the range without skipping quarters unnecessarily
    quarterRange = `Q${Math.min(...uniqueQuarters)}-Q${Math.max(
      ...uniqueQuarters
    )}`;
  }

  // Calculate the next release year based on the release cycle and latest year
  const latestYear = data[data.length - 1].year;
  let nextReleaseYear;

  if (releaseCycle === "Annually") {
    nextReleaseYear = latestYear + 1;
  } else if (releaseCycle === "Every two years") {
    nextReleaseYear = latestYear + 2;
  } else if (releaseCycle === "Every three years") {
    nextReleaseYear = latestYear + 3;
  } else {
    return "Inconsistent release cycle";
  }

  // Return the expected release window
  return `${nextReleaseYear} ${quarterRange}`;
}
export function getReleases(indicesData) {
  const names = [];
  const periods = [];

  indicesData.forEach((index) => {
    // Filter out "unknown" ranks
    const validRanks = index.ranks.filter(
      (rank) => !rank.date.includes("unknown")
    );

    if (validRanks.length < 2) return; // Skip if not enough valid data

    // Transform each rank date => { year, month } using parseMonthYearString
    const ranksData = validRanks
      .map((rank) => {
        // parseMonthYearString("March 2025") -> 202503
        const dateNumber = parseMonthYearString(rank.date);
        if (!dateNumber) {
          // means invalid or unparseable date => skip
          return null;
        }
        const year = Math.floor(dateNumber / 100); // e.g. 2025
        const month = dateNumber % 100; // e.g. 3 (March)

        return { year, month };
      })
      .filter(Boolean);

    // If all ranks were invalid, skip
    if (ranksData.length < 2) return;

    // Pass reversed array to your function that returns something like "2025 Q2-Q4"
    const releaseWindow = calculateReleaseWindow(ranksData.reverse());
    if (!releaseWindow) {
      console.error(`Invalid releaseWindow for ${index.name}:`, releaseWindow);
      return;
    }

    // releaseWindow should look like "2025 Q2-Q4"
    const [year, quarterRange] = releaseWindow.split(" ");
    if (!quarterRange) return; // no quarter found

    // quarterRange might be "Q2-Q4", "Q3", etc.
    const [startQStr, endQStr] = quarterRange.split("-");
    // e.g., startQStr = "Q2", endQStr = "Q4"

    // Parse the start quarter integer
    const startQuarter = parseInt(startQStr.replace("Q", ""), 10);
    if (isNaN(startQuarter)) {
      console.error(`Invalid startQuarter for ${index.name}:`, quarterRange);
      return;
    }

    // Parse or default endQuarter
    let endQuarter = startQuarter;
    if (endQStr) {
      const parsedEndQ = parseInt(endQStr.replace("Q", ""), 10);
      if (!isNaN(parsedEndQ)) {
        endQuarter = parsedEndQ;
      }
    }

    // Convert quarter -> month range
    // Q1 => months 1–3, Q2 => months 4–6, etc.
    const startMonth = (startQuarter - 1) * 3 + 1; // Q2 => 4
    const endMonth = endQuarter * 3; // Q4 => 12

    names.push(index.name);
    periods.push(`${startMonth}-${endMonth}`);
  });

  // Combine into final array
  return names.map((name, i) => ({
    name,
    period: periods[i],
  }));
}

import { MOCK_NOW } from "./reports";

const counts = [3, 5, 4, 6, 2, 7, 8, 5, 4, 6, 9, 7, 5, 3, 6, 8, 10, 7, 6, 5, 9, 11, 8, 7, 6, 10, 12, 9, 8, 11];

export const mockTrend = counts.map((count, i) => {
  const d = new Date(MOCK_NOW - (29 - i) * 86400_000);
  return { date: d.toISOString().slice(0, 10), count };
});

export const MOCK_TOTAL_REPORTS_BASELINE = 1200;

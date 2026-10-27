/** 1371 → "1,371" */
export const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-US");

/** Amount in millions → "338.30" billions */
export const millionsToBillions = (m: number | undefined) =>
  ((m ?? 0) / 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Share of total in %, safe for 0 */
export const percent = (part: number | undefined, total: number | undefined) =>
  total ? ((part ?? 0) / total) * 100 : 0;

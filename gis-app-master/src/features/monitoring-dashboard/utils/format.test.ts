import { describe, expect, it } from "vitest";
import { fmt, millionsToBillions, percent } from "./format";

describe("fmt", () => {
  it("adds thousands separators", () => {
    expect(fmt(1371)).toBe("1,371");
    expect(fmt(1234567)).toBe("1,234,567");
  });

  it("shows 0 for a missing value", () => {
    expect(fmt(undefined)).toBe("0");
  });
});

describe("millionsToBillions", () => {
  it("converts millions to billions with two decimals", () => {
    expect(millionsToBillions(338300)).toBe("338.30");
    expect(millionsToBillions(1500)).toBe("1.50");
  });

  it("separates thousands of billions", () => {
    expect(millionsToBillions(1234567)).toBe("1,234.57");
  });

  it("shows 0.00 for a missing value", () => {
    expect(millionsToBillions(undefined)).toBe("0.00");
  });
});

describe("percent", () => {
  it("returns the share of the total", () => {
    expect(percent(25, 200)).toBe(12.5);
  });

  it("returns 0 when the total is 0 or missing", () => {
    expect(percent(5, 0)).toBe(0);
    expect(percent(5, undefined)).toBe(0);
  });

  it("treats a missing part as 0", () => {
    expect(percent(undefined, 50)).toBe(0);
  });
});

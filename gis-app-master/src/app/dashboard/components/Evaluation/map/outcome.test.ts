import { describe, expect, it } from "vitest";
import { DistrictList } from "../types";
import { districtOutcome, OUTCOME_COLOR, outcomePins } from "./outcome";

const district = (over: Partial<DistrictList>) =>
  ({
    id: 1,
    districtName: "Lahore",
    divisionName: "Lahore",
    latitude: "31.5",
    longitude: "74.3",
    successful: 0,
    partiallySuccessful: 0,
    notSuccessful: 0,
    ...over,
  }) as DistrictList;

describe("evaluation map pins", () => {
  it("takes the district's worst result", () => {
    expect(districtOutcome(district({ successful: 3, partiallySuccessful: 2, notSuccessful: 1 }))).toBe("notSuccessful");
    expect(districtOutcome(district({ successful: 3, partiallySuccessful: 2 }))).toBe("partial");
    expect(districtOutcome(district({ successful: 3 }))).toBe("successful");
    expect(districtOutcome(district({}))).toBeUndefined();
  });

  it("leaves out districts with no result or no location", () => {
    const pins = outcomePins([
      district({ id: 1, successful: 1 }),
      district({ id: 2 }),
      district({ id: 3, notSuccessful: 1, latitude: "" }),
    ]);
    expect(pins.map((p) => [p.key, p.color])).toEqual([["d1", OUTCOME_COLOR.successful]]);
  });
});

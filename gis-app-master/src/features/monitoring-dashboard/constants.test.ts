import { describe, expect, it } from "vitest";
import {
  adpFilters,
  cmInitiativeFilters,
  oldCmInitiativeFilters,
  pastYearCmInitiativeFilters,
} from "@/app/dashboard/filters";
import { buildFilters, COST_SLABS, PROGRAM_LABEL, PUNJAB_BOUNDS } from "./constants";
import { FilterData } from "./types";

const year = (filterValues: string): FilterData => ({ filterIdentifier: "Year", filterValues });
const district: FilterData = { filterIdentifier: "District", filterValues: "Lahore" };

describe("buildFilters", () => {
  it("uses the ADP filters for the ADP programme, whatever the year", () => {
    expect(buildFilters("adp", [year("2020-2021"), district])).toEqual([
      ...adpFilters,
      year("2020-2021"),
      district,
    ]);
  });

  it("uses the current CM filters when no year is chosen", () => {
    expect(buildFilters("cmInitiative", [district])).toEqual([...cmInitiativeFilters, district]);
  });

  it("uses the current CM filters for 2026-2027", () => {
    const other = [year("2026-2027")];
    expect(buildFilters("cmInitiative", other)).toEqual([...cmInitiativeFilters, ...other]);
  });

  it.each(["2024-2025", "2025-2026"])("uses the past-year CM filters for %s", (y) => {
    const other = [year(y)];
    expect(buildFilters("cmInitiative", other)).toEqual([...pastYearCmInitiativeFilters, ...other]);
  });

  it("uses the old CM filters for earlier years", () => {
    const other = [year("2022-2023")];
    expect(buildFilters("cmInitiative", other)).toEqual([...oldCmInitiativeFilters, ...other]);
  });

  it("does not change the filters it is given", () => {
    const other = [district];
    buildFilters("cmInitiative", other);
    expect(other).toEqual([district]);
  });
});

describe("COST_SLABS", () => {
  it("has the five slabs in order", () => {
    expect(COST_SLABS.map((s) => s.code)).toEqual(["DDC", "DDWP", "DDSC", "PDWP", "CDWP"]);
  });

  it("reads the 10 billion slab from a100above", () => {
    const top = COST_SLABS.find((s) => s.code === "CDWP");
    expect(top?.field).toBe("a100above");
    expect(top?.status).toBe("1001Above");
  });

  it("gives every slab its own modal id", () => {
    const ids = COST_SLABS.map((s) => s.modalId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("other constants", () => {
  it("labels both programmes", () => {
    expect(PROGRAM_LABEL).toEqual({ cmInitiative: "CM Initiatives", adp: "ADP Projects" });
  });

  it("keeps the map bounds south-west before north-east", () => {
    const [[south, west], [north, east]] = PUNJAB_BOUNDS;
    expect(south).toBeLessThan(north);
    expect(west).toBeLessThan(east);
  });
});

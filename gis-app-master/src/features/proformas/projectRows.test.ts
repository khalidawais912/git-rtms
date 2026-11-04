import { describe, expect, it } from "vitest";
import type { ProjectsList } from "@/app/dashboard/components/Evaluation/types";
import {
  distinct,
  EMPTY_FILTERS,
  filterRows,
  money,
  pc4Row,
  pc5Row,
  ProjectRow,
  sortRows,
  totalCost,
} from "./projectRows";

const pc4 = (over: Partial<ProjectsList>) =>
  pc4Row({
    id: 1,
    name: "BHU",
    gsNo: "2025-26/0087",
    sectorName: "Health",
    cost: 412.5,
    sponsoringAgencyName: null,
    executingAgencyName: "C&W",
    city: "Lahore",
    divisionName: "Lahore",
    districtName: "Lahore",
    isSNE: true,
    status: "Submitted",
    ...over,
  } as ProjectsList);

describe("projects table rows", () => {
  it("pc4Row reads the dashboard fields and blanks nulls", () => {
    const r = pc4({});
    expect(r).toMatchObject({ id: 1, gs: "2025-26/0087", cost: 412.5, sponsor: "", exec: "C&W", sne: true });
  });

  it("pc5Row shows the year and status name", () => {
    const r = pc5Row({ id: 9, projectName: "Job Centers", submissionNo: 2, status: 3, completedAt: "2023-06-30T00:00:00" });
    expect(r).toMatchObject({ id: 9, name: "Job Centers", year: "Year 2 of 5", status: "Referred Back" });
    expect(r.nameNote).toContain("30 Jun 2023");
  });

  it("filterRows needs every search word and exact selects", () => {
    const rows: ProjectRow[] = [pc4({ id: 1 }), pc4({ id: 2, name: "PS development", districtName: "Faisalabad" })];
    expect(filterRows(rows, { ...EMPTY_FILTERS, search: "bhu lahore" }).map((r) => r.id)).toEqual([1]);
    expect(filterRows(rows, { ...EMPTY_FILTERS, district: "Faisalabad" }).map((r) => r.id)).toEqual([2]);
  });

  it("sortRows sorts both ways and keeps blanks last", () => {
    const rows = [pc4({ id: 1, cost: 5 }), pc4({ id: 2, cost: undefined }), pc4({ id: 3, cost: 9 })];
    expect(sortRows(rows, "cost", 1).map((r) => r.id)).toEqual([1, 3, 2]);
    expect(sortRows(rows, "cost", -1).map((r) => r.id)).toEqual([3, 1, 2]);
    expect(sortRows(rows, null, 1)).toBe(rows);
  });

  it("totals, money and distinct", () => {
    const rows = [pc4({ cost: 412.5 }), pc4({ cost: 186.75, districtName: "Faisalabad" })];
    expect(money(totalCost(rows))).toBe("599.25");
    expect(distinct(rows, "district")).toEqual(["Faisalabad", "Lahore"]);
  });
});

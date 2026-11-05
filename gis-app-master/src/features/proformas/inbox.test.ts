import { describe, expect, it } from "vitest";
import { PCIV_ACTION, PcivInboxReport } from "@/features/pciv";
import { tileRowCounts } from "./inbox";

const ME = 7;
const row = (over: Partial<PcivInboxReport>) => ({ status: 2, submittedFrom: 3, submittedTo: ME, ...over }) as PcivInboxReport;

describe("tileRowCounts", () => {
  it("counts the rows the tabs show, whatever the status says", () => {
    const rows = [
      row({ lastAction: 1 }),
      row({ lastAction: 1 }),
      // DG's refer back keeps status 2, so it is a Referback row and not an Attached one
      row({ lastAction: PCIV_ACTION.REFER_BACK }),
      row({ status: 3, submittedFrom: ME, submittedTo: 3, lastAction: PCIV_ACTION.REFER_BACK }),
      row({ status: 4, submittedFrom: ME, submittedTo: 9, lastAction: 4 }),
      row({ status: 6 }),
    ];
    expect(tileRowCounts(rows, ME)).toEqual({ attached: 2, referback: 2 });
  });

  it("is zero with no rows", () => {
    expect(tileRowCounts([], ME)).toEqual({ attached: 0, referback: 0 });
  });
});

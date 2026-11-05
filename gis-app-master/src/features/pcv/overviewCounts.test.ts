import { describe, expect, it } from "vitest";
import { toPcvTileCounts } from "./overviewCounts";

describe("toPcvTileCounts", () => {
  it("puts each count on its tile", () => {
    expect(
      toPcvTileCounts({
        total: 9,
        inProcess: 1,
        submitted: 2,
        referredBack: 3,
        approvedBySecretary: 4,
        approvedByDg: 5,
        completed: 6,
        markedToEvaluation: 7,
        cancelled: 8,
      }),
    ).toEqual({ total: 9, submittedToDgme: 4, takeUp: 7 });
  });

  it("keeps a real 0, and leaves everything empty without a response", () => {
    expect(toPcvTileCounts({ markedToEvaluation: 0 }).takeUp).toBe(0);
    expect(toPcvTileCounts(null).total).toBeUndefined();
  });
});

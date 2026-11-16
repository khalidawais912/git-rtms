import { describe, expect, it } from "vitest";
import { toPcvEvaluationCounts, toPcvTileCounts } from "./overviewCounts";

const COUNTS = {
  total: 36,
  inProcess: 1,
  submitted: 2,
  referredBack: 3,
  approvedBySecretary: 4,
  approvedByDg: 5,
  completed: 6,
  markedForImpactAssessment: 7,
  cancelled: 8,
};

describe("toPcvTileCounts", () => {
  it("puts each count on its tile", () => {
    expect(toPcvTileCounts(COUNTS)).toEqual({ total: 36, submittedToDgme: 4, takeUp: 7 });
  });

  it("keeps a real 0, and leaves everything empty without a response", () => {
    expect(toPcvTileCounts({ markedForImpactAssessment: 0 }).takeUp).toBe(0);
    expect(toPcvTileCounts(null).total).toBeUndefined();
  });

  it("still reads the old markedToEvaluation name", () => {
    expect(toPcvTileCounts({ markedToEvaluation: 2 }).takeUp).toBe(2);
  });
});

describe("toPcvEvaluationCounts", () => {
  it("puts each count on its Evaluation Dashboard tile", () => {
    expect(toPcvEvaluationCounts(COUNTS)).toEqual({ submittedByDept: 2, inProgress: 9, assigned: 7, referBack: 3 });
  });

  it("leaves In Progress empty only when neither status is sent", () => {
    expect(toPcvEvaluationCounts({ approvedByDg: 4 }).inProgress).toBe(4);
    expect(toPcvEvaluationCounts(undefined)).toEqual({});
  });
});

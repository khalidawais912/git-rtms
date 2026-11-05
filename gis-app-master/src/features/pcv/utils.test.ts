import { describe, expect, it } from "vitest";
import {
  asBlockedCreate,
  blockedCreateText,
  formatPcvDate,
  isDeltaEmpty,
  isPcvEditableStatus,
  parseDelta,
  serializeDelta,
  yearLabel,
} from "./utils";

describe("PC-V utils", () => {
  it("parseDelta reads the guide's ops array", () => {
    const content =
      '[{"insert":"Planned: 100. "},{"insert":"Actual","attributes":{"bold":true}},{"insert":" result.\\n"}]';
    const ops = parseDelta(content);
    expect(ops).toHaveLength(3);
    expect(ops[1]).toEqual({ insert: "Actual", attributes: { bold: true } });
    expect(serializeDelta(ops)).toBe(content);
  });

  it("parseDelta reads { ops }, empty values and plain text", () => {
    expect(parseDelta('{"ops":[{"insert":"a\\n"}]}')).toEqual([{ insert: "a\n" }]);
    expect(parseDelta(null)).toEqual([]);
    expect(parseDelta("  ")).toEqual([]);
    expect(parseDelta("old text")).toEqual([{ insert: "old text\n" }]);
  });

  it("isDeltaEmpty is true only without text or embeds", () => {
    expect(isDeltaEmpty([])).toBe(true);
    expect(isDeltaEmpty([{ insert: "\n" }])).toBe(true);
    expect(isDeltaEmpty([{ insert: "x\n" }])).toBe(false);
    expect(isDeltaEmpty([{ insert: { image: "a.png" } }])).toBe(false);
  });

  it("formatPcvDate uses the date part only, whatever the time zone", () => {
    expect(formatPcvDate("2027-11-03T13:11:26.86")).toBe("03 Nov 2027");
    expect(formatPcvDate("2027-01-31T23:59:59")).toBe("31 Jan 2027");
    expect(formatPcvDate(null)).toBe("");
  });

  it("yearLabel and editable statuses", () => {
    expect(yearLabel(2)).toBe("Year 2 of 5");
    expect(isPcvEditableStatus(1)).toBe(true);
    expect(isPcvEditableStatus(3)).toBe(true);
    expect(isPcvEditableStatus(2)).toBe(false);
  });

  it("asBlockedCreate accepts only data with a blockedReason", () => {
    expect(asBlockedCreate(undefined)).toBeUndefined();
    expect(asBlockedCreate({ id: 0, blockedReason: null })).toBeUndefined();
    expect(asBlockedCreate({ id: 0, name: "x", submissionNo: 5, blockedReason: "allSubmissionsUsed" }))
      .toMatchObject({ blockedReason: "allSubmissionsUsed" });
  });

  it("blockedCreateText explains each reason", () => {
    const base = { id: 0, name: "PCV smoke", openPcvId: null };
    expect(
      blockedCreateText({
        ...base,
        submissionNo: 2,
        blockedReason: "notOpenYet",
        nextSubmissionOpensOn: "2027-11-03T13:11:26.86",
      }),
    ).toContain("Year 2 of 5 for this project opens on 03 Nov 2027");
    expect(blockedCreateText({ ...base, submissionNo: 5, blockedReason: "allSubmissionsUsed" })).toContain(
      "all 5 PC-Vs",
    );
    expect(blockedCreateText({ ...base, submissionNo: 1, blockedReason: "openPcv", openPcvId: 7 })).toContain(
      "Year 1 of 5",
    );
    expect(blockedCreateText({ ...base, submissionNo: 0, blockedReason: null }, "Server text")).toBe(
      "Server text",
    );
  });
});

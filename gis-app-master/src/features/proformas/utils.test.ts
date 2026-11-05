import { describe, expect, it } from "vitest";
import { PCIV_ACTION } from "@/features/pciv";
import { documentLine, PROFORMA_TABS, plural, statusText, statusTone, tabsOf } from "./utils";

const tab = (id: string) => PROFORMA_TABS.find((t) => t.id === id)!;
const ME = 7;
const REFER_BACK = PCIV_ACTION.REFER_BACK;

describe("proforma list tabs", () => {
  it("Submitted by Attached Dept. = sent to me by someone else and still open", () => {
    expect(tab("attached").match({ status: 2, submittedFrom: 3, submittedTo: ME }, ME)).toBe(true);
    expect(tab("attached").match({ status: 2, submittedFrom: 3, submittedTo: null }, ME)).toBe(true);
    expect(tab("attached").match({ status: 4, submittedFrom: ME, submittedTo: 9 }, ME)).toBe(false);
    expect(tab("attached").match({ status: 6, submittedFrom: 3, submittedTo: ME }, ME)).toBe(false);
  });

  it("Submitted To DGM&E = sent on by me, not referred back", () => {
    expect(tab("dgme").match({ status: 4, submittedFrom: ME, submittedTo: 9 }, ME)).toBe(true);
    expect(tab("dgme").match({ status: 3, submittedFrom: ME, submittedTo: 9, lastAction: REFER_BACK }, ME)).toBe(false);
    expect(tab("dgme").match({ status: 8, submittedFrom: ME, submittedTo: 9 }, ME)).toBe(false);
  });

  it("the newest refer back splits the two Refer Back tabs, whatever the status", () => {
    const byDgme = { status: 2, submittedFrom: 9, submittedTo: ME, lastAction: REFER_BACK };
    const toDept = { status: 3, submittedFrom: ME, submittedTo: 3, lastAction: REFER_BACK };
    expect(tab("referbackByDgme").match(byDgme, ME)).toBe(true);
    expect(tab("referbackToDept").match(byDgme, ME)).toBe(false);
    expect(tab("attached").match(byDgme, ME)).toBe(false);
    expect(tab("referbackToDept").match(toDept, ME)).toBe(true);
    expect(tab("referbackByDgme").match(toDept, ME)).toBe(false);
    expect(tab("dgme").match(toDept, ME)).toBe(false);
  });

  it("each list has its own tabs", () => {
    expect(tabsOf("main").map((t) => t.id)).toEqual(["attached", "dgme", "completed", "cancelled"]);
    expect(tabsOf("referback").map((t) => t.id)).toEqual(["referbackByDgme", "referbackToDept", "completed", "cancelled"]);
  });

  it("each role sees its own tabs, named as on its PC-IV list", () => {
    const labels = (role?: string) => tabsOf("main", role).map((t) => t.label);
    expect(labels("department head")).toEqual([
      "Submitted by (Administrative Department)",
      "Mark To (Director)",
      "Referback To (Department)",
      "Referback By (D)",
    ]);
    expect(labels("director")[0]).toBe("Mark By (DG)");
    expect(labels("deputy director")[1]).toBe("Assigned To (AD)");
    expect(labels("users")).toEqual(["In Progress", "Sent by Me", "Completed", "Cancelled"]);
    expect(labels("administrative secretary")[0]).toBe("Submitted by Attached Dept.");
    expect(labels()[0]).toBe("Submitted by Attached Dept.");
  });

  it("a DG's tab keeps the rows of the step, under its own name", () => {
    const received = tabsOf("main", "department head")[0];
    expect(received.match({ status: 4, submittedFrom: 3, submittedTo: ME, lastAction: 4 }, ME)).toBe(true);
    expect(received.match({ status: 4, submittedFrom: 3, submittedTo: ME, lastAction: REFER_BACK }, ME)).toBe(false);
  });

  it("Completed and Cancelled follow the status", () => {
    expect(tab("completed").match({ status: 6, submittedFrom: 1, submittedTo: 2 }, ME)).toBe(true);
    expect(tab("completed").match({ status: 7, submittedFrom: 1, submittedTo: 2 }, ME)).toBe(true);
    expect(tab("cancelled").match({ status: 8, submittedFrom: 1, submittedTo: 2 }, ME)).toBe(true);
  });
});

describe("proforma helpers", () => {
  it("statusText prefers the server's name", () => {
    expect(statusText({ status: 2, statusName: "Pending with Secretary" })).toBe("Pending with Secretary");
    expect(statusText({ status: 3 })).toBe("Referred Back");
  });

  it("statusTone and plural", () => {
    expect(statusTone(6)).toBe("ok");
    expect(statusTone(2)).toBe("wait");
    expect(statusTone(8)).toBe("no");
    expect(plural(1)).toBe("1 proforma");
    expect(plural(4)).toBe("4 proformas");
  });
});

describe("documentLine", () => {
  it("joins type, size and upload date", () => {
    expect(
      documentLine({ name: "PC-I", path: "/up/pc1.pdf", sizeBytes: 2.4 * 1024 * 1024, uploadedAt: "2026-11-02T10:00:00" }),
    ).toBe("PDF · 2.4 MB · Uploaded 02 Nov 2026");
    expect(documentLine({ name: "x", path: "/up/a.docx", sizeBytes: 800 })).toBe("DOCX · 1 KB");
  });
});

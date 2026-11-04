import { describe, expect, it } from "vitest";
import { documentLine, PROFORMA_TABS, plural, statusText, statusTone } from "./utils";

const tab = (id: string) => PROFORMA_TABS.find((t) => t.id === id)!;
const ME = 7;

describe("proforma list tabs", () => {
  it("In Progress = sent to me by someone else and still open", () => {
    expect(tab("inprogress").match({ status: 2, submittedFrom: 3, submittedTo: ME }, ME)).toBe(true);
    expect(tab("inprogress").match({ status: 2, submittedFrom: 3, submittedTo: null }, ME)).toBe(true);
    expect(tab("inprogress").match({ status: 4, submittedFrom: ME, submittedTo: 9 }, ME)).toBe(false);
    expect(tab("inprogress").match({ status: 6, submittedFrom: 3, submittedTo: ME }, ME)).toBe(false);
  });

  it("Sent by Me = open and no longer with me", () => {
    expect(tab("sent").match({ status: 4, submittedFrom: ME, submittedTo: 9 }, ME)).toBe(true);
    expect(tab("sent").match({ status: 8, submittedFrom: ME, submittedTo: 9 }, ME)).toBe(false);
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

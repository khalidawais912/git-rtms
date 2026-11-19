import { describe, expect, it } from "vitest";
import { APPROVED, REFERBACK, SUBMITTED } from "@/constants/statuses";
import { annexFiles, fileKind, issuedFiles, issuedFromApi, issuedName, nextStatus, videoFiles, visitDocuments } from "./reportFiles";

const groups = [
  { name: "Main", attributes: [{ label: "Photo", values: [{ id: 1, value: "x", verificatioContentPath: "/upload/a.jpg" }] }] },
  {
    name: "Annexures",
    attributes: [
      { label: "Annex", values: [{ id: 7, value: "Page 13 of PC-I", verificatioContentPath: "/upload/m_315.jpg" }] },
      { label: "Annex", values: [{ id: 8, value: "", verificatioContentPath: "" }] },
      { label: "Annex", values: [] },
    ],
  },
  {
    name: "Videos (Drone, Mobile ,etc)",
    attributes: [
      { label: "Video", values: [{ id: 9, value: "Project Video", verificatioContentPath: "" }] },
      { label: "Video", values: [{ id: 10, value: "", verificatioContentPath: "/upload/v.mp4" }] },
    ],
  },
];

describe("report files", () => {
  it("annexFiles keeps only uploaded annexes, named by what was typed", () => {
    expect(annexFiles(groups)).toEqual([
      { id: "annex-7", name: "Page 13 of PC-I", path: "/upload/m_315.jpg", note: "m_315.jpg" },
    ]);
    expect(annexFiles(undefined)).toEqual([]);
  });

  it("videoFiles falls back to the label when nothing was typed", () => {
    expect(videoFiles(groups)).toEqual([{ id: "video-10", name: "Video", path: "/upload/v.mp4", note: "v.mp4" }]);
  });

  it("issuedFiles drops blanks, repeats and the report on screen", () => {
    const files = issuedFiles(
      [
        { reportPath: "/upload/2026-2027/Jul/DGME/MR_1523.pdf" },
        { reportPath: "" },
        { reportPath: "/upload/2026-2027/Jul/DGME/MR_1523.pdf" },
        { reportPath: "/upload/now.pdf" },
        { reportPath: "/upload/ProjectId_301/MR_90.pdf" },
      ],
      "/upload/now.pdf",
    );
    expect(files.map((f) => f.name)).toEqual(["Issued Report · Jul 2026", "Issued Report 2"]);
  });

  it("issuedFromApi reads the issued-reports API in its usual shapes", () => {
    const rows = [
      { id: 5, reportPath: "/upload/2026-2027/Jul/a.pdf", issuanceDate: "2026-07-20T10:00:00" },
      { id: 6, pdfPath: "/upload/b.pdf", title: "Third quarter report" },
      { id: 7, reportPath: "" },
      { id: 8, reportPath: "/upload/now.pdf" },
    ];
    const files = issuedFromApi({ data: rows }, "/upload/now.pdf");
    expect(files.map((f) => [f.name, f.path])).toEqual([
      ["Issued Report · Jul 2026", "/upload/2026-2027/Jul/a.pdf"],
      ["Third quarter report", "/upload/b.pdf"],
    ]);
    expect(files[0].note).toBe("Issued 20 Jul 2026 · a.pdf");
    expect(issuedFromApi({ data: { reports: rows } }).length).toBe(3);
    expect(issuedFromApi(rows).length).toBe(3);
    expect(issuedFromApi({ data: [] })).toEqual([]);
    expect(issuedFromApi(null)).toEqual([]);
  });

  it("visitDocuments takes the uploaded documents of the visit of the report", () => {
    const body = {
      data: {
        visits: [
          { visitId: 860, documents: [] },
          {
            visitId: 1779,
            documents: [
              { documentId: 5, name: "PC-I", filePath: "/upload/doc5.pdf", uploadedAt: "2026-11-19T11:37:38", uploadedByName: "Muhammad Salman" },
              { documentId: 6, name: "PC-II", filePath: "" },
            ],
          },
        ],
      },
    };
    expect(visitDocuments(body, 1779)).toEqual([
      { id: "doc-5", name: "PC-I", path: "/upload/doc5.pdf", note: "Uploaded 19 Nov 2026 · Muhammad Salman" },
    ]);
    expect(visitDocuments(body, 860)).toEqual([]);
    expect(visitDocuments(null, 1)).toEqual([]);
  });

  it("issuedFromApi names a row of the real API by its visit", () => {
    const body = {
      responseCode: 200,
      data: {
        issuedCount: 1,
        reports: [
          { visitId: 860, visitNumber: 2, issuedAt: "2025-07-31T21:06:25.37", officerName: "Muhammad Usman Ali", trailId: 1948, reportPath: "/upload/ProjectId_1819/MR_000_860_V1.0.pdf" },
        ],
      },
    };
    expect(issuedFromApi(body)).toEqual([
      { id: "issued-1948", name: "Issued Report · Visit 2", path: "/upload/ProjectId_1819/MR_000_860_V1.0.pdf", note: "Issued 31 Jul 2025 · Muhammad Usman Ali" },
    ]);
  });

  it("issuedName reads the month and the financial year folder", () => {
    expect(issuedName("/upload/2026-2027/Feb/x.pdf", 1)).toBe("Issued Report · Feb 2027");
    expect(issuedName("/upload/x.pdf", 3)).toBe("Issued Report 3");
  });

  it("fileKind by extension", () => {
    expect(fileKind("/a/b.PDF")).toBe("pdf");
    expect(fileKind("/a/b.jpg?t=1")).toBe("image");
    expect(fileKind("/a/b.mp4")).toBe("video");
    expect(fileKind("/a/b.docx")).toBe("other");
  });

  it("nextStatus keeps the old Report Noting rules", () => {
    expect(nextStatus("department head", SUBMITTED, false)).toBe(APPROVED);
    expect(nextStatus("department head", SUBMITTED, true)).toBe(REFERBACK);
    expect(nextStatus("director", SUBMITTED, false)).toBe(SUBMITTED);
    expect(nextStatus("director", APPROVED, false)).toBe(APPROVED);
    expect(nextStatus("deputy director", SUBMITTED, false)).toBe(SUBMITTED);
    expect(nextStatus("deputy director", REFERBACK, true)).toBe(REFERBACK);
    expect(nextStatus("deputy director", REFERBACK, false)).toBe(APPROVED);
  });
});

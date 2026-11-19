import { APPROVED, REFERBACK, SUBMITTED } from "@/constants/statuses";

/** A file shown with a report: a relevant document (annex), an issued report or a video. */
export interface ReportFile {
  id: string;
  name: string;
  path: string;
  /** A short line under the name, e.g. the file name. */
  note?: string;
  /** A file of this app (public/), not of the backend. */
  local?: boolean;
}

/** Where the browser loads a file from. */
export const fileUrl = (file: ReportFile, backendUrl: (path: string) => string) =>
  file.local ? file.path : backendUrl(file.path);

/** Shown under Videos while no video has been uploaded for the visit (a sample, for the demo). */
export const SAMPLE_VIDEOS: ReportFile[] = [
  {
    id: "video-sample",
    name: "Drone video (sample)",
    path: "/video/sample-drone.mp4",
    note: "Sample video · none uploaded for this visit yet",
    local: true,
  },
  {
    id: "video-sample-cardiology",
    name: "Nawaz Cardiology (sample)",
    path: "/video/sample-nawaz-cardiology.mp4",
    note: "Sample video · none uploaded for this visit yet",
    local: true,
  },
];

export type FileKind = "pdf" | "image" | "video" | "other";

interface AttributeValue {
  id?: number;
  value?: string | null;
  verificatioContentPath?: string | null;
}

interface Attribute {
  label?: string | null;
  values?: AttributeValue[] | null;
}

/** A group of the project form (GET /api/Projects/{id}?visitId=), with sub-groups in `group`. */
export interface ProjectGroup {
  name?: string | null;
  attributes?: Attribute[] | null;
  group?: ProjectGroup[] | null;
}

const fileName = (path: string) => path.split("/").pop() ?? path;

export const fileKind = (path: string): FileKind => {
  const ext = path.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) return "image";
  if (["mp4", "webm", "mov", "m4v", "ogg"].includes(ext)) return "video";
  return "other";
};

const attributesOf = (group: ProjectGroup): Attribute[] => [
  ...(group.attributes ?? []),
  ...(group.group ?? []).flatMap(attributesOf),
];

/** Every uploaded file in the first group whose name matches, named by what the officer typed. */
const filesOfGroup = (groups: ProjectGroup[] | undefined, match: RegExp, prefix: string): ReportFile[] => {
  const group = groups?.find((g) => match.test(g.name ?? ""));
  if (!group) return [];
  return attributesOf(group).flatMap((a, i) =>
    (a.values ?? [])
      .filter((v) => v.verificatioContentPath?.trim())
      .map((v, j) => ({
        id: `${prefix}-${v.id ?? `${i}-${j}`}`,
        name: v.value?.trim() || a.label?.trim() || fileName(v.verificatioContentPath!),
        path: v.verificatioContentPath!.trim(),
        note: fileName(v.verificatioContentPath!),
      })),
  );
};

/** Relevant Documents: the files under "Annexures". */
export const annexFiles = (groups?: ProjectGroup[]) => filesOfGroup(groups, /annex/i, "annex");

/** Videos: the files under "Videos (Drone, Mobile, etc)". */
export const videoFiles = (groups?: ProjectGroup[]) => filesOfGroup(groups, /video/i, "video");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "Issued Report · Jul 2026" from an upload path such as /upload/2026-2027/Jul/…/MR_000_1523_V1.3.pdf
 * (the folder is the financial year: July to December are in its first year).
 */
export const issuedName = (path: string, n: number) => {
  const m = path.match(/\/(\d{4})-(\d{4})\/([A-Za-z]{3})\//);
  const month = m ? MONTHS.findIndex((x) => x.toLowerCase() === m[3].toLowerCase()) : -1;
  if (!m || month < 0) return `Issued Report ${n}`;
  return `Issued Report · ${MONTHS[month]} ${month >= 6 ? m[1] : m[2]}`;
};

/** Issued Reports: the project's earlier issued reports (GET /api/SingleProjectDashboard → reports), not this one. */
export const issuedFiles = (reports: { reportPath?: string | null }[] | undefined, currentPath?: string) =>
  (reports ?? [])
    .map((r) => r.reportPath?.trim() ?? "")
    .filter((p, i, all) => p && p !== currentPath && all.indexOf(p) === i)
    .map((path, i) => ({ id: `issued-${i}`, name: issuedName(path, i + 1), path, note: fileName(path) }));

/**
 * The status a comment saves, by role, the report's status and the Referback tick.
 * Kept exactly as the old Report Noting screen worked out (the last fallback is Approved).
 */
export const nextStatus = (role: string, status: number, isReferback: boolean) => {
  if (role === "deputy director" && status === SUBMITTED && !isReferback) return SUBMITTED;
  if (role === "deputy director" && status === SUBMITTED && isReferback) return REFERBACK;
  if (role === "deputy director" && status === APPROVED) return APPROVED;
  if (role === "director" && status === SUBMITTED && !isReferback) return SUBMITTED;
  if (role === "director" && status === SUBMITTED && isReferback) return REFERBACK;
  if (role === "director" && status === REFERBACK && isReferback) return REFERBACK;
  if (role === "director" && status === APPROVED) return APPROVED;
  if (role === "department head" && status === SUBMITTED && !isReferback) return APPROVED;
  if (role === "department head" && status === SUBMITTED && isReferback) return REFERBACK;
  if (role === "deputy director" && status === REFERBACK && isReferback) return REFERBACK;
  if (role === "deputy director" && isReferback) return REFERBACK;
  if (role === "director" && isReferback) return REFERBACK;
  return APPROVED;
};

type Row = Record<string, unknown>;

const firstText = (row: Row, keys: string[]) => {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
};

const shortDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

/** "21 Apr 2025, 3:42 PM"; only the date when the value has no time. */
const dateTime = (value: string) => {
  const day = shortDate(value);
  if (!day || !/T\d{2}:\d{2}/.test(value)) return day;
  const d = new Date(value);
  const h = d.getHours();
  return `${day}, ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/**
 * Issued Reports from GET /api/monitoring/projects/{projectId}/issued-reports.
 * Reads the list from `data.reports` (or an array / `data.items`) and each PDF from reportPath (or
 * pdfPath / filePath / path): "Issued Report · Visit 2", under it "Issued 31 Jul 2025 · officer".
 * Rows without a PDF and the report on screen are left out.
 */
export const issuedFromApi = (body: unknown, currentPath?: string): ReportFile[] => {
  const data = (body as { data?: unknown } | null)?.data ?? body;
  const list = Array.isArray(data)
    ? data
    : ((data as { reports?: unknown; items?: unknown } | null)?.reports ??
      (data as { items?: unknown } | null)?.items);
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  return (list as Row[]).flatMap((row, i) => {
    const path = firstText(row, ["reportPath", "pdfPath", "filePath", "path"]);
    if (!path || path === currentPath || seen.has(path)) return [];
    seen.add(path);
    const issuedOn = firstText(row, ["issuedAt", "issuanceDate", "issueDate", "issuedDate", "issuedOn"]);
    const visit = typeof row.visitNumber === "number" ? `Issued Report · Visit ${row.visitNumber}` : "";
    return [
      {
        id: `issued-${row.trailId ?? row.id ?? i}`,
        name: firstText(row, ["title", "name", "reportName"]) || visit || issuedName(path, seen.size),
        path,
        note: [issuedOn && `Issued ${dateTime(issuedOn)}`, firstText(row, ["officerName"]) || fileName(path)]
          .filter(Boolean)
          .join(" · "),
      },
    ];
  });
};

interface VisitDocument {
  documentId?: number;
  name?: string | null;
  filePath?: string | null;
  uploadedAt?: string | null;
  uploadedByName?: string | null;
}

/**
 * Relevant Documents of one visit, from GET /api/monitoring/projects/{projectId}/documents/history
 * (data.visits[].documents); only uploaded files, named as uploaded.
 */
export const visitDocuments = (body: unknown, visitId: number): ReportFile[] => {
  const visits = (body as { data?: { visits?: { visitId?: number; documents?: VisitDocument[] }[] } } | null)?.data
    ?.visits;
  const docs = visits?.find((v) => v.visitId === visitId)?.documents ?? [];
  return docs
    .filter((d) => d.filePath?.trim())
    .map((d, i) => ({
      id: `doc-${d.documentId ?? i}`,
      name: d.name?.trim() || fileName(d.filePath!),
      path: d.filePath!.trim(),
      note:
        [d.uploadedAt && `Uploaded ${shortDate(d.uploadedAt)}`, d.uploadedByName?.trim()].filter(Boolean).join(" · ") ||
        fileName(d.filePath!),
    }));
};

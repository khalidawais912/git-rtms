import { APPROVED, REFERBACK, SUBMITTED } from "@/constants/statuses";

/** A file shown with a report: a relevant document (annex), an issued report or a video. */
export interface ReportFile {
  id: string;
  name: string;
  path: string;
  /** A short line under the name, e.g. the file name. */
  note?: string;
}

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

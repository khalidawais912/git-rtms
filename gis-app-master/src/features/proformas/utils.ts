import {
  isPendingWithUser,
  isReferredBack,
  isSentByUser,
  PCIV_STATUS,
  PCIV_STATUS_NAME,
  PcivInboxRow,
} from "@/features/pciv";

/** "Mon, 02 Nov 2026" */
export const formatDate = (value?: string | null) =>
  value
    ? new Date(value)
        .toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
        .replace(/^(\w+) /, "$1, ")
    : "";

/** "03:10 PM" */
export const formatTime = (value?: string | null) =>
  value ? new Date(value).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "";

/** "Mon, 02 Nov 2026 (03:10 PM)" */
export const formatDateTime = (value?: string | null) =>
  value ? `${formatDate(value)} (${formatTime(value)})` : "–";

export type ProformaTabId =
  | "attached"
  | "dgme"
  | "referbackByDgme"
  | "referbackToDept"
  | "inprogress"
  | "sent"
  | "completed"
  | "cancelled";

/** Which set of tabs the list shows: the Referback tile has its own. */
export type ProformaListId = "main" | "referback";

interface TabDefinition {
  id: ProformaTabId;
  label: string;
  match: (row: PcivInboxRow, userId: number) => boolean;
}

/**
 * Submitted and referred-back proformas can share a status, so the newest history action
 * (`lastAction`, loaded by the list) tells them apart.
 */
export const PROFORMA_TABS: TabDefinition[] = [
  {
    id: "attached",
    label: "Submitted by Attached Dept.",
    match: (r, userId) => isPendingWithUser(r, userId) && !isReferredBack(r),
  },
  {
    id: "dgme",
    label: "Submitted To DGM&E",
    match: (r, userId) => isSentByUser(r, userId) && !isReferredBack(r),
  },
  {
    id: "referbackByDgme",
    label: "Refer Back by DGM&E",
    match: (r, userId) => isPendingWithUser(r, userId) && isReferredBack(r),
  },
  {
    id: "referbackToDept",
    label: "Refer Back to Attached Department",
    match: (r, userId) => isSentByUser(r, userId) && isReferredBack(r),
  },
  { id: "inprogress", label: "In Progress", match: isPendingWithUser },
  { id: "sent", label: "Sent by Me", match: isSentByUser },
  {
    id: "completed",
    label: "Completed",
    match: (r) => r.status === PCIV_STATUS.COMPLETED || r.status === PCIV_STATUS.MARKED_TO_EVALUATION,
  },
  { id: "cancelled", label: "Cancelled", match: (r) => r.status === PCIV_STATUS.CANCELLED },
];

const LIST_TABS: Record<ProformaListId, ProformaTabId[]> = {
  main: ["attached", "dgme", "completed", "cancelled"],
  referback: ["referbackByDgme", "referbackToDept", "completed", "cancelled"],
};

const tabById = (id: ProformaTabId) => PROFORMA_TABS.find((t) => t.id === id)!;

/** The DGME officers' tabs, with the same names and order as their PC-IV lists. */
const ROLE_TABS: Record<string, [ProformaTabId, string][]> = {
  "department head": [
    ["attached", "Submitted by (Administrative Department)"],
    ["dgme", "Mark To (Director)"],
    ["referbackToDept", "Referback To (Department)"],
    ["referbackByDgme", "Referback By (D)"],
  ],
  director: [
    ["attached", "Mark By (DG)"],
    ["dgme", "Mark To (DD)"],
    ["referbackByDgme", "Referback By (DD)"],
    ["referbackToDept", "Referback To (DG)"],
  ],
  "deputy director": [
    ["attached", "Mark By (D)"],
    ["dgme", "Assigned To (AD)"],
    ["referbackByDgme", "Referback By (AD)"],
    ["referbackToDept", "Referback To (D)"],
  ],
};

/** Everyone else (the department user, the Assistant Director): same as their PC-IV list. */
const DEFAULT_TABS: ProformaTabId[] = ["inprogress", "sent", "completed", "cancelled"];

/**
 * The tabs this role sees, in order; the first is where the list opens. The Secretary's
 * tabs depend on the tile that opened the list. `role` is lower case, undefined until known.
 */
export const tabsOf = (list: ProformaListId, role?: string): TabDefinition[] => {
  if (!role || role === "administrative secretary") return LIST_TABS[list].map(tabById);
  const named = ROLE_TABS[role];
  return named ? named.map(([id, label]) => ({ ...tabById(id), label })) : DEFAULT_TABS.map(tabById);
};

export const isProformaList = (value: unknown): value is ProformaListId => value === "main" || value === "referback";

export const isProformaTab = (value: unknown): value is ProformaTabId =>
  PROFORMA_TABS.some((t) => t.id === value);

/** PC-IV and PC-V share the status numbers and names. */
export const statusText = (row: { status: number; statusName?: string }) =>
  row.statusName || PCIV_STATUS_NAME[row.status] || `Status ${row.status}`;

/** Dot colour of the status: done, waiting, or stopped. */
export const statusTone = (status: number): "ok" | "wait" | "no" => {
  if (status === PCIV_STATUS.CANCELLED) return "no";
  if (
    status === PCIV_STATUS.COMPLETED ||
    status === PCIV_STATUS.MARKED_TO_EVALUATION ||
    status === PCIV_STATUS.APPROVED_BY_SECRETARY ||
    status === PCIV_STATUS.APPROVED_BY_DG
  ) {
    return "ok";
  }
  return "wait";
};

export const plural = (n: number) => `${n} ${n === 1 ? "proforma" : "proformas"}`;

/** "PDF · 2.4 MB · Uploaded 02 Nov 2026"; parts the server does not send are left out. */
export const documentLine = (doc: { name: string; path: string; fileType?: string; sizeBytes?: number; uploadedAt?: string }) => {
  const ext = doc.fileType || doc.path.split("?")[0].split(".").pop() || "";
  const size =
    doc.sizeBytes === undefined
      ? ""
      : doc.sizeBytes >= 1024 * 1024
        ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(doc.sizeBytes / 1024))} KB`;
  const uploaded = doc.uploadedAt
    ? `Uploaded ${new Date(doc.uploadedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
    : "";
  return [ext.toUpperCase(), size, uploaded].filter(Boolean).join(" · ");
};

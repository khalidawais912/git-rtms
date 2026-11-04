import {
  isPendingWithUser,
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

export type ProformaTabId = "all" | "inprogress" | "sent" | "completed" | "cancelled";

interface TabDefinition {
  id: ProformaTabId;
  label: string;
  match: (row: PcivInboxRow, userId: number) => boolean;
}

/** The old "List of Reports" tabs; In Progress = waiting for this user. */
export const PROFORMA_TABS: TabDefinition[] = [
  { id: "all", label: "All", match: () => true },
  { id: "inprogress", label: "In Progress", match: isPendingWithUser },
  { id: "sent", label: "Sent by Me", match: isSentByUser },
  {
    id: "completed",
    label: "Completed",
    match: (r) => r.status === PCIV_STATUS.COMPLETED || r.status === PCIV_STATUS.MARKED_TO_EVALUATION,
  },
  { id: "cancelled", label: "Cancelled", match: (r) => r.status === PCIV_STATUS.CANCELLED },
];

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

import { PCV_EDITABLE_STATUSES, PCV_MAX_SUBMISSIONS } from "./constants";
import { PcvCreateResult, PcvListItem } from "./types";

/** One Quill delta operation, e.g. `{ "insert": "Actual", "attributes": { "bold": true } }`. */
export interface DeltaOp {
  insert?: unknown;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Chapter content is a Quill delta stored as a JSON string: an array of ops
 * (`[{"insert":"..."}]`). `{ "ops": [...] }` and plain text are read too.
 */
export const parseDelta = (content?: string | null): DeltaOp[] => {
  if (!content || !content.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed as DeltaOp[];
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { ops?: unknown }).ops)) {
      return (parsed as { ops: DeltaOp[] }).ops;
    }
  } catch {
    // not JSON: older plain text
  }
  return [{ insert: content.endsWith("\n") ? content : `${content}\n` }];
};

/** The string to save: the ops array, as in the guide's example. */
export const serializeDelta = (ops: DeltaOp[]) => JSON.stringify(ops);

/** True when the chapter has no text and no embeds (Quill's empty editor is one "\n"). */
export const isDeltaEmpty = (ops: DeltaOp[]) =>
  ops.every((op) => typeof op.insert === "string" && op.insert.trim() === "");

/** "03 Nov 2027". The server sends local time with no offset, so only the date part is used. */
export const formatPcvDate = (value?: string | null) => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const [, y, m, d] = match;
  const month = new Date(Date.UTC(2000, Number(m) - 1, 1)).toLocaleString("en-GB", {
    month: "short",
    timeZone: "UTC",
  });
  return `${d} ${month} ${y}`;
};

/** "Year 2 of 5" */
export const yearLabel = (submissionNo?: number | null) =>
  submissionNo ? `Year ${submissionNo} of ${PCV_MAX_SUBMISSIONS}` : "";

export const pcvNameOf = (row: Pick<PcvListItem, "projectName" | "name">) =>
  row.projectName || row.name || "Untitled PC-V";

export const isPcvEditableStatus = (status: number) => PCV_EDITABLE_STATUSES.includes(status);

/** Reads a refused create's `data`; undefined when it is not one. */
export const asBlockedCreate = (data: unknown): PcvCreateResult | undefined =>
  data && typeof data === "object" && "blockedReason" in data && (data as PcvCreateResult).blockedReason
    ? (data as PcvCreateResult)
    : undefined;

/** What the create screen says for each `blockedReason` (the server's text is a fallback only). */
export const blockedCreateText = (blocked: PcvCreateResult, serverMessage = "") => {
  switch (blocked.blockedReason) {
    case "openPcv":
      return `This project already has a PC-V that is not completed (${yearLabel(blocked.submissionNo)}). Finish or open that one first.`;
    case "notOpenYet": {
      const date = formatPcvDate(blocked.nextSubmissionOpensOn);
      return `${yearLabel(blocked.submissionNo)} for this project opens on ${date || "a later date"}, 12 months after the previous PC-V was completed.`;
    }
    case "allSubmissionsUsed":
      return `This project already has all ${PCV_MAX_SUBMISSIONS} PC-Vs. No more can be added.`;
    case "missingCompletionDate":
      return "The previous PC-V of this project is completed but has no completion date. Please report this to support.";
    case "nameRequired":
      return "Please type the name of the project.";
    default:
      return serverMessage || "This PC-V cannot be created.";
  }
};

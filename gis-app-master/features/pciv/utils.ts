import { PCIV_ACTION, PCIV_FINAL_STATUSES, PCIV_STATUS } from "./constants";
import { PcivInboxRow, PcivInboxTab } from "./types";

export const PCIV_PENDING_TAB_ID = 1;

/**
 * The PC-IV is waiting for this user: it is still in the workflow, someone else
 * sent it, and it was sent to this user (or to no single person, e.g. any
 * Secretary of the department). The server's `buttons` stays the final word.
 */
export const isPendingWithUser = (row: PcivInboxRow, userId: number) =>
  !PCIV_FINAL_STATUSES.includes(row.status) &&
  row.submittedFrom !== userId &&
  (row.submittedTo === userId || !row.submittedTo);

/** Sent on by this user and still in the workflow. */
export const isSentByUser = (row: PcivInboxRow, userId: number) =>
  !PCIV_FINAL_STATUSES.includes(row.status) && !isPendingWithUser(row, userId);

/** The newest step was a refer back (needs `lastAction`, see PcivInboxList `withLastAction`). */
export const isReferredBack = (row: PcivInboxRow) =>
  row.lastAction === PCIV_ACTION.REFER_BACK;

/** A list tab: which inbox rows it shows. */
export interface PcivTabDefinition {
  id: number;
  label: string;
  match: (row: PcivInboxRow, userId: number) => boolean;
  /** Rows here wait for this user; the first such tab with rows opens by default. */
  pending?: boolean;
}

/** Default tabs of every PC-IV list. */
export const PCIV_DEFAULT_TABS: PcivTabDefinition[] = [
  { id: PCIV_PENDING_TAB_ID, label: "", match: isPendingWithUser, pending: true },
  { id: 2, label: "SENT BY ME", match: isSentByUser },
  {
    id: 3,
    label: "COMPLETED",
    match: (r) =>
      r.status === PCIV_STATUS.COMPLETED ||
      r.status === PCIV_STATUS.MARKED_TO_EVALUATION,
  },
  { id: 4, label: "CANCELLED", match: (r) => r.status === PCIV_STATUS.CANCELLED },
];

export const buildPcivInboxTabs = <T extends PcivInboxRow>(
  rows: T[],
  userId: number,
  definitions: PcivTabDefinition[] = PCIV_DEFAULT_TABS,
): PcivInboxTab<T>[] =>
  definitions.map(({ id, label, match, pending }) => {
    const filteredData = rows.filter((r) => match(r, userId));
    return { id, label, pending, filteredData, count: filteredData.length };
  });

import { PCIV_FINAL_STATUSES, PCIV_STATUS } from "./constants";
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

/** Inbox tabs shared by every PC-IV list. */
export const buildPcivInboxTabs = <T extends PcivInboxRow>(
  rows: T[],
  userId: number,
): PcivInboxTab<T>[] => {
  const tabs: Omit<PcivInboxTab<T>, "count">[] = [
    {
      id: PCIV_PENDING_TAB_ID,
      label: "PENDING WITH ME",
      filteredData: rows.filter((r) => isPendingWithUser(r, userId)),
    },
    {
      id: 2,
      label: "SENT BY ME",
      filteredData: rows.filter(
        (r) =>
          !PCIV_FINAL_STATUSES.includes(r.status) &&
          !isPendingWithUser(r, userId),
      ),
    },
    {
      id: 3,
      label: "COMPLETED",
      filteredData: rows.filter(
        (r) =>
          r.status === PCIV_STATUS.COMPLETED ||
          r.status === PCIV_STATUS.MARKED_TO_EVALUATION,
      ),
    },
    {
      id: 4,
      label: "CANCELLED",
      filteredData: rows.filter((r) => r.status === PCIV_STATUS.CANCELLED),
    },
  ];
  return tabs.map((tab) => ({ ...tab, count: tab.filteredData.length }));
};

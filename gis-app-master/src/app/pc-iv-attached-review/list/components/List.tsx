"use client";
import PcivInboxList from "@/features/pciv/components/PcivInboxList";
import {
  isPendingWithUser,
  isReferredBack,
  isSentByUser,
  PcivPanelLabels,
  PcivTabDefinition,
} from "@/features/pciv";
import { useReportHistoryUsers } from "@/features/users";
import DownloadWrapper from "../../components/DownloadWrapper";

// The Secretary's view. Submitted and referred-back PC-IVs share a status, so the
// newest history action (loaded via withLastAction) tells them apart.
const TABS: PcivTabDefinition[] = [
  {
    id: 1,
    label: "SUBMITTED BY ATTACHED DEPT.",
    match: (row, userId) => isPendingWithUser(row, userId) && !isReferredBack(row),
    pending: true,
  },
  {
    id: 2,
    label: "SUBMITTED TO (DGM&E)",
    match: (row, userId) => isSentByUser(row, userId) && !isReferredBack(row),
  },
  {
    id: 3,
    label: "REFERBACK BY (DGM&E)",
    match: (row, userId) => isPendingWithUser(row, userId) && isReferredBack(row),
    pending: true,
  },
  {
    id: 4,
    label: "REFERBACK TO ATTACHED DEPT.",
    match: (row, userId) => isSentByUser(row, userId) && isReferredBack(row),
  },
];

// The Secretary's earlier wording for the same server buttons
const PANEL_LABELS: PcivPanelLabels = {
  buttons: { forward: "Submit to DGM&E", referBack: "Referback" },
  forwardTo: "Mark To",
};

const List = () => {
  const { data: users } = useReportHistoryUsers();

  return (
    <PcivInboxList
      users={users ?? []}
      tabDefinitions={TABS}
      withLastAction
      panelLabels={PANEL_LABELS}
      rowButtonLabel={(_row, pending, tabLabel) =>
        tabLabel === "All" ? "View History" : pending ? "Comment" : "Submitted"
      }
      renderDownload={(rows, fileName) => (
        <DownloadWrapper data={rows} fileName={fileName} />
      )}
    />
  );
};

export default List;

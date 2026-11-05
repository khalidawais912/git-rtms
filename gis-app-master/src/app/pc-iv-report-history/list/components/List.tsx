"use client";
import PcivInboxList from "@/features/pciv/components/PcivInboxList";
import {
  isPendingWithUser,
  isReferredBack,
  isSentByUser,
  PcivTabDefinition,
} from "@/features/pciv";
import { useReportHistoryUsers } from "@/features/users";
import useUserInfo from "@/hooks/useUserInfo";
 
const roleTabs = (labels: {
  receivedForward: string;
  sentForward: string;
  receivedReferBack: string;
  sentReferBack: string;
  order: ("receivedForward" | "sentForward" | "receivedReferBack" | "sentReferBack")[];
}): PcivTabDefinition[] => {
  const tabs = {
    receivedForward: {
      label: labels.receivedForward,
      match: (row, userId) => isPendingWithUser(row, userId) && !isReferredBack(row),
      pending: true,
    },
    sentForward: {
      label: labels.sentForward,
      match: (row, userId) => isSentByUser(row, userId) && !isReferredBack(row),
    },
    receivedReferBack: {
      label: labels.receivedReferBack,
      match: (row, userId) => isPendingWithUser(row, userId) && isReferredBack(row),
      pending: true,
    },
    sentReferBack: {
      label: labels.sentReferBack,
      match: (row, userId) => isSentByUser(row, userId) && isReferredBack(row),
    },
  } satisfies Record<string, Omit<PcivTabDefinition, "id">>;

  return labels.order.map((key, i) => ({ id: i + 1, ...tabs[key] }));
};

const TABS_BY_ROLE: Record<string, PcivTabDefinition[]> = {
  "department head": roleTabs({
    receivedForward: "SUBMITTED BY (ADMINISTRATIVE DEPARTMENT)",
    sentForward: "MARK TO (DIRECTOR)",
    sentReferBack: "REFERBACK TO (DEPARTMENT)",
    receivedReferBack: "REFERBACK BY (D)",
    order: ["receivedForward", "sentForward", "sentReferBack", "receivedReferBack"],
  }),
  director: roleTabs({
    receivedForward: "MARK BY (DG)",
    sentForward: "MARK TO (DD)",
    receivedReferBack: "REFERBACK BY (DD)",
    sentReferBack: "REFERBACK TO (DG)",
    order: ["receivedForward", "sentForward", "receivedReferBack", "sentReferBack"],
  }),
  "deputy director": roleTabs({
    receivedForward: "MARK BY (D)",
    sentForward: "ASSIGNED TO (AD)",
    receivedReferBack: "REFERBACK BY (AD)",
    sentReferBack: "REFERBACK TO (D)",
    order: ["receivedForward", "sentForward", "receivedReferBack", "sentReferBack"],
  }),
};

const List = () => {
  const { data: users } = useReportHistoryUsers();
  const { role } = useUserInfo();
  const tabDefinitions = role ? TABS_BY_ROLE[role] : undefined;

  return (
    <PcivInboxList
      users={users ?? []}
      tabDefinitions={tabDefinitions}
      withLastAction={!!tabDefinitions}
    />
  );
};

export default List;

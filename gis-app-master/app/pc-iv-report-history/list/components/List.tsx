"use client";
import PcivInboxList from "@/features/pciv/components/PcivInboxList";
import { useReportHistoryUsers } from "@/features/users";

const List = () => {
  const { data: users } = useReportHistoryUsers();

  return <PcivInboxList users={users ?? []} />;
};

export default List;

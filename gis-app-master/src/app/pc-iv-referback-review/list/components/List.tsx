"use client";
import PcivInboxList from "@/features/pciv/components/PcivInboxList";
import { useReportHistoryUsers } from "@/features/users";
import DownloadWrapper from "../../components/DownloadWrapper";

const List = () => {
  const { data: users } = useReportHistoryUsers();

  return (
    <PcivInboxList
      users={users ?? []}
      renderDownload={(rows, fileName) => (
        <DownloadWrapper data={rows} fileName={fileName} />
      )}
    />
  );
};

export default List;

import { isPendingWithUser, PcivInboxReport } from "@/features/pciv";
import { getPcvInbox } from "@/features/pcv";
import MiniCard from "@/features/monitoring-dashboard/components/MiniCard";
import mon from "@/features/monitoring-dashboard/components/MonitoringDashboard.module.css";
import useUserInfo from "@/hooks/useUserInfo";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Same card as PC-IV Review: the user's PC-Vs, with a badge for the ones waiting for them. */
const PCVReportReview = () => {
  const [data, setData] = useState<PcivInboxReport[]>();
  const { userId } = useUserInfo();

  useEffect(() => {
    if (!userId) return;
    let live = true;
    getPcvInbox(userId)
      .then((inbox) => live && setData(inbox.reports))
      .catch((err) => console.error("PC-V inbox error:", err));
    return () => {
      live = false;
    };
  }, [userId]);

  if (!userId) return null;

  return (
    <Link href="/proformas?type=pc5" target="_blank">
      <MiniCard
        as="span"
        className={mon.solo}
        icon="review"
        value={data?.length ?? 0}
        label="PC-V Review"
        color="var(--teal)"
        badge={data?.filter((d) => isPendingWithUser(d, userId)).length ?? 0}
      />
    </Link>
  );
};

export default PCVReportReview;

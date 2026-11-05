import MiniCard from "@/features/monitoring-dashboard/components/MiniCard";
import mon from "@/features/monitoring-dashboard/components/MonitoringDashboard.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import apiClient from "@/services/client";
import { PC_IV_WORKFLOW_API } from "@/services/endpoints";
import { SubmittedReport } from "@/app/report-history/types";
import { useSearchParams } from "next/navigation";
import useUserInfo from "@/hooks/useUserInfo";

const PCIVReportReview = () => {
  const [data, setData] = useState<SubmittedReport[]>();
  const { userId, role } = useUserInfo();
  const searchParams = useSearchParams();
  const dashboardType = searchParams.get("dashboardType");

  useEffect(() => {
    if (role) {
    }
  }, [role]);

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${PC_IV_WORKFLOW_API}/submitted-reports`,
          {
            params: {
              userId,
            },
          },
        );

        if (response.data.data) setData(response.data.data.reports);
        else setData([]);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId]);

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  if (!userId) return null;

  return (
    <Link href={`/pc-iv-report-history?${searchParams.toString()}`} target="_blank">
      <MiniCard
        as="span"
        className={mon.solo}
        icon="review"
        value={
          dashboardType
            ? 0
            : data?.filter((d) => d.submittedTo === userId || d.submittedFrom === userId).length || 0
        }
        label="PC-IV Review"
        color="var(--violet)"
        badge={dashboardType ? 0 : data?.filter((d) => d.submittedTo === userId && d.isFocalPerson === true).length}
      />
    </Link>
  );
};

export default PCIVReportReview;

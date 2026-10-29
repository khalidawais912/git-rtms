import Menu from "@/components/Menu";
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

  return (
    <>
      {userId && (
        <Link
          href={`/pc-iv-report-history?${searchParams.toString()}`}
          target="_blank"
          className="col btn p-0 pe-1 shadow-none w-100 position-relative"
        >
          <Menu
            background="rgba(12, 140, 233, 0.2)"
            outline="1px solid rgba(12, 140, 233, 0.4)"
            icon="/icons/reportReview.svg"
            value={
              dashboardType
                ? 0
                : data?.filter(
                    (d) =>
                      d.submittedTo === userId || d.submittedFrom === userId,
                  ).length || 0
            }
            label="PC-IV Review"
            showTides={false}
            showArrow={true}
            textWrap={false}
          />
          {dashboardType ? (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              0
            </span>
          ) : (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {
                data?.filter(
                  (d) => d.submittedTo === userId && d.isFocalPerson === true,
                ).length
              }
            </span>
          )}
        </Link>
      )}
    </>
  );
};

export default PCIVReportReview;

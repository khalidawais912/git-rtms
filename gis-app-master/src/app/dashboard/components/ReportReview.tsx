import Menu from "@/components/Menu";
import Link from "next/link";
import { useState, useEffect } from "react";
import apiClient from "@/services/client";
import { REPORTS_HISTORY_API } from "@/services/endpoints";
import { SubmittedReport } from "@/app/report-history/types";
import useUserInfo from "@/hooks/useUserInfo";

const ReportReview = ({
  dashboardType = null,
}: {
  dashboardType?: string | null | undefined;
}) => {
  const [data, setData] = useState<SubmittedReport[]>();
  const { userId } = useUserInfo();

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`
        );
        setData(response.data.data.reports);
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
          href="/report-history"
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
                      d.submittedTo === userId || d.submittedFrom === userId
                  ).length || 0
            }
            label="Report Review"
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
                  (d) => d.submittedTo === userId && d.isFocalPerson === true
                ).length
              }
            </span>
          )}
        </Link>
      )}
    </>
  );
};

export default ReportReview;

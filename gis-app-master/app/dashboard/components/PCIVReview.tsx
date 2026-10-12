import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import apiClient from "@/app/services/api-client";
import { PC_IV_WORKFLOW_API, REPORTS_HISTORY_API } from "@/app/APIs";
import { SubmittedReport } from "@/app/report-history/list/components/List";

const PCIVReview = ({
  dashboardType = null,
}: {
  dashboardType?: string | null | undefined;
}) => {
  const [data, setData] = useState<SubmittedReport[]>();
  const [role, setRole] = useState<string>();
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    const userId = Cookies.get("userId");
    const role = Cookies.get("role");
    if (role) setRole(role);
    if (userId) setUserId(parseInt(userId));
  }, []);

  useEffect(() => {
    if (role) {
      console.log("role:", role);
      console.log("role check", role.toLowerCase().includes("director"));
    }
  }, [role]);

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${PC_IV_WORKFLOW_API}/submitted-reports`,
          {
            params: { userId },
          },
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
      console.log(
        "report review count",
        data?.filter(
          (d) => d.submittedTo === userId || d.submittedFrom === userId,
        ).length,
      );
      console.log(
        "report review data",
        data?.filter(
          (d) => d.submittedTo === userId || d.submittedFrom === userId,
        ),
      );
    }
  }, [data]);

  return (
    <>
      {userId && (
        <Link
          href="/pc-iv-review"
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

export default PCIVReview;

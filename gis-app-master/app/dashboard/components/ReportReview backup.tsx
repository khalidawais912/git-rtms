import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import apiClient from "@/app/services/api-client";
import { REPORTS_HISTORY_API } from "@/app/APIs";
import { SubmittedReport } from "@/app/report-history/list/components/List";

const ReportReview = () => {
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
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId]);

  return (
    <>
      {role && data && role.toLowerCase().includes("director") && (
        <Link
          href="/report-history"
          target="_blank"
          className="col btn p-0 pe-1 shadow-none w-100 position-relative"
        >
          <Menu
            background="rgba(12, 233, 167, 0.2)"
            outline="1px solid rgba(12, 233, 174, 0.4)"
            icon="/icons/reportReview.svg"
            value={data.length || 0}
            label="Report Review"
            showTides={true}
            showArrow={true}
            textWrap={false}
          />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {/* {role.toLowerCase() === "deputy director" &&
              data.filter((d) => d.lastStatus === 0).length}
            {role.toLowerCase() === "director" &&
              data.filter((d) => d.lastStatus === 1).length}
            {role.toLowerCase() === "director general" &&
              data.filter((d) => d.lastStatus === 2).length} */}
            {role.toLowerCase() === "deputy director" &&
              data.filter((d) => d.status === 0).length}
            {role.toLowerCase() === "director" &&
              data.filter((d) => d.status === 1).length}
            {role.toLowerCase() === "director general" &&
              data.filter((d) => d.status === 2).length}
          </span>
        </Link>
      )}
    </>
  );
};

export default ReportReview;

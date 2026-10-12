import { REPORTS_HISTORY_API } from "@/app/APIs";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import { useEffect, useState } from "react";
import HistoryList from "../../components/HistoryList";
import { ReportHistory } from "../../components/ReportNoting";
import { ISSUED, REFERBACK, SUBMITTED } from "../../statuses";
import { SubmittedReport } from "./List";

interface Props {
  data: SubmittedReport;
  index: number;
  users: ReportHistoryUser[];
}

const ProjectTile = ({ data, index, users }: Props) => {
  const [descendingOrderReportsHistory, setDescendingOrderReportsHistory] =
    useState<ReportHistory[]>();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getReportHistory = async (
      visitId: number,
      projectId: number,
      reportType: number,
    ) => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetReportHistory?visitId=${visitId}&ProjectId=${projectId}&reportType=${reportType}`,
        );
        const sorted = [...response.data.data].sort((a, b) =>
          (b.sDate || "").localeCompare(a.sDate || ""),
        );

        setDescendingOrderReportsHistory(sorted);
        console.log("sorted", sorted);

        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    console.log("visit id:", data.visitId, "project id", data.projectId);
    if (data) getReportHistory(data.visitId, data.projectId, data.reportType);
  }, [data]);

  return (
    <div className="col mb-2 position-relative overflow-hidden">
      <div
        className="col p-3"
        style={{
          background: "#FAFAFA",
          borderRadius: "12px",
          border: "1px solid rgba(0, 0, 0,.1)",
        }}
      >
        <div className="row m-0">
          {/* LEFT STATUS BOX */}
          <div
            className={`col-auto rounded-3 p-3 ${
              data.status === ISSUED
                ? "bg-success text-light"
                : data.status === REFERBACK
                  ? "bg-danger text-light"
                  : data.status === SUBMITTED
                    ? "bg-warning text-dark"
                    : "bg-info text-dark"
            }`}
          >
            <p className="fw-5 mb-0">
              <span className="fw-bold">Sr#</span> {index + 1}
            </p>
            <p className="fw-5 mb-0">
              <span className="fw-bold">GS No. </span>
              {data.gsNo}
            </p>
          </div>

          <div className="col">
            {/* HEADER */}
            <div className="row d-flex justify-content-between align-items-center mb-2">
              <div className="col">
                <p className="fs18px fw-bold m-0" style={{ color: "#263238" }}>
                  <span>Project: </span> {data.projectName}
                </p>
              </div>

              {/* BADGE */}
              <div
                className="col-auto position-absolute p-0"
                style={{ rotate: "45deg", top: 40, right: -40 }}
              >
                {data.reportType === 1 ? (
                  <span
                    className="badge px-5 fw-bold py-2 fs-6"
                    style={{ backgroundColor: "#3B7C80" }}
                  >
                    MONITORING
                  </span>
                ) : data.reportType === 0 ? (
                  <span className="badge bg-color-evaluation-theme-blue px-5 fw-bold py-2 fs-6">
                    EVALUATION
                  </span>
                ) : null}
              </div>
            </div>

            {/* BODY */}
            <div className="row d-flex justify-content-between">
              {/* Officer */}
              <div className="col">
                <p className="mb-2 fs18px fw-bold">Officer Name</p>
                <p className="mb-0">
                  {data.intiallyUser}
                  <br />
                  <span>({data.intiallyDesignation})</span>
                </p>
              </div>

              {/* Submitted */}
              <div className="col">
                <p className="mb-2 fs18px fw-bold">Submitted Date</p>
                <p className="mb-0">
                  {new Date(data.submittedDate).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  <br />
                  {new Date(data.submittedDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              {/* ACTION BUTTON */}
            </div>
            <div className="row d-flex justify-content-center align-items-center m-0 gap-1">
              {descendingOrderReportsHistory && (
                <HistoryList
                  descendingOrderData={descendingOrderReportsHistory.slice(
                    descendingOrderReportsHistory.length - 3,
                    descendingOrderReportsHistory.length - 1,
                  )}
                  users={users}
                  submittedReport={data}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTile;

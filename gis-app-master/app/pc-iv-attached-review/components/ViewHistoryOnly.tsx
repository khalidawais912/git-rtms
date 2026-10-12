import { PC_IV_WORKFLOW_API, REPORTS_HISTORY_API } from "@/app/APIs";
import Loader from "@/app/components/Loader/Loader";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";
import ReactMarkDown from "react-markdown";
import { SubmittedReport } from "../list/components/List";
import ReportHistoryDownload from "./ReportHistoryDownload";
import { ReportHistory } from "./ReportNoting";

interface Props {
  data: SubmittedReport;
  users: ReportHistoryUser[];
}

const ViewHistoryOnly = ({ data, users }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [reportsHistory, setReportsHistory] = useState<ReportHistory[]>();

  useEffect(() => {
    const getReportHistory = async (pcivId: number) => {
      setLoading(true);
      try {
        const response = await apiClient.get(`${PC_IV_WORKFLOW_API}/history`, {
          params: { pcivId },
        });
        setReportsHistory(
          response.data.data.sort(
            (a: ReportHistory, b: ReportHistory) =>
              new Date(b.mark_date).getTime() - new Date(a.mark_date).getTime(),
          ),
        );
        setReportsHistory(response.data.data);
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    console.log("pcivId:", data.projectId);
    if (data) getReportHistory(data.projectId);
  }, [data]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <BsExclamationTriangleFill size={24} className="me-2" />
          <div>{error}, Please Try Again!</div>
        </div>
      ) : reportsHistory ? (
        <div
          className="col p-2 bg-white"
          style={{
            borderRadius: "12px",
          }}
        >
          <div className="row justify-content-between align-items-center mb-3 gx-1">
            <span className="fw-6 fs-4">Report History</span>
            <span className="mb-2 text-end">
              <ReportHistoryDownload
                data={reportsHistory}
                users={users}
                submittedReport={data}
              />
            </span>
          </div>
          {reportsHistory.map((d) => (
            <div
              key={d.id}
              className="col p-4 ms-1 mb-3"
              style={{
                background: "#FAFAFA",
                borderRadius: "12px",
              }}
            >
              <div className="row d-flex m-0 mb-3">
                <div className="col">
                  <p className="fw-normal m-0">
                    From:{" "}
                    <span>
                      {users.find((user) => user.id === d.mark_From)?.fullName}
                    </span>
                  </p>
                </div>
                <div className="col">
                  <p className="fw-normal m-0">
                    To:{" "}
                    <span>
                      {users.find((user) => user.id === d.mark_to)?.fullName}
                    </span>
                  </p>
                </div>
                <div className="col">
                  <p className="fw-normal m-0">
                    Date:{" "}
                    <span>
                      {new Date(d.mark_date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      (
                      {new Date(d.mark_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      )
                    </span>
                  </p>
                </div>
                <div className="col text-end">
                  <Link
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.pciv_pdf_path}`}
                    className="btn rounded-pill fs15px"
                    style={{ background: "#E4E4E4" }}
                  >
                    View PDF Report
                  </Link>
                </div>
              </div>
              <hr style={{ opacity: ".1" }} />
              <p className="mb-1 fw-normal fs18px">Comments</p>
              <div
                className="mb-2 bg-white p-3"
                style={{
                  borderRadius: "12px",
                  border: "1px solid rgba(38, 50, 56,.1)",
                }}
              >
                <ReactMarkDown>{d.remarks}</ReactMarkDown>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          <BsExclamationTriangleFill size={24} className="me-2" />
          <div>No reports found.</div>
        </div>
      )}
    </>
  );
};

export default ViewHistoryOnly;

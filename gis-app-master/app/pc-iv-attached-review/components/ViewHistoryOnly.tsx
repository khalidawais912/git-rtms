import { PC_IV_WORKFLOW_API, REPORTS_HISTORY_API } from "@/shared/api/endpoints";
import Loader from "@/shared/components/Loader/Loader";
import { ReportHistoryUser } from "@/features/users";
import apiClient, { AxiosError } from "@/shared/api/client";
import { getFormattedDate } from "@/shared/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";
import { SubmittedReport, ReportHistory } from "../types";
import ReportHistoryDownload from "./ReportHistoryDownload";
import AlertMessage from "@/shared/components/AlertMessage";

interface Props {
  data: SubmittedReport;
  users: ReportHistoryUser[];
}

const ViewHistoryOnly = ({ data, users }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [reportsHistory, setReportsHistory] = useState<ReportHistory[]>();
  console.log(data?.pcivId , "23" , "data is  here ? . " , data );
  
  const pcivId = data?.pcivId;

  useEffect(() => {
    if (!pcivId) return;

    const getReportHistory = async (pcivId: number) => {
      setLoading(true);
      setError("");
      try {
        const response = await apiClient.get(`${PC_IV_WORKFLOW_API}/history`, {
          params: { pcivId },
        });
        const history: ReportHistory[] = response?.data?.data ?? [];
        setReportsHistory(
          [...history].sort(
            (a, b) =>
              new Date(b.mark_date).getTime() - new Date(a.mark_date).getTime(),
          ),
        );
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
      } finally {
        setLoading(false);
      }
    };
    getReportHistory(pcivId);
  }, [pcivId]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <AlertMessage variant="danger">{error}, Please Try Again!</AlertMessage>
      ) : reportsHistory && reportsHistory.length > 0 ? (
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
        <AlertMessage variant="warning" />
      )}
    </>
  );
};

export default ViewHistoryOnly;

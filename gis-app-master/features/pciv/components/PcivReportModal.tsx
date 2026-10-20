"use client";
import { ReportHistoryUser } from "@/features/users";
import AlertMessage from "@/shared/components/AlertMessage";
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader/Loader";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPcivHistory, PcivApiError, pcivFileUrl } from "../api";
import { PcivReportTrail } from "../types";
import PcivActionPanel from "./PcivActionPanel";
import PcivHistory from "./PcivHistory";

interface Props {
  report: {
    pcivId: number;
    gsNo: string;
    projectName: string;
    intiallyUser: string;
    reportPath: string;
  };
  userId: number;
  users: ReportHistoryUser[];
  /** Reload the list after a workflow button. */
  onDone: () => void;
  onClose?: () => void;
}

/** Body of the PC-IV modal: PDF, history, and this user's workflow buttons. */
const PcivReportModal = ({ report, userId, users, onDone, onClose }: Props) => {
  const [history, setHistory] = useState<PcivReportTrail[]>();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewPdf, setViewPdf] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setHistory(await getPcivHistory(report.pcivId));
    } catch (err) {
      setError(err instanceof PcivApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [report.pcivId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const pdfUrl = pcivFileUrl(report.reportPath);
  // Cache-buster fixed per file, so the iframe does not reload on every render
  const pdfSrc = useMemo(
    () => (pdfUrl ? `${pdfUrl}?t=${Date.now()}` : undefined),
    [pdfUrl],
  );

  return (
    <div className="container-fluid p-3">
      <div
        className="col"
        style={{
          backgroundImage: "url('/images/bg2.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255, 255, 255, 0.29)",
          borderRadius: "15px",
          height: "100%",
        }}
      >
        <div
          className="col"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, rgba(239, 239, 239,.6) , rgba(255, 255, 255,.08))",
            borderRadius: "15px",
            padding: "34px 50px",
            width: "100%",
            height: "100%",
          }}
        >
          {isLoading ? (
            <Loader />
          ) : error ? (
            <AlertMessage variant="danger">{error}, Please Try Again!</AlertMessage>
          ) : history ? (
            <div className="row d-flex m-0">
              {viewPdf && pdfSrc && (
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                  <iframe
                    key={report.reportPath}
                    src={pdfSrc}
                    width="100%"
                    height="600px"
                    style={{ border: "none" }}
                  />
                </div>
              )}
              <div
                className={`${viewPdf ? "col-lg-6" : "col-lg-12"} col-md-12 col-sm-12`}
                style={{ height: "85%", overflowY: "auto" }}
              >
                {pdfUrl && (
                  <Button
                    className="btn btn-primary"
                    onClick={() => setViewPdf(!viewPdf)}
                  >
                    {viewPdf ? "Hide" : "View"} PDF
                  </Button>
                )}
                <PcivHistory history={history} users={users} />
                <div
                  className="col p-4 ms-1 mb-3"
                  style={{ background: "#FAFAFA", borderRadius: "12px" }}
                >
                  <p className="mb-4 fw-normal">
                    <span>Project:&nbsp;&nbsp;</span> (Gs. No- {report.gsNo}){" "}
                    {report.projectName}
                  </p>
                  <p className="mb-4 fw-normal">
                    <span>Name:&nbsp;&nbsp;</span> {report.intiallyUser}
                  </p>
                  <hr style={{ opacity: ".1" }} />
                  <PcivActionPanel
                    pcivId={report.pcivId}
                    userId={userId}
                    users={users}
                    history={history}
                    onDone={() => {
                      onDone();
                      loadHistory();
                    }}
                    onClose={onClose}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PcivReportModal;

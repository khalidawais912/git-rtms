"use client";
import { ReportHistoryUser } from "@/features/users";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import ReactMarkDown from "react-markdown";
import { pcivFileUrl } from "../services";
import { PCIV_ACTION_LABEL } from "../constants";
import { PcivReportTrail } from "../types";

interface Props {
  /** Newest first. */
  history: PcivReportTrail[];
  users: ReportHistoryUser[];
}

const formatDate = (date: string) =>
  `${new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} (${new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })})`;

const PcivHistory = ({ history, users }: Props) => {
  const userName = (id: number) => users.find((u) => u.id === id)?.fullName;

  return (
    <div className="mb-2 p-2">
      <Accordion flush>
        <Accordion.Item eventKey="reportHistory">
          <Accordion.Header>Report History List</Accordion.Header>
          <Accordion.Body>
            <div className="col" style={{ maxHeight: "500px", overflowY: "auto" }}>
              {history.length === 0 && (
                <p className="text-secondary m-0">No history yet.</p>
              )}
              {history.map((h) => (
                <div
                  key={h.id}
                  className="col p-4 ms-1 mb-3"
                  style={{ background: "#FAFAFA", borderRadius: "12px" }}
                >
                  <div className="row d-flex m-0 mb-3 gy-2">
                    <div className="col-12 fw-bold">
                      {h.action !== null
                        ? PCIV_ACTION_LABEL[h.action] ?? "Updated"
                        : "Marked"}
                      {h.actor_role && (
                        <span className="fw-normal text-secondary">
                          {" "}
                          by {h.actor_role}
                        </span>
                      )}
                    </div>
                    <div className="col">
                      <p className="fw-normal m-0">
                        From: <span>{userName(h.mark_From)}</span>
                      </p>
                    </div>
                    <div className="col">
                      <p className="fw-normal m-0">
                        To: <span>{userName(h.mark_to)}</span>
                      </p>
                    </div>
                    <div className="col">
                      <p className="fw-normal m-0">
                        Date: <span>{formatDate(h.mark_date)}</span>
                      </p>
                    </div>
                    {h.pciv_pdf_path && (
                      <div className="col text-end">
                        <Link
                          target="_blank"
                          href={pcivFileUrl(h.pciv_pdf_path)!}
                          className="btn rounded-pill fs15px"
                          style={{ background: "#E4E4E4" }}
                        >
                          View PDF
                        </Link>
                      </div>
                    )}
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
                    <ReactMarkDown>{h.remarks ?? ""}</ReactMarkDown>
                  </div>
                </div>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default PcivHistory;

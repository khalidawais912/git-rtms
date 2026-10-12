"use client";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import ReactMarkDown from "react-markdown";
import { ReportHistory } from "./ReportNoting";

interface Props {
  descendingOrderData: ReportHistory[];
  users: ReportHistoryUser[];
}

const HistoryList = ({ descendingOrderData, users }: Props) => {
  return (
    <div className="mb-2 p-2">
      <Accordion flush>
        <Accordion.Item eventKey="reportHistory">
          <Accordion.Header>Report History List </Accordion.Header>
          <Accordion.Body>
            <div
              className="col"
              style={{ height: "500px", overflow: "scroll" }}
            >
              <div className="col mb-2 text-end">
                {/* <ReportHistoryDownload
                  data={ascendingOrderData}
                  users={users}
                  submittedReport={submittedReport}
                /> */}
              </div>
              {descendingOrderData?.map((d) => (
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
                          {
                            users.find((user) => user.id === d.mark_From)
                              ?.fullName
                          }
                        </span>
                      </p>
                    </div>
                    <div className="col">
                      <p className="fw-normal m-0">
                        To:{" "}
                        <span>
                          {
                            users.find((user) => user.id === d.mark_to)
                              ?.fullName
                          }
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default HistoryList;

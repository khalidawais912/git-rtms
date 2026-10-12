"use client";
import { ReportHistoryUser } from "@/features/users";
import { statuses } from "@/app/report-history/statuses";
import { FaArrowRightLong } from "react-icons/fa6";
import { SubmittedReport, ReportHistory } from "../types";

interface Props {
  descendingOrderData: ReportHistory[];
  users: ReportHistoryUser[];
  submittedReport: SubmittedReport;
}

const HistoryList = ({
  descendingOrderData,
  users,
  submittedReport,
}: Props) => {
  console.log("descendingOrderDatas", descendingOrderData);
  console.log("submittedReport", submittedReport);
  return (
    <>
      {descendingOrderData?.map((d, i) => (
        <div
          key={i}
          className="col-auto rounded p-2"
          style={{ background: "rgba(0,0,0,.05)" }}
        >
          <div className="row d-flex align-items-center m-0 gap-1">
            <div className="col-auto bg-success p-1 rounded text-white">
              <p className="m-0">
                From :
                {users.find((user) => user.id === d.submittedFrom)?.fullName}
              </p>
            </div>
            <div className="col-auto">
              <div className="d-flex justify-content-center">
                <span className="bg-secondary m-0 text-center rounded text-white px-2 py-1 fs14px fw-5">
                  {statuses.find((status) => d.status === status.value)?.label}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-center ">
                <div
                  style={{ width: "50px", height: "2px", background: "black" }}
                />
                <FaArrowRightLong />
              </div>
              <p className="m-0 text-center">
                {new Date(submittedReport.submittedDate).toLocaleDateString()} (
                {new Date(submittedReport.submittedDate).toLocaleTimeString()})
              </p>
            </div>
            <div
              className={`col-auto ${d.id === descendingOrderData[descendingOrderData.length - 1].id ? "bg-danger" : "bg-success"} p-1 rounded text-white`}
            >
              <p className="m-0">
                To :{users.find((user) => user.id === d.submittedTo)?.fullName}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default HistoryList;


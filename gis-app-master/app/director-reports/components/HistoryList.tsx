"use client";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import { statuses } from "@/app/report-history/statuses";
import { FaArrowRightLong } from "react-icons/fa6";
import { SubmittedReport } from "../list/components/List";
import { ReportHistory } from "./ReportNoting";

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

//  <div className="p-2">
//       <div className="row d-flex m-0">
//         {/* <div
//           className="col-auto p-4 ms-1 mb-3 text-white"
//           style={{
//             background: "grey",
//             borderRadius: "12px",
//           }}
//         >
//           <div className="col">
//             <p className="fw-normal m-0">
//               <span>{submittedReport.intiallyUser}</span>
//             </p>
//           </div>
//           <div className="col">
//             <p className="fw-normal m-0">
//               <span>
//                 {new Date(submittedReport.submittedDate).toLocaleDateString()} (
//                 {new Date(submittedReport.submittedDate).toLocaleTimeString()})
//               </span>
//             </p>
//           </div>
//         </div> */}
//         {/* {descendingOrderData?.map((d, i) => (
//           <div
//             key={d.id}
//             className="col-auto p-4 ms-1 mb-2 text-white"
//             style={{
//               background:
//                 i === descendingOrderData.length - 2
//                   ? "red"
//                   : i === descendingOrderData.length - 1
//                     ? "green"
//                     : "grey",
//               borderRadius: "12px",
//             }}
//           >
//             <div className="col">
//               <div className="d-flex align-items-center gap-1">
//                 <span className="fw-normal m-0">
//                   From:{" "}
//                   <span>
//                     {
//                       users.find((user) => user.id === d.submittedFrom)
//                         ?.fullName
//                     }
//                   </span>
//                 </span>
//                 <div
//                   style={{ width: "50px", height: "2px", background: "white" }}
//                 />
//                 <FaArrowRightLong />

//                 <span className="fw-normal m-0">
//                   To:{" "}
//                   <span>
//                     {users.find((user) => user.id === d.submittedTo)?.fullName}
//                   </span>
//                 </span>
//               </div>
//             </div>
//             <div className="col">
//               <p className="fw-normal m-0">
//                 <span>
//                   {new Date(d.sDate).toLocaleDateString()} (
//                   {new Date(d.sDate).toLocaleTimeString()})
//                 </span>
//               </p>
//             </div>
//             <div className="col">
//               <h6 className="m-0">
//                 <span className="badge bg-secondary">
//                   {statuses.find((status) => d.status === status.value)?.label}
//                 </span>
//               </h6>
//             </div>
//           </div>
//         ))} */}

//         {/* {descendingOrderData?.map((d, i) => (
//           <div
//             key={d.id}
//             className="col-auto p-4 ms-1 mb-2 text-white"
//             style={{
//               background:
//                 i === descendingOrderData.length - 2
//                   ? "red"
//                   : i === descendingOrderData.length - 1
//                     ? "green"
//                     : "grey",
//               borderRadius: "12px",
//             }}
//           >
//             <div className="col">
//               <div className="d-flex align-items-center gap-1">
//                 <span className="fw-normal m-0">
//                   From:{" "}
//                   <span>
//                     {
//                       users.find((user) => user.id === d.submittedFrom)
//                         ?.fullName
//                     }
//                   </span>
//                 </span>
//                 <div
//                   style={{ width: "50px", height: "2px", background: "white" }}
//                 />
//                 <FaArrowRightLong />

//                 <span className="fw-normal m-0">
//                   To:{" "}
//                   <span>
//                     {users.find((user) => user.id === d.submittedTo)?.fullName}
//                   </span>
//                 </span>
//               </div>
//             </div>
//             <div className="col">
//               <p className="fw-normal m-0">
//                 <span>
//                   {new Date(d.sDate).toLocaleDateString()} (
//                   {new Date(d.sDate).toLocaleTimeString()})
//                 </span>
//               </p>
//             </div>
//             <div className="col">
//               <h6 className="m-0">
//                 <span className="badge bg-secondary">
//                   {statuses.find((status) => d.status === status.value)?.label}
//                 </span>
//               </h6>
//             </div>
//           </div>
//         ))} */}

//         <div
//           className="col-auto p-4 ms-1 mb-2 text-white"
//           style={{
//             borderRadius: "12px",
//           }}
//         >
//           <div className="col ">
//             <div className="d-flex align-items-center gap-1">
//               <div className="col bg-success p-1 rounded">
//                 <p className="fw-normal m-0 ">
//                   From: <span>fullName</span>
//                 </p>
//                 <p className="fw-normal m-0">
//                   <span>d.sDate d.sDateTime</span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="col">
//             <h6 className="m-0">
//               <span className="badge bg-secondary">status label</span>
//             </h6>
//           </div>
//         </div>
//       </div>
//     </div>

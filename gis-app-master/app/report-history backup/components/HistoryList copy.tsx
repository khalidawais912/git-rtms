// "use client";
// import Button from "@/app/components/Button";
// import { getFormattedDate } from "@/app/utils";
// import chevronRight from "@/public/icons/chevronRight.svg";
// import Image from "next/image";
// import Link from "next/link";
// import { IoArrowBack } from "react-icons/io5";
// import { ReportHistory } from "./List";

// const HistoryList = ({ data }: { data: ReportHistory[] }) => {
//   return (
//     <div className="container-fluid p-3">
//       <div
//         className="col"
//         style={{
//           background:
//             "linear-gradient(to bottom right, rgba(239, 239, 239, 1) , rgba(255, 255, 255, 1))",
//           border: "1px solid rgba(255, 255, 255, 0.29)",
//           borderRadius: "15px",
//           padding: "34px 70px",
//           height: "95vh",
//         }}
//       >
//         <div className="row d-flex m-0">
//           <div className="col-lg-4">
//             <div
//               className="col p-4 me-1"
//               style={{
//                 background: "#FAFAFA",
//                 borderRadius: "12px",
//               }}
//             >
//               <div className="row d-flex m-0 mb-2">
//                 {/* <div className="col">
//                   <Image src={pencil} alt="pencil" width={33} height={33} />
//                 </div> */}
//               </div>
//               <h1 className="fw-bold" style={{ fontSize: "36px" }}>
//                 Report history
//               </h1>
//               {/* <p
//                 className="mb-2 fs18px fw-normal"
//                 style={{ color: "#1E1E1E", opacity: 0.8 }}
//               >
//                 Assistant Director
//               </p>
//               <p
//                 className="mb-2 fs18px fw-normal"
//                 style={{ color: "#1E1E1E", opacity: 0.8 }}
//               >
//                 Health BS-17
//               </p>
//               <p
//                 className="mb-2 fs18px fw-normal"
//                 style={{ color: "#1E1E1E", opacity: 0.8 }}
//               >
//                 Submitted To : Mirza Ahmed
//               </p>
//               <p
//                 className="mb-2 fs18px fw-normal"
//                 style={{ color: "#1E1E1E", opacity: 0.8 }}
//               >
//                 Marked from : Mirza Ahmed
//               </p> */}
//               <hr className="mb-4" style={{ opacity: ".1" }} />
//               {data?.map((d) => (
//                 <Button key={d.id} className="btn w-100 text-start p-0 mb-3">
//                   <div
//                     className="row d-flex m-0 bg-white"
//                     style={{ borderRadius: "7px" }}
//                   >
//                     <div className="col">
//                       <p
//                         className="fw-normal p-3 px-1 m-0 "
//                         style={{ opacity: 0.7 }}
//                       >
//                         {new Date(d.sDate).toLocaleDateString("en-GB", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   })}
//                       </p>
//                     </div>
//                     <div className="col-auto m-auto">
//                       <Image
//                         src={chevronRight}
//                         alt="chevronRight"
//                         width={24}
//                         height={24}
//                       />
//                     </div>
//                   </div>
//                 </Button>
//               ))}
//               <Button
//                 className="btn fs18px rounded-pill w-100 py-3 mb-2 fw-bold"
//                 style={{ background: "rgba(38, 50, 56,.05)" }}
//               >
//                 <IoArrowBack size={21} />
//                 &nbsp;&nbsp;&nbsp;Back
//               </Button>
//             </div>
//           </div>
//           <div className="col-lg-8">
//             {data?.map((d) => (
//               <div
//                 key={d.id}
//                 className="col p-4 ms-1 mb-3"
//                 style={{
//                   background: "#FAFAFA",
//                   borderRadius: "12px",
//                 }}
//               >
//                 <div className="row d-flex m-0 mb-3">
//                   <div className="col">
//                     <p className="fw-normal m-0">
//                       From: <span>{d.submittedFrom}</span>
//                     </p>
//                   </div>
//                   <div className="col">
//                     <p className="fw-normal m-0">
//                       To: <span>{d.submittedTo}</span>
//                     </p>
//                   </div>
//                   <div className="col">
//                     <p className="fw-normal m-0">
//                       Date:{" "}
//                       <span>
//                         {new Date(d.sDate).toLocaleDateString("en-GB", {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   })}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="col text-end">
//                     <Link
//                       target="_blank"
//                       href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.reportPath}`}
//                       className="btn rounded-pill fs15px"
//                       style={{ background: "#E4E4E4" }}
//                     >
//                       View PDF Report
//                     </Link>
//                   </div>
//                 </div>
//                 <hr style={{ opacity: ".1" }} />
//                 <p className="mb-1 fw-normal fs18px">Comments</p>
//                 <div
//                   className="mb-2 bg-white p-3"
//                   style={{
//                     borderRadius: "12px",
//                     border: "1px solid rgba(38, 50, 56,.1)",
//                   }}
//                 >
//                   {d.remarks}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HistoryList;

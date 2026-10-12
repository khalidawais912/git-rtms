// import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";
// import {
//   ISSUED_By_AD,
//   SUBMITTED_BY_AD_TO_DD,
//   REVIEWED_AND_FORWARD_BY_DD_TO_D,
//   DD_REFERBACK_ID,
//   REVIEWED_AND_FORWARD_BY_D_TO_DG,
//   D_REFERBACK_ID,
//   APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE,
//   APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE,
//   REVIEWED_AND_APPROVED_BY_DG_TO_D,
//   DG_REFERBACK_ID,
// } from "../statuses";

// const RenderStatusBadge = ({ status }: { status: number }) => {
//   return (
//     <>
//       {status === SUBMITTED_BY_AD_TO_DD ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
//           SUBMITTED_BY_AD_TO_DD
//         </p>
//       ) : status === REVIEWED_AND_FORWARD_BY_DD_TO_D ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
//           REVIEWED_AND_FORWARD_BY_DD_TO_D
//         </p>
//       ) : status === REVIEWED_AND_FORWARD_BY_D_TO_DG ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
//           REVIEWED_AND_FORWARD_BY_D_TO_DG
//         </p>
//       ) : status === REVIEWED_AND_APPROVED_BY_DG_TO_D ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
//           REVIEWED_AND_APPROVED_BY_DG_TO_D
//         </p>
//       ) : status === APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
//           APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE
//         </p>
//       ) : status === APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
//           APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE
//         </p>
//       ) : status === ISSUED_By_AD ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
//           ISSUED_By_AD
//         </p>
//       ) : status === DD_REFERBACK_ID ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoXCircleFill className="bg-white text-danger rounded-circle mb-1" />{" "}
//           DD_REFERBACK_ID
//         </p>
//       ) : status === D_REFERBACK_ID ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoXCircleFill className="bg-white text-danger rounded-circle mb-1" />{" "}
//           D_REFERBACK_ID
//         </p>
//       ) : status === DG_REFERBACK_ID ? (
//         <p
//           className="py-2 mb-0 px-3 rounded-pill"
//           style={{ background: "#E3F0E7" }}
//         >
//           <GoXCircleFill className="bg-white text-danger rounded-circle mb-1" />{" "}
//           DG_REFERBACK_ID
//         </p>
//       ) : (
//         ""
//       )}
//     </>
//   );
// };

// export default RenderStatusBadge;

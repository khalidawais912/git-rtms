// import Button from "@/app/components/Button";
// import { StatusTab } from "../List";

// const Tab = ({ tab }: { tab: StatusTab }) => {
//   return (
//     <div key={tab.status} className="col-auto">
//       <Button
//         className={`btn shadow-none rounded-0 fw-bold position-relative ${
//           selectedButton === tab.status ? "text-dark" : "text-secondary"
//         }`}
//         style={{
//           borderBottom: `${
//             selectedButton === tab.status ? "3px solid #0c8ce9" : ""
//           }`,
//         }}
//         onClick={() => {
//           setSelectedButton(tab.status);
//           handleFilterData(
//             data,
//             tab.status,
//             tab.submittedFrom,
//             tab.submittedTo
//           );
//         }}
//       >
//         {tab.label}
//         <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//           {tab.status === -99 && role === "deputy director"
//             ? data?.filter((d) => d.submittedTo === tab.submittedTo).length
//             : tab.status === -99
//             ? data?.filter(
//                 (d) =>
//                   d.submittedFrom === tab.submittedFrom &&
//                   d.submittedTo === tab.submittedTo
//               ).length
//             : tab.status === 6
//             ? data?.filter((d) => d.lastStatus === tab.status).length
//             : data?.filter(
//                 (d) =>
//                   d.lastStatus === tab.status &&
//                   tab.role === role &&
//                   d.submittedFrom === tab.submittedFrom
//               ).length}
//         </span>
//       </Button>
//     </div>
//   );
// };

// export default Tab;

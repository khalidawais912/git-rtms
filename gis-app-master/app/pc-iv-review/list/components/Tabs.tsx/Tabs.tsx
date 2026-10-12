// import {
//   APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE,
//   D_REFERBACK_ID,
//   DD_REFERBACK_ID,
//   DG_REFERBACK_ID,
//   DG_USER_ID,
//   ISSUED_By_AD,
//   REVIEWED_AND_APPROVED_BY_DG_TO_D,
//   REVIEWED_AND_FORWARD_BY_D_TO_DG,
//   REVIEWED_AND_FORWARD_BY_DD_TO_D,
//   SUBMITTED_BY_AD_TO_DD,
// } from "@/app/report-history/statuses";

// interface Props {
//   role: string;
// }

// const Tabs = ({ role }: Props) => {
//   const DD_USER_ID = 0;
//   const D_USER_ID = 0;
//   const tabs = [
//     {
//       label: "All",
//       status: -99,
//       submittedFrom:
//         role === "deputy director"
//           ? -99
//           : role === "director"
//           ? DG_USER_ID
//           : role === "director general"
//           ? D_USER_ID
//           : -99,
//       submittedTo:
//         role === "deputy director"
//           ? DD_USER_ID
//           : role === "director"
//           ? D_USER_ID
//           : role === "director general"
//           ? DG_USER_ID
//           : -99,
//     },
//     {
//       label: "SUBMITTED BY (AD)",
//       status: SUBMITTED_BY_AD_TO_DD,
//       role: "deputy director",
//       submittedFrom: -99,
//       submittedTo: D_USER_ID,
//     }, // FOR DD
//     {
//       label: "SUBMITTED BY (DD)",
//       status: REVIEWED_AND_FORWARD_BY_DD_TO_D,
//       role: "director",
//       submittedFrom: DD_USER_ID,
//       submittedTo: DG_USER_ID,
//     }, // FOR D
//     {
//       label: "SUBMITTED TO (DIRECTOR)",
//       status: REVIEWED_AND_FORWARD_BY_DD_TO_D,
//       role: "deputy director",
//       submittedFrom: DD_USER_ID,
//       submittedTo: D_USER_ID,
//     }, // FOR DD
//     {
//       label: "SUBMITTED TO (DG)",
//       status: REVIEWED_AND_FORWARD_BY_D_TO_DG,
//       role: "director",
//       submittedFrom: DD_USER_ID,
//       submittedTo: DG_USER_ID,
//     }, // FOR D
//     {
//       label: "SUBMITTED BY (DIRECTOR)",
//       status: REVIEWED_AND_FORWARD_BY_D_TO_DG,
//       role: "director general",
//       submittedFrom: D_USER_ID,
//       submittedTo: DG_USER_ID,
//     }, // FOR DG
//     {
//       label: "SUBMITTED TO (DIRECTOR)",
//       status: REVIEWED_AND_APPROVED_BY_DG_TO_D,
//       role: "director general",
//       submittedFrom: DG_USER_ID,
//       submittedTo: D_USER_ID,
//     }, // FOR D
//     {
//       label: "APPROVED BY (DG)",
//       status: REVIEWED_AND_APPROVED_BY_DG_TO_D,
//       role: "director",
//       submittedFrom: DG_USER_ID,
//       submittedTo: D_USER_ID,
//     }, // FOR D
//     {
//       label: "APPROVED BY (DG)",
//       status: APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE,
//       role: "deputy director",
//       submittedFrom: D_USER_ID,
//       submittedTo: DD_USER_ID,
//     }, // FOR DD
//     {
//       label: "REFERBACK BY (DIRECTOR)",
//       status: D_REFERBACK_ID,
//       role: "deputy director",
//       submittedFrom: D_USER_ID,
//       submittedTo: -99,
//     }, // FOR DD
//     {
//       label: "REFERBACK TO (AD)",
//       status: DD_REFERBACK_ID,
//       role: "deputy director",
//       submittedFrom: DD_USER_ID,
//       submittedTo: -99,
//     }, // FOR DD
//     {
//       label: "REFERBACK BY (DG)",
//       status: DG_REFERBACK_ID,
//       role: "director",
//       submittedFrom: DG_USER_ID,
//       submittedTo: DD_USER_ID,
//     }, // FOR D
//     {
//       label: "REFERBACK TO (DD)",
//       status: D_REFERBACK_ID,
//       role: "director",
//       submittedFrom: D_USER_ID,
//       submittedTo: DD_USER_ID,
//     }, // FOR D
//     {
//       label: "REFERBACK TO (DIRECTOR)",
//       status: DG_REFERBACK_ID,
//       role: "director general",
//       submittedFrom: DG_USER_ID,
//       submittedTo: D_USER_ID,
//     }, // FOR D
//     {
//       label: "ISSUED",
//       status: ISSUED_By_AD,
//       submittedFrom: -99,
//       submittedTo: -99,
//     }, // FOR ALL
//   ];
//   return <div>Tabs</div>;
// };

// export default Tabs;

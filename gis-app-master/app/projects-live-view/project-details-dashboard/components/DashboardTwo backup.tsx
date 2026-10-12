// "use client";

// import { Lexend } from "next/font/google";
// import { useEffect, useState } from "react";
// import Menu from "./Menu";
// import Visits from "./Visits";
// import { useDispatch } from "react-redux";
// import { setContent } from "@/app/features/content/contentSlice";
// import VehicleTracking from "./VehicleTracking";
// import StaffTracking from "./StaffTracking";
// import Reports from "./Reports";
// import VisitDate from "./VisitDate";
// import BottomArea from "./BottomArea";
// import DistributedColumnChart from "./DistributedColumnChart";
// import SimplePieChart from "./SimplePieChart";

// const lexend = Lexend({
//   subsets: ["latin"],
//   weight: "300",
// });

// const DashboardTwo = () => {
//   const [refresh, setRefresh] = useState(false);
//   const dispatch = useDispatch();
//   const handleButtonClick = (content: string) => {
//     dispatch(setContent(content));
//   };

//   useEffect(() => {
//     // Set the background for the body
//     document.body.style.background = "#CFE6F8";
//     document.body.style.backgroundSize = "cover";
//     document.body.style.backgroundRepeat = "no-repeat";

//     handleButtonClick("Dashboard");
//     // Cleanup on unmount
//     return () => {
//       document.body.style.backgroundImage = "";
//     };
//   }, []);

//   return (
//     <div
//       className={`container-fluid p-3 mt-3 mb-4 ${lexend.className}`}
//       style={{
//         backgroundImage:
//           "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
//         border: "1px solid rgba(255, 255, 255, 0.6)",
//         padding: "10px",
//         borderRadius: "10px",
//       }}
//     >
//       <div className="row mb-3 ms-2 me-2">
//         <div className="col-lg-9 col-md-6 col">
//           <Menu />
//         </div>
//         <div className="col-lg-3 col-md-6 col">
//           <Visits />
//         </div>
//       </div>
//       <div className="row mb-3 ms-2 me-2">
//         <div className="col-lg-5 col-md-12 col">
//           <SimplePieChart />
//         </div>
//         <div className="col-lg-7 col-md-12 col">
//           <DistributedColumnChart />
//         </div>
//       </div>
//       <VehicleTracking />
//       <div
//         className="row mb-3"
//         style={{ marginLeft: "0px", marginRight: "0px" }}
//       >
//         <div className="col-lg-6 col-md-12 col">
//           <StaffTracking />
//         </div>
//         <div className="col-lg-6 col-md-12 col ps-0">
//           <div className="row d-flex">
//             <div className="col-lg-6 col-md-6 col-sm-12 p-0">
//               <Reports />
//             </div>
//             <div className="col-lg-6 col-md-6 col-sm-12 p-0">
//               <VisitDate />
//             </div>
//           </div>
//         </div>
//       </div>
//       <BottomArea />
//     </div>
//   );
// };

// export default DashboardTwo;

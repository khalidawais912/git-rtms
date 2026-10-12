// "use client";
// import React, { useEffect, useState } from "react";
// import SectorForm from "../sectors/components/SectorForm";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { PROJECT_API } from "../APIs";
// import { getFormattedDate } from "../utils";

// interface Props {
//   id: number;
//   parentId: number;
//   name: "";
//   description: "";
//   createdAt: "";
//   updateAt: "";
//   sortId: number;
//   parentName: "";
// }

// const TopMenu = () => {
//   const [data, setData] = useState<Props[]>([]);

//   useEffect(() => {
//     const loadItems = async () => {
//       try {
//         const token = Cookies.get("token");
//         if (token) {
//           const response = await axios.get(PROJECT_API, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           });
//           setData(response.data.data);
//         }
//         console.log("api Data:", data);
//       } catch (error) {
//         console.log("Error fetching data:", error);
//       }
//     };
//     loadItems();
//   }, []);

//   useEffect(() => {
//     console.log("new data:", data);
//   }, [data]);
//   return (
//     <>
//       <div className="row d-flex p-3">
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <h4 className="fw-bold">Sectors</h4>
//         </div>
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <div className="row d-flex ">
//             <div className="col d-none d-lg-block"></div>
//             <div className="col text-end">
//               <span className="fw-bold">{new Date().toLocaleDateString(
//     "en-GB",
//     {
//       weekday: "short",
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     },
//   )}</span> Today
//             </div>
//             <div className="col text-end">
//               <SectorForm api={PROJECT_API} method="POST" />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row p-3">
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <p>
//             Showing: <span className="fw-bold">{data?.length} Projects</span>
//           </p>
//         </div>
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <div className="row d-flex align-items-center">
//             <div className="col-lg-4 col-md-4 col-sm-12 text-center">
//               <input type="checkbox" className="form-check-input" />
//               <label htmlFor="">&nbsp;Hide Completed</label>
//             </div>
//             <div className="col-lg-4 col-md-4 col-sm-12 text-center">
//               <input type="checkbox" className="form-check-input" />
//               <label htmlFor="">&nbsp;Show Cancel</label>
//             </div>
//             <div className="col-lg-4 col-md-4 col-sm-12 text-end">
//               <div className="dropdown">
//                 <Button
//                   className="btn btn-sm dropdown-toggle w-100"
//                   style={{ background: "#fff" }}
//                   type="button"
//                   id="dropdownMenuButton1"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   Sort
//                 </Button>
//                 <ul
//                   className="dropdown-menu"
//                   aria-labelledby="dropdownMenuButton1"
//                 >
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Asc. (A-Z)
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Dsc. (Z-A)
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Date
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Random
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Reverse
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TopMenu;

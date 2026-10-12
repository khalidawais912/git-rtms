// "use client";
// import Image from "next/image";
// import calender from "../../public/icons/calendar.svg";
// import trash from "../../public/icons/trash.svg";
// import more from "../../public/icons/more.svg";
// import clock from "../../public/icons/clock.svg";
// import cancel from "../../public/icons/cancel.svg";
// import complete from "../../public/icons/complete.svg";
// import arrowLeft from "../../public/icons/arrow-left.svg";
// import arrowRight from "../../public/icons/arrow-right.svg";
// import axios, { AxiosError } from "axios";
// import { useEffect, useState } from "react";
// import DeleteModal from "./DeleteModal";
// import Cookies from "js-cookie";
// import useProjects from "../hooks/useProjects";
// // import projectService, { Project } from "../services/project-service";

// interface Props {
//   id: number;
//   name: string;
//   sectorId: number;
//   address: string;
//   city: string;
//   locationCoordinates: string;
//   status: string;
//   sectorName: string;
//   groups: string;
// }

// const ProjectsTable = () => {
//   const getRoute = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/Projects`;
//   const [data, setData] = useState<Props[]>([]);

//   useEffect(() => {
//     const loadItems = async () => {
//       try {
//         const token = Cookies.get("token");
//         if (token) {
//           const response = await axios.get(getRoute, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setData(response.data.data);
//         }
//         console.log("api Data:", data);
//       } catch (err) {
//         console.log((err as AxiosError).message);
//       }
//     };
//     loadItems();
//   }, []);
//   useEffect(() => {
//     console.log("new data:", data);
//   }, [data]);

//   return (
//     <div className="table-responsive">
//       <table className="table table-hover mb-5" style={{ border: ".5px solid #858585" }}>
//         <thead>
//           <tr style={{ border: "1px solid #858585" }}>
//             <th>ID</th>
//             <th>NAME</th>
//             <th>Sector Id</th>
//             <th>Address</th>
//             <th>City</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((d) => (
//             <tr key={d.id}>
//               <td>{d.id}</td>
//               <td>{d.name}</td>
//               <td>{d.sectorId}</td>
//               <td>{d.address}</td>
//               <td>{d.city}</td>
//               <td>
//                 <div className="row d-flex">
//                   <div className="col">
//                     <DeleteModal />
//                   </div>
//                   <div className="col">
//                     <Button
//                       className="btn btn-sm rounded-pill"
//                       style={{ background: "#fff" }}
//                     >
//                       <Image src={more} alt="more" />
//                     </Button>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="row d-flex">
//         <div className="col-lg-6 col-md-6 col-sm-12">1 - 11 of 50</div>
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <div className="row d-flex justify-content-end">
//             <div className="col-lg-2 col-md-1 col-sm-12"></div>
//             <div className="col-lg-5 col-md-7 col-sm-12 d-flex justify-content-end mb-2">
//               Rows per page:
//               <div className="dropdown ms-2">
//                 <Button
//                   className="btn btn-sm dropdown-toggle bg-color-sea-green text-white"
//                   type="button"
//                   id="dropdownMenuButton1"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   11
//                 </Button>
//                 <ul
//                   className="dropdown-menu"
//                   aria-labelledby="dropdownMenuButton1"
//                 >
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Action
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Another action
//                     </a>
//                   </li>
//                   <li>
//                     <a className="dropdown-item" href="#">
//                       Something else here
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             <div className="col-lg-3 col-md-4 col-sm-12 text-end">
//               <Button className="btn btn-sm bg-color-sea-green shadow-sm me-2">
//                 <Image src={arrowLeft} alt="arrow left" />
//               </Button>
//               <Button className="btn btn-sm bg-color-sea-green shadow-sm">
//                 <Image src={arrowRight} alt="arrow right" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectsTable;

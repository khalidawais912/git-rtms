// import Modal from "react-bootstrap/Modal";
// import Image from "next/image";
// import { FormEvent, useState } from "react";
// import more from "../../../public/icons/more.svg";
// import { ToastContainer, toast } from "react-toastify";
// import apiClient, { AxiosError } from "@/app/services/api-client";
// import useSectors from "@/app/hooks/useSectors";
// import { Project } from "@/app/hooks/useProjects";

// interface Props {
//   api: string;
//   method: "POST" | "PUT" | "PATCH";
//   id?: number;
//   setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
//   refresh: boolean;
// }

// const ProjectForm = ({ api, method, id, setRefresh, refresh }: Props) => {
//   const { data: sectorsData } = useSectors({ refresh });
//   const [formData, setFormData] = useState<Project>({
//     id: 0,
//     sectorId: 0,
//     name: "",
//     address: "",
//     city: "",
//     locationCoordinates: "",
//     status: "",
//   });
//   const [show, setShow] = useState(false);
//   const modalId = `formModal-${id}`;

//   // error messages
//   const created = "Created Successfully";
//   const updated = "Updated Successfully";
//   const nameError = "Please add Name!";
//   const sectorIdError = "Please add Sector!";

//   const notifyCreate = (message: string) => toast.success(message);
//   const notifyError = (message: string) => toast.error(message);

//   const handleClose = () => setShow(false);
//   const handleShow = async () => {
//     setShow(true);

//     if (method === "PUT") {
//       try {
//         // send a request to the server to add the product
//         const response = await apiClient.get(`${api}/${id}`);
//         const itemData = response.data.data;
//         setFormData({
//           id: itemData.id,
//           sectorId: itemData.sectorId,
//           name: itemData.name,
//           address: itemData.address,
//           city: itemData.city,
//           locationCoordinates: itemData.locationCoordinates,
//           status: itemData.status,
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       setFormData({
//         id: 0,
//         sectorId: 0,
//         name: "",
//         address: "",
//         city: "",
//         locationCoordinates: "",
//         status: "",
//       });
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     switch (true) {
//       case !formData.name:
//         notifyError(nameError);
//         break;

//       case formData.sectorId === 0:
//         notifyError(sectorIdError);
//         break;

//       default:
//         try {
//           if (method === "POST") {
//             const response = await apiClient({
//               method: method,
//               url: api,
//               data: formData,
//             });
//             notifyCreate(created);
//             setFormData({
//               id: 0,
//               sectorId: 0,
//               name: "",
//               address: "",
//               city: "",
//               locationCoordinates: "",
//               status: "",
//             });
//             console.log("response", response);
//             setRefresh((prev) => !prev);
//           } else {
//             const response = await apiClient({
//               method: method,
//               data: formData,
//               url: `${api}/${id}`,
//             });
//             console.log("response", response);
//             notifyCreate(updated);
//           }
//           // handle the response and perform any necessary actions
//           console.log("data", formData);
//         } catch (err) {
//           console.log((err as AxiosError).message);
//           notifyError((err as AxiosError).message);
//         }
//     }
//   };

//   return (
//     <div>
//       {method === "POST" ? (
//         <Button
//           type="button"
//           className="btn btn-sm text-white bg-color-sea-green"
//           onClick={handleShow}
//         >
//           + Project
//         </Button>
//       ) : (
//         <Button
//           className="btn btn-sm rounded-pill"
//           style={{ background: "#fff" }}
//           onClick={handleShow}
//         >
//           <Image src={more} alt="more" />
//         </Button>
//       )}

//       <Modal
//         show={show}
//         onHide={handleClose}
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//         dialogClassName="custom-modal"
//         id={modalId}
//       >
//         <Modal.Body
//           className="p-0"
//           style={{ background: "rgba(156,255,255,0)" }}
//         >
//           <div
//             className="container-fluid pt-3 pb-3 ps-4 pe-4"
//             style={{
//               backgroundImage:
//                 "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
//               borderRadius: "15px",
//               border: "1.7px solid rgba(255, 255, 255, 0.6)",
//             }}
//           >
//             <div className="row flex-column justify-content-center mb-4">
//               <div className="col-lg-12">
//                 {method === "POST" ? (
//                   <p
//                     className="text-center text-white mt-4"
//                     style={{ fontSize: "1.5rem", fontWeight: "800" }}
//                   >
//                     <span>ADD PROJECT</span>
//                   </p>
//                 ) : (
//                   <p
//                     className="text-center text-white mt-4"
//                     style={{ fontSize: "1.5rem", fontWeight: "800" }}
//                   >
//                     <span>UPDATE PROJECT</span>
//                   </p>
//                 )}
//               </div>
//               <form className="ps-5 pe-5" onSubmit={handleSubmit}>
//                 <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
//                   <label htmlFor="name" className="form-label text-white">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm color-light-dark"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter Project Name"
//                   />
//                 </div>
//                 <div className="col mb-3">
//                   <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
//                     <label htmlFor="address" className="form-label text-white">
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control form-control-sm color-light-dark"
//                       id="address"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       placeholder="Enter Address"
//                     />
//                   </div>
//                   <div className="row d-flex justify-content-between">
//                     <div className="col-lg-6 col-md-6 col-sm-12 text-start">
//                       <label htmlFor="status" className="form-label text-white">
//                         Status
//                       </label>
//                       <select
//                         className="form-select form-select-sm color-light-dark"
//                         aria-label="Default select example"
//                         name="status"
//                         onChange={handleChange}
//                       >
//                         <option value="">Select</option>
//                         <option value="Scheduled">Active</option>
//                         <option value="Draft">Draft</option>
//                         <option value="Completed">Completed</option>
//                       </select>
//                     </div>
//                     <div className="col-lg-6 col-md-6 col-sm-12 text-start">
//                       <label
//                         htmlFor="sectorId"
//                         className="form-label text-white"
//                       >
//                         Sector
//                       </label>
//                       <select
//                         className="form-select form-select-sm color-light-dark"
//                         name="sectorId"
//                         onChange={handleChange}
//                         value={formData.sectorId}
//                       >
//                         <option value={0}>None</option>
//                         {sectorsData.length > 0 ? (
//                           sectorsData?.map((d) => (
//                             <option key={d.id} value={d.id}>
//                               {d.name}
//                             </option>
//                           ))
//                         ) : (
//                           <option disabled>Loading...</option>
//                         )}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="row d-flex justify-content-between">
//                   <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
//                     <label htmlFor="city" className="form-label text-white">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control form-control-sm color-light-dark"
//                       id="city"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       placeholder="Enter City Name"
//                     />
//                   </div>
//                 </div>
//                 <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
//                   <label
//                     htmlFor="locationCoordinates"
//                     className="form-label text-white"
//                   >
//                     Location Coordinates
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control form-control-sm color-light-dark"
//                     id="locationCoordinates"
//                     name="locationCoordinates"
//                     value={formData.locationCoordinates}
//                     onChange={handleChange}
//                     placeholder="Enter Location Coordinates"
//                   />
//                 </div>
//                 <div className="col-lg-8 col-md-8 col-sm-6 mx-auto">
//                   <Button
//                     className="btn text-white w-100 border-0"
//                     style={{
//                       backgroundImage:
//                         "linear-gradient(to bottom, #0C8CE9 ,#136AAA)",
//                       borderRadius: "12px",
//                     }}
//                     type="submit"
//                   >
//                     Done
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default ProjectForm;

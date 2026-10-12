import useDriver, { Driver } from "@/app/hooks/useDriver";
import useVehicle, { Vehicle } from "@/app/hooks/useVehicle";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import blueCirclePointer from "@/public/icons/blueCirclePointer.svg";
import fromToDirection from "@/public/icons/fromToDirection.svg";
import greenCircle from "@/public/icons/greenCircle.svg";
import threeCirclesVertical from "@/public/icons/threeCirclesVertical.svg";
import car1Right from "@/public/images/car1Right.png";
import profilePic2 from "@/public/images/profilePic2.png";
import { VehicleTrackings } from "./ProjectDetailsDashboard";

interface Props {
  data: VehicleTrackings[];
}

const VehicleTracking = ({ data }: Props) => {
  const [refresh, setRefresh] = useState(false);

  const { data: vehicles } = useVehicle({ refresh });
  const { data: drivers } = useDriver({ refresh });

  const getVehicleInfo = (vehicleNumber: string, data: Vehicle[]) => {
    const record = data.find((item) => item.vehicleNumber === vehicleNumber);
    return record;
  };

  const getDriverInfo = (driverName: string, data: Driver[]) => {
    const record = data.find((item) => item.driverName === driverName);
    return record;
  };

  return (
    <>
      <div
        className="col bg-color-matte-light-blue shadow-sm p-2 mb-3 mx-2"
        style={{ borderRadius: "17px" }}
      >
        <div className="row d-flex ps-3 pe-3">
          <div className="col">
            <h4 className="fw-bold fs-3">Vehicle Tracking</h4>
          </div>
        </div>
        <div
          className="d-flex me-2"
          style={{
            padding: "10px",
            borderRadius: "10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            // overflowX: "scroll",
            display: "inline-block",
          }}
        >
          {data.map((d, i) => (
            <div
              key={i}
              style={{ width: "500px" }}
              className="col bg-white me-3 rounded-3 p-3"
            >
              <div className="row d-flex justify-content-between m-0">
                <div className="col-auto">
                  <span>
                    {d.officerPicture ? (
                      <img
                        className="img-fluid rounded-circle"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.officerPicture}`}
                        alt="profilePic2"
                        style={{
                          width: "47px",
                          height: "47px",
                          objectFit: "cover",
                          objectPosition: "center top",
                        }}
                      />
                    ) : (
                      <Image
                        className="img-fluid"
                        src={profilePic2}
                        width={47}
                        height={47}
                        style={{ width: "47px", height: "47px" }}
                        alt="profilePic2"
                      />
                    )}
                  </span>
                  <span className="col">
                    <span className="fw-bold m-0 mt-1 ps-1">
                      {d.officerName}
                    </span>
                    {/* <p
                        className="text-secondary fs14px"
                        style={{ marginTop: "-5px", marginBottom: "0" }}
                      >
                        {d.vehicalNumber}
                      </p> */}
                  </span>
                </div>
                <div className="col-auto fw-bold text-end mt-2 fs12px">
                  <Image src={greenCircle} alt="greenCircle" className="mb-1" />
                  <span className="col-auto ps-1" style={{ paddingTop: "1px" }}>
                    {d.visitStatus === "scheduled" ? "Driving" : "Completed"}
                  </span>
                </div>
              </div>

              <div className="col mb-4" style={{ position: "relative" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54392.888661368466!2d74.28403876953124!3d31.563810199999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191b678e6a2e75%3A0xb4c984519f85bf0d!2sDirectorate%20General%20Monitoring%20%26%20Evaluation!5e0!3m2!1sen!2s!4v1726221823092!5m2!1sen!2s"
                  className="mt-2 col-lg-12 col-md-12 col-sm-12 shadow-sm"
                  style={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "15px",
                    height: "160px",
                  }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                <div
                  className="col-auto"
                  style={{
                    position: "absolute", // Absolute positioning relative to the parent
                    bottom: "-25px", // 20px from the bottom of the parent
                    right: "20px", // 20px from the right of the parent
                  }}
                >
                  <Link
                    href="/vehicle-tracking"
                    className="btn p-0 rounded rounded-pill"
                  >
                    <Image src={blueCirclePointer} alt="blueCirclePointer" />
                  </Link>
                </div>
              </div>

              <div
                className="col pb-2 mb-2 me-2 ms-2"
                style={{ borderBottom: "1px dashed #97ABBD", opacity: 0.5 }}
              ></div>

              <div className="row d-flex m-0">
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="row d-flex m-0">
                    <div className="col-auto px-0">
                      <Image src={fromToDirection} alt="fromToDirection" />
                    </div>
                    <div className="col-auto">
                      <p className="m-0 fw-bold">{d.startingDistrict}</p>
                      <p className="m-0" style={{ fontSize: ".75rem" }}>
                        {d.startingDistrict}, Punjab, Pakistan
                      </p>
                      <p className="m-0 mt-3 fw-bold">{d.endDistrict}</p>
                      <p className="m-0" style={{ fontSize: ".75rem" }}>
                        {d.endDistrict}, Punjab, Pakistan
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-8 col-sm-12">
                  <div className="row d-flex mt-2 m-0">
                    <div className="col-auto px-0">
                      <img
                        className="img-fluid rounded-circle"
                        style={{
                          width: "47px",
                          height: "47px",
                          objectFit: "cover",
                        }}
                        src="/images/carFrontCircleBlue.png"
                        alt="carFrontCircleBlue"
                      />
                    </div>
                    <div className="col-auto">
                      <p className="m-0 fw-bold">{d.vehicalNumber}</p>
                      <p className="m-0 fs14px">
                        {getVehicleInfo(d.vehicalNumber, vehicles)?.name}
                      </p>
                      <div className="row d-flex">
                        <div className="col-1" style={{ marginTop: "10px" }}>
                          <Image
                            src={threeCirclesVertical}
                            alt="threeCirclesVertical"
                          />
                        </div>
                        <div className="col p-0">
                          <p className="m-0 mt-1 fs14px">
                            Modal:{" "}
                            <span className="text-secondary">
                              {getVehicleInfo(d.vehicalNumber, vehicles)?.model}
                            </span>
                          </p>
                          <p
                            className="fs14px"
                            style={{ marginTop: "1px", marginBottom: "0" }}
                          >
                            No Plate :{" "}
                            <span className="text-secondary">
                              {d.vehicalNumber}
                            </span>
                          </p>
                          <p
                            className="fs14px"
                            style={{ marginTop: "3px", marginBottom: "0" }}
                          >
                            Contact No :{" "}
                            <span className="text-secondary">
                              {
                                getDriverInfo(d.driverName, drivers)
                                  ?.mobileNumber
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 text-end pe-4">
                  {d.vehicalPicture ? (
                    <img
                      className="img-fluid"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.vehicalPicture}`}
                      alt="carImage"
                      style={{
                        width: "145px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Image
                      src={car1Right}
                      alt="car1Right"
                      className="img-fluid"
                      width={145}
                      height={72}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VehicleTracking;

// {data.map((d, i) => (
//   <div
//     key={i}
//     style={{ width: "500px" }}
//     className="bg-white me-3 rounded-3 p-3"
//   >
//     <div className="row d-flex">
//       <div className="col">
//         <div className="row d-flex">
//           <div className="col-lg-3 col-md-3 col-sm-12">
//             {d.officerPicture ? (
//               <img
//                 className="img-fluid rounded-circle"
//                 src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.officerPicture}`}
//                 alt="profilePic2"
//                 width={47}
//                 height={47}
//                 style={{
//                   width: "47px",
//                   height: "47px",
//                   objectFit: "cover",
//                   objectPosition: "center top",
//                 }}
//               />
//             ) : (
//               <Image
//                 className="img-fluid"
//                 src={profilePic2}
//                 width={47}
//                 height={47}
//                 style={{ width: "47px", height: "47px" }}
//                 alt="profilePic2"
//               />
//             )}
//           </div>
//           <div className="col-lg-9 col-md-4 col-sm-12 ps-lg-0">
//             <p className="fw-bold m-0 mt-1">{d.officerName}</p>
//           </div>
//         </div>
//       </div>
//       <div className="col-lg-5 col-md-5 col fw-bold text-end mt-2 fs12px">
//         <div className="row d-flex justify-content-end pe-3">
//           <div className="col-lg-1 col-md-1 col p-0">
//             <Image src={greenCircle} alt="greenCircle" />
//           </div>
//           <div
//             className="col-lg-4 col-md-5 col ps-1"
//             style={{ paddingTop: "1px" }}
//           >
//             {d.visitStatus === "scheduled" ? "Driving" : "Completed"}
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="col mb-4" style={{ position: "relative" }}>
//       <iframe
//         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54392.888661368466!2d74.28403876953124!3d31.563810199999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191b678e6a2e75%3A0xb4c984519f85bf0d!2sDirectorate%20General%20Monitoring%20%26%20Evaluation!5e0!3m2!1sen!2s!4v1726221823092!5m2!1sen!2s"
//         className="mt-2 col-lg-12 col-md-12 col-sm-12 shadow-sm"
//         style={{
//           border: "1px solid #E0E0E0",
//           borderRadius: "15px",
//           height: "160px",
//         }}
//         allowFullScreen={true}
//         loading="lazy"
//         referrerPolicy="no-referrer-when-downgrade"
//       ></iframe>

//       <div
//         className="col-lg-3 col-md-4 col-sm-6 col-6 p-0"
//         style={{
//           position: "absolute", // Absolute positioning relative to the parent
//           bottom: "-25px", // 20px from the bottom of the parent
//           right: "-50px", // 20px from the right of the parent
//         }}
//       >
//         <Link
//           href="/vehicle-tracking"
//           className="btn p-0 rounded rounded-pill"
//         >
//           <Image src={blueCirclePointer} alt="blueCirclePointer" />
//         </Link>
//       </div>
//     </div>
//     <div className="row d-flex">
//       <div className="col-lg-6 col-md-6 col-sm-12">
//         <div className="row d-flex flex-column">
//           <div className="col">
//             <div className="row d-flex">
//               <div className="col-2 me-2">
//                 <Image src={fromToDirection} alt="fromToDirection" />
//               </div>
//               <div className="col">
//                 <p className="m-0 fw-bold">{d.startingDistrict}</p>
//                 <p className="m-0" style={{ fontSize: ".75rem" }}>
//                   Lahore, Punjab, Pakistan
//                 </p>
//                 <p className="m-0 mt-3 fw-bold">{d.endDistrict}</p>
//                 <p className="m-0" style={{ fontSize: ".75rem" }}>
//                   Lahore, Punjab, Pakistan
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="col-lg-6 col-md-6 col-sm-12 text-end pe-4">
//         {d.vehicalPicture ? (
//           <img
//             className="img-fluid"
//             src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.vehicalPicture}`}
//             alt="carImage"
//             style={{
//               width: "145px",
//               height: "72px",
//               objectFit: "contain",
//             }}
//           />
//         ) : (
//           <Image
//             src={car1Right}
//             alt="car1Right"
//             className="img-fluid"
//             width={145}
//             height={72}
//           />
//         )}
//       </div>
//     </div>
//     <div
//       className="col pb-2 mb-2 me-2 ms-2"
//       style={{ borderBottom: "1px dashed #97ABBD", opacity: 0.5 }}
//     ></div>
//     <div className="row d-flex">
//       <div className="col-lg-7 col-md-8 col-sm-12">
//         <div className="row d-flex">
//           <div className="col-lg-3 col-md-3 col-sm-12 mb-1">
//             <img
//               className="img-fluid rounded-circle"
//               style={{
//                 width: "47px",
//                 height: "47px",
//                 objectFit: "cover",
//               }}
//               src="/images/carFrontCircleBlue.png"
//               alt="carFrontCircleBlue"
//             />
//           </div>
//           <div className="col-lg-9 col-md-9 col-sm-12 p-0">
//             <p className="m-0 fw-bold">{d.vehicalNumber}</p>
//             <p className="m-0 fs14px">
//               {getVehicleInfo(d.vehicalNumber, vehicles)?.name}
//             </p>
//             <div className="row d-flex">
//               <div className="col-1" style={{ marginTop: "10px" }}>
//                 <Image
//                   src={threeCirclesVertical}
//                   alt="threeCirclesVertical"
//                 />
//               </div>
//               <div className="col p-0">
//                 <p className="m-0 mt-1 fs14px">
//                   Modal:{" "}
//                   <span className="text-secondary">
//                     {getVehicleInfo(d.vehicalNumber, vehicles)?.model}
//                   </span>
//                 </p>
//                 <p
//                   className="fs14px"
//                   style={{ marginTop: "1px", marginBottom: "0" }}
//                 >
//                   No Plate :{" "}
//                   <span className="text-secondary">
//                     {d.vehicalNumber}
//                   </span>
//                 </p>
//                 <p
//                   className="fs14px"
//                   style={{ marginTop: "3px", marginBottom: "0" }}
//                 >
//                   Contact No :{" "}
//                   <span className="text-secondary">
//                     {
//                       getDriverInfo(d.driverName, drivers)
//                         ?.mobileNumber
//                     }
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// ))}

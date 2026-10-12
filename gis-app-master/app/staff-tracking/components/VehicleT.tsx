import Button from "@/app/components/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import blueCirclePointer from "../../../public/icons/blueCirclePointer.svg";
import call from "../../../public/icons/call.svg";
import distance from "../../../public/icons/distance.svg";
import fromToDirection from "../../../public/icons/fromToDirection.svg";
import greenCircle from "../../../public/icons/greenCircle.svg";
import message from "../../../public/icons/message.svg";
import redCircle from "../../../public/icons/redCircle.svg";
import threeCirclesVertical from "../../../public/icons/threeCirclesVertical.svg";
import car1Right from "../../../public/images/car1Right.png";
import car2Left from "../../../public/images/car2Left.png";
import car3Left from "../../../public/images/car3Left.png";
import carFrontCircleBlue from "../../../public/images/carFrontCircleBlue.png";
import profilePic2 from "../../../public/images/profilePic2.png";

const VehicleT = () => {
  const items = [
    {
      driverName: "Jamshed Ali",
      carName: "Toyota Corolla GLi",
      carIcon: car1Right,
    },
    {
      driverName: "Haroon",
      carName: "Suzuki Swift",
      carIcon: car2Left,
    },
    {
      driverName: "Hammad",
      carName: "Suzuki Alto",
      carIcon: car3Left,
    },
    {
      driverName: "Jamshed Ali",
      carName: "Toyota Corolla GLi",
      carIcon: car1Right,
    },
    {
      driverName: "Haroon",
      carName: "Suzuki Swift",
      carIcon: car2Left,
    },
    {
      driverName: "Hammad",
      carName: "Suzuki Alto",
      carIcon: car3Left,
    },
  ];
  const refContainer = useRef<HTMLDivElement>(null);
  const refContent = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({});

  useEffect(() => {
    // Wait until both container and content are rendered
    if (refContainer.current && refContent.current) {
      // Calculate the width difference between container and content
      const containerWidth = refContainer.current.offsetWidth;
      const contentWidth = refContent.current.scrollWidth;
      // Set drag constraints dynamically based on the difference
      setConstraints({ right: 0, left: -(contentWidth - containerWidth) });
    }
  }, []); // Recalculate if the items change

  return (
    <>
      <div className="row d-flex mb-3 ps-3 pe-3">
        <div className="col">
          <h4 className="fw-bold fs-3">Vehicle Tracking</h4>
        </div>
        <div className="col text-end">
          <Button
            className="btn bg-color-sea-blue text-white"
            style={{
              fontSize: ".75rem",
              padding: "10px 15px 10px 15px",
            }}
          >
            VISIT DETAILS
          </Button>
        </div>
      </div>
      <div
        className="row p-3 mt-3 mb-4 shadow-sm ms-3 me-3"
        ref={refContainer}
        style={{
          background: "rgba(209, 209, 209, 0.4)",
          padding: "10px",
          borderRadius: "10px",
          overflowX: "scroll",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <motion.div
          className="d-flex"
          drag="x" // Allow horizontal dragging
          dragConstraints={constraints} // Adjust based on content size
          ref={refContent}
          whileTap={{ cursor: "grabbing" }}
        >
          {items.map((d, i) => (
            <div
              key={i}
              className="col-lg-4 col-md-8 col-sm-12 bg-white me-3 rounded-3 p-3"
            >
              <div className="row d-flex">
                <div className="col">
                  <div className="row d-flex">
                    <div className="col-lg-3 col-md-3 col">
                      <Image
                        className="img-fluid"
                        src={profilePic2}
                        alt="profilePic2"
                        width={47}
                        height={47}
                      />
                    </div>
                    <div className="col-lg-9 col-md-4 col ps-lg-0">
                      <p className="fw-bold m-0">{d.driverName}</p>
                      <p
                        className="text-secondary fs14px"
                        style={{ marginTop: "-5px", marginBottom: "0" }}
                      >
                        {d.carName}
                      </p>
                      <span className=""></span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-5 col fw-bold text-end mt-2 fs12px">
                  <div className="row d-flex justify-content-end pe-3">
                    <div className="col-lg-1 col-md-1 col p-0">
                      <Image src={greenCircle} alt="greenCircle" />
                    </div>
                    <div
                      className="col-lg-4 col-md-5 col ps-1"
                      style={{ paddingTop: "1px" }}
                    >
                      Driving
                    </div>
                  </div>
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

                {/* Button in the bottom-right corner of the parent div */}
                <div
                  className="col-lg-3 col-md-4 col p-0"
                  style={{
                    position: "absolute", // Absolute positioning relative to the parent
                    bottom: "-25px", // 20px from the bottom of the parent
                    right: "-50px", // 20px from the right of the parent
                  }}
                >
                  <Button className="btn p-0 rounded rounded-pill">
                    <Image src={blueCirclePointer} alt="blueCirclePointer" />
                  </Button>
                </div>
              </div>
              <div className="row d-flex">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="row d-flex flex-column">
                    <div className="col">
                      <div className="row d-flex">
                        <div className="col-2 me-2">
                          <Image src={fromToDirection} alt="fromToDirection" />
                        </div>
                        <div className="col">
                          <p className="m-0 fw-bold">Ring Road</p>
                          <p className="m-0" style={{ fontSize: ".75rem" }}>
                            Lahore, Punjab, Pakistan
                          </p>
                          <p className="m-0 mt-3 fw-bold">Maraka Village</p>
                          <p className="m-0" style={{ fontSize: ".75rem" }}>
                            Lahore, Punjab, Pakistan
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 text-end pe-4">
                  <Image
                    className="img-fluid"
                    src={d.carIcon}
                    alt="d.carIcon"
                    width={145}
                    height={72}
                  />
                  <p className="m-0 mt-2 fs14px text-secondary">
                    <Image src={distance} alt="distance" />
                    &nbsp;12 kms, 1 hrs 24 mins
                  </p>
                  <p className="m-0 fs12px" style={{ color: "#B0B0B0" }}>
                    last updated. 23 secs ago
                  </p>
                </div>
              </div>
              <div
                className="col pb-2 mb-2 me-2 ms-2"
                style={{ borderBottom: "1px dashed #97ABBD", opacity: 0.5 }}
              ></div>
              <div className="row d-flex">
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <div className="row d-flex">
                    <div className="col-lg-3 col-md-3 col-sm-12 mb-1">
                      <Image
                        className="img-fluid"
                        width={47}
                        height={47}
                        src={carFrontCircleBlue}
                        alt="carFrontCircleBlue"
                      />
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 p-0">
                      <p className="m-0 fw-bold">EV-2017002346</p>
                      <p className="m-0 fs14px">Toyota Corolla GLi</p>
                      <div className="row d-flex">
                        <div className="col-1" style={{ marginTop: "10px" }}>
                          <Image
                            src={threeCirclesVertical}
                            alt="threeCirclesVertical"
                          />
                        </div>
                        <div className="col p-0">
                          <p className="m-0 mt-1 fs14px">
                            Modal: <span className="text-secondary">2017</span>
                          </p>
                          <p
                            className="fs14px"
                            style={{ marginTop: "1px", marginBottom: "0" }}
                          >
                            No Plate :{" "}
                            <span className="text-secondary">LEG-7000</span>
                          </p>
                          <p
                            className="fs14px"
                            style={{ marginTop: "3px", marginBottom: "0" }}
                          >
                            Contact No :{" "}
                            <span className="text-secondary">03218956342</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-4 col-sm-12 text-end">
                  <Image src={call} alt="call" />
                  &nbsp;
                  <Button type="button" className="btn p-0 position-relative">
                    <Image src={message} alt="message" />
                    <span className="position-absolute top-0 start-100 translate-middle">
                      <Image src={redCircle} alt="redCircle" />
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default VehicleT;

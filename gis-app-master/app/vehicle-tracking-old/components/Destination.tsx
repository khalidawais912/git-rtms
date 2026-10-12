import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import blueCircle from "../../../public/icons/blueCircle.svg";
import greenCircle from "../../../public/icons/greenCircle.svg";
import radioBlue from "../../../public/icons/radioBlue.svg";
import radioGreen from "../../../public/icons/radioGreen.svg";
import carTop from "../../../public/images/carTop.png";
import locationPointRoad from "../../../public/images/locationPointRoad.png";
import profilePic6 from "../../../public/images/profilePic6.png";

const Destination = () => {
  const [activeButton, setActiveButton] = useState<string>("available");

  const items2 = ["a", "a", "a", "a"];

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
    <div className="col bg-transparent">
      <div className="row d-flex pt-0 pb-2 m-0">
        <div
          className="col-lg-12 col-md-12 col-sm-12 p-0"
          ref={refContainer}
          style={{
            whiteSpace: "nowrap",
            overflowY: "scroll",
            position: "relative",
            overflow: "hidden",
            borderRadius: "12px",
          }}
        >
          <motion.div
            className="d-flex"
            drag="x" // Allow horizontal dragging
            dragConstraints={constraints} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
            ref={refContent}
          >
            {items2.map((d, i) => (
              <div
                key={i}
                className="col-lg-6 col-md-8 col-sm-12 mt-2 mb-2 me-3 bg-white shadow-sm"
                style={{
                  border: "1px solid #D5DEEF",
                  borderRadius: "12px",
                }}
              >
                <div
                  className="row d-flex m-0 p-2"
                  style={{
                    background: "#F4F6F9",
                    borderTopRightRadius: "12px",
                    borderTopLeftRadius: "12px",
                  }}
                >
                  <div className="col">
                    <p
                      className="fw-normal m-0 fs14px"
                      style={{
                        color: "#2E374C",
                        letterSpacing: "1px",
                      }}
                    >
                      <Image src={radioGreen} alt="radioGreen" /> Lahore Ring
                      Road
                    </p>
                  </div>
                  <div className="col text-center">
                    <p className="m-0 fw-normal fs14px">
                      <span className="fw-bold">District:</span> Lahore
                    </p>
                  </div>
                  <div className="col text-end fs14px">
                    <p className="m-0">
                      <span className="fw-bold">Officer:</span> Ahmed
                    </p>
                  </div>
                </div>
                <div className="row d-flex pe-0 m-0">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="row d-flex p-2 mt-1">
                      <div className="col-lg-2 col-md-2 col-sm-12 text-center ps-2">
                        <Image
                          src={profilePic6}
                          className="img-fluid mb-2"
                          style={{ width: "auto", height: "auto" }}
                          alt="profilePic6"
                        />
                      </div>
                      <div className="col-lg-6 col-md-6 col mt-2 ps-1">
                        <p className="m-0 fs18px fw-bold">Amjad Ali Aga</p>
                        <p
                          className="m-0 fs14px fw-normal mb-4"
                          style={{ color: "#757575" }}
                        >
                          Suzuki Alto - White - 660
                        </p>
                      </div>
                      <div className="col-lg-4 col-md-4 col mt-2 text-end pe-1">
                        <span
                          className="m-0 rounded-pill text-center fs14px fw-bold ps-3 pe-3 pt-1 pb-1"
                          style={{
                            background: "#D9E7FF",
                            color: "#0F60FF",
                          }}
                        >
                          <Image src={blueCircle} alt="blueCircle" /> on the
                          road
                        </span>
                      </div>
                    </div>
                    <div className="row d-flex justify-content-between ps-3 pe-3 mb-2">
                      <div className="col-1 p-0 text-end">
                        <Image
                          src={radioGreen}
                          className="mb-3"
                          alt="radioGreen"
                        />
                        <p
                          className="fs10px fw-normal"
                          style={{
                            marginTop: "-13px",
                            marginBottom: "0",
                            paddingLeft: "20px",
                          }}
                        >
                          Gujrat
                        </p>
                      </div>
                      <div className="col p-0 position-relative">
                        <div className="col p-0">
                          <hr className="dropdown-divider position-absolute w-100" />
                        </div>
                        <div className="row d-flex justify-content-between m-0">
                          <div
                            className="col p-0 text-center"
                            style={{ zIndex: 1 }}
                          >
                            <Image
                              src={greenCircle}
                              style={{ marginBottom: "10px" }}
                              alt="greenCircle"
                            />
                            <p
                              className="fs10px fw-normal"
                              style={{ marginTop: "-5px", marginBottom: "0" }}
                            >
                              Wazirabad
                            </p>
                          </div>
                          <div
                            className="col p-0 text-center"
                            style={{ marginTop: "-3px", zIndex: 1 }}
                          >
                            <Image src={carTop} alt="carTop" />
                            <p
                              className="fs10px fw-normal"
                              style={{ marginTop: "-50px", marginBottom: "0" }}
                            >
                              <Image
                                src={locationPointRoad}
                                className="mb-1"
                                alt="locationPointRoad"
                              />
                            </p>
                          </div>
                          <div
                            className="col p-0 text-center"
                            style={{ zIndex: 1 }}
                          >
                            <Image
                              src={blueCircle}
                              style={{ marginBottom: "10px" }}
                              alt="blueCircle"
                            />
                            <p
                              className="fs10px fw-normal"
                              style={{ marginTop: "-5px", marginBottom: "0" }}
                            >
                              Daska
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-1 p-0" style={{ zIndex: 1 }}>
                        <Image
                          src={radioBlue}
                          className="mb-3"
                          alt="radioBlue"
                        />
                        <p
                          className="fs10px fw-normal"
                          style={{
                            marginTop: "-13px",
                            marginBottom: "0",
                            marginLeft: "-8px",
                          }}
                        >
                          Lahore
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Destination;

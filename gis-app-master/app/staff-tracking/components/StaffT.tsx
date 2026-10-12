import Button from "@/app/components/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import calendar from "../../../public/icons/calendar.svg";
import compass from "../../../public/icons/compass.svg";
import locationPointBlue2 from "../../../public/icons/locationPointBlue2.svg";
import more from "../../../public/icons/more.svg";
import phone from "../../../public/icons/phone.svg";
import twoCirclesVertical from "../../../public/icons/twoCirclesVertical.svg";
import profilePic3 from "../../../public/images/profilePic3.png";
import profilePic4 from "../../../public/images/profilePic4.png";
import profilePic5 from "../../../public/images/profilePic5.png";

const StaffT = () => {
  const items = ["a", "a", "a", "a", "a", "a"];
  const items2 = ["a", "a", "a", "a", "a", "a"];

  const refContainer1 = useRef<HTMLDivElement>(null);
  const refContent1 = useRef<HTMLDivElement>(null);
  const [constraints1, setConstraints1] = useState({});

  useEffect(() => {
    // Wait until both container and content are rendered
    if (refContainer1.current && refContent1.current) {
      // Calculate the width difference between container and content
      const containerHeight = refContainer1.current.offsetHeight;
      const contentHeight = refContent1.current.scrollHeight;
      // Set drag constraints dynamically based on the difference
      setConstraints1({ bottom: 0, top: -(contentHeight - containerHeight) });
    }
  }, []); // Recalculate if the items change

  const refContainer2 = useRef<HTMLDivElement>(null);
  const refContent2 = useRef<HTMLDivElement>(null);
  const [constraints2, setConstraints2] = useState({});

  useEffect(() => {
    // Wait until both container and content are rendered
    if (refContainer2.current && refContent2.current) {
      // Calculate the width difference between container and content
      const containerHeight = refContainer2.current.offsetHeight;
      const contentHeight = refContent2.current.scrollHeight;
      // Set drag constraints dynamically based on the difference
      setConstraints2({ bottom: 0, top: -(contentHeight - containerHeight) });
    }
  }, []); // Recalculate if the items change

  return (
    <div
      className="col shadow-sm mb-3 ms-2 me-2"
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="col"
        style={{
          borderBottom: "1px dashed #97ABBD",
          marginRight: "35px",
          marginLeft: "35px",
          marginBottom: "15px",
          paddingTop: "20px",
        }}
      >
        <div className="row d-flex mb-1">
          <div className="col">
            <h4 className="fw-bold mt-2">Staff Tracking</h4>
          </div>
          <div className="col text-end">
            <Button
              className="btn bg-color-sea-blue text-white shadow"
              style={{
                fontSize: ".75rem",
                padding: "15px 20px 15px 20px",
                fontWeight: 600,
                letterSpacing: "2px",
              }}
            >
              VISIT DETAILS
            </Button>
          </div>
        </div>
      </div>
      <div className="row d-flex p-5 pt-0 pb-2">
        <div
          className="col-lg-5 col-md-5 col-sm-12"
          ref={refContainer1}
          style={{
            height: "255px",
            whiteSpace: "nowrap",
            overflowY: "scroll",
            overflow: "hidden",
          }}
        >
          <motion.div
            className="d-flex flex-column"
            drag="y" // Allow horizontal dragging
            dragConstraints={constraints1} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
            ref={refContent1}
          >
            {items.map((d, i) => (
              <div key={i} className="row d-flex bg-white rounded-3 p-2 mb-2">
                <div className="col-lg-10 col-md-10 col-sm-12 p-0">
                  <div className="row d-flex">
                    <div className="col-lg-2 col-md-2 col me-3">
                      <Image src={profilePic3} alt="profilePic3" />
                    </div>
                    <div className="col-lg-8 col-md-9 col">
                      <p className="m-0 mt-1 fs13px fw-bold">Sundas</p>
                      <p className="m-0 fs10px">Directorate of finance</p>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-2 col-md-2 col text-end"
                  style={{ marginTop: "13px" }}
                >
                  <Image src={compass} alt="compass" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div
          className="col-lg-7 col-md-7 col-sm-12"
          ref={refContainer2}
          style={{
            height: "255px",
            whiteSpace: "nowrap",
            overflowY: "scroll",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            className="d-flex flex-column"
            drag="y" // Allow horizontal dragging
            dragConstraints={constraints2} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
            ref={refContent2}
          >
            {items2.map((d, i) => (
              <div
                key={i}
                className="row d-flex bg-white rounded-3 p-2 mb-2 ms-2"
              >
                <div className="row d-flex pe-0">
                  <div className="col-lg-10 col-md-10 col-sm-12 p-0">
                    <div className="row d-flex p-2">
                      <div className="col-lg-1 col-md-1 col-sm-12 ms-2">
                        <Image
                          src={locationPointBlue2}
                          alt="locationPointBlue2"
                        />
                      </div>
                      <div className="col-lg-9 col-md-9 col">
                        <p className="m-0 fs14px fw-bold">Thoker Niaz Baig</p>
                        <p className="m-0 fs14px" style={{ color: "#A7ABC0" }}>
                          last updated. 23 secs ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2 col text-end p-0">
                    <Button className="btn p-0">
                      <Image
                        style={{ transform: "rotate(90deg)" }}
                        src={more}
                        alt="more"
                      />
                    </Button>
                  </div>
                </div>
                <div className="row d-flex ps-3 mb-2">
                  <div className="col">
                    <div className="row d-flex">
                      <div className="col-1 mt-1">
                        <Image
                          src={twoCirclesVertical}
                          alt="twoCirclesVertical"
                        />
                      </div>
                      <div className="col">
                        <p className="m-0 fs14px text-secondary">10 : 40 AM</p>
                        <p className="m-0 mt-1 fs14px text-secondary">
                          05 : 00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col text-end mt-3">
                    <Image
                      className="img-fluid"
                      src={profilePic4}
                      alt="profilePic4"
                      style={{ position: "absolute", marginLeft: "0px" }}
                      width={20}
                      height={20}
                    />
                    <Image
                      className="img-fluid"
                      src={profilePic4}
                      style={{ position: "absolute", marginLeft: "-10px" }}
                      alt="profilePic4"
                      width={20}
                      height={20}
                    />

                    <Image
                      className="img-fluid"
                      src={profilePic4}
                      style={{ position: "absolute", marginLeft: "-20px" }}
                      alt="profilePic4"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className="row d-flex justify-content-between pe-0">
                  <div className="col fs12px">
                    <Image
                      className="img-fluid"
                      src={profilePic5}
                      alt="profilePic5"
                    />
                    &nbsp;Areef
                  </div>
                  <div className="col fs10px text-center">
                    <Image src={phone} alt="phone" />
                    &nbsp;03182300642
                  </div>
                  <div className="col fs10px text-end pe-1">
                    <Image src={calendar} alt="calendar" />
                    &nbsp;5 Sep 2024
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

export default StaffT;

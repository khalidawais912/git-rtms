import Button from "@/app/components/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import calendar from "../../../public/icons/calendar.svg";
import locationPointBlue2 from "../../../public/icons/locationPointBlue2.svg";
import moreDotsBlue from "../../../public/icons/moreDotsBlue.svg";
import phone from "../../../public/icons/phone.svg";
import twoCirclesVertical from "../../../public/icons/twoCirclesVertical.svg";
import profilePic5 from "../../../public/images/profilePic5.png";

const ScheduleVisit = () => {
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
      className="col mb-3 ms-2 me-2"
      style={{ borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="col"
        style={{
          marginRight: "10px",
          marginLeft: "10px",
          marginBottom: "15px",
          paddingTop: "20px",
        }}
      >
        <div className="row d-flex mb-1">
          <div className="col">
            <h4 className="fw-bold fs18px mt-2">Schedule Visit</h4>
          </div>
          <div className="col text-end">
            <Button
              className="btn rounded-pill fs14px color-sea-blue fw-normal"
              style={{
                padding: "10px 20px 10px 20px",
                background: "#E0EEFC",
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <div
        className="row d-flex p-2 m-0 bg-color-matte-light-blue shadow-sm"
        style={{ borderRadius: "10px" }}
      >
        <div
          className="col-lg-12 col-md-12 col-sm-12"
          ref={refContainer2}
          style={{
            height: "530px",
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
                className="row d-flex bg-white p-2 mb-2"
                style={{ borderRadius: "8px" }}
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
                        src={moreDotsBlue}
                        alt="moreDotsBlue"
                        width={18}
                        height={4}
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
                </div>
                <div className="row d-flex justify-content-between pe-0">
                  <div className="col fs12px">
                    <Image
                      className="img-fluid"
                      src={profilePic5}
                      alt="profilePic5"
                    />
                    &nbsp;&nbsp;Areef
                  </div>
                  <div
                    className="col fs10px text-center"
                    style={{ marginTop: "3px" }}
                  >
                    <Image src={phone} alt="phone" />
                    &nbsp;&nbsp;03182300642
                  </div>
                  <div
                    className="col fs10px text-end pe-1"
                    style={{ marginTop: "1px" }}
                  >
                    <Image src={calendar} alt="calendar" className="mb-1" />
                    &nbsp;&nbsp;5 Sep 2024
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

export default ScheduleVisit;

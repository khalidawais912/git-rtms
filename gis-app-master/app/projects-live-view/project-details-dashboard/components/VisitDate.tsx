import { getFormattedDate } from "@/app/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import blueClock from "../../../public/icons/blueClock.svg";
import { StaffTrackings } from "./ProjectDetailsDashboard";

interface Props {
  data: StaffTrackings[];
}

const VisitDate = ({ data }: Props) => {
  const items = ["a", "a", "a", "a"];

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

  return (
    <div
      className="col shadow-sm mb-3 ms-3 me-3 pt-4 ps-4 pe-4 "
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div className="row d-flex m-0">
        <div
          className="col pb-1 mb-3"
          style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="col">
            <h4 className="fw-bold mt-2">Visit Date</h4>
          </div>
        </div>
      </div>
      <div className="row pb-2">
        <div
          className="col"
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
            ref={refContent1}
            drag="y" // Allow horizontal dragging
            dragConstraints={constraints1} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
          >
            {data.map((d, i) => (
              <div
                key={i}
                className="row d-flex p-2 mb-2 bg-white ms-2 me-2"
                style={{
                  borderRadius: "10px",
                }}
              >
                <div className="col-lg-3 col-md-3 col mt-2">
                  <Image src={blueClock} alt="blueClock" />
                </div>
                <div className="col-lg-9 col-md-9 col ps-0">
                  <p className="m-0 mt-1 fs14px">Lahore Ring Road</p>
                  <p className="m-0 fw-bold fs-5">
                    {new Date(d.planStartDate).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="m-0 fs12px" style={{ color: "#B1B1B1" }}>
                    2 days ago
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisitDate;

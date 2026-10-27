import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import blueClock from "../../../public/icons/blueClock.svg";

const Visits = () => {
  const items = ["a", "a", "a", "a", "a"];

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
    <div
      className="col shadow-sm m-2 p-2 pe-4 ps-3 "
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="row d-flex"
        ref={refContainer}
        style={{
          overflowX: "scroll",
          overflow: "hidden",
        }}
      >
        <motion.div
          className="d-flex"
          ref={refContent}
          drag="x" // Allow horizontal dragging
          dragConstraints={constraints} // Adjust based on content size
          whileTap={{ cursor: "grabbing" }}
        >
          {items.map((d, i) => (
            <div
              key={i}
              className="col-lg-3 col-md-6 col p-2 ps-3 mb-0 me-3 bg-white"
              style={{
                borderRadius: "10px",
              }}
            >
              <div className="row d-flex">
                <div className="col-lg-3 col-md-3 col mt-2">
                  <Image src={blueClock} alt="blueClock" />
                </div>
                <div className="col-lg-9 col-md-9 col">
                  <p className="m-0 mt-1 fs14px">Lahore Ring Road</p>
                  <p className="m-0 fw-bold fs-5">30/03/2024</p>
                  <p className="m-0 fs12px" style={{ color: "#B1B1B1" }}>
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Visits;

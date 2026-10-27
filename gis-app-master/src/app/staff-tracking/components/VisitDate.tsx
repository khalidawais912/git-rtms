import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import blueClock from "../../../public/icons/blueClock.svg";

const VisitDate = () => {
  const items = ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a"];

  const refContainer1 = useRef<HTMLDivElement>(null);
  const refContent1 = useRef<HTMLDivElement>(null);
  const [constraints1, setConstraints1] = useState({});

  useEffect(() => {
    // Wait until both container and content are rendered
    if (refContainer1.current && refContent1.current) {
      // Calculate the width difference between container and content
      const containerWidth = refContainer1.current.offsetWidth;
      const contentWidth = refContent1.current.scrollWidth;
      // Set drag constraints dynamically based on the difference
      setConstraints1({ right: 0, left: -(contentWidth - containerWidth) });
    }
  }, []); // Recalculate if the items change

  return (
    <div className="col mt-2">
      <div className="row  m-0" style={{ borderRadius: "15px" }}>
        <div
          className="col pt-2 shadow-sm ps-0 bg-color-matte-light-blue"
          ref={refContainer1}
          style={{
            height: "104px",
            whiteSpace: "nowrap",
            overflowY: "scroll",
            overflow: "hidden",
            borderRadius: "15px",
          }}
        >
          <motion.div
            className="d-flex"
            ref={refContent1}
            drag="x" // Allow horizontal dragging
            dragConstraints={constraints1} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
          >
            {items.map((d, i) => (
              <div className="col-lg-3 col-md-10 col" key={i}>
                <div
                  className="row d-flex p-2 mb-0 bg-white ms-2 me-2"
                  style={{
                    borderRadius: "10px",
                  }}
                >
                  <div className="col-lg-4 col-md-4 col mt-2 d-none d-md-block">
                    <Image
                      src={blueClock}
                      className="img-fluid"
                      alt="blueClock"
                    />
                  </div>
                  <div className="col-lg-8 col-md-8 col ps-0">
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
    </div>
  );
};

export default VisitDate;

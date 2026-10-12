import { motion } from "framer-motion";
import Image from "next/image";
// import locationImage from "../../../public/images/locationImage.png";
import { useEffect, useRef, useState } from "react";
import uploadBlack from "../../../public/icons/uploadBlack.svg";

const BottomArea = () => {
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
      className="col shadow-sm mb-3 ms-3 me-3 pt-4 ps-4 pe-4 "
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
              className="col-lg-3 col-md-6 col col-12 p-3 mb-3 me-4 bg-white"
              style={{
                borderRadius: "10px",
              }}
            >
              <div className="row d-flex">
                <div className="col">
                  <p
                    className="m-0 mb-1"
                    style={{ fontSize: "0.688rem", fontWeight: "500" }}
                  >
                    Lahore Ring Road
                  </p>
                  <p
                    className="m-0 mb-1 text-secondary fw-normal"
                    style={{ fontSize: "0.438rem" }}
                  >
                    11:19 AM&nbsp;&nbsp;&nbsp;Dec 21, 2022
                  </p>
                </div>
                <div className="col text-end">
                  <Image
                    className="img-fluid"
                    src={uploadBlack}
                    alt="uploadBlack"
                    width={15}
                    height={15}
                  />
                </div>
              </div>

              <div
                className="col p-1 ms-1 me-1"
                style={{ borderTop: "0.49px solid #4F4F4F" }}
              ></div>
              <div className="col">
                <Image
                  src="/images/locationImage.png"
                  alt="locationImage"
                  className="img-fluid"
                  width={330}
                  height={166}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BottomArea;

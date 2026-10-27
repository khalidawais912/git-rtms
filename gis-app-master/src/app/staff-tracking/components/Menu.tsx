import { motion } from "framer-motion";
import Image from "next/image";
import archery from "../../../public/icons/archery.svg";
import eyeBold from "../../../public/icons/eyeBold.svg";
import levelUp from "../../../public/icons/levelUp.svg";
import meter from "../../../public/icons/meter.svg";
import waveDown from "../../../public/icons/waveDown.svg";
import waveUp from "../../../public/icons/waveUp.svg";
import tideOne from "../../../public/images/tideOne.png";
import tideTwo from "../../../public/images/tideTwo.png";

const Menu = () => {
  return (
    <div className="row d-flex justify-content-start ms-1">
      <div
        className="me-2 mb-2 p-0"
        style={{
          width: "230px",
          borderRadius: "10px",
          backgroundImage:
            "linear-gradient(to bottom right, #40DDFF , #14BAE3, #13B1E6,#11AADF,#0B98C5)",
        }}
      >
        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={eyeBold} alt="eyeBold" width={45} height={45} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div
                className="col-lg-12 col-md-12 col-sm-12"
                style={{ height: "60px" }}
              >
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">50</p>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image src={waveUp} alt="waveUp" width={50} height={20} />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p
                      className="m-0 mt-1 ms-2 text-white"
                      style={{ fontSize: ".7rem" }}
                    >
                      +12.5%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <p style={{ fontSize: ".8rem", color: "#89DAF2" }}>
              New Identified Schemes
            </p>
          </div>
        </div>
      </div>
      <div
        className="me-2 mb-2 p-0"
        style={{
          width: "230px",
          outline: "1px solid #0C8CE9",
          borderRadius: "10px",
          background: "rgba(12, 140, 233,.5)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
          animate={{ x: 0, y: 80 }} // Move to Y = 0 (top)
          transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
          style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
        >
          <Image src={tideOne} alt="tideOne" width={330} height={130} />
        </motion.div>

        <motion.div
          initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
          animate={{ x: 0, y: 105 }} // Move to Y = 0 (top)
          transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
          style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
        >
          <Image src={tideTwo} alt="tideTwo" width={300} height={100} />
        </motion.div>

        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={archery} alt="archery" width={40} height={40} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div
                className="col-lg-12 col-md-12 col-sm-12"
                style={{ height: "60px" }}
              >
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">10%</p>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image
                      src={waveDown}
                      alt="waveDown"
                      width={50}
                      height={20}
                    />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p
                      className="m-0 mt-1 ms-2 text-danger"
                      style={{ fontSize: ".7rem" }}
                    >
                      -5.23%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center text-white">
            <p style={{ fontSize: ".8rem" }}>Achieved Progress</p>
          </div>
        </div>
      </div>
      <div
        className="me-2 mb-2 p-0"
        style={{
          width: "230px",
          outline: "1px solid #0C8CE9",
          borderRadius: "10px",
          background: "rgba(12, 140, 233,.3)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
          animate={{ x: 0, y: 110 }} // Move to Y = 0 (top)
          transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
          style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
        >
          <Image src={tideOne} alt="tideOne" width={330} height={130} />
        </motion.div>

        <motion.div
          initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
          animate={{ x: 0, y: 115 }} // Move to Y = 0 (top)
          transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
          style={{ position: "absolute", zIndex: -2 }}
        >
          <Image src={tideTwo} alt="tideTwo" width={230} height={100} />
        </motion.div>

        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={meter} alt="meter" width={40} height={40} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div
                className="col-lg-12 col-md-12 col-sm-12"
                style={{ height: "60px" }}
              >
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">02%</p>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image
                      src={waveDown}
                      alt="waveDown"
                      width={50}
                      height={20}
                    />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p
                      className="m-0 mt-1 ms-2 text-danger"
                      style={{ fontSize: ".7rem" }}
                    >
                      -7.23%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center text-white">
            <p style={{ fontSize: ".8rem" }}>Planned Progress</p>
          </div>
        </div>
      </div>
      <div
        className="me-2 mb-2 p-0"
        style={{
          width: "230px",
          outline: "1px solid #0C8CE9",
          borderRadius: "10px",
          background: "rgba(12, 140, 233,.4)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
          animate={{ x: 0, y: 30 }} // Move to Y = 0 (top)
          transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
          style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
        >
          <Image src={tideOne} alt="tideOne" width={330} height={130} />
        </motion.div>

        <motion.div
          initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
          animate={{ x: 0, y: 40 }} // Move to Y = 0 (top)
          transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
          style={{ position: "absolute", zIndex: -2 }}
        >
          <Image src={tideTwo} alt="tideTwo" width={230} height={100} />
        </motion.div>

        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={levelUp} alt="levelUp" width={40} height={40} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div
                className="col-lg-12 col-md-12 col-sm-12"
                style={{ height: "60px" }}
              >
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">78%</p>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image src={waveUp} alt="waveUp" width={50} height={20} />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p
                      className="m-0 mt-1 ms-2 text-white"
                      style={{ fontSize: ".7rem" }}
                    >
                      +12.5%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center text-white">
            <p style={{ fontSize: ".8rem" }}>Financial Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;

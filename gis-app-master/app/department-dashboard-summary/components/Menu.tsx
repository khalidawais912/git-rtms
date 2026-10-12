import { motion } from "framer-motion";
import Image from "next/image";
import archery from "../../../public/icons/archery.svg";
import briefcaseWithSettings from "../../../public/icons/briefcaseWithSettings.svg";
import umbrella from "../../../public/icons/umbrella.svg";
import waveDown from "../../../public/icons/waveDown.svg";
import waveUp from "../../../public/icons/waveUp.svg";
import tideOne from "../../../public/images/tideOne.png";
import tideTwo from "../../../public/images/tideTwo.png";

const Menu = () => {
  const items = [
    {
      mainIcon: briefcaseWithSettings,
      score: 50,
      waveIcon: waveUp,
      waveValue: "+12.5%",
      waveValueColor: "text-white",
      label: "New Identified Schemes",
      animation: false,
      backgroundColor:
        "linear-gradient(to bottom right, #40DDFF , #14BAE3, #13B1E6,#11AADF,#0B98C5)",
    },
  ];
  return (
    <div className="row d-flex justify-content-start ps-3">
      <div className="col-lg-4 col-md-6 col-sm-12 ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            borderRadius: "10px",
            backgroundImage:
              "linear-gradient(to bottom right, #40DDFF , #14BAE3, #13B1E6,#11AADF,#0B98C5)",
          }}
        >
          <div className="row d-flex m-0 pt-2">
            <div className="col-lg-4 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <Image
                src={briefcaseWithSettings}
                className="img-fluid mt-2"
                alt="briefcaseWithSettings"
                width={43}
                height={43}
              />
            </div>
            <div className="col-lg-8 col-md-6 col text-lg-center">
              <div className="row">
                <div
                  className="col-lg-12 col-md-12 col-sm-12"
                  style={{ height: "60px" }}
                >
                  <p
                    className="text-white fw-bold m-0 pt-2"
                    style={{ fontSize: "3rem" }}
                  >
                    50
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-white mt-2">
                  <Image src={waveUp} alt="waveUp" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">+12.5%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center mt-2">
              <p className="fs14px" style={{ color: "#89DAF2" }}>
                New Identified Schemes
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 col-sm-12 ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
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
            <div className="col-lg-4 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <Image
                src={archery}
                alt="archery"
                className="img-fluid mt-2"
                width={43}
                height={43}
              />
            </div>
            <div className="col-lg-8 col-md-6 col text-lg-center">
              <div className="row">
                <div
                  className="col-lg-12 col-md-12 col-sm-12"
                  style={{ height: "60px" }}
                >
                  <p
                    className="text-white fw-bold m-0 pt-2"
                    style={{ fontSize: "3rem" }}
                  >
                    10%
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger mt-2">
                  <Image src={waveDown} alt="waveDown" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs14px">Achieved Progress</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 col-sm-12 ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid #0C8CE9",
            borderRadius: "10px",
            background: "rgba(12, 140, 233, 0.4)",
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
            style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
          >
            <Image src={tideTwo} alt="tideTwo" width={300} height={100} />
          </motion.div>

          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-4 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <Image
                src={umbrella}
                alt="umbrella"
                className="img-fluid mt-2"
                width={43}
                height={43}
              />
            </div>
            <div className="col-lg-8 col-md-6 col text-lg-center">
              <div className="row">
                <div
                  className="col-lg-12 col-md-12 col-sm-12"
                  style={{ height: "60px" }}
                >
                  <p
                    className="text-white fw-bold m-0 pt-2"
                    style={{ fontSize: "3rem" }}
                  >
                    02%
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger mt-2">
                  <Image src={waveDown} alt="waveDown" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs14px">Planned Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="col-lg-1 col-md-1 col p-0">
        <Button
          className="btn fw-bold me-2 mb-2"
          style={{
            outline: "1px dashed #334155",
            borderRadius: "10px",
            background: "rgba(12, 140, 233,0)",
            height: "125px",
          }}
        >
          Add
        </Button>
      </div> */}
    </div>
  );
};

export default Menu;

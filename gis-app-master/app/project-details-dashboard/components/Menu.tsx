import { motion } from "framer-motion";
import Image from "next/image";
import archery from "../../../public/icons/archery.svg";
import eyeBold from "../../../public/icons/eyeBold.svg";
import levelUp from "../../../public/icons/levelUp.svg";
import meter from "../../../public/icons/meter.svg";
import tideOne from "../../../public/images/tideOne.png";
import tideTwo from "../../../public/images/tideTwo.png";
import { SingleProjectDashboard } from "./ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const Menu = ({ data }: Props) => {
  const backgroundColors = {
    yellow:
      "linear-gradient(to bottom right, #FFEC40 , #A5E314, #D1E613,#DBDF11,#A3C50B)",
    green:
      "linear-gradient(to bottom right, #40FF80 , #14E359, #13E664,#11DF56,#0BC549)",
    red: "linear-gradient(to bottom right, #FF4040 , #E31414, #E61E13,#DF1111,#C50B1D)",
  };

  return (
    <div className="row d-flex justify-content-start ps-3">
      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            borderRadius: "10px",
            backgroundImage: backgroundColors.yellow,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* <motion.div
            initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 80 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
          >
            <Image
              src={tideOne}
              alt="tideOne"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 105 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
          >
            <Image
              src={tideTwo}
              alt="tideTwo"
              style={{ width: "150%", height: "100px" }}
            />
          </motion.div> */}
          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-4 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <Image
                src={eyeBold}
                alt="eyeBold"
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
                    {/* {data?.totalProjects} */}
                    59
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger mt-2">
                  {/* <Image src={waveDown} alt="waveDown" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs14px fw-bold" style={{ letterSpacing: 1 }}>
                Need Consideration
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid rgba(12, 140, 233, 0.4)",
            background: "rgba(12, 140, 233, 0.2)",
            borderRadius: "10px",
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
            <Image
              src={tideOne}
              alt="tideOne"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 105 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
          >
            <Image
              src={tideTwo}
              alt="tideTwo"
              style={{ width: "150%", height: "100px" }}
            />
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
                    achievedProgress %
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger mt-2">
                  {/* <Image src={waveDown} alt="waveDown" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs14px fw-bold" style={{ letterSpacing: 1 }}>
                Achieved Progress
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid rgba(50, 179, 52, 0.4)",
            background: "rgba(12, 140, 233,.5)",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 50 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
          >
            <Image
              src={tideOne}
              alt="tideOne"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 65 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
          >
            <Image
              src={tideTwo}
              alt="tideTwo"
              style={{ width: "150%", height: "100px" }}
            />
          </motion.div>

          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-4 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <Image
                src={meter}
                alt="meter"
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
                    plannedProgress %
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger mt-2">
                  {/* <Image src={waveDown} alt="waveDown" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs14px fw-bold" style={{ letterSpacing: 1 }}>
                Planned Progress
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid rgba(232, 192, 15, 0.4)",
            background: "rgba(12, 140, 233,.5)",
            borderRadius: "10px",
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
            <Image
              src={tideOne}
              alt="tideOne"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 40 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2 }}
          >
            <Image
              src={tideTwo}
              alt="tideTwo"
              style={{ width: "150%", height: "100px" }}
            />
          </motion.div>

          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-4 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <Image
                src={levelUp}
                alt="levelUp"
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
                    financalProgress %
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-white mt-2">
                  {/* <Image src={waveUp} alt="waveUp" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs14px fw-bold" style={{ letterSpacing: 1 }}>
                Financial Progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;

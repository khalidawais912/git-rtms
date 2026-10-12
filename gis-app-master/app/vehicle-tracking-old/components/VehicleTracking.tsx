"use client";
import Button from "@/app/components/Button";
import { setContent } from "@/app/features/content/contentSlice";
import { setTutorial } from "@/app/features/tutorial/tutorialSlice";
import useAuthorization from "@/app/hooks/useAuthorization";
import { devMap } from "@/app/utils";
import redCircle from "@/public/icons/redCircle.svg";
import { motion } from "framer-motion";
import { Lexend } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LiveCarTrackingMap from "./GoogleMap/LiveCarTrackingMap";
import RecordingCarTrackingMap from "./GoogleMap/RecordingCarTrackingMap";
import Vehicles from "./Vehicles";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const VehicleTracking = () => {
  const [mapStatus, setMapStatus] = useState(true);
  const dispatch = useDispatch();
  // useAuthorization("vehicle-tracking");

  const handleButtonClick = (content: string, tutorialLink: string) => {
    dispatch(setContent(content));
    dispatch(setTutorial(tutorialLink));
  };

  useEffect(() => {
    handleButtonClick(
      "VehicleTracking",
      "https://www.youtube.com/watch?v=nMrctLAIwVM&ab_channel=DirectorateGeneralMonitoringandEvaluation"
    );
  }, []);

  const [selectedButton, setSelectedButton] = useState(1);

  return (
    <div
      className="container-fluid p-3 mb-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className={`row ${lexend.className}`}>
        <div className="col-lg-9 col-md-12 col position-relative">
          <div className="row">
            <div className="col">
              <div
                className="col position-absolute text-end"
                style={{ zIndex: 1, left: 200, top: 10 }}
              >
                {/* <Button
                  className={`btn ps-2 pe-2 ${
                    mapStatus ? "btn-danger" : "btn-success"
                  }`}
                  onClick={() => setMapStatus(!mapStatus)}
                >
                  {mapStatus ? "Live" : "Recording"}
                </Button> */}
                <div
                  className={`row d-flex flex-wrap rounded-pill m-0 ${lexend.className}`}
                  style={{ background: "rgba(235, 239, 253, 0.33)" }}
                >
                  <div
                    className="p-0 col btn-group rounded-pill"
                    style={{ background: "#EBEFFD" }}
                    role="group"
                  >
                    <Button
                      type="button"
                      className={`btn rounded-pill border-0 shadow-none fw-bold whiteSpaceNoWrap px-4 ${
                        selectedButton === 2 ? "text-white" : ""
                      }`}
                      style={{
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        background: `${
                          selectedButton === 2
                            ? "radial-gradient(#0C8CE9, #13629B)"
                            : ""
                        }`,
                      }}
                      onClick={() => {
                        setSelectedButton(2);
                        setMapStatus(false);
                      }}
                    >
                      RECORDING
                    </Button>
                    <Button
                      type="button"
                      className={`btn rounded-pill border-0 shadow-none fw-bold px-4 ${
                        selectedButton === 1 ? "text-white" : ""
                      }`}
                      style={{
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        background: `${
                          selectedButton === 1
                            ? "radial-gradient(#0C8CE9, #13629B)"
                            : ""
                        }`,
                      }}
                      onClick={() => {
                        setSelectedButton(1);
                        setMapStatus(true);
                      }}
                    >
                      &nbsp;&nbsp;
                      {selectedButton === 1 ? (
                        <motion.span
                          animate={{ opacity: [0, 1, 1, 0] }} // Keyframes: fade in and out
                          transition={{
                            duration: 2, // Time for one complete cycle
                            repeat: Infinity, // Loop animation infinitely
                            ease: "easeInOut", // Smoother transition
                          }}
                        >
                          <Image
                            src={redCircle}
                            alt="redCircle"
                            width={20}
                            height={20}
                          />
                        </motion.span>
                      ) : (
                        <Image
                          src={redCircle}
                          alt="redCircle"
                          width={20}
                          height={20}
                        />
                      )}
                      &nbsp;LIVE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Button>
                  </div>
                </div>
              </div>
              {devMap && (
                <div className="position-relative" style={{ zIndex: 0 }}>
                  {/* {mapStatus ? <MapCarsRecorded /> : <MapCars />} */}
                  {mapStatus ? (
                    <LiveCarTrackingMap />
                  ) : (
                    <RecordingCarTrackingMap />
                  )}
                </div>
              )}
              {/* <Destination /> */}
              {/* <Test /> */}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 col">
          <div className="row d-flex flex-lg-column">
            {/* <div className="col">
              <Drivers />
            </div> */}
            <div className="col">
              <Vehicles />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleTracking;

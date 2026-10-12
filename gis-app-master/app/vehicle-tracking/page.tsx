"use client";

import { useEffect, useRef, useState } from "react";
import { VT_RECORDING_API } from "../APIs";
import TimelineAuto from "./components/TimelineAuto";
import CustomModal from "../components/CustomModal/CustomModal";
import Button from "../components/Button";
import useVehicle from "../hooks/useVehicle";
import Image from "next/image";
import redCircle from "@/public/icons/redCircle.svg";
import axios from "axios";
import { motion } from "framer-motion";
import TimelineCustom from "./components/TimelineCustom";
import TimelineBothCustomAndGoogle from "./components/TimelineBothCustomAndGoogle";
import LiveCarTrackingMap from "../vehicle-tracking-old/components/GoogleMap/LiveCarTrackingMap";
import Vehicles from "../vehicle-tracking-old/components/Vehicles";
import { devMap, triggerEscapeKeyPress } from "../utils";
import { LuUsers } from "react-icons/lu";
import { LiaCarSideSolid } from "react-icons/lia";
import { TbMap2, TbUserSquareRounded } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { FaRegFileAlt } from "react-icons/fa";
import { Nunito_Sans } from "next/font/google";
import useAuthentication from "../hooks/useAuthentication";
import useDriver from "../hooks/useDriver";
import useDistrict from "../hooks/useDistrict";
import useProjects from "../hooks/useProjects";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface VehicleData {
  GpsTime: string;
  Latitude: number;
  Longitude: number;
  Speed: number;
  Ignition: string;
  Distance: number;
  ["Fuel burned"]: number;
  Direction: string;
}

export interface VehicleTrackingRecording {
  [vehicleNumber: string]: VehicleData[];
}

const NewVehicleTracking = () => {
  const { data: vehicles } = useVehicle();
  const { data: drivers } = useDriver();
  const { data: districts } = useDistrict();
  const { data: projects } = useProjects();
  const { data: users } = useAuthentication();
  const [selectedButton, setSelectedButton] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [data, setData] = useState<VehicleTrackingRecording>();
  const [isMapLive, setLiveMap] = useState(true);
  const [filterOption, setFilterOption] = useState<number>(0);
  const [viewResults, setViewResults] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Set initially
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getResponsiveWidth = () => {
    if (!viewResults) return "0%";

    if (screenWidth < 576) return "100%"; // Extra small
    if (screenWidth <= 768) return "100%"; // Small
    if (screenWidth < 1024) return "50%"; // Small
    return "50%"; // Large and up
  };

  const filterOptions = [
    { label: "Staff", icon: <LuUsers /> },
    { label: "Vehicle", icon: <LiaCarSideSolid /> },
    { label: "Driver", icon: <TbUserSquareRounded /> },
    { label: "District", icon: <TbMap2 /> },
    { label: "Date", icon: <SlCalender /> },
    { label: "Project", icon: <FaRegFileAlt /> },
  ];

  const [isCombineRouteSelected, setCombineRouteSelected] =
    useState<boolean>(true);

  // const fromTime = new Date(fromDate).toLocaleTimeString();
  // const toTime = new Date(toDate).toLocaleTimeString();

  console.log("params updated", fromDate, toDate, vehicleNo);
  // console.log("fromTime", fromTime);
  // console.log("toTime", toTime);

  const handleSubmit = async (
    fromDate: string,
    toDate: string,
    vehicleNo: string
  ) => {
    console.log(
      `${VT_RECORDING_API}?starttime=${new Date(
        fromDate
      ).toISOString()}&endtime=${new Date(
        toDate
      ).toISOString()}&v_ids=${vehicleNo}`
    );
    const response = await axios(
      `${VT_RECORDING_API}?starttime=${new Date(
        fromDate
      ).toISOString()}&endtime=${new Date(
        toDate
      ).toISOString()}&v_ids=${vehicleNo}`
    );
    console.log("response", response);
    setData(response.data);
    triggerEscapeKeyPress();
  };

  useEffect(() => {
    if (data && data[vehicleNo])
      console.log("data[vehicleNo][0].GpsTime", data[vehicleNo][0]?.GpsTime);
  }, [data]);

  return (
    <div
      className="shadow"
      style={{
        padding: "2.77px",
        backgroundImage:
          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1))",
        borderRadius: "10px",
        border: "2.77px solid rgba(255, 255, 255, 0.6)",
      }}
    >
      <div
        className="container-fluid p-1"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
          borderRadius: "10px",
        }}
      >
        <div className="col text-end position-relative">
          <div className="rounded-pill m-0" style={{ zIndex: 1, right: 10 }}>
            <div
              className="p-0 col-auto btn-group rounded-pill"
              style={{ background: "#EBEFFD" }}
              role="group"
            >
              <CustomModal
                size={viewResults ? "xl" : undefined}
                showCloseButton={false}
                modalId="staffRecording"
                button={
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
                  >
                    RECORDING
                  </Button>
                }
                body={
                  <div
                    className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
                    style={{
                      borderRadius: "20px",
                      background: "#fff",
                    }}
                  >
                    <div className="row m-0">
                      <div className="col">
                        <h3 className={`fw-6 fs-1 ${nunitoSans.className}`}>
                          Recording Filter
                        </h3>
                        <p className="text-secondary fs17px">
                          Set the Filter to check appropriate results.
                        </p>
                        {/* <div
                      className="row d-flex"
                      style={{
                        overflowX: "scroll",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        className="d-flex"
                        drag="x" // Allow horizontal dragging
                        dragConstraints={{ left: -400, right: 0 }} // Adjust based on content size
                        whileTap={{ cursor: "grabbing" }}
                      >
                        {filterOptions.map((option, i) => (
                          <div className="col-auto pe-3 py-1">
                            <Button
                              onClick={() => setFilterOption(i)}
                              className={`btn rounded-pill px-3 py-2 fs18px ${
                                filterOption === i
                                  ? "text-light"
                                  : "border border-dark"
                              }`}
                              style={{
                                background: `${
                                  filterOption === i
                                    ? "radial-gradient(#0C8CE9, #13629B)"
                                    : ""
                                }`,
                                transition: "all .5s",
                              }}
                            >
                              {option.icon} {option.label}
                            </Button>
                          </div>
                        ))}
                      </motion.div>
                      <div>
                        <div className="col mb-3 text-start">
                          <label htmlFor="vehicles" className="form-label">
                            Vehicles
                          </label>
                          <select
                            className="form-select 
                            aria-label="vehicles"
                            id="vehicles"
                            value={vehicleNo}
                            onChange={(e) => {
                              setVehicleNo(e.target.value);
                              setLiveMap(false);
                            }}
                          >
                            <option value="">Select</option>
                            {vehicles.map((vehicle) => (
                              <option
                                key={vehicle.id}
                                value={vehicle.vehicleNumber}
                              >
                                {vehicle.vehicleNumber}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col mb-3 text-start">
                          <label htmlFor="date" className="form-label">
                            From Date with Time
                          </label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            id="date"
                            placeholder="Select start Date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                        </div>

                        <div className="col mb-3 text-start">
                          <label htmlFor="date" className="form-label">
                            To Date with Time
                          </label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            id="date"
                            placeholder="Select end Date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>

                        <div className="row m-0">
                          <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                            <Button
                              className="btn w-50 fs-5 text-white"
                              type="submit"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to right, #0C8CE9 , #13629B)",
                                border: "0px",
                              }}
                              disabled={
                                fromDate === "" ||
                                toDate === "" ||
                                vehicleNo === ""
                              }
                              onClick={() => {
                                handleSubmit(fromDate, toDate, vehicleNo);
                                setLiveMap(false);
                                setSelectedButton(2);
                              }}
                            >
                              Filter
                            </Button>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                            <Button
                              className="btn w-50 fs-5"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              style={{
                                border: "2px solid #0C8CE9",
                                color: "#0C8CE9",
                              }}
                              onClick={() => {
                                setFromDate("");
                                setToDate("");
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div> */}
                        <div className="row m-0 mb-3">
                          {filterOptions.map((option, i) => (
                            <div key={i} className="col-auto ps-0 mb-2">
                              <Button
                                onClick={() => setFilterOption(i)}
                                className="btn rounded-pill px-3 py-2 fs18px"
                                style={{
                                  background: `${
                                    filterOption === i
                                      ? "radial-gradient(#0C8CE9, #13629B)"
                                      : ""
                                  }`,
                                  color: `${
                                    filterOption === i ? "#fff" : "#575757"
                                  }`,
                                  border: `${
                                    filterOption === i
                                      ? ""
                                      : "1px solid #575757"
                                  }`,
                                  transition: "all .5s",
                                }}
                              >
                                {option.icon} {option.label}
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="row m-0">
                          {filterOption !== 5 && (
                            <>
                              <div className="col-12 col-sm-12 col-md-6 mb-3 text-start fs18px">
                                <label
                                  htmlFor="fromDate"
                                  className="form-label"
                                  style={{ color: "#575757" }}
                                >
                                  From Date
                                </label>
                                <input
                                  type="datetime-local"
                                  className="form-control border p-3"
                                  style={{
                                    borderRadius: "13px",
                                    color: "#575757",
                                  }}
                                  id="fromDate"
                                  placeholder="Select start Date"
                                  value={fromDate}
                                  onClick={() => setViewResults(true)}
                                  onChange={(e) => setFromDate(e.target.value)}
                                />
                              </div>

                              <div className="col-12 col-sm-12 col-md-6 mb-3 mb-3 text-start fs18px">
                                <label
                                  htmlFor="toDate"
                                  className="form-label"
                                  style={{ color: "#575757" }}
                                >
                                  To Date
                                </label>
                                <input
                                  type="datetime-local"
                                  className="form-control border p-3"
                                  style={{
                                    borderRadius: "13px",
                                    color: "#575757",
                                  }}
                                  id="toDate"
                                  placeholder="Select end Date"
                                  value={toDate}
                                  onClick={() => setViewResults(true)}
                                  onChange={(e) => setToDate(e.target.value)}
                                />
                              </div>
                            </>
                          )}

                          {filterOption === 0 && (
                            <div className="col-12 mb-3 text-start">
                              <label
                                htmlFor="staff"
                                className="form-label fs18px"
                                style={{ color: "#575757" }}
                              >
                                Staff
                              </label>
                              <select
                                className="form-select border p-3 fs18px"
                                style={{
                                  borderRadius: "13px",
                                  color: "#575757",
                                }}
                                aria-label="staff"
                                id="staff"
                                value={vehicleNo}
                                onChange={(e) => {
                                  setVehicleNo(e.target.value);
                                  setLiveMap(false);
                                  setViewResults(true);
                                }}
                              >
                                <option value="">Select</option>
                                {users.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.fullName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          {filterOption === 1 && (
                            <div className="col-12 mb-3 text-start">
                              <label
                                htmlFor="vehicles"
                                className="form-label fs18px"
                                style={{ color: "#575757" }}
                              >
                                Vehicle
                              </label>
                              <select
                                className="form-select border p-3 fs18px"
                                style={{
                                  borderRadius: "13px",
                                  color: "#575757",
                                }}
                                aria-label="vehicles"
                                id="vehicles"
                                value={vehicleNo}
                                onChange={(e) => {
                                  setVehicleNo(e.target.value);
                                  setLiveMap(false);
                                  setViewResults(true);
                                }}
                              >
                                <option value="">Select</option>
                                {vehicles.map((vehicle) => (
                                  <option
                                    key={vehicle.id}
                                    value={vehicle.vehicleNumber}
                                  >
                                    {vehicle.vehicleNumber}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          {filterOption === 2 && (
                            <div className="col-12 mb-3 text-start">
                              <label
                                htmlFor="driver"
                                className="form-label fs18px"
                                style={{ color: "#575757" }}
                              >
                                Driver
                              </label>
                              <select
                                className="form-select border p-3 fs18px"
                                style={{
                                  borderRadius: "13px",
                                  color: "#575757",
                                }}
                                aria-label="driver"
                                id="driver"
                                value={vehicleNo}
                                onChange={(e) => {
                                  setVehicleNo(e.target.value);
                                  setLiveMap(false);
                                  setViewResults(true);
                                }}
                              >
                                <option value="">Select</option>
                                {drivers.map((driver) => (
                                  <option key={driver.id} value={driver.id}>
                                    {driver.driverName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          {filterOption === 3 && (
                            <div className="col-12 mb-3 text-start">
                              <label
                                htmlFor="district"
                                className="form-label fs18px"
                                style={{ color: "#575757" }}
                              >
                                District
                              </label>
                              <select
                                className="form-select border p-3 fs18px"
                                style={{
                                  borderRadius: "13px",
                                  color: "#575757",
                                }}
                                aria-label="district"
                                id="district"
                                value={vehicleNo}
                                onChange={(e) => {
                                  setVehicleNo(e.target.value);
                                  setLiveMap(false);
                                  setViewResults(true);
                                }}
                              >
                                <option value="">Select</option>
                                {districts.map((district) => (
                                  <option key={district.id} value={district.id}>
                                    {district.districtName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          {filterOption === 5 && (
                            <>
                              <div className="col-12 col-sm-12 col-md-8 mb-3 mb-3 text-start">
                                <label
                                  htmlFor="project"
                                  className="form-label fs18px"
                                  style={{ color: "#575757" }}
                                >
                                  Project
                                </label>
                                <select
                                  className="form-select border p-3 fs18px"
                                  style={{
                                    borderRadius: "13px",
                                    color: "#575757",
                                  }}
                                  aria-label="project"
                                  id="project"
                                  value={vehicleNo}
                                  onChange={(e) => {
                                    setVehicleNo(e.target.value);
                                    setLiveMap(false);
                                    setViewResults(true);
                                  }}
                                >
                                  <option value="">Select</option>
                                  {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                      {project.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 mb-3 mb-3 text-start">
                                <label
                                  htmlFor="gsNo"
                                  className="form-label fs18px"
                                  style={{ color: "#575757" }}
                                >
                                  Gs No.
                                </label>
                                <input
                                  className="form-control border p-3 fs18px"
                                  style={{
                                    borderRadius: "13px",
                                    color: "#575757",
                                  }}
                                  aria-label="gsNo"
                                  id="gsNo"
                                  value={vehicleNo}
                                  onChange={(e) => {
                                    setVehicleNo(e.target.value);
                                    setLiveMap(false);
                                    setViewResults(true);
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        {/* <div className="col mb-3">
                          <Button
                            className="btn w-100 rounded-pill text-light fs21px px-4 py-3"
                            style={{
                              background: "radial-gradient(#0C8CE9, #13629B)",
                              padding: "25px 21px",
                            }}
                            onClick={() => setViewResults(true)}
                          >
                            See {3} Results
                          </Button>
                        </div> */}
                        <div
                          className="col"
                          style={{
                            opacity: `${
                              fromDate || toDate || viewResults ? 100 : 0
                            }`,
                            height: `${
                              fromDate || toDate || viewResults ? "70px" : "0px"
                            }`,
                            overflow: "hidden",
                            transition: `${
                              fromDate || toDate || viewResults
                                ? "all .5s"
                                : "none"
                            }`,
                          }}
                        >
                          <Button
                            className="btn w-100 rounded-pill fs21px px-4 py-3 text-nowrap"
                            style={{
                              border: "1.5px solid #606060",
                            }}
                            onClick={() => {
                              setFromDate("");
                              setToDate("");
                              setViewResults(false);
                            }}
                          >
                            Clear All Filters
                          </Button>
                        </div>
                        {/* <div className="row m-0">
                      <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                        <Button
                          className="btn w-50 fs-5 text-white"
                          type="submit"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #0C8CE9 , #13629B)",
                            border: "0px",
                          }}
                          disabled={
                            fromDate === "" || toDate === "" || vehicleNo === ""
                          }
                          onClick={() => {
                            handleSubmit(fromDate, toDate, vehicleNo);
                            setLiveMap(false);
                            setSelectedButton(2);
                          }}
                        >
                          Filter
                        </Button>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                        <Button
                          className="btn w-50 fs-5"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          style={{
                            border: "2px solid #0C8CE9",
                            color: "#0C8CE9",
                          }}
                          onClick={() => {
                            setFromDate("");
                            setToDate("");
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    </div> */}
                      </div>
                      <div
                        className="col-12 col-lg-6 "
                        style={{
                          width: getResponsiveWidth(),
                          maxWidth: getResponsiveWidth(),
                          minWidth: getResponsiveWidth(),
                        }}
                      >
                        <div
                          style={{
                            opacity: `${viewResults ? 100 : 0}`,
                            height: `${viewResults ? "100%" : "0px"}`,
                            overflow: "hidden",
                            transition: "all .5s",
                          }}
                        >
                          <div
                            className="table-responsive"
                            style={{
                              height: "100%",
                              overflow: "auto",
                              borderRadius: "13px",
                            }}
                          >
                            {filterOption === 0 && (
                              <table className="table table-hover table-striped">
                                <thead
                                  style={{
                                    background: "#4F81BD",
                                    color: "#fff",
                                  }}
                                >
                                  <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">From</th>
                                    <th scope="col">To</th>
                                    <th scope="col">Vehicle</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      1
                                    </th>
                                    <td>13/3/2025</td>
                                    <td>25/4/2025</td>
                                    <td className="text-nowrap">GBE-062</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      2
                                    </th>
                                    <td>25/4/2025</td>
                                    <td>13/3/2025</td>
                                    <td className="text-nowrap">LEO-465</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      3
                                    </th>
                                    <td>25/4/2025</td>
                                    <td>13/3/2025</td>
                                    <td className="text-nowrap">LMO-789</td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                            {filterOption === 1 && (
                              <table className="table table-hover table-striped">
                                <thead
                                  style={{
                                    background: "#4F81BD",
                                    color: "#fff",
                                  }}
                                >
                                  <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">From</th>
                                    <th scope="col">To</th>
                                    <th scope="col">Staff</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      1
                                    </th>
                                    <td>25/4/2025</td>
                                    <td>13/3/2025</td>
                                    <td>Usman Khalid</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      2
                                    </th>
                                    <td>25/4/2025</td>
                                    <td>13/3/2025</td>
                                    <td>Fatima Zia</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      3
                                    </th>
                                    <td>25/4/2025</td>
                                    <td>13/3/2025</td>
                                    <td>Jameel Nasir</td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                            {filterOption === 2 && (
                              <table className="table table-hover table-striped">
                                <thead
                                  style={{
                                    background: "#4F81BD",
                                    color: "#fff",
                                  }}
                                >
                                  <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Visit Plan</th>
                                    <th scope="col">Vehicle</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      1
                                    </th>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">GBE-062</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      2
                                    </th>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">LEO-600</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      3
                                    </th>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">NGO-530</td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                            {filterOption === 3 && (
                              <table className="table table-hover table-striped">
                                <thead
                                  style={{
                                    background: "#4F81BD",
                                    color: "#fff",
                                  }}
                                >
                                  <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Project</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Vehicle</th>
                                    <th scope="col">Staff</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      1
                                    </th>
                                    <td>
                                      Beautification and Facade Uplifting of
                                      Mall Road, Murree. Murree
                                    </td>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">GBE-062</td>
                                    <td>Fatima Zia</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      2
                                    </th>
                                    <td>Uplifting of PIA Park Murree</td>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">LMG-687</td>
                                    <td>Salman Khalid</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      3
                                    </th>
                                    <td>
                                      Uplifting of Bagh e Shaheedan Panj Mandoo
                                      Park Murree
                                    </td>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">KTO-736</td>
                                    <td>Waleed Hassan</td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                            {filterOption === 4 && (
                              <table className="table table-hover table-striped">
                                <thead
                                  style={{
                                    background: "#4F81BD",
                                    color: "#fff",
                                  }}
                                >
                                  <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Project</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Vehicle</th>
                                    <th scope="col">Staff</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      1
                                    </th>
                                    <td>
                                      Beautification and Facade Uplifting of
                                      Mall Road, Murree. Murree
                                    </td>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">GBE-062</td>
                                    <td>Fatima Zia</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      2
                                    </th>
                                    <td>Uplifting of PIA Park Murree</td>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">LMG-687</td>
                                    <td>Salman Khalid</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      3
                                    </th>
                                    <td>
                                      Uplifting of Bagh e Shaheedan Panj Mandoo
                                      Park Murree
                                    </td>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">KTO-736</td>
                                    <td>Khalil-ur-Rehman Qamar</td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                            {filterOption === 5 && (
                              <table className="table table-hover table-striped">
                                <thead
                                  style={{
                                    background: "#4F81BD",
                                    color: "#fff",
                                  }}
                                >
                                  <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Vehicle</th>
                                    <th scope="col">Staff</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      1
                                    </th>

                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">GBE-062</td>
                                    <td>Fatima Zia</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      2
                                    </th>
                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">LMG-687</td>
                                    <td>Salman Khalid</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" className="fw-normal">
                                      3
                                    </th>

                                    <td>From: 16/2/2024, To: 6/3/2024</td>
                                    <td className="text-nowrap">KTO-736</td>
                                    <td>Usman Khawaja</td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
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
                  setLiveMap(true);
                }}
              >
                &nbsp;&nbsp;
                {selectedButton === 1 ? (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }} // Keyframes: fade in and out
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
            {data && !isMapLive && (
              <Button
                className="btn btn-info ms-2"
                onClick={() => setCombineRouteSelected(!isCombineRouteSelected)}
              >
                Toggle Maps
              </Button>
            )}
          </div>
        </div>
        {isMapLive && devMap ? (
          <>
            <div className="row m-0 mt-3">
              <div className="col-lg-9 col-md-12 col">
                <LiveCarTrackingMap />
              </div>
              <div className="col-lg-3 col-md-12 col">
                <Vehicles />
              </div>
            </div>
          </>
        ) : (
          <>
            {isCombineRouteSelected ? (
              <div className="col" style={{ marginTop: "60px" }}>
                {data && devMap && (
                  <TimelineBothCustomAndGoogle
                    data={data}
                    vehicleNo={vehicleNo}
                  />
                )}
              </div>
            ) : (
              <>
                {data && data[vehicleNo] && data[vehicleNo].length > 0 && (
                  <div className="row d-flex flex-wrap m-0">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                      <h3 className="fw-bold mb-4">Officer Path</h3>
                      <TimelineCustom data={data} vehicleNo={vehicleNo} />
                    </div>

                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                      <h3 className="fw-bold mb-4">Google Path</h3>
                      <TimelineAuto data={data} vehicleNo={vehicleNo} />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewVehicleTracking;

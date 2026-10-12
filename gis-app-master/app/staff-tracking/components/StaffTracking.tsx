"use client";
import {
  GET_USER_PROJECTS_API,
  REVERSE_GEO_CODING_API,
  STAFF_TRACKING_API,
  VISIT_API,
} from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import { setContent } from "@/app/features/content/contentSlice";
import { setTutorial } from "@/app/features/tutorial/tutorialSlice";
import useAuthentication from "@/app/hooks/useAuthentication";
import { Project } from "@/app/hooks/useProjects";
import apiClient from "@/app/services/api-client";
import { devMap, triggerEscapeKeyPress } from "@/app/utils";
import redCircle from "@/public/icons/redCircle.svg";
import { motion } from "framer-motion";
import { Lexend } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LiveStaffTrackingMap from "./GoogleMap/LiveStaffTrackingMap";
import TimelineAuto from "./GoogleMap/TimelineAuto";
import TimelineBothCustomAndGoogle from "./GoogleMap/TimelineBothCustomAndGoogle";
import TimelineCard from "./GoogleMap/TimelineCard";
import TimelineCustomPath from "./GoogleMap/TimelineCustomPath";
import StaffMember from "./StaffMember";
import StaffMemberInRecording from "./StaffMemberInRecording";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface VisitByUserId {
  projectId: number;
  projectName: string;
  projectLat: string;
  projectLong: string;
  projectDistrict: string;
  driverName: string;
  driverImage: string;
  carNumber: string;
  carImage: string;
  visit: {
    id: number;
    projectId: number;
    assignedTo: number;
    status: string;
    latitude: string;
    longitude: string;
    vehicleID: number;
    driverID: number;
    fromDate: string;
    toDate: string;
    createdAt: string;
    updatedAt: string;
    reportPath: string;
  };
}

interface Coordinates {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

export interface StaffTracking {
  userId: string;
  userName: string;
  designation: string;
  phoneNumber: string;
  mobile: string;
  projectName: string;
  districtName: string;
  userPicture: string;
  planStartDate: string;
  planEndDate: string;
  visitStartTime: string;
  visitEndTime: string;
  carNumber: string;
  carPicture: string;
  driverName: string;
  status: string;
  startAddressLat: string;
  startAddressLong: string;
  endAddressLat: string;
  endAddressLong: string;
  coordinates: Coordinates[];
}

export interface TrackingRequestData {
  userId: number;
  visitId: number;
  date: string | null;
}

export interface OptionUser {
  id: number;
  name: string;
}

export interface OptionProject {
  id: number;
  name: string;
}

export interface OptionDate {
  id: number;
  name: string;
}

export interface Position {
  lat: number;
  lng: number;
}

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface ProjectVisit {
  visitId: number;
  visitName: string;
}

const StaffTracking = () => {
  const [mapStatus, setMapStatus] = useState(false);
  const dispatch = useDispatch();
  // useAuthorization("staff-tracking");
  // const [userId, setUserId] = useState<number>();
  // const [visitId, setVisitId] = useState<number>();
  // const [visits, setVisits] = useState();
  // const [refresh, setRefresh] = useState(false);

  const [data, setData] = useState<StaffTracking[]>();
  const [recordingTrackingRequestBody, setRecordingTrackingRequestBody] =
    useState<TrackingRequestData>({
      userId: 0,
      visitId: 0,
      date: getCurrentDate(), //remember to set current date
    });
  const [liveTrackingRequestBody, setLiveTrackingRequestBody] =
    useState<TrackingRequestData>({
      userId: 0,
      visitId: 0,
      date: getCurrentDate(), //remember to set current date
    });
  const [googleDuration, setGoogleDuration] = useState<string | undefined>("");
  const [officerDuration, setOfficerDuration] = useState<string | undefined>(
    "",
  );

  const [markerPositions, setMarkerPositions] = useState<{
    [key: string]: { lat: number; lng: number };
  }>({});

  const getStaffWithCoordinates = async (
    trackingRequestBody: TrackingRequestData,
  ) => {
    try {
      const response = await apiClient.post(
        STAFF_TRACKING_API,
        trackingRequestBody,
      );
      if (response.data.data) {
        setData(response.data.data);
        console.log("new data response", response);
        // Update each marker position with interpolation
        response.data.data.forEach((d: any) => {
          const userId = d.userId;
          const newLat = parseFloat(
            d.coordinates[d.coordinates.length - 1].latitude,
          );
          const newLng = parseFloat(
            d.coordinates[d.coordinates.length - 1].longitude,
          );
          const currentPos = markerPositions[userId] || {
            lat: newLat,
            lng: newLng,
          };

          // Smooth transition between current and new position
          const animateMarker = (startTime: number) => {
            const duration = 3000;
            const progress = (Date.now() - startTime) / duration;

            if (progress < 1) {
              const interpolatedLat =
                currentPos.lat + progress * (newLat - currentPos.lat);
              const interpolatedLng =
                currentPos.lng + progress * (newLng - currentPos.lng);
              setMarkerPositions((prev) => ({
                ...prev,
                [userId]: { lat: interpolatedLat, lng: interpolatedLng },
              }));
              requestAnimationFrame(() => animateMarker(startTime));
            } else {
              // End animation by setting to final position
              setMarkerPositions((prev) => ({
                ...prev,
                [userId]: { lat: newLat, lng: newLng },
              }));
            }
          };

          // Start the animation
          animateMarker(Date.now());
        });
      } else {
        console.log("Something bad happened");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    console.log("liveTrackingRequestBody:", liveTrackingRequestBody);
    getStaffWithCoordinates(liveTrackingRequestBody);
  }, []);

  const handleButtonClick = (content: string, tutorialLink: string) => {
    dispatch(setContent(content));
    dispatch(setTutorial(tutorialLink));
  };

  useEffect(() => {
    handleButtonClick(
      "StaffTracking",
      "https://www.youtube.com/watch?v=L38gouuFtyo&ab_channel=DirectorateGeneralMonitoringandEvaluation",
    );
  }, []);

  const [position, setPosition] = useState<Position>(); // Starting position (latitude, longitude)
  const [path, setPath] = useState<Position[]>([]); // Empty path initially
  const [recordingData, setRecordingData] = useState<StaffTracking[]>();

  const fetchRecordingData = async () => {
    console.log("recordingTrackingRequestBody", recordingTrackingRequestBody);
    try {
      const response = await apiClient.post(
        STAFF_TRACKING_API,
        recordingTrackingRequestBody,
      );
      console.log("recording data:", response.data.data);
      const responseData: StaffTracking[] = await response.data.data;
      setRecordingData(response.data.data);
      const coordinatesList = responseData[0]?.coordinates;
      if (coordinatesList && coordinatesList.length > 0) {
        const newPath: Position[] = coordinatesList.map((coord) => ({
          lat: parseFloat(coord.latitude),
          lng: parseFloat(coord.longitude),
        }));

        setPath(newPath);
        setPosition({
          lat: parseFloat(coordinatesList[0].latitude),
          lng: parseFloat(coordinatesList[0].longitude),
        }); // Set initial position to the first coordinate
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [startLocation, setStartLocation] = useState<string>();
  const [endLocation, setEndLocation] = useState<string>();

  const fetchStartLocationAddress = async (data: StaffTracking) => {
    try {
      if (data && data.startAddressLat && data.startAddressLong) {
        const response = await fetch(
          `${REVERSE_GEO_CODING_API}${data.startAddressLat},${data.startAddressLong}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`,
        );
        const resopnseData = await response.json();
        setStartLocation(resopnseData.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const fetchEndLocationAddress = async (data: StaffTracking) => {
    try {
      if (data && data.endAddressLat && data.endAddressLong) {
        const response = await fetch(
          `${REVERSE_GEO_CODING_API}${data.endAddressLat},${data.endAddressLong}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`,
        );
        const resopnseData = await response.json();
        setEndLocation(resopnseData.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    if (recordingData && recordingData.length > 0) {
      fetchStartLocationAddress(recordingData[0]);
      fetchEndLocationAddress(recordingData[0]);
    }
  }, [recordingData]);

  const [selectedButton, setSelectedButton] = useState(1);

  const [userProjects, setUserProjects] = useState<Project[]>([]); // Store the original data
  const [userVisits, setUserVisits] = useState<ProjectVisit[]>([]); // Store the original data
  const [userDate, setUserDate] = useState<Date | null>(); // Store the original data
  const [isVisitSelected, setVisitSelected] = useState<boolean>(false); // Store the original data
  const [isDateSelected, setDateSelected] = useState<boolean>(false); // Store the original data
  const [isCombineRouteSelected, setCombineRouteSelected] =
    useState<boolean>(true); // Store the original data

  const handleUserSubmit = async (id: number) => {
    try {
      const response = await apiClient.get(
        `${GET_USER_PROJECTS_API}?userId=${id}`,
      );
      console.log("Response:", response);
      setUserProjects(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleProjectSubmit = async (projectId: number, userId: number) => {
    try {
      const response = await apiClient.get(
        `${VISIT_API}/GetVisitsByProjectId?ProjectId=${projectId}&userId=${userId}`,
      );
      console.log("Response:", response);
      setUserVisits(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const { data: users } = useAuthentication();

  return (
    <div
      className={`container-fluid p-2 mb-4 ${lexend.className}`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: "10px",
      }}
    >
      <div className="col text-end position-relative">
        <div
          className="position-absolute rounded-pill m-0"
          style={{ zIndex: 1, right: 10 }}
        >
          <div
            className="p-0 col-auto btn-group rounded-pill"
            style={{ background: "#EBEFFD" }}
            role="group"
          >
            <CustomModal
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
                  onClick={() => {
                    setSelectedButton(2);
                    setDateSelected(false);
                    setVisitSelected(false);
                    setData([]);
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
                  <h3 className="fw-bold text-center">Recordings</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (recordingTrackingRequestBody) {
                        getStaffWithCoordinates(recordingTrackingRequestBody);
                      }
                      setMapStatus(true);
                      triggerEscapeKeyPress();
                    }}
                  >
                    <div className="col mb-3 text-start">
                      <label htmlFor="users" className="form-label">
                        Users
                      </label>
                      <select
                        className="form-select form-select-sm"
                        aria-label="users"
                        name="users"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "") {
                            setUserProjects([]); // Set null if "Select" option is chosen
                            setRecordingTrackingRequestBody((prev) => ({
                              ...prev,
                              userId: 0,
                            }));
                          } else {
                            const selectedId = parseInt(selectedValue, 10);
                            handleUserSubmit(selectedId); // Call handleUserSubmit with the selected userId
                            setRecordingTrackingRequestBody((prev) => ({
                              ...prev,
                              userId: selectedId,
                            }));
                          }
                        }}
                      >
                        <option value="">Select</option>
                        {users.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.userName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col mb-3 text-start">
                      <label htmlFor="date" className="form-label">
                        Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        placeholder="Select Date"
                        disabled={isVisitSelected}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "") {
                            setUserDate(null); // Set null if "Select" option is chosen
                            setRecordingTrackingRequestBody((prev) => ({
                              ...prev,
                              date: null,
                            }));
                            setDateSelected(false);
                          } else {
                            const newDate = new Date(selectedValue);
                            setRecordingTrackingRequestBody((prev) => ({
                              ...prev,
                              date: getFormattedDate(newDate),
                              visitId: 0,
                            }));
                            setDateSelected(true);
                          }
                        }}
                      />
                    </div>

                    <div className="col mb-3 text-start">
                      <label htmlFor="projects" className="form-label">
                        Projects
                      </label>
                      <select
                        className="form-select form-select-sm"
                        aria-label="projects"
                        name="projects"
                        disabled={isDateSelected}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "") {
                            setUserVisits([]); // Set null if "Select" option is chosen
                          } else {
                            const selectedId = parseInt(selectedValue, 10);
                            handleProjectSubmit(
                              selectedId,
                              recordingTrackingRequestBody.userId,
                            ); // Call handleUserSubmit with the selected userId
                          }
                        }}
                      >
                        <option value="">Select</option>
                        {userProjects.length > 0 &&
                          userProjects.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.gsNo} {d.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="col mb-3 text-start">
                      <label htmlFor="visits" className="form-label">
                        Visits
                      </label>
                      <select
                        className="form-select form-select-sm"
                        aria-label="visits"
                        name="visits"
                        disabled={isDateSelected}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "") {
                            setRecordingTrackingRequestBody((prev) => ({
                              ...prev,
                              visitId: 0,
                              date: null,
                            }));
                            setVisitSelected(false);
                          } else {
                            setRecordingTrackingRequestBody((prev) => ({
                              ...prev,
                              visitId: parseInt(selectedValue),
                              date: null,
                            }));
                            setVisitSelected(true);
                          }
                        }}
                      >
                        <option value="">Select</option>
                        {userVisits.length > 0 &&
                          userVisits.map((d) => (
                            <option key={d.visitId} value={d.visitId}>
                              {d.visitName}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="row d-flex">
                      <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                        <Button
                          disabled={
                            recordingTrackingRequestBody.userId >= 0 &&
                            isDateSelected
                              ? false
                              : recordingTrackingRequestBody.userId &&
                                  isVisitSelected
                                ? false
                                : true
                          }
                          className="btn w-50 fs-5 text-white"
                          type="submit"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #0C8CE9 , #13629B)",
                            border: "0px",
                          }}
                          onClick={() => {
                            setMapStatus(true);
                            fetchRecordingData();
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
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </form>
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
                setMapStatus(false);
                setRecordingData([]);
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
                <Image src={redCircle} alt="redCircle" width={20} height={20} />
              )}
              &nbsp;LIVE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Button>
          </div>
          {recordingData && recordingData.length > 0 && (
            <Button
              className="btn btn-info ms-2"
              onClick={() => setCombineRouteSelected(!isCombineRouteSelected)}
            >
              Toggle Maps
            </Button>
          )}
        </div>
      </div>
      {mapStatus ? (
        <>
          <div className="col">
            {devMap && (
              <div>
                <>
                  {/* <RecordingStaffTrackingMap
                        trackingRequestBody={recordingTrackingRequestBody}
                        fetchRecordingData={fetchRecordingData}
                        position={position}
                        setPosition={setPosition}
                        path={path}
                        recordingData={recordingData}
                      /> */}
                  {isCombineRouteSelected ? (
                    <div className="col" style={{ marginTop: "60px" }}>
                      {recordingData && startLocation && endLocation && (
                        <TimelineBothCustomAndGoogle
                          recordingData={recordingData}
                          path={path}
                          setGoogleDuration={setGoogleDuration}
                          setOfficerDuration={setOfficerDuration}
                          startLocation={startLocation}
                          endLocation={endLocation}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {recordingData && startLocation && endLocation && (
                        <div className="row d-flex flex-wrap m-0">
                          <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <h3 className="fw-normal mb-4">Officer Path</h3>
                            <TimelineCustomPath
                              recordingData={recordingData}
                              path={path}
                              startLocation={startLocation}
                              endLocation={endLocation}
                              setOfficerDuration={setOfficerDuration}
                            />
                          </div>

                          <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            {position && path && (
                              <>
                                <h3 className="fw-normal mb-4">Google Path</h3>
                                <TimelineAuto
                                  recordingData={recordingData}
                                  setGoogleDuration={setGoogleDuration}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              </div>
            )}
            {/* <Visits /> */}
          </div>

          {recordingData &&
            recordingData.length > 0 &&
            selectedButton === 2 && (
              <>
                <p className="col fs-6 fw-normal mb-2 ps-3">
                  <span style={{ color: "#7A889C" }}>Project:</span>{" "}
                  {recordingData[0]?.projectName}
                </p>
                <div className="row d-flex flex-wrap m-0">
                  <div className="col-auto">
                    <StaffMemberInRecording recordingData={recordingData} />
                  </div>
                  <div className="col">
                    <TimelineCard
                      data={recordingData[0]}
                      startLocation={startLocation}
                      endLocation={endLocation}
                      googleDuration={googleDuration}
                      officerDuration={officerDuration}
                    />
                  </div>
                  {/* <ScheduleVisit /> */}
                </div>
              </>
            )}
        </>
      ) : (
        <div className="row mb-3 ms-2 me-2">
          <div className="col-lg-8 col-md-12 col-sm-12 position-relative">
            <div className="row">
              <div className="col">
                {data && data?.length === 0 && selectedButton === 1 && (
                  <p className="mt-5">No one is on Visit.</p>
                )}
                {devMap && data && (
                  <div className="position-relative" style={{ zIndex: 0 }}>
                    {/* {mapStatus ? <MapCarsRecorded /> : <MapCars />} */}
                    <>
                      <LiveStaffTrackingMap
                        data={data}
                        markerPositions={markerPositions}
                        getStaffWithCoordinates={getStaffWithCoordinates}
                        liveTrackingRequestBody={liveTrackingRequestBody}
                      />
                    </>
                  </div>
                )}
                {/* <Visits /> */}
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12">
            {data && data.length > 0 && selectedButton === 1 && (
              <StaffMember
                setLiveTrackingRequestBody={setLiveTrackingRequestBody}
                setMapStatus={setMapStatus}
                getStaffWithCoordinates={getStaffWithCoordinates}
              />
            )}
            {recordingData &&
              recordingData.length > 0 &&
              selectedButton === 2 && (
                <StaffMemberInRecording recordingData={recordingData} />
              )}
            {/* <ScheduleVisit /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffTracking;

import { MAIN_DASHBOARD_API, STAFF_TRACKING_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import Spinner from "@/app/components/Spinner";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import useAuthentication from "@/app/hooks/useAuthentication";
import apiClient from "@/app/services/api-client";
import {
  StaffTracking,
  TrackingRequestData,
} from "@/app/staff-tracking/components/StaffTracking";
import { formatDateTime } from "@/app/utils";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { DM_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import MasterReport from "./MasterReport";
import PPTSlideGenerator from "./PPTSlideGenerator/PPTSlideGenerator";
import { ProjectsList } from "./ProjectsTable/ProjectsTable";
import { data, tabs } from "./reportAnalysisData";
import TimeSpentOnProjectSiteFilterMenu from "./TimeSpentOnProjectSiteFilterMenu";

const dmSans = DM_Sans({ subsets: ["latin"], preload: false });

interface StartEndLatLng {
  visit: {
    visitID: number;
    visitStartTime: string;
    startLatLng: {
      latitude: string;
      longitude: string;
      createdAt: string;
    };
    endLatLng: {
      latitude: string;
      longitude: string;
      createdAt: string;
    };
  };
}

interface StaffTrackingData {
  data: StaffTracking[];
}

const ReportAnalysis = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(1);
  const [projectsData, setProjectsData] = useState<ProjectsList[]>();
  const [filteredData, setFilteredData] = useState<ProjectsList[]>();

  const cmInitiativeFilters = [
    {
      filterIdentifier: "ProjectSubType",
      filterValues: "CM Package",
    },
    {
      filterIdentifier: "ProjectSubType",
      filterValues: "CM Package, Flagship / Mega Project",
    },
    {
      filterIdentifier: "ProjectSubType",
      filterValues: "CM Package, Programme",
    },
  ];

  const [recordingData, setRecordingData] = useState<StaffTracking[]>([]);

  const [latLngsOfVisits, setLatLngsOfVisits] = useState<StartEndLatLng[]>([]);

  const [refresh, setRefresh] = useState(false);

  const { data: users } = useAuthentication({ refresh });

  const getProjectsList = async (status: string) => {
    console.log("status", status);
    try {
      const response = await apiClient.post(
        `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
        [...cmInitiativeFilters],
      );
      setProjectsData(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const fetchedIds = new Set(); // Tracks already fetched visitId-userId combinations

  useEffect(() => {
    if (filteredData) {
      const fetchPromises = []; // Collect promises for batching
      for (let i = 0; i < filteredData.length; i++) {
        const userId = users.find(
          (user) => user.fullName === filteredData[i].userName,
        )?.id;
        const visitId = filteredData[i].visitId;

        if (userId && visitId) {
          const fetchKey = `${userId}-${visitId}`;
          if (!fetchedIds.has(fetchKey)) {
            fetchedIds.add(fetchKey); // Mark this combination as fetched
            fetchPromises.push(
              fetchRecordingData({
                userId,
                visitId,
                date: null,
              }),
            );
          } else {
            fetchPromises.push(Promise.resolve(null)); // Maintain alignment
          }
        } else {
          fetchPromises.push(Promise.resolve(null)); // Maintain alignment
        }
      }

      // Batch update state after all API calls resolve
      Promise.all(fetchPromises)
        .then((results) => {
          const placeholder: StaffTracking = {
            coordinates: [
              {
                latitude: "",
                longitude: "",
                createdAt: "",
                id: -1,
                visitID: -1,
                userID: -1,
              },
            ],
            userId: "",
            userName: "",
            designation: "",
            phoneNumber: "",
            mobile: "",
            projectName: "",
            districtName: "",
            userPicture: "",
            planStartDate: "",
            planEndDate: "",
            visitStartTime: "",
            visitEndTime: "",
            carNumber: "",
            carPicture: "",
            driverName: "",
            status: "",
            startAddressLat: "",
            startAddressLong: "",
            endAddressLat: "",
            endAddressLong: "",
          };

          const alignedResults = results.map((item) => item ?? placeholder); // Replace null/undefined with a valid placeholder
          // setRecordingData((prev) => [...alignedResults]);
          setRecordingData([...alignedResults]);
        })
        .catch((err) => console.error("Error fetching recording data:", err));
    }
  }, [filteredData]);

  const fetchRecordingData = async (
    recordingTrackingRequestBody: TrackingRequestData,
  ) => {
    try {
      const response = await apiClient.post<StaffTrackingData>(
        STAFF_TRACKING_API,
        recordingTrackingRequestBody,
      );
      // console.log("recording data response:", response.data.data[0]);
      return response.data.data[0];
      // setRecordingData((prev) => [...prev, response.data.data[0]]);
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const newLatLngs: StartEndLatLng[] = [];

      for (let i = 0; i < recordingData.length; i++) {
        if (
          recordingData &&
          recordingData?.length > 0 &&
          recordingData[i]?.coordinates &&
          recordingData[i]?.coordinates.length > 0
        ) {
          newLatLngs.push({
            visit: {
              visitID: recordingData[i].coordinates[0].visitID,
              visitStartTime: recordingData[i].visitStartTime,
              startLatLng: {
                latitude: recordingData[i].coordinates[0].latitude,
                longitude: recordingData[i].coordinates[0].longitude,
                createdAt: recordingData[i].coordinates[0].createdAt,
              },
              endLatLng: {
                latitude:
                  recordingData[i].coordinates[
                    recordingData[i].coordinates.length - 1
                  ].latitude,
                longitude:
                  recordingData[i].coordinates[
                    recordingData[i].coordinates.length - 1
                  ].longitude,
                createdAt:
                  recordingData[i].coordinates[
                    recordingData[i].coordinates.length - 1
                  ].createdAt,
              },
            },
          });
        } else {
          newLatLngs.push({
            visit: {
              visitID: recordingData[i]?.coordinates[0]?.visitID || 0,
              visitStartTime: recordingData[i]?.visitStartTime || "",
              startLatLng: {
                latitude: "0",
                longitude: "0",
                createdAt: "0",
              },
              endLatLng: {
                latitude: "0",
                longitude: "0",
                createdAt: "0",
              },
            },
          });
        }
      }

      setLatLngsOfVisits(newLatLngs);
      console.log("Updated latLngs final:", newLatLngs); // For debugging
      console.log("recordingData final:", recordingData); // Debugging the input data
    }, 20000);
  }, [recordingData]);

  useEffect(() => {
    console.log("latLngsOfVisitsV", latLngsOfVisits);
  }, [latLngsOfVisits]);

  const calculateOfficerDuration = (
    firstCoordinateCreatedAt: string,
    lastCoordinateCreatedAt: string,
  ) => {
    const startDate = new Date(firstCoordinateCreatedAt);
    const endDate = new Date(lastCoordinateCreatedAt);
    const durationInMs = endDate.getTime() - startDate.getTime();
    const minutes = Math.floor(durationInMs / (1000 * 60));
    const hours = Math.floor(durationInMs / (1000 * 60 * 60));
    const days = Math.floor(durationInMs / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} ${days === 1 ? "day" : "days"} `;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} `;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? "min" : "mins"} `;
    } else {
      return ``;
    }
  };

  function calculateTravelTime(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    averageSpeed: number = 50, // Average speed in km/h
  ): string {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const earthRadiusKm = 6371; // Earth's radius in km
    const dLat = toRadians(endLat - startLat);
    const dLng = toRadians(endLng - startLng);

    const lat1 = toRadians(startLat);
    const lat2 = toRadians(endLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c; // Distance in km
    const time = distance / averageSpeed; // Time in hours

    // Convert time to hours and minutes
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);

    if (hours > 0) {
      return `${hours} h ${minutes} mins`; // Return travel time as a string
    } else {
      return `${minutes} mins`; // Return travel time as a string
    }
  }

  const parseDurationToMinutes = (duration: string): number => {
    const [value, unit] = duration.split(" ");
    const numericValue = parseInt(value, 10);

    if (unit?.toLowerCase().startsWith("min")) {
      return numericValue;
    } else if (unit?.toLowerCase().startsWith("hou")) {
      return numericValue * 60;
    } else if (unit?.toLowerCase().startsWith("day")) {
      return numericValue * 24 * 60;
    }
    return 0;
  };

  const formatMinutesToReadableTime: any = (minutes: number): string => {
    const absMinutes = Math.abs(minutes); // Handle negative durations
    const hours = Math.floor(absMinutes / 60);
    const remainingMinutes = absMinutes % 60;

    const hourString = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : "";
    const minuteString =
      remainingMinutes > 0
        ? `${remainingMinutes} min${remainingMinutes > 1 ? "s" : ""}`
        : "";

    // Combine non-empty parts
    return [hourString, minuteString].filter(Boolean).join(", ");
  };

  const calculateTimeSpent = (
    officerDuration: string,
    googleDuration: string,
  ): string => {
    const officerMinutes = parseDurationToMinutes(officerDuration);
    const googleMinutes = parseDurationToMinutes(googleDuration);

    const differenceInMinutes = officerMinutes - googleMinutes;

    const formattedTime = formatMinutesToReadableTime(differenceInMinutes);
    return differenceInMinutes < 0
      ? `${formattedTime} less`
      : `${formattedTime}`;
  };

  const label = "Report Analysis - Time Spent on Project Site";

  const exportTimeSpentonProjectSiteToExcel = () => {
    // Prepare data for export
    if (projectsData) {
      const data = projectsData.map((project, i) => {
        const visitData = latLngsOfVisits.find(
          (visit) => visit?.visit?.visitID === project.visitId,
        );

        return {
          S_no: i + 1,
          Gs_No: project.id,
          Project_Name: project.projectName,
          District_Name: project.districtName,
          Sector_Name: project.sectorName,
          User_Name: project.userName,
          Visit_Date: visitData
            ? formatDateTime(visitData.visit.visitStartTime, "date")
            : "N/A",
          Visit_Time: visitData
            ? calculateOfficerDuration(
                visitData.visit.startLatLng.createdAt,
                visitData.visit.endLatLng.createdAt,
              )
            : "N/A",
          Travel_Time: visitData
            ? calculateTravelTime(
                parseFloat(visitData.visit.startLatLng.latitude),
                parseFloat(visitData.visit.startLatLng.longitude),
                parseFloat(visitData.visit.endLatLng.latitude),
                parseFloat(visitData.visit.endLatLng.longitude),
              )
            : "N/A",
          Time_Spent_On_Project_Site: visitData
            ? calculateTimeSpent(
                calculateOfficerDuration(
                  visitData.visit.startLatLng.createdAt,
                  visitData.visit.endLatLng.createdAt,
                ),
                calculateTravelTime(
                  parseFloat(visitData.visit.startLatLng.latitude),
                  parseFloat(visitData.visit.startLatLng.longitude),
                  parseFloat(visitData.visit.endLatLng.latitude),
                  parseFloat(visitData.visit.endLatLng.longitude),
                ),
              )
            : "N/A",
        };
      });

      // Create a worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");

      // Write the workbook to a file
      XLSX.writeFile(workbook, "Time Spent on Project Site.xlsx");
    }
  };

  return (
    <div className={`container-fluid ${dmSans.className}`}>
      <div
        className="col p-3"
        style={{
          backgroundImage: "url('/images/bg2.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255, 255, 255, 0.29)",
          borderRadius: "15px",
          height: "100%",
        }}
      >
        <div
          className="col"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, rgba(239, 239, 239,.6) , rgba(255, 255, 255,.08))",
            border: "1px solid rgba(255, 255, 255, 0.29)",
            borderRadius: "15px",
            padding: "34px 50px",
            width: "100%",
            height: "100%",
          }}
        >
          <h4 className="fw-bold mb-3">Report Analysis</h4>
          <div className="row d-flex flex-wrap justify-content-start m-0 mb-2">
            {tabs?.slice(1).map((tab, i) => (
              <Button
                key={i}
                onClick={() => setSelectedIndex(i + 1)}
                className={`btn col-auto py-2 shadow-none mb-2 me-2 ${
                  selectedIndex === i + 1
                    ? "color-sea-blue fw-bold"
                    : "text-light"
                }`}
                style={{
                  background: `${
                    selectedIndex === i + 1
                      ? "rgba(250, 250, 250, 0.56)"
                      : `${tab.backGroundColor}`
                  }`,
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  borderBottom: `${
                    selectedIndex === i + 1 ? "2px solid #0c8ce9" : ""
                  }`,
                }}
              >
                {tab.label}
              </Button>
            ))}
            <TimeSpentOnProjectSiteFilterMenu
              getProjectsList={getProjectsList}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              projectsData={projectsData}
              setProjectsData={setProjectsData}
              filteredData={filteredData}
              setFilteredData={setFilteredData}
            />
            <PPTSlideGenerator />
            <MasterReport />
          </div>
          {selectedIndex === 14 ? (
            <div className="col mb-3 text-end">
              <DownloadDropDown
                onClickExcel={exportTimeSpentonProjectSiteToExcel}
              />
            </div>
          ) : (
            <div className="col mb-3 text-end">
              {/* <DownloadDropDown onClickExcel={()=>downloadReportAnalysisToExcel(data[selectedIndex],"ReportAnalysis.xlsx")} /> */}
            </div>
          )}
          <div
            className="table-responsive"
            style={{
              height: "420px",
              overflow: "scroll",
            }}
          >
            {selectedIndex === 0 ? (
              // <table className="table table-hover fs17px">
              //   <thead
              //     style={{
              //       background: "#4F81BD",
              //       borderTopRightRadius: "10px",
              //     }}
              //   >
              //     <tr className="text-center">
              //       <td
              //         className="text-secondary border-bottom-0 text-light"
              //         style={{
              //           borderTopLeftRadius: "10px",
              //         }}
              //       >
              //         S.no
              //       </td>
              //       <td className="text-secondary border-bottom-0 text-light">
              //         Row Labels
              //       </td>
              //       <td className="text-secondary border-bottom-0 text-light">
              //         No
              //       </td>
              //       <td className="text-secondary border-bottom-0 text-light">
              //         Yes
              //       </td>
              //       <td className="text-secondary border-bottom-0 text-light">
              //         Grand Total
              //       </td>
              //     </tr>
              //   </thead>
              //   <tbody>
              //     {data.reportsGenerated?.map((d, i) => (
              //       <tr key={i}>
              //         <td>{i + 1}</td>
              //         <td className="text-start">{d.rowLabels}</td>
              //         <td>{d.no}</td>
              //         <td>{d.yes}</td>
              //         <td>{d.grandTotal}</td>
              //       </tr>
              //     ))}
              // <tr className="bg-light fw-normal">
              //         <td></td>
              //         <td className="text-start">Grand Total</td>
              //         <td>39</td>
              //         <td>62</td>
              //         <td>101</td>
              //       </tr>
              //   </tbody>
              // </table>
              <></>
            ) : selectedIndex === 1 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="fw-bold text-center">
                    <td
                      className="text-start text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      1%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      100%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      15%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      22%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      28%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      34%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      63%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      73%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.reportsGeneratedNoCompRat?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className=" text-center fw-bold"
                        style={{ background: "#DCE6F1" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["1%"]}</td>
                        <td>{d["100%"]}</td>
                        <td>{d["15%"]}</td>
                        <td>{d["22%"]}</td>
                        <td>{d["28%"]}</td>
                        <td>{d["34%"]}</td>
                        <td>{d["63%"]}</td>
                        <td>{d["73%"]}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((d, i) => (
                        <tr key={i} className="text-center fw-normal bg-light">
                          <td></td>
                          <td className="text-start">{d.rowLabels}</td>
                          <td>{d["1%"]}</td>
                          <td>{d["100%"]}</td>
                          <td>{d["15%"]}</td>
                          <td>{d["22%"]}</td>
                          <td>{d["28%"]}</td>
                          <td>{d["34%"]}</td>
                          <td>{d["63%"]}</td>
                          <td>{d["73%"]}</td>
                          <td>{d.grandTotal}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>3</td>
                    <td>22</td>
                    <td>9</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>39</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 2 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      100%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      28%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      55%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      59%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      60%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      62%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      63%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      76%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      79%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.reportsGeneratedYesCompR?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#DCE6F1" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["100%"]}</td>
                        <td>{d["28%"]}</td>
                        <td>{d["55%"]}</td>
                        <td>{d["59%"]}</td>
                        <td>{d["60%"]}</td>
                        <td>{d["62%"]}</td>
                        <td>{d["63%"]}</td>
                        <td>{d["76%"]}</td>
                        <td>{d["79%"]}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((d, i) => (
                        <tr key={i} className="fw-normal bg-light text-center">
                          <td></td>
                          <td className="text-start">{d.rowLabels}</td>
                          <td>{d["100%"]}</td>
                          <td>{d["28%"]}</td>
                          <td>{d["55%"]}</td>
                          <td>{d["59%"]}</td>
                          <td>{d["60%"]}</td>
                          <td>{d["62%"]}</td>
                          <td>{d["63%"]}</td>
                          <td>{d["76%"]}</td>
                          <td>{d["79%"]}</td>
                          <td>{d.grandTotal}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>52</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>3</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>62</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 3 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      18 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      29 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      45 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      76 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      8 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Submitted
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.reportsGeneratedNoDays?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#DCE6F1" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["18DaysDelayed"]}</td>
                        <td>{d["29DaysDelayed"]}</td>
                        <td>{d["45DaysDelayed"]}</td>
                        <td>{d["76DaysDelayed"]}</td>
                        <td>{d["8DaysDelayed"]}</td>
                        <td>{d.submitted}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((d, i) => (
                        <tr key={i} className="fw-normal bg-light text-center">
                          <td></td>
                          <td className="text-start">{d.rowLabels}</td>
                          <td>{d["18DaysDelayed"]}</td>
                          <td>{d["29DaysDelayed"]}</td>
                          <td>{d["45DaysDelayed"]}</td>
                          <td>{d["76DaysDelayed"]}</td>
                          <td>{d["8DaysDelayed"]}</td>
                          <td>{d.submitted}</td>
                          <td>{d.grandTotal}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td className="text-start">Grand Total</td>
                    <td>7</td>
                    <td>4</td>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                    <td>24</td>
                    <td>39</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 4 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      1%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      100%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      15%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      22%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      28%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      33%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      60%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      72%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.completionRateNoDistWise?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["1%"]}</td>
                        <td>{d["100%"]}</td>
                        <td>{d["15%"]}</td>
                        <td>{d["22%"]}</td>
                        <td>{d["28%"]}</td>
                        <td>{d["33%"]}</td>
                        <td>{d["60%"]}</td>
                        <td>{d["72%"]}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal text-center"
                            style={{ background: "#DCE6F1" }}
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{group["1%"]}</td>
                            <td>{group["100%"]}</td>
                            <td>{group["15%"]}</td>
                            <td>{group["22%"]}</td>
                            <td>{group["28%"]}</td>
                            <td>{group["33%"]}</td>
                            <td>{group["60%"]}</td>
                            <td>{group["72%"]}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                          {group.subGroups.map((subGroup, i) => (
                            <tr
                              key={i}
                              className="fw-normal bg-light text-center"
                            >
                              <td></td>
                              <td className="text-start">
                                {subGroup.rowLabels}
                              </td>
                              <td>{subGroup["1%"]}</td>
                              <td>{subGroup["100%"]}</td>
                              <td>{subGroup["15%"]}</td>
                              <td>{subGroup["22%"]}</td>
                              <td>{subGroup["28%"]}</td>
                              <td>{subGroup["33%"]}</td>
                              <td>{subGroup["60%"]}</td>
                              <td>{subGroup["72%"]}</td>
                              <td>{subGroup.grandTotal}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>3</td>
                    <td>23</td>
                    <td>9</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 5 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      No
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Yes
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.reportsIssuedVsNotIsu?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d.no}</td>
                        <td>{d.yes}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((d, i) => (
                        <tr key={i} className="fw-normal bg-light text-center">
                          <td></td>
                          <td className="text-start">{d.rowLabels}</td>
                          <td>{d.no}</td>
                          <td>{d.yes}</td>
                          <td>{d.grandTotal}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>40</td>
                    <td>59</td>
                    <td>99</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 6 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      16 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      27 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      43 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      6 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      74 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Submitted
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.notIssuedFromDays?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["16DaysDelayed"]}</td>
                        <td>{d["27DaysDelayed"]}</td>
                        <td>{d["43DaysDelayed"]}</td>
                        <td>{d["6DaysDelayed"]}</td>
                        <td>{d["74DaysDelayed"]}</td>
                        <td>{d.submitted}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal text-center"
                            style={{ background: "#DCE6F1" }}
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{group["16DaysDelayed"]}</td>
                            <td>{group["27DaysDelayed"]}</td>
                            <td>{group["43DaysDelayed"]}</td>
                            <td>{group["6DaysDelayed"]}</td>
                            <td>{group["74DaysDelayed"]}</td>
                            <td>{group.submitted}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>7</td>
                    <td>4</td>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                    <td>25</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 7 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      1%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      100%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      16%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      27%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      28%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      54%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      58%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      61%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      75%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      77%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      78%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      79%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      80%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.completionRateYesSub?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["1%"]}</td>
                        <td>{d["100%"]}</td>
                        <td>{d["16%"]}</td>
                        <td>{d["27%"]}</td>
                        <td>{d["28%"]}</td>
                        <td>{d["54%"]}</td>
                        <td>{d["58%"]}</td>
                        <td>{d["61%"]}</td>
                        <td>{d["75%"]}</td>
                        <td>{d["77%"]}</td>
                        <td>{d["78%"]}</td>
                        <td>{d["79%"]}</td>
                        <td>{d["80%"]}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal bg-light text-center"
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{d["1%"]}</td>
                            <td>{d["100%"]}</td>
                            <td>{d["16%"]}</td>
                            <td>{d["27%"]}</td>
                            <td>{d["28%"]}</td>
                            <td>{d["54%"]}</td>
                            <td>{d["58%"]}</td>
                            <td>{d["61%"]}</td>
                            <td>{d["75%"]}</td>
                            <td>{d["77%"]}</td>
                            <td>{d["78%"]}</td>
                            <td>{d["79%"]}</td>
                            <td>{d["80%"]}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>1</td>
                    <td>47</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>59</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 8 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      1%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      100%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      15%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      22%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      28%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      33%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      60%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      72%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.completionRateNoSub?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["1%"]}</td>
                        <td>{d["100%"]}</td>
                        <td>{d["15%"]}</td>
                        <td>{d["22%"]}</td>
                        <td>{d["28%"]}</td>
                        <td>{d["33%"]}</td>
                        <td>{d["60%"]}</td>
                        <td>{d["72%"]}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal bg-light text-center"
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{d["1%"]}</td>
                            <td>{d["100%"]}</td>
                            <td>{d["15%"]}</td>
                            <td>{d["22%"]}</td>
                            <td>{d["28%"]}</td>
                            <td>{d["33%"]}</td>
                            <td>{d["60%"]}</td>
                            <td>{d["72%"]}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>3</td>
                    <td>23</td>
                    <td>9</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 9 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      No
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Yes
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.reportIssVsNotIsuDistWise?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d.no}</td>
                        <td>{d.yes}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal text-center"
                            style={{ background: "#DCE6F1" }}
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{group.no}</td>
                            <td>{group.yes}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                          {group.subGroups.map((subGroup, i) => (
                            <tr
                              key={i}
                              className="fw-normal bg-light text-center"
                            >
                              <td></td>
                              <td className="text-start">
                                {subGroup.rowLabels}
                              </td>
                              <td>{subGroup.no}</td>
                              <td>{subGroup.yes}</td>
                              <td>{subGroup.grandTotal}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>40</td>
                    <td>59</td>
                    <td>99</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 10 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      16 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      27 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      43 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      6 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      74 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Submitted
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.notIssuedFromDaysDistWise?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["16DaysDelayed"]}</td>
                        <td>{d["27DaysDelayed"]}</td>
                        <td>{d["43DaysDelayed"]}</td>
                        <td>{d["6DaysDelayed"]}</td>
                        <td>{d["74DaysDelayed"]}</td>
                        <td>{d.submitted}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal text-center"
                            style={{ background: "#DCE6F1" }}
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{group["16DaysDelayed"]}</td>
                            <td>{group["27DaysDelayed"]}</td>
                            <td>{group["43DaysDelayed"]}</td>
                            <td>{group["6DaysDelayed"]}</td>
                            <td>{group["74DaysDelayed"]}</td>
                            <td>{group.submitted}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                          {group.subGroups.map((subGroup, i) => (
                            <tr
                              key={i}
                              className="fw-normal bg-light text-center"
                            >
                              <td></td>
                              <td className="text-start">
                                {subGroup.rowLabels}
                              </td>
                              <td>{subGroup["16DaysDelayed"]}</td>
                              <td>{subGroup["27DaysDelayed"]}</td>
                              <td>{subGroup["43DaysDelayed"]}</td>
                              <td>{subGroup["6DaysDelayed"]}</td>
                              <td>{subGroup["74DaysDelayed"]}</td>
                              <td>{subGroup.submitted}</td>
                              <td>{subGroup.grandTotal}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>7</td>
                    <td>4</td>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                    <td>25</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 11 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      1%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      100%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      15%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      22%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      28%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      33%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      60%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      72%
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.completionRateNoSectWise?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["1%"]}</td>
                        <td>{d["100%"]}</td>
                        <td>{d["15%"]}</td>
                        <td>{d["22%"]}</td>
                        <td>{d["28%"]}</td>
                        <td>{d["33%"]}</td>
                        <td>{d["60%"]}</td>
                        <td>{d["72%"]}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal text-center"
                            style={{ background: "#DCE6F1" }}
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{group["1%"]}</td>
                            <td>{group["100%"]}</td>
                            <td>{group["15%"]}</td>
                            <td>{group["22%"]}</td>
                            <td>{group["28%"]}</td>
                            <td>{group["33%"]}</td>
                            <td>{group["60%"]}</td>
                            <td>{group["72%"]}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                          {group.subGroups.map((subGroup, i) => (
                            <tr
                              key={i}
                              className="fw-normal bg-light text-center"
                            >
                              <td></td>
                              <td className="text-start">
                                {subGroup.rowLabels}
                              </td>
                              <td>{subGroup["1%"]}</td>
                              <td>{subGroup["100%"]}</td>
                              <td>{subGroup["15%"]}</td>
                              <td>{subGroup["22%"]}</td>
                              <td>{subGroup["28%"]}</td>
                              <td>{subGroup["33%"]}</td>
                              <td>{subGroup["60%"]}</td>
                              <td>{subGroup["72%"]}</td>
                              <td>{subGroup.grandTotal}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-normal bg-light">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>3</td>
                    <td>23</td>
                    <td>9</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 12 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      No
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Yes
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.reportIssVsNotIsuSectWise?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d.no}</td>
                        <td>{d.yes}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal text-center"
                            style={{ background: "#DCE6F1" }}
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{group.no}</td>
                            <td>{group.yes}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                          {group.subGroups.map((subGroup, i) => (
                            <tr
                              key={i}
                              className="fw-normal bg-light text-center"
                            >
                              <td></td>
                              <td className="text-start">
                                {subGroup.rowLabels}
                              </td>
                              <td>{subGroup.no}</td>
                              <td>{subGroup.yes}</td>
                              <td>{subGroup.grandTotal}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-normal bg-light">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>40</td>
                    <td>59</td>
                    <td>99</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 13 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Row Labels
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      16 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      27 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      43 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      6 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      74 Days Delayed
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Submitted
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Grand Total
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.notIssuedFromDaysSectWise?.map((d, i) => (
                    <>
                      <tr
                        key={i}
                        className="fw-bold text-center"
                        style={{ background: "#95B3D7" }}
                      >
                        <td>{i + 1}</td>
                        <td className="text-start">{d.rowLabels}</td>
                        <td>{d["16DaysDelayed"]}</td>
                        <td>{d["27DaysDelayed"]}</td>
                        <td>{d["43DaysDelayed"]}</td>
                        <td>{d["6DaysDelayed"]}</td>
                        <td>{d["74DaysDelayed"]}</td>
                        <td>{d.submitted}</td>
                        <td>{d.grandTotal}</td>
                      </tr>
                      {d.groups?.map((group, i) => (
                        <>
                          <tr
                            key={i}
                            className="fw-normal text-center"
                            style={{ background: "#DCE6F1" }}
                          >
                            <td></td>
                            <td className="text-start">{group.rowLabels}</td>
                            <td>{group["16DaysDelayed"]}</td>
                            <td>{group["27DaysDelayed"]}</td>
                            <td>{group["43DaysDelayed"]}</td>
                            <td>{group["6DaysDelayed"]}</td>
                            <td>{group["74DaysDelayed"]}</td>
                            <td>{group.submitted}</td>
                            <td>{group.grandTotal}</td>
                          </tr>
                          {group.subGroups.map((subGroup, i) => (
                            <tr
                              key={i}
                              className="fw-normal bg-light text-center"
                            >
                              <td></td>
                              <td className="text-start">
                                {subGroup.rowLabels}
                              </td>
                              <td>{subGroup["16DaysDelayed"]}</td>
                              <td>{subGroup["27DaysDelayed"]}</td>
                              <td>{subGroup["43DaysDelayed"]}</td>
                              <td>{subGroup["6DaysDelayed"]}</td>
                              <td>{subGroup["74DaysDelayed"]}</td>
                              <td>{subGroup.submitted}</td>
                              <td>{subGroup.grandTotal}</td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                  <tr className="fw-bold bg-light text-center">
                    <td></td>
                    <td className="text-start">Grand Total</td>
                    <td>7</td>
                    <td>4</td>
                    <td>2</td>
                    <td>1</td>
                    <td>1</td>
                    <td>25</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </table>
            ) : selectedIndex === 14 ? (
              <table className="table table-hover fs17px">
                <thead
                  style={{
                    background: "#4F81BD",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <tr className="text-center">
                    <td
                      className="text-secondary border-bottom-0 text-light"
                      style={{
                        borderTopLeftRadius: "10px",
                      }}
                    >
                      S.no
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Gs No.
                    </td>
                    <td className="text-start text-secondary border-bottom-0 text-light">
                      Project Name
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      District Name
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Sector Name
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      User Name
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Visit Date
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Visit Time
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      Travel time
                    </td>
                    <td className="text-secondary border-bottom-0 text-light">
                      <span className="text-nowrap">Time Spent</span> on{" "}
                      <span className="text-nowrap">Project Site</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.map((d, i) => (
                    <tr key={i} className="fw-normal bg-light text-center">
                      <td>{i + 1}</td>
                      <td>{d.id}</td>
                      <td className="text-start">{d.projectName}</td>
                      <td>{d.districtName}</td>
                      <td>{d.sectorName}</td>
                      <td>{d.userName} </td>
                      <td>
                        {latLngsOfVisits &&
                        latLngsOfVisits.length > 0 &&
                        latLngsOfVisits[i] &&
                        latLngsOfVisits[i].visit.visitID === d.visitId ? (
                          formatDateTime(
                            latLngsOfVisits[i].visit.visitStartTime,
                            "date",
                          )
                        ) : latLngsOfVisits && latLngsOfVisits.length <= 0 ? (
                          <Spinner />
                        ) : (
                          <span></span>
                        )}
                      </td>
                      <td>
                        {latLngsOfVisits &&
                        latLngsOfVisits.length > 0 &&
                        latLngsOfVisits[i] &&
                        latLngsOfVisits[i].visit.visitID === d.visitId ? (
                          calculateOfficerDuration(
                            latLngsOfVisits[i].visit.startLatLng.createdAt,
                            latLngsOfVisits[i].visit.endLatLng.createdAt,
                          )
                        ) : latLngsOfVisits && latLngsOfVisits.length <= 0 ? (
                          <Spinner />
                        ) : (
                          <span></span>
                        )}
                      </td>
                      <td>
                        {latLngsOfVisits &&
                        latLngsOfVisits.length > 0 &&
                        latLngsOfVisits[i] &&
                        latLngsOfVisits[i].visit.visitID === d.visitId ? (
                          calculateTravelTime(
                            parseFloat(
                              latLngsOfVisits[i].visit.startLatLng.latitude,
                            ),
                            parseFloat(
                              latLngsOfVisits[i].visit.startLatLng.longitude,
                            ),
                            parseFloat(
                              latLngsOfVisits[i].visit.endLatLng.latitude,
                            ),
                            parseFloat(
                              latLngsOfVisits[i].visit.endLatLng.longitude,
                            ),
                          )
                        ) : latLngsOfVisits && latLngsOfVisits.length <= 0 ? (
                          <Spinner />
                        ) : (
                          <span></span>
                        )}
                      </td>
                      <td>
                        {latLngsOfVisits &&
                        latLngsOfVisits.length > 0 &&
                        latLngsOfVisits[i] &&
                        latLngsOfVisits[i].visit.visitID === d.visitId ? (
                          calculateTimeSpent(
                            calculateOfficerDuration(
                              latLngsOfVisits[i].visit.startLatLng.createdAt,
                              latLngsOfVisits[i].visit.endLatLng.createdAt,
                            ),
                            calculateTravelTime(
                              parseFloat(
                                latLngsOfVisits[i].visit.startLatLng.latitude,
                              ),
                              parseFloat(
                                latLngsOfVisits[i].visit.startLatLng.longitude,
                              ),
                              parseFloat(
                                latLngsOfVisits[i].visit.endLatLng.latitude,
                              ),
                              parseFloat(
                                latLngsOfVisits[i].visit.endLatLng.longitude,
                              ),
                            ),
                          )
                        ) : latLngsOfVisits && latLngsOfVisits.length <= 0 ? (
                          <Spinner />
                        ) : (
                          <span></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DirectionProps {
  startLatLng: { latitude: string; longitude: string; createdAt: string };
  endLatLng: { latitude: string; longitude: string; createdAt: string };
}

function Directions({ startLatLng, endLatLng }: DirectionProps) {
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [duration, setDuration] = useState<string | undefined>();

  useEffect(() => {
    if (!routesLibrary) {
      console.log("routesLibrary is not loaded yet");
      return;
    }
    console.log("routesLibrary loaded:", routesLibrary);
    setDirectionsService(new routesLibrary.DirectionsService());
  }, [routesLibrary]);

  useEffect(() => {
    if (!directionsService) {
      console.log("directionsService is not initialized");
    } else {
      console.log("directionsService initialized:", directionsService);
    }
  }, [directionsService]);

  useEffect(() => {
    if (!directionsService) return;

    console.log("Fetching directions with:", {
      origin: startLatLng,
      destination: endLatLng,
    });

    directionsService
      .route({
        origin: {
          lat: parseFloat(startLatLng.latitude),
          lng: parseFloat(startLatLng.longitude),
        },
        destination: {
          lat: parseFloat(endLatLng.latitude),
          lng: parseFloat(endLatLng.longitude),
        },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      })
      .then((response) => {
        const leg = response.routes[0]?.legs[0];
        if (leg?.duration?.text) {
          setDuration(leg.duration.text); // Set duration to parent
        }
      })
      .catch((error) => {
        console.error("Error fetching directions:", error);
        setDuration(undefined); // Handle error gracefully
      });
  }, [directionsService, startLatLng, endLatLng]);

  return <>{duration || "Calculating..."}</>;
}

export default ReportAnalysis;

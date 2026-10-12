"use client";
import { MAIN_DASHBOARD_API, STAFF_TRACKING_API } from "@/app/APIs";
import { ProjectsList } from "@/app/dashboard/components/ProjectsTable/ProjectsTable";
import useAuthentication from "@/app/hooks/useAuthentication";
import apiClient from "@/app/services/api-client";
import {
  StaffTracking,
  TrackingRequestData,
} from "@/app/staff-tracking/components/StaffTracking";
import { formatDateTime } from "@/app/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import TimeSpentOnProjectSiteFilterMenu from "./TimeSpentOnProjectSiteFilterMenu";

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

interface Props {
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
}
const TimeSpendOnProjectSiteData = ({
  selectedIndex,
  setSelectedIndex,
}: Props) => {
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
    <TimeSpentOnProjectSiteFilterMenu
      getProjectsList={getProjectsList}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      projectsData={projectsData}
      setProjectsData={setProjectsData}
      filteredData={filteredData}
      setFilteredData={setFilteredData}
    />
  );
};

export default TimeSpendOnProjectSiteData;

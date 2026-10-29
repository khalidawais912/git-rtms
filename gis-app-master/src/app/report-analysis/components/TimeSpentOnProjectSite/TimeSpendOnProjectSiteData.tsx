"use client";
import { MAIN_DASHBOARD_API, STAFF_TRACKING_API } from "@/services/endpoints";
import { ProjectsList } from "@/app/dashboard/components/ProjectsTable/ProjectsTable";
import { useAuthentication } from "@/features/users";
import apiClient from "@/services/client";
import { StaffTracking } from "@/app/staff-tracking/components/StaffTracking";
import { TrackingRequestData } from "@/app/staff-tracking/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TimeSpentOnProjectSiteFilterMenu from "./TimeSpentOnProjectSiteFilterMenu";
import { StaffTrackingData, StartEndLatLng } from "../../types";
import { useEffectEvent } from "@/hooks/useEffectEvent";
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

  const [, setLatLngsOfVisits] = useState<StartEndLatLng[]>([]);

  const [refresh] = useState(false);

  const { data: users } = useAuthentication({ refresh });

  const getProjectsList = async (status: string) => {
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

  const onFilteredDataChange = useEffectEvent(() => {
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
          setRecordingData([...alignedResults]);
        })
        .catch((err) => console.error("Error fetching recording data:", err));
    }
  });
  useEffect(() => onFilteredDataChange(), [filteredData, onFilteredDataChange]);

  const fetchRecordingData = async (
    recordingTrackingRequestBody: TrackingRequestData,
  ) => {
    try {
      const response = await apiClient.post<StaffTrackingData>(
        STAFF_TRACKING_API,
        recordingTrackingRequestBody,
      );
      return response.data.data[0];
    } catch (err) {
      console.error(err);
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
       // For debugging
       // Debugging the input data
    }, 20000);
  }, [recordingData]);









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

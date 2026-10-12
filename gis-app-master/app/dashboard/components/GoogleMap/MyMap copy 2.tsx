"use client";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

import {
  DISTRICT_API,
  MAIN_DASHBOARD_API,
  SINGLE_PROJECT_DASHBOARD_API,
} from "@/app/APIs";
import useDistrict from "@/app/hooks/useDistrict";
import apiClient from "@/app/services/api-client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { DistrictList, FilterData, MainDashboard } from "../Dashboard";
import DistrictCard from "./DistrictCard";
import ProjectCard from "./ProjectCard";

export interface DistrictProjects {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  sectorId: number;
  address: string;
  city: string;
  division: string;
  districtId: number;
  latitude: string;
  longitude: string;
  locationCoordinates: string;
  status: string;
  approvalDate: string;
}

interface Props {
  data: MainDashboard;
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  activeFilter: string;
  cmInitiativeFilters: FilterData[];
  adpFilters: FilterData[];
  otherFilters: FilterData[];
  setOtherFilters: Dispatch<SetStateAction<FilterData[]>>;
  dashboardType: string | null | undefined;
}

const MyMap = ({
  data,
  handleSubmit,
  activeFilter,
  cmInitiativeFilters,
  adpFilters,
  otherFilters,
  setOtherFilters,
  dashboardType,
}: Props) => {
  const InitialCenterPosition = {
    lat: 31.1704,
    lng: 72.7097,
  };

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        defaultZoom={7}
        defaultCenter={InitialCenterPosition}
        gestureHandling={"greedy"}
        style={{ borderRadius: "10px" }}
      ></Map>
    </APIProvider>
  );
};

export default MyMap;

const MapWithMarkers = ({
  data,
  handleSubmit,
  activeFilter,
  cmInitiativeFilters,
  adpFilters,
  otherFilters,
  setOtherFilters,
  dashboardType,
}: Props) => {
  const map = useMap();

  const [open, setOpen] = useState(false);
  const [districtList, setDistrictList] = useState<DistrictList[]>([]);

  useEffect(() => {
    setDistrictList(data.disitrictlist);
  }, [data]);

  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(0);
  const [activeDistrict, setActiveDistrict] = useState<DistrictList | null>(
    null
  );
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  const [activeDistrictId, setActiveDistrictId] = useState<number | null>(null);
  const [activeProjects, setActiveProjects] = useState<DistrictProjects[]>([]);
  const { data: districts } = useDistrict();

  const handleDistrictClick = async (
    districtId: number,
    showProjects: boolean
  ) => {
    if (showProjects) {
      try {
        const response = await apiClient.get(
          `${DISTRICT_API}/GetProjectByDistrict?districtId=${districtId}`
        );
        setActiveProjects(response.data.data);
        setActiveDistrictId(districtId);
      } catch (err) {
        console.error("Submission error:", err);
      }
    } else {
      setActiveProjects([]);
      setActiveDistrictId(null);
    }
  };

  const handleMarkerClick = (districtId: number) => {
    const isActive = activeDistrictId === districtId;
    const districtName = districts.find(
      (district) => district.id === districtId
    )?.districtName;

    // Update otherFilters
    setOtherFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const districtFilterIndex = updatedFilters.findIndex(
        (filter) => filter.filterIdentifier === "District"
      );

      if (districtFilterIndex !== -1) {
        // If "District" filter exists, update it
        updatedFilters[districtFilterIndex].filterValues = districtName!;
      } else {
        // Otherwise, add a new filter
        updatedFilters.push({
          filterIdentifier: "District",
          filterValues: districtName!,
        });
      }
      return updatedFilters; // Return updated filters
    });
    handleDistrictClick(districtId, !isActive); // Toggle project markers
    if (
      activeFilter === "cmInitiative"
      // && districts.find((district) => district.id === districtId)?.districtName
    ) {
      handleSubmit([
        ...cmInitiativeFilters,
        ...[
          {
            filterIdentifier: "District",
            filterValues: districtName!,
          },
        ],
      ]);
    } else {
      handleSubmit([
        ...adpFilters,
        ...[
          {
            filterIdentifier: "District",
            filterValues: districtName!,
          },
        ],
      ]);
    }
  };

  const handleProjectSubmit = async (projectId: number) => {
    try {
      const response = await apiClient.get(
        `${SINGLE_PROJECT_DASHBOARD_API}?projectid=${projectId}`
      );
      if (response.data.data) {
        router.push(`/projectDetailsDashboard/${projectId}`);
      } else {
        toast.error("This Project is not yet Monitored");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("This Project is not yet Monitored");
    }
  };

  const handleBackButtonClick = async () => {
    setShowButton(false);
    setActiveDistrict(null); // Reset to show all districts
    // Update otherFilters
    setOtherFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const districtFilterIndex = updatedFilters.findIndex(
        (filter) => filter.filterIdentifier === "District"
      );

      if (districtFilterIndex !== -1) {
        // If "District" filter exists, remove it
        return prevFilters.filter(
          (filter) =>
            filter.filterIdentifier !==
            updatedFilters[districtFilterIndex].filterIdentifier
        );
      }
      return updatedFilters; // Return updated filters
    });
    if (
      activeFilter === "cmInitiative"
      // && districts.find((district) => district.id === districtId)?.districtName
    ) {
      handleSubmit([
        ...cmInitiativeFilters,
        ...otherFilters.filter(
          (filter) => filter.filterIdentifier !== "District"
        ),
      ]);
    } else {
      handleSubmit([
        ...adpFilters,
        ...otherFilters.filter(
          (filter) => filter.filterIdentifier !== "District"
        ),
      ]);
    }
    try {
      const response = await apiClient.post(MAIN_DASHBOARD_API, [
        { filterIdentifier: "", filterValues: "" },
      ]);
      setActiveProjects([]);
      setActiveDistrictId(null);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    if (!map) return;
  }, [map]);

  return (
    <>
      {showButton && (
        <div className="position-relative">
          <button
            className="position-absolute btn bg-color-sea-green text-white fw-bold mb-3"
            onClick={handleBackButtonClick}
            style={{ zIndex: 1, right: 60, top: 10 }}
          >
            Back
          </button>
        </div>
      )}
      <div>
        <Toaster />
      </div>
      <div
        className="shadow-sm"
        style={{
          width: "100%",
          height: "135vh",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={7}
            defaultCenter={InitialCenterPosition}
            gestureHandling={"greedy"}
            style={{ borderRadius: "10px" }}
          > */}
        {(activeDistrict ? [activeDistrict] : districtList)
          .filter((district) => district.latitude && district.longitude)
          .map((district) => (
            <Fragment key={district.id}>
              <AdvancedMarker
                style={{
                  transform: `scale(${
                    [selectedDistrictIndex].includes(district.id) ? 1.3 : 1
                  })`,
                  transition: "transform 0.1s ease-in-out",
                }}
                onClick={() => {
                  handleMarkerClick(district.id);
                  setActiveDistrict(district);
                  setShowButton(true);
                }}
                position={{
                  lat: parseFloat(district.latitude),
                  lng: parseFloat(district.longitude),
                }}
                onMouseEnter={() => setSelectedDistrictIndex(district.id)}
                onMouseLeave={() => setSelectedDistrictIndex(9 + parseInt("a"))}
              >
                <span>
                  <img
                    src="/images/districtLocation.png"
                    alt="districtLocation"
                    style={{ width: "50px", height: "50px" }}
                  />
                </span>
              </AdvancedMarker>
              {selectedDistrictIndex === district.id && (
                <InfoWindow
                  position={{
                    lat: parseFloat(district.latitude),
                    lng: parseFloat(district.longitude),
                  }}
                  pixelOffset={[0, -60]}
                  onCloseClick={() => setOpen(false)}
                >
                  <DistrictCard data={district} />
                </InfoWindow>
              )}
            </Fragment>
          ))}

        {activeDistrict &&
          activeProjects &&
          activeProjects
            .filter((project) => project.latitude && project.longitude)
            .map((project) => (
              <Fragment key={project.id}>
                <AdvancedMarker
                  style={{
                    transform: `scale(${
                      [selectedProjectIndex].includes(project.id) ? 1.3 : 1
                    })`,
                    transition: "transform 0.1s ease-in-out",
                  }}
                  onClick={() => handleProjectSubmit(project.id)}
                  position={{
                    lat: parseFloat(project.latitude),
                    lng: parseFloat(project.longitude),
                  }}
                  onMouseEnter={() => setSelectedProjectIndex(project.id)}
                  onMouseLeave={() =>
                    setSelectedProjectIndex(9 + parseInt("a"))
                  }
                >
                  <span>
                    <img
                      src="/images/projectLocation.png"
                      alt="projectLocation"
                      className="img-fluid"
                      style={{ width: "40px", height: "50px" }}
                    />
                  </span>
                </AdvancedMarker>
                {selectedProjectIndex === project.id && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(project.latitude),
                      lng: parseFloat(project.longitude),
                    }}
                    pixelOffset={[0, -60]}
                    onCloseClick={() => setOpen(false)}
                  >
                    <ProjectCard data={project} />
                  </InfoWindow>
                )}
              </Fragment>
            ))}
      </div>
    </>
  );
};

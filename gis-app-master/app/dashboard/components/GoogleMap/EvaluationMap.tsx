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
} from "@/shared/api/endpoints";
import useDistrict from "@/app/hooks/useDistrict";
import apiClient from "@/shared/api/client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { MainDashboard } from "../Dashboard";
import { FilterData, DistrictProjects } from "../../types";
import DistrictCard from "./DistrictCard";
import ProjectCard from "./ProjectCard";
import DistrictCardEvaluation from "./DistrictCardEvaluation";
import "@/app/_css/InfoWindow.css";
import {
  DistrictList,
  EvaluationMainDashboard,
} from "../Evaluation/DashboardEvaluation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
interface Props {
  data: EvaluationMainDashboard;
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  activeFilter: string;
  cmInitiativeFilters: FilterData[];
  adpFilters: FilterData[];
  otherFilters: FilterData[];
  setOtherFilters: Dispatch<SetStateAction<FilterData[]>>;
}

const EvaluationMap = ({
  data,
  handleSubmit,
  activeFilter,
  cmInitiativeFilters,
  adpFilters,
  otherFilters,
  setOtherFilters,
}: Props) => {
  const InitialCenterPosition = {
    lat: 31.1704,
    lng: 72.7097,
  };
  const [open, setOpen] = useState(false);
  const [districtList, setDistrictList] = useState<DistrictList[]>([]);

  useEffect(() => {
    setDistrictList(data.districtList);
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

  return (
    <>
      <div className="position-relative">
        {showButton && (
          <button
            className="position-absolute btn bg-color-sea-green text-white fw-bold mb-3"
            style={{ zIndex: 1, right: 60, top: 10 }}
          >
            Back
          </button>
        )}
        <Link
          href="/projects-live-view"
          className="position-absolute badge text-decoration-none"
          target="_blank"
          style={{
            zIndex: 1,
            left: 10,
            top: 10,
            backgroundColor: "rgba(28, 28, 29, 0.86)",
            padding: "10px 12px 10px 11.5px",
            borderRadius: "10px",
            color: "#D0D0D0",
          }}
        >
          <div className="row">
            <div className="col">
              <span>Live Streaming</span>
            </div>
            <div className="col position-relative">
              <motion.span
                animate={{ opacity: [0, 1, 1, 0] }} // Keyframes: fade in and out
                transition={{
                  duration: 2, // Time for one complete cycle
                  repeat: Infinity, // Loop animation infinitely
                  ease: "easeInOut", // Smoother transition
                }}
              >
                <Image
                  className="position-absolute start-0"
                  src="/icons/evaluation/liveCircle.svg"
                  alt="liveCircle"
                  width={14}
                  height={14}
                />
              </motion.span>

              <Image
                className="position-absolute start-0"
                src="/icons/evaluation/liveMiniCircle.svg"
                alt="liveMiniCircle"
                width={14}
                height={14}
              />
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Toaster />
      </div>
      <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
        <div
          className="shadow-sm"
          style={{
            width: "100%",
            height: "135vh",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={7}
            defaultCenter={InitialCenterPosition}
            gestureHandling={"greedy"}
            style={{ borderRadius: "10px" }}
          >
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
                      setActiveDistrict(district);
                      setShowButton(true);
                    }}
                    position={{
                      lat: parseFloat(district.latitude),
                      lng: parseFloat(district.longitude),
                    }}
                    onMouseEnter={() => setSelectedDistrictIndex(district.id)}
                    onMouseLeave={() =>
                      setSelectedDistrictIndex(9 + parseInt("a"))
                    }
                  >
                    <span>
                      <img
                        src="/images/evaluation/districtLocationE.png"
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
                      <div
                        style={{
                          overflow: "hidden",
                          backgroundColor: "rgba(0,0,0,0)",
                        }}
                      >
                        <DistrictCardEvaluation data={district} />
                      </div>
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

            <MapUpdater
              activeDistrict={activeDistrict}
              activeProjects={activeProjects}
            />
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default EvaluationMap;

const MapUpdater = ({
  activeDistrict,
  activeProjects,
}: {
  activeDistrict: DistrictList | null;
  activeProjects: DistrictProjects[];
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (activeDistrict) {
      map.panTo({
        lat: parseFloat(activeDistrict.latitude),
        lng: parseFloat(activeDistrict.longitude),
      });
      map.setZoom(9);
    } else if (activeProjects.length) {
      const bounds = new google.maps.LatLngBounds();
      activeProjects.forEach((project) => {
        bounds.extend({
          lat: parseFloat(project.latitude),
          lng: parseFloat(project.longitude),
        });
      });
      map.fitBounds(bounds);
    } else {
      // Reset to default center if needed
      map.panTo({ lat: 31.1704, lng: 72.7097 });
      map.setZoom(7);
    }
  }, [map, activeDistrict, activeProjects]);

  return null;
};

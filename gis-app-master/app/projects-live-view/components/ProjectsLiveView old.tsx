"use client";

import { MAIN_DASHBOARD_API } from "@/app/APIs";
import CustomInput from "@/app/components/Form/CustomInput";
import ListWrapper from "@/app/components/ListWrapper";
import { FilterData } from "@/app/dashboard/components/DashboardMonitoring";
import { ProjectsList } from "@/app/dashboard/components/ProjectsTable/ProjectsTable";
import {
  adpFilters,
  cmInitiativeFilters,
  oldCmInitiativeFilters,
} from "@/app/dashboard/filters";
import apiClient from "@/app/services/api-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const ProjectsLiveView = () => {
  const data = [0, 1];
  const [activeFilter, setActiveFilter] = useState<"cmInitiative" | "adp">(
    "cmInitiative"
  );

  const [projectsData, setProjectsData] = useState<ProjectsList[]>();
  const [otherFilters, setOtherFilters] = useState<FilterData[]>([]);
  const [combinedFilters, setCombinedFilters] = useState<FilterData[]>([]);

  useEffect(() => {
    const getProjectsList = async (status: string) => {
      setProjectsData([]);
      console.log("status", status);
      console.log("get projects with combinedFilters", combinedFilters);
      try {
        if (activeFilter === "cmInitiative") {
          const yearFilter = otherFilters.find(
            (filter) => filter.filterIdentifier === "Year"
          );
          if (yearFilter && yearFilter.filterValues === "2025-2026") {
            const response = await apiClient.post(
              `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
              [...cmInitiativeFilters, ...otherFilters]
            );
            const sortedData = response.data.data
              ?.slice() // avoid mutating response data
              .sort((a: any, b: any) => {
                const numA = Number(a.gsNo) || 0; // fallback for invalid/missing values
                const numB = Number(b.gsNo) || 0;
                return numA - numB;
              });

            // setProjectsData(sortedData ?? []);
            // console.log("sortedData data", sortedData);

            const specificPoject = response.data.data.find(
              (project: ProjectsList) => Number(project.gSno) === 309
            );

            if (specificPoject) {
              setProjectsData([specificPoject]);
            }
          } else if (!yearFilter) {
            const response = await apiClient.post(
              `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
              [...cmInitiativeFilters, ...otherFilters]
            );
            const sortedData = response.data.data
              ?.slice() // avoid mutating response data
              .sort((a: any, b: any) => {
                const numA = Number(a.gsNo) || 0; // fallback for invalid/missing values
                const numB = Number(b.gsNo) || 0;
                return numA - numB;
              });

            // setProjectsData(sortedData ?? []);
            // console.log("sortedData data", sortedData);

            const specificPoject = response.data.data.find(
              (project: ProjectsList) => Number(project.gSno) === 309
            );

            if (specificPoject) {
              setProjectsData([specificPoject]);
            }
          } else {
            const response = await apiClient.post(
              `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
              [...oldCmInitiativeFilters, ...otherFilters]
            );
            const sortedData = response.data.data
              ?.slice() // avoid mutating response data
              .sort((a: any, b: any) => {
                const numA = Number(a.gsNo) || 0; // fallback for invalid/missing values
                const numB = Number(b.gsNo) || 0;
                return numA - numB;
              });

            // setProjectsData(sortedData ?? []);
            // console.log("sortedData data", sortedData);

            const specificPoject = response.data.data.find(
              (project: ProjectsList) => Number(project.gSno) === 309
            );

            if (specificPoject) {
              setProjectsData([specificPoject]);
            }
          }
        } else {
          const response = await apiClient.post(
            `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
            [...adpFilters, ...otherFilters]
          );
          const sortedData = response.data.data
            ?.slice() // avoid mutating response data
            .sort((a: any, b: any) => {
              const numA = parseInt(String(a.gsNo).trim(), 10) || 0;
              const numB = parseInt(String(b.gsNo).trim(), 10) || 0;
              return numA - numB;
            });

          // setProjectsData(sortedData ?? []);
          // console.log("sortedData data", sortedData);

          const specificPoject = response.data.data.find(
            (project: ProjectsList) => Number(project.gSno) === 309
          );

          if (specificPoject) {
            setProjectsData([specificPoject]);
          }
        }
      } catch (err) {
        console.error("Submission error:", err);
      }
    };

    getProjectsList("BeingMonitored");
  }, []);

  return (
    <ListWrapper>
      <div className="row d-flex align-items-center">
        <div className="col-10">
          <p className="fw-bold fs21px m-0" style={{ padding: "17px 26px" }}>
            All Projects
          </p>
        </div>
        <div className="col-2">
          <form>
            <div className="input-group">
              <button
                className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                type="submit"
                style={{
                  border: "1.08px solid #CBD5E1",
                }}
              >
                <IoSearchOutline size={21.6} style={{ color: "#475569" }} />
              </button>
              <CustomInput
                type="text"
                className="form-control fw-bold border-start-0 rounded-pill rounded-start shadow-none fs15px bg-transparent py-2 placeholder-bold"
                style={{
                  border: "1px solid #CBD5E1",
                }}
                placeholder="Search"
                // value={searchTerm}
                // onChange={handleChange}
                id="search"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="col" style={{ padding: "10px 20px" }}>
        <div className="row">
          {projectsData?.map((project, i) => (
            <Link
              href={`/projects-live-view/project-details-dashboard/${project.id}/${project.visitId}`}
              target="_blank"
              key={i}
              className="col-3 ps-0"
              style={{ marginBottom: "20px", paddingRight: "15.74px" }}
            >
              <div className="position-relative">
                <div className="row m-0">
                  <div className="col p-0">
                    <video
                      className="w-100 h-100 overflow-hidden"
                      style={{
                        objectFit: "cover",
                        borderTopLeftRadius: "10px",
                      }}
                      loop
                      autoPlay
                      muted
                      playsInline
                    >
                      <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="col p-0">
                    <video
                      className="w-100 h-100 overflow-hidden"
                      style={{
                        objectFit: "cover",
                        borderTopRightRadius: "10px",
                      }}
                      loop
                      autoPlay
                      muted
                      playsInline
                    >
                      <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col p-0">
                    <video
                      className="w-100 h-100 overflow-hidden"
                      style={{
                        objectFit: "cover",
                        borderBottomLeftRadius: "10px",
                      }}
                      loop
                      autoPlay
                      muted
                      playsInline
                    >
                      <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="col p-0 position-relative">
                    <video
                      className="w-100 h-100 overflow-hidden position-absolute"
                      style={{
                        objectFit: "cover",
                        borderBottomRightRadius: "10px",
                      }}
                      loop
                      autoPlay
                      muted
                      playsInline
                    >
                      <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div
                      className="w-100 h-100 position-absolute d-flex align-items-center justify-content-center fw-bold text-white"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        borderBottomRightRadius: "10px",
                        zIndex: 2,
                      }}
                    >
                      + 2
                    </div>
                  </div>
                </div>

                <span
                  className="badge bg-color-evaluation-theme-blue position-absolute fs11px fw-5 rounded-pill"
                  style={{ top: "10px", right: "10px", padding: "6px 10px" }}
                >
                  LIVE
                </span>
                <div
                  className="position-absolute text-white"
                  style={{
                    bottom: "9px",
                    left: "0",
                    textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    fontWeight: "600",
                    zIndex: 2,
                  }}
                >
                  <p
                    className="fw-bold fs12-5px m-0"
                    style={{ paddingLeft: "6px" }}
                  >
                    GS No. {project.gSno}
                  </p>
                  <p
                    className="fw-normal fs11px m-0"
                    style={{ paddingLeft: "6px" }}
                  >
                    {project.projectName}
                  </p>
                </div>
                <div
                  className="position-absolute w-100 bottom-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(0, 0, 0, 0) , rgba(0, 0, 0, 1))",
                    borderBottomRightRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    height: "30%",
                  }}
                ></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ListWrapper>
  );
};

export default ProjectsLiveView;

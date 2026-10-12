"use client";

import { MAIN_DASHBOARD_API } from "@/app/APIs";
import TileLabel from "@/app/charts/components/TileLabel";
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
import { displayStatusText } from "@/app/utils";
import {
  DashboardSquare01Icon,
  LeftToRightListBulletIcon,
  SlidersHorizontalIcon,
  UserGroupIcon,
  WaveTriangleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const ProjectsLiveView = () => {
  const [activeFilter, setActiveFilter] = useState<"cmInitiative" | "adp">(
    "cmInitiative",
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
            (filter) => filter.filterIdentifier === "Year",
          );
          if (yearFilter && yearFilter.filterValues === "2025-2026") {
            const response = await apiClient.post(
              `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
              [...cmInitiativeFilters, ...otherFilters],
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
              (project: ProjectsList) => Number(project.gSno) === 309,
            );

            if (specificPoject) {
              setProjectsData([specificPoject]);
            }
          } else if (!yearFilter) {
            const response = await apiClient.post(
              `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
              [...cmInitiativeFilters, ...otherFilters],
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
              (project: ProjectsList) => Number(project.gSno) === 309,
            );

            if (specificPoject) {
              setProjectsData([specificPoject]);
            }
          } else {
            const response = await apiClient.post(
              `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
              [...oldCmInitiativeFilters, ...otherFilters],
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
              (project: ProjectsList) => Number(project.gSno) === 309,
            );

            if (specificPoject) {
              setProjectsData([specificPoject]);
            }
          }
        } else {
          const response = await apiClient.post(
            `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
            [...adpFilters, ...otherFilters],
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
            (project: ProjectsList) => Number(project.gSno) === 309,
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
    <div
      style={{
        padding: "332px 61px",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ gap: 50, marginBottom: 200 }}
      >
        <div className="d-flex align-items-center" style={{ gap: "157.49px" }}>
          <div
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.05))",
              padding: "118px",
              borderRadius: "183.74px",
            }}
          >
            <HugeiconsIcon
              icon={WaveTriangleIcon}
              color={"#00D3F2"}
              size={236}
            />
          </div>

          <div className="d-flex gap-0 flex-column">
            <p className="m-0 fw-5 text-white" style={{ fontSize: 314.98 }}>
              Projects Monitoring Dashboard
            </p>
            <p
              className="fw-5 m-0"
              style={{
                color: "#6B7280",
                fontSize: 157.49,
              }}
            >
              1 Active Project(s) being Monitored
            </p>
          </div>
        </div>

        <div
          className="d-flex justify-content-between align-items-center"
          style={{ gap: 157.24 }}
        >
          <div className="col">
            <form>
              <div className="input-group">
                <button
                  className="btn rounded-end text-white shadow-none border-end-0 pe-0"
                  type="submit"
                  style={{
                    border: "10.5px solid rgba(255, 255, 255, 0.06)",
                    paddingLeft: 183.74,
                    paddingTop: 167.95,
                    paddingBottom: 167.95,
                    background: "rgba(255, 255, 255, 0.04)",
                    borderRadius: 180,
                  }}
                >
                  <IoSearchOutline size={209.99} style={{ color: "#475569" }} />
                </button>
                <CustomInput
                  type="text"
                  className="form-control fw-normal border-start-0 rounded-start shadow-none py-2 placeholder-scaled"
                  style={{
                    border: "10.5px solid rgba(255, 255, 255, 0.06)",
                    fontSize: 183.74,
                    paddingLeft: 131,
                    background: "rgba(255, 255, 255, 0.04)",
                    borderRadius: 180,
                  }}
                  placeholder="Search by GS number, ministry, officer, or location..."
                  // value={searchTerm}
                  // onChange={handleChange}
                  id="search"
                />
              </div>
            </form>
          </div>
          <div
            className="d-flex align-items-center justify-content-between"
            style={{
              padding: "236.24px 157.51px",
              border: "10.5px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(255, 255, 255, 0.04)",
              gap: 200,
              borderRadius: 180,
            }}
          >
            <div
              className="d-flex align-items-center"
              style={{
                gap: 105,
                borderRadius: 180,
              }}
            >
              <HugeiconsIcon
                icon={SlidersHorizontalIcon}
                size={209.99}
                color="#90A1B9"
              />

              <span
                className="fw-5"
                style={{ fontSize: 157.49, color: "#90A1B9" }}
              >
                Order By Observation
              </span>
            </div>
            <FaChevronDown size={183.74} color="#90A1B9" />
          </div>

          <div
            className="d-flex align-items-center justify-content-between"
            style={{
              padding: "52.5px 79.34px",
              border: "10.5px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: 180,
              gap: 200,
            }}
          >
            <div
              className="d-flex align-items-center"
              style={{
                background: "rgba(28, 107, 166, 0.15)",
                gap: 78.73,
                padding: "78.75px 209.95px",
                borderRadius: 104.99,
              }}
            >
              <HugeiconsIcon
                icon={DashboardSquare01Icon}
                size={183.74}
                color="#1c6ba6"
              />
              <span
                className="fw-5"
                style={{ fontSize: 157.49, color: "#1c6ba6" }}
              >
                Grid
              </span>
            </div>
            <div
              className="d-flex align-items-center"
              style={{
                // background: "rgba(28, 107, 166, 0.15)",
                gap: 78.73,
                padding: "78.75px 209.95px",
                borderRadius: 104.99,
              }}
            >
              <HugeiconsIcon
                icon={LeftToRightListBulletIcon}
                size={183.74}
                color="#90A1B9"
              />
              <span
                className="fw-5"
                style={{ fontSize: 157.49, color: "#90A1B9" }}
              >
                List
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="col" style={{ padding: "10px 20px" }}>
        <div className="row">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
            <Fragment key={d}>
              {projectsData?.map((project, i) => (
                <Link
                  href={`/projects-live-view/project-details-dashboard/${project.id}/${project.visitId}`}
                  target="_blank"
                  className="text-decoration-none"
                  key={i}
                >
                  <div
                    className="col-auto"
                    style={{
                      marginBottom: "20px",
                      borderRadius: 150,
                      border: "15px solid #AB0000",
                      padding: 50,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 134,
                        border: "15px solid #AB0000",
                        overflow: "hidden",
                      }}
                    >
                      <div className="position-relative">
                        <div>
                          <video
                            className="w-100 overflow-hidden"
                            style={{
                              objectFit: "cover",
                              borderTopLeftRadius: "10px",
                              height: "2250px",
                            }}
                            loop
                            autoPlay
                            muted
                            playsInline
                          >
                            <source
                              src="/video/bgVideoNew.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <div
                          className="position-absolute fw-normal d-flex align-items-center"
                          style={{
                            top: "120px",
                            right: "120px",
                            padding: "37.98px 76.07px",
                            background: "rgba(0, 0, 0, 0.5)",
                            borderRadius: 76.07,
                            border: "6.09px solid rgba(255, 255, 255, 0.1)",
                            gap: 45.64,
                          }}
                        >
                          <MdOutlineRemoveRedEye size={106.5} color="#00D3F2" />
                          <span
                            className="text-white"
                            style={{ fontSize: 91.29 }}
                          >
                            Visits: 22
                          </span>
                        </div>

                        <div
                          className="position-absolute fw-bold"
                          style={{
                            top: "120px",
                            left: "120px",
                            padding: "37.98px 76.07px",
                            background: "#141518",
                            borderRadius: 76.07,
                            gap: 45.64,
                          }}
                        >
                          <span style={{ fontSize: 91.29, color: "#DFE012" }}>
                            {displayStatusText(project.reportStatus)}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#1D1F25",
                          padding: "114.27px 140px",
                        }}
                      >
                        <div
                          className="d-flex align-content-center justify-content-between"
                          style={{ marginBottom: 130 }}
                        >
                          <span
                            className="fw-bold"
                            style={{ fontSize: 94.11, color: "#9CA3AF" }}
                          >
                            GS NO: {project.gSno}
                          </span>
                          <span
                            className="fw-bold"
                            style={{ fontSize: 94.11, color: "#9CA3AF" }}
                          >
                            {project.projectName.substring(0, 33)}...
                          </span>
                        </div>
                        <div
                          style={{
                            borderBottom: "6.72px solid #2A2A2A",
                            marginBottom: 130,
                          }}
                        />
                        <div>
                          <p
                            className="fw-5"
                            style={{
                              fontSize: 94.11,
                              color: "#9CA3AF",
                              marginBottom: "33.61px",
                            }}
                          >
                            Project Name
                          </p>

                          <p
                            className="fw-8 text-white"
                            style={{
                              fontSize: 94.11,
                              marginBottom: "160px",
                            }}
                          >
                            {project.projectName}
                          </p>

                          <div
                            className="d-flex justify-content-between"
                            style={{ gap: 341, marginBottom: "130px" }}
                          >
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 100,
                                  color: "#9CA3AF",
                                }}
                              >
                                PC-I Cost
                              </p>
                              <p
                                className="fw-6 text-white"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 110,
                                }}
                              >
                                74,9420.140 M
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 100,
                                  color: "#9CA3AF",
                                }}
                              >
                                Planned Start Date
                              </p>
                              <p
                                className="fw-6 text-white"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 110,
                                }}
                              >
                                01-Jul-2024
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 100,
                                  color: "#9CA3AF",
                                }}
                              >
                                Planned End Date
                              </p>
                              <p
                                className="fw-6 text-white"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 110,
                                }}
                              >
                                28-Feb-2027
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 100,
                                  color: "#9CA3AF",
                                }}
                              >
                                Location
                              </p>
                              <p
                                className="fw-6 text-white"
                                style={{
                                  marginBottom: "33.61px",
                                  fontSize: 110,
                                }}
                              >
                                Opposite to Val...
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            borderBottom: "6.72px solid #2A2A2A",
                            marginBottom: 130,
                          }}
                        />

                        <div
                          className="d-flex justify-content-between"
                          style={{ gap: 341, marginBottom: "130px" }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: 67.22 }}
                          >
                            <div
                              className="color-evaluation-theme-blue rounded-circle fw-6 d-flex align-items-center justify-content-center"
                              style={{
                                background: "rgba(0, 143, 251, 0.1)",
                                border: "10px solid #1C6BA6",
                                fontSize: 100,
                                width: 250,
                                height: 250,
                              }}
                            >
                              MS
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: "0",
                                  fontSize: 100,
                                  color: "#9CA3AF",
                                }}
                              >
                                Reporting Officer
                              </p>
                              <p
                                className="fw-6 text-white"
                                style={{ marginBottom: "0", fontSize: 110 }}
                              >
                                M. Salman
                              </p>
                            </div>
                          </div>
                          <div
                            className="d-flex justify-content-end"
                            style={{ gap: 174.77 }}
                          >
                            <div>
                              <p
                                className="fw-5 text-end"
                                style={{
                                  marginBottom: "0",
                                  fontSize: 100,
                                  color: "#9CA3AF",
                                }}
                              >
                                Report Issue Date
                              </p>
                              <p
                                className="fw-6 text-white text-end"
                                style={{ marginBottom: "0", fontSize: 110 }}
                              >
                                Sun-08-Mar-2026
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5 text-end"
                                style={{
                                  marginBottom: "0",
                                  fontSize: 100,
                                  color: "#9CA3AF",
                                }}
                              >
                                Visit Completed Date
                              </p>
                              <p
                                className="fw-6 text-white text-end"
                                style={{ marginBottom: "0", fontSize: 110 }}
                              >
                                Fri-06-Mar-2026
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsLiveView;

"use client";

import { MAIN_DASHBOARD_API } from "@/app/APIs";
import { FilterData } from "@/app/dashboard/components/DashboardMonitoring";
import { ProjectsList } from "@/app/dashboard/components/ProjectsTable/ProjectsTable";
import {
  adpFilters,
  cmInitiativeFilters,
  oldCmInitiativeFilters,
} from "@/app/dashboard/filters";
import apiClient from "@/app/services/api-client";
import { formatAmountWithCommas, getInitials } from "@/app/utils";
import {
  DashboardSquare01Icon,
  LeftToRightListBulletIcon,
  SlidersHorizontalIcon,
  WaveTriangleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
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
  console.log("projectsData", projectsData);
  const dummyProjects = [
    {
      reportStatus: "Average",
      visits: 22,
      gSno: 309,
      sectorName: "Specialized Healthcare and Medical",
      projectName:
        "Establishment of Nawaz Sharif Institute of Cancer Treatment and Research, Lahore",
      pciCost: 749420.14,
      plannedStartDate: "01-Jul-2024",
      plannedEndDate: "28-Feb-2027",
      location: "Opposite to Val...",
      officierName: "M. Salman",
      reportIssueDate: "Sun-08-Mar-2026",
      visitCompletedDate: "Fri-06-Mar-2026",
    },
    {
      reportStatus: "Average",
      visits: 1,
      gSno: 1682,
      sectorName: "Energy Department",
      projectName:
        "Design and Construction of Net Zero Energy Building (ACEIP , DLI-8)",
      pciCost: 5781.95,
      plannedStartDate: "04-Sep-2024",
      plannedEndDate: "29-Apr-2029",
      location: "Gulberg, Lahore",
      officierName: "Arif Ahsan",
      reportIssueDate: "Mon-18-Aug-2025",
      visitCompletedDate: "Fri-15-Aug-2025",
    },
    {
      reportStatus: "Average",
      visits: 10,
      gSno: 308,
      sectorName: "Specialized Healthcare and Medical Education Department",
      projectName: "Nawaz Sharif Institute of Cardiology, Sargodha",
      pciCost: 8568.205,
      plannedStartDate: "01-Jul-2024",
      plannedEndDate: "31-Jan-2026",
      location: "Sargodha",
      officierName: "Arif Ahsan",
      reportIssueDate: "Tue-03-Feb-2026",
      visitCompletedDate: "Tue-27-Jan-2026",
    },
    {
      reportStatus: "Average",
      visits: 4,
      gSno: 2603,
      sectorName: "Forestry,WildLife,Fisheries",
      projectName: "Revamping of Bansara Gali Zoological Garden, Murree",
      pciCost: 3915.598,
      plannedStartDate: "01-Jul-2024",
      plannedEndDate: "30-Jun-2026",
      location: "Wildlife Park ....",
      officierName: "Muhammad Kashif",
      reportIssueDate: "Wed-14-Jan-2026",
      visitCompletedDate: "Mon-12-Jan-2026",
    },
    {
      reportStatus: "Good",
      visits: 10,
      gSno: 2548,
      sectorName: "Agriculture Department",
      projectName: "Establishment of Model Agriculture Malls in Punjab",
      pciCost: 1171.036,
      plannedStartDate: "01-Apr-2024",
      plannedEndDate: "09-Oct-2025",
      location: "Sargodha",
      officierName: "Arif Ahsan",
      reportIssueDate: "Mon-11-Aug-2025",
      visitCompletedDate: "Sun-14-Sep-2025",
    },
    {
      reportStatus: "Average",
      visits: 3,
      gSno: 3531,
      sectorName: "Environment Protection & Climate Change Department",
      projectName:
        "Construction of Green Building for EMC, EPD and Allied New Entities Established Under...",
      pciCost: 3723.93,
      plannedStartDate: "27-Oct-2023",
      plannedEndDate: "30-Jun-2026",
      location: "College road, near..",
      officierName: "Arif Ahsan",
      reportIssueDate: "Sun-08-Mar-2026",
      visitCompletedDate: "Fri-06-Mar-2026",
    },
    {
      reportStatus: "Average",
      visits: 3,
      gSno: 7313,
      sectorName: "Government of Punjab",
      projectName: "Uplifting of Bagh e Shaheedan Panj Mandoo Park Murree",
      pciCost: 538.85,
      plannedStartDate: "05-Oct-2024",
      plannedEndDate: "18-Apr-2025",
      location: "Murree",
      officierName: "Muhammad Kashif",
      reportIssueDate: "Sun-08-Mar-2026",
      visitCompletedDate: "Fri-06-Mar-2026",
    },
    {
      reportStatus: "Average",
      visits: 5,
      gSno: 1070,
      sectorName: "Government of Punjab",
      projectName: "Remodeling of Jhika Gali Chowk",
      pciCost: 2302.83,
      plannedStartDate: "01-Nov-2024",
      plannedEndDate: "30-Nov-2025",
      location: "Murree",
      officierName: "Fatima Zia",
      reportIssueDate: "Wed-19-Nov-2025",
      visitCompletedDate: "Mon-17-Nov-2025",
    },
    {
      reportStatus: "Average",
      visits: 2,
      gSno: 7164,
      sectorName: "LG & CD Department",
      projectName:
        "Upgradation of existing water source and Distribution System of Dhar Jawa water supp...",
      pciCost: 269.5,
      plannedStartDate: "07-Oct-2024",
      plannedEndDate: "07-Oct-2025",
      location: "Murree",
      officierName: "Muhammad Kashif",
      reportIssueDate: "Sun-08-Mar-2026",
      visitCompletedDate: "Fri-06-Mar-2026",
    },
    {
      reportStatus: "Good",
      visits: 5,
      gSno: 2974,
      sectorName: "Environment Protection & Climate Change Department",
      projectName: "Revamping of Biodiversity Park, Murree",
      pciCost: 388.303,
      plannedStartDate: "19-Dec-2024",
      plannedEndDate: "30-Jun-2026",
      location: "Murree",
      officierName: "Muhammad Kashif",
      reportIssueDate: "Tue-09-Dec-2025",
      visitCompletedDate: "Sun-07-Dec-2025",
    },
  ];

  return (
    <div
      style={{
        padding: "17.29px 2.78px",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center flex-wrap"
        style={{ gap: 8.2, marginBottom: 10.42 }}
      >
        <div className="d-flex align-items-center" style={{ gap: "8.2px" }}>
          <div
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.05))",
              padding: 6.15,
              borderRadius: 9.57,
              width: 24.61,
              height: 24.61,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HugeiconsIcon
              icon={WaveTriangleIcon}
              color={"#00D3F2"}
              size={12.3}
            />
          </div>

          <div className="d-flex gap-0 flex-column">
            <p className="m-0 fw-5 text-white" style={{ fontSize: 16.41 }}>
              Projects Monitoring Dashboard
            </p>
            <p
              className="fw-5 m-0"
              style={{
                color: "#6B7280",
                fontSize: 8.2,
              }}
            >
              8 Active Project(s) being Monitored
            </p>
          </div>
        </div>

        <div
          className="d-flex justify-content-between align-items-center flex-wrap"
          style={{ gap: 10 }}
        >
          {/* <div className="col-auto">
            <form>
              <div className="input-group">
                <button
                  className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                  type="submit"
                  style={{
                    border: "0.55px solid rgba(255, 255, 255, 0.06)",
                    padding: "0px 0px 3.75px 9.57px",
                  }}
                >
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={10.94}
                    color="#62748E"
                  />
                </button>
                <CustomInput
                  type="text"
                  className="form-control fw-bold border-start-0 rounded-pill rounded-start shadow-none bg-transparent placeholder-scaled-down"
                  style={{
                    border: "0.55px solid rgba(255, 255, 255, 0.06)",
                    fontSize: 9.57,
                    padding: "8.75px 9.57px",
                  }}
                  placeholder="Search"
                  // value={searchTerm}
                  // onChange={handleChange}
                  id="search"
                />
              </div>
            </form>
          </div> */}
          <div
            className="d-flex align-items-center justify-content-between flex-wrap"
            style={{
              padding: "8.2px 10.94px",
              border: "0.55px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(255, 255, 255, 0.04)",
              gap: 10.94,
              borderRadius: 9.38,
            }}
          >
            <div
              className="d-flex align-items-center"
              style={{
                gap: 5.47,
                // borderRadius: 9.38,
              }}
            >
              <HugeiconsIcon
                icon={SlidersHorizontalIcon}
                size={10.94}
                color="#90A1B9"
              />

              <span
                className="fw-5"
                style={{ fontSize: 8.2, color: "#90A1B9" }}
              >
                Order By Observation
              </span>
            </div>
            <FaChevronDown size={9.57} color="#90A1B9" />
          </div>

          <div
            className="d-flex align-items-center justify-content-between"
            style={{
              padding: "4.13px 2.73px",
              border: "0.55px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: 9.38,
              gap: 2.73,
            }}
          >
            <div
              className="d-flex align-items-center"
              style={{
                background: "rgba(28, 107, 166, 0.15)",
                gap: 4.1,
                padding: "4.1px 7.71px",
                borderRadius: 5.47,
              }}
            >
              <HugeiconsIcon
                icon={DashboardSquare01Icon}
                size={9.57}
                color="#1c6ba6"
              />
              <span
                className="fw-5"
                style={{ fontSize: 8.2, color: "#1c6ba6" }}
              >
                Grid
              </span>
            </div>
            <div
              className="d-flex align-items-center"
              style={{
                // background: "rgba(28, 107, 166, 0.15)",
                gap: 4.1,
                padding: "4.1px 7.71px",
                borderRadius: 5.47,
              }}
            >
              <HugeiconsIcon
                icon={LeftToRightListBulletIcon}
                size={9.57}
                color="#90A1B9"
              />
              <span
                className="fw-5"
                style={{ fontSize: 8.2, color: "#90A1B9" }}
              >
                List
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="col p-0">
        <div className="row m-0 g-3">
          {dummyProjects?.map((project, i) => (
            <Link
              // href={`/projects-live-view/project-details-dashboard/${project.id}/${project.visitId}`}
              href={`/projects-live-view/project-details-dashboard/${301}/${1372}`}
              target="_blank"
              className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2 text-decoration-none"
              style={{ padding: "0px 13.02px 0px 0px " }}
              key={i}
            >
              <div
                className="col"
                style={{
                  borderRadius: 7.81,
                  border: "0.78px solid #AB0000",
                  padding: 2.6,
                }}
              >
                <div
                  style={{
                    borderRadius: 7,
                    border: "0.78px solid #AB0000",
                    overflow: "hidden",
                  }}
                >
                  <div className="position-relative">
                    <div>
                      <video
                        className="w-100 overflow-hidden"
                        style={{
                          objectFit: "cover",
                          borderTopLeftRadius: "7px",
                          height: "117.1875px",
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
                    <div
                      className="position-absolute fw-normal d-flex align-items-center"
                      style={{
                        top: "4.74px",
                        right: "7.01px",
                        padding: "1.58px 3.96px",
                        background: "rgba(0, 0, 0, 0.5)",
                        borderRadius: 3.96,
                        border: "0.32px solid rgba(255, 255, 255, 0.1)",
                        gap: 2.38,
                      }}
                    >
                      <MdOutlineRemoveRedEye size={5.55} color="#00D3F2" />
                      <span className="text-white" style={{ fontSize: 4.75 }}>
                        Visits: {project.visits}
                      </span>
                    </div>

                    <div
                      className="position-absolute"
                      style={{
                        top: "4.74px",
                        left: "7.01px",
                      }}
                    >
                      <div
                        className="fw-bold"
                        style={{
                          padding: "1.58px 3.54px",
                          background: "#141518",
                          borderRadius: "3.96px",
                          lineHeight: 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "4.75px",
                            color: "#DFE012",
                            lineHeight: 1,
                            display: "block",
                          }}
                        >
                          {/* {displayStatusText(project.reportStatus)} */}
                          {project.reportStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#1D1F25",
                      padding: "7.29px 5.95px",
                    }}
                  >
                    <div
                      className="d-flex align-content-center justify-content-between"
                      style={{ marginBottom: 6.77 }}
                    >
                      <span
                        className="fw-bold"
                        style={{ fontSize: 4.9, color: "#9CA3AF" }}
                      >
                        GS NO: {project.gSno}
                      </span>
                      <span
                        className="fw-bold"
                        style={{ fontSize: 4.9, color: "#9CA3AF" }}
                      >
                        {project.sectorName}
                      </span>
                    </div>
                    <div
                      style={{
                        borderBottom: "0.35px solid #2A2A2A",
                        marginBottom: 6.77,
                      }}
                    />
                    <div>
                      <p
                        className="fw-5"
                        style={{
                          fontSize: 5.21,
                          color: "#9CA3AF",
                          marginBottom: "1.75px",
                        }}
                      >
                        Project Name
                      </p>

                      <p
                        className="fw-8 text-white"
                        style={{
                          fontSize: 5.73,
                          marginBottom: 8.33,
                        }}
                      >
                        {project.projectName}
                      </p>

                      <div
                        className="d-flex justify-content-between"
                        style={{ gap: 17.77, marginBottom: 6.77 }}
                      >
                        <div>
                          <p
                            className="fw-5"
                            style={{
                              marginBottom: 1.75,
                              fontSize: 5.21,
                              color: "#9CA3AF",
                            }}
                          >
                            PC-I Cost
                          </p>
                          <p
                            className="fw-6 text-white m-0"
                            style={{
                              fontSize: 5.73,
                            }}
                          >
                            {formatAmountWithCommas(project.pciCost)} M
                          </p>
                        </div>
                        <div>
                          <p
                            className="fw-5"
                            style={{
                              marginBottom: 1.75,
                              fontSize: 5.21,
                              color: "#9CA3AF",
                            }}
                          >
                            Planned Start Date
                          </p>
                          <p
                            className="fw-6 text-white m-0"
                            style={{
                              fontSize: 5.73,
                            }}
                          >
                            {project.plannedStartDate}
                          </p>
                        </div>
                        <div>
                          <p
                            className="fw-5"
                            style={{
                              marginBottom: 1.75,
                              fontSize: 5.21,
                              color: "#9CA3AF",
                            }}
                          >
                            Planned End Date
                          </p>
                          <p
                            className="fw-6 text-white m-0"
                            style={{
                              fontSize: 5.73,
                            }}
                          >
                            {project.plannedEndDate}
                          </p>
                        </div>
                        <div>
                          <p
                            className="fw-5"
                            style={{
                              marginBottom: 1.75,
                              fontSize: 5.21,
                              color: "#9CA3AF",
                            }}
                          >
                            Location
                          </p>
                          <p
                            className="fw-6 text-white m-0"
                            style={{
                              fontSize: 5.73,
                            }}
                          >
                            {project.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        borderBottom: "0.35px solid #2A2A2A",
                        marginBottom: 6.77,
                      }}
                    />

                    <div
                      className="d-flex justify-content-between"
                      style={{ gap: 9.1 }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 3.5 }}
                      >
                        <div
                          className="color-evaluation-theme-blue rounded-circle fw-6 d-flex align-items-center justify-content-center"
                          style={{
                            background: "rgba(0, 143, 251, 0.1)",
                            border: "0.52px solid #1C6BA6",
                            fontSize: 5.21,
                            width: 13.2,
                            height: 13.2,
                          }}
                        >
                          {getInitials(project.officierName)}
                        </div>
                        <div>
                          <p
                            className="fw-5"
                            style={{
                              marginBottom: "0",
                              fontSize: 5.21,
                              color: "#9CA3AF",
                            }}
                          >
                            Reporting Officer
                          </p>
                          <p
                            className="fw-6 text-white"
                            style={{ marginBottom: "0", fontSize: 5.73 }}
                          >
                            {project.officierName}
                          </p>
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-end"
                        style={{ gap: 9.1 }}
                      >
                        <div>
                          <p
                            className="fw-5 text-end"
                            style={{
                              marginBottom: "0",
                              fontSize: 5.21,
                              color: "#9CA3AF",
                            }}
                          >
                            Report Issue Date
                          </p>
                          <p
                            className="fw-6 text-white text-end"
                            style={{ marginBottom: "0", fontSize: 5.73 }}
                          >
                            {project.reportIssueDate}
                          </p>
                        </div>
                        <div>
                          <p
                            className="fw-5 text-end"
                            style={{
                              marginBottom: "0",
                              fontSize: 5.21,
                              color: "#9CA3AF",
                            }}
                          >
                            Visit Completed Date
                          </p>
                          <p
                            className="fw-6 text-white text-end"
                            style={{ marginBottom: "0", fontSize: 5.73 }}
                          >
                            {project.visitCompletedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {/* {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
            <Fragment key={d}>
              {projectsData?.map((project, i) => (
                <Link
                  href={`/projects-live-view/project-details-dashboard/${project.id}/${project.visitId}`}
                  target="_blank"
                  className="col-auto p-0 text-decoration-none"
                  key={i}
                >
                  <div
                    className="col"
                    style={{
                      borderRadius: 7.81,
                      border: "0.78px solid #AB0000",
                      padding: 2.6,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 7,
                        border: "0.78px solid #AB0000",
                        overflow: "hidden",
                      }}
                    >
                      <div className="position-relative">
                        <div>
                          <video
                            className="w-100 overflow-hidden"
                            style={{
                              objectFit: "cover",
                              borderTopLeftRadius: "7px",
                              height: "117.1875px",
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
                            top: "4.74px",
                            right: "7.01px",
                            padding: "1.58px 3.96px",
                            background: "rgba(0, 0, 0, 0.5)",
                            borderRadius: 3.96,
                            border: "0.32px solid rgba(255, 255, 255, 0.1)",
                            gap: 2.38,
                          }}
                        >
                          <MdOutlineRemoveRedEye size={5.55} color="#00D3F2" />
                          <span
                            className="text-white"
                            style={{ fontSize: 4.75 }}
                          >
                            Visits: 22
                          </span>
                        </div>

                        <div
                          className="position-absolute"
                          style={{
                            top: "4.74px",
                            left: "7.01px",
                          }}
                        >
                          <div
                            className="fw-bold"
                            style={{
                              padding: "1.58px 3.54px",
                              background: "#141518",
                              borderRadius: "3.96px",
                              lineHeight: 1,
                            }}
                          >
                            <span
                              style={{
                                fontSize: "4.75px",
                                color: "#DFE012",
                                lineHeight: 1,
                                display: "block",
                              }}
                            >
                              {displayStatusText(project.reportStatus)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#1D1F25",
                          padding: "7.29px 5.95px",
                        }}
                      >
                        <div
                          className="d-flex align-content-center justify-content-between"
                          style={{ marginBottom: 6.77 }}
                        >
                          <span
                            className="fw-bold"
                            style={{ fontSize: 4.9, color: "#9CA3AF" }}
                          >
                            GS NO: {project.gSno}
                          </span>
                          <span
                            className="fw-bold"
                            style={{ fontSize: 4.9, color: "#9CA3AF" }}
                          >
                            {project.projectName.substring(0, 33)}...
                          </span>
                        </div>
                        <div
                          style={{
                            borderBottom: "0.35px solid #2A2A2A",
                            marginBottom: 6.77,
                          }}
                        />
                        <div>
                          <p
                            className="fw-5"
                            style={{
                              fontSize: 5.21,
                              color: "#9CA3AF",
                              marginBottom: "1.75px",
                            }}
                          >
                            Project Name
                          </p>

                          <p
                            className="fw-8 text-white"
                            style={{
                              fontSize: 5.73,
                              marginBottom: 8.33,
                            }}
                          >
                            {project.projectName}
                          </p>

                          <div
                            className="d-flex justify-content-between"
                            style={{ gap: 17.77, marginBottom: 6.77 }}
                          >
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: 1.75,
                                  fontSize: 5.21,
                                  color: "#9CA3AF",
                                }}
                              >
                                PC-I Cost
                              </p>
                              <p
                                className="fw-6 text-white m-0"
                                style={{
                                  fontSize: 5.73,
                                }}
                              >
                                74,9420.140 M
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: 1.75,
                                  fontSize: 5.21,
                                  color: "#9CA3AF",
                                }}
                              >
                                Planned Start Date
                              </p>
                              <p
                                className="fw-6 text-white m-0"
                                style={{
                                  fontSize: 5.73,
                                }}
                              >
                                01-Jul-2024
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: 1.75,
                                  fontSize: 5.21,
                                  color: "#9CA3AF",
                                }}
                              >
                                Planned End Date
                              </p>
                              <p
                                className="fw-6 text-white m-0"
                                style={{
                                  fontSize: 5.73,
                                }}
                              >
                                28-Feb-2027
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: 1.75,
                                  fontSize: 5.21,
                                  color: "#9CA3AF",
                                }}
                              >
                                Location
                              </p>
                              <p
                                className="fw-6 text-white m-0"
                                style={{
                                  fontSize: 5.73,
                                }}
                              >
                                Opposite to Val...
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            borderBottom: "0.35px solid #2A2A2A",
                            marginBottom: 6.77,
                          }}
                        />

                        <div
                          className="d-flex justify-content-between"
                          style={{ gap: 9.1 }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: 3.5 }}
                          >
                            <div
                              className="color-evaluation-theme-blue rounded-circle fw-6 d-flex align-items-center justify-content-center"
                              style={{
                                background: "rgba(0, 143, 251, 0.1)",
                                border: "0.52px solid #1C6BA6",
                                fontSize: 5.21,
                                width: 13.2,
                                height: 13.2,
                              }}
                            >
                              MS
                            </div>
                            <div>
                              <p
                                className="fw-5"
                                style={{
                                  marginBottom: "0",
                                  fontSize: 5.21,
                                  color: "#9CA3AF",
                                }}
                              >
                                Reporting Officer
                              </p>
                              <p
                                className="fw-6 text-white"
                                style={{ marginBottom: "0", fontSize: 5.73 }}
                              >
                                M. Salman
                              </p>
                            </div>
                          </div>
                          <div
                            className="d-flex justify-content-end"
                            style={{ gap: 9.1 }}
                          >
                            <div>
                              <p
                                className="fw-5 text-end"
                                style={{
                                  marginBottom: "0",
                                  fontSize: 5.21,
                                  color: "#9CA3AF",
                                }}
                              >
                                Report Issue Date
                              </p>
                              <p
                                className="fw-6 text-white text-end"
                                style={{ marginBottom: "0", fontSize: 5.73 }}
                              >
                                Sun-08-Mar-2026
                              </p>
                            </div>
                            <div>
                              <p
                                className="fw-5 text-end"
                                style={{
                                  marginBottom: "0",
                                  fontSize: 5.21,
                                  color: "#9CA3AF",
                                }}
                              >
                                Visit Completed Date
                              </p>
                              <p
                                className="fw-6 text-white text-end"
                                style={{ marginBottom: "0", fontSize: 5.73 }}
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
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default ProjectsLiveView;

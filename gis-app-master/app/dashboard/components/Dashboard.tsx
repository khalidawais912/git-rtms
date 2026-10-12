"use client";
import { MAIN_DASHBOARD_API } from "@/shared/api/endpoints";
import AnimatedCounter from "@/shared/components/AnimatedCounter";
import Button from "@/shared/components/Button";
import CustomModal from "@/shared/components/CustomModal/CustomModal";
import DashboardWrapper from "@/shared/components/DashboardWrapper";
import Loader from "@/shared/components/Loader/Loader";
// import Menu from "@/shared/components/Menu";
import { setContent } from "@/store/contentSlice";
import { setTutorial } from "@/store/tutorialSlice";
import apiClient from "@/shared/api/client";
import { devMap, formatAmountWithCommas } from "@/shared/utils";
import carOutline from "@/public/icons/carOutline.svg";
import controllingReleaseCircle from "@/public/icons/controllingReleaseCircle.svg";
import divideCircle from "@/public/icons/divideCircle.svg";
import originalAllocationCircle from "@/public/icons/originalAllocationCircle.svg";
import pndReleaseCircle from "@/public/icons/pndReleaseCircle.svg";
import reportAnalysis from "@/public/icons/reportAnalysis.svg";
import revisedAllocationCircle from "@/public/icons/revisedAllocationCircle.svg";
import settingCircleArrow from "@/public/icons/settingCircleArrow.svg";
import spendingReleaseCircle from "@/public/icons/spendingReleaseCircle.svg";
import staffTracking2 from "@/public/icons/staffTracking2.svg";
import utilizationCircle from "@/public/icons/utilizationCircle.svg";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { Lexend, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import styles from "./Dashboard.module.css";
import DistributedColumnChart from "./DistributedColumnChart";
import FilterButtons from "./FilterButtons";
import FinancialSlab from "./FinancialSlab";
import MyMap from "./GoogleMap/MyMap";
import ProjectsTable, { ProjectsList } from "./ProjectsTable/ProjectsTable";
import ReportReview from "./ReportReview";
import SimplePieChart from "./SimplePieChart";
import VisitsPlan from "./VisitsPlan";
import useProjectsTableUtils from "./ProjectsTable/useProjectsTableUtils";

const Menu = dynamic(() => import("@/shared/components/Menu"), { ssr: false });

const lexend = Lexend({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

export interface DistrictList {
  id: number;
  districtName: string;
  divisionName: string;
  latitude: string;
  longitude: string;
  approved: number;
  unApproved: number;
  dropped: number;
  good: number;
  average: number;
  crtical: number;
}

export interface MainDashboard {
  totalProjects: number;
  monitoredProjects: number;
  inProcessProjects: number;
  defineLimitProjects: number;
  needConsidrationProjects: number;
  criticalProjects: number;
  approvedCost: number;
  expenditure: number;
  progress: number;
  noofProject: number;
  approved: number;
  unapproved: number;
  dropped: number;
  umbralla: number;
  single: number;
  utilization20t080: number;
  a0to200: number;
  a200to400: number;
  a400to800: number;
  a800to1000: number;
  a100above: number;
  projectslist: null;
  disitrictlist: DistrictList[];
}

export interface FilterData {
  filterIdentifier: string;
  filterValues: string;
}

interface Props {
  dashboardType?: string;
}

const Dashboard = ({ dashboardType }: Props) => {
  const [data, setData] = useState<MainDashboard>();
  const [role, setRole] = useState<string>();
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();
  // useAuthorization("dashboard");
  const { rowCountOptions, districtOptions, sectorOptions, userOptions } =
    useProjectsTableUtils();

  const [isInRange, setIsInRange] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsInRange(width >= 992 && width <= 1264);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    const userRole = Cookies.get("role");
    if (userRole) setRole(userRole);
  }, []);

  useEffect(() => {
    const handleButtonClick = (content: string, tutorialLink: string) => {
      dispatch(setContent(content));
      dispatch(setTutorial(tutorialLink));
    };

    handleButtonClick(
      "dashboard",
      "https://www.youtube.com/watch?v=1wgAwCufsko&ab_channel=DirectorateGeneralMonitoringandEvaluation",
    );
  }, []);

  const [isLoading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"cmInitiative" | "adp">(
    "cmInitiative",
  );

  const [otherFilters, setOtherFilters] = useState<FilterData[]>([]);
  const [combinedFilters, setCombinedFilters] = useState<FilterData[]>([]);

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

  const adpFilters = [
    {
      filterIdentifier: "",
      filterValues: "",
    },
  ];

  // Combine active filter with other filters
  useEffect(() => {
    setCombinedFilters(
      activeFilter === "cmInitiative"
        ? [...cmInitiativeFilters, ...otherFilters]
        : [...adpFilters, ...otherFilters],
    );
  }, [activeFilter, adpFilters, otherFilters, cmInitiativeFilters]);

  const handleFilterChange = (filterType: "cmInitiative" | "adp") => {
    setActiveFilter(filterType);
  };

  const handleSubmit = async (filterData: FilterData[]) => {
    setLoading(true);
    try {
      const response = await apiClient.post(MAIN_DASHBOARD_API, filterData, {
        withCredentials: true,
      });
      setData(response.data.data);
      // setProjectsData(response.data.data.projectslist.reverse());
      // const districtFilter = filterData.find(
      //   (filter) => filter.filterIdentifier === "District"
      // );
      // if (districtFilter) {
      //   setActiveProjects(response.data.data.projectslist);
      // }
      console.log("response:", response.data.data);
      console.log("FilterData:", filterData);
      setLoading(false);
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit(cmInitiativeFilters);
  }, [cmInitiativeFilters]);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  const [projectsData, setProjectsData] = useState<ProjectsList[]>();

  const getProjectsList = async (status: string) => {
    setProjectsData([]);
    console.log("status", status);
    console.log("get projects with combinedFilters", combinedFilters);
    try {
      if (activeFilter === "cmInitiative") {
        const response = await apiClient.post(
          `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
          [...cmInitiativeFilters, ...otherFilters],
        );
        setProjectsData(response.data.data);
      } else {
        const response = await apiClient.post(
          `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
          [...adpFilters, ...otherFilters],
        );
        setProjectsData(response.data.data);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  // Filter and map keys
  const filteredCMADPKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object?.keys(projectsData[0])
      .filter((key) =>
        [
          "gSno",
          "projectName",
          "sectorName",
          "districtName",
          "cost",
          "revisedAllocation",
          "pnDReleases",
          "utilization",
          "utilPercent",
          role !== "Special Role" && "visitCount",
        ].includes(key),
      )
      .map((key) => key as keyof ProjectsList);

  const filteredNoOfProjectsKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "gSno",
          "projectName",
          "sectorName",
          "districtName",
          role !== "Special Role" && "visitCount",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          role !== "Special Role" && "deadline",
          "fileGenrated",
        ].includes(key),
      )
      .map((key) => key as keyof ProjectsList);

  // Filter and map keys
  const filteredKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "gSno",
          "projectName",
          "sectorName",
          "districtName",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          role !== "Special Role" && "deadline",
          "reportStatus",
          "statusDate",
        ].includes(key),
      )
      .map((key) => key as keyof ProjectsList);

  const [utilizationData, setUtilizationData] = useState<ProjectsList[]>([]);
  const [openUtilizationData, setOpenUtilizationData] = useState<
    ProjectsList[]
  >([]);

  useEffect(() => {
    getProjectsList("TotalProject");
  }, []);

  // useEffect(() => {
  //   if (projectsData) {
  //     const filteredProjects = projectsData?.filter((project) => {
  //       const utilizationPercentage =
  //         ((project.expUpToJune + project.utilization) / project.cost) * 100;
  //       return utilizationPercentage >= 20 && utilizationPercentage <= 80;
  //     });
  //     setUtilizationData(filteredProjects);
  //   }
  // }, [projectsData]);
  useEffect(() => {
    if (projectsData) {
      const updatedProjects = projectsData.map((project) => ({
        ...project,
        utilPercent: Math.round(
          ((project.expUpToJune + project.utilization) / project.cost) * 100,
        ),
      }));

      setOpenUtilizationData(updatedProjects); // Store filtered projects with utilPercent

      // Now apply the filter based on computed utilPercent
      const filteredProjects = updatedProjects.filter(
        (project) => project.utilPercent >= 20 && project.utilPercent <= 80,
      );

      setUtilizationData(filteredProjects); // Store filtered projects with utilPercent
    }
  }, [projectsData]);

  return (
    <DashboardWrapper>
      <>
        {isLoading && <Loader />}
        <div className={`row ${lexend.className} m-0`}>
          {dashboardType ? (
            <>
              <CustomModal
                isFullscreen={true}
                modalId={"TotalProjects"}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("TotalProject")}
                  >
                    <Menu
                      background="linear-gradient(to right, #155E95 , #2377B6)"
                      icon="/icons/eyeBold.svg"
                      // value={data ? data.totalProjects : 0}
                      value={0}
                      label={
                        activeFilter === "cmInitiative"
                          ? "Submitted PC(IV)s"
                          : "ADP Projects"
                      }
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label={
                            activeFilter === "cmInitiative"
                              ? "CM Initiatives 395"
                              : "ADP Projects"
                          }
                          projectsData={openUtilizationData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <div
                className="col px-1 py-0 me-1 text-center mb-2"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(12, 140, 233,.2)",
                  borderRadius: "10px",
                  border: "1px solid rgba(12, 140, 233,.4)",
                }}
              >
                <p className="mb-0 text-white fs12px">Projects Evaluated</p>
                <div className="row m-0 d-flex flex-nowrap">
                  <CustomModal
                    isFullscreen={true}
                    modalId={"noOfPCIV"}
                    button={
                      <Button
                        className="position-relative btn p-0 pe-1 shadow-none w-100"
                        onClick={() => getProjectsList("NoOfProject")}
                      >
                        {/* <div
                          className="position-absolute"
                          style={{
                            background:
                              "linear-gradient( rgba(163, 12, 233, 0), rgba(163, 12, 233, 0.2),rgba(163, 12, 233, 0.2))",
                            transition: "all .4s",
                            opacity: !isHover1 ? 1 : 0,
                            borderRadius: "10px",
                            width: "98%",
                            height: "92%",
                          }}
                        ></div> */}
                        <div
                          className="position-absolute"
                          style={{
                            // background:
                            //   "linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))",
                            padding: "1px",
                            borderRadius: "10px",
                            width: "98%",
                            height: "92%",
                          }}
                        ></div>
                        <Menu
                          background={`linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))`}
                          icon="/icons/cubes.svg"
                          // value={data ? data.noofProject : 0}
                          value={0}
                          label="No. of Visits (Umbrella)"
                          showTides={false}
                          showArrow={true}
                          textWrap={false}
                          isGrouped={true}
                          toggleLabel={true}
                          sneCount={0}
                          nonSneCount={0}
                        />
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-1">
                          {projectsData && filteredNoOfProjectsKeys ? (
                            <ProjectsTable
                              rowCountOptions={rowCountOptions}
                              districtOptions={districtOptions}
                              sectorOptions={sectorOptions}
                              userOptions={userOptions}
                              keys={filteredNoOfProjectsKeys}
                              label="Projects"
                              projectsData={projectsData}
                              setProjectsData={setProjectsData}
                              role={""}
                            />
                          ) : (
                            <Loader />
                          )}
                        </div>
                      </>
                    }
                  />
                  <CustomModal
                    isFullscreen={true}
                    modalId={"noOfPCIV"}
                    button={
                      <Button
                        className="position-relative btn p-0 pe-1 shadow-none w-100"
                        onClick={() => getProjectsList("NoOfProject")}
                      >
                        {/* <div
                          className="position-absolute"
                          style={{
                            background:
                              "linear-gradient( rgba(163, 12, 233, 0), rgba(163, 12, 233, 0.2),rgba(163, 12, 233, 0.2))",
                            transition: "all .4s",
                            opacity: !isHover1 ? 1 : 0,
                            borderRadius: "10px",
                            width: "98%",
                            height: "92%",
                          }}
                        ></div> */}
                        <div
                          className="position-absolute"
                          style={{
                            // background:
                            //   "linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))",
                            padding: "1px",
                            borderRadius: "10px",
                            width: "98%",
                            height: "92%",
                          }}
                        ></div>
                        <Menu
                          background={`linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))`}
                          icon="/icons/cubes.svg"
                          // value={data ? data.noofProject : 0}
                          value={0}
                          label="No. of Visits (Single)"
                          showTides={false}
                          showArrow={true}
                          textWrap={false}
                          isGrouped={true}
                          toggleLabel={true}
                          sneCount={0}
                          nonSneCount={0}
                        />
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-1">
                          {projectsData && filteredNoOfProjectsKeys ? (
                            <ProjectsTable
                              rowCountOptions={rowCountOptions}
                              districtOptions={districtOptions}
                              sectorOptions={sectorOptions}
                              userOptions={userOptions}
                              keys={filteredNoOfProjectsKeys}
                              label="Projects"
                              projectsData={projectsData}
                              setProjectsData={setProjectsData}
                              role={""}
                            />
                          ) : (
                            <Loader />
                          )}
                        </div>
                      </>
                    }
                  />
                </div>
              </div>

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"Successful"}
                allowOpen={
                  data && data.defineLimitProjects === 0 ? false : true
                }
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("OnTrack")}
                    disabled={data && data.defineLimitProjects === 0}
                  >
                    <Menu
                      background="rgba(39, 192, 77, 0.35)"
                      outline="1px solid rgba(43, 171, 45, 0.4)"
                      icon="/icons/doubleTick.svg"
                      // value={data ? data.defineLimitProjects : 0}
                      value={0}
                      label="Successful"
                      showTides={false}
                      // tideOneImage="/images/tideOneGreen.png"
                      // tideTwoImage="/images/tideTwoGreen.png"
                      showArrow={true}
                      textWrap={false}
                      labelColor="#129E5C"
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Successful Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"PartialSuccess"}
                allowOpen={
                  data && data.needConsidrationProjects === 0 ? false : true
                }
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("OffTrack")}
                    disabled={data && data.needConsidrationProjects === 0}
                  >
                    <Menu
                      background="rgba(218, 248, 21, 0.4)"
                      outline="1px solid rgba(225, 186, 15, 0.4)"
                      icon="/icons/bulb.svg"
                      // value={data ? data.needConsidrationProjects : 0}
                      value={0}
                      label="Partial Success"
                      showTides={false}
                      // tideOneImage="/images/tideOneYellow.png"
                      // tideTwoImage="/images/tideTwoYellow.png"
                      showArrow={true}
                      textWrap={false}
                      labelColor="#AA8B2A"
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Partial Success Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"Not Successful"}
                allowOpen={data && data.criticalProjects === 0 ? false : true}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("Critical")}
                    disabled={data && data.criticalProjects === 0}
                  >
                    <Menu
                      background="rgba(233, 12, 16, 0.26)"
                      outline="1px solid rgba(233, 12, 16, 0.4)"
                      icon="/icons/critical.svg"
                      // value={data ? data.criticalProjects : 0}
                      value={0}
                      label="Not Successful"
                      showTides={false}
                      // tideOneImage="/images/tideOneRed.png"
                      // tideTwoImage="/images/tideTwoRed.png"
                      showArrow={true}
                      textWrap={false}
                      labelColor="#BA2323"
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Not Successful Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"reportsInProgress"}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("InProcess")}
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      // value={data ? data.inProcessProjects : 0}
                      value={0}
                      label="Reports In Progress"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Reports In Progress"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <ReportReview dashboardType={dashboardType} />
            </>
          ) : (
            <>
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"TotalProjects"}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("TotalProject")}
                  >
                    <Menu
                      background="linear-gradient(to bottom right, #40DDFF , #14BAE3, #13B1E6,#11AADF,#0B98C5)"
                      icon="/icons/eyeBold.svg"
                      value={data ? data.totalProjects : 0}
                      label={
                        activeFilter === "cmInitiative"
                          ? "CM Initiatives 781"
                          : "ADP Projects"
                      }
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label={
                            activeFilter === "cmInitiative"
                              ? "CM Initiatives 803"
                              : "ADP Projects"
                          }
                          projectsData={openUtilizationData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <div
                className="col px-1 py-0 me-1 text-center mb-2"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(12, 140, 233,.2)",
                  borderRadius: "10px",
                  border: "1px solid rgba(12, 140, 233,.4)",
                }}
              >
                <p className="mb-0 text-white fs12px">
                  Projects Being Monitored
                </p>
                <div className="row m-0 d-flex flex-nowrap">
                  <CustomModal
                    isFullscreen={true}
                    size="xl"
                    modalId={"noOfProjects"}
                    button={
                      <Button
                        className="position-relative btn p-0 pe-1 shadow-none w-100"
                        onClick={() => getProjectsList("NoOfProject")}
                      >
                        <div
                          className={`position-absolute ${styles.menuDiv}`}
                          style={{
                            background:
                              "linear-gradient( rgba(163, 12, 233, 0), rgba(163, 12, 233, 0.2),rgba(163, 12, 233, 0.2))",
                            borderRadius: "10px",
                            width: "98%",
                            height: "92%",
                          }}
                        ></div>
                        <Menu
                          classNames={styles.noOfProjectMenu}
                          icon="/icons/cubes.svg"
                          value={data ? data.noofProject : 0}
                          label="No. of Projects"
                          showTides={true}
                          showArrow={true}
                          textWrap={false}
                          isGrouped={true}
                        />
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-1">
                          {projectsData && filteredNoOfProjectsKeys ? (
                            <ProjectsTable
                              rowCountOptions={rowCountOptions}
                              districtOptions={districtOptions}
                              sectorOptions={sectorOptions}
                              userOptions={userOptions}
                              keys={filteredNoOfProjectsKeys}
                              label="Projects"
                              projectsData={projectsData}
                              setProjectsData={setProjectsData}
                              role={""}
                            />
                          ) : (
                            <Loader />
                          )}
                        </div>
                      </>
                    }
                  />
                  <CustomModal
                    isFullscreen={true}
                    size="xl"
                    modalId={"noOfVisits"}
                    button={
                      <Button
                        className="position-relative btn p-0 shadow-none w-100"
                        onClick={() => getProjectsList("BeingMonitored")}
                      >
                        <div
                          className={`position-absolute ${styles.menuDiv}`}
                          style={{
                            background:
                              "linear-gradient( rgba(12, 140, 233, 0), rgba(12, 140, 233, 0.2),rgba(12, 140, 233, 0.2))",
                            borderRadius: "10px",
                            width: "100%",
                            height: "92%",
                          }}
                        ></div>
                        <Menu
                          classNames={styles.noOfVisitsMenu}
                          icon="/icons/archery.svg"
                          value={data ? data.monitoredProjects : 0}
                          label="No. of Visits"
                          showTides={true}
                          showArrow={true}
                          textWrap={false}
                          isGrouped={true}
                        />
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-1">
                          {projectsData && filteredKeys ? (
                            <ProjectsTable
                              rowCountOptions={rowCountOptions}
                              districtOptions={districtOptions}
                              sectorOptions={sectorOptions}
                              userOptions={userOptions}
                              keys={filteredKeys}
                              label="Visits"
                              projectsData={projectsData}
                              setProjectsData={setProjectsData}
                              role={""}
                            />
                          ) : (
                            <Loader />
                          )}
                        </div>
                      </>
                    }
                  />
                </div>
              </div>

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"Good"}
                allowOpen={
                  data && data.defineLimitProjects === 0 ? false : true
                }
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("OnTrack")}
                    disabled={data && data.defineLimitProjects === 0}
                  >
                    <Menu
                      background="rgba(45, 199, 84, 0.35)"
                      outline="1px solid rgba(50, 179, 52, 0.4)"
                      icon="/icons/doubleTick.svg"
                      value={data ? data.defineLimitProjects : 0}
                      label="Good Projects"
                      showTides={true}
                      tideOneImage="/images/tideOneGreen.png"
                      tideTwoImage="/images/tideTwoGreen.png"
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Good Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"Average"}
                allowOpen={
                  data && data.needConsidrationProjects === 0 ? false : true
                }
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("OffTrack")}
                    disabled={data && data.needConsidrationProjects === 0}
                  >
                    <Menu
                      background="rgba(224, 255, 22, 0.4)"
                      outline="1px solid rgba(232, 192, 15, 0.4)"
                      icon="/icons/bulb.svg"
                      value={data ? data.needConsidrationProjects : 0}
                      label="Average Projects"
                      showTides={true}
                      tideOneImage="/images/tideOneYellow.png"
                      tideTwoImage="/images/tideTwoYellow.png"
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Average Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"Critical"}
                allowOpen={data && data.criticalProjects === 0 ? false : true}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("Critical")}
                    disabled={data && data.criticalProjects === 0}
                  >
                    <Menu
                      background="rgba(233, 12, 16, 0.26)"
                      outline="1px solid rgba(233, 12, 16, 0.4)"
                      icon="/icons/critical.svg"
                      value={data ? data.criticalProjects : 0}
                      label="Critical Projects"
                      showTides={true}
                      tideOneImage="/images/tideOneRed.png"
                      tideTwoImage="/images/tideTwoRed.png"
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Critical Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId={"reportsInProgress"}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("InProcess")}
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.inProcessProjects : 0}
                      label="Reports In Progress"
                      showTides={true}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredKeys}
                          label="Reports In Progress"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />

              <ReportReview dashboardType={dashboardType} />
            </>
          )}
        </div>
        <div className={`row m-0 ${lexend.className}`}>
          <div
            className={`p-1 ${
              isInRange ? "col-lg-8" : "col-lg-9"
            } col-md-12 col-sm-12`}
          >
            {devMap && data && (
              <MyMap
                data={data}
                handleSubmit={handleSubmit}
                activeFilter={activeFilter}
                otherFilters={otherFilters}
                setOtherFilters={setOtherFilters}
              />
            )}
          </div>
          <div
            className={`p-1 ${
              isInRange ? "col-lg-4" : "col-lg-3"
            } col-md-12 col-sm-12`}
          >
            <FilterButtons
              handleSubmit={handleSubmit}
              setOtherFilters={setOtherFilters}
              otherFilters={otherFilters}
              handleFilterChange={handleFilterChange}
              combinedFilters={combinedFilters}
              activeFilter={activeFilter}
            />
            {role !== "Special Role" && (
              <div
                className={`col mb-2 shadow-sm fs14px ${lexend.className}`}
                style={{
                  background: "#C6D9F1",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <CustomModal
                  size="xl"
                  modalId="pieBarChart"
                  HeaderRightPos={20}
                  HeaderTopPos={5}
                  button={
                    <Button
                      className="btn fs18px fw-normal text-white w-100"
                      style={{
                        background: "rgba(12, 140, 233, 0.2)",
                        borderRadius: "10px",
                        border: "1px solid rgba(12, 140, 233, 0.4)",
                      }}
                      onClick={() => getProjectsList("BarPie")}
                    >
                      <Image
                        src="/icons/barPie.svg"
                        alt="barPie"
                        width={44}
                        height={44}
                      />{" "}
                      Financial Analysis
                    </Button>
                  }
                  body={
                    <div className="row d-flex m-0">
                      {projectsData &&
                        projectsData.length > 0 &&
                        pageLoaded && (
                          <>
                            <div className="col mb-4">
                              <DistributedColumnChart
                                data={projectsData[0]}
                                activeFilter={activeFilter}
                              />
                            </div>
                            <div className="col mb-4">
                              <SimplePieChart
                                data={{
                                  totalRevenueCost:
                                    projectsData[0].totalRevenueCost,
                                  totalCapitalCost:
                                    projectsData[0].totalCapitalCost,
                                }}
                                activeFilter={activeFilter}
                              />
                            </div>
                          </>
                        )}
                    </div>
                  }
                />
              </div>
            )}
            {role !== "Special Role" && (
              <div
                className={`col mb-2 shadow-sm fs14px p-0 ${lexend.className}`}
                style={{
                  background:
                    "linear-gradient(to right, #C6D9F1,#C6D9F1 , #E3F1C6,#E3F1C6)",
                  borderRadius: "10px",
                }}
              >
                {/* <div className="row d-flex m-0">
                {hoveredButton === -1 || hoveredButton === 0 ? (
                  <div
                    className="col p-0"
                    onMouseEnter={() => setHoveredButton(0)}
                    onMouseLeave={() => setHoveredButton(-1)}
                    style={{
                      width: `${
                        hoveredButton === -1 || hoveredButton === 0
                          ? "100%"
                          : "0%"
                      }`,
                      opacity:
                        hoveredButton === -1 || hoveredButton === 0 ? 1 : 0,
                      transition: "width 1s opacity 1s",
                    }}
                  >
                    <Link
                      href="/vehicle-tracking"
                      className="row d-flex m-0 justify-content-center btn w-100 fw-normal fs14px"
                      style={{
                        borderRadius: "8px",
                        background: "#C6D9F1",
                      }}
                    >
                      <div className="col-auto p-0 pe-1 my-auto">
                        <Image
                          src={carOutline}
                          alt="carOutline"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="col-auto p-0">
                        Vehicle
                        <br />
                        Tracking
                      </div>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {hoveredButton === -1 || hoveredButton === 1 ? (
                  <div
                    className="col p-0"
                    onMouseEnter={() => setHoveredButton(1)}
                    onMouseLeave={() => setHoveredButton(-1)}
                  >
                    <Link
                      href="/staff-tracking"
                      className="row d-flex m-0 justify-content-center btn w-100 fw-normal fs14px"
                      style={{
                        borderRadius: "8px",
                        background: "#E3F1C6",
                      }}
                    >
                      <div className="col-auto pe-1 my-auto">
                        <Image
                          src={staffTracking2}
                          alt="staffTracking2"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="col-auto p-0">
                        Staff
                        <br />
                        Tacking
                      </div>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {hoveredButton === -1 || hoveredButton === 2 ? (
                  <div
                    className="col p-0"
                    style={{ zIndex: 2 }}
                    onMouseEnter={() => setHoveredButton(2)}
                    onMouseLeave={() => setHoveredButton(-1)}
                  >
                    <VisitsPlan
                      getProjectsList={getProjectsList}
                      projectsData={projectsData ? projectsData : []}
                      setProjectsData={setProjectsData}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div> */}

                <div className={`row d-flex m-0 ${styles.hoverWrapper}`}>
                  <div className={`p-0 ${styles.hoverWrapper}`}>
                    <div className={styles.hoverItem}>
                      <Link
                        href="/vehicle-tracking"
                        target="_blank"
                        className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center"
                        style={{
                          borderRadius: "8px",
                          background: "#C6D9F1",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="me-2 ps-2">
                            <Image
                              src={carOutline}
                              alt="Vehicle Icon"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="text-start fw-5">
                            Vehicle Tracking
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className={`${styles.hoverItem}`}>
                      <Link
                        href="/staff-tracking"
                        target="_blank"
                        className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center"
                        style={{
                          borderRadius: "8px",
                          background: "#E3F1C6",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="me-2 ps-2">
                            <Image
                              src={staffTracking2}
                              alt="staffTracking2"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="text-start">Staff Tracking</div>
                        </div>
                      </Link>
                    </div>
                    <div className={`${styles.hoverItem}`}>
                      <VisitsPlan
                        getProjectsList={getProjectsList}
                        projectsData={projectsData ? projectsData : []}
                        setProjectsData={setProjectsData}
                      />
                    </div>
                  </div>
                  {/* <AnimatePresence>
                    {(hoveredButton === -1 || hoveredButton === 0) && (
                      <motion.div
                        className="p-0"
                        onMouseEnter={() => setHoveredButton(0)}
                        onMouseLeave={() => setHoveredButton(-1)}
                        initial={{ flex: 1, opacity: 0 }}
                        animate={{
                          flex: hoveredButton === 0 ? 3 : 1,
                          opacity: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <Link
                          href="/vehicle-tracking"
                          className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
                          style={{
                            borderRadius: "8px",
                            background: "#C6D9F1",
                          }}
                        >
                          <div className="col-auto p-0 pe-1 my-auto">
                            <Image
                              src={carOutline}
                              alt="carOutline"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="col-auto p-0">
                            Vehicle
                            <br />
                            Tracking
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(hoveredButton === -1 || hoveredButton === 1) && (
                      <motion.div
                        className="p-0"
                        onMouseEnter={() => setHoveredButton(1)}
                        onMouseLeave={() => setHoveredButton(-1)}
                        initial={{ flex: 1, opacity: 0 }}
                        animate={{
                          flex: hoveredButton === 1 ? 3 : 1,
                          opacity: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <Link
                          href="/staff-tracking"
                          className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
                          style={{
                            borderRadius: "8px",
                            background: "#E3F1C6",
                          }}
                        >
                          <div className="col-auto p-0 pe-1 my-auto">
                            <Image
                              src={staffTracking2}
                              alt="staffTracking2"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="col-auto p-0">
                            Staff
                            <br />
                            Tracking
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(hoveredButton === -1 || hoveredButton === 2) && (
                      <motion.div
                        className="p-0"
                        style={{ zIndex: 2 }}
                        onMouseEnter={() => setHoveredButton(2)}
                        onMouseLeave={() => setHoveredButton(-1)}
                        initial={{ flex: 1, opacity: 0 }}
                        animate={{
                          flex: hoveredButton === 2 ? 3 : 1,
                          opacity: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        <VisitsPlan
                          getProjectsList={getProjectsList}
                          projectsData={projectsData ? projectsData : []}
                          setProjectsData={setProjectsData}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence> */}
                </div>

                {/* <div className="row d-flex m-0">
                  <AnimatePresence>
                    {(hoveredButton === -1 || hoveredButton === 0) && (
                      <motion.div
                        className="p-0"
                        onMouseEnter={() => setHoveredButton(0)}
                        onMouseLeave={() => setHoveredButton(-1)}
                        initial={{ flex: 1, opacity: 0 }}
                        animate={{
                          flex: hoveredButton === 0 ? 3 : 1,
                          opacity: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <Link
                          href="/vehicle-tracking"
                          className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
                          style={{
                            borderRadius: "8px",
                            background: "#C6D9F1",
                          }}
                        >
                          <div className="col-auto p-0 pe-1 my-auto">
                            <Image
                              src={carOutline}
                              alt="carOutline"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="col-auto p-0">
                            Vehicle
                            <br />
                            Tracking
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(hoveredButton === -1 || hoveredButton === 1) && (
                      <motion.div
                        className="p-0"
                        onMouseEnter={() => setHoveredButton(1)}
                        onMouseLeave={() => setHoveredButton(-1)}
                        initial={{ flex: 1, opacity: 0 }}
                        animate={{
                          flex: hoveredButton === 1 ? 3 : 1,
                          opacity: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <Link
                          href="/staff-tracking"
                          className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
                          style={{
                            borderRadius: "8px",
                            background: "#E3F1C6",
                          }}
                        >
                          <div className="col-auto p-0 pe-1 my-auto">
                            <Image
                              src={staffTracking2}
                              alt="staffTracking2"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="col-auto p-0">
                            Staff
                            <br />
                            Tracking
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(hoveredButton === -1 || hoveredButton === 2) && (
                      <motion.div
                        className="p-0"
                        style={{ zIndex: 2 }}
                        onMouseEnter={() => setHoveredButton(2)}
                        onMouseLeave={() => setHoveredButton(-1)}
                        initial={{ flex: 1, opacity: 0 }}
                        animate={{
                          flex: hoveredButton === 2 ? 3 : 1,
                          opacity: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        <VisitsPlan
                          getProjectsList={getProjectsList}
                          projectsData={projectsData ? projectsData : []}
                          setProjectsData={setProjectsData}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div> */}
              </div>
            )}
            <div
              className={`col mb-2 shadow-sm fs14px ${lexend.className}`}
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div className="row d-flex m-0">
                <div className="col p-1">
                  <CustomModal
                    isFullscreen={true}
                    modalId="utilization"
                    button={
                      <Button
                        onClick={() => getProjectsList("TotalProject")}
                        className="row d-flex m-0 justify-content-center align-items-center btn w-100 text-white text-nowrap fw-normal fs12px py-3 px-0 position-relative"
                        style={{
                          borderRadius: "8px",
                          background: `${
                            dashboardType ? "#155E95" : "#1E6BDD"
                          }`,
                          transition: "all .3s",
                        }}
                      >
                        <div className="col-auto px-1">
                          <Image
                            src={settingCircleArrow}
                            alt="settingCircleArrow"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="col-auto px-1">
                          <p className="mb-0">Utilization</p>
                          {dashboardType ? (
                            <p className="mb-0">
                              <span className="text-nowrap">(80%)</span>
                              &nbsp;
                              <span>0</span>
                            </p>
                          ) : (
                            <p className="mb-0">
                              <span className="text-nowrap">(20% - 80%)</span>
                              &nbsp;
                              <span>
                                {data ? (
                                  <AnimatedCounter
                                    from={0}
                                    to={data.utilization20t080}
                                    // to={utilizationData?.length}
                                  />
                                ) : (
                                  0
                                )}
                              </span>
                            </p>
                          )}
                        </div>
                        {role === "Super Admin" ||
                        role === "Deputy Director" ||
                        role === "Director" ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Utilization vs Schemes Visited by DGME&apos;Team
                              </Tooltip>
                            }
                          >
                            <span
                              className="col-auto position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs12px"
                              style={{ zIndex: 1 }}
                            >
                              {data && (
                                <AnimatedCounter
                                  from={0}
                                  to={
                                    dashboardType
                                      ? 0
                                      : data.utilization20t080 -
                                        utilizationData.filter(
                                          (data) => data.visitCount > 0,
                                        ).length
                                  }
                                />
                              )}
                              <span className="visually-hidden">
                                unread messages
                              </span>
                            </span>
                          </OverlayTrigger>
                        ) : (
                          ""
                        )}
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-1">
                          {projectsData && filteredCMADPKeys ? (
                            <ProjectsTable
                              rowCountOptions={rowCountOptions}
                              districtOptions={districtOptions}
                              sectorOptions={sectorOptions}
                              userOptions={userOptions}
                              keys={filteredCMADPKeys}
                              label="Utilization(20% - 80%)"
                              projectsData={utilizationData}
                              setProjectsData={setProjectsData}
                              allowLink={false}
                              role={""}
                            />
                          ) : (
                            <Loader />
                          )}
                        </div>
                      </>
                    }
                  />
                </div>
                {/* {role !== "Special Role" && (
                  <div className="col-auto p-1">
                    <CustomModal
                      isFullscreen={true}
                      modalId="reportAnalysis"
                      HeaderRightPos={50}
                      HeaderTopPos={20}
                      button={
                        <Button
                          className="row d-flex flex-nowrap justify-content-center m-0 btn w-100 text-white fw-normal fs12px py-3 px-0"
                          style={{
                            borderRadius: "8px",
                            background: "#1E6BDD",
                          }}
                        >
                          <div className="col-auto px-1">
                            <Image
                              src={reportAnalysis}
                              alt="reportAnalysis"
                              width={32}
                              height={32}
                            />
                          </div>
                          <div className="col-auto px-1">
                            Report
                            <br />
                            Analysis
                          </div>
                        </Button>
                      }
                      body={
                        <>
                          <div
                            className="container-fluid border-0 p-1"
                            style={{
                              height: "100%",
                              overflow: "scroll",
                            }}
                          >
                            <ReportAnalysis />
                          </div>
                        </>
                      }
                    />
                  </div>
                )} */}
                {role !== "Special Role" && (
                  <div className="col-auto p-1">
                    <Link
                      target="_blank"
                      href="/report-analysis"
                      className="row d-flex flex-nowrap justify-content-center m-0 btn w-100 text-white fw-normal fs12px py-3 px-0"
                      style={{
                        borderRadius: "8px",
                        background: `${dashboardType ? "#155E95" : "#1E6BDD"}`,
                        transition: "all .3s",
                      }}
                    >
                      <div className="col-auto px-1">
                        <Image
                          src={reportAnalysis}
                          alt="reportAnalysis"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="col-auto px-1">
                        Report
                        <br />
                        Analysis
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {role !== "Special Role" && (
              <div
                className="col mb-2 shadow-sm fs14px p-2"
                style={{
                  background: "#C6D9F1",
                  borderRadius: "10px",
                  color: "#334155",
                }}
              >
                <CustomModal
                  size="xl"
                  modalId="approvedCost"
                  button={
                    <Button
                      className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                      style={{ background: "rgba(235, 239, 253, 1)" }}
                    >
                      <div className="row d-flex m-0">
                        <div className="col text-start fw-5">Approved Cost</div>{" "}
                        <div className="col fw-normal text-end pe-3">
                          {data
                            ? formatAmountWithCommas(data?.approvedCost)
                            : 0}{" "}
                          M
                        </div>
                      </div>
                    </Button>
                  }
                  body={
                    <div
                      className={`container-fluid p-4 ${montserrat.className}`}
                      style={{
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255,.75)",
                      }}
                    >
                      <div className="row d-flex justify-content-center m-0">
                        <div className="col mb-4">
                          <div
                            className="col shadow d-flex bg-white"
                            style={{
                              borderRadius: "12px",
                              padding: "20px 28px 10px 28px",
                            }}
                          >
                            <Image
                              src={divideCircle}
                              alt="divideCircle"
                              width={64}
                              height={64}
                              className="mt-2"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <div className="col mb-4">
                              <p
                                className="m-0 fw-normal text-nowrap"
                                style={{ fontSize: "2.125rem" }}
                              >
                                7409
                              </p>
                              <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                                Total Scheme
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col mb-4">
                          <div
                            className="col shadow d-flex bg-white"
                            style={{
                              borderRadius: "12px",
                              padding: "20px 28px 10px 28px",
                            }}
                          >
                            <Image
                              src={originalAllocationCircle}
                              alt="originalAllocationCircle"
                              width={64}
                              height={64}
                              className="mt-2"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <div className="col mb-4">
                              <p
                                className="m-0 fw-normal text-nowrap"
                                style={{ fontSize: "2.125rem" }}
                              >
                                842.00 B
                              </p>
                              <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                                Original Allocation
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col mb-4">
                          <div
                            className="col shadow d-flex bg-white"
                            style={{
                              borderRadius: "12px",
                              padding: "20px 28px 10px 28px",
                            }}
                          >
                            <Image
                              src={revisedAllocationCircle}
                              alt="revisedAllocationCircle"
                              width={64}
                              height={64}
                              className="mt-2"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <div className="col mb-4">
                              <p
                                className="m-0 fw-normal text-nowrap"
                                style={{ fontSize: "2.125rem" }}
                              >
                                842.00 B
                              </p>
                              <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                                Revised Allocation
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col mb-4">
                          <div
                            className="col shadow d-flex bg-white"
                            style={{
                              borderRadius: "12px",
                              padding: "20px 28px 10px 28px",
                            }}
                          >
                            <Image
                              src={pndReleaseCircle}
                              alt="pndReleaseCircle"
                              width={64}
                              height={64}
                              className="mt-2"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <div className="col mb-4">
                              <p
                                className="m-0 fw-normal text-nowrap"
                                style={{ fontSize: "2.125rem" }}
                              >
                                514.64 B
                              </p>
                              <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                                P&D Release
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col mb-4">
                          <div
                            className="col shadow d-flex bg-white"
                            style={{
                              borderRadius: "12px",
                              padding: "20px 28px 10px 28px",
                            }}
                          >
                            <Image
                              src={controllingReleaseCircle}
                              alt="controllingReleaseCircle"
                              width={64}
                              height={64}
                              className="mt-2"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <div className="col mb-4">
                              <p
                                className="m-0 fw-normal text-nowrap"
                                style={{ fontSize: "2.125rem" }}
                              >
                                498.07 B
                              </p>
                              <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                                Controlling Release
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col mb-4">
                          <div
                            className="col shadow d-flex bg-white"
                            style={{
                              borderRadius: "12px",
                              padding: "20px 28px 10px 28px",
                            }}
                          >
                            <Image
                              src={spendingReleaseCircle}
                              alt="spendingReleaseCircle"
                              width={64}
                              height={64}
                              className="mt-2"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <div className="col mb-4">
                              <p
                                className="m-0 fw-normal text-nowrap"
                                style={{ fontSize: "2.125rem" }}
                              >
                                472.76 B
                              </p>
                              <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                                Spending Release
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-auto mb-4">
                          <div
                            className="col shadow d-flex bg-white "
                            style={{
                              borderRadius: "12px",
                              padding: "20px 28px 10px 28px",
                            }}
                          >
                            <Image
                              src={utilizationCircle}
                              alt="utilizationCircle"
                              width={64}
                              height={64}
                              className="mt-2"
                            />
                            &nbsp;&nbsp;&nbsp;
                            <div className="col mb-4">
                              <p
                                className="m-0 fw-normal text-nowrap"
                                style={{ fontSize: "2.125rem" }}
                              >
                                249.86 B
                              </p>
                              <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                                Utilization
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />

                <div
                  className="col p-2 rounded-2 mb-2"
                  style={{ background: "rgba(235, 239, 253, 1)" }}
                >
                  <div className="row d-flex m-0">
                    <div className="col fw-5 text-start">Expenditure</div>
                    <div className="col fw-normal text-end pe-3">
                      {data ? formatAmountWithCommas(data?.expenditure) : 0} M
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className="col mb-2 shadow-sm fs14px"
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "15px 15px 15px 15px",
              }}
            >
              <p
                className="mb-2 fw-5 pb-1"
                style={{ borderBottom: "1px dashed #97ABBD" }}
              >
                Project Status
              </p>
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Approved"
                button={
                  <Button
                    onClick={() => getProjectsList("Approved")}
                    className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                    style={{ background: "rgba(235, 239, 253, 1)" }}
                  >
                    <div className="row d-flex m-0">
                      <div className="col fw-5 text-start">Approved</div>{" "}
                      <div className="col fw-normal text-end pe-3 text-success">
                        {data ? (
                          <AnimatedCounter from={0} to={data.approved} />
                        ) : (
                          0
                        )}
                      </div>
                    </div>
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="Approved Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Unapproved"
                button={
                  <Button
                    onClick={() => getProjectsList("Un-Approved")}
                    className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                    style={{ background: "rgba(235, 239, 253, 1)" }}
                  >
                    <div className="row d-flex m-0">
                      <div className="col fw-5 text-start">Unapproved</div>{" "}
                      <div className="col fw-normal text-end pe-3 text-danger">
                        {data ? (
                          <AnimatedCounter from={0} to={data.unapproved} />
                        ) : (
                          0
                        )}
                      </div>
                    </div>
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="Unapproved Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Dropped"
                button={
                  <Button
                    onClick={() => getProjectsList("Dropped")}
                    className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                    style={{ background: "rgba(235, 239, 253, 1)" }}
                  >
                    <div className="row d-flex m-0">
                      <div className="col fw-5 text-start">Dropped</div>{" "}
                      <div className="col fw-normal text-end pe-3 text-secondary">
                        {data ? (
                          <AnimatedCounter from={0} to={data.dropped} />
                        ) : (
                          0
                        )}
                      </div>
                    </div>
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="Dropped Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <div className="row m-0" style={{ gap: 10 }}>
                <CustomModal
                  isFullscreen={true}
                  size="xl"
                  modalId="Umbrella"
                  button={
                    <Button
                      onClick={() => getProjectsList("umbralla")}
                      className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                      style={{ background: "rgba(235, 239, 253, 1)" }}
                    >
                      <div className="row d-flex m-0">
                        <div className="col fw-5 text-start">Umbrella</div>
                        <div className="col fw-normal text-end pe-3 text-secondary">
                          {data ? (
                            <AnimatedCounter from={0} to={data.umbralla} />
                          ) : (
                            0
                          )}
                        </div>
                      </div>
                    </Button>
                  }
                  body={
                    <>
                      <div className="container-fluid border-0 p-1">
                        {projectsData && filteredCMADPKeys ? (
                          <ProjectsTable
                            rowCountOptions={rowCountOptions}
                            districtOptions={districtOptions}
                            sectorOptions={sectorOptions}
                            userOptions={userOptions}
                            keys={filteredCMADPKeys}
                            label="Umbrella Projects"
                            projectsData={projectsData}
                            setProjectsData={setProjectsData}
                            allowLink={false}
                            role={""}
                          />
                        ) : (
                          <Loader />
                        )}
                      </div>
                    </>
                  }
                />
                <CustomModal
                  isFullscreen={true}
                  size="xl"
                  modalId="single"
                  button={
                    <Button
                      onClick={() => getProjectsList("single")}
                      className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                      style={{ background: "rgba(235, 239, 253, 1)" }}
                    >
                      <div className="row d-flex m-0">
                        <div className="col fw-5 text-start">Single</div>
                        <div className="col fw-normal text-end pe-3 text-secondary">
                          {data ? (
                            <AnimatedCounter from={0} to={data.single} />
                          ) : (
                            0
                          )}
                        </div>
                      </div>
                    </Button>
                  }
                  body={
                    <>
                      <div className="container-fluid border-0 p-1">
                        {projectsData && filteredCMADPKeys ? (
                          <ProjectsTable
                            rowCountOptions={rowCountOptions}
                            districtOptions={districtOptions}
                            sectorOptions={sectorOptions}
                            userOptions={userOptions}
                            keys={filteredCMADPKeys}
                            label="Single Projects"
                            projectsData={projectsData}
                            setProjectsData={setProjectsData}
                            allowLink={false}
                            role={""}
                          />
                        ) : (
                          <Loader />
                        )}
                      </div>
                    </>
                  }
                />
              </div>
            </div>

            <div
              className={`col shadow-sm fs14px ${lexend.className}`}
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "15px 15px 15px 15px ",
                color: "#334155",
              }}
            >
              <p className="col fw-5 mb-2">Project Cost Slab</p>
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="0.1M"
                button={
                  <Button
                    className="btn w-100 p-0"
                    onClick={() => getProjectsList("0to200")}
                  >
                    <FinancialSlab
                      projectCategory="DDC"
                      initialLimitLabel="0.1M"
                      endLimitLabel="Up to 200M"
                      value={data ? data.a0to200 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="0.1M to Up to 200M DDC Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Above200M"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("201to400")}
                  >
                    <FinancialSlab
                      projectCategory="DDWP"
                      initialLimitLabel="Above 200M"
                      endLimitLabel="Up to 400M"
                      value={data ? data.a200to400 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="Above 200M to Up to 400M DDWP Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Above400M"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("401to800")}
                  >
                    <FinancialSlab
                      projectCategory="DDSC"
                      initialLimitLabel="Above 400M"
                      endLimitLabel="Up to 800M"
                      value={data ? data.a400to800 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="Above 400M Up to 800M DDSC Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Above800M"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("801to1000")}
                  >
                    <FinancialSlab
                      projectCategory="PDWP"
                      initialLimitLabel="Above 800M"
                      endLimitLabel="Up to 10B"
                      value={data ? data.a800to1000 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="Above 800M to upto 10B PDWP Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="10Billion"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("1001Above")}
                  >
                    <FinancialSlab
                      projectCategory="CDWP"
                      initialLimitLabel="10 Billion"
                      endLimitLabel="or Above"
                      value={data ? data.a800to1000 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredCMADPKeys ? (
                        <ProjectsTable
                          rowCountOptions={rowCountOptions}
                          districtOptions={districtOptions}
                          sectorOptions={sectorOptions}
                          userOptions={userOptions}
                          keys={filteredCMADPKeys}
                          label="10 Billion or above CDWP Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                          role={""}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </>
    </DashboardWrapper>
  );
};

export default Dashboard;

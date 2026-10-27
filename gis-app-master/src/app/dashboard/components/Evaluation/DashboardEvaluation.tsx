"use client";
import { EVALUATION_MAIN_DASHBOARD_API, EVALUATION_MAIN_DASHBOARD } from "@/services/endpoints";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal/CustomModal";
import DashboardWrapper from "@/app/dashboard/components/DashboardWrapper";
import Loader from "@/components/Loader/Loader";
import { setContent } from "@/store/contentSlice";
import { setTutorial } from "@/store/tutorialSlice";
import apiClient, { AxiosError } from "@/services/client";
import { devMap } from "@/utils";
import { getSession } from "@/utils/session";
import dynamic from "next/dynamic";
import { lexend } from "@/styles/fonts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import EvaluationMap from "../GoogleMap/EvaluationMap";
import PCIVReportReview from "./PCIVReportReview";
import ProjectsTable from "./ProjectsTable/ProjectsTable";
import { EvaluationMainDashboard, ProjectsList } from "./types";
import styles from "./DashboardEvaluation.module.css";
import { FilterData } from "../../types";

const Menu = dynamic(() => import("@/components/Menu"), { ssr: false });

const DashboardEvaluation = () => {
  const [data, setData] = useState<EvaluationMainDashboard>();
  const [role, setRole] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<number>();
  const dispatch = useDispatch();

  useEffect(() => {
    const userRole = getSession("role");
    const departmentId = getSession("departmentId");
    if (userRole) setRole(userRole);
    if (departmentId) setDepartmentId(parseInt(departmentId));
  }, []);

  const handleButtonClick = (content: string, tutorialLink: string) => {
    dispatch(setContent(content));
    dispatch(setTutorial(tutorialLink));
  };

  useEffect(() => {
    handleButtonClick(
      "https://www.youtube.com/watch?v=1wgAwCufsko&ab_channel=DirectorateGeneralMonitoringandEvaluation",
      "dashboard",
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

  useEffect(() => {
    setCombinedFilters(
      activeFilter === "cmInitiative"
        ? [...cmInitiativeFilters, ...otherFilters]
        : [...adpFilters, ...otherFilters],
    );
  }, [activeFilter]);

  const handleFilterChange = (filterType: "cmInitiative" | "adp") => {
    setActiveFilter(filterType);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const isSecretary =
      getSession("role")?.toLowerCase() === "administrative secretary";
    try {
      const response = await apiClient.post(
        `${isSecretary ? EVALUATION_MAIN_DASHBOARD : EVALUATION_MAIN_DASHBOARD_API}/dashboard`,
      );
      setData(response.data.data);
      setLoading(false);
    } catch (err) {
      toast.error((err as AxiosError).message);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  const [projectsData, setProjectsData] = useState<ProjectsList[]>();

  const getProjectsList = async (status: string) => {
    setProjectsData([]);
    try {
      const response = await apiClient.get(
        `${EVALUATION_MAIN_DASHBOARD_API}/GetProjectsListByStatus?filter=${status}`,
      );
      setProjectsData(response.data.data);
    } catch (err) {
      toast.error((err as AxiosError).message);
    }
  };

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

  const filteredSubmittedPcIvKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "gsNo",
          "name",
          "sectorName",
          "cost",
          "sponsoringAgencyName",
          "executingAgencyName",
          "city",
          "divisionName",
          "districtName",
          "isSNE",
        ].includes(key),
      )
      .map((key) => key as keyof ProjectsList);

  const filteredOtherKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "gsNo",
          "name",
          "userName",
          "sectorName",
          "cost",
          "sponsoringAgencyName",
          "executingAgencyName",
          "city",
          "divisionName",
          "districtName",
          "isSNE",
        ].includes(key),
      )
      .map((key) => key as keyof ProjectsList);

  const otherFilteredKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "name",
          "gsNo",
          "sectorId",
          "sectorName",
          "visitStartDate",
          "visitEndDate",
          "cost",
          "userName",
          "designation",
          "visitId",
          "approvalDate",
          "sponsoringAgencyName",
          "sponsring_agency_id",
          "executingAgencyName",
          "executing_agency_id",
          "city",
          "division_Id",
          "divisionName",
          "districtId",
          "districtName",
          "isSNE",
          "isPCIVSubmitted",
          "pcivSubmittedDate",
          "status",
          "visitCount",
          "maxMRIValue",
          "avgMRIValue",
          "hasVisited",
        ].includes(key),
      )
      .map((key) => key as keyof ProjectsList);

  return (
    <DashboardWrapper>
      {(departmentId === 0 || departmentId === 1) && (
        <div className={styles.wrapper}>
          <div className={`row ${lexend.className} m-0`}>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                modalId={"TotalProject"}
                button={
                  <Button
                    className="position-relative btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("all")}
                  >
                    <div
                      className={`position-absolute ${styles.buttonOverlay}`}
                    ></div>
                    <Menu
                      background="linear-gradient(to right, #155E95 , #2377B6)"
                      icon="/icons/eyeBold.svg"
                      value={data ? data.totalSubmittedPCIvs : 0}
                      label="PC(IV) Submitted by Department"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                      isGrouped={false}
                      toggleLabel={true}
                      sneCount={data ? data.snEs : 0}
                      nonSneCount={data ? data.nonSNEs : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="PC(IV) Submitted by Department"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"inprogress"}
                allowOpen={false}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("inprogress")}
                    disabled
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.pCivInProgress : 0}
                      label="PC(IV) In Progress"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="PC(IV) In Progress"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"inprogress"}
                allowOpen={false}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("inprogress")}
                    disabled
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.assignedToEvaluator : 0}
                      label="Assigned To Evaluator"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="Assigned To Evaluator"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"inprogress"}
                allowOpen={false}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("inprogress")}
                    disabled
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.refferBackPcIV : 0}
                      label="Refer Back"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="Refer-back"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col p-0 pe-1">
              <Link
                href="/charts"
                target="_blank"
                className="shadow-none w-100 position-relative text-decoration-none"
              >
                <div
                  className={`text-white shadow-sm text-center fs14px fw-5 ${styles.chartsCard}`}
                >
                  <div className="position-relative h-100">
                    <div className={styles.chartsArrow}>
                      <img
                        src="/icons/linkArrow.svg"
                        className={`img-fluid ${styles.chartsArrowIcon}`}
                        alt="linkArrow"
                      />
                    </div>
                    <span className="h-100 d-block d-flex align-items-center justify-content-center">
                      View Charts
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            {(role.toLowerCase().includes("director") ||
              role.toLowerCase() === "department head") && (
              <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
                <PCIVReportReview />
              </div>
            )}
          </div>

          <div className={`row ${lexend.className} m-0`}>
            <div className="col-12 col-sm-6 col-md-6 col-lg-4 p-0">
              <div
                className={`col px-1 py-0 me-1 text-center mb-2 ${styles.evaluatedGroup}`}
              >
                <p className="mb-0 text-white fs14px">Projects Evaluated</p>
                <div className="row m-0 d-flex flex-nowrap">
                  <CustomModal
                    HeaderRightPos={0}
                    HeaderTopPos={17}
                    buttonColumn="col p-0"
                    isFullscreen={true}
                    modalId={"umbrella"}
                    button={
                      <Button
                        className="position-relative btn p-0 pe-1 shadow-none w-100"
                        onClick={() => getProjectsList("umbrella")}
                      >
                        <div
                          className={`position-absolute ${styles.buttonOverlay}`}
                        ></div>
                        <Menu
                          background={`linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))`}
                          icon="/icons/cubes.svg"
                          value={
                            data ? data.noOfVisitsMultipleSitesOrUmbrella : 0
                          }
                          label="No. of Visits (Umbrella)"
                          showTides={false}
                          showArrow={true}
                          textWrap={false}
                          isGrouped={true}
                          toggleLabel={true}
                          sneCount={
                            data
                              ? data.noOfVisitsMultipleSitesOrUmbrellaTotalSNEs
                              : 0
                          }
                          nonSneCount={
                            data
                              ? data.noOfVisitsMultipleSitesOrUmbrellaTotalNonSNEs
                              : 0
                          }
                        />
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-0">
                          {projectsData && filteredOtherKeys ? (
                            <ProjectsTable
                              role={role}
                              keys={filteredOtherKeys}
                              label="No. of Visits (Umbrella)"
                              projectsData={projectsData}
                              setProjectsData={setProjectsData}
                            />
                          ) : (
                            <Loader />
                          )}
                        </div>
                      </>
                    }
                  />
                  <CustomModal
                    HeaderRightPos={0}
                    HeaderTopPos={17}
                    buttonColumn="col p-0"
                    isFullscreen={true}
                    modalId={"single"}
                    button={
                      <Button
                        className="position-relative btn p-0 pe-1 shadow-none w-100"
                        onClick={() => getProjectsList("single")}
                      >
                        <div
                          className={`position-absolute ${styles.buttonOverlay}`}
                        ></div>
                        <Menu
                          background={`linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))`}
                          icon="/icons/cubes.svg"
                          value={data ? data.noOfVisitsSingle : 0}
                          label="No. of Visits (Single)"
                          showTides={false}
                          showArrow={true}
                          textWrap={false}
                          isGrouped={true}
                          toggleLabel={true}
                          sneCount={data ? data.noOfVisitsSingleTotalSNEs : 0}
                          nonSneCount={
                            data ? data.noOfVisitsSingleTotalNonSNEs : 0
                          }
                        />
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-0">
                          {projectsData && filteredOtherKeys ? (
                            <ProjectsTable
                              role={role}
                              keys={filteredOtherKeys}
                              label="No. of Visits (Single)"
                              projectsData={projectsData}
                              setProjectsData={setProjectsData}
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
            <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"successful"}
                allowOpen={data && data.successful === 0 ? false : true}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("successful")}
                    disabled={data && data.successful === 0}
                  >
                    <Menu
                      background="rgba(39, 192, 77, 0.35)"
                      outline="1px solid rgba(43, 171, 45, 0.4)"
                      icon="/icons/doubleTick.svg"
                      value={data ? data.successful : 0}
                      label="Successful"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                      labelColor="#129E5C"
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredOtherKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredOtherKeys}
                          label="Successful Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"partial"}
                allowOpen={
                  data && data.partiallySuccessful === 0 ? false : true
                }
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("partial")}
                    disabled={data && data.partiallySuccessful === 0}
                  >
                    <Menu
                      background="rgba(218, 248, 21, 0.4)"
                      outline="1px solid rgba(225, 186, 15, 0.4)"
                      icon="/icons/bulb.svg"
                      value={data ? data.partiallySuccessful : 0}
                      label="Partial Success"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                      labelColor="#AA8B2A"
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredOtherKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredOtherKeys}
                          label="Partial Success Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"notsuccessful"}
                allowOpen={data && data.notSuccessful === 0 ? false : true}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("notsuccessful")}
                    disabled={data && data.notSuccessful === 0}
                  >
                    <Menu
                      background="rgba(233, 12, 16, 0.26)"
                      outline="1px solid rgba(233, 12, 16, 0.4)"
                      icon="/icons/critical.svg"
                      value={data ? data.notSuccessful : 0}
                      label="Not Successful"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                      labelColor="#BA2323"
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredOtherKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredOtherKeys}
                          label="Not Successful Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"inprogress"}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("inprogress")}
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.reportsInProgress : 0}
                      label="Reports In Progress"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="Reports In Progress"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
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

          <div className={`${lexend.className}`}>
            <div className="p-1 col">
              {devMap && data && (
                <EvaluationMap
                  data={data}
                  handleSubmit={handleSubmit}
                  activeFilter={activeFilter}
                  cmInitiativeFilters={cmInitiativeFilters}
                  adpFilters={adpFilters}
                  otherFilters={otherFilters}
                  setOtherFilters={setOtherFilters}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {role.toLowerCase() === "administrative secretary" && (
        <div className={styles.wrapper}>
          <div className={`row ${lexend.className} m-0`}>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                modalId={"TotalProject"}
                button={
                  <Button
                    className="position-relative btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("all")}
                  >
                    <div
                      className={`position-absolute ${styles.buttonOverlay}`}
                    ></div>
                    <Menu
                      background="linear-gradient(to right, #155E95 , #2377B6)"
                      icon="/icons/eyeBold.svg"
                      value={data ? data.totalSubmittedPCIvs : 0}
                      label="Total PC(IV)s"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                      isGrouped={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="Total PC(IV)s"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"inprogress"}
                allowOpen={false}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("inprogress")}
                    disabled
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.pCivInProgress : 0}
                      label="Submitted To DGM&E"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="Submitted To DGM&E"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"inprogress"}
                allowOpen={false}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("inprogress")}
                    disabled
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.assignedToEvaluator : 0}
                      label="In Progress"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="In Progress"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
            <div className="col p-0">
              <CustomModal
                HeaderRightPos={0}
                HeaderTopPos={17}
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"inprogress"}
                allowOpen={false}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("inprogress")}
                    disabled
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/inProcess.svg"
                      value={data ? data.pCivInProgress : 0}
                      label="Take-up for Evalution"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-0">
                      {projectsData && filteredSubmittedPcIvKeys ? (
                        <ProjectsTable
                          role={role}
                          keys={filteredSubmittedPcIvKeys}
                          label="Take-up for Evalution"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
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
          <div className={`row ${lexend.className} m-0`}>
            <div className="col p-0 pe-1">
              <Link
                href="/pc-iv-referback-review"
                target="_blank"
                className="shadow-none w-100 position-relative text-decoration-none"
              >
                <Menu
                  background="rgba(12, 140, 233, 0.2)"
                  outline="1px solid rgba(12, 140, 233, 0.4)"
                  icon="/icons/reportReview.svg"
                  value={0}
                  label="Referback"
                  showTides={false}
                  showArrow={true}
                  textWrap={false}
                />
              </Link>
            </div>
            <div className="col p-0 pe-1">
              <Link
                href="/pc-iv-attached-review"
                target="_blank"
                className="shadow-none w-100 position-relative text-decoration-none"
              >
                <Menu
                  background="rgba(12, 140, 233, 0.2)"
                  outline="1px solid rgba(12, 140, 233, 0.4)"
                  icon="/icons/reportReview.svg"
                  value={0}
                  label="Submitted by Attached Dept."
                  showTides={false}
                  showArrow={true}
                  textWrap={false}
                />
              </Link>
            </div>
          </div>

          <div className={`${lexend.className}`}>
            <div className="p-1 col">
              {devMap && data && (
                <EvaluationMap
                  data={data}
                  handleSubmit={handleSubmit}
                  activeFilter={activeFilter}
                  cmInitiativeFilters={cmInitiativeFilters}
                  adpFilters={adpFilters}
                  otherFilters={otherFilters}
                  setOtherFilters={setOtherFilters}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  );
};

export default DashboardEvaluation;

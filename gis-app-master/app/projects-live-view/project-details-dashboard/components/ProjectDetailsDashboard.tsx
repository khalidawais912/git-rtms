"use client";

import { useEffect, useState } from "react";
// import DistributedColumnChart from "./DistributedColumnChart";
import Reports from "./Reports";
// import SimplePieChart from "./SimplePieChart";
// import Menu from "./Menu";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
// import SimpleLineChart from "./SimpleLineChart";
// import WBSReportUpdated from "./WBSReportUpdated";
import dynamic from "next/dynamic";
import { IoWifi } from "react-icons/io5";
import ExecutiveSummary from "./ExecutiveSummary";
import ProjectLocationMap from "./GoogleMap/ProjectLocationMap";
import MRIStatus from "./MRIStatus";
import Progress from "./Progress";
import DistributedColumnChartScaled from "./Scaled/DistributedColumnChartScaled";
import ExecutiveSummaryScaled from "./Scaled/ExecutiveSummaryScaled";
import MRIStatusScaled from "./Scaled/MRIStatusScaled";
import ProgressScaled from "./Scaled/ProgressScaled";
import ReportsScaled from "./Scaled/ReportsScaled";
import SimpleLineChartScaled from "./Scaled/SimpleLineChartScaled";
import SimplePieChartScaled from "./Scaled/SimplePieChartScaled";
import VideoPreviewScaled from "./Scaled/VideoPreviewScaled";
import WorkInProgressScaled from "./Scaled/WorkInProgressScaled";
import VideoPreview from "./VideoPreview";
import VideoTypeFilter from "./VideoTypeFilter";
import WorkInProgress from "./WorkInProgress";

const DistributedColumnChart = dynamic(
  () => import("./DistributedColumnChart"),
  { ssr: false },
);

const SimplePieChart = dynamic(() => import("./SimplePieChart"), {
  ssr: false,
});

const WBSReportUpdated = dynamic(() => import("./WBSReportUpdated"), {
  ssr: false,
});

const SimpleLineChart = dynamic(() => import("./SimpleLineChart"), {
  ssr: false,
});

export interface VehicleTrackings {
  visitId: number;
  projectName: string;
  officerName: string;
  officerPicture: string;
  vehicalNumber: string;
  vehicalPicture: string;
  driverName: string;
  driverPicture: string;
  startingDistrict: string;
  endDistrict: string;
  startLat: string;
  endLat: string;
  startLong: string;
  endLong: string;
  visitStatus: string;
}

export interface StaffTrackings {
  userId: number;
  userName: string;
  designation: string;
  phoneNumber: string;
  userPicture: string;
  projectName: string;
  districtName: string;
  planStartDate: string;
  planEndDate: string;
  visitStartTime: string;
  visitEndTime: string;
  carNumber: string;
  carPicture: string;
  driverName: string;
  status: string;
  startAddressLat: string;
  startAddressLong: string;
  endAddressLat: string;
  endAddressLong: string;
  coordinates: [
    {
      id: number;
      visitID: number;
      userID: number;
      latitude: string;
      longitude: string;
      visit_status: string;
      createdAt: string;
    },
  ];
}

export interface ReportsData {
  reportPath: string;
}

export interface Attributes {
  attributeId: number;
  attributeDataType: string;
  multiselect: number;
  label: string;
  validationRegx: string;
  min: number;
  max: number;
  required: number;
  status: number;
  hidden: number;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
  attributeType: string;
  unit: string;
  parentId: number;
  errorMessage: string;
  verificationContent: string;
  verificatioContentPath: string;
  verificationType: string;
  options: [
    {
      id: number;
      attributeId: number;
      value: string;
      sortId: number;
      isActive: number;
      createdAt: string;
      updatedAt: string;
      label: string;
    },
  ];
  value: string;
  values: [
    {
      id: number;
      attributeId: number;
      attributeGrpId: number;
      projectId: number;
      visitId: number;
      value: string;
      createdAt: string;
      updatedAt: string;
      verificatioContentPath: string;
      weightage: number;
      remarks: string;
      latitude: string;
      longitude: string;
    },
  ];
  evaluationFormula: string;
  evaluationFormulaWeightage: number;
  remarks: string;
  weightage: number;
  readOnly: number;
  sortId: number;
  attributeCode: string;
  smdpIdentifier: string;
}

export interface Groups {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  group: Groups[];
  attributes: Attributes[];
}

export interface DetailedAnalysis {
  attributeName: string;
  visitDate: string;
  officerName: string;
  location: string;
  contractorName: string;
  reName: string;
  actualPlannedProject: string;
  actualFinancialProgress: string;
  actualPhysicalProgress: string;
  overallEarnValue: string;
}

export interface SingleProjectDashboard {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
  groups: Groups[];
  vehicalTrackings: VehicleTrackings[];
  staffTrackings: StaffTrackings[];
  accumulativePC1Cost: number;
  is_Contractor: number;
  is_ResidentEngineer: number;
  is_Tpv: number;
  reports: {
    reportPath: string;
  }[];
  reportsCount: number;
  detailAnalysis: DetailedAnalysis[];
}

interface Props {
  data: SingleProjectDashboard;
}

const ProjectDetailsDashboard = ({ data }: Props) => {
  const [projectRating, setProjectRating] = useState<number>(0);
  const [cpi, setCpi] = useState<number>(0);
  const [spi, setSpi] = useState<number>(0);

  // const dispatch = useDispatch();
  // useAuthorization("project-details-dashboard");

  const getCPIAndSPI = () => {
    if (data) {
      const spi: string | undefined = data?.groups
        .find((group) => group.name === "Earned Value Analysis")
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes("spi"),
        )?.values[0]?.value;

      const cpi: string | undefined = data?.groups
        .find((group) => group.name === "Earned Value Analysis")
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes("cpi"),
        )?.values[0]?.value;

      if (cpi) {
        setCpi(parseFloat(cpi));
      }
      if (spi) {
        setSpi(parseFloat(spi));
      }
    }
  };

  const searchMonitoringRatingIndex = (
    parentGroupName: string,
    groupName: string,
    attributeName: string,
  ) => {
    if (data) {
      const value = data.groups
        .find((group) => group.name.toLowerCase().includes(parentGroupName))
        ?.group.find((group) => group.name.toLowerCase().includes(groupName))
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes(attributeName),
        )?.values[0]?.value;
      if (value) {
        return parseInt(value);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setProjectRating(
        searchMonitoringRatingIndex(
          "rating index",
          "performance",
          "project rating",
        )!,
      );
      getCPIAndSPI();
    }
  }, [data]);

  // const handleButtonClick = (content: string, tutorialLink: string) => {
  //   dispatch(setContent(content));
  //   dispatch(setTutorial(tutorialLink));
  // };

  // useEffect(() => {
  //   handleButtonClick(
  //     "projectDetailsDashboard",
  //     "https://www.youtube.com/watch?v=PDHSsWfMhNM&ab_channel=DirectorateGeneralMonitoringandEvaluation"
  //   );
  // }, []);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  useEffect(() => {
    if (data) {
      const filteredAttributes = data.groups.find((group) =>
        group.name?.toLowerCase().includes("progress analysis"),
      )?.attributes[5];

      console.log("Filtered attributes: ", filteredAttributes);
      console.log(
        "lowercase attributes:",
        filteredAttributes?.label.toLowerCase(),
      );
      console.log(
        "lowercase attributes trim:",
        filteredAttributes?.label.trim().toLowerCase(),
      );
      console.log(
        "decimal value",
        parseFloat(filteredAttributes?.values[0]?.value!),
      );
    }
  }, [data]);

  // useEffect(() => {
  //   if (data) {
  //     const wbsData = data.groups.filter((group) =>
  //       group.name.toLowerCase().includes("work breakdown structure")
  //     );

  //     const filteredAttributes = data.groups.find((group) =>
  //       group.name?.toLowerCase().includes("progress analysis")
  //     )?.attributes[5];
  //   }
  // }, [data]);

  return (
    <div
      className="row m-0"
      style={
        {
          // transform: "scale(19.2)",
          // transformOrigin: "top left",
          // overflow: "visible",
        }
      }
    >
      <div
        className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3"
        style={{ padding: "9px 3.5px" }}
      >
        <div className="d-flex flex-column" style={{ gap: "5px" }}>
          <CustomModal
            buttonColumn="col p-0 w-100"
            size="lg"
            modalId="pieBarChart"
            HeaderRightPos={20}
            HeaderTopPos={5}
            button={<ExecutiveSummary data={data} />}
            body={
              <div className="m-0">
                <ExecutiveSummaryScaled data={data} />
              </div>
            }
          />
          <CustomModal
            buttonColumn="col p-0"
            size="xl"
            modalId="pieBarChart"
            HeaderRightPos={20}
            HeaderTopPos={5}
            button={
              <Button className="btn w-100 bg-transparent p-0 shadow-none">
                <SimpleLineChart data={data} />
              </Button>
            }
            body={
              <div className="m-0">
                <SimpleLineChartScaled data={data} />
              </div>
            }
          />

          <CustomModal
            buttonColumn="col p-0"
            size="lg"
            modalId="pieBarChart"
            HeaderRightPos={20}
            HeaderTopPos={5}
            animation="slide-right"
            button={<WorkInProgress />}
            body={
              <div className="m-0">
                <WorkInProgressScaled />
              </div>
            }
          />
        </div>
      </div>
      <div
        className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-5"
        style={{ padding: "9px 3.5px" }}
      >
        <div className="d-flex flex-column" style={{ gap: "8px" }}>
          <CustomModal
            buttonColumn="col p-0"
            size="xl"
            modalId="VideoPreview"
            HeaderRightPos={20}
            HeaderTopPos={5}
            button={
              <Button className="btn w-100 bg-transparent p-0 shadow-none">
                <VideoPreview data={data} />
              </Button>
            }
            body={
              <div className="m-0">
                <VideoPreviewScaled data={data} />
              </div>
            }
          />

          <div
            className="col"
            style={{
              background: "#1D1F25",
              padding: "5px",
              borderRadius: "9px",
            }}
          >
            <p
              className="fw-bold fs12px text-center"
              style={{ color: "#37B5EF", marginBottom: "5px" }}
            >
              {data.name}
            </p>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ marginBottom: "5px" }}
            >
              <p className="m-0 fw-bold fs10px text-white">
                Drone Videos & Live Stream
              </p>
              <VideoTypeFilter />
            </div>

            <div
              className="row d-flex justify-content-between m-0"
              style={{ gap: "9px" }}
            >
              <div className="col p-0">
                <div
                  className="position-relative overflow-hidden"
                  style={{ borderRadius: "7px", height: "122px" }}
                >
                  <video
                    className="w-100 h-100 overflow-hidden"
                    style={{
                      objectFit: "cover",
                      borderBottomLeftRadius: "7px",
                      borderBottomRightRadius: "7px",
                    }}
                    muted
                  >
                    <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div
                    className="position-absolute text-white"
                    style={{
                      top: "7px",
                      right: "7px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    <p className="m-0 fs7px fw-normal">10-jul-2025</p>
                  </div>
                  <div
                    className="position-absolute text-white"
                    style={{
                      top: "7px",
                      left: "7px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "3px" }}
                    >
                      <IoWifi size={12} />
                      <span className="fw-5 fs8px">24</span>
                    </div>
                  </div>
                  <div
                    className="position-absolute w-100"
                    style={{
                      top: "0px",
                      backgroundImage:
                        "linear-gradient(to top, rgba(0, 0, 0, 0) , rgba(0, 0, 0, 1))",
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      height: "36px",
                    }}
                  ></div>
                </div>
              </div>
              <div className="col p-0">
                <div
                  className="position-relative overflow-hidden"
                  style={{ borderRadius: "7px", height: "122px" }}
                >
                  <video
                    className="w-100 h-100 overflow-hidden"
                    style={{
                      objectFit: "cover",
                      borderBottomLeftRadius: "7px",
                      borderBottomRightRadius: "7px",
                    }}
                    muted
                  >
                    <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div
                    className="position-absolute text-white"
                    style={{
                      top: "7px",
                      right: "7px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    <p className="m-0 fs7px fw-normal">10-jul-2025</p>
                  </div>
                  <div
                    className="position-absolute text-white"
                    style={{
                      top: "7px",
                      left: "7px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "3px" }}
                    >
                      <IoWifi size={12} />
                      <span className="fw-5 fs8px">24</span>
                    </div>
                  </div>
                  <div
                    className="position-absolute w-100"
                    style={{
                      top: "0px",
                      backgroundImage:
                        "linear-gradient(to top, rgba(0, 0, 0, 0) , rgba(0, 0, 0, 1))",
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      height: "36px",
                    }}
                  ></div>
                </div>
              </div>
              <div className="col p-0">
                <div
                  className="position-relative overflow-hidden"
                  style={{ borderRadius: "7px", height: "122px" }}
                >
                  <video
                    className="w-100 h-100 overflow-hidden"
                    style={{
                      objectFit: "cover",
                      borderBottomLeftRadius: "7px",
                      borderBottomRightRadius: "7px",
                    }}
                    muted
                  >
                    <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div
                    className="position-absolute text-white"
                    style={{
                      top: "7px",
                      right: "7px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    <p className="m-0 fs7px fw-normal">10-jul-2025</p>
                  </div>
                  <div
                    className="position-absolute text-white"
                    style={{
                      top: "7px",
                      left: "7px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: "3px" }}
                    >
                      <IoWifi size={12} />
                      <span className="fw-5 fs8px">24</span>
                    </div>
                  </div>
                  <div
                    className="position-absolute w-100"
                    style={{
                      top: "0px",
                      backgroundImage:
                        "linear-gradient(to top, rgba(0, 0, 0, 0) , rgba(0, 0, 0, 1))",
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      height: "36px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-2"
        style={{ padding: "9px 3.5px" }}
      >
        <div className="d-flex flex-column" style={{ gap: "6.5px" }}>
          <CustomModal
            buttonColumn="col p-0"
            size="xl"
            modalId="DistributedColumnChart"
            HeaderRightPos={20}
            HeaderTopPos={5}
            button={
              <Button className="btn w-100 bg-transparent p-0 shadow-none">
                <DistributedColumnChart
                  data={data}
                  spi={spi}
                  cpi={cpi}
                  projectRating={projectRating}
                />
              </Button>
            }
            body={
              <div className="m-0">
                <DistributedColumnChartScaled
                  data={data}
                  spi={spi}
                  cpi={cpi}
                  projectRating={projectRating}
                />
              </div>
            }
          />
          <CustomModal
            buttonColumn="col p-0"
            size="sm"
            modalId="pieBarChart"
            HeaderRightPos={-10}
            HeaderTopPos={-10}
            button={
              <Button className="btn w-100 bg-transparent p-0 shadow-none">
                <Progress data={data} />
              </Button>
            }
            body={
              <div className="m-0">
                <ProgressScaled data={data} />
              </div>
            }
          />
          <CustomModal
            buttonColumn="col p-0"
            size="sm"
            modalId="pieBarChart"
            HeaderRightPos={-10}
            HeaderTopPos={-10}
            button={
              <Button className="btn w-100 bg-transparent p-0 shadow-none">
                <MRIStatus spi={spi} cpi={cpi} projectRating={projectRating} />
              </Button>
            }
            body={
              <div className="m-0">
                <MRIStatusScaled
                  spi={spi}
                  cpi={cpi}
                  projectRating={projectRating}
                />
              </div>
            }
          />
        </div>
      </div>
      <div
        className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-2"
        style={{ padding: "9px 3.5px" }}
      >
        <div className="d-flex flex-column" style={{ gap: "5px" }}>
          <CustomModal
            buttonColumn="col p-0"
            size="sm"
            modalId="pieBarChart"
            HeaderRightPos={-10}
            HeaderTopPos={-10}
            button={
              <Button className="btn w-100 bg-transparent p-0 shadow-none">
                <Reports
                  reports={data.reports}
                  observations={
                    data.groups.find(
                      (group) => group.name === "Observation & Recommendations",
                    )!
                  }
                />
              </Button>
            }
            body={
              <div className="m-0">
                <ReportsScaled
                  reports={data.reports}
                  observations={
                    data.groups.find(
                      (group) => group.name === "Observation & Recommendations",
                    )!
                  }
                />
              </div>
            }
          />

          <CustomModal
            buttonColumn="col p-0"
            size="xl"
            modalId="pieBarChart"
            HeaderRightPos={-10}
            HeaderTopPos={-10}
            button={
              <Button className="btn w-100 bg-transparent p-0 shadow-none">
                <div
                  style={{
                    border: ".43px solid #1D1F25",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="col"
                    style={{
                      background: "#1D1F25",
                      padding: "7px 14px",
                    }}
                  >
                    <p className="m-0 fs10px fw-bold text-white">
                      Project Location
                    </p>
                  </div>
                  <div className="col p-0">
                    <ProjectLocationMap />
                  </div>
                </div>
              </Button>
            }
            body={
              <div className="m-0">
                <div
                  style={{
                    border: ".43px solid #1D1F25",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="col"
                    style={{
                      background: "#1D1F25",
                      padding: "7px 14px",
                    }}
                  >
                    <p className="m-0 fs10px fw-bold text-white">
                      Project Location
                    </p>
                  </div>
                  <div className="col p-0">
                    <ProjectLocationMap height="500px" />
                  </div>
                </div>
              </div>
            }
          />

          <CustomModal
            buttonColumn="col p-0"
            size="xl"
            modalId="pieChart"
            HeaderRightPos={-10}
            HeaderTopPos={-10}
            button={
              <SimplePieChart
                data={data}
                financialAnalysis={
                  data.groups.find((group) =>
                    group.name.toLowerCase().includes("financial analysis"),
                  )!
                }
                projectProfile={
                  data.groups.find((group) =>
                    group.name.toLowerCase().includes("project profile"),
                  )!
                }
              />
            }
            body={
              <div className="m-0">
                <SimplePieChartScaled
                  data={data}
                  financialAnalysis={
                    data.groups.find((group) =>
                      group.name.toLowerCase().includes("financial analysis"),
                    )!
                  }
                  projectProfile={
                    data.groups.find((group) =>
                      group.name.toLowerCase().includes("project profile"),
                    )!
                  }
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsDashboard;

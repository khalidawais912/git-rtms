import { PROJECT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import ProgressBar from "@/app/components/ProgressBar";
import {
  Attributes,
  Groups,
} from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import apiClient from "@/app/services/api-client";
import book from "@/public/icons/book.svg";
import dotsL from "@/public/icons/dotsL.svg";
import anchorPoint from "@/public/icons/anchor-point.svg";
import levelsUp from "@/public/icons/levelsUp.svg";
import mainPage from "@/public/icons/mainPage.svg";
import money from "@/public/icons/money.svg";
import star from "@/public/icons/star.svg";
import fileAttach from "@/public/icons/fileAttach.svg";
import teamMembers from "@/public/icons/team-members.svg";
import videos from "@/public/icons/videos.svg";
import starBalloon from "@/public/icons/starBalloon.svg";
import warningIcon2 from "@/public/icons/warningIcon2.svg";
import waveUp2 from "@/public/icons/waveUp2.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import DesignAndScope from "./components/DesignAndScope";
import EarnedValueAnalysis from "./components/EarnedValueAnalysis";
import FinancialAnalysis from "./components/FinancialAnalysis";
import Main from "./components/Main";
import MajorDeliverable from "./components/MajorDeliverable";
import MonitoringRatingIndex from "./components/MonitoringRatingIndex";
import ObservationsAndRecommendations from "./components/ObservationsAndRecommendations";
import ProgressAnalysis from "./components/ProgressAnalysis";
import ProjectProfile from "./components/ProjectProfile";
import Badge from "../ProjectsTable/components/Badge";
import Loader from "@/app/components/Loader/Loader";
import { triggerEscapeKeyPress } from "@/app/utils";

interface Props {
  value: number;
  id: number;
  visitId: number;
}

export interface Project {
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
  attributes: Attributes[];
  evaluationFormula: string;
  evaluationFormulaWeightage: number;
  remarks: string;
  weightage: number;
  readOnly: number;
  sortId: number;
  attributeCode: string;
  smdpIdentifier: string;
}

const icons = [
  {
    icon: mainPage,
    label: "Main",
  },
  {
    icon: book,
    label: "Project Profile",
  },
  {
    icon: dotsL,
    label: "Design & Scope",
  },
  {
    icon: anchorPoint,
    label: "Work BreakDown Structure",
  },
  {
    icon: levelsUp,
    label: "Progress Analysis",
  },
  {
    icon: money,
    label: "Earned Value Analysis",
  },
  {
    icon: star,
    label: "Financial Analysis",
  },
  {
    icon: starBalloon,
    label: "Observation & Recommendations",
  },
  {
    icon: warningIcon2,
    label: "Monitoring Rating Index",
  },
  {
    icon: waveUp2,
    label: "Stakeholders",
  },
  {
    icon: fileAttach,
    label: "Annexures",
  },
  {
    icon: teamMembers,
    label: "Team Members",
  },
  {
    icon: videos,
    label: "Videos (Drone, Mobile ,etc)",
  },
];

const ProjectReportOverviewModal = ({ value, id, visitId }: Props) => {
  const [projectsData, setProjectsData] = useState<Project | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState<number>();
  const [gainedValue, setGainedValue] = useState<number>();
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setShow(true);
  };

  const handleSubmit = async (id: number, visitId: number) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${PROJECT_API}/${id}?visitId=${visitId}`,
      );
      setProjectsData(response.data.data);
      setLoading(false);
      console.log("reports data", response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  const calculatePercentage = (attributes: any, groups: any) => {
    const totalValue =
      attributes.length > 0
        ? attributes.length
        : groups.reduce(
            (total: any, group: any) => total + (group.attributes?.length || 0),
            0,
          ) || 0;

    // setTotalValue(totalValue);
    const gainedValue =
      attributes.length > 0
        ? attributes.filter(
            (attribute: any) =>
              attribute.values.length > 0 && attribute.values[0].value !== null,
          ).length
        : groups.reduce((gained: any, group: any) => {
            const groupGained = group.attributes?.filter(
              (attribute: any) =>
                attribute.values.length > 0 &&
                attribute.values[0]?.value !== null,
            ).length;
            return gained + (groupGained || 0);
          }, 0) || 0;

    // setGainedValue(gainedValue);
    console.log(
      "gained percentage:",
      gainedValue && totalValue ? (gainedValue / totalValue) * 100 : 0,
      "gainedValue:",
      gainedValue,
      "totalValue:",
      totalValue,
    );
    return gainedValue && totalValue ? (gainedValue / totalValue) * 100 : 0;
  };

  useEffect(() => {
    console.log("projectsData", projectsData);
  }, [projectsData]);

  return (
    <>
      <CustomModal
        showCloseButton={false}
        isFullscreen
        button={
          <Button
            type="button"
            onClick={() => {
              handleSubmit(id, visitId);
            }}
            className="col w-100 shadow-none btn p-0"
          >
            <div className="row d-flex m-0 align-items-center">
              <ProgressBar value={Math.round(value)} />
              {/* <div className="col-auto p-0 color-dark-blue fw-bold fs13px">
                {Math.round(value)}%
              </div> */}
              <div className="col-auto p-0">
                <Badge>{Math.round(value)}%</Badge>
              </div>
            </div>
          </Button>
        }
        body={
          isLoading ? (
            <Loader />
          ) : (
            <>
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={triggerEscapeKeyPress}
              ></div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: "500px",
                    maxHeight: "90vh",
                    borderRadius: "10px",
                    overflow: "hidden", // keeps rounded corners
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      maxHeight: "90vh",
                      overflowY: "auto", // scrollbar lives inside
                      pointerEvents: "auto",
                    }}
                  >
                    <Accordion>
                      {projectsData &&
                        projectsData.groups.map((group) => {
                          // Try to find an icon based on group.name
                          let itemIcon = icons.find(
                            (icon) => icon.label === group.name.trim(),
                          );

                          // If not found, or if name starts with "Work BreakDown Structure", use a specific one
                          if (
                            group.name.startsWith("Work BreakDown Structure")
                          ) {
                            itemIcon = icons[3]; // the desired fallback icon
                          }

                          return (
                            <Accordion.Item
                              key={group.id}
                              eventKey={group.id.toString()}
                              className="border-top-0 border-end-0 border-start-0"
                            >
                              <Accordion.Header>
                                <div className="col-auto pe-1">
                                  <Image
                                    src={itemIcon?.icon}
                                    alt={itemIcon?.label || ""}
                                    className="img-fluid"
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <div className="col">
                                  <div className="row d-flex flex-column m-0">
                                    <p className="m-0 fs14px ps-0 flex-wrap">
                                      {group.name}
                                    </p>
                                    <p
                                      className="m-0 fs12px ps-0 flex-wrap"
                                      style={{ color: "#83858F" }}
                                    >
                                      {group.description && group.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="col fw-bold fs15px pe-3">
                                  <div className="row d-flex m-0">
                                    <ProgressBar
                                      value={Math.round(
                                        calculatePercentage(
                                          group.attributes,
                                          group.group,
                                        ),
                                      )}
                                    />
                                    <div className="col-1 p-0 pe-4 text-dark">
                                      {Math.round(
                                        calculatePercentage(
                                          group.attributes,
                                          group.group,
                                        ),
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="col-lg-1 col-md-2 col-2 ps-0">
                      {Math.round(value)}%
                    </div> */}
                              </Accordion.Header>
                              <Accordion.Body>
                                {group.name.toLowerCase().includes("main") ? (
                                  <Main group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("project profile") ? (
                                  <ProjectProfile group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("design & scope") ? (
                                  <DesignAndScope group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("major deliverable") ? (
                                  <MajorDeliverable group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("progress analysis") ? (
                                  <ProgressAnalysis group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("earned value analysis") ? (
                                  <EarnedValueAnalysis group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("financial analysis") ? (
                                  <FinancialAnalysis group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("monitoring rating index") ? (
                                  <MonitoringRatingIndex group={group} />
                                ) : group.name
                                    .toLowerCase()
                                    .includes("observation") ? (
                                  <ObservationsAndRecommendations
                                    group={group}
                                  />
                                ) : (
                                  <div>No Data Available</div>
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        })}
                    </Accordion>
                  </div>
                </div>
              </div>
            </>
          )
        }
        modalId={"projectReport"}
      />
    </>
  );
};

export default ProjectReportOverviewModal;

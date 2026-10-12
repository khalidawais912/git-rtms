import { VISIT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import Loader from "@/app/components/Loader/Loader";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import useDistrict from "@/app/hooks/useDistrict";
import useSectors from "@/app/hooks/useSectors";
import useUsers from "@/app/hooks/useUsers";
import apiClient from "@/app/services/api-client";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import { exportDataToExcel } from "@/app/utils/exportToExcel";
import visitPlan from "@/public/icons/visitPlan.svg";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import ProjectsTable, { ProjectsList } from "./ProjectsTable/ProjectsTable";
import useProjectsTableUtils from "./ProjectsTable/useProjectsTableUtils";

interface VisitsPlan {
  nameOfVisit: string;
  totalOfVisits: number;
  totalOfDrivers: number;
  totalOfCars: number;
  pdfOfVisit: string;
  detailOfEachVisit: [
    {
      officerName: string;
      designation: string;
      fromDate: string;
      toDate: string;
      totalVisits: number;
      submitted: number;
      completeVisits: number;
      pendingVisits: number;
      onTimeSubmitted: number;
      lateSubmitted: number;
      issuedReport: number;
    },
  ];
}

interface Props {
  getProjectsList: (status: string) => Promise<void>;
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
}

const VisitsPlan = ({
  getProjectsList,
  projectsData,
  setProjectsData,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VisitsPlan[]>();
  const [role, setRole] = useState<string>("");
  const { rowCountOptions, districtOptions, sectorOptions, userOptions } =
    useProjectsTableUtils();

  useEffect(() => {
    const userRole = Cookies.get("role");
    if (userRole) setRole(userRole);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${VISIT_API}/GetVisitPlan`);
      setData(response.data.data);
      console.log("visits plan data", response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  // Filter and map keys
  const filteredKeys =
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "projectName",
          "sectorName",
          "districtName",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          "deadline",
          "fileGenrated",
        ].includes(key),
      )
      .map((key) => key as keyof ProjectsList);

  const filterProjectsData = (
    fromdate: string,
    todate: string,
    data: ProjectsList[],
  ) => {
    return !fromdate && !todate
      ? data // Show all data if no date is selected
      : data.filter((d) => {
          const visitFromDate = new Date(d.visitStartDate)
            .toISOString()
            .split("T")[0];
          const visitToDate = new Date(d.visitEndDate)
            .toISOString()
            .split("T")[0];
          const startDate = fromdate
            ? new Date(fromdate).toISOString().split("T")[0]
            : null;
          const endDate = todate
            ? new Date(todate).toISOString().split("T")[0]
            : null;

          console.log("visitFromDate", visitFromDate);
          console.log("visitToDate", visitToDate);
          console.log("startDate", startDate);
          console.log("endDate", endDate);
          if (startDate && endDate) {
            return startDate >= visitFromDate && endDate <= visitToDate;
          } else if (startDate) {
            return startDate >= visitFromDate;
          } else if (endDate) {
            return endDate <= visitToDate;
          }

          return true;
        });
  };

  // Export to Excel function
  const exportToExcel = (plan: VisitsPlan) => {
    const headers = [
      "Sr No.",
      "Officer Name",
      "Designation",
      "From Date",
      "To Date",
      "Total Visits",
      "Pending Visits",
      "Complete Visits",
      "Submitted",
      "On Time Submitted",
      "Late Submitted",
      "Issued Report",
    ];

    const data = plan.detailOfEachVisit.map((visit, index) => ({
      "Sr No.": index + 1,
      "Officer Name": visit.officerName,
      Designation: visit.designation,
      "From Date": visit.fromDate,
      "To Date": visit.toDate,
      "Total Visits": visit.totalVisits,
      Submitted: visit.submitted,
      "Complete Visits": visit.completeVisits,
      "Pending Visits": visit.pendingVisits,
      "On Time Submitted": visit.onTimeSubmitted,
      "Late Submitted": visit.lateSubmitted,
      "Issued Report": visit.issuedReport,
    }));

    exportDataToExcel(
      data,
      headers,
      `${plan.nameOfVisit} ${new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}}.xlsx`,
    );
  };

  return (
    <>
      <CustomModal
        size="xl"
        modalId="visitsPlan"
        HeaderRightPos={10}
        HeaderTopPos={0}
        button={
          <div
            className="text-decoration-none cursor-pointer text-dark d-flex align-items-center justify-content-center"
            style={{
              height: "62px",
              borderRadius: "8px",
              background: "#C6F1DF",
            }}
          >
            <div className="d-flex align-items-center justify-content-center">
              <div className="me-2">
                <Image src={visitPlan} alt="visitPlan" width={24} height={24} />
              </div>
              <div className="text-start">Visits Plan</div>
            </div>
          </div>
          // <Button
          //   className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
          //   style={{
          //     borderRadius: "8px",
          //     background: "#C6F1DF",
          //   }}
          // >
          //   <div className="col-auto pe-1 my-auto">
          //     <Image src={visitPlan} alt="visitPlan" width={24} height={24} />
          //   </div>
          //   <div className="col-auto p-0">
          //     Visits
          //     <br />
          //     Plan
          //   </div>
          // </Button>
        }
        body={
          <div
            className="container-fluid border border-white px-4 py-3"
            style={{
              borderRadius: "20px",
              background: "#fff",
              height: "700px",
              overflow: "scroll",
            }}
          >
            <p className="mb-3 fw-bold">
              <Image
                src="/icons/briefcase.svg"
                alt="briefcase"
                width={24}
                height={24}
              />{" "}
              Reports of All the Projects Listed
            </p>
            <Accordion>
              {data &&
                data.map((d, i) => (
                  <Accordion.Item key={i} eventKey={`${i}`}>
                    <Accordion.Header>
                      <>
                        {d.pdfOfVisit && (
                          <Link
                            href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.pdfOfVisit}`}
                            target="_blank"
                            className="text-decoration-none text-white"
                          >
                            <img
                              src="/images/tourPlans2.png"
                              alt="pdfViewable"
                              className="img-fluid shadow-sm me-2"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "1px solid #E8E8E8",
                              }}
                            />
                          </Link>
                        )}
                        <div className="col m-auto">
                          <p className="mb-1 fs14px fw-bold">{d.nameOfVisit}</p>
                          <p
                            className="mb-1 fs12px fw-normal"
                            style={{ color: "#83858F" }}
                          >
                            {d.totalOfVisits} Projects
                          </p>
                        </div>
                      </>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div
                        className="container-fluid border border-white p-3 bg-white"
                        style={{
                          borderRadius: "20px",
                          height: "400px",
                          overflow: "scroll",
                        }}
                      >
                        <div className="text-end">
                          <DownloadDropDown
                            onClickExcel={() => exportToExcel(d)}
                          />
                        </div>
                        <div className="table-responsive">
                          <table className="table table-hover text-center">
                            <thead>
                              <tr className="fs14px">
                                <th className="border-0">&nbsp;</th>
                                <th className="border-0">&nbsp;</th>
                                <th
                                  colSpan={2}
                                  className="text-center border-0 fw-normal"
                                >
                                  <div className="border">&nbsp;</div>
                                  <div style={{ marginTop: "-34px" }}>
                                    <span className="bg-white fw-bold">
                                      Visits
                                    </span>
                                  </div>
                                </th>
                                <th
                                  colSpan={4}
                                  className="text-center border-0 fw-normal"
                                >
                                  <div className="border">&nbsp;</div>
                                  <div style={{ marginTop: "-34px" }}>
                                    <span className="bg-white fw-bold">
                                      Reports
                                    </span>
                                  </div>
                                </th>
                                <th className="border-0">&nbsp;</th>
                              </tr>
                              <tr>
                                <td className="bg-color-sea-blue rounded-pill rounded-end p-0 border-0 text-center">
                                  <div
                                    style={{ background: "#0468C8" }}
                                    className="p-0 rounded-pill text-white py-2 fs18px fw-bold text-center"
                                  >
                                    Name
                                  </div>
                                </td>
                                <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                  Total
                                </td>
                                <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                  Scheduled
                                </td>
                                <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                  Completed
                                </td>
                                <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                  Submitted
                                </td>
                                <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold text-nowrap">
                                  On-Time
                                </td>
                                <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                  Late
                                </td>
                                <td className="bg-color-sea-blue border-0 text-white rounded-pill rounded-start text-nowrap text-center fs18px fw-bold">
                                  Reports Issued
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {d.detailOfEachVisit.map((visit, j) => (
                                <tr key={j}>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="rounded-pill rounded-end border-0 fs14px fw-bold px-0 py-1"
                                  >
                                    <div
                                      className="rounded-pill rounded-end"
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                      }}
                                    >
                                      <CustomModal
                                        HeaderTopPos={0}
                                        HeaderRightPos={20}
                                        isFullscreen={true}
                                        size="xl"
                                        modalId={`${j}"Projects"`}
                                        button={
                                          <Button
                                            className="btn p-0 pe-1 shadow-none w-100"
                                            onClick={() =>
                                              getProjectsList("BeingMonitored")
                                            }
                                          >
                                            {visit.officerName}
                                            <br />
                                            {visit.designation}
                                            <br />
                                            From:{" "}
                                            {new Date(
                                              visit.fromDate,
                                            ).toLocaleDateString("en-GB", {
                                              weekday: "short",
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                            <br />
                                            To:
                                            {new Date(
                                              visit.toDate,
                                            ).toLocaleDateString("en-GB", {
                                              weekday: "short",
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                          </Button>
                                        }
                                        body={
                                          <>
                                            <div
                                              className="container-fluid border border-white p-3"
                                              style={{
                                                borderRadius: "20px",
                                                background: "#CFE6F8",
                                                height: "100%",
                                                overflow: "scroll",
                                              }}
                                            >
                                              {projectsData && filteredKeys ? (
                                                <ProjectsTable
                                                  rowCountOptions={
                                                    rowCountOptions
                                                  }
                                                  districtOptions={
                                                    districtOptions
                                                  }
                                                  sectorOptions={sectorOptions}
                                                  userOptions={userOptions}
                                                  role={role}
                                                  label="Being Monitored Projects"
                                                  projectsData={projectsData.filter(
                                                    (project) =>
                                                      project.userName ===
                                                        visit.officerName &&
                                                      new Date(
                                                        project.visitStartDate,
                                                      ) >=
                                                        new Date(
                                                          d.nameOfVisit.split(
                                                            " ",
                                                          )[2],
                                                        ) &&
                                                      new Date(
                                                        project.visitEndDate,
                                                      ) <=
                                                        new Date(
                                                          d.nameOfVisit.split(
                                                            " ",
                                                          )[4],
                                                        ),
                                                  )}
                                                  setProjectsData={
                                                    setProjectsData
                                                  }
                                                  keys={filteredKeys}
                                                />
                                              ) : (
                                                <Loader />
                                              )}
                                            </div>
                                          </>
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="border-0 text-center fs14px fw-normal px-0 py-1"
                                  >
                                    <div
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                        padding: "10px 0px 19px 0px",
                                      }}
                                    >
                                      {visit.totalVisits}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="border-0 text-center fs14px fw-normal px-0 py-1"
                                  >
                                    <div
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                        padding: "10px 0px 19px 0px",
                                      }}
                                    >
                                      {visit.pendingVisits}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="border-0 text-center fs14px fw-normal px-0 py-1"
                                  >
                                    <div
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                        padding: "10px 0px 19px 0px",
                                      }}
                                    >
                                      {visit.completeVisits}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="border-0 text-center fs14px fw-normal px-0 py-1"
                                  >
                                    <div
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                        padding: "10px 0px 19px 0px",
                                      }}
                                    >
                                      {visit?.submitted || 0}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="border-0 text-center fs14px fw-normal px-0 py-1"
                                  >
                                    <div
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                        padding: "10px 0px 19px 0px",
                                      }}
                                    >
                                      {visit.onTimeSubmitted}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="border-0 text-center fs14px fw-normal px-0 py-1"
                                  >
                                    <div
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                        padding: "10px 0px 19px 0px",
                                      }}
                                    >
                                      {visit.lateSubmitted}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      // background: "rgba(241, 241, 241, 0.88)",
                                      color: "#414651",
                                    }}
                                    className="border-0 fs14px fw-bold px-0 py-1"
                                  >
                                    <div
                                      style={{
                                        background: "rgba(241, 241, 241, 0.88)",
                                        padding: "10px 0px 19px 0px",
                                        borderTopRightRadius: "20px",
                                        borderBottomRightRadius: "20px",
                                      }}
                                    >
                                      {visit.issuedReport}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </div>
        }
      />
    </>
  );
};

export default VisitsPlan;

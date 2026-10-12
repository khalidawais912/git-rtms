"use client";

import { useEffect, useState } from "react";
import CustomModal from "../components/CustomModal/CustomModal";
import AssignProjectPartTwoBarChartTile from "./components/AssignProjectPartTwoBarChartTile";
import BarChartTile from "./components/BarChartTile";
import BarChartTileSNEWiseProjects from "./components/BarChartTileSNEWiseProjects";
import BarChartTileTotalProjects from "./components/BarChartTileTotalProjects";
import CompletedProjectsBarChartTile from "./components/CompletedProjectsBarChartTile";
import DistrictWiseProjectsBarChartTile from "./components/DistrictWiseProjectsBarChartTile";
import SectorWiseProgressPieChartTile from "./components/SectorWiseProgressPieChartTile";
import apiClient, { CanceledError } from "../services/api-client";
import { EVALUATION_MAIN_DASHBOARD_API } from "../APIs";

// export interface SeasonCycle {
//   totalProduction: number;
//   punjabProduction: number;
//   sindhProduction: number;
//   balochistanProduction: number;
//   kpkProduction: number;
//   punjabPercentage: number;
//   sindhPercentage: number;
//   balochistanPercentage: number;
//   kpkPercentage: number;
//   punjabSession: string;
//   sindhSession: string;
//   balochistanSession: string;
//   kpkSession: string;
//   countryCycles: {
//     countryId: number;
//     countryName: string;
//     totalSupply: number; //production
//     percentage: number;
//     sessionName: string;
//   }[];
// }

export interface AssignedProject {
  userName: string;
  totalAssignedProjects: number;
}

export interface EvaluationTotalProject {
  userName: string;
  totalAssignedProjects: number;
}

export interface SNEProject {
  userName: string;
  totalAssignedProjects: number;
}

export interface OfficerWiseVisits {
  officerName: string;
  scheduledCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface DistrictProject {
  districtName: string;
  totalProject: number;
}

interface Stats {
  summary: {
    totalProjects: number;
    totalVisit: number;
    unassignedProjects: number;
    scheduleProjects: number;
    completedProjects: number;
    submmittedProjects: number;
    refferBackProjects: number;
    approvedByDGProjects: number;
    issuedProjects: number;
    cancelProjects: number;
  };
  assignedProjects: AssignedProject[];
  evaluationTotalProject: EvaluationTotalProject[];
  isSNEProjectCount: SNEProject[];
  officerWiseVisits: OfficerWiseVisits[];
  districtProjects: DistrictProject[];
}

const ChartsPage = () => {
  const [data, setData] = useState<Stats>();
  const [isLoading, setLoading] = useState(true);

  // const seasonCycleData: SeasonCycle = {
  //   totalProduction: 43729351,
  //   punjabProduction: 38694922,
  //   sindhProduction: 2390730,
  //   balochistanProduction: 1635337,
  //   balochistanSession: "testing",
  //   kpkSession: "testing",
  //   punjabSession: "testing",
  //   sindhSession: "testing",
  //   kpkProduction: 1008362,
  //   punjabPercentage: 88.48729998302512,
  //   sindhPercentage: 5.4671060633852075,
  //   balochistanPercentage: 3.7396781854823318,
  //   kpkPercentage: 2.305915768107329,
  //   countryCycles: [
  //     {
  //       countryId: 4,
  //       countryName: "China",
  //       totalSupply: 52868,
  //       percentage: 0.12089820404606508,
  //       sessionName: "",
  //     },
  //     {
  //       countryId: 3,
  //       countryName: "Afghanistan",
  //       totalSupply: 559040,
  //       percentage: 1.2784090941573774,
  //       sessionName: "",
  //     },
  //     {
  //       countryId: 2,
  //       countryName: "Iran",
  //       totalSupply: 188351,
  //       percentage: 0.430719861358107,
  //       sessionName: "",
  //     },
  //   ],
  // };
  useEffect(() => {
    const controller = new AbortController();

    const handleSubmit = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          EVALUATION_MAIN_DASHBOARD_API + "/stats",
          {
            signal: controller.signal,
          },
        );
        setData(response.data);
        console.log("evaluation charts data:", response.data);
        setLoading(false);
      } catch (err) {
        if (err instanceof CanceledError) return;

        console.error("Submission error:", err);
        setLoading(false);
      }
    };

    handleSubmit();
    return () => controller.abort();
  }, []);

  return (
    <div style={{ marginTop: "-8px" }}>
      <div
        className="row m-0"
        style={{
          padding: "15px 30px",
          background: "#F8FAFC",
          gap: "23px",
        }}
      >
        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Total Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.totalProjects}
          </p>
        </div>

        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Total Visits
          </p>
          <p className="m-0 text-center fw-bold">{data?.summary.totalVisit}</p>
        </div>

        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Schedule Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.scheduleProjects}
          </p>
        </div>

        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Completed Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.completedProjects}
          </p>
        </div>

        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Submitted Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.submmittedProjects}
          </p>
        </div>
      </div>
      <div
        className="row m-0"
        style={{
          padding: "15px 30px",
          background: "#F8FAFC",
          gap: "23px",
        }}
      >
        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Refer Back Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.refferBackProjects}
          </p>
        </div>

        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Approved By DG Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.approvedByDGProjects}
          </p>
        </div>

        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Issued Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.issuedProjects}
          </p>
        </div>

        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Cancel Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.cancelProjects}
          </p>
        </div>
        <div
          className="col bg-white"
          style={{
            padding: "24px 32px",
            borderRadius: "32px",
            boxShadow: "0px 0px 0px 1px #E2E8F0",
          }}
        >
          <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
            Unassigned Projects
          </p>
          <p className="m-0 text-center fw-bold">
            {data?.summary.unassignedProjects}
          </p>
        </div>
      </div>
      <div style={{ padding: "10px 32px" }}>
        <div className="row g-3">
          {data?.assignedProjects && (
            <div className="col-12 col-lg-6">
              <CustomModal
                showCloseButton={false}
                dialogClassName="ev-charts-modal"
                button={<BarChartTile data={data.assignedProjects} />}
                body={
                  <BarChartTile
                    data={data.assignedProjects}
                    chartSize="large"
                  />
                }
                modalId={"bar chart-1"}
              />
            </div>
          )}
          {data?.evaluationTotalProject && (
            <div className="col-12 col-lg-6">
              <CustomModal
                showCloseButton={false}
                dialogClassName="ev-charts-modal"
                button={
                  <BarChartTileTotalProjects
                    data={data?.evaluationTotalProject}
                  />
                }
                body={
                  <BarChartTileTotalProjects
                    chartSize="large"
                    data={data.evaluationTotalProject}
                  />
                }
                modalId={"bar chart-2"}
              />
            </div>
          )}
          {data?.officerWiseVisits && (
            <div className="col-12 col-lg-6">
              <CustomModal
                showCloseButton={false}
                dialogClassName="ev-charts-modal"
                button={
                  <AssignProjectPartTwoBarChartTile
                    data={data?.officerWiseVisits}
                  />
                }
                body={
                  <AssignProjectPartTwoBarChartTile
                    data={data?.officerWiseVisits}
                    chartSize="large"
                  />
                }
                modalId={"bar chart-3"}
              />
            </div>
          )}
          {/* <div className="col-12 col-lg-6">
            <CustomModal
              showCloseButton={false}
              dialogClassName="ev-charts-modal"
              button={<CompletedProjectsBarChartTile />}
              body={<CompletedProjectsBarChartTile chartSize="large" />}
              modalId={"bar chart-3"}
            />
          </div> */}
          {data?.isSNEProjectCount && (
            <div className="col-12 col-lg-6">
              <CustomModal
                showCloseButton={false}
                dialogClassName="ev-charts-modal"
                button={
                  <BarChartTileSNEWiseProjects data={data?.isSNEProjectCount} />
                }
                body={
                  <BarChartTileSNEWiseProjects
                    chartSize="large"
                    data={data?.isSNEProjectCount}
                  />
                }
                modalId={"bar chart-3"}
              />
            </div>
          )}
          {/* <div className="col-4">
            <CustomModal
              showCloseButton={false}
              dialogClassName="ev-charts-modal"
              button={<SectorWiseProgressPieChartTile />}
              body={<SectorWiseProgressPieChartTile chartSize="large" />}
              modalId={"two-level pie chart"}
            />
          </div> */}
          {data?.districtProjects && (
            <div className="col-12">
              <CustomModal
                showCloseButton={false}
                dialogClassName="ev-charts-modal"
                button={
                  <DistrictWiseProjectsBarChartTile
                    data={data?.districtProjects}
                  />
                }
                body={
                  <DistrictWiseProjectsBarChartTile
                    chartSize="large"
                    data={data?.districtProjects}
                  />
                }
                modalId={"bar chart-4"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;

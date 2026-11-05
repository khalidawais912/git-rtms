import { formatAmountWithCommas } from "@/utils";
import { ApexOptions } from "apexcharts"; // Import ApexOptions
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ProjectsList } from "./ProjectsTable/ProjectsTable";

// Dynamically import the ApexChart component
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: ProjectsList;
  activeFilter: "cmInitiative" | "adp";
}

const DistributedColumnChart = ({ data, activeFilter }: Props) => {
  const [series, setSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [calculatedData, setCalculatedData] = useState<string[]>([]);
  const astarik = ["", "*", "**", "***"];

  useEffect(() => {
    if (data) {
      const accumulativePC1Cost = data.cost;

      // Directly calculate percentages using `data`
      const allocationValue = parseFloat(String(data.revisedAllocation) || "0");
      const releasesValue = parseFloat(String(data.pnDReleases) || "0");
      const utilizationValue = parseFloat(String(data.utilization) || "0");

      const allocationPercentage =
        accumulativePC1Cost !== 0
          ? (allocationValue / accumulativePC1Cost) * 100
          : 0;

      const releasesPercentage =
        allocationValue !== 0 ? (releasesValue / allocationValue) * 100 : 0;

      const utilizationPercentage =
        releasesValue !== 0 ? (utilizationValue / releasesValue) * 100 : 0;

      // Create an array of percentages
      const percentages = [
        "",
        `${Math.round(allocationPercentage)}%`,
        `${Math.round(releasesPercentage)}%`,
        `${Math.round(utilizationPercentage)}%`,
      ];

      // Set the percentages in state
      setCalculatedData(percentages);

      // Update the series and categories directly
      setSeries([
        accumulativePC1Cost,
        allocationValue,
        releasesValue,
        utilizationValue,
      ]);
      setCategories(["Total Cost", "Allocation", "Releases", "Utilization"]);
    }
  }, [data, activeFilter]);

  const chartData = {
    series: [{ name: "Financial Analysis", data: series }],
    options: {
      chart: {
        type: "bar" as const,
        height: 300,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: "end",
          columnWidth: 20,
          dataLabels: { position: "top" },
        },
      },
      colors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
      xaxis: {
        labels: { rotate: -45, rotateAlways: true },
        categories,
      },
      yaxis: {
        labels: {
          formatter: (value) => `${Math.round(value)}M`,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (value: number, opts: { dataPointIndex: number }) => {
          const index = opts.dataPointIndex;
          if (index === 0) {
            return `${formatAmountWithCommas(value)} M`;
          }
          return `${formatAmountWithCommas(value)} M, ${calculatedData[index]}${
            astarik[index]
          }`;
        },
        style: { fontSize: "14px", colors: ["#000"] },
        offsetY: -23,
      },
      legend: { show: false },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
          opacityFrom: 1,
          opacityTo: 1,
        },
      },
      grid: { show: false },
    } as ApexOptions, // Explicitly type here
  };

  return (
    <div
      className="col shadow-sm mb-3"
      style={{
        background: "#C6D9F1",
        borderRadius: "15px",
        fontSize: ".9rem",
        height: "100%",
      }}
    >
      <div className="row d-flex p-2 m-0">
        <div
          className="col pb-2 ms-3 me-3"
          style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="row d-flex">
            <div className="col-lg-9 col-md-8 col-sm-12">
              <p className="m-0 fw-bold" style={{ fontSize: "1.563rem" }}>
                Financial Analysis (
                {activeFilter === "cmInitiative"
                  ? "CM Initiatives 145"
                  : "ADP Projects"}
                )
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col ps-3 pe-3">
        <ApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={300}
        />
      </div>
      <div className="col p-1 ps-3 fs14px text-nowrap">
        <div className="col" style={{ marginTop: "-35px" }}>
          <div className="mb-2 d-flex fw-normal">
            * % Allocation of Total Cost of PC-I
          </div>
        </div>
        <div className="col">
          <div className="mb-2 d-flex fw-normal">
            ** % Releases of CY Allocation
          </div>
        </div>
        <div className="col">
          <div className="mb-2 d-flex fw-normal">
            *** % Utilization of CY Releases
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributedColumnChart;

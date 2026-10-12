"use client";

import { formatHHLStringDate } from "@/app/utils";
import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { SingleProjectDashboard } from "./ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const SimpleLineChart = ({ data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [progressData, setProgressData] = useState<{
    plannedProgress: number;
    financialProgress: number;
    achievedProgress: number;
    visitDate: string;
    plannedStartDate: string;
  } | null>(null);

  const getValue = (label: string) => {
    return Math.round(
      Number(
        data.groups
          .find((group) =>
            group.name.toLowerCase().includes("progress analysis")
          )
          ?.attributes.find((attribute) =>
            attribute.label.toLowerCase().includes(label)
          )?.values[0]?.value || 0
      )
    );
  };

  useEffect(() => {
    const visitD: string =
      data.groups
        .find((group) => group.name.toLowerCase().includes("main"))
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes("visit date")
        )?.values[0]?.value || "";

    const plannedSD: string =
      data.groups
        .find((group) => group.name.toLowerCase().includes("project profile"))
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes("planned start date")
        )?.values[0]?.value || "";

    setProgressData({
      plannedProgress: getValue("planned progress"),
      financialProgress: getValue("financial progress"),
      achievedProgress: getValue("achieved progress"),
      visitDate: formatHHLStringDate(visitD),
      plannedStartDate: formatHHLStringDate(plannedSD),
    });
  }, [data]);

  useEffect(() => {
    if (chartRef.current && progressData) {
      const {
        plannedProgress,
        financialProgress,
        achievedProgress,
        visitDate,
        plannedStartDate,
      } = progressData;

      const chartOptions: ApexOptions = {
        series: [
          {
            name: "Planned Physical Progress",
            data: [0, plannedProgress],
          },
          {
            name: "Achieved Physical Progress",
            data: [0, achievedProgress],
          },
          {
            name: "Financial Progress",
            data: [0, financialProgress],
          },
        ],
        chart: {
          offsetY: -20,
          height: 225,
          type: "line",
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: "linear",
            speed: 800,
          },
          toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },

        legend: { show: true, offsetY: 0, fontSize: "14px" },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [plannedStartDate, visitDate],
        },
        yaxis: {
          labels: {
            formatter: (value) => `${value}%`, // Append '%' to y-axis labels
          },
        },
      };

      const chart = new ApexCharts(chartRef.current, chartOptions);

      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [progressData]);

  return (
    <div
      className="col shadow-sm mb-2"
      style={{
        background: "#C6D9F1",
        borderRadius: "15px",
        fontSize: ".9rem",
        height: "100%",
      }}
    >
      <div className="row d-flex m-0">
        <div
          className="col pb-2 ms-3 me-3"
          style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="row d-flex">
            <div className="col pt-2">
              <p className="m-0 fw-bold" style={{ fontSize: "1.563rem" }}>
                Project Analysis
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center m-0">
        <div className="col">
          <div ref={chartRef}></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLineChart;

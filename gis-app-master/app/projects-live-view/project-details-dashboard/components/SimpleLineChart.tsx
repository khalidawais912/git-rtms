"use client";

import { formatHHLStringDate } from "@/app/utils";
import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";
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
          height: 110,
          type: "line",
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: "linear",
            speed: 800,
          },
          toolbar: { show: false },
        },
        dataLabels: {
          enabled: false,
          style: {
            fontSize: "0.269rem",
            colors: ["#fff"],
          },
        },
        stroke: { curve: "smooth" },

        legend: {
          show: false,
        },
        grid: {
          row: {
            colors: ["#000"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [plannedStartDate, visitDate],
          offsetY: -2,
          labels: {
            style: {
              colors: "#fff",
              fontSize: "0.269rem",
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (value) => `${value}%`, // Append '%' to y-axis labels
            style: {
              colors: "#fff",
              fontSize: "0.269rem",
            },
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
      className="col"
      style={{
        background: "#1D1F25",
        padding: "12px",
        borderRadius: "9px",
        height: "100%",
      }}
    >
      <p
        className="fs10px fw-bold text-white"
        style={{
          marginBottom: "12px",
          textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        Project Analysis
      </p>
      <div className="d-flex justify-content-center m-0">
        <div className="col">
          <div className="position-relative w-100" style={{ height: "100px" }}>
            <div className="position-absolute w-100" ref={chartRef}></div>
            <div
              className="position-absolute d-flex flex-wrap justify-content-between w-100"
              style={{
                bottom: "-15px", // Move it *below* the chart container slightly
                left: 0,
                padding: "0px 30px 10px 30px", // Add a little horizontal padding for edges
              }}
            >
              <div className="d-flex align-items-center gap-1">
                <FaCircle color="#008FFB" size={3} />
                <span
                  className="badge rounded-pill fs5px fw-6"
                  style={{
                    background: "#141518",
                    padding: "1.6px 3px",
                  }}
                >
                  Planned Physical Progress
                </span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <FaCircle color="#00E396" size={3} />
                <span
                  className="badge rounded-pill fs5px fw-6"
                  style={{
                    background: "#141518",
                    padding: "1.6px 3px",
                  }}
                >
                  Achieved Physical Progress
                </span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <FaCircle color="#FEB019" size={3} />
                <span
                  className="badge rounded-pill fs5px fw-6"
                  style={{
                    background: "#141518",
                    padding: "1.6px 3px",
                  }}
                >
                  Financial Progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLineChart;

"use client";
import { formatAmountWithCommas } from "@/app/utils";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the react-apexcharts library
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Props {
  data: { totalRevenueCost: number; totalCapitalCost: number };
  activeFilter: "cmInitiative" | "adp";
}

const SimplePieChart = ({ data, activeFilter }: Props) => {
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    setSeries([data.totalRevenueCost, data.totalCapitalCost]);
  }, [data]);

  // Define the chart options with ApexOptions type
  const chartOptions: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Revenue Cost", "Capital Cost"],
    colors: ["#4A90FB", "#6FE397"],
    stroke: {
      show: false,
      width: 0,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const value = opts.w.globals.series[opts.seriesIndex];
        const total = opts.w.globals.series.reduce(
          (acc: any, cur: any) => acc + cur,
          0
        );
        const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
        return `${formatAmountWithCommas(value)} M (${Math.round(
          parseFloat(percentage)
        )}%)`; // Combine value and percentage
      },
      style: {
        fontSize: "14px",
        colors: ["#fff"],
      },
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      onItemHover: {
        highlightDataSeries: false, // Disable highlighting on hover
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 320,
          },
        },
      },
    ],
  };

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
                PC-I Analysis (
                {activeFilter === "cmInitiative"
                  ? "CM Initiatives 92"
                  : "ADP Projects"}
                )
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center m-0">
        <div className="col">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="pie"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart;

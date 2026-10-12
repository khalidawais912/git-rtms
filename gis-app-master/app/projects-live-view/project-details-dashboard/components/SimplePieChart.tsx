"use client";

import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { Groups, SingleProjectDashboard } from "./ProjectDetailsDashboard";

interface Props {
  financialAnalysis: Groups;
  projectProfile: Groups;
  data: SingleProjectDashboard;
}

const SimplePieChart = ({ financialAnalysis, projectProfile, data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [calculatedData, setCalculatedData] = useState<string[]>([]);

  useEffect(() => {
    const accumulativePc1Cost = data.groups
      .find((group) => group.name.toLowerCase() === "project profile")
      ?.attributes.find(
        (attribute) => attribute.label.toLowerCase() === "pc-i cost"
      )?.values[0]?.value;
    // setCalculatedData(
    //   financialAnalysis.attributes.slice(1, -2).map((attribute) => {
    //     const value = parseFloat(attribute.values[0]?.value || "0");
    //     const percentage = (value / accumulativePc1Cost) * 100; // Calculate percentage and fix to 2 decimal points
    //     return `${Math.round(percentage)}%`;
    //   })
    // );
    setCalculatedData(["30%", "70%"]);

    // Initialize series and labels
    const parsedSeries = financialAnalysis?.attributes
      .slice(1, -2)
      .map((attribute) =>
        Math.round(parseFloat(attribute.values[0]?.value || "0"))
      );

    const parsedLabels = financialAnalysis?.attributes
      .slice(1, -2)
      .map((attribute) => attribute.label);

    // setSeries(parsedSeries);
    const oneThirdValue = Number(accumulativePc1Cost) / 3;
    setSeries([
      Math.round(oneThirdValue),
      Math.round(oneThirdValue + oneThirdValue),
    ]);
    setLabels(parsedLabels);
  }, [financialAnalysis, projectProfile]);
  // const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Render chart only when both series and labels are initialized
    if (chartRef?.current && series?.length && labels?.length) {
      const chartOptions: ApexOptions = {
        chart: {
          type: "donut",
          height: "110px",
        },
        plotOptions: {
          radialBar: {
            hollow: { size: "65%" },
            track: { background: "#141518" },
            dataLabels: { show: false },
            startAngle: -90,
            endAngle: 270,
          },
        },
        labels: ["Revenue Cost", "Capital Cost"],
        colors: ["#FEB019", "#37B5EF"],
        stroke: {
          show: true, // MUST be true
          width: 1.24, // Thickness of the border (e.g., 2 pixels)
          colors: ["#141518"], // Black border for the segments
          lineCap: "round",
        },
        legend: {
          show: false, // Keep the legend visible if needed
          // formatter: function (val, opts) {
          //   return `${val}: ${opts.w.globals.series[opts.seriesIndex]}%`;
          // },
          // position: "bottom", // Position legend at the bottom
          // onItemHover: {
          //   highlightDataSeries: false, // Disable highlighting on hover
          // },
          // fontSize: "16px",
          // fontWeight: "500",
        },
        dataLabels: {
          enabled: true, // Enable data labels on the chart slices
          formatter: function (val, opts) {
            return (
              opts.w.globals.series[opts.seriesIndex].toString() +
              `M, ${calculatedData[opts.seriesIndex]}`
            );
          },
          style: {
            fontSize: "0.269rem",
            colors: ["#fff"],
          },
          dropShadow: {
            opacity: 0.3,
          },
        },
      };

      const chart = new ApexCharts(chartRef.current, {
        series,
        ...chartOptions,
      });

      chart.render();

      // Cleanup the chart on component unmount
      return () => {
        chart.destroy();
      };
    }
  }, [series, labels]);

  return (
    <div
      className="col"
      style={{
        background: "#1D1F25",
        padding: "7px 0px",
        borderRadius: "9px",
      }}
    >
      {/* <button onClick={() => setRefresh(!refresh)}>refresh chart</button> */}

      <p className="m-0 fw-bold fs10px text-center text-white">PC-I Analysis</p>
      <div className="position-relative w-100" style={{ height: "80px" }}>
        <div className="position-absolute w-100" ref={chartRef}></div>
        <div
          className="position-absolute w-100"
          style={{
            bottom: "-15px", // Move it *below* the chart container slightly
            left: 0,
            padding: "0px 0px 10px 0px", // Add a little horizontal padding for edges
            borderTop: ".43px solid rgba(226, 232, 240, 0.07)",
          }}
        >
          <div className="w-100 d-flex pt-1 flex-wrap justify-content-center gap-1">
            <div className="col-auto p-0">
              <div className="d-flex align-items-center gap-1">
                <FaCircle color="#FEB019" size={3} />
                <span
                  className="badge rounded-pill fs5px fw-6"
                  style={{
                    background: "#141518",
                    padding: "1.6px 3px",
                  }}
                >
                  Revenue Cost
                </span>
              </div>
            </div>
            <div className="col-auto p-0">
              <div className="d-flex align-items-center gap-1">
                <FaCircle color="#37B5EF" size={3} />
                <span
                  className="badge rounded-pill fs5px fw-6"
                  style={{
                    background: "#141518",
                    padding: "1.6px 3px",
                  }}
                >
                  Capital Cost
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart;

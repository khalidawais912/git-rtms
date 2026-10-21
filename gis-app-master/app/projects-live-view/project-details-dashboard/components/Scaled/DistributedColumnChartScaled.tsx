"use client";

import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import DetailAnalysis from "../DetailAnalysis";
import { SingleProjectDashboard } from "../../../types";
import Card from "../Card";
import { GoArrowUpRight } from "react-icons/go";

interface Props {
  data: SingleProjectDashboard;
  spi: number;
  cpi: number;
  projectRating: number;
}

const DistributedColumnChartScaled = ({
  data,
  spi,
  cpi,
  projectRating,
}: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [calculatedData, setCalculatedData] = useState<string[]>([]);
  const astarik = ["", "*", "**", "***"];
  const [allocation, setAllocation] = useState<string>();
  const [releases, setReleases] = useState<string>();
  const [utilization, setUtilization] = useState<string>();

  useEffect(() => {
    const financialAnalysis = data.groups.find((group) =>
      group.name.startsWith("Financial Analysis"),
    );

    if (financialAnalysis) {
      const allocation = financialAnalysis.attributes.find(
        (attribute) => attribute.label.toLowerCase() === "allocation",
      )?.values[0]?.value;

      const releases = financialAnalysis.attributes.find(
        (attribute) => attribute.label.toLowerCase() === "releases",
      )?.values[0]?.value;

      const utilization = financialAnalysis.attributes.find(
        (attribute) => attribute.label.toLowerCase() === "utilization",
      )?.values[0]?.value;

      setAllocation(allocation);
      setReleases(releases);
      setUtilization(utilization);

      const accumulativePC1Cost = data.groups
        .find((group) => group.name.toLowerCase() === "project profile")
        ?.attributes.find(
          (attribute) => attribute.label.toLowerCase() === "pc-i cost",
        )?.values[0]?.value;

      // Convert values to numbers
      const allocationValue = parseFloat(allocation || "0");
      const releasesValue = parseFloat(releases || "0");
      const utilizationValue = parseFloat(utilization || "0");
      console.log(
        "allocationValue:",
        allocationValue,
        "accumulativePC1Cost:",
        accumulativePC1Cost,
        "releasesValue:",
        releasesValue,
        "utilizationValue:",
        utilizationValue,
      );

      // Calculate percentages
      const allocationPercentage =
        Number(accumulativePC1Cost) !== 0
          ? (allocationValue / Number(accumulativePC1Cost)) * 100
          : 0;

      const releasesPercentage =
        allocationValue !== 0 ? (releasesValue / allocationValue) * 100 : 0;

      const utilizationPercentage =
        releasesValue !== 0 ? (utilizationValue / releasesValue) * 100 : 0;

      // Create an array of percentages
      const percentages = [
        ``,
        `${Math.round(allocationPercentage)}`,
        `${Math.round(releasesPercentage)}`,
        `${Math.round(utilizationPercentage)}`,
      ];
      console.log(
        allocationPercentage,
        releasesPercentage,
        utilizationPercentage,
      );
      // Set the percentages in state
      setCalculatedData(percentages);
    }

    const parsedSeries = [
      Number(
        data.groups
          .find((group) => group.name.toLowerCase() === "project profile")
          ?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "pc-i cost",
          )?.values[0]?.value || 0,
      ),
      Math.round(
        Number(
          financialAnalysis?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "allocation",
          )?.values[0]?.value || 0,
        ),
      ),
      Math.round(
        Number(
          financialAnalysis?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "releases",
          )?.values[0]?.value || 0,
        ),
      ),
      Math.round(
        Number(
          financialAnalysis?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "utilization",
          )?.values[0]?.value || 0,
        ),
      ),
    ];

    setSeries(parsedSeries);
    setCategories(["Total Cost", "Allocation", "Releases", "Utilization"]);
  }, [data]);

  useEffect(() => {
    if (chartRef.current && series.length && categories.length) {
      const chartOptions: ApexOptions = {
        chart: {
          type: "bar",
          height: 500,
          offsetY: -30,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
            borderRadius: 10,
            borderRadiusApplication: "end",
            barHeight: "40%",
            dataLabels: {
              position: "top",
            },
          },
        },
        colors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
        xaxis: {
          labels: {
            offsetY: -7,
            style: {
              colors: "#fff",
              fontSize: "0.4rem",
            },
          },
          categories,
        },

        // 2. Y-AXIS: Now holds the text label styling (for the vertical axis)
        yaxis: {
          // **DO NOT put categories here** - it causes the TypeScript error.
          // Categories are implicitly applied to the Y-axis when horizontal: true.
          show: true,
          labels: {
            style: {
              colors: "#fff",
              fontSize: "0.269rem",
            },
          },
        },
        dataLabels: {
          // You may need to adjust the positioning for horizontal bars
          offsetX: 30, // Adjust this value (e.g., from offsetY to offsetX)
          enabled: true,
          formatter: (value, opts) => {
            const index = opts.dataPointIndex;
            if (index === 0) {
              return `${value}M`;
            }
            return `${value}M, ${calculatedData[index]}%${astarik[index]}`;
          },
          style: {
            fontSize: "0.269rem",
            colors: ["#fff"],
          },
        },
        legend: {
          show: false,
        },
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
        grid: {
          show: false,
        },
      };

      const chart = new ApexCharts(chartRef.current, {
        series: [{ name: "Financial Analysis", data: series }],
        ...chartOptions,
      });

      chart.render();

      // Cleanup the chart on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [series, categories]);

  return (
    <>
      <Card>
        <div
          className="row justify-content-between align-items-center"
          style={{ marginBottom: "7px" }}
        >
          <div className="col-auto">
            <p className="m-0 fs10px fw-bold text-white">Financial Progress</p>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center gap-2">
              <div className="col-auto">
                <GoArrowUpRight color="white" />
              </div>
              <div className="col-auto">
                <p className="m-0 fs10px fw-bold text-white">Detail Analysis</p>
              </div>
            </div>
          </div>
        </div>
        <div className="position-relative w-100" style={{ height: "480px" }}>
          <div className="position-absolute w-100" ref={chartRef}></div>
          <div
            className="position-absolute d-flex flex-wrap justify-content-between w-100"
            style={{
              bottom: "-10px", // Move it *below* the chart container slightly
              left: 0,
              padding: "0px 0px 10px 0px", // Add a little horizontal padding for edges
            }}
          >
            <span
              className="badge rounded-pill"
              style={{
                background: "#141518",
                padding: "1px 3px",
                fontSize: "0.313rem",
              }}
            >
              * % Allocation of Total Cost of PC-I
            </span>
            <span
              className="badge rounded-pill"
              style={{
                background: "#141518",
                padding: "1px 3px",
                fontSize: "0.313rem",
              }}
            >
              ** % Releases of CY Allocation
            </span>
            <span
              className="badge rounded-pill"
              style={{
                background: "#141518",
                padding: "1px 3px",
                fontSize: "0.313rem",
              }}
            >
              *** % Utilization of CY Releases
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DistributedColumnChartScaled;

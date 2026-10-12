"use client";

import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import DetailAnalysis from "./DetailAnalysis";
import { SingleProjectDashboard } from "./ProjectDetailsDashboard";
import Card from "./Card";
import { GoArrowUpRight } from "react-icons/go";

interface Props {
  data: SingleProjectDashboard;
  spi: number;
  cpi: number;
  projectRating: number;
}

const DistributedColumnChart = ({ data, spi, cpi, projectRating }: Props) => {
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
      // const accumulativePC1CostValue = parseFloat(accumulativePC1Cost || "0");
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

  // const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (chartRef.current && series.length && categories.length) {
      const chartOptions: ApexOptions = {
        chart: {
          type: "bar",
          height: 150,
          offsetY: -30,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
            borderRadiusApplication: "end",
            barHeight: "10%",
            dataLabels: {
              position: "top",
            },
          },
        },
        colors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
        xaxis: {
          labels: {
            // rotate: -45,
            // style: {},
            // rotateAlways: true,
            // formatter: (value) => `${Math.round(Number(value))}M`,
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
            // You can remove rotation settings here if the labels fit vertically well
            // rotate: -45,
            // rotateAlways: true,
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
      {/* <button onClick={() => setRefresh(!refresh)}>refresh chart</button> */}
      <div
        className="col"
        style={{
          background: "#1D1F25",
          padding: "7px 0px",
          borderRadius: "9px",
        }}
      >
        <div
          className="row justify-content-between align-items-center"
          style={{ marginBottom: "7px", padding: "0px 14px 0px 14px" }}
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
        <div className="position-relative w-100" style={{ height: "130px" }}>
          <div
            className="position-absolute w-100"
            style={{ padding: "0px 14px 0px 14px" }}
            ref={chartRef}
          ></div>
          <div
            className="position-absolute w-100"
            style={{
              bottom: "-15px", // Move it *below* the chart container slightly
              left: 0,
              padding: "4px 10px 10px 10px", // Add a little horizontal padding for edges
              borderTop: ".43px solid rgba(226, 232, 240, 0.07)",
            }}
          >
            <div
              className="w-100 d-flex pt-1 flex-wrap justify-content-center"
              style={{ gap: "7px" }}
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
        </div>
      </div>
      {/* <DetailAnalysis data={data.detailAnalysis} /> */}
      {/* <CustomModal
        size="xl"
        modalId="detailAnalysis"
        button={
          <Button
            className="btn w-100 fs12px color-sea-blue"
            style={{
              background: "rgba(253, 253, 253, 0.41)",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
              marginTop: "-73px",
            }}
          >
            Detail Analysis
          </Button>
        }
        body={
          <div
            className="container-fluid"
            style={{
              borderRadius: "20px",
              background:
                "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6) , rgba(255, 255, 255, 0.1))",
              padding: "2px",
            }}
          >
            <div
              className="container-fluid px-0"
              style={{
                borderRadius: "20px",
                background: "#7ABEF0",
              }}
            >
              &nbsp;
              <div className="table-responsive" style={{ height: "200px" }}>
                <table className="table">
                  <thead>
                    <tr className="bg-color-sea-blue text-white fs12px">
                      <th className="border-0">VISIT</th>
                      <th className="border-0">OFFICER NAME</th>
                      <th className="border-0">DATE</th>
                      <th className="border-0">SPI</th>
                      <th className="border-0">CPI</th>
                      <th className="border-0">ALLOCATION</th>
                      <th className="border-0">RELEASES</th>
                      <th className="border-0">UTILIZATION</th>
                      <th className="border-0">MRI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.groups &&
                      data.groups.find(
                        (d) => d.name.toLowerCase() === "project profile"
                      )?.attributes &&
                      data.groups
                        .find((d) => d.name.toLowerCase() === "main")!
                        .attributes.filter((attribute) =>
                          attribute.label.toLowerCase().includes("visit date")
                        )
                        .map((attribute, i) => {
                          // Extract the officer name dynamically from staffTrackings
                          const officerName = data.staffTrackings?.find(
                            (tracking) => tracking.userName
                          )?.userName;
                          return (
                            <tr key={i} className="fs12px fw-bold">
                              <th
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                {i + 1}
                              </th>
                              <th
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                {officerName}
                              </th>
                              <td
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                {attribute.label
                                  .toLowerCase()
                                  .includes("visit date") &&
                                attribute?.values[0]?.value
                                  ? new Date(attribute?.values[0]?.value).toLocaleDateString(
                            "en-GB",
                            {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          ): ""}
                              </td>
                              <td
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                <p className="m-0">{spi}</p>
                                <p
                                  className="m-0"
                                  style={{
                                    color: `${
                                      spi > 1
                                        ? "rgba(115, 255, 64,1)"
                                        : spi === 1
                                        ? "rgba(255, 236, 64,1)"
                                        : spi < 1
                                        ? "rgba(255, 64, 64,1)"
                                        : ""
                                    }`,
                                  }}
                                >
                                  {spi > 1 && "(No Time Overrun)"}
                                  {spi === 1 && "(On Time)"}
                                  {spi < 1 && "(Time Overrun)"}
                                </p>
                              </td>
                              <td
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                <p className="m-0">{cpi}</p>
                                <p
                                  className="m-0"
                                  style={{
                                    color: `${
                                      cpi > 1
                                        ? "rgba(115, 255, 64,1)"
                                        : cpi === 1
                                        ? "rgba(255, 236, 64,1)"
                                        : cpi < 1
                                        ? "rgba(255, 64, 64,1)"
                                        : ""
                                    }`,
                                  }}
                                >
                                  {cpi > 1 && "(No Cost Overrun)"}
                                  {cpi === 1 && "(On Cost)"}
                                  {cpi < 1 && "(Cost Overrun)"}
                                </p>
                              </td>
                              <td
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                {allocation} M
                              </td>
                              <td
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                {releases} M
                              </td>
                              <td
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                }}
                              >
                                {utilization} M
                              </td>
                              <td
                                style={{
                                  borderBottom:
                                    "1px solid rgba(159, 159, 159, 0.75)",
                                  color: `${
                                    projectRating > 70
                                      ? "rgba(115, 255, 64,1)"
                                      : projectRating <= 70 &&
                                        projectRating >= 35
                                      ? "rgba(255, 236, 64,1)"
                                      : projectRating < 35
                                      ? "rgba(255, 64, 64,1)"
                                      : ""
                                  }`,
                                }}
                              >
                                {projectRating > 70
                                  ? "Good"
                                  : projectRating <= 70 && projectRating >= 35
                                  ? "Average"
                                  : projectRating < 35
                                  ? "Critical"
                                  : ""}
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
              <div
                className="col text-nowrap p-0 d-flex"
                style={{
                  overflow: "hidden",
                  overflowX: "scroll",
                }}
              >
                <div
                  className="col-lg-7 col-md-12 col-sm-12 bg-white ms-2 me-2"
                  style={{ borderRadius: "20px" }}
                >
                  <DistributedColumnChart2 data={data} />
                </div>
              </div>
              &nbsp;
            </div>
          </div>
        }
      /> */}
    </>
  );
};

export default DistributedColumnChart;

import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";
import { SingleProjectDashboard } from "./ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const DistributedColumnChart2 = ({ data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [calculatedData, setCalculatedData] = useState<string[]>([]);
  const astarik = ["", "*", "**", "***"];
  useEffect(() => {
    const financialAnalysis = data.groups.find((group) =>
      group.name.startsWith("Financial Analysis")
    );

    if (financialAnalysis) {
      const allocation = financialAnalysis.attributes.find(
        (attribute) => attribute.label.toLowerCase() === "allocation"
      )?.values[0]?.value;

      const releases = financialAnalysis.attributes.find(
        (attribute) => attribute.label.toLowerCase() === "releases"
      )?.values[0]?.value;

      const utilization = financialAnalysis.attributes.find(
        (attribute) => attribute.label.toLowerCase() === "utilization"
      )?.values[0]?.value;

      const accumulativePC1Cost = data.accumulativePC1Cost;

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
        utilizationValue
      );

      // Calculate percentages
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
        ``,
        `${Math.round(allocationPercentage)}`,
        `${Math.round(releasesPercentage)}`,
        `${Math.round(utilizationPercentage)}`,
      ];
      console.log(
        allocationPercentage,
        releasesPercentage,
        utilizationPercentage
      );
      // Set the percentages in state
      setCalculatedData(percentages);
    }

    const parsedSeries = [
      Number(data.accumulativePC1Cost || 0),
      Math.round(
        Number(
          financialAnalysis?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "allocation"
          )?.values[0]?.value || 0
        )
      ),
      Math.round(
        Number(
          financialAnalysis?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "releases"
          )?.values[0]?.value || 0
        )
      ),
      Math.round(
        Number(
          financialAnalysis?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "utilization"
          )?.values[0]?.value || 0
        )
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
            dataLabels: {
              position: "top",
            },
          },
        },
        colors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
        xaxis: {
          labels: {
            rotate: -45,
            style: {},
            rotateAlways: true,
          },
          categories,
        },
        yaxis: {
          labels: {
            formatter: (value) => `${Math.round(value)}M`, // Append '%' to y-axis labels
          },
        },
        dataLabels: {
          offsetY: -23,
          enabled: true,
          formatter: (value, opts) => {
            const index = opts.dataPointIndex;
            if (index === 0) {
              return `${value}M`;
            }
            return `${value}M, ${calculatedData[index]}%${astarik[index]}`;
          },
          style: {
            fontSize: "14px",
            colors: ["#000"],
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
    <div
      className="col mb-2"
      style={{
        borderRadius: "15px",
        fontSize: ".9rem",
        height: "98%",
      }}
    >
      <div className="row d-flex m-0">
        <div
          className="col pb-2 ms-3 me-3"
          // style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="row d-flex">
            <div className="col pt-2">
              <p className="m-0 fw-bold" style={{ fontSize: "1.563rem" }}>
                {/* Financial Progress */}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center m-0">
        <div className="col">
          <div ref={chartRef}></div>
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
      </div>
    </div>
  );
};

export default DistributedColumnChart2;

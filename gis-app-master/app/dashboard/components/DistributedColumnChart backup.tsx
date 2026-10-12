import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect, useRef, useState } from "react";

const DistributedColumnChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [calculatedData, setCalculatedData] = useState<string[]>([]);
  const astarik = ["", "*", "**", "***"];
  const [allocation, setAllocation] = useState<string>();
  const [releases, setReleases] = useState<string>();
  const [utilization, setUtilization] = useState<string>();

  useEffect(() => {
    // Set categories
    setCategories(["Total Cost", "Allocation", "Releases", "Utilization"]);

    // Set dummy series data
    setSeries([100, 75, 50, 125]);

    // Set dummy calculated percentages
    setCalculatedData(["100", "75", "50", "125"]); // Percentages matching series values
  }, []);

  useEffect(() => {
    // Initialize dummy data
    setCategories(["Total Cost", "Allocation", "Releases", "Utilization"]);
    setSeries([100, 75, 50, 125]);
    setCalculatedData(["100", "75", "50", "125"]); // Dummy percentages

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
            columnWidth: "20%", // Adjust column width
            dataLabels: {
              position: "top",
            },
          },
        },
        colors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
        xaxis: {
          categories,
        },
        yaxis: {
          labels: {
            formatter: (value) => `${Math.round(value)}M`, // Y-axis labels with 'M'
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (value, opts) => {
            const index = opts.dataPointIndex;
            if (index === 0) {
              return `${value}M`; // Format for the first data point
            }
            return `${value}M, ${calculatedData[index]}%${astarik[index]}`;
          },
          style: {
            fontSize: "14px",
            colors: ["#000"],
          },
        },
        legend: { show: false },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            gradientToColors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
            opacityFrom: 1,
            opacityTo: 1,
          },
        },
        grid: { show: false },
      };

      const chart = new ApexCharts(chartRef.current, {
        series: [{ name: "Financial Analysis", data: series }],
        ...chartOptions,
      });

      chart.render();

      return () => chart.destroy();
    }
  }, [series, categories, calculatedData, astarik]);

  return (
    <>
      <div
        className="col shadow-sm mb-2"
        style={{
          background: "#C6D9F1",
          borderRadius: "15px",
          fontSize: ".9rem",
          height: "98%",
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
                  Financial Progress
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
    </>
  );
};

export default DistributedColumnChart;

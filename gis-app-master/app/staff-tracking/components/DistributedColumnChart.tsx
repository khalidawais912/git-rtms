// components/DistributedColumnChart.tsx
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import blueCircle from "../../../public/icons/blueCircle.svg";
import greenCircle from "../../../public/icons/greenCircle.svg";

// Dynamically import the ApexChart component
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DistributedColumnChart = () => {
  const blueDarkColor = "#074F83";
  const blueLightColor = "#0C8CE9";
  const greenDarkColor = "#36F097";
  const greenLightColor = "#36F09733";

  // Chart options and data
  const [chartData] = useState({
    series: [
      {
        name: "Sales",
        data: [21, 22, 10, 28],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false, // Disable the toolbar, which includes the download button
        },
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
      fill: {
        type: "gradient", // Specify gradient type for fill
        gradient: {
          shade: "light",
          type: "horizontal", // Gradient direction
          shadeIntensity: 0.25,
          gradientToColors: [
            blueDarkColor,
            blueDarkColor,
            greenDarkColor,
            blueDarkColor,
            blueDarkColor,
            greenDarkColor,
          ], // End gradient colors
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      colors: [
        blueLightColor,
        blueLightColor,
        greenLightColor,
        blueLightColor,
        blueLightColor,
        greenLightColor,
      ],
      grid: {
        show: false, // Hide grid lines
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0, // Adjust padding if needed
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: ["PC-I Cost", "Allocation", "Releases", "Utilization"],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      title: {
        // text: "Distributed Column Chart",
        align: "left",
      },
    } as ApexOptions,
  });

  return (
    <div
      className="col shadow-sm mb-3"
      style={{
        background: "#C6D9F1",
        borderRadius: "15px",
        fontSize: ".9rem",
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
                Scope
              </p>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div
                className="row mt-2 d-flex justify-content-end"
                style={{ fontSize: "1.313rem" }}
              >
                <div className="col-lg-5 col-md-5 col-sm-12 fw-bold">
                  <Image
                    src={greenCircle}
                    alt="greenCircle"
                    width={14}
                    height={14}
                    style={{ marginBottom: "4px" }}
                  />
                  &nbsp;KM
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 fw-bold">
                  <Image
                    src={blueCircle}
                    alt="blueCircle"
                    width={14}
                    height={14}
                    style={{ marginBottom: "4px" }}
                  />
                  &nbsp;NOS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col ps-3 pe-3">
        <ApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={445}
        />
      </div>
    </div>
  );
};

export default DistributedColumnChart;

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import blueDarkCircle from "../../../public/icons/blueDarkCircle.svg";
import greenCircle from "../../../public/icons/greenCircle.svg";

// Dynamically import the ApexChart component
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StackedColumnChart = () => {
  const blueDarkColor = "#074F83";
  const blueLightColor = "#0C8CE9";
  const greenDarkColor = "#36F097";
  const greenLightColor = "#36F09733";

  // Chart options and data
  const [chartData] = useState({
    series: [
      {
        name: "Q1 Budget",
        group: "budget",
        data: [200, 250, 200, 40, 90, 500, 50],
      },
      {
        name: "Q2 Budget",
        group: "budget",
        data: [500, 700, 360, 200, 390, 650, 210],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      stroke: {
        width: 1,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: 40,
          borderRadius: 4,
          borderRadiusApplication: "end",
        },
      },
      fill: {
        opacity: 1,
      },
      colors: ["#3C6DE0", "#51FFD1"],
      xaxis: {
        categories: [
          "Agriculture",
          "industries...",
          "LG&CD",
          "Planning...",
          "Healthcare...",
          "Education...",
          "Information...",
        ],
      },
      legend: {
        show: false,
        position: "top",
      },
      title: {
        // text: "Grouped Stacked Column Chart",
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
        <div className="col pb-2">
          <div className="row d-flex">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <p className="m-0 fw-bold fs-4">Schedule Performance Index</p>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="row d-flex justify-content-end mt-2">
                <div className="col-lg-3 col-md-6 col">
                  <Image
                    src={greenCircle}
                    alt="greenCircle"
                    width={10}
                    height={10}
                  />
                  &nbsp;SP &ge; 1
                </div>
                <div className="col-lg-4 col-md-6 col">
                  <Image
                    src={blueDarkCircle}
                    alt="blueDarkCircle"
                    width={10}
                    height={10}
                  />
                  &nbsp;SPI &lt; 1 Red
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
          height={350}
        />
      </div>
    </div>
  );
};

export default StackedColumnChart;

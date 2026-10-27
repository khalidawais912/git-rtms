// components/SimplePie.tsx
import { ApexOptions } from "apexcharts"; // Import ApexOptions type
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import blueCircle2 from "../../../public/icons/blueCircle2.svg";
import seaGreenCircle from "../../../public/icons/seaGreenCircle.svg";

// Dynamically import the ApexChart component (for SSR)
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  title: string;
}

const SimplePieChart2 = ({ title }: Props) => {
  // Define chart options and data
  const [chartData] = useState<{
    options: ApexOptions; // Set the type as ApexOptions
    series: number[]; // The series type is an array of numbers
  }>({
    series: [30, 70], // Data for the pie chart
    options: {
      chart: {
        type: "donut", // Correct type as per ApexOptions
      },
      labels: ["Behind", "Ahead"], // Labels for each slice
      colors: ["#3C50E0", "#0FADCF"],
      stroke: {
        show: false,
        width: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%", // Adjust the inner radius of the donut
          },
        },
      },
      legend: {
        show: false, // Keep the legend visible if needed
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <div
      className="col shadow-sm mb-3"
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div className="row d-flex p-3 m-0">
        <div className="col pb-2">
          <div className="row d-flex">
            <div className="col">
              <p className="m-0 fw-bold mt-1 fs-5">{title}</p>
            </div>
            <div className="col-lg-2 col-md-2 col me-3">
              <select
                className="fw-bold shadow-sm"
                style={{
                  color: "#64748B",
                  outline: "none",
                  borderRadius: "4px",
                  border: "1px solid #E2E8F0",
                }}
                aria-label="Rows per page"
                name="rowPerPage"
              >
                <option value="day">Daily</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center pb-2">
        <div className="col-6">
          <ApexChart
            options={chartData.options}
            series={chartData.series}
            type="donut"
          />
        </div>
        <div className="col-3 d-flex flex-column justify-content-end pb-5">
          <p className="m-0 fs14px fw-normal">
            <Image src={blueCircle2} alt="blueCircle2" width={12} height={12} />
            &nbsp;Behind
          </p>
          <p className="m-0 fs14px fw-normal">
            <Image
              src={seaGreenCircle}
              alt="seaGreenCircle"
              width={12}
              height={12}
            />
            &nbsp;Ahead
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart2;

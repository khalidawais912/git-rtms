import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import to support SSR frameworks like Next.js
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface ChartProps {
  series: number[];
  categories: string[];
  title?: string;
}

const defaultOptions = (categories: string[]): ApexOptions => ({
  chart: {
    type: "bar",
    height: 300,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 10,
      dataLabels: { position: "top" },
      columnWidth: 20,
    },
  },
  colors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
  xaxis: {
    categories,
    labels: {
      rotate: -45,
      rotateAlways: true,
    },
  },
  legend: { show: false },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      gradientToColors: ["#074F83", "#0C8CE9", "#36F097", "#f0f036"],
      shadeIntensity: 0.25,
      opacityFrom: 1,
      opacityTo: 1,
    },
  },
  grid: { show: false },
});

const LinearChart: React.FC<ChartProps> = ({ series, categories, title }) => (
  <div style={{ borderRadius: 15, fontSize: ".9rem" }}>
    {title && (
      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>{title}</h3>
    )}
    <ReactApexChart
      options={defaultOptions(categories)}
      series={[{ name: title || "Series", data: series }]}
      type="bar"
      height={300}
    />
  </div>
);

export default LinearChart;

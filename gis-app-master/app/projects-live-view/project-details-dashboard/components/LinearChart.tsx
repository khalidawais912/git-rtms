import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface LinearChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: number[]; color?: string }[];
}

const LinearChart: React.FC<LinearChartProps> = ({
  title,
  categories,
  series,
}) => {
  const options: ApexOptions = {
    chart: { type: "line", height: 350, toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 6, shape: ["rect", "circle", "diamond"] },
    xaxis: { categories },
    legend: { position: "top" },
    colors: series.map((s) => s.color),
    yaxis: { min: 0, max: 100, title: { text: "Progress (%)" } },
  };

  const chartSeries = series.map((s) => ({ name: s.name, data: s.data }));

  return (
    <div className="col p-3">
      <h4 className="fw-bold">{title}</h4>
      <ReactApexChart
        options={options}
        series={chartSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default LinearChart;

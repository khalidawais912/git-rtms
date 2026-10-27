import Button from "@/shared/components/Button";
import MySimpleBarChart from "@/shared/components/Charts/BarChart/MySimpleBarChart";
import { ChartGradient, MyBarChartStyle, MyBarChartType } from "@/shared/components/types";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { HiChartBar } from "react-icons/hi";
import { SNEProject } from "../types";
import Card from "./Card";
import TileLabel from "./TileLabel";

interface Props {
  data: SNEProject[];
  chartSize?: "small" | "large";
}

const colors: ChartGradient[] = [
  {
    id: "SNE1",
    from: "#036CCF",
    to: "#013769",
    direction: "vertical", // optional
  },
  {
    id: "SNE2",
    from: "#00E331",
    to: "#00911F",
    direction: "vertical", // optional
  },
  {
    id: "SNE3",
    from: "#E27D02",
    to: "#BB6802",
    direction: "vertical", // optional
  },
  {
    id: "SNE4",
    from: "#CFB303",
    to: "#A38D00",
    direction: "vertical", // optional
  },
  {
    id: "SNE5",
    from: "#A4A4A4",
    to: "#4A4A4A",
    direction: "vertical", // optional
  },
];

const BarChartTileSNEWiseProjects = ({ chartSize = "small", data }: Props) => {
  const myChartData: MyBarChartType[] = data.map((item, i) => ({
    label: item.userName,
    value: item.totalAssignedProjects, // 🔥 dynamic field access
    gradient: colors[i],
  }));

  const smallChartStyle: MyBarChartStyle = {
    height: 292,
    barSize: 130,
    fallbackBarColor: "#2563EB",
    barRadius: [20, 20, 20, 20],
    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 12,
      padding: {
        left: 80,
        right: 80,
      },
    },

    label: {
      fontSize: 10,
      percentageColor: "rgba(0,0,0,.7)",
      valueColor: "rgba(0,0,0,.7)",
      seasonColor: "#000",
    },

  };

  const largeChartStyle: MyBarChartStyle = {
    height: 582,
    barSize: 260,
    fallbackBarColor: "#2563EB",
    barRadius: [40, 40, 40, 40],
    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 24,
      padding: {
        left: 150,
        right: 150,
      },
    },

    label: {
      fontSize: 20,
      percentageColor: "rgba(0,0,0,.7)",
      valueColor: "rgba(0,0,0,.7)",
      seasonColor: "#000",
    },
  };

  return (
    <Card
      head={
        <div className="d-flex align-items-center justify-content-between">
          <TileLabel
            backgroundImage="linear-gradient(to bottom, #036CCF , #013769)"
            icon={
              <HiChartBar
                color="white"
                size={30 * (chartSize === "small" ? 1 : 1.5)}
              />
            }
            label="SNE Wise Projects"
            description="SNE Project Overview"
            chartSize={chartSize}
          />
          <Button
            className="btn fw-6"
            style={{
              borderRadius: "10px",
              background: "#F3F4F6",
              color: "#6B7280",
              padding: "0.594em 0.625em",
              fontSize: 16 * (chartSize === "small" ? 1 : 1.5) + "px",
            }}
          >
            <div className="d-flex align-items-center" style={{ gap: "9px" }}>
              <HugeiconsIcon
                icon={ArrowUpRight03Icon}
                size={21 * (chartSize === "small" ? 1 : 1.5)}
              />
              <span>Visit</span>
            </div>
          </Button>
        </div>
      }
    >
      <MySimpleBarChart
        data={myChartData}
        style={chartSize === "small" ? smallChartStyle : largeChartStyle}
      />

      <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
        {myChartData.map((d, i) => (
          <span
            key={i}
            className="d-flex align-items-center gap-2"
            style={{ padding: "4.5px 4px" }}
          >
            <span className="p-1">
              <div
                style={{
                  width: 8 * (chartSize === "small" ? 1 : 2) + "px",
                  height: 8 * (chartSize === "small" ? 1 : 2) + "px",
                  backgroundImage: `linear-gradient(to bottom, ${colors[i]?.from || "#2563EB"} , ${colors[i]?.to || "#013769"})`,
                }}
              />
            </span>
            <span
              style={{
                fontSize: 12 * (chartSize === "small" ? 1 : 2) + "px",
              }}
            >
              {d.label}
            </span>
          </span>
        ))}
      </div>
    </Card>
  );
};

export default BarChartTileSNEWiseProjects;

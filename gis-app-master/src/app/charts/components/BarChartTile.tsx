import Button from "@/components/Button";
import { ArrowUpRight03Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Card from "./Card";
import TileLabel from "./TileLabel";
import MySimpleBarChart from "@/components/Charts/BarChart/MySimpleBarChart";
import { ChartGradient, MyBarChartStyle, MyBarChartType } from "@/components/types";
import { AssignedProject } from "../types";

interface Props {
  data: AssignedProject[];
  chartSize?: "small" | "large";
}

export const getGreenGradientColor = (id: string): ChartGradient => {
  return {
    id,
    from: "#00E331",
    to: "#00911F",
    direction: "vertical", // optional
  };
};

const BarChartTile = ({ chartSize = "small", data }: Props) => {

  const myChartData: MyBarChartType[] = data.map((item, i) => ({
    label: item.userName,
    value: item.totalAssignedProjects, // 🔥 dynamic field access
    gradient: getGreenGradientColor(`ap-gradient-color-${i}`),
  }));

  const smallChartStyle: MyBarChartStyle = {
    height: 292,
    barSize: 27,
    fallbackBarColor: "#2563EB",
    barRadius: [20, 20, 20, 20],
    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 12,
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
    barSize: 54,
    fallbackBarColor: "#2563EB",
    barRadius: [40, 40, 40, 40],
    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 24,
      padding: {
        left: 50,
        right: 50,
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
            icon={
              <HugeiconsIcon
                icon={UserGroupIcon}
                color="white"
                size={30 * (chartSize === "small" ? 1 : 1.5)}
              />
            }
            label="Assigned Evaluation Projects"
            description="Projects Details according to member"
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
        xAxisLabelOrientation="vertical"
      />

      <div className="d-flex justify-content-center align-items-center gap-2">
        <span
          className="d-flex align-items-center gap-2"
          style={{ padding: "4.5px 4px" }}
        >
          <span className="p-1">
            <div
              style={{
                width: 8 * (chartSize === "small" ? 1 : 2) + "px",
                height: 8 * (chartSize === "small" ? 1 : 2) + "px",
                backgroundImage: "linear-gradient(to bottom, #00E331, #00911F)",
              }}
            />
          </span>
          <span
            style={{
              fontSize: 12 * (chartSize === "small" ? 1 : 2) + "px",
            }}
          >
            Projects
          </span>
        </span>
      </div>
    </Card>
  );
};

export default BarChartTile;

import Button from "@/shared/components/Button";
import { ChartGradient } from "@/shared/components/Charts/BarChart/MySimpleBarChart";
import MyStackBarChart, {
  MyStackBarChartStyle,
  MyStackBarChartType,
} from "@/shared/components/Charts/BarChart/MyStackBarChart";
import { ArrowUpRight03Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Card from "./Card";
import TileLabel from "./TileLabel";
import { OfficerWiseVisits } from "../page";

interface Props {
  data: OfficerWiseVisits[];
  chartSize?: "small" | "large";
}

export const getBlueGradientColor = (id: string): ChartGradient => {
  return {
    id: id,
    from: "#036CCF",
    to: "#004687",
  };
};

const AssignProjectPartTwoBarChartTile = ({
  chartSize = "small",
  data,
}: Props) => {

  const color = "rgba(117, 117, 117, 0.15)";

  // We convert total into two stacked parts:
  // gain + remaining = total

  // Now stacking works correctly.

  const myChartData: MyStackBarChartType[] = data.map((item, i) => ({
    label: item.officerName,
    value1: {
      value: item.completedCount, //gain
      gradient: getBlueGradientColor(`owv-gradient-color-${i}`),
    },
    value2: {
      value: item.scheduledCount, // total === remaining
      color,
    },
  }));

  const smallChartStyle: MyStackBarChartStyle = {
    height: 292,
    barSize: 28,

    stacks: [
      {
        key: "value1", // 👈 MUST match data
        color: "#22C55E",
        name: "Completed",
        radius: [0, 0, 20, 20],
      },
      {
        key: "value2", // 👈 MUST match data
        color: "#F59E0B",
        name: "Scheduled",
        radius: [20, 20, 0, 0],
      },
    ],

    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 12,
    },
    tooltip: {
      cursor: true,
      contentStyle: {
        background: "#fff",
        border: "0px",
        borderRadius: "0px",
        padding: "10px",
        boxShadow: "0px 0px 0px .7px #1BCEF5",
      },
      labelStyle: {
        fontSize: "12px",
        fontWeight: 400,
      },
      itemStyle: {
        fontSize: "12px",
        fontWeight: "400",
      },
    },
  };

  const largeChartStyle: MyStackBarChartStyle = {
    height: 582,
    barSize: 56,

    stacks: [
      {
        key: "value1", // 👈 MUST match data
        name: "Completed",
        color: "#22C55E",
        radius: [0, 0, 20, 20],
      },
      {
        key: "value2", // 👈 MUST match data
        color: "#F59E0B",
        name: "Scheduled",
        radius: [20, 20, 0, 0],
      },
    ],

    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 20,
    },
  };

  return (
    <Card
      head={
        <div className="d-flex align-items-center justify-content-between">
          <TileLabel
            backgroundImage="linear-gradient(to bottom, #036CCF , #004687)"
            icon={
              <HugeiconsIcon
                icon={UserGroupIcon}
                color="white"
                size={30 * (chartSize === "small" ? 1 : 1.5)}
              />
            }
            label="Officer's Progress on Current Projects"
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
      <MyStackBarChart
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
                backgroundImage:
                  "linear-gradient(to bottom, #036CCF , #013769)",
              }}
            />
          </span>
          <span
            style={{
              fontSize: 12 * (chartSize === "small" ? 1 : 2) + "px",
            }}
          >
            Completed
          </span>
        </span>
        <span
          className="d-flex align-items-center gap-2"
          style={{ padding: "4.5px 4px" }}
        >
          <span className="p-1">
            <div
              style={{
                width: 8 * (chartSize === "small" ? 1 : 2) + "px",
                height: 8 * (chartSize === "small" ? 1 : 2) + "px",
                background: color,
              }}
            />
          </span>
          <span
            style={{
              fontSize: 12 * (chartSize === "small" ? 1 : 2) + "px",
            }}
          >
            Scheduled
          </span>
        </span>
      </div>
    </Card>
  );
};

export default AssignProjectPartTwoBarChartTile;

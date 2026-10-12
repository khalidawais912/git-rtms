import Button from "@/app/components/Button";
import MySimpleBarChart, {
  ChartGradient,
  MyBarChartStyle,
  MyBarChartType,
} from "@/app/components/Charts/BarChart/MySimpleBarChart";
import { ArrowUpRight03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Card from "./Card";
import TileLabel from "./TileLabel";
import MyTwoLevelPieChart, {
  MyTwoLevelPieChartStyle,
  TwoLevelPieData,
} from "@/app/components/Charts/BarChart/MyTwoLevelPieChart";

const SectorWiseProgressPieChartTile = ({
  chartSize = "small",
}: {
  chartSize?: "small" | "large";
}) => {
  const socialGradientColor: ChartGradient = {
    id: "my-gradient-color-3",
    from: "#036CCF",
    to: "#004687",
    direction: "vertical", // optional
  };

  const data: TwoLevelPieData = {
    outer: [
      { label: "Social", value: 1058, color: "" },
      { label: "Others", value: 111 },
      { label: "Services", value: 286 },
      { label: "Production", value: 687 },
      { label: "Infrastructure Development", value: 624 },
    ],

    inner: [
      { label: "Social1", value: 304 },
      { label: "Social2", value: 377 },
      { label: "Social3", value: 377 },

      { label: "Production1", value: 262 },
      { label: "Production2", value: 245 },
      { label: "Production3", value: 180 },
      { label: "Infrastructure Development1", value: 233 },
      { label: "Infrastructure Development2", value: 233 },
      { label: "Infrastructure Development3", value: 158 },
      { label: "Others1", value: 35 },
      { label: "Others2", value: 38 },
      { label: "Others3", value: 38 },
      { label: "Services1", value: 84 },
      { label: "Services2", value: 101 },
      { label: "Services3", value: 101 },
    ],
  };

  const smallChartStyle: MyTwoLevelPieChartStyle = {
    height: 300,

    outerInnerRadius: "45%",
    outerOuterRadius: "60%",

    innerInnerRadius: "65%",
    innerOuterRadius: "80%",

    outerLabel: false,
    innerLabel: true,

    stroke: "#fff",
    strokeWidth: 1,

    //   tooltip: {
    //     contentStyle: {
    //       backgroundColor: "#1E1B39",
    //       borderRadius: 6,
    //       border: "none",
    //     },
    //     itemStyle: { color: "#fff" },
    //   },
  };

  const largeChartStyle: MyTwoLevelPieChartStyle = {
    height: 600,

    outerInnerRadius: "45%",
    outerOuterRadius: "60%",

    innerInnerRadius: "65%",
    innerOuterRadius: "80%",

    outerLabel: false,
    innerLabel: true,

    stroke: "#fff",
    strokeWidth: 1,
  };

  return (
    <Card
      head={
        <div className="d-flex align-items-center justify-content-between">
          <TileLabel
            backgroundImage="linear-gradient(to bottom, #036CCF , #004687)"
            icon={
              <HugeiconsIcon
                icon={Location01Icon}
                color="white"
                size={30 * (chartSize === "small" ? 1 : 1.5)}
              />
            }
            label="District Wise Projects"
            description="Counts of project district wise"
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
      <MyTwoLevelPieChart
        data={data}
        style={chartSize === "small" ? smallChartStyle : largeChartStyle}
      />

      <p
        className="m-0 text-center"
        style={{
          color: "rgba(0, 0, 0, 0.7)",
          fontSize: 12 * (chartSize === "small" ? 1 : 2) + "px",
        }}
      >
        Districts
      </p>
    </Card>
  );
};

export default SectorWiseProgressPieChartTile;

import Button from "@/app/components/Button";
import { ArrowUpRight03Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Card from "./Card";
import TileLabel from "./TileLabel";
import MySimpleBarChart, {
  ChartGradient,
  MyBarChartStyle,
  MyBarChartType,
} from "@/app/components/Charts/BarChart/MySimpleBarChart";

const CompletedProjectsBarChartTile = ({
  chartSize = "small",
}: {
  chartSize?: "small" | "large";
}) => {
  const gradientColor: ChartGradient = {
    id: "my-gradient-color-3",
    from: "#036CCF",
    to: "#004687",
    direction: "vertical", // optional
  };

  const data: MyBarChartType[] = [
    {
      label: "Amina abrar",
      value: 50,
      season: "Nov-Jun",
      percentage: 98.94,
      gradient: gradientColor,
    },
    {
      label: "Aroos",
      value: 25,
      season: "Dec-Jan",
      percentage: 0.05,
      color: "#3BA2F1",
      gradient: gradientColor,
    },
    {
      label: "Qamar",
      value: 60,
      season: "Aug-Oct",
      percentage: 0.17,
      color: "#FFD700",
      gradient: gradientColor,
    },
    {
      label: "M.Salman",
      value: 40,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
    {
      label: "Fatima",
      value: 55,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
    {
      label: "M. Azeem",
      value: 60,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
    {
      label: "M. Sadiq",
      value: 60,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
    {
      label: "Quratul-ain",
      value: 70,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
    {
      label: "M. Saqib",
      value: 40,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
    {
      label: "Adnan",
      value: 25,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
    {
      label: "Dr. Hamza",
      value: 25,
      season: "Jun-Nov",
      percentage: 0.83,
      color: "#ff2b2b",
      gradient: gradientColor,
    },
  ];

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

    //   tooltip: {
    //     contentStyle: {
    //       backgroundColor: "#1E1B39",
    //       borderRadius: 6,
    //       border: "none",
    //     },
    //     itemStyle: { color: "#fff" },
    //   },
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
            backgroundImage="linear-gradient(to bottom, #036CCF , #004687)"
            icon={
              <HugeiconsIcon
                icon={UserGroupIcon}
                color="white"
                size={30 * (chartSize === "small" ? 1 : 1.5)}
              />
            }
            label="Completed Projects"
            description="Completed Projects of Individual Officer"
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
        Officers
      </p>
    </Card>
  );
};

export default CompletedProjectsBarChartTile;

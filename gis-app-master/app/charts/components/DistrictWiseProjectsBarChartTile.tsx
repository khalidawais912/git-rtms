import Button from "@/app/components/Button";
import {
  ArrowUpRight03Icon,
  Location01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Card from "./Card";
import TileLabel from "./TileLabel";
import MySimpleBarChart, {
  ChartGradient,
  MyBarChartStyle,
  MyBarChartType,
} from "@/app/components/Charts/BarChart/MySimpleBarChart";
import { DistrictProject } from "../page";
import { getBlueGradientColor } from "./AssignProjectPartTwoBarChartTile";

interface Props {
  data: DistrictProject[];
  chartSize?: "small" | "large";
}

const DistrictWiseProjectsBarChartTile = ({
  chartSize = "small",
  data,
}: Props) => {
  const myChartData: MyBarChartType[] = data.map((item, i) => ({
    label: item.districtName,
    value: item.totalProject, // 🔥 dynamic field access
    gradient: getBlueGradientColor(`dp-gradient-color-${i}`),
  }));
  // const gradientColor: ChartGradient = {
  //   id: "my-gradient-color-3",
  //   from: "#036CCF",
  //   to: "#004687",
  //   direction: "vertical", // optional
  // };

  // const data: MyBarChartType[] = [
  //   {
  //     label: "Abbottabad",
  //     value: 50,
  //     season: "Nov-Jun",
  //     percentage: 98.94,
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Astore",
  //     value: 25,
  //     season: "Dec-Jan",
  //     percentage: 0.05,
  //     color: "#3BA2F1",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Bahawalnagar",
  //     value: 60,
  //     season: "Aug-Oct",
  //     percentage: 0.17,
  //     color: "#FFD700",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Bahawalpur",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Bannu",
  //     value: 55,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Batagram",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Bhakkar",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Buner",
  //     value: 70,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Chakwal",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Chaman",
  //     value: 25,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Charsadda",
  //     value: 25,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Dera Ghazi Khan",
  //     value: 25,
  //     season: "Dec-Jan",
  //     percentage: 0.05,
  //     color: "#3BA2F1",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Dera Ismail Khan",
  //     value: 60,
  //     season: "Aug-Oct",
  //     percentage: 0.17,
  //     color: "#FFD700",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Faisalabad",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Ghotki",
  //     value: 55,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Gujranwala",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Gujrat",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Hangu",
  //     value: 70,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Hafizabad",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Haripur",
  //     value: 25,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Jhelum",
  //     value: 25,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Kashmore",
  //     value: 50,
  //     season: "Nov-Jun",
  //     percentage: 98.94,
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Khanewal",
  //     value: 25,
  //     season: "Dec-Jan",
  //     percentage: 0.05,
  //     color: "#3BA2F1",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Lahore",
  //     value: 60,
  //     season: "Aug-Oct",
  //     percentage: 0.17,
  //     color: "#FFD700",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Larkana",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Mandi Bahauddin",
  //     value: 55,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Mardan",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Mirpur",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Multan",
  //     value: 70,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Muzaffargarh",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Nankana Sahib",
  //     value: 25,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Narowal",
  //     value: 25,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Nowshera",
  //     value: 50,
  //     season: "Nov-Jun",
  //     percentage: 98.94,
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Okara",
  //     value: 25,
  //     season: "Dec-Jan",
  //     percentage: 0.05,
  //     color: "#3BA2F1",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Peshawar",
  //     value: 60,
  //     season: "Aug-Oct",
  //     percentage: 0.17,
  //     color: "#FFD700",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Quetta",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Rahim Yar Khan",
  //     value: 55,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Rajanpur",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Rawalpindi",
  //     value: 60,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Sahiwal",
  //     value: 70,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Sargodha",
  //     value: 40,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  //   {
  //     label: "Shaheed Benazirabad",
  //     value: 25,
  //     season: "Jun-Nov",
  //     percentage: 0.83,
  //     color: "#ff2b2b",
  //     gradient: gradientColor,
  //   },
  // ];

  const smallChartStyle: MyBarChartStyle = {
    height: 292,
    barSize: 20,
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
    barSize: 30,
    fallbackBarColor: "#2563EB",
    barRadius: [40, 40, 40, 40],
    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 18,
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
                icon={Location01Icon}
                color="white"
                size={30 * (chartSize === "small" ? 1 : 1.5)}
              />
            }
            label="District-wise Projects"
            description="Counts of project district-wise"
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
                backgroundImage: "linear-gradient(to bottom, #036CCF, #004687)",
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

export default DistrictWiseProjectsBarChartTile;

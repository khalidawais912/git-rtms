import {
  MyBarChartStyle,
  MyBarChartType,
} from "@/app/components/Charts/BarChart/MySimpleBarChart";
import MySimpleBarChart from "@/app/components/Charts/BarChart/MySimpleBarChart";

interface Props {
  tinyBarChartData: MyBarChartType[];
  style?: MyBarChartStyle;
}

const BarChartPreview = ({ tinyBarChartData, style }: Props) => {
  return <MySimpleBarChart data={tinyBarChartData} style={style} />;
};

export default BarChartPreview;

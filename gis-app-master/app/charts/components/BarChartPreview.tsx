import { MyBarChartStyle, MyBarChartType } from "@/shared/components/types";
import MySimpleBarChart from "@/shared/components/Charts/BarChart/MySimpleBarChart";

interface Props {
  tinyBarChartData: MyBarChartType[];
  style?: MyBarChartStyle;
}

const BarChartPreview = ({ tinyBarChartData, style }: Props) => {
  return <MySimpleBarChart data={tinyBarChartData} style={style} />;
};

export default BarChartPreview;

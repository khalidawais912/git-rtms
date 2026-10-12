"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export interface ChartGradient {
  id: string;
  from: string;
  to: string;
  direction?: "vertical" | "horizontal";
}

export interface PieItem {
  label: string;
  value: number;
  color?: string;
  gradient?: ChartGradient;

  [key: string]: any; // ✅ REQUIRED for Recharts
}

export interface TwoLevelPieData {
  outer: PieItem[]; // level 1
  inner: PieItem[]; // level 2
}

interface Props {
  data: TwoLevelPieData;
  style?: MyTwoLevelPieChartStyle;
}

const MyTwoLevelPieChart = ({
  data,
  style = defaultTwoLevelPieChartStyle,
}: Props) => {
  return (
    <ResponsiveContainer width="100%" height={style.height ?? 300}>
      <PieChart>
        {/* ================= SVG GRADIENTS ================= */}
        <defs>
          {[...data.outer, ...data.inner].map(
            (item) =>
              item.gradient && (
                <linearGradient
                  key={item.gradient.id}
                  id={`pieGradient-${item.gradient.id}`}
                  x1="0"
                  y1="0"
                  x2={item.gradient.direction === "horizontal" ? "1" : "0"}
                  y2={item.gradient.direction === "horizontal" ? "0" : "1"}
                >
                  <stop offset="0%" stopColor={item.gradient.from} />
                  <stop offset="100%" stopColor={item.gradient.to} />
                </linearGradient>
              ),
          )}
        </defs>

        {/* ================= OUTER PIE ================= */}
        <Pie
          data={data.outer}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={style.outerInnerRadius ?? "45%"}
          outerRadius={style.outerOuterRadius ?? "60%"}
          label={style.outerLabel ?? renderOuterValue}
          fill={style.label?.color ?? "#fff"}
          fontSize={style.label?.outerFontSize ?? 11}
        >
          {data.outer.map((entry, index) => (
            <Cell
              key={`outer-${index}`}
              fill={
                entry.gradient
                  ? `url(#pieGradient-${entry.gradient.id})`
                  : (entry.color ?? "#8884d8")
              }
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
          ))}
        </Pie>

        {/* ================= INNER PIE ================= */}
        <Pie
          data={data.inner}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={style.innerInnerRadius ?? "65%"}
          outerRadius={style.innerOuterRadius ?? "80%"}
          label={style.outerLabel ?? renderInnerLabel}
          fill={style.label?.color ?? "#fff"}
          fontSize={style.label?.innerFontSize ?? 11}
        >
          {data.inner.map((entry, index) => (
            <Cell
              key={`inner-${index}`}
              fill={
                entry.gradient
                  ? `url(#pieGradient-${entry.gradient.id})`
                  : (entry.color ?? "#82ca9d")
              }
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
          ))}
        </Pie>

        <Tooltip {...style.tooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MyTwoLevelPieChart;

import { PieLabelRenderProps } from "recharts";

const renderInnerLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;

  if (
    midAngle == null ||
    innerRadius == null ||
    outerRadius == null ||
    !payload?.label
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#fff"
      fontSize={11}
      fontWeight={500}
      pointerEvents="none"
    >
      {payload.label}
    </text>
  );
};

const renderOuterValue = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;

  if (
    midAngle == null ||
    innerRadius == null ||
    outerRadius == null ||
    value == null
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#fff"
      fontSize={12}
      fontWeight={600}
      pointerEvents="none"
    >
      {value}
    </text>
  );
};

export interface MyTwoLevelPieChartStyle {
  height?: number;

  // Outer ring
  outerInnerRadius?: number | string;
  outerOuterRadius?: number | string;

  // Inner ring
  innerInnerRadius?: number | string;
  innerOuterRadius?: number | string;

  outerLabel?: boolean;
  innerLabel?: boolean;

  label?: {
    innerFontSize?: number;
    outerFontSize?: number;
    color?: string;
  };

  stroke?: string;
  strokeWidth?: number;

  tooltip?: TooltipProps<ValueType, NameType>;
}

export const tooltipStyles = {
  contentStyle: {
    backgroundColor: "#1E1B39",
    border: "0px",
    borderRadius: "0px",
    padding: "10px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  labelStyle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
  },
  itemStyle: {
    fontSize: "14px",
    fontWeight: "normal",
    color: "#fff",
  },
};

export const defaultTwoLevelPieChartStyle: MyTwoLevelPieChartStyle = {
  height: 300,

  outerInnerRadius: "45%",
  outerOuterRadius: "60%",

  innerInnerRadius: "65%",
  innerOuterRadius: "80%",

  outerLabel: false,
  innerLabel: true,

  stroke: "#fff",
  strokeWidth: 1,
};

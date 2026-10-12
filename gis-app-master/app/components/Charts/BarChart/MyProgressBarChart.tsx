"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { formatAmountWithCommas } from "../../../utils";
import { calculateLeftMargin, calculateXAxisHeight } from "../types";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export interface StackValue {
  value: number;
  color?: string;
  gradient?: StackBarGradient;
}

export interface MyStackBarChartType {
  label: string;

  value1: StackValue;
  value2: StackValue;

  total?: number;
}

interface Props {
  data: MyStackBarChartType[];
  layout?: "vertical" | "horizontal";
  style?: MyStackBarChartStyle;
}

export interface StackBarGradient {
  id: string;
  from: string;
  to: string;
  direction?: "vertical" | "horizontal";
}

export interface StackBarSegmentStyle {
  /** Must match dataKey in Bar */
  key: string;

  color?: string;
  gradient?: StackBarGradient;

  /** Rounded corners per stack */
  radius?: [number, number, number, number];
}

export interface MyStackBarChartStyle {
  height?: number;
  barSize?: number;

  /** All stack segments */
  stacks: StackBarSegmentStyle[];

  grid?: {
    stroke?: string;
    strokeDasharray?: string;
    vertical?: boolean;
    horizontal?: boolean;
  };

  axis?: {
    tickColor?: string;
    fontSize?: number;
    padding?: {
      left?: number;
      right?: number;
    };
  };

  tooltip?: TooltipProps<ValueType, NameType>;

  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const MyProgressBarChart = ({
  data,
  layout = "horizontal",
  style = defaultStackBarChartStyle,
}: Props) => {
  const fontSize = style?.axis?.fontSize ?? 12;

  const normalizedData = data.map((d) => ({
    label: d.label,
    total: d.value2.value,
    gain: Math.min(d.value1.value, d.value2.value), // safety
  }));

  const leftMargin = calculateLeftMargin(
    normalizedData.map((d) => ({
      label: d.label,
      value: d.total,
    })),
    fontSize,
    layout,
  );

  const xAxisHeight = calculateXAxisHeight(
    data.map((d) => d.label),
    fontSize - 10,
  );

  return (
    <ResponsiveContainer width="100%" height={style?.height ?? 300}>
      <BarChart
        layout={layout}
        data={normalizedData}
        barSize={style?.barSize ?? 25}
        margin={{
          top: 20,
          right: 20,
          bottom: xAxisHeight,
          left: leftMargin,
        }}
      >
        {/* GRADIENTS */}
        <defs>
          {data.flatMap((row) =>
            [row.value1, row.value2]
              .filter((v) => v.gradient)
              .map((v) => (
                <linearGradient
                  key={v.gradient!.id}
                  id={`barGradient-${v.gradient!.id}`}
                  x1="0"
                  y1="0"
                  x2={v.gradient!.direction === "horizontal" ? "1" : "0"}
                  y2={v.gradient!.direction === "horizontal" ? "0" : "1"}
                >
                  <stop offset="0%" stopColor={v.gradient!.from} />
                  <stop offset="100%" stopColor={v.gradient!.to} />
                </linearGradient>
              )),
          )}
        </defs>

        {/* AXES */}
        <XAxis dataKey="label" scale="point" />
        <YAxis />

        <CartesianGrid strokeDasharray="5 3" />
        <Tooltip />

        {/* TOTAL (background) */}
        <Bar dataKey="total" radius={[20, 20, 20, 20]} fill="#E5E7EB" />

        {/* GAIN (progress) */}
        <Bar
          dataKey="gain"
          radius={[20, 20, 20, 20]}
          barSize={(style?.barSize ?? 26) - 6} // thinner = visible overlay
        >
          {data.map((row, index) => (
            <Cell
              key={index}
              fill={
                row.value1.gradient
                  ? `url(#barGradient-${row.value1.gradient.id})`
                  : (row.value1.color ?? "#22C55E")
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MyProgressBarChart;

export const defaultStackBarChartStyle: MyStackBarChartStyle = {
  height: 228,
  barSize: 26,

  stacks: [
    {
      key: "value1", // 👈 MUST match data
      color: "#22C55E",
      radius: [20, 20, 0, 0],
    },
    {
      key: "value2", // 👈 MUST match data
      color: "#F59E0B",
      radius: [20, 20, 0, 0],
    },
  ],

  axis: {
    tickColor: "rgba(0,0,0,.7)",
    fontSize: 12,
  },
};

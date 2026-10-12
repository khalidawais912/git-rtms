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
import { VerticalTick } from "./MySimpleBarChart";

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
  xAxisLabelOrientation?: "horizontal" | "vertical";
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
  name?: string;
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

const MyStackBarChart = ({
  data,
  layout = "horizontal",
  style = defaultStackBarChartStyle,
  xAxisLabelOrientation = "horizontal",
}: Props) => {
  const fontSize = style?.axis?.fontSize ?? 12;

  // use total if present, otherwise sum stacks
  const normalizedData = data.map((d) => ({
    label: d.label,
    value1: d.value1.value,
    value2: d.value2.value,
  }));

  const leftMargin = calculateLeftMargin(
    normalizedData.map((d) => ({
      label: d.label,
      value: d.value1 + d.value2,
    })),
    fontSize,
    layout,
  );

  const xAxisHeight =
    xAxisLabelOrientation === "vertical"
      ? calculateXAxisHeight(
          data.map((d) => d.label),
          fontSize,
          xAxisLabelOrientation,
        )
      : calculateXAxisHeight(
          data.map((d) => d.label),
          fontSize,
        );

  return (
    <ResponsiveContainer width="100%" height={style?.height ?? 300}>
      <BarChart
        layout={layout}
        data={normalizedData}
        barSize={style?.barSize ?? 25}
        margin={{
          top: style?.margin?.top ?? 20,
          right: style?.margin?.right ?? 20,
          bottom: xAxisHeight,
          left: leftMargin,
        }}
      >
        {/* ================= SVG GRADIENTS ================= */}
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
        <XAxis
          dataKey="label"
          scale="point"
          interval={0}
          tick={
            xAxisLabelOrientation === "vertical" ? (
              <VerticalTick
                fontSize={style?.axis?.fontSize ?? 12}
                fill={style?.axis?.tickColor ?? "#fff"}
              />
            ) : (
              {
                fill: style?.axis?.tickColor ?? "#fff",
                fontSize: style?.axis?.fontSize ?? 12,
              }
            )
          }
          padding={{
            left: style?.axis?.padding?.left ?? 30,
            right: style?.axis?.padding?.right ?? 30,
          }}
        />
        <YAxis
          tickFormatter={(value) =>
            `${formatAmountWithCommas(Number(value), 0)}`
          }
        />

        {/* GRID + TOOLTIP */}
        <CartesianGrid strokeDasharray="5 3" />
        <Tooltip {...(style?.tooltip ?? {})} />

        {/* STACKED BARS */}
        {style.stacks.map((stack) => (
          <Bar
            key={stack.key}
            dataKey={stack.key}
            stackId="a"
            name={stack.name ?? stack.key}
            radius={stack.radius}
          >
            {data.map((row, index) => {
              const seg = row[stack.key as "value1" | "value2"];

              return (
                <Cell
                  key={index}
                  fill={
                    seg.gradient
                      ? `url(#barGradient-${seg.gradient.id})`
                      : (seg.color ?? stack.color)
                  }
                />
              );
            })}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MyStackBarChart;

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

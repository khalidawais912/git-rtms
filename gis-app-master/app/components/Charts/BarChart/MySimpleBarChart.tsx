"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { calculateLeftMargin, calculateXAxisHeight } from "../types";
import { formatAmountWithCommas } from "@/app/utils";

export interface ChartGradient {
  id: string;
  from: string;
  to: string;
  direction?: "vertical" | "horizontal";
}

export interface MyBarChartType {
  label: string;
  value: number;
  season?: string;
  percentage?: number;
  color?: string; // solid color
  gradient?: ChartGradient; // optional gradient
}

interface Props {
  data: MyBarChartType[];
  layout?: "vertical" | "horizontal";
  style?: MyBarChartStyle;
  unit?: string;
  xAxisLabelOrientation?: "horizontal" | "vertical";
  showLabels?: boolean;
}

const MySimpleBarChart = ({
  data,
  layout = "horizontal",
  style = defaultVerticalChartStyle,
  unit = "",
  xAxisLabelOrientation = "horizontal",
  showLabels = true,
}: Props) => {
  const fontSize = style?.axis?.fontSize ?? 12;

  const leftMargin = calculateLeftMargin(data, fontSize, layout);

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
    <ResponsiveContainer
      width="100%"
      height={style?.height ?? 300}
      className="!overflow-hidden"
    >
      <BarChart
        layout={layout}
        data={data}
        barSize={style?.barSize ?? 25}
        margin={{
          top: style?.margin?.top ?? 20,
          right: style?.margin?.right ?? 20,
          bottom: style?.margin?.bottom,
          left: leftMargin,
        }}
      >
        {/* ================= SVG GRADIENTS ================= */}
        <defs>
          {data.map((entry) =>
            entry.gradient ? (
              <linearGradient
                key={`barGradient-${entry.gradient.id}`}
                id={`barGradient-${entry.gradient.id}`}
                x1="0"
                y1="0"
                x2={entry.gradient.direction === "horizontal" ? "1" : "0"}
                y2={entry.gradient.direction === "horizontal" ? "0" : "1"}
              >
                <stop offset="0%" stopColor={entry.gradient.from} />
                <stop offset="100%" stopColor={entry.gradient.to} />
              </linearGradient>
            ) : null,
          )}
        </defs>

        {/* ================= AXES ================= */}
        {layout === "vertical" ? (
          <>
            <XAxis
              type="number"
              domain={[0, "dataMax + 10"]}
              tick={{
                fill: style?.axis?.tickColor ?? "#fff",
                fontSize: style?.axis?.fontSize ?? 12,
              }}
              height={xAxisHeight} // ✅ AUTO height
              tickFormatter={(value) =>
                `${formatAmountWithCommas(Number(value), 0)}${unit}`
              }
            />
            <YAxis
              type="category"
              dataKey="label"
              width="auto"
              interval={0}
              tick={{
                fill: style?.axis?.tickColor ?? "#fff",
                fontSize: style?.axis?.fontSize ?? 12,
              }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="label"
              scale="point"
              interval={0}
              height={xAxisHeight} // ✅ AUTO height
              padding={{
                left: style?.axis?.padding?.left ?? 30,
                right: style?.axis?.padding?.right ?? 30,
              }}
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
            />

            <YAxis
              tick={{
                fill: style?.axis?.tickColor ?? "#fff",
                fontSize: style?.axis?.fontSize ?? 12,
              }}
              tickFormatter={(value) =>
                `${formatAmountWithCommas(Number(value), 0)}${unit}`
              }
            />
          </>
        )}

        {/* ================= TOOLTIP & GRID ================= */}
        <Tooltip
          {...style?.tooltip}
          cursor={{ fill: "transparent" }}
          labelFormatter={(label) => label}
          // formatter={(value, _name, props) => {
          formatter={(value) => {
            return [
              `${formatAmountWithCommas(Number(value), 0)}${unit}`,
              // props.payload.label, // 👈 replaces "value"
            ];
          }}
        />

        <CartesianGrid
          stroke={style?.grid?.stroke ?? "rgba(53,82,151,0.4)"}
          strokeDasharray={style?.grid?.strokeDasharray ?? "5 3"}
          vertical={style?.grid?.vertical ?? true}
          horizontal={style?.grid?.horizontal ?? true}
        />

        {/* ================= BAR ================= */}
        <Bar
          dataKey="value"
          radius={
            style?.barRadius ??
            (layout === "vertical" ? [0, 10, 10, 0] : [10, 10, 0, 0])
          }
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.gradient
                  ? `url(#barGradient-${entry.gradient.id})`
                  : (entry.color ?? style?.fallbackBarColor ?? "#EAA64D")
              }
            />
          ))}
          {/* Show Percentage On Top of Bar */}
          {showLabels && (
            <LabelList
              dataKey="value"
              position={layout === "vertical" ? "right" : "top"}
              formatter={(val) => `${val} ${unit}`}
              dx={8}
              fontSize={style?.axis?.fontSize ?? 12}
              fill="#fff"
            />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MySimpleBarChart;

export interface MyBarChartStyle {
  height?: number;
  barSize?: number;

  barRadius?: [number, number, number, number];
  fallbackBarColor?: string;

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

    marginScaleFactor?: number;
  };

  tooltip?: TooltipProps<ValueType, NameType>;

  label?: {
    fontSize?: number;
    valueColor?: string;
    percentageColor?: string;
    seasonColor?: string;
  };

  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
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

export const defaultVerticalChartStyle: MyBarChartStyle = {
  height: 311,
  barSize: 10,
  fallbackBarColor: "#2563EB",
  barRadius: [0, 20, 20, 0],
  axis: {
    tickColor: "#fff",
    fontSize: 12,
    marginScaleFactor: 0,
  },

  margin: {
    bottom: 0,
    right: 20,
  },
  label: {
    fontSize: 10,
    percentageColor: "#fff",
    valueColor: "#fff",
    seasonColor: "#fff",
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

// const WrappedTick = ({
//   x,
//   y,
//   payload,
//   fontSize,
//   fill,
//   lineGap = 2,
//   offset = 20, // 👈 distance from axis line
// }: {
//   x?: number;
//   y?: number;
//   payload?: { value: string };
//   fontSize: number;
//   fill: string;
//   lineGap?: number;
//   offset?: number;
// }) => {
//   if (!payload?.value || x == null || y == null) return null;

//   const words = payload.value.split(" ");

//   return (
//     <text x={x} y={y} textAnchor="middle" fill={fill}>
//       {words.map((word, index) => (
//         <tspan
//           key={index}
//           x={x}
//           dy={index === 0 ? offset : fontSize + lineGap}
//           fontSize={fontSize}
//         >
//           {word}
//         </tspan>
//       ))}
//     </text>
//   );
// };

interface VerticalTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string | number;
  };
  fill?: string;
  fontSize?: number;
}

export const VerticalTick = ({
  x = 0,
  y = 0,
  payload,
  fill = "#fff",
  fontSize = 12,
}: VerticalTickProps) => {
  if (!payload) return null;

  return (
    <text
      x={x}
      y={y}
      dy={8}
      textAnchor="end"
      transform={`rotate(-90, ${x}, ${y})`}
      fill={fill}
      fontSize={fontSize}
    >
      {payload.value}
    </text>
  );
};

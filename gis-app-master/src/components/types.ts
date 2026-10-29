import type { StaticImageData } from "next/image";
import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

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

export interface StackBarGradient {
  id: string;
  from: string;
  to: string;
  direction?: "vertical" | "horizontal";
}

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

export interface PieItem {
  label: string;
  value: number;
  color?: string;
  gradient?: ChartGradient;

  [key: string]: unknown; // ✅ REQUIRED for Recharts
}

export interface TwoLevelPieData {
  outer: PieItem[]; // level 1
  inner: PieItem[]; // level 2
}

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

export type AnimationSpeed = "normal" | "slow" | "fast";

export type OptionType = { value: string; label: string };

export type ControlType = "switch" | "checkbox" | "radio";

export interface Data {
  name: string;
  nameId: string;
  link: string;
  icon: StaticImageData | string;
  backgroundColor: string;
}

export interface Option {
  value: string | number;
  label: string;
}

function estimateTextWidth(text: string, fontSize: number) {
  return Math.ceil(text.length * fontSize * 0.6);
}

export function calculateLeftMargin<T extends { label: string; value: number }>(
  data: T[],
  fontSize: number,
  layout: "horizontal" | "vertical" = "horizontal",
  suffix = "",
  scale = 1,
) {
  if (layout === "vertical") {
    // Y axis shows category labels (long text)
    const longestLabel = data.reduce(
      (longest, d) => (d.label?.length > longest.length ? d.label : longest),
      "",
    );
    return estimateTextWidth(longestLabel, fontSize) * scale + 16;
  }

  // horizontal layout — Y axis shows numeric tick values
  const maxValue = Math.max(...data.map((d) => d.value));
  const longestTick = `${maxValue.toLocaleString()}${suffix}`;

  return estimateTextWidth(longestTick, fontSize) * scale + 16;
}

export function calculateXAxisHeight(
  labels: string[],
  fontSize: number,
  xAxisLabelOrientation: "horizontal" | "vertical" = "horizontal",
  lineGap = 2,
  baseOffset = 16,
) {
  if (xAxisLabelOrientation === "horizontal") {
    return fontSize + baseOffset; // default recharts height is fine, no calculation needed
  }

  const longestLabel = labels.reduce(
    (longest, label) => (label?.length > longest.length ? label : longest),
    "",
  );

  // each character is approximately 0.6x the fontSize wide
  const estimatedTextWidth = longestLabel.length * fontSize * 0.6;

  return estimatedTextWidth + baseOffset;
}

export const getGradientId = (label: string) =>
  `bar-gradient-${label.replace(/\s+/g, "-").toLowerCase()}`;

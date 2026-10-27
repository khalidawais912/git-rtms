import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  description: string;
  chartSize: "large" | "small";
  backgroundImage?: string;
}

const TileLabel = ({
  icon,
  label,
  description,
  chartSize,
  backgroundImage = "linear-gradient(to bottom, #21C35D , #17A74C)",
}: Props) => {
  return (
    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
      <div
        style={{
          backgroundImage,
          padding: "6px",
          borderRadius: "10px",
        }}
      >
        {icon}
      </div>
      <div className="d-flex gap-0 flex-column">
        <p
          className="m-0 fw-6"
          style={{ fontSize: 16 * (chartSize === "small" ? 1 : 1.5) + "px" }}
        >
          {label}
        </p>
        <p
          className="fw-5 m-0"
          style={{
            color: "#6B7280",
            fontSize: 12 * (chartSize === "small" ? 1 : 1.5) + "px",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default TileLabel;

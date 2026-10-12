import { useEffect, useState } from "react";
import { SingleProjectDashboard } from "../ProjectDetailsDashboard";
import { getCpiStatus, getSpiStatus } from "@/app/utils";

interface Props {
  spi: number;
  cpi: number;
  projectRating: number;
}

const MRIStatusScaled = ({ spi, cpi, projectRating }: Props) => {
  return (
    <div
      className="col"
      style={{
        background: "#1D1F25",
        padding: "12px",
        borderRadius: "9px",
      }}
    >
      <div
        style={{
          background: "#393B41",
          padding: "2.8px 2.6px",
          borderRadius: "2.5px",
          marginBottom: "8px",
        }}
      >
        <p className="m-0 fs10px fw-bold text-center text-white">MRI Status</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fs14px fw-bold text-white">{projectRating}</span>
          <span
            className="badge fs9px fw-6 rounded-pill"
            style={{
              padding: "3.8px 13px",
              color: "#1D1F25",
              background:
                projectRating > 70
                  ? "linear-gradient(to bottom right, rgba(115, 255, 64,1) , rgba(79, 227, 20,1), rgba(89, 230, 19,1),rgba(72, 223, 17,1),rgba(163, 197, 11,1))"
                  : projectRating <= 70 && projectRating >= 35
                    ? "#DFE012"
                    : projectRating < 35
                      ? "linear-gradient(to bottom right, rgba(255, 64, 64,1) , rgba(227, 20, 20,1), rgba(230, 19, 19,1),rgba(223, 17, 17,1),rgba(197, 11, 11,1))"
                      : "",
            }}
          >
            {projectRating > 70
              ? "Good"
              : projectRating <= 70 && projectRating >= 35
                ? "Average"
                : projectRating < 35
                  ? "Critical"
                  : ""}
          </span>
        </div>
      </div>
      <div
        className="d-flex flex-column gap-1"
        style={{
          background: "#393B41",
          padding: "3.5px 4px",
          borderRadius: "2.5px",
        }}
      >
        <p className="m-0 fs10px fw-bold text-center text-white">
          Earned Value Analysis
        </p>
        <div>
          <p className="m-0 fw-6 fs9px text-white mb-1">
            {getSpiStatus(spi).message}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold fs14px text-white">SPI= {spi}</span>
            <span
              className="badge fs9px fw-6 rounded-pill"
              style={{
                padding: "3.8px 13px",
                color: "#393B41",
                background: "#39FB3F",
              }}
            >
              On Schedule
            </span>
          </div>
        </div>
        <div>
          <p className="m-0 fw-6 fs9px text-white mb-1">
            {getCpiStatus(spi).message}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold fs14px text-white">CPI= {cpi}</span>
            <span
              className="badge fs9px fw-6 rounded-pill text-white"
              style={{
                padding: "3.8px 13px",
                background: "#038907",
              }}
            >
              Ahead
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRIStatusScaled;

import { formatDateTime } from "@/app/utils";
import { useEffect, useState } from "react";
import { StaffTracking } from "../StaffTracking";

interface Props {
  data: StaffTracking;
  startLocation: string | undefined;
  endLocation: string | undefined;
  width?: string;
  distance?: string;
  googleDuration?: string;
  officerDuration?: string;
}

const TimelineCard = ({
  data,
  startLocation,
  endLocation,
  googleDuration,
  officerDuration,
}: Props) => {
  const [timeSpent, setTimeSpent] = useState<string>();
  const parseDurationToMinutes = (duration: string): number => {
    const [value, unit] = duration.split(" ");
    const numericValue = parseInt(value, 10);

    if (unit.toLowerCase().startsWith("min")) {
      return numericValue;
    } else if (unit.toLowerCase().startsWith("hou")) {
      return numericValue * 60;
    } else if (unit.toLowerCase().startsWith("day")) {
      return numericValue * 24 * 60;
    }
    return 0;
  };

  const formatMinutesToReadableTime = (minutes: number): string => {
    const absMinutes = Math.abs(minutes); // Handle negative durations
    const hours = Math.floor(absMinutes / 60);
    const remainingMinutes = absMinutes % 60;

    const hourString = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : "";
    const minuteString =
      remainingMinutes > 0
        ? `${remainingMinutes} min${remainingMinutes > 1 ? "s" : ""}`
        : "";

    // Combine non-empty parts
    return [hourString, minuteString].filter(Boolean).join(", ");
  };

  const calculateTimeSpent = (
    officerDuration: string,
    googleDuration: string
  ): string => {
    const officerMinutes = parseDurationToMinutes(officerDuration);
    const googleMinutes = parseDurationToMinutes(googleDuration);

    const differenceInMinutes = officerMinutes - googleMinutes;

    const formattedTime = formatMinutesToReadableTime(differenceInMinutes);
    return differenceInMinutes < 0
      ? `${formattedTime} less`
      : `${formattedTime}`;
  };

  useEffect(() => {
    if (officerDuration && googleDuration) {
      const timeSpent = calculateTimeSpent(officerDuration, googleDuration);
      setTimeSpent(timeSpent);
    }
  }, [officerDuration, googleDuration]);

  return (
    <div className="col">
      <div
        className="p-2 mb-2 shadow"
        style={{
          borderRadius: "5px",
          border: "1px solid #fff",
          background: "rgba(255, 255, 255, 0.62)",
        }}
      >
        <div className="row d-flex flex-wrap m-0">
          <div className="col-auto mb-1">
            <p className="m-0 fs14px fw-normal" style={{ color: "#7A889C" }}>
              Start Location
            </p>
            <p className="m-0 fs-6 fw-normal">{startLocation}</p>
          </div>
          <div className="col-auto img-fluid">
            <img
              src="/icons/verticalLine.svg"
              alt="verticalLine"
              className="img-fluid"
              style={{ width: "100%", height: "30px" }}
            />
          </div>
          <div className="col-auto">
            <p className="m-0 fs14px fw-normal" style={{ color: "#7A889C" }}>
              End Location
            </p>
            <p className="m-0 fs-6 fw-normal">{endLocation}</p>
          </div>
        </div>
        <br />
        <div className="row d-flex flex-wrap m-0 mb-2">
          <div className="col-auto">
            <p className="fs14px m-0 fw-normal" style={{ color: "#7A889C" }}>
              Visit Start Date
            </p>
            <p className="fs-6 m-0 fw-normal">
              {formatDateTime(data.visitStartTime, "date")}
            </p>
          </div>
          <div className="col-auto img-fluid">
            <img
              src="/icons/verticalLine.svg"
              alt="verticalLine"
              className="img-fluid"
              style={{ width: "100%", height: "30px" }}
            />
          </div>
          <div className="col-auto">
            <p className="fs14px m-0 fw-normal" style={{ color: "#7A889C" }}>
              Visit End Date
            </p>
            <p className="fs-6 m-0 fw-normal">
              {data.status === "completed"
                ? formatDateTime(data.visitEndTime, "date")
                : "---"}
            </p>
          </div>
          <div className="col-auto img-fluid">
            <img
              src="/icons/verticalLine.svg"
              alt="verticalLine"
              className="img-fluid"
              style={{ width: "100%", height: "30px" }}
            />
          </div>
          <div className="col-auto">
            <p className="fs14px m-0 fw-normal" style={{ color: "#7A889C" }}>
              Visit Start Time
            </p>
            <p className="fs-6 m-0 fw-normal">
              {formatDateTime(data.visitStartTime, "time")}
            </p>
          </div>
          <div className="col-auto img-fluid">
            <img
              src="/icons/verticalLine.svg"
              alt="verticalLine"
              className="img-fluid"
              style={{ width: "100%", height: "30px" }}
            />
          </div>
          <div className="col-auto">
            <p className="fs14px m-0 fw-normal" style={{ color: "#7A889C" }}>
              Visit End Time
            </p>
            <p className="fs-6 m-0 fw-normal">
              {data.status === "completed"
                ? formatDateTime(data.visitEndTime, "time")
                : "---"}
            </p>
          </div>
          <div className="col-auto img-fluid">
            <img
              src="/icons/verticalLine.svg"
              alt="verticalLine"
              className="img-fluid"
              style={{ width: "100%", height: "30px" }}
            />
          </div>
          <div
            className="col-auto badge"
            style={{ background: "rgba(37, 168, 22,.7)" }}
          >
            <p className="fs14px mb-1 fw-normal" style={{ color: "#fff" }}>
              Time Spent on Project Site
            </p>
            <p className="fs-6 m-0 fw-normal">{timeSpent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;

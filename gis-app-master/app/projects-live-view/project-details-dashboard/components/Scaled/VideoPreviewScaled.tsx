import React from "react";
import Header from "../Header";
import { SingleProjectDashboard } from "../ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const VideoPreviewScaled = ({ data }: Props) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "540px", // 👈 set a height!
        border: "1px solid #fff",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px",
        }}
        loop
        autoPlay
        playsInline
        muted
      >
        <source src="/video/bgVideoNew.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Header data={data} />
      <div
        className="position-absolute w-100 bottom-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0) , rgba(0, 0, 0, 1))",
          borderBottomRightRadius: "5px",
          borderBottomLeftRadius: "5px",
          height: "80px",
        }}
      ></div>
    </div>
  );
};

export default VideoPreviewScaled;

"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoStreamProps {
  hlsUrl: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({ hlsUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari, which has native HLS support
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    } else {
      console.error("This browser does not support HLS.");
    }
  }, [hlsUrl]);

  return (
    <video ref={videoRef} controls autoPlay muted style={{ width: "100%" }} />
  );
};

export default VideoStream;

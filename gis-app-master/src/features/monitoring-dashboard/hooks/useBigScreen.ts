"use client";
import { useCallback, useEffect, useState } from "react";

/**
 * Projector / TV mode: larger text and the browser goes full screen.
 * Leaving full screen (Esc) also turns the mode off.
 */
export const useBigScreen = () => {
  const [bigScreen, setBigScreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setBigScreen(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleBigScreen = useCallback(async () => {
    const on = !bigScreen;
    setBigScreen(on);
    try {
      if (on && !document.fullscreenElement) await document.documentElement.requestFullscreen();
      if (!on && document.fullscreenElement) await document.exitFullscreen();
    } catch {
      // Full screen can be blocked by the browser; the larger text still applies
    }
  }, [bigScreen]);

  return { bigScreen, toggleBigScreen };
};

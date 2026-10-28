"use client";
/* RTMES loader for loading states.
   - variant="page": route loading / redirects. Keeps the full-screen RTMES loader (AppLoader) on screen.
   - variant="inline" (default): the same design, compact, covering its container (tables, modals, panels).
     The logo fills and the count rises towards 90% until the content arrives and this unmounts. */
import styles from "@/components/AppLoader/AppLoader.module.css";
import { stepMessage } from "@/components/AppLoader/AppLoader";
import LoaderLogo from "@/components/AppLoader/LoaderLogo";
import { holdAppLoader } from "@/components/AppLoader/loaderStore";
import { useEffect, useRef, useState } from "react";

interface Props {
  variant?: "page" | "inline";
}

const CAP = 90;

const InlineLoader = () => {
  const [progress, setProgress] = useState(0);
  const p = useRef(0);

  useEffect(() => {
    let frame: number;
    const step = () => {
      p.current = Math.min(CAP, p.current + Math.max(0.15, (CAP - p.current) * 0.03));
      setProgress(p.current);
      if (p.current < CAP) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={styles.inline} role="status" aria-live="polite">
      <div className={styles.box}>
        <LoaderLogo progress={progress} className={styles.smallLogo} />
        <div className={styles.pct}>
          {Math.round(progress)}
          <small>%</small>
        </div>
        <div className={styles.bar}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.msg}>{stepMessage(progress)}</div>
      </div>
    </div>
  );
};

const PageLoader = () => {
  useEffect(() => holdAppLoader(), []);
  return null;
};

const Loader = ({ variant = "inline" }: Props) =>
  variant === "page" ? <PageLoader /> : <InlineLoader />;

export default Loader;

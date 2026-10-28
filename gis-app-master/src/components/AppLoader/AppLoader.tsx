"use client";
/* RTMES loader (design: rtmes-loader.css / rtmes-loader.js).
   - First open: counts 0 → 90% while the page loads, then to 100% once it has loaded
     (at least 0.9 s, at most 6 s) and fades out.
   - Moving to another page through a link: shows again with "Opening …", counts up while the
     next page loads and finishes when the new page is on screen.
   - While a page-level <Loader variant="page" /> is mounted (route loading, redirects) it stays up.
   The markup is in the server HTML, so the loader is visible before the app's scripts run. */
import { inter } from "@/styles/fonts";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AppLoader.module.css";
import LoaderLogo from "./LoaderLogo";
import { getPendingLoads, subscribeAppLoader } from "./loaderStore";

const STEPS: [number, string][] = [
  [0, "Connecting to RTMES…"],
  [30, "Loading projects & visits…"],
  [65, "Preparing map & reports…"],
  [100, "Ready"],
];

const MIN_MS = 900; // shortest time the loader stays up
const MAX_MS = 6000; // stop waiting for the page after this (page-level loads still hold it)
const CAP = 90; // counts up to here until the page is ready

export const stepMessage = (p: number) => STEPS.filter((s) => p >= s[0]).pop()![1];

const AppLoader = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState<string | null>(null);

  const p = useRef(0);
  const frame = useRef<number>();
  const ready = useRef(false); // the page (or next page) has loaded
  const started = useRef(0);
  const shown = useRef(true);
  const lastPath = useRef(pathname);

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current!);
    const step = (now: number) => {
      const t = now - started.current;
      const idle = getPendingLoads() === 0;
      const goal = idle && ((ready.current && t > MIN_MS) || t > MAX_MS) ? 100 : CAP;
      p.current = Math.min(goal, p.current + Math.max(0.4, (goal - p.current) * 0.05));
      setProgress(p.current);
      if (p.current >= 100) {
        setTimeout(() => {
          // A new load started during the fade: keep counting
          if (getPendingLoads() > 0) {
            p.current = CAP;
            run();
            return;
          }
          shown.current = false;
          setVisible(false);
          document.body.classList.remove("app-loading");
        }, 260);
        return;
      }
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(
    (message: string | null, isReady: boolean) => {
      p.current = 0;
      ready.current = isReady;
      started.current = performance.now();
      shown.current = true;
      setProgress(0);
      setLabel(message);
      setVisible(true);
      document.body.classList.add("app-loading");
      run();
    },
    [run],
  );

  // First open of the app
  useEffect(() => {
    start(null, document.readyState === "complete");
    const onLoad = () => (ready.current = true);
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(frame.current!);
    };
  }, [start]);

  // Clicking a link to another page of the app
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const name = (a.textContent || "").trim();
      start(name && name.length <= 40 ? `Opening ${name}…` : "Opening…", false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [start]);

  // A page-level load started while the loader was hidden (redirects, route loading)
  useEffect(
    () =>
      subscribeAppLoader((pending) => {
        if (pending > 0 && !shown.current) start(null, true);
        else if (pending > 0 && p.current >= 100) {
          // came back during the fade
          p.current = CAP;
          run();
        }
      }),
    [start, run],
  );

  // The new page is on screen
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    ready.current = true;
  }, [pathname]);

  // Back button restoring a page from cache
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted && getPendingLoads() === 0) {
        shown.current = false;
        setVisible(false);
        document.body.classList.remove("app-loading");
      }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return (
    <div
      className={`${styles.loader} ${visible ? "" : styles.hide} ${inter.className}`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className={styles.box}>
        <LoaderLogo progress={progress} className={styles.logo} />
        <div className={styles.title}>
          RTMES <span>حکومتِ پنجاب</span>
        </div>
        <div className={styles.sub}>Government of the Punjab · Monitoring &amp; Evaluation</div>
        <div className={styles.pct}>
          {Math.round(progress)}
          <small>%</small>
        </div>
        <div className={styles.bar}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.msg}>{label ?? stepMessage(progress)}</div>
      </div>
    </div>
  );
};

export default AppLoader;

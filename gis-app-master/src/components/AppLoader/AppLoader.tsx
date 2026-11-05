"use client";
/* RTMES loader (design: rtmes-loader.css / rtmes-loader.js).
   - Follows the API: every apiClient request made while the loader is up is counted. 0 → 30% for
     the page itself, then 30 → 90% as the responses come back; 100% and fade out once the page
     has loaded and all responses are in (at least 0.9 s; gives up waiting on the API after 30 s).
   - First open of the app, and moving to another page through a link ("Opening …").
   - Requests made after the loader has closed (button clicks, polling) do not bring it back.
   - While a page-level <Loader variant="page" /> is mounted (route loading, redirects) it stays up.
   The markup is in the server HTML, so the loader is visible before the app's scripts run. */
import { inter } from "@/styles/fonts";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AppLoader.module.css";
import LoaderLogo from "./LoaderLogo";
import {
  beginRequestSession,
  endRequestSession,
  getPendingLoads,
  getRequestState,
  subscribeAppLoader,
} from "./loaderStore";

const STEPS: [number, string][] = [
  [0, "Connecting to RTMES…"],
  [30, "Loading projects & visits…"],
  [65, "Preparing map & reports…"],
  [100, "Ready"],
];

const MIN_MS = 900; // shortest time the loader stays up
const MAX_MS = 30000; // never wait longer for slow or hanging API calls (page-level loads still hold it)
const QUIET_MS = 400; // no request in flight for this long = the page's data has arrived
const PAGE_SHARE = 30; // % for opening the page itself, before API responses
const CAP = 90; // highest % until the page and all its API responses are done

export const stepMessage = (p: number) => STEPS.filter((s) => p >= s[0]).pop()![1];

const AppLoader = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState<string | null>(null);
  const [counts, setCounts] = useState<[number, number] | null>(null); // API responses done / requests

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
      const api = getRequestState();
      // All API responses are back and nothing new has started for a moment
      const quiet = api.inFlight === 0 && now - api.lastActivity >= QUIET_MS;
      const finish =
        getPendingLoads() === 0 && ((ready.current && quiet && t > MIN_MS) || t > MAX_MS);
      // Before any request: up to 30%. Then 30% → 90% as responses come back.
      const goal = finish
        ? 100
        : api.started > 0
          ? PAGE_SHARE + ((CAP - PAGE_SHARE) * api.finished) / api.started
          : PAGE_SHARE;
      if (p.current < goal) {
        p.current = Math.min(goal, p.current + Math.max(0.4, (goal - p.current) * 0.08));
        setProgress(p.current);
      }
      setCounts((prev) =>
        api.started === 0
          ? null
          : prev && prev[0] === api.finished && prev[1] === api.started
            ? prev
            : [api.finished, api.started],
      );
      if (p.current >= 100) {
        setTimeout(() => {
          // A new load started during the fade: keep counting
          const waitingForApi =
            getRequestState().inFlight > 0 && performance.now() - started.current < MAX_MS;
          if (getPendingLoads() > 0 || waitingForApi) {
            p.current = CAP;
            run();
            return;
          }
          shown.current = false;
          endRequestSession();
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
      beginRequestSession();
      setCounts(null);
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
        <div className={styles.msg}>
          {label ?? stepMessage(progress)}
          {counts && progress < 100 && (
            <span className={styles.count}>
              {" "}
              · Data {counts[0]}/{counts[1]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLoader;

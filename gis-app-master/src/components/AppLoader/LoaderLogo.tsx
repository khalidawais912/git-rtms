import { CSSProperties } from "react";
import styles from "./AppLoader.module.css";

/** Official logo: a grey copy underneath, the colour copy revealed from the bottom up as progress grows */
const LoaderLogo = ({ progress, className }: { progress: number; className: string }) => (
  <div className={className} aria-hidden="true">
    <div className={`${styles.layer} ${styles.gray}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/logoNew1.svg" alt="" />
    </div>
    <div
      className={`${styles.layer} ${styles.color}`}
      style={{ "--clip": `${100 - progress}%` } as CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/logoNew1.svg" alt="" />
    </div>
  </div>
);

export default LoaderLogo;

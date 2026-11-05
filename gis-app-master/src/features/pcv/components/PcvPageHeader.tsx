"use client";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Pcv.module.css";

interface Props {
  backHref: string;
  backLabel: string;
  /** Breadcrumb after "All Modules"; the last one is the current page. */
  trail: { label: string; href?: string }[];
}

const PcvPageHeader = ({ backHref, backLabel, trail }: Props) => {
  const router = useRouter();
  return (
    <div className={styles.topBar}>
      <button type="button" className={styles.backButton} onClick={() => router.push(backHref)}>
        <ArrowLeft size={18} /> {backLabel}
      </button>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/dashboard">
          <Home size={16} /> All Modules
        </Link>
        {trail.map((item, i) => (
          <span key={item.label} className="d-inline-flex align-items-center gap-2">
            <ChevronRight size={16} />
            {item.href && i < trail.length - 1 ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span className={i === trail.length - 1 ? styles.breadcrumbCurrent : undefined}>
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
};

export default PcvPageHeader;

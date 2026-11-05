"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DashboardTypeEnum } from "@/types/dashboard";
import styles from "./Navbar.module.css";

/** Monitoring / Evaluation switch in the top bar (sets ?dashboardType=) */
const DashboardTypeFilter = () => {
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();
  const isEvaluation = !!searchParams.get("dashboardType");

  const handleStatusChange = useCallback(
    (dashboardType: string) => {
      const query = dashboardType && `?dashboardType=${dashboardType}`;
      router.push(currentPath + query);
    },
    [router, currentPath],
  );

  return (
    <nav className={styles.moduleSwitch} aria-label="System">
      <button
        type="button"
        className={isEvaluation ? "" : styles.switchActive}
        aria-current={isEvaluation ? undefined : "page"}
        onClick={() => isEvaluation && handleStatusChange("")}
      >
        Monitoring
      </button>
      <button
        type="button"
        className={isEvaluation ? styles.switchActive : ""}
        aria-current={isEvaluation ? "page" : undefined}
        onClick={() => !isEvaluation && handleStatusChange(DashboardTypeEnum.EVALUATION)}
      >
        Evaluation
      </button>
    </nav>
  );
};

export default DashboardTypeFilter;

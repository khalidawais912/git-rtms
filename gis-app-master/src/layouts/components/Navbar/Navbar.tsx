"use client";
import { getSession } from "@/utils/session";
import { inter } from "@/styles/fonts";
import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GISMenu from "./GISMenu";
import Spinner from "@/components/Spinner";
import UserDropDown from "../UserDropDown/UserDropDown";
import DashboardTypeFilter from "./DashboardTypeFilter";
import DepartmentCategoryFilter from "./DepartmentCategoryFilter";
import { RootState } from "@/store";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [currentType, setCurrentType] = useState<string | null>();
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();
  const currentPath = usePathname();

  useEffect(() => {
    setCurrentType(searchParams.get("dashboardType"));
  }, [searchParams]);

  const [role, setRole] = useState<string>();
  const [departmentId, setDepartmentId] = useState<number>();

  const currentTutorial = useSelector(
    (state: RootState) => state.tutorial.currentTutorial,
  );

  useEffect(() => {
    const userRole = getSession("role");
    const departmentId = getSession("departmentId");
    if (userRole) setRole(userRole);
    if (departmentId) setDepartmentId(parseInt(departmentId));
  }, []);

  const spinner = (
    <div className="d-flex align-items-center justify-content-center h-100">
      <Spinner color="text-light" />
    </div>
  );

  return (
    <header
      className={`${styles.topbar} ${currentType ? styles.topbarEval : ""} ${inter.className}`}
    >
      <div className={styles.inner}>
        <Link
          className={styles.brand}
          href={`/${currentParams ? `?${currentParams}` : ""}`}
        >
          <span className={styles.brandLogo}>
            <Image src="/icons/logoNew1.svg" alt="Government of the Punjab" width={46} height={46} priority />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>RTMES</span>
            <span className={styles.brandTags}>
              <span className={styles.tagGis}>
                <Globe aria-hidden="true" />
                GIS
              </span>
              <span className={styles.tagAi}>
                {/* Spark from the design (i-spark.svg) */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#e1cd9d" d="M12 2c.6 4.6 2.4 6.9 7 7.6v.8c-4.6.7-6.4 3-7 7.6h-.8c-.6-4.6-2.4-6.9-7-7.6v-.8c4.6-.7 6.4-3 7-7.6z" />
                </svg>
                AI
              </span>
            </span>
          </span>
        </Link>

        <GISMenu dashboardType={currentType} />

        <div className={styles.spacer} />

        {currentPath !== "/charts" && (
          <>
            {(departmentId === 0 || departmentId === 1) &&
            role !== "Special Role" &&
            role?.toLowerCase() !== "dgme reports" ? (
              <Suspense fallback={spinner}>
                <DashboardTypeFilter />
              </Suspense>
            ) : role === "Special Role" ||
              !role ||
              !departmentId ||
              "Administrative Secretary" ? (
              ""
            ) : (
              <Suspense fallback={spinner}>
                <DepartmentCategoryFilter />
              </Suspense>
            )}
          </>
        )}

        <Link href="https://smdp.punjab.gov.pk/" target="_blank" className={styles.smdpBtn}>
          SMDP
        </Link>

        {role !== "Special Role" && (
          <Link
            href={currentTutorial}
            target="_blank"
            className={`${styles.iconBtn} ${styles.youtube}`}
            title="Video tutorials"
            aria-label="Video tutorials"
          >
            <svg className={styles.youtubeIcon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="1.5" y="4.5" width="21" height="15" rx="4.5" fill="#ff0000" />
              <path d="m10 8.8 5.4 3.2-5.4 3.2z" fill="#fff" />
            </svg>
          </Link>
        )}

        <UserDropDown />
      </div>
    </header>
  );
};

export default Navbar;

"use client";
import { getSession } from "@/utils/session";
import { inter } from "@/styles/fonts";
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
          <span>
            <span className={styles.brandTitle}>
              RTMES <span className={styles.brandUrdu}>حکومتِ پنجاب</span>
            </span>
            <span className={`${styles.brandSub} d-block`}>
              Directorate General Monitoring &amp; Evaluation · P&amp;D Board, Punjab
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
            className={styles.iconBtn}
            title="Video tutorials"
            aria-label="Video tutorials"
          >
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="m10 9 5 3-5 3z" />
            </svg>
          </Link>
        )}

        <UserDropDown />
      </div>
    </header>
  );
};

export default Navbar;

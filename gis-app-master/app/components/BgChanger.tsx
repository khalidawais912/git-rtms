"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useBackground from "../hooks/useBackground";
import { allPagesPath } from "../utils";

const BgChanger = () => {
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const [currentType, setCurrentType] = useState<string | null>();

  useEffect(() => {
    const type = searchParams.get("dashboardType");
    console.log("searchParams type", type);
    setCurrentType(type);
  }, [searchParams]);

  const pagePathsForBgImage = [
    "attributes",
    "dashboard-attendance",
    "attribute-groups",
    "drivers",
    "projects",
    "report-history",
    "rights",
    "roles",
    "sectors",
    "smdp-sync",
    "super-group",
    "user-projects",
    "users",
    "vehicles",
    "visit-plans",
    "visits",
    "visits-new",
    "visits-scheduled",
    "departments",
    "new-visit-plan",
    "report-analysis",
    "process",
    "dashboard-to",
    "dashboard-summary",
    "pc-iv-attached-review",
    "pc-iv-referback-review",
  ];

  const pathSegment = currentPath.split("/")[1]; // e.g., "sectors"
  const isImagePath = pagePathsForBgImage.includes(pathSegment);
  console.log(pathSegment);

  // #CFE6F8
  useBackground(
    isImagePath
      ? "/images/bg2.png"
      : pathSegment === "dashboard-to" || pathSegment === "vehicle-tracking"
        ? "#7ABEF0"
        : currentPath.startsWith("/projects-live-view")
          ? "#141518"
          : !allPagesPath.some((path) => currentPath.startsWith(path))
            ? "#fff"
            : currentType && pathSegment === "charts"
              ? "#fff"
              : !currentType && pathSegment === "charts"
                ? "#fff"
                : currentType && pathSegment !== "charts"
                  ? "#2377B6"
                  : !currentType && pathSegment !== "charts"
                    ? "#CFE6F8"
                    : "",
    isImagePath, // true if it's an image, false if it's a color
  );

  return <></>; // empty component just to trigger hook
};

export default BgChanger;

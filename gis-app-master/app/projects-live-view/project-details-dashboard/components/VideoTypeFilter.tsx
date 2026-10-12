"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/app/components/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DashboardTypeEnum } from "@/app/dashboard/types/types";
import { FaCircle } from "react-icons/fa";

const VideoTypeFilter = () => {
  const searchParams = useSearchParams();
  const currentPath = usePathname();
  const router = useRouter();
  const dashboardType = searchParams.get("dashboardType") || undefined;

  const [selectedButton, setSelectedButton] = useState(1);

  const handleStatusChange = useCallback(
    (dashboardType: string) => {
      const query = dashboardType && `?dashboardType=${dashboardType}`;
      router.push(currentPath + query);
    },
    [router, currentPath]
  );

  useEffect(() => {
    if (dashboardType) setSelectedButton(2);
  }, []);

  return (
    <div
      className="btn-group rounded-pill position-relative overflow-hidden bg-color-evaluation-theme-blue"
      style={{ padding: "4px" }}
      role="group"
    >
      {/* SLIDING GRADIENT DIV */}
      <div
        className={`position-absolute rounded-pill border-0 fw-normal`}
        style={{
          zIndex: 1,
          margin: "4px",
          background: "#1D1F25",
          transition: "all .3s",
          top: 0,
          bottom: 0,
          left: 0,
          width: selectedButton === 2 ? "49%" : "50%",
          transform: selectedButton === 2 ? "translateX(85%)" : "translate(0)",
        }}
      ></div>
      <Button
        type="button"
        className={`btn rounded-pill border-0 fs6px shadow-none fw-bold text-white w-100 position-relative bg-transparent`}
        style={{
          zIndex: 1,
          padding: "7px",
        }}
        onClick={() => {
          setSelectedButton(1);
          handleStatusChange("");
        }}
      >
        <div className="d-flex aling-items-center" style={{ gap: "3px" }}>
          <div className="position-relative ps-1">
            {/* Larger, Outer Circle (Background/Shadow) - No changes needed here */}
            <div className="position-absolute" style={{ top: 0, right: 0 }}>
              <FaCircle size={7} style={{ color: "rgba(159, 0, 0, 0.5)" }} />
            </div>

            {/* Smaller, Inner Circle (Foreground/Dot) - THIS NEEDS CENTERING */}
            <div
              className="position-absolute"
              style={{
                top: 2,
                right: 0,
                width: "7px", // Set width/height equal to the size of the outer FaCircle
                height: "7px", // This is crucial for absolute positioning to work predictably

                // 👇 ADD FLEXBOX CENTERING TO ALIGN THE INNER ICON 👇
                display: "flex",
                justifyContent: "center", // Centers horizontally
                alignItems: "center", // Centers vertically
              }}
            >
              <FaCircle
                size={3}
                style={{ color: "rgba(159, 0, 0, 1)", zIndex: 2 }}
              />
            </div>
          </div>
          <span>Live</span>
        </div>
      </Button>
      <Button
        type="button"
        className={`btn rounded-pill shadow-none border-0 fs6px fw-bold text-white w-100 bg-transparent`}
        style={{
          zIndex: 2,
          padding: "7px",
        }}
        onClick={() => {
          setSelectedButton(2);
          // handleStatusChange(TypeEnum.EVALUATION);
        }}
      >
        Drone
      </Button>
    </div>
  );
};

export default VideoTypeFilter;

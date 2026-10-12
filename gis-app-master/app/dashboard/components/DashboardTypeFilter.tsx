"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/app/components/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DashboardTypeEnum } from "../types/types";

const DashboardTypeFilter = () => {
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
    if (!dashboardType) {
      setSelectedButton(1);
    } else {
      setSelectedButton(2);
    }
  }, [dashboardType]);

  return (
    <div
      className="row d-flex flex-wrap rounded-pill "
      style={{ background: "rgba(235, 239, 253, 0.33)" }}
    >
      <div
        className="p-0 col btn-group rounded-pill position-relative overflow-hidden"
        style={{ background: "#EBEFFD" }}
        role="group"
      >
        {/* SLIDING GRADIENT DIV */}
        <div
          className={`position-absolute rounded-pill border-0 px-4 fw-normal`}
          style={{
            zIndex: 1,
            paddingTop: "12px",
            paddingBottom: "12px",
            background: "linear-gradient(to left, #13629B, #2377B6)",
            boxShadow: "inset 0 0px 15px rgba(0, 0, 0, .34)",
            transition: "all .3s",
            top: 0,
            bottom: 0,
            left: 0,
            width: "50%",
            transform:
              selectedButton === 2 ? "translateX(100%)" : "translate(0)",
          }}
        ></div>
        <Button
          type="button"
          className={`btn rounded-pill border-0 fs14px shadow-none px-4 fw-5 w-100 position-relative ${
            selectedButton === 1 ? "text-white" : ""
          }`}
          style={{
            zIndex: 2,
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
          onClick={() => {
            setSelectedButton(1);
            handleStatusChange("");
          }}
        >
          Monitoring
        </Button>
        <Button
          type="button"
          className={`btn rounded-pill shadow-none px-4 border-0 fs14px fw-5 w-100 ${
            selectedButton === 2 ? "text-white" : ""
          }`}
          style={{
            zIndex: 2,
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
          onClick={() => {
            setSelectedButton(2);
            handleStatusChange(DashboardTypeEnum.EVALUATION);
          }}
        >
          Evaluation
        </Button>
      </div>
    </div>
  );
};

export default DashboardTypeFilter;

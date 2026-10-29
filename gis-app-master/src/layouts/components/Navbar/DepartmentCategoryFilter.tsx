"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useSearchParams } from "next/navigation";
import { useEffectEvent } from "@/hooks/useEffectEvent";

const DepartmentCategoryFilter = () => {
  const searchParams = useSearchParams();
  const departmentCategory =
    searchParams.get("departmentCategory") || undefined;

  const [selectedButton, setSelectedButton] = useState(1);

  const onMount = useEffectEvent(() => {
    if (departmentCategory) setSelectedButton(2);
  });
  useEffect(() => onMount(), [onMount]);

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
          className="position-absolute rounded-pill border-0 px-4 fw-normal"
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
            width:
              selectedButton === 0
                ? "39%"
                : selectedButton === 1
                ? "38%"
                : "36.5%",
            transform: `translateX(${selectedButton * 100}%)`,
          }}
        ></div>
        <Button
          type="button"
          className={`btn rounded-pill border-0 fs14px shadow-none px-4 fw-5 w-100 position-relative ${
            selectedButton === 0 ? "text-white" : ""
          }`}
          style={{
            zIndex: 2,
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
          onClick={() => {
            setSelectedButton(0);
          }}
        >
          Sponsoring
        </Button>
        <Button
          type="button"
          className={`btn rounded-pill shadow-none px-4 border-0 fs14px fw-5 w-100 ${
            selectedButton === 1 ? "text-white" : ""
          }`}
          style={{
            zIndex: 2,
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
          onClick={() => {
            setSelectedButton(1);
          }}
        >
          Executing
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
          }}
        >
          Both
        </Button>
      </div>
    </div>
  );
};

export default DepartmentCategoryFilter;

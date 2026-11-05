import Button from "@/components/Button";
import { lexend } from "@/styles/fonts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FilterData, Filter } from "../types";
import FilterModal from "./FilterModal";
import { FILTER_SETTING_API } from "@/services/endpoints";
import apiClient from "@/services/client";
import {
  adpFilters,
  cmInitiativeFilters,
  oldCmInitiativeFilters,
} from "../filters";
import { AutoTextSize } from "auto-text-size";
import Spinner from "@/components/Spinner";

interface Props {
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  otherFilters: FilterData[];
  setOtherFilters: Dispatch<SetStateAction<FilterData[]>>;
  handleFilterChange: (filterType: "cmInitiative" | "adp") => void;
  combinedFilters: FilterData[];
  activeFilter: string;
}

const FilterButtons = ({
  handleSubmit,
  otherFilters,
  setOtherFilters,
  handleFilterChange,
  combinedFilters,
  activeFilter,
}: Props) => {
  const [selectedButton, setSelectedButton] = useState(1);

  const [userFiltersData, setUserFiltersData] = useState<Filter[]>();

  useEffect(() => {
    const getFilters = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${FILTER_SETTING_API}/GetUserFilters?userId=${userId}`
        );
        setUserFiltersData(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    getFilters(0);
  }, []);

  return (
    <div
      className={`col mb-2 shadow-sm fs14px ${lexend.className}`}
      style={{
        background: "#C6D9F1",
        borderRadius: "10px",
        padding: "20px ",
      }}
    >
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
            className={`btn rounded-pill border-0 shadow-none px-4 d-flex justify-content-center fw-5 w-100 ${
              selectedButton === 1 ? "text-white" : ""
            }`}
            style={{
              zIndex: 2,
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
            onClick={() => {
              setSelectedButton(1);
              handleFilterChange("cmInitiative");
              const yearFilter = otherFilters.find(
                (filter) => filter.filterIdentifier === "Year"
              );
              if (yearFilter && yearFilter.filterValues === "2025-2026") {
                handleSubmit([...cmInitiativeFilters, ...otherFilters]);
              } else if (!yearFilter) {
                handleSubmit([...cmInitiativeFilters, ...otherFilters]);
              } else {
                handleSubmit([...oldCmInitiativeFilters, ...otherFilters]);
              }
            }}
          >
            <AutoTextSize mode="oneline" maxFontSizePx={14} minFontSizePx={9}>
              CM Initiatives
            </AutoTextSize>
          </Button>
          <Button
            type="button"
            className={`btn rounded-pill border-0 shadow-none px-4 fs14px fw-5 w-100 ${
              selectedButton === 2 ? "text-white" : ""
            }`}
            style={{
              zIndex: 2,
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
            onClick={() => {
              setSelectedButton(2);
              handleFilterChange("adp");
              handleSubmit([...adpFilters, ...otherFilters]);
            }}
          >
            ADP
          </Button>
        </div>
        <div className="p-0 col-2 text-center m-auto">
          {userFiltersData ? (
            <FilterModal
              otherFilters={otherFilters}
              setOtherFilters={setOtherFilters}
              handleSubmit={handleSubmit}
              combinedFilters={combinedFilters}
              activeFilter={activeFilter}
              userFiltersData={userFiltersData}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterButtons;

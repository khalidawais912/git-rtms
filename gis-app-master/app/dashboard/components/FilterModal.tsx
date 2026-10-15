"use client";
import { FILTER_SETTING_API } from "@/shared/api/endpoints";
import Button from "@/shared/components/Button";
import apiClient from "@/shared/api/client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import filterBlack from "../../../public/icons/filterBlack.svg";
import { FilterData, Filter } from "../types";
import { Modal } from "react-bootstrap";
import {
  adpFilters,
  cmInitiativeFilters,
  oldCmInitiativeFilters,
  pastYearCmInitiativeFilters,
} from "../filters";
import CustomLabel from "@/shared/components/Form/CustomLabel";
import { SingleValue } from "react-select";
import CustomSelect, { defaultOption } from "@/shared/components/Form/CustomSelect";
import { OptionType } from "@/shared/components/types";

interface Props {
  otherFilters: FilterData[];
  setOtherFilters: Dispatch<SetStateAction<FilterData[]>>;
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  combinedFilters: FilterData[];
  activeFilter: string;
  userFiltersData: Filter[];
}

const FilterModal = ({
  otherFilters,
  setOtherFilters,
  handleSubmit,
  combinedFilters,
  activeFilter,
  userFiltersData,
}: Props) => {
  const [count, setCount] = useState(otherFilters.length);

  // Ref array for select elements to reset them on "Reset" click
  const selectRefs = useRef<Array<HTMLSelectElement | null>>([]);
  const [selectedIndices, setSelectedIndices] = useState<{
    [key: number]: boolean;
  }>({});

  // Handler for select change
  const handleSelectChange = (
    identifier: string,
    value: string,
    index: number,
  ) => {
    setOtherFilters((prevFilters) => {
      let updatedFilters;

      if (value === "") {
        updatedFilters = prevFilters.filter(
          (filter) => filter.filterIdentifier !== identifier,
        );
      } else {
        const existingIndex = prevFilters.findIndex(
          (filter) => filter.filterIdentifier === identifier,
        );

        if (existingIndex !== -1) {
          updatedFilters = [...prevFilters];
          updatedFilters[existingIndex].filterValues = value;
        } else {
          updatedFilters = [
            ...prevFilters,
            { filterIdentifier: identifier, filterValues: value },
          ];
        }
      }

      // Update count based on updated filters
      setCount(updatedFilters.length);

      return updatedFilters;
    });

  };

  // Reset function to clear filters and reset selects
  const handleReset = () => {
    setOtherFilters([]); // Clear the filter data
    setSelectedIndices({});
    setCount(0);
    if (activeFilter === "cmInitiative") {
      handleSubmit([...cmInitiativeFilters]);
    } else {
      handleSubmit([...adpFilters]);
    }
    // Reset each select element to the default (first) option
    selectRefs.current.forEach((select) => {
      if (select) {
        select.selectedIndex = 0; // Reset select element to the first option
      }
    });
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCustomSelectChange = (
    identifier: string,
    selected: SingleValue<OptionType>,
    index: number,
  ) => {
    const value = selected?.value || "";
    handleSelectChange(identifier, value, index);
  };

  return (
    <>
      <Button
        type="button"
        className="btn rounded-pill position-relative"
        onClick={handleShow}
      >
        <Image src={filterBlack} alt="filterBlack" width={18} height={18} />
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {count}
          <span className="visually-hidden">unread messages</span>
        </span>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        id="filterModal"
        dialogClassName="custom-modal"
      >
        <Modal.Body>
          <div
            className="border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
                style={{
                  borderRadius: "20px",
                  background: "#fff",
                }}
              >
                <h3 className="fw-bold text-center">Filter Menu</h3>
                <div className="row d-flex mb-3">
                  {userFiltersData.map((d, i) => {
                    const options = d.filterValues.map((f: string) => ({
                      value: f,
                      label: f,
                    }));

                    const selectedValue =
                      otherFilters.find(
                        (f) => f.filterIdentifier === d.filterIdentifier,
                      )?.filterValues || "";

                    return (
                      <div
                        key={i}
                        className="col-lg-6 col-md-6 col-sm-12 text-start mb-3"
                      >
                        <CustomLabel htmlFor={d.label}>{d.label}</CustomLabel>
                        <CustomSelect
                          options={[defaultOption, ...options]}
                          id={d.label}
                          closeMenuOnSelect
                          value={
                            selectedValue
                              ? { value: selectedValue, label: selectedValue }
                              : null
                          }
                          onChangeSingle={(newValue) =>
                            handleCustomSelectChange(
                              d.filterIdentifier,
                              newValue,
                              i,
                            )
                          }
                          menuPlacement="auto"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="row d-flex">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                    <Button
                      className="btn w-50 fs-5 text-white"
                      onClick={() => {
                        const yearFilter = otherFilters.find(
                          (filter) => filter.filterIdentifier === "Year",
                        );
                        if (activeFilter === "cmInitiative") {
                          if (
                            yearFilter &&
                            (yearFilter.filterValues === "2024-2025" ||
                              yearFilter.filterValues === "2025-2026")
                          ) {
                            handleSubmit([
                              ...pastYearCmInitiativeFilters,
                              ...otherFilters,
                            ]);
                          } else if (
                            yearFilter &&
                            yearFilter.filterValues === "2026-2027"
                          ) {
                            handleSubmit([
                              ...cmInitiativeFilters,
                              ...otherFilters,
                            ]);
                          } else if (!yearFilter) {
                            handleSubmit([
                              ...cmInitiativeFilters,
                              ...otherFilters,
                            ]);
                          } else {
                            handleSubmit([
                              ...oldCmInitiativeFilters,
                              ...otherFilters,
                            ]);
                          }
                        } else {
                          handleSubmit([...adpFilters, ...otherFilters]);
                        }
                        handleClose();
                      }}
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 , #13629B)",
                        border: "0px",
                      }}
                    >
                      Filter
                    </Button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <Button
                      className="btn w-50 fs-5"
                      onClick={() => {
                        handleReset();
                        handleClose();
                      }}
                      style={{
                        border: "2px solid #0C8CE9",
                        color: "#0C8CE9",
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FilterModal;

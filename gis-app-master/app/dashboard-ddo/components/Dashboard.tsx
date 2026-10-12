"use client";
import Button from "@/app/components/Button";
import useTourPlans from "@/app/hooks/useTourPlans";
import { Option } from "@/app/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Select, { StylesConfig } from "react-select";

const customStyles: StylesConfig<Option, false> = {
  control: (base) => ({
    ...base,
    fontSize: "14px",
    backgroundColor: "rgba(255, 255, 255, 1)",
    border: "1px solid #EDF1F3",
    borderRadius: "10px",
    color: "#818181",
    padding: "5px",
    boxShadow: "0 .125rem .25rem rgba(0, 0, 0, .075)",
    fontWeight: 500,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    // backgroundColor: state.isFocused ? "#f0f0f0" : "white",
    // color: "#333",
    fontSize: "14px",
  }),
};

const Dashboard = () => {
  const { data: tours } = useTourPlans();
  const [isClient, setIsClient] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    if (showButtons && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [showButtons]);

  const defaultNumberOption = { value: "-1", label: "Select" };

  const tourNames = tours.map((tour) => {
    return {
      value: String(tour.id),
      label: tour.name,
    };
  });

  return (
    <div
      className="p-3 bg-white"
      style={{
        border: "1px solid #E2E4E5",
        borderRadius: "10px",
        height: "89vh",
      }}
    >
      <div className="col">
        <div className="row d-flex justify-content-between m-0">
          <div className="col-auto">
            <p className="fw-6 mb-2" style={{ fontSize: "2.25rem" }}>
              DDO
            </p>
          </div>
        </div>
      </div>
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-sm-10 col-md-6 col-lg-6 col-xl-4 mb-2">
          <div className="row m-0">
            <div className="col-auto m-auto">
              <label
                htmlFor="tours"
                className="form-label mb-0 fw-5"
                style={{ color: "#6C7278" }}
              >
                Visit Plan
              </label>
            </div>
            <div className="col p-1">
              {isClient && (
                <Select
                  options={[defaultNumberOption, ...tourNames]}
                  name="tours"
                  id="tours"
                  isClearable
                  isSearchable
                  menuPlacement="auto"
                  menuPosition="absolute"
                  menuPortalTarget={document.body}
                  styles={customStyles}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-10 col-md-6 col-lg-6 col-xl-8 mb-2">
          <div className="col text-end">
            <div className="row d-flex justify-content-end">
              <div className="col-12 col-sm-12 col-md-6 col-lg-8 col-xl-4 align-self-end">
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="search"
                  placeholder="Select Officer"
                  style={{
                    border: "1px solid #EDF1F3",
                    borderRadius: "10px",
                    color: "#818181",
                    padding: "14px",
                  }}
                />
              </div>
              <div className="col-auto">
                <Button
                  className="btn bg-color-sea-blue fs17px fw-6 rounded-pill text-white"
                  style={{ padding: "10px 15px" }}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="col table-responsive shadow-sm mb-3"
        style={{ borderRadius: "8px" }}
      >
        <table
          className="table table-bordered mb-3 overflow-hidden table-hover"
          style={{ borderColor: "#B9B9B9", borderRadius: "8px" }}
        >
          <thead>
            <tr className={`color-dark-blue cursor-pointer fs14px`}>
              <th
                className="bg-color-sea-blue text-white fw-7 text-center text-nowrap"
                style={{ padding: "12px 12px 12px 16px" }}
              >
                Sr. No.
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Project ID
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                GS No
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Name of Scheme
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                District
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Sectors
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Cost
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Type
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                M&E Officer Name
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Section
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Date From
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Date To
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Driver Name
              </th>
              <th className="bg-color-sea-blue text-white fw-7 text-center text-nowrap">
                Vehicle Number
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              className="fw-5"
              style={{
                border: ".41px solid rgba(81,81,81,0.20)",
                fontSize: ".85rem",
              }}
            >
              <td className={`bg-color-light-gray}`}>1</td>
              <td className={`bg-color-light-gray}`}>3</td>
              <td className={`bg-color-light-gray}`}>965</td>
              <td className={`bg-color-light-gray}`}>
                Strengthing of Children Library Complex, Punjab, Lahore
              </td>
              <td className={`bg-color-light-gray}`}>Multan</td>
              <td className={`bg-color-light-gray}`}>School Education</td>
              <td className={`bg-color-light-gray}`}>0</td>
              <td className={`bg-color-light-gray}`}>Monitoring</td>
              <td className={`col bg-color-light-gray}`}>Khalid</td>
              <td className={`bg-color-light-gray}`}>-</td>
              <td className={`bg-color-light-gray}`}>30-12-23</td>
              <td className={`bg-color-light-gray}`}>30-12-23</td>
              <td className={`bg-color-light-gray}`}>faizan</td>
              <td className={`bg-color-light-gray}`}>GBE-062</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

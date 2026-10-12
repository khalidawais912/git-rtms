"use client";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeading from "@/app/components/Table/TableHeading";
import useDepartments from "@/app/hooks/useDepartments";
import useUsers from "@/app/hooks/useUsers";
import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Manrope } from "next/font/google";
import Image from "next/image";
import { Fragment } from "react";
import { FaFile } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { PiCircleFill, PiLineVerticalThin } from "react-icons/pi";
import { ActionMeta, SingleValue } from "react-select";
import SummaryDetail from "./SummaryDetail";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SummaryDashboard = () => {
  const { data: users } = useUsers();
  const { data: departments } = useDepartments();

  const commissionerOptions: OptionType[] = users?.map((d) => {
    return {
      value: d.name,
      label: d.name,
    };
  });

  const departmentOptions: OptionType[] = departments?.map((d) => {
    return {
      value: d.name,
      label: d.name,
    };
  });

  const tabs = [
    // {
    //   tabName: "All",
    //   count: 4,
    //   icon: <FaFile size={30} className="color-sea-blue" />,
    //   selectLabel: "Name",
    //   selectOptions: [{ option: "" }],
    // },
    {
      tabName: "COMMISSIONER",
      count: 1,
      icon: (
        <Image
          src="/icons/user-5.svg"
          alt="user-4"
          width={30}
          height={30}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Name",
      selectOptions: commissionerOptions,
    },
    {
      tabName: "DEPUTY COMMISSIONER",
      count: 1,
      icon: (
        <Image
          src="/icons/user-4.svg"
          alt="user-4"
          width={30}
          height={30}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Name",
      selectOptions: commissionerOptions,
    },
    {
      tabName: "SPONSORING AGENCY",
      count: 1,
      icon: (
        <Image
          src="/icons/building-1.svg"
          alt="building-1"
          width={30}
          height={30}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Department",
      selectOptions: departmentOptions,
    },
    {
      tabName: "EXECUTING AGENCY",
      count: 1,
      icon: (
        <Image
          src="/icons/building-2.svg"
          alt="building-2"
          width={30}
          height={30}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Department",
      selectOptions: departmentOptions,
    },
    // {
    //   tabName: "DGME",
    //   count: 0,
    //   icon: <RiBuildingFill size={30} className="color-sea-blue" />,
    //   selectLabel: "",
    //   selectOptions: [{ option: "" }],
    // },
  ];

  const handleSelectChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    console.log({ newValue, actionMeta });
    /* your state handling logic */
  };

  return (
    <div
      className="m-0 bg-white"
      style={{
        borderRadius: "15px",
        border: "1.08px solid #CBD5E1",
      }}
    >
      <div
        className="row g-2 g-lg-3 mt-0 mx-0 align-items-center"
        style={{ padding: "15px 26px" }}
      >
        <div className="col ps-0 mt-0">
          <div
            className="row d-flex align-items-center bg-white m-0"
            style={{
              borderRadius: "20px",
            }}
          >
            <div
              className="col-auto rounded-circle flex items-center justify-center"
              style={{
                background: "#F4F7FE",
                padding: "13px",
              }}
            >
              <FaFile size={30} className="color-sea-blue" />
            </div>
            <div className="col pe-0" style={{ paddingLeft: "10px" }}>
              <p
                className="fw-bold fs12px "
                style={{ color: "#80889E", marginBottom: "12px" }}
              >
                TOTAL VISITS
              </p>
              <p
                className="fw-bold fs28px mb-0"
                style={{ color: "#1F3D57", lineHeight: 1 }}
              >
                <span style={{ marginRight: "5px", display: "inline-block" }}>
                  0
                </span>
                {/* &nbsp;&nbsp;
                <span className="fs12px fw-5" style={{ color: "#A3AED0" }}>
                  Total Visits
                </span> */}
                {/* <HugeiconsIcon icon={ArrowUpRight03Icon} /> */}
              </p>
            </div>
          </div>
        </div>

        {tabs?.map((tab, i) => (
          <Fragment key={i}>
            <div key={i} className="col ps-0 mt-0">
              <CustomModal
                modalId={"tab" + i}
                showCloseButton={false}
                buttonColumn="col p-0 cursor-pointer"
                button={
                  <div
                    className={`${manrope.className} row d-flex align-items-center bg-white cursor-pointer m-0`}
                    style={{
                      borderRadius: "20px",
                    }}
                  >
                    <div
                      className="col-auto rounded-circle flex items-center justify-center"
                      style={{
                        background: "#F4F7FE",
                        padding: "13px",
                      }}
                    >
                      {tab.icon}
                    </div>
                    <div className="col pe-0" style={{ paddingLeft: "10px" }}>
                      <p
                        className="fw-bold fs12px "
                        style={{ color: "#80889E", marginBottom: "12px" }}
                      >
                        {tab.tabName}
                      </p>
                      <p
                        className="fw-bold fs28px mb-0"
                        style={{ color: "#1F3D57", lineHeight: 1 }}
                      >
                        <span
                          style={{
                            marginRight: "5px",
                            display: "inline-block",
                          }}
                        >
                          {tab.count}
                        </span>
                        {/* &nbsp;&nbsp;
                        <span
                          className="fs12px fw-5"
                          style={{ color: "#A3AED0" }}
                        >
                          Total Visits
                        </span> */}
                        <HugeiconsIcon icon={ArrowUpRight03Icon} size={21} />
                      </p>
                    </div>
                  </div>
                }
                body={
                  <div
                    className={manrope.className}
                    style={{
                      background: "#F1F6F7",
                      borderRadius: "15px",
                      padding: "25px 0px",
                    }}
                  >
                    <p
                      className="fs24px fw-bold py-2 text-center"
                      style={{
                        background: "#E4EDEC",
                        marginBottom: "25px",
                        color: "#155E95",
                      }}
                    >
                      Select {tab.tabName}
                    </p>
                    <div
                      className="col"
                      style={{ marginBottom: "25px", padding: "0px 30px" }}
                    >
                      <label
                        htmlFor="commissioner"
                        className="form-label form-label-color-black fw-5 fs14px"
                        style={{ marginBottom: "6px" }}
                      >
                        {tab.selectLabel}
                      </label>
                      <CustomSelect
                        closeMenuOnSelect
                        options={tab.selectOptions}
                        id="districtName"
                        onChangeSingle={handleSelectChange}
                      />
                      {/* <select
                      className="form-select form-select-sm color-light-dark shadow-none"
                      style={{ background: "rgba(255, 255, 255, 0.8)" }}
                      aria-label="Default select example"
                      name="commissioner"
                      id="commissioner"
                    >
                      <option value="Ali Jibran">
                        {tab.selectOptions[0].option}
                      </option>
                    </select> */}
                    </div>
                    <div style={{ padding: "0px 30px" }}>
                      <Button
                        className="btn text-white w-100 border-0 fs14px fw-bold"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, #0C8CE9 , #074F83)",
                          padding: "11px 16px",
                          borderRadius: "10px",
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Divider: show only if NOT last item */}
            {/* {i !== tabs.length - 1 && ( */}
            <div className="col-auto p-0 m-0">
              <PiLineVerticalThin
                size={100}
                style={{
                  height: "50px",
                }}
                color="#EFF0F2"
              />
            </div>
            {/* )} */}
          </Fragment>
        ))}
        <div className="col ps-0 mt-0">
          <div
            className="row d-flex align-items-center bg-white cursor-pointer m-0"
            style={{
              borderRadius: "20px",
            }}
          >
            <div
              className="col-auto rounded-circle flex items-center justify-center"
              style={{
                background: "#F4F7FE",
                padding: "13px",
              }}
            >
              <Image
                src="/icons/building-2.svg"
                alt="building-2"
                width={30}
                height={30}
                className="color-sea-blue"
              />
            </div>
            <div className="col pe-0" style={{ paddingLeft: "10px" }}>
              <p
                className="fw-bold fs12px "
                style={{ color: "#80889E", marginBottom: "12px" }}
              >
                DGME
              </p>
              <p
                className="fw-bold fs28px mb-0"
                style={{ color: "#1F3D57", lineHeight: 1 }}
              >
                <span style={{ marginRight: "5px", display: "inline-block" }}>
                  0
                </span>
                {/* &nbsp;&nbsp;
                <span className="fs12px fw-5" style={{ color: "#A3AED0" }}>
                  Total Visits
                </span> */}
                <HugeiconsIcon icon={ArrowUpRight03Icon} size={21} />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div
          className="row d-flex align-items-center m-0"
          style={{
            background: "#F8FAFC",
            padding: "8px 26px",
          }}
        >
          <div className="col">
            <div className="row align-items-center gap-2">
              <div className="col-auto mb-1 mb-lg-0 p-0">
                <h4 className="m-0" style={{ fontWeight: 800 }}>
                  No. of Visits
                </h4>
              </div>
              <div className="col-auto mb-2 mb-lg-0 p-0">
                <span
                  className="badge rounded-pill fs13px fw-6"
                  style={{ color: "#1C6BA6", border: "1.08px solid #1C6BA6" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <PiCircleFill size={8} style={{ color: "#1C6BA6" }} />
                    <span>1/1 Visits</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="row gap-2 align-items-center justify-content-end">
              <div className="col-auto p-0">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <div
                      className="rounded-end rounded-pill text-white shadow-none border-end-0"
                      style={{
                        border: "1px solid #CBD5E1",
                        padding: "4px 0px 8px 17px",
                      }}
                    >
                      <FiSearch
                        size={21}
                        style={{ color: "#475569", marginTop: "5px" }}
                      />
                    </div>
                    <input
                      type="text"
                      className="form-control border-start-0 rounded-pill rounded-start shadow-none fs15px fw-bold bg-transparent placeholder-bold"
                      style={{
                        border: "1px solid #CBD5E1",
                        color: "#475569",
                        padding: "10px 17px 10px 8px",
                      }}
                      placeholder="Search"
                    />
                  </div>
                </form>
              </div>
              {/* <div className="col-auto p-0">
                  <Button
                    className="btn fw-bold bg-color-sea-blue text-white rounded-pill"
                    style={{ padding: "10px 17px" }}
                  >
                    <CgOptions size={21} />
                    District
                  </Button>
                </div> */}
            </div>
          </div>
        </div>

        <div className="table-responsive mb-2">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                {[
                  "GS. No.",
                  "Project Name",
                  "District",
                  "Commissioner Visit",
                  "Sponsoring Agency Visit",
                  "Executing Agency Visit",
                  "DGM&E Visits",
                  "Total Visit",
                ].map((d, i) => (
                  <TableHeading key={i} name={d} textClassName="text-nowrap" />
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <RowHeader>706</RowHeader>

                <TableData>
                  CM Himmat Card Program for Persons with Disabilities (PWDs)
                </TableData>
                <TableData>Sialkot</TableData>
                <TableData className="text-center">
                  <CustomModal
                    modalId={"1"}
                    size="lg"
                    showCloseButton={false}
                    buttonColumn="col p-0 cursor-pointer"
                    button={
                      <span className="color-sea-blue text-decoration-underline text-center">
                        1
                      </span>
                    }
                    body={<SummaryDetail />}
                  />
                </TableData>
                <TableData className="text-center">
                  <CustomModal
                    modalId={"1"}
                    size="lg"
                    showCloseButton={false}
                    buttonColumn="col p-0 cursor-pointer"
                    button={
                      <span className="color-sea-blue text-decoration-underline text-center">
                        1
                      </span>
                    }
                    body={<SummaryDetail />}
                  />
                </TableData>
                <TableData className="text-center">
                  <CustomModal
                    modalId={"1"}
                    size="lg"
                    showCloseButton={false}
                    buttonColumn="col p-0 cursor-pointer"
                    button={
                      <span className="color-sea-blue text-decoration-underline text-center">
                        1
                      </span>
                    }
                    body={<SummaryDetail />}
                  />
                </TableData>
                <TableData className="text-center">
                  <CustomModal
                    modalId={"1"}
                    size="lg"
                    showCloseButton={false}
                    buttonColumn="col p-0 cursor-pointer"
                    button={
                      <span className="color-sea-blue text-decoration-underline text-center">
                        1
                      </span>
                    }
                    body={<SummaryDetail />}
                  />
                </TableData>
                <TableData className="text-center">4</TableData>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;

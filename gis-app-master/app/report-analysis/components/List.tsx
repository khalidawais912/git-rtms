"use client";
import { REPORT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import FormWrapper from "@/app/components/Form/FormWrapper";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import useAttributes from "@/app/hooks/useAttributes";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { deleteMessage } from "@/app/utils";
import trashImage from "@/public/images/trash.png";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  IoArrowForwardCircleOutline,
  IoClose,
  IoSearchOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Form from "./Form";
import IssuedVsPendingReports from "./IssuedVsPendingReports";
import PPTSlideGenerator from "./PPTSlideGenerator/PPTSlideGenerator";
import TimeSpendOnProjectSiteData from "./TimeSpentOnProjectSite/TimeSpendOnProjectSiteData";
import ActionButton from "@/app/components/Table/ActionButton";
import TableHeading from "@/app/components/Table/TableHeading";
import TableData from "@/app/components/Table/TableData";
import CustomInput from "@/app/components/Form/CustomInput";

export interface ReportTab {
  reportId: number;
  reportName: string;
}

interface ReportRun {
  [key: string]: string | number | undefined;
}

const List = () => {
  const [expandArea, setExpandArea] = useState(false);
  const [isActiveTab, setActiveTab] = useState(-1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const { data: attributes } = useAttributes();
  const [tabs, setTabs] = useState<ReportTab[]>();
  const [data, setData] = useState<ReportRun[]>([]);
  const [refreshTabs, setRefreshTabs] = useState(false);

  useLayoutEffect(() => {
    if (expandArea && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 20);
    } else {
      setHeight(78);
    }
  }, [expandArea, tabs]);

  useEffect(() => {
    const handleSubmit = async () => {
      try {
        const response = await apiClient.get(REPORT_API + "/GetALL");
        console.log("response", response);
        if (response.status === 404) {
          toast.error(response.data);
        }
        setTabs(response.data);
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    };
    handleSubmit();
  }, [refreshTabs]);

  const handleSubmit = async (reportId: number) => {
    try {
      const response = await apiClient.get(`${REPORT_API}/run/${reportId}`);
      console.log("response", response.data);
      if (response.status === 404) {
        toast.error(response.data);
      }
      setData(response.data);
    } catch (err) {
      console.log((err as AxiosError).message);
      toast.error((err as AxiosError).message);
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredTabs, setFilteredTabs] = useState<ReportTab[]>([]);

  // Handle search logic
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // const lowercasedFilter = searchTerm.toLowerCase();
  //   const filtered = data.filter((item) =>
  //     Object.values(item)
  //       .filter((value) => value !== undefined && value !== null)
  //       .some((value) =>
  //         value!.toString().toLowerCase().includes(e.target.value.toLowerCase())
  //       )
  //   );
  //   setFilteredData(filtered);
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = [...(tabs || [])].reverse().filter((item) =>
      [item.reportName]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase())),
    );
    setFilteredTabs(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // Export to Excel function
  // const exportToExcel = (reportData: ReportRun) => {
  //   if (!reportData || reportData.length === 0) return;

  //   const headers = Object.keys(reportData[0] as ReportRun);

  //   const data = plan.detailOfEachVisit.map((visit, index) => ({
  //     "Sr No.": index + 1,
  //     "Officer Name": visit.officerName,
  //     Designation: visit.designation,
  //     "From Date": visit.fromDate,
  //     "To Date": visit.toDate,
  //     "Total Visits": visit.totalVisits,
  //     Submitted: visit.submitted,
  //     "Complete Visits": visit.completeVisits,
  //     "Pending Visits": visit.pendingVisits,
  //     "On Time Submitted": visit.onTimeSubmitted,
  //     "Late Submitted": visit.lateSubmitted,
  //     "Issued Report": visit.issuedReport,
  //   }));

  //   exportDataToExcel(
  //     data,
  //     headers,
  //     `${plan.nameOfVisit} ${new Date().toLocaleDateString(
  //   "en-GB",
  //   {
  //     weekday: "short",
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   },
  // )}.xlsx`
  //   );
  // };

  const exportToExcel = (data: ReportRun[], label: string | undefined) => {
    // Prepare data for export
    console.log("data", data);
    if (!data || data.length === 0) {
      console.warn("No data provided for Excel export.");
      // Optionally, show a user-friendly message instead of a console warn
      toast.info("There is no data to export!"); // Or use a custom modal
      return;
    }

    // 1. Collect all unique keys from all data items, preserving their first encountered order.
    const uniqueKeysInOrder: string[] = [];
    const seenKeys = new Set<string>(); // To track which keys have already been added

    data.forEach((item) => {
      for (const key in item) {
        if (
          Object.prototype.hasOwnProperty.call(item, key) &&
          !seenKeys.has(key)
        ) {
          uniqueKeysInOrder.push(key);
          seenKeys.add(key);
        }
      }
    });

    // 2. Prepend "Sr. No." as the first header
    const headers: string[] = ["Sr. No.", ...uniqueKeysInOrder];

    // 3. Prepare data for Excel dynamically based on collected headers
    const dataForExcel = data.map((item, index) => {
      const row: { [key: string]: string | number | null } = {};

      row["Sr. No."] = index + 1;

      // Add values for all other dynamic headers
      headers.slice(1).forEach((header) => {
        // Iterate over dynamic headers only (excluding "Sr. No.")
        // Use null for undefined values to ensure Excel treats them as empty cells
        row[header] = item[header] !== undefined ? item[header] : null;
      });

      return row;
    });

    console.log("Prepared data for Excel:", dataForExcel);

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visit Plans"); // Changed sheet name

    // Write the workbook to a file
    XLSX.writeFile(workbook, `${label}.xlsx`); // Changed filename
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiClient.delete(`${REPORT_API}/${id}`);
      console.log(response);
      toast.success(deleteMessage);
      setRefreshTabs((prev) => !prev);
    } catch (err) {
      console.log(err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <div
      className="col bg-white"
      style={{
        border: "1px solid #E2E4E5",
        borderRadius: "10px",
        height: "calc(100vh - 125px)",
        overflow: "auto",
        padding: "15px 26px",
      }}
    >
      <div className="row justify-content-end align-items-center">
        <div className="col-auto">
          <p className="fs22px fw-8">Report Analysis</p>
        </div>

        <div className="col text-end">
          <div className="row justify-content-end align-items-center">
            <div className="col-auto">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <button
                    className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                    type="submit"
                    style={{
                      border: "1.08px solid #CBD5E1",
                    }}
                  >
                    <IoSearchOutline size={21.6} style={{ color: "#475569" }} />
                  </button>
                  <CustomInput
                    type="text"
                    className="form-control fw-bold border-start-0 rounded-pill rounded-start shadow-none fs15px bg-transparent py-2 placeholder-bold"
                    style={{
                      border: "1px solid #CBD5E1",
                    }}
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleChange}
                    id="search"
                  />
                </div>
              </form>
            </div>
            <div className="col-auto">
              {tabs && (
                <DownloadDropDown
                  styleVarient={2}
                  onClickExcel={() =>
                    exportToExcel(
                      data,
                      tabs.find((tab) => tab.reportId === isActiveTab)
                        ?.reportName,
                    )
                  }
                />
              )}
            </div>
            <div className="col-auto">
              <ActionButton
                name="Create New Form"
                method="POST"
                onClick={handleShow}
              />
              {/* <Button
                className="btn bg-color-sea-blue text-white"
                style={{ borderRadius: "8px" }}
                onClick={handleShow}
              >
                Create New Form <IoArrowForwardCircleOutline size={24} />
              </Button> */}
            </div>
          </div>

          <Modal
            show={show}
            onHide={handleClose}
            fullscreen={true}
            dialogClassName="gismenu-modal"
          >
            <Modal.Body>
              <Form
                handleClose={handleClose}
                attributes={attributes}
                show={show}
                setRefreshTabs={setRefreshTabs}
              />
            </Modal.Body>
          </Modal>
          {/* <CustomModal
            HeaderTopPos={0}
            HeaderRightPos={0}
            modalId="master-report-form-list"
            isFullscreen={true}
            button={
              <Button
                className="btn bg-color-sea-blue text-white"
                style={{ borderRadius: "8px" }}
              >
                Create New Form <IoArrowForwardCircleOutline size={24} />
              </Button>
            }
            body={<div className="container-fluid "><Form /></div>}
          /> */}
        </div>
      </div>
      <div className="row d-flex justify-content-between align-items-center mb-2">
        <div className="col">
          <div
            ref={contentRef}
            className="row overflow-hidden"
            style={{
              transition: "all 0.3s ease",
              height: `${height}px`,
              paddingTop: height > 0 ? "20px" : "0px",
            }}
          >
            <div className="col-auto mb-2 pe-0">
              <PPTSlideGenerator
                setActiveTab={setActiveTab}
                isActiveTab={isActiveTab}
              />
            </div>
            <div className="col-auto mb-2 pe-0">
              <TimeSpendOnProjectSiteData
                selectedIndex={isActiveTab}
                setSelectedIndex={setActiveTab}
              />
            </div>
            <div className="col-auto mb-2 pe-0">
              <IssuedVsPendingReports
                setActiveTab={setActiveTab}
                isActiveTab={isActiveTab}
              />
            </div>

            {(searchTerm ? filteredTabs : tabs)?.map((tab) => (
              <div
                key={tab.reportId}
                className="col-auto mb-2 pe-0 position-relative"
              >
                <Button
                  className={`btn rounded-pill fw-5 fs14px  ${
                    isActiveTab === tab.reportId
                      ? "bg-color-sea-blue text-white"
                      : ""
                  }`}
                  style={{
                    border: "1px solid #EDF1F3",
                    padding: "14px",
                    boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
                  }}
                  onClick={() => {
                    setActiveTab(tab.reportId);
                    handleSubmit(tab.reportId);
                  }}
                >
                  {tab.reportName}
                </Button>
                <div className="position-absolute top-0 start-100 translate-middle">
                  <CustomModal
                    size="lg"
                    button={
                      <Button
                        className="btn btn-danger rounded-circle shadow-none"
                        style={{ padding: "0px 3px 0px 3px" }}
                      >
                        <IoClose size={18} />
                      </Button>
                    }
                    modalId={tab.reportId.toString()}
                    body={(close) => (
                      <FormWrapper>
                        <div className="row flex-column justify-content-center mb-4">
                          <div className="col text-center mt-4">
                            <Image
                              src={trashImage}
                              alt="trash"
                              width={110}
                              height={110}
                            />
                          </div>
                          <div className="col-lg-9 mx-auto text-center">
                            <p className="mt-2 fs-4 fw-bold mb-4">
                              Are you sure you want to delete this record?
                            </p>
                          </div>
                          <div className="col text-center">
                            <Button
                              onClick={() => {
                                handleDelete(tab.reportId);
                                close(); // ✅ closes modal after delete
                              }}
                              className="btn shadow border-0 text-white px-4 fs-5"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to bottom, #DF1130 ,#A50223)",
                                borderRadius: "12px",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </FormWrapper>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-auto">
          <div className="row">
            <div className="col-auto text-end">
              <Button
                className="btn fw-6 shadow-none"
                onClick={() => setExpandArea(!expandArea)}
              >
                <span className="pe-2">
                  {isActiveTab !== -1
                    ? tabs?.find((tab) => tab.reportId === isActiveTab)
                        ?.reportName
                    : "Master Report"}
                </span>
                <FaChevronDown
                  style={{
                    transition: "all .3s",
                    rotate: `${expandArea ? "180deg" : "0deg"}`,
                  }}
                />
              </Button>
            </div>
            {/* {data && (
              <div className="col-auto">
                <DownloadDropDown onClickExcel={() => exportToExcel(data)} />
              </div>
            )} */}
          </div>
        </div>
      </div>

      {data && data.length > 0 && (
        <div className="table-responsive mb-2">
          <div style={{ height: "calc(100vh - 325px)", overflow: "auto" }}>
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <TableHeading name="Sr. No." className="text-nowrap" />
                  {Object.keys(data[0])?.map((key, i) => (
                    <TableHeading name={key} key={i} className="text-nowrap" />
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <TableData>{rowIndex + 1}</TableData>
                    {Object.keys(data[0]).map((key, i) => (
                      <TableData key={i}>{row[key]}</TableData>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {data.length === 0 && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "75%" }}
        >
          <div className="text-center">
            <Image
              src="/images/corrupted-file.png"
              alt="corrupted-file"
              width={130}
              height={130}
              style={{
                width: "130px",
                height: "130px",
                marginBottom: "20px",
              }}
            />
            <p className="m-0 fw-bold fs20px" style={{ color: "#475569" }}>
              Please Select Any Generated Reports
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;

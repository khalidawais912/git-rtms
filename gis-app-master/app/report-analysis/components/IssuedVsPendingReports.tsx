import { REPORT_API } from "@/app/APIs";
import Avatar from "@/app/components/Avatar";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import CustomSelect, {
  defaultNegativeNumberOption,
  defaultOption,
  OptionType,
} from "@/app/components/Form/CustomSelect";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import useTourPlans from "@/app/hooks/useTourPlans";
import apiClient from "@/app/services/api-client";
import { addSpaceToCamelCase, exportToPDF, exportToPDFNew } from "@/app/utils";
import {
  exportDataToExcel,
  exportDataToExcelNew,
  exportToExcelNewOne,
} from "@/app/utils/exportToExcel";
import { sort } from "fast-sort";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PiCircleFill } from "react-icons/pi";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

interface Props {
  isActiveTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

interface IssuedVsPendingReport {
  officerName: string;
  designation: string;
  profilePicture: string;
  scheduled: number;
  completed: number;
  submitted: number;
  referredBack: number;
  approved: number;
  issued: number;
  cancelled: number;
}

const IssuedVsPendingReports = ({ isActiveTab, setActiveTab }: Props) => {
  const [data, setData] = useState<IssuedVsPendingReport[]>([]);
  const [visitPlanGroup, setVisitPlanGroup] = useState<number>(-1);
  const [year, setYear] = useState<string>("");
  const { data: tours } = useTourPlans();

  const handleSubmit = async (
    visitPlanId: number = -1,
    selectedYear: string = ""
  ) => {
    const params = new URLSearchParams();
    if (visitPlanId !== -1) params.append("VisitPlanId", String(visitPlanId));
    if (selectedYear) params.append("ficalYear", selectedYear);

    const apiUrl = `${REPORT_API}/GetUserVisitsStatusReport${
      params.toString() ? "?" + params.toString() : ""
    }`;
    console.log("Final API URL:", apiUrl);

    try {
      const response = await apiClient.get(apiUrl);
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (visitPlanGroup !== -1 && year) {
      console.log("visitPlanGroup", visitPlanGroup);
      console.log("year", year);
      handleSubmit(visitPlanGroup, year);
    } else if (visitPlanGroup !== -1) {
      console.log("visitPlanGroup", visitPlanGroup);
      console.log("year", year);
      handleSubmit(visitPlanGroup);
    } else if (year) {
      console.log("visitPlanGroup", visitPlanGroup);
      console.log("year", year);
      handleSubmit(-1, year);
    } else if (visitPlanGroup === -1 && year === "") {
      console.log("visitPlanGroup", visitPlanGroup);
      console.log("year", year);
      handleSubmit();
    } else {
      handleSubmit();
    }
  }, [visitPlanGroup, year]);

  // if (visitPlanGroup) {
  //   console.log("visitPlanGroup", visitPlanGroup);
  //   handleSubmit();
  // } else {
  //   handleSubmit();
  // }
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<IssuedVsPendingReport[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [
        item.officerName,
        item.designation,
        item.scheduled.toString(),
        item.completed.toString(),
        item.submitted.toString(),
        item.referredBack.toString(),
        item.approved.toString(),
        item.issued.toString(),
        item.cancelled.toString(),
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IssuedVsPendingReport;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof IssuedVsPendingReport) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = sort(data)[direction](key);
    setSortConfig({ key, direction });
    setData([...sortedData]);
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );

  const sortedTours = [...tours].sort((a, b) => b.id - a.id);

  const tourOptions: OptionType[] = sortedTours.map((tour) => {
    return {
      value: String(tour.id),
      label: tour.name,
    };
  });

  const yearOptions: OptionType[] = ["2025-2026", "2024-2025"].map((year) => {
    return {
      value: year,
      label: year,
    };
  });

  //   const exportToExcel = (data: IssuedVsPendingReport[], label: string | undefined) => {
  //     // Prepare data for export
  //     console.log("data", data);
  //     if (!data || data.length === 0) {
  //       console.warn("No data provided for Excel export.");
  //       // Optionally, show a user-friendly message instead of a console warn
  //       toast.info("There is no data to export!"); // Or use a custom modal
  //       return;
  //     }

  //     // 1. Collect all unique keys from all data items, preserving their first encountered order.
  //     const uniqueKeysInOrder: string[] = [];
  //     const seenKeys = new Set<string>(); // To track which keys have already been added

  //     data.forEach((item) => {
  //       for (const key in item) {
  //         if (
  //           Object.prototype.hasOwnProperty.call(item, key) &&
  //           !seenKeys.has(key)
  //         ) {
  //           uniqueKeysInOrder.push(key);
  //           seenKeys.add(key);
  //         }
  //       }
  //     });

  //     // 2. Prepend "Sr. No." as the first header
  //     const headers: string[] = ["Sr. No.", ...uniqueKeysInOrder];

  //     // 3. Prepare data for Excel dynamically based on collected headers
  //     const dataForExcel = data.map((item, index) => {
  //       const row: { [key: string]: string | number | null } = {};

  //       row["Sr. No."] = index + 1;

  //       // Add values for all other dynamic headers
  //       headers.forEach((header) => {
  //         // Iterate over dynamic headers only (excluding "Sr. No.")
  //         // Use null for undefined values to ensure Excel treats them as empty cells
  //         row[header] = item[header] !== undefined ? item[header] : null;
  //       });

  //       return row;
  //     });

  //     console.log("Prepared data for Excel:", dataForExcel);

  //     // Create a worksheet from the data
  //     const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

  //     // Create a workbook
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Visit Plans"); // Changed sheet name

  //     // Write the workbook to a file
  //     XLSX.writeFile(workbook, `${label}.xlsx`); // Changed filename
  //   };

  // ──────────── (2) Create table rows from cards ────────────
  function cardsToTableRows(
    data: IssuedVsPendingReport[]
  ): Array<Record<string, string>> {
    const rows = data.map((d, i) => ({
      "Sr. No.": (i + 1).toString(),
      officerName: d.officerName,
      designation: d.designation,
      scheduled: d.scheduled.toString(),
      completed: d.completed.toString(),
      submitted: d.submitted.toString(),
      referredBack: d.referredBack.toString(),
      approved: d.approved.toString(),
      issued: d.issued.toString(),
      cancelled: d.cancelled.toString(),
    }));

    // ---- Grand total row ----
    const grandTotal = {
      "Sr. No.": "∑", // or "" if you want empty
      officerName: "Grand Total",
      designation: "",
      scheduled: data.reduce((sum, d) => sum + d.scheduled, 0).toString(),
      completed: data.reduce((sum, d) => sum + d.completed, 0).toString(),
      submitted: data.reduce((sum, d) => sum + d.submitted, 0).toString(),
      referredBack: data.reduce((sum, d) => sum + d.referredBack, 0).toString(),
      approved: data.reduce((sum, d) => sum + d.approved, 0).toString(),
      issued: data.reduce((sum, d) => sum + d.issued, 0).toString(),
      cancelled: data.reduce((sum, d) => sum + d.cancelled, 0).toString(),
    };

    rows.push(grandTotal);

    return rows;
  }

  // ──────────── (3) Export with your current function ────────────
  const columns = [
    { header: "Sr. No.", dataKey: "Sr. No." },
    { header: "Officer Name", dataKey: "officerName" },
    { header: "Designation", dataKey: "designation" },
    { header: "Scheduled", dataKey: "scheduled" },
    { header: "Completed", dataKey: "completed" },
    { header: "Submitted", dataKey: "submitted" },
    { header: "ReferredBack", dataKey: "referredBack" },
    { header: "Approved", dataKey: "approved" },
    { header: "Issued", dataKey: "issued" },
    { header: "Cancelled", dataKey: "cancelled" },
  ];

  return (
    <CustomModal
      HeaderTopPos={0}
      HeaderRightPos={0}
      size="xl"
      dialogClassName="gismenu-modal"
      modalId="officer-statuses"
      button={
        <Button
          onClick={() => {
            setActiveTab(-13);
            handleSubmit();
          }}
          className={`btn rounded-pill fw-5 fs14px ${
            isActiveTab === -13 ? "bg-color-sea-blue text-white" : ""
          }`}
          style={{
            border: "1px solid #EDF1F3",
            padding: "14px",
            boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
          }}
        >
          Issued Vs Pending Reports
        </Button>
      }
      body={
        <div
          className="bg-white p-4"
          style={{
            borderRadius: "15px",
          }}
        >
          <TableHeader
            heading="Issued Vs Pending Reports"
            searchTerm={searchTerm}
            filteredData={filteredData}
            data={data}
            handleChange={handleChange}
            searchClassName="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2 mb-2 mb-md-0"
            form={
              <>
                <div className="col-12 col-sm-12 col-md-8 col-lg-7 col-xl-2 mb-2 mb-lg-0">
                  <CustomSelect
                    closeMenuOnSelect={true}
                    placeholder="Select Visit Plan"
                    options={[defaultNegativeNumberOption, ...tourOptions]}
                    id="tours"
                    onChangeSingle={(
                      newValue: SingleValue<{ value: string; label: string }>
                    ) => {
                      if (newValue) {
                        setVisitPlanGroup(Number(newValue.value));
                      }
                    }}
                  />
                </div>

                <div className="col-auto mb-2 mb-lg-0">
                  <CustomSelect
                    closeMenuOnSelect={true}
                    placeholder="Select Year"
                    options={[defaultOption, ...yearOptions]}
                    id="years"
                    onChangeSingle={(
                      newValue: SingleValue<{ value: string; label: string }>
                    ) => {
                      if (newValue) {
                        setYear(newValue.value);
                      }
                    }}
                  />
                </div>

                <div className="col-auto">
                  <DownloadDropDown
                    onClickPdf={() =>
                      exportToPDF(
                        columns,
                        cardsToTableRows(data),
                        new Date(),
                        `${
                          visitPlanGroup !== -1
                            ? tourOptions.find(
                                (tour) =>
                                  parseInt(tour.value) === visitPlanGroup
                              )?.label + " - Issued Vs Pending Reports"
                            : "Issued Vs Pending Reports"
                        }`
                      )
                    }
                    onClickExcel={() =>
                      exportToExcelNewOne(
                        columns,
                        cardsToTableRows(data),
                        `${
                          visitPlanGroup !== -1
                            ? tourOptions.find(
                                (tour) =>
                                  parseInt(tour.value) === visitPlanGroup
                              )?.label + " - Issued Vs Pending Reports"
                            : "Issued Vs Pending Reports"
                        }`
                      )
                    }
                  />
                </div>
              </>
            }
          />
          {/* <div
            className="row d-flex align-items-center"
            style={{ padding: "17.33px 26px" }}
          >
            <div className="col p-0">
              <div className="row align-items-center">
                <div className="col-auto mb-1 mb-xl-0">
                  <h4 className="m-0" style={{ fontWeight: 800 }}>
                    Issued Vs Pending Reports
                  </h4>
                </div>
                <div className="col-auto mb-2 mb-lg-0">
                  <span
                    className="badge rounded-pill fs13px fw-6"
                    style={{ color: "#1C6BA6", border: "1.08px solid #1C6BA6" }}
                  >
                    <div className="row align-items-center">
                      <div className="col-auto pe-0">
                        <PiCircleFill size={8} style={{ color: "#1C6BA6" }} />
                      </div>
                      <div className="col ps-1">
                        {searchTerm ? filteredData.length : data?.length}/
                        {searchTerm ? filteredData.length : data?.length}{" "}
                        Officer Reports Status
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            
          </div> */}
          <div
            className="table-responsive  mb-2"
            style={{ margin: "0px -24px" }}
          >
            <table className="table table-hover">
              <thead>
                <tr>
                  <TableHeading
                    className="text-nowrap position-sticky start-0 z-3"
                    name="officer Name"
                    handleSort={() => handleSort("officerName")}
                  />
                  <TableHeading
                    name="scheduled"
                    handleSort={() => handleSort("scheduled")}
                  />
                  <TableHeading
                    name="completed"
                    handleSort={() => handleSort("completed")}
                  />
                  <TableHeading
                    name="submitted"
                    handleSort={() => handleSort("submitted")}
                  />
                  <TableHeading
                    name="referredBack"
                    handleSort={() => handleSort("referredBack")}
                  />
                  <TableHeading
                    name="approved"
                    handleSort={() => handleSort("approved")}
                  />
                  <TableHeading
                    name="issued"
                    handleSort={() => handleSort("issued")}
                  />
                  <TableHeading
                    name="cancelled"
                    handleSort={() => handleSort("cancelled")}
                  />
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((d, i) => (
                  <tr key={i}>
                    <RowHeader className="fw-normal position-sticky start-0 z-2 text-nowrap bg-white">
                      <div className="col">
                        <div className="row d-flex flex-nowrap align-items-center">
                          <div className="col-auto pe-1">
                            {/* <img
                                className="rounded-circle shadow-sm"
                                style={{
                                  objectFit: "cover",
                                  objectPosition: "center top",
                                  width: "30px",
                                  height: "30px",
                                }}
                                // width={30}
                                // height={30}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.profilePicture}`}
                                alt="picture"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/images/dp1.png"; // fallback image in /public folder
                                }}
                              /> */}
                            {d.profilePicture && (
                              <Link
                                href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.profilePicture}`}
                                target="_blank"
                              >
                                <Avatar
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.profilePicture}`}
                                />
                              </Link>
                            )}
                          </div>
                          <div className="col-auto ps-1">
                            {d.officerName}
                            <br />({d.designation})
                          </div>
                        </div>
                      </div>
                    </RowHeader>
                    <TableData className="text-center">{d.scheduled}</TableData>
                    <TableData className="text-center">{d.completed}</TableData>
                    <TableData className="text-center">{d.submitted}</TableData>
                    <TableData className="text-center">
                      {d.referredBack}
                    </TableData>
                    <TableData className="text-center">{d.approved}</TableData>
                    <TableData className="text-center">{d.issued}</TableData>
                    <TableData className="text-center">{d.cancelled}</TableData>
                  </tr>
                ))}
                <tr>
                  <RowHeader className="position-sticky start-0 z-2 text-nowrap bg-white">
                    Grand Total
                  </RowHeader>
                  <TableData className="text-center">
                    {paginatedData.reduce(
                      (sum, d) => sum + d.scheduled || 0,
                      0
                    )}
                  </TableData>
                  <TableData className="text-center">
                    {paginatedData.reduce(
                      (sum, d) => sum + d.completed || 0,
                      0
                    )}
                  </TableData>
                  <TableData className="text-center">
                    {paginatedData.reduce(
                      (sum, d) => sum + d.submitted || 0,
                      0
                    )}
                  </TableData>
                  <TableData className="text-center">
                    {paginatedData.reduce(
                      (sum, d) => sum + d.referredBack || 0,
                      0
                    )}
                  </TableData>
                  <TableData className="text-center">
                    {paginatedData.reduce((sum, d) => sum + d.approved || 0, 0)}
                  </TableData>
                  <TableData className="text-center">
                    {paginatedData.reduce((sum, d) => sum + d.issued || 0, 0)}
                  </TableData>
                  <TableData className="text-center">
                    {paginatedData.reduce(
                      (sum, d) => sum + d.cancelled || 0,
                      0
                    )}
                  </TableData>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination
            searchTerm={searchTerm}
            filteredData={filteredData}
            data={data}
            rows={rows}
            setRows={setRows}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowCounts={[100]}
          />
        </div>
      }
    />
  );
};

export default IssuedVsPendingReports;

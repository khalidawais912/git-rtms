"use client";
import { GENERATE_REPORT_API } from "@/shared/api/endpoints";
import Button from "@/shared/components/Button";
import CustomInput from "@/shared/components/Form/CustomInput";
import CustomLabel from "@/shared/components/Form/CustomLabel";
import CustomSelect, {
  defaultOption,
  OptionType,
} from "@/shared/components/Form/CustomSelect";
import { paginationSelectStyles } from "@/shared/components/Table/Pagination";
import RowHeader from "@/shared/components/Table/RowHeader";
import TableData from "@/shared/components/Table/TableData";
import TableHeading from "@/shared/components/Table/TableHeading";
import DownloadDropDown from "@/shared/components/UserDropDown/DownloadDropDown";
import { ReportTypeStatusEnum } from "@/app/dashboard/types/reportTypeStatus";
import apiClient, { AxiosError } from "@/shared/api/client";
import {
  addDayToFormattedDate,
  displayStatusText,
  exportToPDF,
  formatAmountWithCommas,
  getFormattedDate,
  getTimeLeft,
} from "@/shared/utils";
import { exportDataToExcel } from "@/shared/utils/exportToExcel";
import { format } from "date-fns";
import { sort } from "fast-sort";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS
import { FiSearch } from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { LuSearch, LuUserRound } from "react-icons/lu";
import { PiCircleFill } from "react-icons/pi";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import Badge from "../../ProjectsTable/components/Badge";
import styles from "../../ProjectsTable/ProjectsTable.module.css";
import {
  FilterParams,
  RangeType,
} from "../../ProjectsTable/ProjectsTableUtils";
import useProjectsTableUtils from "../../ProjectsTable/useProjectsTableUtils";
import AsyncAction from "@/shared/components/Form/AsyncAction";
import Spinner from "@/shared/components/Spinner";

export interface ProjectsList {
  id: number;
  pcIvmainId: number;
  name: string;
  gsNo: string;
  sectorId: number;
  sectorName: string;
  visitStartDate: string;
  visitEndDate: string;
  cost: number;
  userName: string;
  designation: string;
  visitId: number;
  approvalDate: string;
  sponsoringAgencyName: string;
  sponsring_agency_id: number;
  executingAgencyName: string;
  executing_agency_id: number;
  city: string;
  division_Id: number;
  divisionName: string;
  districtId: number;
  districtName: string;
  isSNE: true;
  isPCIVSubmitted: true;
  pcivSubmittedDate: string;
  status: string;
  visitCount: number;
  maxMRIValue: number;
  avgMRIValue: number;
  hasVisited: true;
}

interface Props {
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
  label: string;
  keys: (keyof ProjectsList)[];
  role: string;
  allowLink?: boolean;
}

const ProjectsTable = ({
  projectsData,
  setProjectsData,
  label,
  keys,
  allowLink = true,
  role = "",
}: Props) => {
  console.log("projectsData", projectsData);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const { rowCountOptions, districtOptions, sectorOptions, userOptions } =
    useProjectsTableUtils();

  const handleDistrictChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) setDistrictName(selectedOption.value);

    setDropdownFilterValue((prev) => {
      if (selectedOption?.value === "") {
        // Remove "District Name" from the filter
        return prev.filter((item) => !item.startsWith("District Name:"));
      } else {
        // Add/Update "District Name" in the filter
        const updated = prev.filter(
          (item) => !item.startsWith("District Name:"),
        );
        return [...updated, `District Name: ${selectedOption?.value}`];
      }
    });
    applyFilters({
      districtName: selectedOption?.value,
      sectorName,
      userName,
      startDate: dateRangeState[0].startDate
        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
        : "",
      endDate: dateRangeState[0].endDate
        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
        : "",
      reportStatus: reportStatus,
    });
    console.log(`Option selected:`, selectedOption);
  };

  const handleSectorChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) setSectorName(selectedOption.value);

    setDropdownFilterValue((prev) => {
      if (selectedOption?.value === "") {
        // Remove "Sector Name" from the filter
        return prev.filter((item) => !item.startsWith("Sector Name:"));
      } else {
        // Add/Update "Sector Name" in the filter
        const updated = prev.filter((item) => !item.startsWith("Sector Name:"));
        return [...updated, `Sector Name: ${selectedOption?.value}`];
      }
    });
    applyFilters({
      districtName,
      sectorName: selectedOption?.value,
      userName,
      startDate: dateRangeState[0].startDate
        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
        : "",
      endDate: dateRangeState[0].endDate
        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
        : "",
      reportStatus: reportStatus,
    });
    console.log(`Option selected:`, selectedOption);
  };

  const handleUserChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) setUserName(selectedOption.value);

    setDropdownFilterValue((prev) => {
      if (selectedOption?.value === "") {
        // Remove "User Name" from the filter
        return prev.filter((item) => !item.startsWith("User Name:"));
      } else {
        // Add/Update "User Name" in the filter
        const updated = prev.filter((item) => !item.startsWith("User Name:"));
        return [...updated, `User Name: ${selectedOption?.value}`];
      }
    });
    applyFilters({
      districtName,
      sectorName,
      userName: selectedOption?.value,
      startDate: dateRangeState[0].startDate
        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
        : "",
      endDate: dateRangeState[0].endDate
        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
        : "",
      reportStatus: reportStatus,
    });
    console.log(`Option selected:`, selectedOption);
  };

  const handleReportStatusChange = (
    selectedOption: SingleValue<OptionType>,
  ) => {
    const value = Number(selectedOption?.value);
    setReportStatus(value);
    setDropdownFilterValue((prev) => {
      if (value === -1) {
        // Remove "Report Status" from the filter
        return prev.filter((item) => !item.startsWith("Report Status:"));
      } else {
        // Add/Update "Report Status" in the filter
        const updated = prev.filter(
          (item) => !item.startsWith("Report Status:"),
        );
        return [...updated, `Report Status: ${value}`];
      }
    });
    applyFilters({
      districtName,
      sectorName,
      userName,
      startDate: dateRangeState[0].startDate
        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
        : "",
      endDate: dateRangeState[0].endDate
        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
        : "",
      reportStatus: value,
    });
    console.log(`Option selected:`, selectedOption);
  };

  const [modifiedData, setModifiedData] = useState<ProjectsList[]>([]);
  const [filteredData, setFilteredData] = useState<ProjectsList[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownFilterValue, setDropdownFilterValue] = useState<string[]>([]);
  const [paginatedData, setPaginatedData] = useState<ProjectsList[]>([]);

  // Sync projectsData → modifiedData initially
  useEffect(() => {
    setModifiedData([...projectsData]);
  }, [projectsData]);

  // Apply search every time searchTerm or modifiedData changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = modifiedData.filter((item) =>
        [
          item.gsNo,
          item.name,
          item.sectorName,
          item.districtName,
          item.userName,
          item.designation,
        ]
          .filter(Boolean)
          .map((field) => field.toLowerCase())
          .some((field) => field.includes(searchTerm.toLowerCase())),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(modifiedData); // no search → show filtered dropdown results
    }
  }, [searchTerm, modifiedData]);

  // Handle search input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProjectsList;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof ProjectsList) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = modifiedData && sort(modifiedData)[direction](key);
    setSortConfig({ key, direction });
    if (sortedData) {
      setModifiedData([...sortedData]);
    }
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // default rows per page
  const [currentPage, setCurrentPage] = useState(1);

  // Derived values
  const dataToPaginate = filteredData.length ? filteredData : modifiedData;
  const totalPages = Math.ceil(dataToPaginate.length / rows);
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;

  // Handlers
  const handleRowsPerPage = (count: number) => {
    setRows(count);
    setCurrentPage(1); // reset to first page
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Maximum visible page numbers
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <div className="col p-0" key="ellipsis-start">
          <Button
            className="btn btn-sm bg-color-evaluation-theme-blue rounded-circle text-white border-0 d-flex justify-content-center align-items-center"
            disabled
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            <HiOutlineDotsHorizontal />
          </Button>
        </div>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <div key={i} className="col p-0">
          <Button
            className={`btn btn-sm rounded-circle border-0 d-flex justify-content-center align-items-center shadow-none fs-6 ${
              i === currentPage
                ? " fw-bold mb-2 color-dark-gray"
                : "fw-6 color-evaluation-theme-blue"
            }`}
            onClick={() => handlePageChange(i)}
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            {i}
          </Button>
        </div>,
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <div className="col p-0" key="ellipsis-end">
          <Button
            className="btn btn-sm bg-color-evaluation-theme-blue rounded-circle text-white border-0 d-flex justify-content-center align-items-center"
            disabled
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            <HiOutlineDotsHorizontal />
          </Button>
        </div>,
      );
    }

    return pageNumbers;
  };

  // Slice data whenever inputs change
  useEffect(() => {
    const paginated = dataToPaginate.slice(indexOfFirstRow, indexOfLastRow);
    setPaginatedData(paginated);
  }, [dataToPaginate, currentPage, rows, indexOfFirstRow, indexOfLastRow]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dropdownFilterValue, modifiedData]);

  const renameMap: Record<string, string> = {
    srNo: "Sr No",
    pcIvmainId: "PC IV MAIN ID",
    gSno: "GS No.",
    projectName: "PROJECT NAME",
    districtName: "DISTRICT NAME",
    sectorName: "SECTOR NAME",
    userName: "USER NAME",
    reportCompletion: "REPORT COMPLETION",
    fileGenrated: "REPORT GENERATED",
    visitStartDate: "DATE RANGE",
    completedDate: "COMPLETED DATE",
    deadline: "DEADLINE",
    visitCount: "No. OF VISITS",
    cost: "COST (M)",
    revisedAllocation: "REVISED ALLOCATION (M)",
    pnDReleases: "PN D RELEASES (M)",
    utilization: "EXPENDITURE + UTILIZATION (M)",
    utilPercent: "UTIL. PERCENT",
    reportStatus: "REPORT STATUS",
    // Add other mappings as needed
  };

  // Helper function to rename columns dynamically
  const formatKeyName = (key: string): string => {
    return renameMap[key] || key.replace(/([A-Z])/g, " $1").toUpperCase();
  };

  const deadlineColumnValue = (submittedDate: string, deadlineDate: string) => {
    const submittedTime = new Date(submittedDate);
    const deadlineTime = new Date(deadlineDate);

    const diffInMilliseconds = submittedTime.getTime() - deadlineTime.getTime();

    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate months
    const diffInYears = Math.floor(diffInDays / 365); // Approximate years
    const result =
      submittedTime <= deadlineTime
        ? "Submitted on time"
        : diffInYears >= 1 && diffInMonths >= 12
          ? `${diffInYears} year${diffInYears > 1 ? "s" : ""} Late Submitted`
          : diffInMonths >= 1
            ? `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} Late Submitted`
            : `${diffInDays} day${diffInDays > 1 ? "s" : ""} Late Submitted`;

    return result;
  };

  const keysForPDF = ["srNo", ...keys];
  const columns = keysForPDF.map((key) => ({
    header: formatKeyName(key), // Format key for header
    dataKey: key, // Use the key for data mapping
  }));

  const tableRows = (
    searchTerm || dropdownFilterValue.length > 0 ? filteredData : projectsData
  ).map((data: any, index) => {
    const row: Record<string, any> = { srNo: index + 1 }; // Initialize row with srNo

    keysForPDF.forEach((key) => {
      switch (key) {
        case "srNo":
          row[key] = index + 1;
          break;
        case "userName":
          row[key] = `${data.userName} (${data.designation})`;
          break;
        case "reportCompletion":
          row[key] = `${Math.round(data.reportCompletion)}%`;
          break;
        case "visitStartDate":
          row[key] =
            data.visitStartDate &&
            `${new Date(data.visitStartDate).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
             to ${
               data.visitEndDate &&
               new Date(data.visitEndDate).toLocaleDateString("en-GB", {
                 weekday: "short",
                 day: "2-digit",
                 month: "short",
                 year: "numeric",
               })
             }
            `;
          break;
        case "completedDate":
          row[key] = data.completedDate
            ? `${new Date(data.completedDate).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}`
            : "NA";
          break;
        case "utilization":
          row[key] = `${data.utilization + data.expUpToJune}`;
          break;
        case "utilPercent":
          row[key] = `${data.utilPercent}%`;
          break;
        case "deadline":
          if (data.submittedDate && data.deadline) {
            row[key] = deadlineColumnValue(data.submittedDate, data.deadline);
          } else if (data.deadline) {
            row[key] = getTimeLeft(data.deadline).replace("-", "");
          } else {
            row[key] = "NA";
          }

          break;
        case "reportStatus":
          row[key] = displayStatusText(data.reportStatus);
          break;
        case "statusDate":
          row[key] = data.statusDate
            ? `${new Date(data.statusDate).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}`
            : "NA";
          break;
        default:
          row[key] = data[key]; // Handle any additional keys dynamically
      }
    });

    return row;
  });

  // Export to Excel function
  const exportToExcel = () => {
    const headers = ["srNo", ...keys]; // Rename headers dynamically
    const displayHeaders = headers.map(formatKeyName);
    const data = (
      searchTerm || dropdownFilterValue.length > 0 ? filteredData : projectsData
    ).map((item: any, index) => {
      const row: Record<string, any> = {};

      headers.forEach((header) => {
        const key =
          Object.entries(renameMap).find(
            ([, value]) => value === header,
          )?.[0] || header; // Find original key from renamed header

        switch (key) {
          case "srNo":
            row[formatKeyName(header)] = index + 1;
            break;
          case "id":
            row[formatKeyName(header)] = item.id;
            break;
          case "pcIvmainId":
            row[formatKeyName(header)] = item.pcIvmainId;
            break;
          case "name":
            row[formatKeyName(header)] = item.name;
            break;
          case "gsNo":
            row[formatKeyName(header)] = item.gsNo;
            break;
          case "sectorId":
            row[formatKeyName(header)] = item.sectorId;
            break;
          case "sectorName":
            row[formatKeyName(header)] = item.sectorName;
            break;
          case "visitStartDate":
            row[formatKeyName(header)] =
              item.visitStartDate &&
              `${new Date(item.visitStartDate).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })} to ${
                item.visitEndDate &&
                new Date(item.visitEndDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              }`;
            break;
          case "cost":
            row[formatKeyName(header)] = item.cost;
            break;
          case "userName":
            row[formatKeyName(header)] =
              `${item.userName} (${item.designation})`;
            break;
          case "visitId":
            row[formatKeyName(header)] = item.visitId;
            break;
          case "approvalDate":
            row[formatKeyName(header)] = item.approvalDate;
            break;
          case "sponsoringAgencyName":
            row[formatKeyName(header)] = item.sponsoringAgencyName;
            break;
          case "sponsring_agency_id":
            row[formatKeyName(header)] = item.sponsring_agency_id;
            break;
          case "executingAgencyName":
            row[formatKeyName(header)] = item.executingAgencyName;
            break;
          case "executing_agency_id":
            row[formatKeyName(header)] = item.executing_agency_id;
            break;
          case "city":
            row[formatKeyName(header)] = item.city;
            break;
          case "division_Id":
            row[formatKeyName(header)] = item.division_Id;
            break;
          case "divisionName":
            row[formatKeyName(header)] = item.divisionName;
            break;
          case "districtId":
            row[formatKeyName(header)] = item.districtId;
            break;
          case "districtName":
            row[formatKeyName(header)] = item.districtName;
            break;
          case "isSNE":
            row[formatKeyName(header)] = item.isSNE ? "YES" : "NO";
            break;
          case "isPCIVSubmitted":
            row[formatKeyName(header)] = item.isPCIVSubmitted ? "YES" : "NO";
            break;
          case "pcivSubmittedDate":
            row[formatKeyName(header)] = new Date(
              item.pcivSubmittedDate,
            ).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            break;
          case "status":
            row[formatKeyName(header)] = item.status;
            break;
          case "visitCount":
            row[formatKeyName(header)] = item.visitCount;
            break;

          case "maxMRIValue":
            row[formatKeyName(header)] = item.maxMRIValue;
            break;
          case "avgMRIValue":
            row[formatKeyName(header)] = item.avgMRIValue;
            break;
          case "hasVisited":
            row[formatKeyName(header)] = item.hasVisited;
            break;

          default:
            row[formatKeyName(header)] = item[formatKeyName(key)] || ""; // Handle any additional keys dynamically
        }
      });

      return row;
    });

    exportDataToExcel(
      data,
      displayHeaders,
      `${label} ${new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}.xlsx`,
    );
  };

  const [districtName, setDistrictName] = useState<string>("");
  const [sectorName, setSectorName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [reportStatus, setReportStatus] = useState<number>(-1);

  // Handle dropdown filters → update modifiedData
  const applyFilters = ({
    districtName = "",
    sectorName = "",
    userName = "",
    startDate = "",
    endDate = "",
    reportStatus = -1,
  }: FilterParams) => {
    let filtered = [...projectsData]; // IMPORTANT: start from original every time

    if (districtName) {
      filtered = filtered.filter(
        (p) => p.districtName?.toLowerCase() === districtName.toLowerCase(),
      );
    }
    if (sectorName) {
      filtered = filtered.filter(
        (p) => p.sectorName?.toLowerCase() === sectorName.toLowerCase(),
      );
    }
    if (userName) {
      filtered = filtered.filter((p) =>
        p.userName?.toLowerCase().includes(userName.toLowerCase()),
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter((p) => {
        if (!p.visitStartDate) return false;
        const projectDate = new Date(p.visitStartDate);
        return (
          projectDate >= new Date(startDate) && projectDate <= new Date(endDate)
        );
      });
    }
    // Filter by report submitted
    if (
      reportStatus &&
      reportStatus !== null &&
      reportStatus !== undefined &&
      reportStatus !== -1
    ) {
      filtered = filtered.filter(
        (project) => parseInt(project.status) === reportStatus,
      );
    }

    setModifiedData(filtered); // update dropdown-filtered data
  };

  const [dateRangeState, setDateRangeState] = useState<RangeType[]>([
    {
      startDate: undefined, // Initially no start date selected
      endDate: undefined, // Initially no end date selected
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;

    // Ensure startDate and endDate are properly handled
    const updatedSelection = {
      startDate: selection.startDate || new Date(), // Provide a default date if undefined
      endDate: selection.endDate || new Date(), // Provide a default date if undefined
      key: selection.key || "selection",
    };

    // Update filters and UI state
    applyFilters({
      districtName,
      sectorName,
      userName,
      startDate: updatedSelection.startDate.toISOString().split("T")[0],
      endDate: updatedSelection.endDate.toISOString().split("T")[0],
      reportStatus: reportStatus,
    });

    setDropdownFilterValue((prev) => {
      const updated = prev.filter((item) => !item.startsWith("Start Date:"));
      if (selection.startDate) {
        return [
          ...updated,
          `Start Date: ${selection.startDate.toDateString()}`,
        ];
      }
      return updated;
    });

    setDropdownFilterValue((prev) => {
      const updated = prev.filter((item) => !item.startsWith("End Date:"));
      if (selection.endDate) {
        return [...updated, `End Date: ${selection.endDate.toDateString()}`];
      }
      return updated;
    });

    // Update state for the date range picker
    setDateRangeState([updatedSelection]);
  };

  const clearDateSelection = () => {
    setDateRangeState([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidenav = () => {
    setIsExpanded(!isExpanded);
  };

  const reportPdfDownload = async (
    visitId: number,
    projectId: number,
    reportTypeRequest: number,
  ) => {
    console.log(visitId, projectId, reportTypeRequest);
    try {
      const response = await apiClient.post(
        `${GENERATE_REPORT_API}/GetReportPath`,
        {
          visitId,
          projectId,
          reportTypeRequest,
        },
      );

      console.log("response", response);

      const fileUrl = process.env.NEXT_PUBLIC_BACKEND_API + response.data.data; // API should return full URL or relative path

      if (fileUrl) {
        // Trigger download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error(err);
      toast.error((err as AxiosError).message);
    }
  };

  const pcIVReportPdfDownload = async (pcIvId: number) => {
    console.log(
      `${GENERATE_REPORT_API}/GenerateReportPCIVForWeb?pcIVid=${pcIvId}`,
    );
    try {
      const response = await apiClient.post(
        `${GENERATE_REPORT_API}/GenerateReportPCIVForWeb?pcIVid=${pcIvId}`,
      );

      console.log("response", response);

      const fileUrl = process.env.NEXT_PUBLIC_BACKEND_API + response.data.data; // API should return full URL or relative path

      if (fileUrl) {
        // Trigger download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error(err);
      toast.error((err as AxiosError).message);
    }
  };

  useEffect(() => {
    setSelectedOptions([rowCountOptions[0]]);
    handleRowsPerPage(parseInt(rowCountOptions[0].value));
  }, []);

  return (
    <div className={`d-flex`}>
      <div
        className={`${styles.layout} w-100 bg-white`}
        style={{
          borderRadius: "14px",
          marginTop: "0px",
          border: "1px solid #CBD5E1",
        }}
      >
        <div
          className={`h-100 overflow-auto ${styles.sidenav} ${
            isExpanded ? styles.expanded : ""
          }`}
          style={{
            borderRight: "1px solid #CBD5E1",
            zIndex: 3,
            borderTopLeftRadius: "14px",
            borderBottomLeftRadius: "14px",
            padding: "23px 15px",
            background: "#f8fafc",
          }}
        >
          <div className="flex-grow-1">
            <ul className="list-group p-0" style={{ marginBottom: "32px" }}>
              <li
                className={`${
                  isExpanded ? styles.headingExpanded : styles.headingCollapsed
                } list-group-item border-0 bg-transparent p-0`}
              >
                <div className="row d-flex justify-content-between align-items-center">
                  <div className="col">
                    <div className="row d-flex align-items-center">
                      <div className="col-auto" style={{ padding: "0px 10px" }}>
                        <Image
                          src="/icons/logoNew1.svg"
                          alt="logoNew"
                          style={{
                            filter: "drop-shadow(0px 0px .75px green)",
                            width: "48px",
                            height: "43px",
                          }}
                          width={48}
                          height={43}
                          priority
                        />
                      </div>
                      <div className="col-auto p-0">
                        <span className="fw-bold fs18px">Advance Search</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-auto">
                    <Button
                      className="btn p-0"
                      onClick={toggleSidenav}
                      aria-label="Toggle navigation"
                    >
                      <Image
                        src="/icons/box.svg"
                        alt="box"
                        width={22}
                        height={22}
                      />
                    </Button>
                  </div>
                </div>
              </li>
              <li
                className={`${
                  isExpanded ? styles.headingCollapsed : styles.headingExpanded
                } list-group-item border-0 bg-transparent p-0`}
              >
                <Button
                  className="btn"
                  onClick={toggleSidenav}
                  aria-label="Toggle navigation"
                >
                  <Image
                    src="/icons/box.svg"
                    alt="box"
                    width={22}
                    height={22}
                  />
                </Button>
              </li>
            </ul>

            <div className={`col ${!isExpanded && "d-none"}`}>
              <div className="col" style={{ marginBottom: "32px" }}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <button
                      className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                      type="submit"
                      style={{
                        border: "1.08px solid #CBD5E1",
                        padding: "8px 0px 12px 12px",
                      }}
                    >
                      <LuSearch size={17} style={{ color: "#475569" }} />
                    </button>
                    <CustomInput
                      type="text"
                      className="form-control fw-bold border-start-0 rounded-pill rounded-start shadow-none fs15px bg-transparent py-2 placeholder-bold"
                      style={{
                        border: "1px solid #CBD5E1",
                      }}
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleChange}
                      id="search"
                    />
                  </div>
                </form>
              </div>

              {keys.includes("districtName") && (
                <div className="col mb-3 text-start">
                  <CustomLabel
                    inputNode={
                      <CustomSelect
                        options={[defaultOption, ...districtOptions]}
                        closeMenuOnSelect={true}
                        id="districtName"
                        onChangeSingle={(
                          newValue: SingleValue<{
                            value: string;
                            label: string;
                          }>,
                        ) => {
                          if (newValue) {
                            handleDistrictChange(newValue);
                          }
                        }}
                      />
                    }
                  >
                    District Name
                  </CustomLabel>

                  {/* <select
                  className="w-100"
                  style={{
                    background: "rgba(16, 143, 168, .1)",
                    outline: "none",
                    border: "1px solid #D0D5DD",
                  }}
                  aria-label="District Name"
                  name="districtName"
                  onChange={(e) => {
                    const value = e.target.value;
                    setDistrictName(value);
                    setDropdownFilterValue((prev) => {
                      if (value === "") {
                        // Remove "District Name" from the filter
                        return prev.filter(
                          (item) => !item.startsWith("District Name:")
                        );
                      } else {
                        // Add/Update "District Name" in the filter
                        const updated = prev.filter(
                          (item) => !item.startsWith("District Name:")
                        );
                        return [...updated, `District Name: ${value}`];
                      }
                    });
                    setDistrictName(e.target.value);
                    applyFilters({
                      districtName: e.target.value,
                      sectorName,
                      userName,
                      startDate: dateRangeState[0].startDate
                        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                        : "",
                      endDate: dateRangeState[0].endDate
                        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                        : "",
                      reportStatus,
                    });
                  }}
                  disabled={searchTerm ? true : false}
                >
                  <option value="">Select</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.districtName}>
                      {district.districtName}
                    </option>
                  ))}
                </select> */}
                </div>
              )}
              {keys.includes("visitStartDate") && (
                <div
                  className="col mb-3 text-start"
                  style={{ pointerEvents: `${searchTerm ? "none" : "auto"}` }}
                >
                  <CustomLabel
                    inputNode={
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header
                            className="custom-input form-control form-control-sm border-0 fs14px p-0"
                            id="dateFilterSideNavAccordian"
                          >
                            Select
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="col mb-3 text-start">
                              <DateRange
                                ranges={dateRangeState}
                                onChange={handleSelect}
                                moveRangeOnFirstSelection={false}
                                maxDate={new Date()} // Restrict future dates
                                dateDisplayFormat="dd/MM/yyyy"
                                // className={styles.customDateRange}
                              />
                              <p>
                                Selected Range:{" "}
                                {dateRangeState[0].startDate
                                  ? format(
                                      dateRangeState[0].startDate,
                                      "dd/MM/yyyy",
                                    )
                                  : "No start date"}{" "}
                                to{" "}
                                {dateRangeState[0].endDate
                                  ? format(
                                      dateRangeState[0].endDate,
                                      "dd/MM/yyyy",
                                    )
                                  : "No end date"}
                              </p>
                              <button
                                onClick={() => {
                                  setDropdownFilterValue((prev) => {
                                    return prev.filter(
                                      (item) =>
                                        !item.startsWith("Start Date:") &&
                                        !item.startsWith("End Date:"),
                                    );
                                  });
                                  setDateRangeState([
                                    {
                                      startDate: undefined,
                                      endDate: undefined,
                                      key: "selection",
                                    },
                                  ]);
                                  applyFilters({
                                    districtName,
                                    sectorName,
                                    userName,
                                    startDate: "",
                                    endDate: "",
                                    reportStatus: reportStatus,
                                  });
                                }}
                                style={{
                                  padding: "10px 15px",
                                  background: "#ff5c5c",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                              >
                                Clear Dates
                              </button>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    }
                  >
                    Date Range
                  </CustomLabel>
                </div>
              )}
              {keys.includes("sectorName") && (
                <div className="col mb-3 text-start">
                  <CustomLabel
                    inputNode={
                      <CustomSelect
                        options={[defaultOption, ...sectorOptions]}
                        closeMenuOnSelect={true}
                        id="sectorName"
                        onChangeSingle={(
                          newValue: SingleValue<{
                            value: string;
                            label: string;
                          }>,
                        ) => {
                          if (newValue) {
                            handleSectorChange(newValue);
                          }
                        }}
                      />
                    }
                  >
                    Sector Name
                  </CustomLabel>

                  {/* <select
                id="sectorName"
                className="w-100"
                style={{
                  background: "rgba(16, 143, 168, .1)",
                  outline: "none",
                  border: "1px solid #D0D5DD",
                }}
                aria-label="Sector Name"
                name="sectorName"
                onChange={(e) => {
                  const value = e.target.value;
                  setSectorName(value);
                  setDropdownFilterValue((prev) => {
                    if (value === "") {
                      // Remove "Sector Name" from the filter
                      return prev.filter(
                        (item) => !item.startsWith("Sector Name:")
                      );
                    } else {
                      // Add/Update "Sector Name" in the filter
                      const updated = prev.filter(
                        (item) => !item.startsWith("Sector Name:")
                      );
                      return [...updated, `Sector Name: ${value}`];
                    }
                  });
                  applyFilters({
                    districtName,
                    sectorName: e.target.value,
                    userName,
                    startDate: dateRangeState[0].startDate
                      ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                      : "",
                    endDate: dateRangeState[0].endDate
                      ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                      : "",
                    reportStatus: reportStatus,
                  });
                }}
                disabled={searchTerm ? true : false}
              >
                <option value="">Select</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.name}>
                    {sector.name}
                  </option>
                ))}
              </select> */}
                </div>
              )}
              {keys.includes("userName") && (
                <div className="col mb-3 text-start">
                  <CustomLabel
                    inputNode={
                      <CustomSelect
                        options={[defaultOption, ...userOptions]}
                        closeMenuOnSelect={true}
                        menuPlacement="top"
                        id="userName"
                        onChangeSingle={(
                          newValue: SingleValue<{
                            value: string;
                            label: string;
                          }>,
                        ) => {
                          if (newValue) {
                            handleUserChange(newValue);
                          }
                        }}
                      />
                    }
                  >
                    User Name
                  </CustomLabel>

                  {/* <select
                id="userName"
                className="w-100"
                style={{
                  background: "rgba(16, 143, 168, .1)",
                  outline: "none",
                  border: "1px solid #D0D5DD",
                }}
                aria-label="UserName"
                name="userName"
                onChange={(e) => {
                  const value = e.target.value;
                  setUserName(value);
                  setDropdownFilterValue((prev) => {
                    if (value === "") {
                      // Remove "User Name" from the filter
                      return prev.filter(
                        (item) => !item.startsWith("User Name:")
                      );
                    } else {
                      // Add/Update "User Name" in the filter
                      const updated = prev.filter(
                        (item) => !item.startsWith("User Name:")
                      );
                      return [...updated, `User Name: ${value}`];
                    }
                  });
                  applyFilters({
                    districtName,
                    sectorName,
                    userName: e.target.value,
                    startDate: dateRangeState[0].startDate
                      ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                      : "",
                    endDate: dateRangeState[0].endDate
                      ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                      : "",
                    reportStatus: reportStatus,
                  });
                }}
                disabled={searchTerm ? true : false}
              >
                <option value="">Select</option>
                {users.map((user) => (
                  <option key={user.user_Id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select> */}
                </div>
              )}
              {/* {keys.includes("deadline") && (
            <div className="col mb-3 text-start">
              <label htmlFor="reportStatus" className="form-label">
                Report Status
              </label>
              <Select
                options={[defaultNumberOption, ...reportStatusOptions]}
                name="reportStatus"
                id="reportStatus"
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                styles={customStyles}
                onChange={(
                  newValue: SingleValue<{ value: string; label: string }>
                ) => {
                  if (newValue) {
                    handleReportStatusChange(newValue);
                  }
                }}
              />
            </div>
          )} */}
            </div>
            <div className={`col p-0 ${isExpanded && "d-none"}`}>
              <ul
                className="list-group p-0"
                style={{ marginBottom: "18.57px" }}
              >
                <li
                  className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                  style={{ marginBottom: "14.86px" }}
                  onClick={toggleSidenav}
                >
                  {/* <FaSearch className="img-fluid" /> */}
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle bg-white"
                    style={{
                      width: "44.57px",
                      height: "44.57px",
                    }}
                  >
                    <FiSearch size={22} style={{ color: "#475569" }} />
                  </div>
                </li>
              </ul>

              <ul className="list-group p-0">
                {keys.includes("districtName") && (
                  <li
                    className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                    style={{ marginBottom: "23.21px" }}
                    onClick={toggleSidenav}
                  >
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        width: "44.57px",
                        height: "44.57px",
                      }}
                    >
                      <Image
                        className="img-fluid"
                        src="/icons/city-01.svg"
                        alt="city-01"
                        width={22}
                        height={22}
                      />
                    </div>
                  </li>
                )}
                {keys.includes("visitStartDate") && (
                  <li
                    className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                    style={{ marginBottom: "23.21px" }}
                    onClick={toggleSidenav}
                  >
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        width: "44.57px",
                        height: "44.57px",
                      }}
                    >
                      <Image
                        className="img-fluid"
                        src="/icons/calendar-02.svg"
                        alt="calendar-02"
                        width={22}
                        height={22}
                      />
                    </div>
                  </li>
                )}
                {keys.includes("sectorName") && (
                  <li
                    className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                    style={{ marginBottom: "23.21px" }}
                    onClick={toggleSidenav}
                  >
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        width: "44.57px",
                        height: "44.57px",
                      }}
                    >
                      <Image
                        className="img-fluid"
                        src="/icons/setup-01.svg"
                        alt="setup-01"
                        style={{ width: "22px", height: "22px" }}
                        width={22}
                        height={22}
                      />
                    </div>
                  </li>
                )}
                {keys.includes("userName") && (
                  <li
                    className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                    style={{ marginBottom: "23.21px" }}
                    onClick={toggleSidenav}
                  >
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        width: "44.57px",
                        height: "44.57px",
                      }}
                    >
                      <LuUserRound size={22} style={{ color: "#475569" }} />
                    </div>
                  </li>
                )}
                {/* {keys.includes("deadline") && (
              <li
                className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                onClick={toggleSidenav}
              >
                <Image
                  className="img-fluid"
                  src="/icons/submittedReport.svg"
                  alt="dates"
                  width={20}
                  height={20}
                />
              </li>
            )} */}
              </ul>
            </div>
          </div>

          {isExpanded && (
            <div style={{ marginTop: "auto", paddingTop: "10px" }}>
              <hr className="mb-4 mt-0" />
              <p className="fw-bold">{role}</p>
              <p className="fw-5 fs14px" style={{ color: "#475569" }}>
                ---
              </p>
            </div>
          )}
        </div>
        <div
          className={`${styles.mainContent} ${
            isExpanded ? styles.shiftRight : ""
          } flex-grow-1 p-3 overflow-hidden pt-0 pb-0`}
        >
          {/* <div style={{ height: "96vh", overflow: "hidden" }}> */}
          {/* <ScrollWrapper> */}

          <div
            className="row d-flex align-items-center"
            style={{ padding: "17.33px 26px" }}
          >
            <div className="col p-0">
              <div className="row align-items-center">
                <div className="col-auto mb-1 mb-lg-0">
                  <h4 className="m-0" style={{ fontWeight: 800 }}>
                    {label}
                  </h4>
                </div>
                <div className="col-auto mb-2 mb-lg-0">
                  <span
                    className="badge rounded-pill fs13px fw-6"
                    style={{ color: "#1C6BA6", border: "1.08px solid #1C6BA6" }}
                  >
                    <div className="row align-items-center">
                      <div className="col-auto pe-0">
                        <PiCircleFill
                          size={8}
                          style={{ color: "#1C6BA6", marginBottom: "2px" }}
                        />
                      </div>
                      <div className="col ps-1">
                        {filteredData.length} {label}
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            {handleChange && (
              <div className="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-3">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <button
                      className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                      type="submit"
                      style={{
                        border: "1.08px solid #CBD5E1",
                        padding: "8px 0px 12px 12px",
                      }}
                    >
                      <LuSearch size={17} style={{ color: "#475569" }} />
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
            )}
            <div className="col-auto">
              <DownloadDropDown
                onClickPdf={() =>
                  tableRows &&
                  exportToPDF(columns, tableRows, new Date(), label)
                }
                onClickExcel={exportToExcel}
              />
            </div>
          </div>
          <div
            className="table-responsive mb-2"
            style={{
              margin: "0px -17px",
              height: "calc(100vh - 135px)",
              overflow: "auto",
            }}
          >
            <table className="table table-hover mb-0">
              <thead>
                {keys.includes("cost") ? (
                  <>
                    <tr
                      className="position-sticky top-0 bg-white"
                      style={{ zIndex: 3 }}
                    >
                      <TableHeading
                        className="bg-color-sea-blue"
                        textClassName="text-white text-nowrap"
                        name="Grand Total Overall 1557"
                        colSpan={2}
                      />
                      <TableHeading name="" colSpan={2} />
                      <TableHeading
                        className="bg-color-sea-blue"
                        textClassName="text-white"
                        name={formatAmountWithCommas(
                          dataToPaginate.reduce(
                            (sum, d) => sum + (d.cost || 0),
                            0,
                          ),
                        )}
                      />
                      <TableHeading colSpan={7} name="" />
                    </tr>
                    <tr
                      className="position-sticky bg-white"
                      style={{
                        top: "52px", // adjust height based on your first row
                        zIndex: 2,
                      }}
                    >
                      {keys.map((k, i) => (
                        <TableHeading
                          key={k + i}
                          className="text-nowrap"
                          name={
                            k.toLowerCase() === "id"
                              ? "ID"
                              : k.toLowerCase() === "gsno"
                                ? "GS NO."
                                : k.toLowerCase() === "username"
                                  ? "USERNAME"
                                  : k.toLowerCase() === "visitcount"
                                    ? "no. of visits"
                                    : k.toLowerCase() === "visitstartdate"
                                      ? "Date Range"
                                      : k.toLowerCase() === "filegenrated"
                                        ? "report generated"
                                        : k.toLowerCase() === "statusDate"
                                          ? "status Date"
                                          : formatKeyName(k)
                          }
                          handleSort={() => handleSort(`${k}`)}
                        />
                      ))}
                    </tr>
                  </>
                ) : (
                  <tr>
                    {keys.map((k, i) => (
                      <TableHeading
                        key={k + i}
                        className="text-nowrap"
                        name={
                          k.toLowerCase() === "id"
                            ? "ID"
                            : k.toLowerCase() === "gsno"
                              ? "GS NO."
                              : k.toLowerCase() === "username"
                                ? "USERNAME"
                                : k.toLowerCase() === "visitcount"
                                  ? "no. of visits"
                                  : k.toLowerCase() === "visitstartdate"
                                    ? "Date Range"
                                    : k.toLowerCase() === "filegenrated"
                                      ? "report generated"
                                      : k.toLowerCase() === "statusDate"
                                        ? "status Date"
                                        : formatKeyName(k)
                        }
                        handleSort={() => handleSort(`${k}`)}
                      />
                    ))}
                    {/* <TableHeading
                  name="project Name"
                  handleSort={() => handleSort("projectName")}
                />
                <TableHeading
                  name="sector Name"
                  handleSort={() => handleSort("sectorName")}
                />
                <TableHeading
                  name="district Name"
                  handleSort={() => handleSort("districtName")}
                />
                <TableHeading
                  name="no. of Visits"
                  handleSort={() => handleSort("visitCount")}
                />
                <TableHeading
                  name="user Name"
                  handleSort={() => handleSort("userName")}
                />
                <TableHeading
                  name="report Completion"
                  handleSort={() => handleSort("reportCompletion")}
                />
                <TableHeading
                  name="visit Date"
                  handleSort={() => handleSort("visitStartDate")}
                />
                <TableHeading
                  name="completed Date"
                  handleSort={() => handleSort("completedDate")}
                />
                <TableHeading
                  name="deadline"
                  handleSort={() => handleSort("deadline")}
                />
                <TableHeading
                  name="report generated"
                  handleSort={() => handleSort("fileGenrated")}
                /> */}
                  </tr>
                )}
              </thead>
              <tbody>
                {paginatedData?.map((d, i) => (
                  <tr key={i}>
                    {keys.map((key) => {
                      if (key === "id") {
                        // Handle visitStartDate and visitEndDate together
                        return <RowHeader key="id">{d.id}</RowHeader>;
                      }
                      if (key === "visitStartDate") {
                        // Handle visitStartDate and visitEndDate together
                        return (
                          <TableData key="visitDates">
                            {d.visitStartDate && d.visitEndDate ? (
                              <>
                                {new Date(d.visitStartDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                                <div className="text-center">to</div>
                                {new Date(d.visitEndDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </>
                            ) : d.visitStartDate ? (
                              new Date(d.visitStartDate).toLocaleDateString(
                                "en-GB",
                                {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            ) : (
                              "NA"
                            )}
                          </TableData>
                        );
                      }
                      // if (key === "deadline") {
                      //   const submittedTime = new Date(d.submittedDate);
                      //   const deadlineTime = new Date(d.deadline);

                      //   return (
                      //     <td key="deadline">
                      //       {d.deadline && d.submittedDate ? (
                      //         <>
                      //           <div
                      //             className={`text-center ${
                      //               submittedTime <= deadlineTime
                      //                 ? "text-success"
                      //                 : "text-danger"
                      //             }`}
                      //           >
                      //             {deadlineColumnValue(
                      //               d.submittedDate,
                      //               d.deadline
                      //             )}
                      //           </div>
                      //         </>
                      //       ) : d.deadline ? (
                      //         <span
                      //           className={`text-wrap ${
                      //             getTimeLeft(d.deadline).includes("-")
                      //               ? "text-danger"
                      //               : ""
                      //           }`}
                      //         >
                      //           {getTimeLeft(d.deadline).replace("-", "")}
                      //         </span>
                      //       ) : (
                      //         "NA"
                      //       )}
                      //     </td>
                      //   );
                      // }
                      // For other keys
                      return (
                        <TableData key={key}>
                          {key === "name" ? (
                            <>
                              {label === "PC(IV) Submitted by Department" ? (
                                <AsyncAction
                                  className="text-start"
                                  onClick={() =>
                                    pcIVReportPdfDownload(d.pcIvmainId)
                                  }
                                  loadingContent={
                                    <div className="d-flex gap-2 align-items-center text-secondary">
                                      <div style={{ flexShrink: 0 }}>
                                        <Spinner />
                                      </div>

                                      <span className="text-start text-secondary">
                                        {d[key]}
                                      </span>
                                    </div>
                                  }
                                >
                                  <span className="color-sea-blue cursor-pointer">
                                    {d[key]}
                                  </span>
                                </AsyncAction>
                              ) : label === "No. of Visits (Single)" ? (
                                <div
                                  className="text-start color-sea-blue cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    reportPdfDownload(
                                      d.visitId,
                                      d.id,
                                      ReportTypeStatusEnum.EVALUATION,
                                    );
                                  }}
                                >
                                  {d[key]}
                                </div>
                              ) : // ) : label === "PC(IV) Submitted by Department" ? (
                              //   <div
                              //     className="text-start color-sea-blue cursor-pointer"
                              //     onClick={(e) => {
                              //       e.preventDefault();
                              //       reportPdfDownload(
                              //         d.visitId,
                              //         d.id,
                              //         ReportTypeStatusEnum.EVALUATION,
                              //       );
                              //     }}
                              //   >
                              //     {d[key]}
                              //   </div>
                              label === "No. of Visits (Umbrella)" ? (
                                <div
                                  className="text-start color-sea-blue cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    reportPdfDownload(
                                      d.visitId,
                                      d.id,
                                      ReportTypeStatusEnum.EVALUATION,
                                    );
                                  }}
                                >
                                  {d[key]}
                                </div>
                              ) : (
                                <p className="text-start">{d[key]}</p>
                              )}
                            </>
                          ) : key === "userName" ? (
                            <Badge>{d[key]}</Badge>
                          ) : (
                            d[key]
                          )}
                        </TableData>
                      );
                    })}
                  </tr>
                ))}
                {keys.includes("cost") && (
                  <>
                    <tr className="bg-color-sea-blue">
                      <RowHeader
                        className="rounded-start text-light"
                        colSpan={4}
                      >
                        Total ({indexOfFirstRow + 1} -{" "}
                        {Math.min(indexOfLastRow, modifiedData.length)}) of{" "}
                        {label}
                      </RowHeader>
                      <TableData className="text-white">
                        {formatAmountWithCommas(
                          paginatedData.reduce(
                            (sum, d) => sum + (d.cost || 0),
                            0,
                          ),
                        )}
                      </TableData>
                      {/* <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.revisedAllocation || 0),
                        0
                      )
                    )}
                  </td> */}
                      {/* <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.pnDReleases || 0),
                        0
                      )
                    )}
                  </td> */}
                      {/* <td className="rounded-end text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.utilization || 0),
                        0
                      )
                    )}
                  </td> */}
                      <td colSpan={7}></td>
                    </tr>
                    <tr className="bg-color-sea-blue">
                      <RowHeader
                        className="rounded-start text-light"
                        colSpan={4}
                      >
                        Grand Total ({dataToPaginate.length}) of {label}
                      </RowHeader>
                      <TableData className="text-white">
                        {formatAmountWithCommas(
                          dataToPaginate.reduce(
                            (sum, d) => sum + (d.cost || 0),
                            0,
                          ),
                        )}
                      </TableData>
                      {/* <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.revisedAllocation || 0),
                        0
                      )
                    )}
                  </td> */}
                      {/* <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.pnDReleases || 0),
                        0
                      )
                    )}
                  </td> */}
                      {/* <td className="rounded-end text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.utilization || 0),
                        0
                      )
                    )}
                  </td> */}
                      <td colSpan={7}></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            {/* </ScrollWrapper> */}
          </div>
          <div className="row m-0 justify-content-between align-items-center pb-2">
            <div className="col-auto">
              <div className="row align-items-center">
                <div className="col-auto pe-0 color-evaluation-theme-blue fw-6">
                  {indexOfFirstRow + 1} -{" "}
                  {Math.min(indexOfLastRow, modifiedData.length)} of{" "}
                  {modifiedData.length}
                </div>
                <div className="col-auto">
                  <span
                    className="badge rounded-pill fs13px fw-6 color-evaluation-theme-blue"
                    style={{
                      border: "1.08px solid #1C6BA6",
                      paddingBottom: "2px",
                    }}
                  >
                    <div className="row align-items-center">
                      <div
                        className="col-auto pe-0"
                        style={{ paddingBottom: "4px" }}
                      >
                        <PiCircleFill
                          size={8}
                          className="color-evaluation-theme-blue"
                        />
                      </div>
                      <div className="col ps-1 color-evaluation-theme-blue">
                        {rows}
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="row align-items-center">
                <div className="col ps-0" style={{ paddingRight: "10px" }}>
                  <Button
                    className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                      currentPage === 1
                        ? "bg-color-light-gray "
                        : "bg-color-evaluation-theme-blue"
                    }`}
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    style={{
                      width: "27px",
                      height: "27px",
                      padding: 0, // remove extra padding from btn-sm
                    }}
                  >
                    <Image
                      src="/icons/evaluation/doubleArrowLeft.svg"
                      alt="doubleArrowLeft"
                      width={13}
                      height={13}
                    />
                  </Button>
                </div>
                <div className="col ps-0" style={{ paddingRight: "10px" }}>
                  <Button
                    className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                      currentPage === 1
                        ? "bg-color-light-gray "
                        : "bg-color-evaluation-theme-blue"
                    }`}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    style={{
                      width: "27px",
                      height: "27px",
                      padding: 0, // remove extra padding from btn-sm
                    }}
                  >
                    <Image
                      src="/icons/evaluation/singleArrowLeft.svg"
                      alt="singleArrowLeft"
                      width={13}
                      height={13}
                    />
                  </Button>
                </div>
                {renderPageNumbers()}
                <div className="col ps-0" style={{ paddingRight: "10px" }}>
                  <Button
                    className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                      currentPage === totalPages
                        ? "bg-color-light-gray "
                        : "bg-color-evaluation-theme-blue"
                    }`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    style={{
                      width: "27px",
                      height: "27px",
                      padding: 0, // remove extra padding from btn-sm
                    }}
                  >
                    <Image
                      src="/icons/evaluation/singleArrowLeft.svg"
                      alt="singleArrowLeft"
                      width={13}
                      height={13}
                      style={{ rotate: "180deg" }}
                    />
                  </Button>
                </div>
                <div className="col ps-0" style={{ paddingRight: "10px" }}>
                  <Button
                    className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                      currentPage === totalPages
                        ? "bg-color-light-gray "
                        : "bg-color-evaluation-theme-blue"
                    }`}
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    style={{
                      width: "27px",
                      height: "27px",
                      padding: 0, // remove extra padding from btn-sm
                    }}
                  >
                    <Image
                      src="/icons/evaluation/doubleArrowLeft.svg"
                      alt="doubleArrowLeft"
                      width={13}
                      height={13}
                      style={{ rotate: "180deg" }}
                    />
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <CustomSelect
                menuPlacement="top"
                isClearable={false}
                options={rowCountOptions}
                isSearchable={false}
                closeMenuOnSelect={true}
                singleSelectStyles={paginationSelectStyles}
                value={selectedOptions}
                onChangeSingle={(
                  newValue: SingleValue<{ value: string; label: string }>,
                ) => {
                  if (newValue) {
                    handleRowsPerPage(Number(newValue.value));
                    setSelectedOptions([
                      {
                        label: newValue.label,
                        value: newValue.value,
                      },
                    ]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;

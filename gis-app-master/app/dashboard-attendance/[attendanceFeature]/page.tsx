"use client";
import Loader from "@/app/components/Loader/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import apiClient from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  addSpaceToCamelCase,
  exportToPDF,
  formatKeyName,
  getFormattedDate,
  getTimeLeft,
} from "@/app/utils";
import { exportDataToExcel } from "@/app/utils/exportToExcel";
import { sort } from "fast-sort";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: { attendanceFeature: string };
}
export interface AttendanceList {
  attandanceId: number;
  userId: number;
  employeeName: string;
  employeePicture: string;
  department: string;
  employeeDesignation: string;
  punchInStatus: string;
  punchInTime: string;
  punchOutStatus: string;
  punchOutTime: string;
  date: string;
  isCheckOut: boolean;
}

export interface AttendaceDetail {
  attendanceList: AttendanceList[];
}

const AttendanceDetailsPage = ({ params }: Props) => {
  const { attendanceFeature } = params;
  const currentPath = usePathname();
  const [data, setData] = useState<AttendanceList[]>();
  const [isLoading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(""); // For manual date selection

  const handleSubmit = async (startDate: string) => {
    try {
      const response = await apiClient.post(attendanceFeature, {
        startDate,
      });
      setData(response.data.attendanceList);
      console.log("attendace data ", response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    handleSubmit(new Date().toISOString());
    console.log("selectedDate:", selectedDate);
  }, []);

  // State for search input
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<AttendanceList[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered =
      data &&
      data.filter((item) =>
        [
          item.attandanceId.toString(),
          item.userId.toString(),
          item.employeeName,
          item.employeeDesignation,
        ]
          .filter((field) => field) // Remove undefined fields
          .map((field) => field.toLowerCase())
          .some((field) => field.includes(e.target.value.toLowerCase())),
      );
    if (filtered) setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AttendanceList;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof AttendanceList) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    if (data) {
      const sortedData = sort(data)[direction](key);
      setSortConfig({ key, direction });
      if (sortedData) setData([...sortedData]);
    }
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Handle date selection
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);

    try {
      const response = await apiClient.post(`/${attendanceFeature}`, {
        startDate: new Date(date).toISOString(),
      });
      setFilteredData(response.data.attendanceList); // Sync filteredData
    } catch (err) {
      console.error("Error fetching attendance by date:", err);
    }
  };

  const paginatedData =
    data &&
    (searchTerm ? filteredData : data).slice(
      (currentPage - 1) * rows,
      currentPage * rows,
    );

  const keys = Object.keys(data && data?.length > 0 ? data[0] : "");
  const keysForPDF = keys.filter(
    (key) => key !== "employeePicture" && key !== "employeeDesignation",
  );
  const columns = keysForPDF.map((key) => ({
    header: formatKeyName(key), // Format key for header
    dataKey: key, // Use the key for data mapping
  }));

  const tableRows = (searchTerm ? filteredData : data)?.map(
    (data: any, index) => {
      const row: Record<string, any> = { srNo: index + 1 }; // Initialize row with srNo

      keysForPDF.forEach((key) => {
        switch (key) {
          case "srNo":
            row[key] = index + 1;
            break;
          case "id":
            row[key] = data.id;
            break;
          case "projectName":
            row[key] = data.projectName;
            break;
          case "districtName":
            row[key] = data.districtName;
            break;
          case "sectorName":
            row[key] = data.sectorName;
            break;
          case "employeeName":
            row[key] = `${data.employeeName} (${data.employeeDesignation})`;
            break;
          case "date":
            row[key] = `${
              data.date
                ? new Date(data.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : ""
            }`;
            break;
          case "reportCompletion":
            row[key] = `${Math.round(data.reportCompletion)}%`;
            break;
          default:
            row[key] = data[key]; // Handle any additional keys dynamically
        }
      });

      return row;
    },
  );

  const heading = addSpaceToCamelCase(attendanceFeature).includes("Present")
    ? addSpaceToCamelCase(attendanceFeature).split(" ")[1]
    : addSpaceToCamelCase(attendanceFeature).includes("Daily Late Comer")
      ? "Late Arrival"
      : addSpaceToCamelCase(attendanceFeature).includes("Daily Early Time")
        ? "Left Early"
        : addSpaceToCamelCase(attendanceFeature).includes("Daily Leave")
          ? addSpaceToCamelCase(attendanceFeature).split(" ")[1]
          : addSpaceToCamelCase(attendanceFeature).includes("Daily Visit")
            ? addSpaceToCamelCase(attendanceFeature).split(" ")[1]
            : addSpaceToCamelCase(attendanceFeature).includes("Daily Absent")
              ? addSpaceToCamelCase(attendanceFeature).split(" ")[1]
              : addSpaceToCamelCase(attendanceFeature).includes("Daily Others")
                ? addSpaceToCamelCase(attendanceFeature).split(" ")[1]
                : addSpaceToCamelCase(attendanceFeature);

  const label = `${heading} Attendance List`;

  const renameMap: Record<string, string> = {
    srNo: "Sr No",
    id: "GS No.",
    fileGenrated: "REPORT GENERATED",
    visitStartDate: "DATE RANGE",
    visitCount: "No. OF VISITS",
    // Add other mappings as needed
  };

  // Export to Excel function
  const exportToExcel = () => {
    const headers = ["srNo", ...keys].map(formatKeyName); // Rename headers dynamically

    const excelData = (searchTerm ? filteredData : data)?.map(
      (item: any, index) => {
        const row: Record<string, any> = {};

        headers.forEach((header) => {
          const key =
            Object.keys(renameMap).find((k) => formatKeyName(k) === header) ||
            header; // Find original key from renamed header

          switch (key) {
            case "srNo":
              row[header] = index + 1;
              break;
            case "id":
              row[header] = item.id;
              break;
            case formatKeyName("projectName"):
              row[header] = item.projectName;
              break;
            case formatKeyName("districtName"):
              row[header] = item.districtName;
              break;
            case formatKeyName("sectorName"):
              row[header] = item.sectorName;
              break;
            case formatKeyName("userName"):
              row[header] = `${item.userName} (${item.designation})`;
              break;
            case formatKeyName("reportCompletion"):
              row[header] = `${Math.round(item.reportCompletion)}%`;
              break;
            case "visitStartDate":
              row[header] =
                item.visitStartDate &&
                `${new Date(item.visitStartDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })} To ${
                  item.visitEndDate &&
                  new Date(item.visitEndDate).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                }`;
              break;
            case formatKeyName("completedDate"):
              row[header] =
                item.completedDate &&
                `${new Date(item.completedDate).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}`;
              break;
            case formatKeyName("deadline"):
              row[header] =
                item.reportStatus && item.reportStatus.toLowerCase() === "yes"
                  ? "Submitted"
                  : `${getTimeLeft(item.deadline).replace("-", "")}`;
              break;
            case "visitCount":
              row[header] = item.visitCount;
              break;
            case "fileGenrated":
              row[header] = item.fileGenrated;
              break;
            case formatKeyName("cost"):
              row[header] = item.cost;
              break;
            case formatKeyName("revisedAllocation"):
              row[header] = item.revisedAllocation;
              break;
            case formatKeyName("pnDReleases"):
              row[header] = item.pnDReleases;
              break;
            case formatKeyName("utilization"):
              row[header] = item.utilization;
              break;

            default:
              row[header] = item[formatKeyName(key)] || ""; // Handle any additional keys dynamically
          }
        });

        return row;
      },
    );

    exportDataToExcel(
      excelData!,
      headers,
      `${label} ${new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}.xlsx`,
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      {data && (
        <div
          className="container p-3 mt-3 mb-4"
          style={{
            background: "rgba(209, 209, 209, 0.4)",
            border: "1px solid #dbdbdb",
            borderRadius: "15px",
          }}
        >
          <div>
            <TableHeader
              heading={heading}
              searchTerm={searchTerm}
              filteredData={filteredData}
              data={data}
              handleChange={handleChange}
              form={
                <div className="col-auto" style={{ zIndex: 3 }}>
                  <DownloadDropDown
                    onClickPdf={() =>
                      tableRows &&
                      exportToPDF(columns, tableRows, new Date(), label)
                    }
                  />
                </div>
              }
            />
            <section className="mx-5 pt-2 pb-2">
              <div className="row d-flex justify-content-between">
                <div className="col-lg-3 col-md-9 col-sm-12 mt-2 table-responsive overflow-hidden">
                  <label htmlFor="date" className="form-label">
                    Select Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    style={{
                      background: "rgba(16, 143, 168, .1)",
                      outline: "none",
                      border: "1px solid #D0D5DD",
                    }}
                    onChange={(e) => {
                      handleSubmit(new Date(e.target.value).toISOString());
                    }}
                    className="form-control py-2 input_shadow"
                    aria-label="Select Date"
                  />
                </div>
              </div>
            </section>

            <section className="mx-5 mt-2">
              <div className="table-responsive">
                <table className="table">
                  <thead className="border-gradient">
                    <tr className="color-dark-blue cursor-pointer">
                      <TableHeading
                        name="sr"
                        handleSort={() => handleSort("userId")}
                      />
                      <TableHeading
                        name="name"
                        handleSort={() => handleSort("employeeName")}
                      />
                      <TableHeading
                        name="in time"
                        handleSort={() => handleSort("punchInTime")}
                      />
                      <TableHeading
                        name="punch in"
                        handleSort={() => handleSort("punchInStatus")}
                      />
                      <TableHeading
                        name="out time"
                        handleSort={() => handleSort("punchOutTime")}
                      />
                      <TableHeading
                        name="punch out"
                        handleSort={() => handleSort("punchOutStatus")}
                      />
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? (
                      paginatedData?.map((attendance, index) => (
                        <tr key={index}>
                          <td>{attendance.userId}</td>
                          <td>
                            <p
                              className="fs-6 p-0 m-0 fw-normal"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <Link
                                target="_blank"
                                className="color-sea-blue"
                                href={`${currentPath}/${attendance.userId}`}
                              >
                                {attendance.employeeName}
                              </Link>
                            </p>
                            <p className="p-0 m-0">
                              {attendance.employeeDesignation}
                            </p>
                          </td>
                          <td>{attendance.punchInTime}</td>
                          <td>{attendance.punchInStatus}</td>
                          <td>{attendance.punchOutTime}</td>
                          <td>{attendance.punchOutStatus}</td>
                          <td>
                            <div className="dropdown">
                              <span
                                className="dots"
                                role="button"
                                id={`dropdownMenuButton${index}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {/* Three vertical dots */}
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                              </span>
                              <ul
                                className="dropdown-menu"
                                aria-labelledby={`dropdownMenuButton${index}`}
                              >
                                <li>
                                  <a className="dropdown-item" href="#">
                                    Add Leave
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#">
                                    Add Visit
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="#">
                                    Others
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No attendance data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <Pagination
                  searchTerm={searchTerm}
                  filteredData={filteredData}
                  data={data}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceDetailsPage;

"use client";
import { STAFF_ATTENDANCE_API } from "@/services/endpoints";
import Loader from "@/components/Loader/Loader";
import apiClient from "@/services/client";
import {
  addSpaceToCamelCase,
  exportToPDF,
  formatKeyName,
} from "@/utils";
import { useEffect, useState } from "react";
import { AttendanceList, StaffRecord } from "../../types";
import Pagination from "@/components/Table/Pagination";
import DownloadDropDown from "@/components/DownloadDropDown/DownloadDropDown";
import { useEffectEvent } from "@/hooks/useEffectEvent";

interface Props {
  params: { employeeId: string };
}
const EmployeeProfilePage = ({ params }: Props) => {
  const { employeeId } = params;
  const [data, setData] = useState<StaffRecord>();
  const [selectedFromDate, setSelectedFromDate] = useState<Date>();
  const [selectedToDate, setSelectedToDate] = useState<Date>();
  const [isLoading, setLoading] = useState(true);

  const handleSubmit = async (
    userId: number,
    fromDate: string | null,
    toDate: string | null,
  ) => {
    try {
      const response = await apiClient.post(
        `${STAFF_ATTENDANCE_API}/GetStaffRecord`,
        {
          userId,
          fromDate,
          toDate,
        },
      );
      setData(response.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Submission error:", err);
    }
  };

  const onMount = useEffectEvent(() => {
    handleSubmit(parseInt(employeeId), null, null);
  });
  useEffect(() => onMount(), [onMount]);

  // State for search input
  const [searchTerm] = useState("");

  // State for filtered data
  const [filteredData] = useState<AttendanceList[]>([]);

  // Handle search logic

  // Update searchTerm and clear search if empty

  // for sorting


  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (
    searchTerm ? filteredData : data?.dailyAttandance
  )?.slice((currentPage - 1) * rows, currentPage * rows);

  // download with pdf or excel
  const keys = Object.keys(
    data && data?.dailyAttandance.length > 0 ? data.dailyAttandance[0] : "",
  );
  const keysForPDF = keys.filter(
    (key) => key !== "employeePicture" && key !== "employeeDesignation",
  );
  const columns = keysForPDF.map((key) => ({
    header: formatKeyName(key), // Format key for header
    dataKey: key, // Use the key for data mapping
  }));

  const tableRows = (searchTerm ? filteredData : data?.dailyAttandance)?.map(
    (data, index: number) => {
      const row: Record<string, unknown> = { srNo: index + 1 }; // Initialize row with srNo

      keysForPDF.forEach((key) => {
        switch (key) {
          case "srNo":
            row[key] = index + 1;
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
          default:
            row[key] = data[key as keyof AttendanceList]; // Handle any additional keys dynamically
        }
      });

      return row;
    },
  );

  addSpaceToCamelCase(employeeId).includes("Present")
    ? addSpaceToCamelCase(employeeId).split(" ")[1]
    : addSpaceToCamelCase(employeeId).includes("Daily Late Comer")
      ? "Late Arrival"
      : addSpaceToCamelCase(employeeId).includes("Daily Early Time")
        ? "Left Early"
        : addSpaceToCamelCase(employeeId).includes("Daily Leave")
          ? addSpaceToCamelCase(employeeId).split(" ")[1]
          : addSpaceToCamelCase(employeeId).includes("Daily Visit")
            ? addSpaceToCamelCase(employeeId).split(" ")[1]
            : addSpaceToCamelCase(employeeId).includes("Daily Absent")
              ? addSpaceToCamelCase(employeeId).split(" ")[1]
              : addSpaceToCamelCase(employeeId).includes("Daily Others")
                ? addSpaceToCamelCase(employeeId).split(" ")[1]
                : addSpaceToCamelCase(employeeId);

  const label = `${data?.userName} Attendance List ${
    selectedFromDate
      ? `From ${new Date(selectedFromDate).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`
      : ""
  } ${
    selectedToDate
      ? `To ${new Date(selectedToDate).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`
      : ""
  }, Today`;


  // Export to Excel function

  return (
    <>
      {isLoading && <Loader />}
      <div
        className="container p-3 mt-3 mb-4"
        style={{
          background: "rgba(209, 209, 209, 0.4)",
          border: "1px solid #dbdbdb",
          borderRadius: "15px",
        }}
      >
        <div>
          <section className="px-5 pt-2 pb-2 ">
            <h4 className="fw-bold">Profile</h4>
            <p className="text-secondary fs-6">Dashboard / Profile</p>
          </section>

          <section className="px-5 pt-2 pb-3 ">
            <div className="row">
              {/* Box 1: Present */}
              <div className="col-lg-2 col-md-3 col-sm-4 mb-4">
                <div
                  className="px-3 pt-3 pb-1 shadow h-100"
                  style={{
                    borderRadius: "10px",
                    background:
                      "linear-gradient(134.78deg, #5746DD 7.61%, #E73A80 94.46%)",
                  }}
                >
                  <div className="row text-center text-white">
                    <p className="fs-5 p-0 m-0 fw-bold">Presents</p>
                    <p className="fw-bold" style={{ fontSize: "1.37rem" }}>
                      {data?.totalPresents}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2: Late Arrival */}
              <div className="col-lg-2 col-md-3 col-sm-4 mb-4">
                <div
                  className="rounded-5 px-3 pt-3 pb-1 shadow h-100"
                  style={{
                    borderRadius: "10px",
                    background:
                      "linear-gradient(134.78deg, #F2994A 7.61%, #F2C94C 94.46%)",
                  }}
                >
                  <div className="row text-center text-white">
                    <p className="fs-5 p-0 m-0 fw-bold">Late Arrivals</p>
                    <p className="fw-bold" style={{ fontSize: "1.37rem" }}>
                      {data?.totalLateComers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 3: Left Early */}
              <div className="col-lg-2 col-md-3 col-sm-4 mb-4">
                <div
                  className="rounded-5 px-3 pt-3 pb-1 shadow h-100"
                  style={{
                    borderRadius: "10px",
                    background:
                      "linear-gradient(134.78deg, #56CCF2 7.61%, #2F80ED 94.46%)",
                  }}
                >
                  <div className="row text-center text-white">
                    <p className="fs-5 p-0 m-0 fw-bold">Left Early</p>
                    <p className="fw-bold" style={{ fontSize: "1.37rem" }}>
                      {data?.totalLeftEarly}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 4: Visit */}
              <div className="col-lg-2 col-md-3 col-sm-4 mb-4">
                <div
                  className="rounded-5 px-3 pt-3 pb-1 shadow h-100"
                  style={{
                    borderRadius: "10px",
                    background:
                      "linear-gradient(134.78deg, #6A82FB 7.61%, #FC5C7D 94.46%)",
                  }}
                >
                  <div className="row text-center text-white">
                    <p className="fs-5 p-0 m-0 fw-bold">Visits</p>
                    <p className="fw-bold" style={{ fontSize: "1.37rem" }}>
                      {data?.totalVisit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 5: Leave */}
              <div className="col-lg-2 col-md-3 col-sm-4 mb-4">
                <div
                  className="rounded-5 px-3 pt-3 pb-1 shadow h-100"
                  style={{
                    borderRadius: "10px",
                    background:
                      "linear-gradient(134.78deg, #BB67FF 7.61%, #FB98A9 94.46%)",
                  }}
                >
                  <div className="row text-center text-white">
                    <p className="fs-5 p-0 m-0 fw-bold">Leaves</p>
                    <p className="fw-bold" style={{ fontSize: "1.37rem" }}>
                      {data?.totalLeave}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 6: Absent */}
              <div className="col-lg-2 col-md-3 col-sm-4 mb-4">
                <div
                  className="rounded-5 px-3 pt-3 pb-1 shadow h-100"
                  style={{
                    borderRadius: "10px",
                    background:
                      "linear-gradient(134.78deg, #8B0000 7.61%, #AC0C0C 94.46%)",
                  }}
                >
                  <div className="row text-center text-white">
                    <p className="fs-5 p-0 m-0 fw-bold">Absents</p>
                    <p className="fw-bold" style={{ fontSize: "1.37rem" }}>
                      {data?.totalAbsents}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-3">
            <div className="p-1 h-100">
              <div className="row py-3">
                <div className="col-12 col-sm-12 col-md-6">
                  <h2 className="m-0 h4 h-md2">{data?.userName}</h2>
                  <p className="m-0 p-0 text-secondary">{data?.department}</p>
                  <p className="fw-bold p-0 m-0 mt-3">
                    Employee ID: {employeeId}
                  </p>
                </div>

                {/* Dotted border and form section */}
                <div
                  className="col-12 col-sm-12 col-md-6 position-relative"
                  style={{
                    borderLeft: "none",
                  }} /* Remove border from small devices */
                >
                  <div className="mt-3 mt-md-0 ">
                    <h3 className="h5 h-md-3" style={{ fontSize: "24px" }}>
                      Today Attendance
                      <span
                        className="badge bg-danger ms-3"
                        style={{ fontSize: "14px" }}
                      >
                      </span>
                    </h3>
                    <div className="col">
                      <div className="row d-flex m-0">
                        <div className="col fw-bold">Check In</div>
                        <div className="col">{data?.todayCheckInStatus}</div>
                      </div>
                      <div className="row d-flex m-0">
                        <div className="col fw-bold">Check Out</div>
                        <div className="col">{data?.todayCheckOutStatus}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Custom styles for responsive dotted border */}

          <section className="mx-5 pt-2 pb-2">
            <div className="row d-flex justify-content-between">
              <div className="col">
                <div className="d-flex flex-wrap">
                  <div className="col-lg-3 col-md-5 col-sm-12 mb-3 me-2 text-start">
                    <label htmlFor="name" className="form-label">
                      From Date
                    </label>
                    <input
                      style={{
                        background: "rgba(16, 143, 168, .1)",
                        outline: "none",
                        border: "1px solid #D0D5DD",
                      }}
                      type="date"
                      className="form-control input_shadow"
                      placeholder="Select From Date"
                      onChange={(e) => {
                        setSelectedFromDate(new Date(e.target.value));
                        handleSubmit(
                          parseInt(employeeId),
                          new Date(e.target.value).toISOString(),
                          selectedToDate
                            ? selectedToDate.toISOString()
                            : new Date().toISOString(),
                        );
                      }}
                    />
                  </div>
                  <div className="col-lg-3 col-md-5 col-sm-12 mb-3 text-start">
                    <label htmlFor="name" className="form-label">
                      To Date
                    </label>
                    <input
                      style={{
                        background: "rgba(16, 143, 168, .1)",
                        outline: "none",
                        border: "1px solid #D0D5DD",
                      }}
                      type="date"
                      className="form-control input_shadow"
                      onChange={(e) => {
                        setSelectedToDate(new Date(e.target.value));
                        handleSubmit(
                          parseInt(employeeId),
                          selectedFromDate
                            ? selectedFromDate.toISOString()
                            : new Date().toISOString(),
                          new Date(e.target.value).toISOString(),
                        );
                      }}
                      placeholder="Select To Date"
                    />
                  </div>
                </div>
              </div>
              <div
                className="col-auto mb-3 d-flex align-items-end                                                  "
                style={{ zIndex: 3 }}
              >
                <DownloadDropDown
                  onClickPdf={() =>
                    tableRows &&
                    exportToPDF(columns, tableRows, new Date(), label)
                  }
                />
              </div>
            </div>
          </section>
          <section className="mx-5 mt-2">
            <div className="table-responsive">
              <table className="table">
                <thead className="border-gradient">
                  <tr className="color-dark-blue cursor-pointer">
                    <th
                      className="fw-bold py-2"
                      style={{ fontSize: "16px" }}
                      scope="col"
                    >
                      Sr
                    </th>
                    <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                      Name
                    </th>

                    <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                      Date
                    </th>
                    <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                      In{" "}
                    </th>
                    <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                      In Status
                    </th>
                    <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                      Out
                    </th>
                    <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                      Out Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((d, i) => (
                    <tr key={i}>
                      <td>{d.userId}</td>
                      <td>
                        <p className="fs-6 p-0 m-0">{d.employeeName}</p>
                        <p className="p-0 m-0">{d.employeeDesignation}</p>
                      </td>
                      <td>
                        {new Date(d.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>{d.punchInTime}</td>
                      <td>{d.punchInStatus}</td>
                      <td>{d.punchOutTime}</td>
                      <td>{d.punchOutStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                searchTerm={searchTerm}
                filteredData={filteredData}
                data={data?.dailyAttandance || []}
                rows={rows}
                setRows={setRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfilePage;

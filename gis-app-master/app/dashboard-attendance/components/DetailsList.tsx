"use client";
import { FaDownload, FaSearch } from "react-icons/fa";
import { AttendanceList } from "../[attendanceFeature]/page";
import TableHeader from "@/app/components/Table/TableHeader";
import { useEffect, useState } from "react";
import { sort } from "fast-sort";
import apiClient from "@/app/services/api-client";
import Button from "@/app/components/Button";
import Pagination from "@/app/components/Table/Pagination";
import TableHeading from "@/app/components/Table/TableHeading";

interface Props {
  attendanceDetails: AttendanceList[];
  slug: string;
}

const DetailsList = ({ attendanceDetails, slug }: Props) => {
  const [data, setData] = useState<AttendanceList[]>([]);
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<AttendanceList[]>([]);

  useEffect(() => {
    setData(attendanceDetails);
    setFilteredData(attendanceDetails);
  }, [attendanceDetails]);

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

  const [selectedDate, setSelectedDate] = useState(""); // For manual date selection

  // Handle date selection
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);

    try {
      const response = await apiClient.post(`/${slug}`, {
        startDate: new Date(date).toISOString(),
      });
      setFilteredData(response.data.attendanceList); // Sync filteredData
    } catch (err) {
      console.error("Error fetching attendance by date:", err);
    }
  };

  const paginatedData = (
    searchTerm || selectedDate.length > 0 ? filteredData : data
  ).slice((currentPage - 1) * rows, currentPage * rows);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#CFE6F8",
        padding: "10px",
      }}
    >
      <div
        className="container-fluid p-2 mb-4"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <div className="bg-light py-5">
          <TableHeader
            heading={slug[0]}
            searchTerm={searchTerm}
            filteredData={filteredData}
            data={data}
            handleChange={handleChange}
            form={
              //   <div className="col-auto">
              //     <SectorForm
              //       api={SECTOR_API}
              //       method="POST"
              //       setRefresh={setRefresh}
              //       refresh={refresh}
              //       setData={setData}
              //     />
              //   </div>
              <></>
            }
          />
          <section className="mx-5 pt-2 pb-2">
            <div className="row d-flex justify-content-between">
              <div className="col-lg-4 col-md-9 col-sm-12 d-flex mt-2 table-responsive overflow-hidden">
                <div>
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient( #5746DD , #26AE92)",
                    }}
                  >
                    <FaDownload className="text-white" />
                  </div>
                </div>
                &nbsp;
                {/* <div>
                    <Image
                      style={{ cursor: "pointer" }}
                      //   onClick={() =>
                      //     exportToPDF(attendanceData, selectedDate, pageName)
                      //   }
                      className="me-2 img1"
                      src={exportIcon}
                      alt="Export Icon"
                      width={40}
                      height={40}
                    />
                  </div> */}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="form-control py-2 input_shadow"
                  aria-label="Select Date"
                />
                &nbsp;
                {/* <div>
                  <Button
                    className="rounded-circle d-flex justify-content-center align-items-center border-0"
                    // onClick={() => handleSubmit(new Date(selectedDate))}
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient( #5746DD , #26AE92)",
                    }}
                  >
                    <FaSearch className="text-white" />
                  </Button>
                </div> */}
                {/* <div>
                    <Image
                      style={{ cursor: "pointer" }}
                      onClick={handleDateSubmit}
                      className="ms-1 img1"
                      src={searchIcon}
                      alt="Search Icon"
                      width={40}
                      height={40}
                    />
                  </div> */}
              </div>
            </div>
          </section>

          <section className="mx-5 mt-2 bg-white">
            <div className="table-responsive">
              <table className="table table-hover table-striped table-hover border-top m-0 p-0 shadow-sm">
                <thead className="border-gradient">
                  <tr>
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
                  {attendanceDetails ? (
                    paginatedData?.map((attendance, index) => (
                      <tr key={index}>
                        <td>{attendance.userId}</td>
                        <td>
                          <p
                            className="fs-6 p-0 m-0 fw-bold"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {attendance.employeeName}
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
    </div>
  );
};

export default DetailsList;

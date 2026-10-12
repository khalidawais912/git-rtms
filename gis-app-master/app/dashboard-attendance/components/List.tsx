"use client";
import { useEffect, useState } from "react";
// import "../Attendance.css";
import axios from "axios";
import Cookies from "js-cookie";
// import { exportToPDF } from "../../utils";
import { useRouter } from "next/navigation";
import { FaDownload, FaSearch } from "react-icons/fa";

const PresentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<any>();
  const [error, setError] = useState(null);

  const [pageName, setPageName] = useState("Present");
  const [filteredData, setFilteredData] = useState([]); // For filtered data based on search
  const [selectedDate, setSelectedDate] = useState(""); // For manual date selection
  const [searchTerm, setSearchTerm] = useState(""); // For search input field
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [recordsPerPage] = useState(40); // Number of records to show per page

  const router = useRouter();

  // Function to get today's date in the required format
  const getFormattedDate = (date: any) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1); // Months are 0-indexed, so add 1
    let day = "" + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-"); // Returns 'yyyy-mm-dd' format
  };

  // Function to call the DailyAttendance API
  const fetchAttendance = async (date: any) => {
    const token = Cookies.get("token"); // Get token from cookies for authentication

    if (!token) {
      alert("Please log in to access the page");
      // router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        "http://110.39.184.210:5441/api/Admin/DailyPresent", // Replace with actual API URL
        {
          startDate: getFormattedDate(date), // Send selected date or today's date in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the header for authorization
          },
        },
      );
      setAttendanceData(response.data.attendanceList || []);
      setFilteredData(response.data.attendanceList || []);

      // Convert the date to 'yyyy-mm-dd' format to display in input field
      if (response.data.date) {
        setSelectedDate(getFormattedDate(response.data.date));
      }
    } catch (err) {
      // setError(err.message);
      alert("Failed to fetch attendance");
    }
  };

  // Automatically fetch today's attendance when component mounts
  useEffect(() => {
    fetchAttendance(new Date()); // Call API with today's date on initial load
  }, []);

  // Handle manual date selection and API call
  const handleDateSubmit = () => {
    if (selectedDate) {
      fetchAttendance(selectedDate); // Call API with the selected date
    } else {
      alert("Please select a date");
    }
  };

  // Log the updated attendanceData after it changes
  useEffect(() => {
    // console.log("Updated attendanceData: ", attendanceData.attendanceList);  // Correct way to log the state after it updates
  }, [attendanceData]); // Only runs when attendanceData changes

  // Real-time search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter attendance data based on search term
    const filtered =
      attendanceData &&
      attendanceData.filter((data: any) =>
        data.employeeName.toLowerCase().includes(searchValue),
      );
    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredData(attendanceData); // Reset to original data
  };

  // Calculate current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages for pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <>
      <div className="bg-light py-5">
        <section className="mx-5 pt-2 pb-5 ">
          <h1>{pageName}</h1>
          <p className="text-secondary fs-5">
            Dashboard / Attendance / Present
          </p>
        </section>
        <section className="mx-5 pt-2 pb-2">
          <div className="row d-flex justify-content-between">
            <div className="col-lg-3 col-md-9 col-sm-12 mt-2 position-relative">
              <input
                type="text"
                className="form-control py-2 input_shadow"
                placeholder="Employee Name"
                aria-label="Search Employee Name"
                value={searchTerm}
                onChange={handleSearch} // Real-time search
              />
              {searchTerm && (
                <span
                  className="position-absolute clear-icon"
                  style={{
                    right: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={clearSearch} // Clear search term
                >
                  <i className="fas fa-times"></i>{" "}
                  {/* Font Awesome cross icon */}
                </span>
              )}
            </div>
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
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
                className="form-control py-2 input_shadow"
                aria-label="Select Date"
              />
              &nbsp;
              <div>
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient( #5746DD , #26AE92)",
                  }}
                >
                  <FaSearch className="text-white" />
                </div>
              </div>
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
                    In Time
                  </th>
                  <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                    Punch In
                  </th>
                  <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                    Out Time
                  </th>
                  <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                    Punch out
                  </th>
                  <th className="fw-bold py-2" style={{ fontSize: "16px" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords && currentRecords.length > 0 ? (
                  currentRecords.map((dailyAttn, index) => (
                    <tr key={index}>
                      <td>dailyAttn.userId</td>
                      <td>
                        <p
                          className="fs-6 p-0 m-0 fw-bold"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          dailyAttn.employeeName
                        </p>
                        <p className="p-0 m-0">dailyAttn.employeeDesignation</p>
                      </td>
                      <td>dailyAttn.punchInTime</td>
                      <td>dailyAttn.punchInStatus</td>
                      <td>dailyAttn.punchOutTime</td>
                      <td>dailyAttn.punchOutStatus</td>
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
          </div>
          {/* Pagination Controls */}
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button className="page-link" onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </>
  );
};

export default PresentAttendance;

"use client";
import { VISIT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import DeleteModal from "@/app/components/DeleteModal";
import DisplayStatusText from "@/app/components/DisplayStatusText";
import Loader from "@/app/components/Loader/Loader";
import TableHeading from "@/app/components/Table/TableHeading";
import useAuthentication from "@/app/hooks/useAuthentication";
import useDriver from "@/app/hooks/useDriver";
import useProjects from "@/app/hooks/useProjects";
import useVehicle from "@/app/hooks/useVehicle";
import useVisits, { Visit } from "@/app/hooks/useVisits";
import {
  APPROVED,
  CANCELLED,
  COMPLETED,
  SCHEDULED,
  SUBMITTED,
} from "@/app/report-history/statuses";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate, getName } from "@/app/utils";
import { sort } from "fast-sort";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import calender from "../../../public/icons/calendar.svg";
import cancel from "../../../public/icons/cancel.svg";
import clock from "../../../public/icons/clock.svg";
import complete from "../../../public/icons/complete.svg";
import Form from "./Form";

const inter = Inter({ subsets: ["latin"] });

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  attributeId: number;
  label: string;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, error, isLoading } = useVisits({
    refresh,
  });
  const { data: projects } = useProjects({ refresh });
  const { data: users } = useAuthentication({ refresh });
  const { data: vehicles } = useVehicle({ refresh });
  const { data: drivers } = useDriver({ refresh });
  const [status, setStatus] = useState("pending");
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Visit[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = data.filter((item) =>
      [
        item.id.toString(),
        item.projectId.toString(),
        item.assignedTo.toString(),
        item.vehicleID.toString(),
        item.driverID.toString(),
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase())),
    );
    setFilteredData(filtered);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm !== "") {
      // handleSearch();
    }
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Visit;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Visit) => {
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

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${VISIT_API}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.id !== id));
      notifyCreate(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const handleRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows(parseInt(e?.target.value, 10));
    setCurrentPage(1);
  };

  // Determine the data to display for the current page
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // for pagination buttons
  const totalPages = Math.ceil(data.length / rows);
  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Paginate data to display only the current page's rows
  const paginatedData = data.slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Maximum visible page numbers
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key="ellipsis-start"
          className="btn bg-color-sea-green shadow me-2"
          disabled
          style={{ border: "1px solid #445E84" }}
        >
          ...
        </Button>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          className={`btn ${
            i === currentPage
              ? "bg-color-matte-light-blue text-dark"
              : "bg-color-sea-green shadow text-white"
          } me-2`}
          onClick={() => handlePageChange(i)}
          style={{
            border: "1px solid #445E84",
          }}
        >
          {i}
        </Button>,
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <Button
          key="ellipsis-end"
          className="btn bg-color-sea-green shadow me-2 text-white"
          disabled
          style={{ border: "1px solid #445E84" }}
        >
          ...
        </Button>,
      );
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterData = (data: Visit[], status: string) => {
    setFilteredData(data?.filter((d: any) => d.status === status));
  };

  useEffect(() => {
    handleFilterData(data, status);
  }, [data]);

  return (
    <>
      {isLoading && <Loader />}

      <div className="row d-flex m-0 justify-content-center">
        <div className="col">
          <CustomModal
            size="xl"
            modalId="tourPlans"
            button={
              <Button className="btn">
                <img
                  className="img-fluid rounded-3"
                  style={{ objectFit: "cover", height: "100%" }}
                  src="/images/tourPlans.png"
                  alt="tourPlans"
                />
              </Button>
            }
            body={
              <div
                className="container-fluid border border-white p-3"
                style={{
                  borderRadius: "20px",
                  background: "#CFE6F8",
                  height: "700px",
                  overflow: "scroll",
                }}
              >
                <>
                  <div className="row d-flex p-3">
                    <div className="col-lg-6 col-md-6 col">
                      <h4 className="fw-bold">Visits Scheduled</h4>
                    </div>
                    <div className="col-lg-6 col-md-6 col">
                      <div className="row d-flex ">
                        <div className="col d-none d-lg-block"></div>
                        <div className="col text-end">
                          <span className="fw-bold">
                            {new Date().toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>{" "}
                          Today
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                      <Button
                        className="btn btn-warning w-100 text-white fw-bold"
                        style={{ letterSpacing: 1 }}
                        onClick={() => handleFilterData(data, "pending")}
                      >
                        Pending
                      </Button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                      <Button
                        style={{ letterSpacing: 1 }}
                        className="btn btn-info w-100 text-white fw-bold"
                        onClick={() => handleFilterData(data, "scheduled")}
                      >
                        Scheduled
                      </Button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                      <Button
                        style={{ letterSpacing: 1 }}
                        className="btn btn-success w-100 text-white fw-bold"
                        onClick={() => handleFilterData(data, "completed")}
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                  <div className="row d-flex justify-content-between p-3">
                    <div className="col-lg-6 col-md-5 col-sm-12">
                      <p>
                        Showing:{" "}
                        <span className="fw-bold">
                          {searchTerm || status
                            ? filteredData.length
                            : data?.length}{" "}
                          Visits
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <form>
                        <div className="input-group">
                          <span
                            className="input-group-text bg-color-sea-green border-0 rounded-end rounded-pill"
                            id="basic-addon1"
                          >
                            <IoSearch style={{ color: "#fff" }} />
                          </span>
                          <input
                            type="text"
                            className="form-control border-0 rounded-start"
                            style={{ background: "rgba(16, 143, 168, .1)" }}
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleChange}
                          />
                          <button
                            className="btn rounded-start rounded-pill bg-color-sea-green text-white"
                            type="submit"
                          >
                            Search
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table
                      className="table table-hover mb-5"
                      style={{
                        border: ".41px solid rgba(81,81,81,0.20) !important",
                      }}
                    >
                      <thead>
                        <tr
                          className={`color-dark-blue cursor-pointer ${inter.className}`}
                          style={{
                            border:
                              ".41px solid rgba(81,81,81,0.20) !important",
                            fontSize: ".85rem",
                          }}
                        >
                          <TableHeading
                            name="id"
                            handleSort={() => handleSort("id")}
                          />
                          <TableHeading
                            name="project Id"
                            handleSort={() => handleSort("projectId")}
                          />
                          <TableHeading
                            name="assigned To"
                            handleSort={() => handleSort("assignedTo")}
                          />
                          <TableHeading
                            name="status"
                            handleSort={() => handleSort("status")}
                          />
                          <TableHeading
                            name="latitude"
                            handleSort={() => handleSort("latitude")}
                          />
                          <TableHeading
                            name="longitude"
                            handleSort={() => handleSort("longitude")}
                          />
                          <TableHeading
                            name="vehicle"
                            handleSort={() => handleSort("vehicleID")}
                          />
                          <TableHeading
                            name="driver ID"
                            handleSort={() => handleSort("driverID")}
                          />
                          <TableHeading
                            name="from Date"
                            handleSort={() => handleSort("fromDate")}
                          />
                          <TableHeading
                            name="to Date"
                            handleSort={() => handleSort("toDate")}
                          />
                          <TableHeading
                            name="created at"
                            handleSort={() => handleSort("createdAt")}
                          />
                          <TableHeading
                            name="updated at"
                            handleSort={() => handleSort("updatedAt")}
                          />
                          <TableHeading
                            name="complete at"
                            handleSort={() => handleSort("complete_at")}
                          />
                          <TableHeading
                            name="submitted at"
                            handleSort={() => handleSort("submitted_at")}
                          />
                          <TableHeading
                            name="issued at"
                            handleSort={() => handleSort("issued_at")}
                          />
                          <th colSpan={2}>
                            <div className="text-center"></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(searchTerm || status
                          ? filteredData
                          : paginatedData
                        ).map((d) => (
                          <tr
                            style={{
                              border:
                                ".41px solid rgba(81,81,81,0.20) !important",
                              fontSize: ".85rem",
                            }}
                            key={d.id}
                          >
                            <td>{d.id}</td>
                            <td>{getName(d.projectId, projects)}</td>
                            <td>{getName(d.assignedTo, users)}</td>
                            <td style={{ whiteSpace: "nowrap" }}>
                              {d.status === SCHEDULED ? (
                                <Image
                                  src={calender}
                                  style={{ marginBottom: "3px" }}
                                  alt="calender"
                                />
                              ) : d.status === SUBMITTED ? (
                                <Image
                                  src={clock}
                                  style={{ marginBottom: "3px" }}
                                  alt="clock"
                                />
                              ) : d.status === CANCELLED ? (
                                <Image
                                  src={cancel}
                                  style={{ marginBottom: "3px" }}
                                  alt="cancel"
                                />
                              ) : d.status === COMPLETED ? (
                                <Image
                                  src={complete}
                                  style={{ marginBottom: "3px" }}
                                  alt="complete"
                                />
                              ) : d.status === APPROVED ? (
                                <Image
                                  src={complete}
                                  style={{ marginBottom: "3px" }}
                                  alt="complete"
                                />
                              ) : (
                                // : d.status === "active" ||
                                //   d.status === "Active" ? (
                                //   <Image
                                //     src={calender}
                                //     style={{ marginBottom: "3px" }}
                                //     alt="calender"
                                //   />
                                // ) : d.status === "draft" ||
                                //   d.status === "Draft" ? (
                                //   <Image
                                //     src={clock}
                                //     style={{ marginBottom: "3px" }}
                                //     alt="clock"
                                //   />
                                // )
                                ""
                              )}
                              &nbsp;{d.status}
                            </td>
                            <td>{d.latitude}</td>
                            <td>{d.longitude}</td>
                            <td>
                              {d.vehicleID
                                ? getName(d.vehicleID, vehicles)
                                : ""}
                            </td>
                            <td>
                              {d.driverID ? getName(d.driverID, drivers) : ""}
                            </td>
                            <td>
                              {new Date(d.fromDate).toLocaleDateString(
                                "en-GB",
                                {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td>
                              {new Date(d.toDate).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td>
                              {d.createdAt &&
                                new Date(d.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.updatedAt &&
                                new Date(d.updatedAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.complete_at &&
                                new Date(d.complete_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.submitted_at &&
                                new Date(d.submitted_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.issued_at &&
                                new Date(d.issued_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              <DeleteModal
                                handleDelete={handleDelete}
                                id={d.id}
                              />
                            </td>
                            <td>
                              <Form
                                api={VISIT_API}
                                method="PUT"
                                id={d.id}
                                setRefresh={setRefresh}
                                refresh={refresh}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={18} className="p-0">
                            <div className="row d-flex mb-3 m-0">
                              <div className="col-lg-3 col-md-4 col mt-2">
                                {/* Display the current range and total */}
                                {indexOfFirstRow + 1} -{" "}
                                {Math.min(indexOfLastRow, data.length)} of{" "}
                                {data.length}
                              </div>
                              <div className="col text-center mt-2">
                                <Button
                                  className="btn bg-color-sea-green shadow me-2 text-white"
                                  onClick={handleFirstPage}
                                  disabled={currentPage === 1}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  First Page
                                </Button>
                                <Button
                                  className="btn bg-color-sea-green shadow me-2 text-white"
                                  onClick={handlePreviousPage}
                                  disabled={currentPage === 1}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  Previous
                                </Button>
                                {renderPageNumbers()}
                                <Button
                                  className="btn bg-color-sea-green shadow me-2 text-white"
                                  onClick={handleNextPage}
                                  disabled={currentPage === totalPages}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  Next
                                </Button>
                                <Button
                                  className="btn bg-color-sea-green shadow text-white"
                                  onClick={handleLastPage}
                                  disabled={currentPage === totalPages}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  Last Page
                                </Button>
                              </div>
                              <div className="col-lg-4 col-md-4 col">
                                <div className="row d-flex m-0 me-2 justify-content-end align-items-center">
                                  <div className="col-lg-2 col-md-1 col"></div>
                                  <div className="col-lg-5 col-md-4 col text-end">
                                    <label
                                      htmlFor="rowPerPage"
                                      className="form-label mt-2"
                                    >
                                      Rows Per Page:
                                    </label>
                                  </div>
                                  <div className="col-lg-1 col-md-3 col text-start p-0">
                                    <select
                                      className="rounded bg-color-sea-green text-white shadow p-2"
                                      style={{
                                        color: "#fff",
                                        border: "1px solid #445E84",
                                        outline: "none",
                                      }}
                                      aria-label="Rows per page"
                                      name="rowPerPage"
                                      value={rows}
                                      onChange={handleRowsPerPage}
                                    >
                                      {[10, 20, 30, 40, 50].map((num) => (
                                        <option key={num} value={num}>
                                          &nbsp;{num}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              </div>
            }
          />
        </div>
        <div className="col">
          <CustomModal
            size="xl"
            modalId="tourPlans2"
            button={
              <Button className="btn h-100">
                <img
                  className="img-fluid rounded-3"
                  style={{ objectFit: "cover", height: "100%" }}
                  src="/images/tourPlans2.png"
                  alt="tourPlans"
                />
              </Button>
            }
            body={
              <div
                className="container-fluid border border-white p-3"
                style={{
                  borderRadius: "20px",
                  background: "#CFE6F8",
                  height: "700px",
                  overflow: "scroll",
                }}
              >
                <>
                  <div className="row d-flex p-3">
                    <div className="col-lg-6 col-md-6 col">
                      <h4 className="fw-bold">Visits Scheduled</h4>
                    </div>
                    <div className="col-lg-6 col-md-6 col">
                      <div className="row d-flex ">
                        <div className="col d-none d-lg-block"></div>
                        <div className="col text-end">
                          <span className="fw-bold">
                            {new Date().toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>{" "}
                          Today
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                      <Button
                        className="btn btn-warning w-100 text-white fw-bold"
                        style={{ letterSpacing: 1 }}
                        onClick={() => handleFilterData(data, "pending")}
                      >
                        Pending
                      </Button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                      <Button
                        style={{ letterSpacing: 1 }}
                        className="btn btn-info w-100 text-white fw-bold"
                        onClick={() => handleFilterData(data, "scheduled")}
                      >
                        Scheduled
                      </Button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                      <Button
                        style={{ letterSpacing: 1 }}
                        className="btn btn-success w-100 text-white fw-bold"
                        onClick={() => handleFilterData(data, "completed")}
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                  <div className="row d-flex justify-content-between p-3">
                    <div className="col-lg-6 col-md-5 col-sm-12">
                      <p>
                        Showing:{" "}
                        <span className="fw-bold">
                          {searchTerm || status
                            ? filteredData.length
                            : data?.length}{" "}
                          Visits
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <form>
                        <div className="input-group">
                          <span
                            className="input-group-text bg-color-sea-green border-0 rounded-end rounded-pill"
                            id="basic-addon1"
                          >
                            <IoSearch style={{ color: "#fff" }} />
                          </span>
                          <input
                            type="text"
                            className="form-control border-0 rounded-start"
                            style={{ background: "rgba(16, 143, 168, .1)" }}
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleChange}
                          />
                          <button
                            className="btn rounded-start rounded-pill bg-color-sea-green text-white"
                            type="submit"
                          >
                            Search
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table
                      className="table table-hover mb-5"
                      style={{
                        border: ".41px solid rgba(81,81,81,0.20) !important",
                      }}
                    >
                      <thead>
                        <tr
                          className={`color-dark-blue cursor-pointer ${inter.className}`}
                          style={{
                            border:
                              ".41px solid rgba(81,81,81,0.20) !important",
                            fontSize: ".85rem",
                          }}
                        >
                          <TableHeading
                            name="id"
                            handleSort={() => handleSort("id")}
                          />
                          <TableHeading
                            name="project Id"
                            handleSort={() => handleSort("projectId")}
                          />
                          <TableHeading
                            name="assigned To"
                            handleSort={() => handleSort("assignedTo")}
                          />
                          <TableHeading
                            name="status"
                            handleSort={() => handleSort("status")}
                          />
                          <TableHeading
                            name="latitude"
                            handleSort={() => handleSort("latitude")}
                          />
                          <TableHeading
                            name="longitude"
                            handleSort={() => handleSort("longitude")}
                          />
                          <TableHeading
                            name="vehicle"
                            handleSort={() => handleSort("vehicleID")}
                          />
                          <TableHeading
                            name="driver ID"
                            handleSort={() => handleSort("driverID")}
                          />
                          <TableHeading
                            name="from Date"
                            handleSort={() => handleSort("fromDate")}
                          />
                          <TableHeading
                            name="to Date"
                            handleSort={() => handleSort("toDate")}
                          />
                          <TableHeading
                            name="created at"
                            handleSort={() => handleSort("createdAt")}
                          />
                          <TableHeading
                            name="updated at"
                            handleSort={() => handleSort("updatedAt")}
                          />
                          <TableHeading
                            name="complete at"
                            handleSort={() => handleSort("complete_at")}
                          />
                          <TableHeading
                            name="submitted at"
                            handleSort={() => handleSort("submitted_at")}
                          />
                          <TableHeading
                            name="issued at"
                            handleSort={() => handleSort("issued_at")}
                          />
                          <th colSpan={2}>
                            <div className="text-center"></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(searchTerm || status
                          ? filteredData
                          : paginatedData
                        ).map((d) => (
                          <tr
                            style={{
                              border:
                                ".41px solid rgba(81,81,81,0.20) !important",
                              fontSize: ".85rem",
                            }}
                            key={d.id}
                          >
                            <td>{d.id}</td>
                            <td>{getName(d.projectId, projects)}</td>
                            <td>{getName(d.assignedTo, users)}</td>
                            <td style={{ whiteSpace: "nowrap" }}>
                              {d.status === SCHEDULED ? (
                                <Image
                                  src={calender}
                                  style={{ marginBottom: "3px" }}
                                  alt="calender"
                                />
                              ) : d.status === SUBMITTED ? (
                                <Image
                                  src={clock}
                                  style={{ marginBottom: "3px" }}
                                  alt="clock"
                                />
                              ) : d.status === CANCELLED ? (
                                <Image
                                  src={cancel}
                                  style={{ marginBottom: "3px" }}
                                  alt="cancel"
                                />
                              ) : d.status === COMPLETED ? (
                                <Image
                                  src={complete}
                                  style={{ marginBottom: "3px" }}
                                  alt="complete"
                                />
                              ) : d.status === APPROVED ? (
                                <Image
                                  src={complete}
                                  style={{ marginBottom: "3px" }}
                                  alt="complete"
                                />
                              ) : (
                                // : d.status === "active" ||
                                //   d.status === "Active" ? (
                                //   <Image
                                //     src={calender}
                                //     style={{ marginBottom: "3px" }}
                                //     alt="calender"
                                //   />
                                // ) : d.status === "draft" ||
                                //   d.status === "Draft" ? (
                                //   <Image
                                //     src={clock}
                                //     style={{ marginBottom: "3px" }}
                                //     alt="clock"
                                //   />
                                // )
                                ""
                              )}
                              &nbsp;
                              <DisplayStatusText statusId={d.status} />
                            </td>
                            <td>{d.latitude}</td>
                            <td>{d.longitude}</td>
                            <td>
                              {d.vehicleID
                                ? getName(d.vehicleID, vehicles)
                                : ""}
                            </td>
                            <td>
                              {d.driverID ? getName(d.driverID, drivers) : ""}
                            </td>
                            <td>
                              {new Date(d.fromDate).toLocaleDateString(
                                "en-GB",
                                {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td>
                              {new Date(d.toDate).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td>
                              {d.createdAt &&
                                new Date(d.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.updatedAt &&
                                new Date(d.updatedAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.complete_at &&
                                new Date(d.complete_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.submitted_at &&
                                new Date(d.submitted_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              {d.issued_at &&
                                new Date(d.issued_at).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                            </td>
                            <td>
                              <DeleteModal
                                handleDelete={handleDelete}
                                id={d.id}
                              />
                            </td>
                            <td>
                              <Form
                                api={VISIT_API}
                                method="PUT"
                                id={d.id}
                                setRefresh={setRefresh}
                                refresh={refresh}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={18} className="p-0">
                            <div className="row d-flex mb-3 m-0">
                              <div className="col-lg-3 col-md-4 col mt-2">
                                {/* Display the current range and total */}
                                {indexOfFirstRow + 1} -{" "}
                                {Math.min(indexOfLastRow, data.length)} of{" "}
                                {data.length}
                              </div>
                              <div className="col text-center mt-2">
                                <Button
                                  className="btn bg-color-sea-green shadow me-2 text-white"
                                  onClick={handleFirstPage}
                                  disabled={currentPage === 1}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  First Page
                                </Button>
                                <Button
                                  className="btn bg-color-sea-green shadow me-2 text-white"
                                  onClick={handlePreviousPage}
                                  disabled={currentPage === 1}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  Previous
                                </Button>
                                {renderPageNumbers()}
                                <Button
                                  className="btn bg-color-sea-green shadow me-2 text-white"
                                  onClick={handleNextPage}
                                  disabled={currentPage === totalPages}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  Next
                                </Button>
                                <Button
                                  className="btn bg-color-sea-green shadow text-white"
                                  onClick={handleLastPage}
                                  disabled={currentPage === totalPages}
                                  style={{
                                    border: "1px solid #445E84",
                                  }}
                                >
                                  Last Page
                                </Button>
                              </div>
                              <div className="col-lg-4 col-md-4 col">
                                <div className="row d-flex m-0 me-2 justify-content-end align-items-center">
                                  <div className="col-lg-2 col-md-1 col"></div>
                                  <div className="col-lg-5 col-md-4 col text-end">
                                    <label
                                      htmlFor="rowPerPage"
                                      className="form-label mt-2"
                                    >
                                      Rows Per Page:
                                    </label>
                                  </div>
                                  <div className="col-lg-1 col-md-3 col text-start p-0">
                                    <select
                                      className="rounded bg-color-sea-green text-white shadow p-2"
                                      style={{
                                        color: "#fff",
                                        border: "1px solid #445E84",
                                        outline: "none",
                                      }}
                                      aria-label="Rows per page"
                                      name="rowPerPage"
                                      value={rows}
                                      onChange={handleRowsPerPage}
                                    >
                                      {[10, 20, 30, 40, 50].map((num) => (
                                        <option key={num} value={num}>
                                          &nbsp;{num}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default List;

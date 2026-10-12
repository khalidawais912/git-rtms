"use client";
import { VISIT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import DeleteModal from "@/app/components/DeleteModal";
import DisplayStatusText from "@/app/components/DisplayStatusText";
import Loader from "@/app/components/Loader/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
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

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm || status ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  const handleFilterData = (data: Visit[], status: string) => {
    setStatus(status);
    setFilteredData(data?.filter((d: any) => d.status === status));
  };

  useEffect(() => {
    handleFilterData(data, status);
  }, [data]);

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Visits"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        status={status.toUpperCase()}
        form={
          <>
            <div className="col mb-2">
              <Button
                className="btn btn-warning w-100 text-white fw-bold"
                style={{ letterSpacing: 1 }}
                onClick={() => handleFilterData(data, "pending")}
              >
                Pending
              </Button>
            </div>
            <div className="col mb-2">
              <Button
                style={{ letterSpacing: 1 }}
                className="btn btn-info w-100 text-white fw-bold"
                onClick={() => handleFilterData(data, "scheduled")}
              >
                Scheduled
              </Button>
            </div>
            <div className="col mb-2">
              <Button
                style={{ letterSpacing: 1 }}
                className="btn btn-success w-100 text-white fw-bold"
                onClick={() => handleFilterData(data, "completed")}
              >
                Completed
              </Button>
            </div>
          </>
        }
      />
      <div className="table-responsive">
        <table
          className="table table-hover mb-5"
          style={{ border: ".41px solid rgba(81,81,81,0.20) !important" }}
        >
          <thead>
            <tr
              className={`color-dark-blue cursor-pointer ${inter.className}`}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <TableHeading name="id" handleSort={() => handleSort("id")} />
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
            {paginatedData.map((d) => (
              <tr
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
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
                    // : d.status === "active" || d.status === "Active" ? (
                    //   <Image
                    //     src={calender}
                    //     style={{ marginBottom: "3px" }}
                    //     alt="calender"
                    //   />
                    // ) : d.status === "draft" || d.status === "Draft" ? (
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
                <td>{d.vehicleID ? getName(d.vehicleID, vehicles) : ""}</td>
                <td>{d.driverID ? getName(d.driverID, drivers) : ""}</td>
                <td>
                  {new Date(d.fromDate).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
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
                    new Date(d.createdAt).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </td>
                <td>
                  {d.updatedAt &&
                    new Date(d.updatedAt).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </td>
                <td>
                  {d.complete_at &&
                    new Date(d.complete_at).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </td>
                <td>
                  {d.submitted_at &&
                    new Date(d.submitted_at).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </td>
                <td>
                  {d.issued_at &&
                    new Date(d.issued_at).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
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
              <td colSpan={18}>
                <Pagination
                  searchTerm={searchTerm}
                  filteredData={filteredData}
                  data={data}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  status={status}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default List;

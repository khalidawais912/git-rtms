"use client";
import { GET_USER_PROJECTS_API, VISIT_API } from "@/services/endpoints";
import DeleteModal from "@/components/DeleteModal";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Table/Pagination";
import TableHeader from "@/components/Table/TableHeader";
import TableHeading from "@/components/Table/TableHeading";
import { useAuthentication } from "@/features/users";
import { useSectors } from "@/features/sectors";
import { useSuperGroups } from "@/features/super-group";
import { useVisits, Visit } from "@/features/visits";
import apiClient, { AxiosError } from "@/services/client";
import { sort } from "fast-sort";
import { dmSans, inter } from "@/styles/fonts";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import calender from "@/public/icons/calendar.svg";
import cancel from "@/public/icons/cancel.svg";
import clock from "@/public/icons/clock.svg";
import complete from "@/public/icons/complete.svg";
import Form from "./Form";
import GroupingForm from "./GroupingForm";
import {
  APPROVED,
  CANCELLED,
  COMPLETED,
  ISSUED,
  SCHEDULED,
  SUBMITTED,
} from "@/constants/statuses";
import DisplayStatusText from "@/components/DisplayStatusText";
import { useDriver } from "@/features/drivers";
import { useVehicle } from "@/features/vehicles";
import { useTourPlans } from "@/features/tour-plans";
import { useDistrict } from "@/features/districts";

const VisitsList = () => {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { data, setData, setError } = useVisits({ refresh });
  const { data: visits } = useVisits({ refresh });
  const { data: drivers } = useDriver({ refresh });
  const { data: vehicles } = useVehicle({ refresh });
  const { data: users } = useAuthentication({ refresh });
  const { data: visitPlans } = useTourPlans({ refresh });
  const { data: districts } = useDistrict({ refresh });

  const { data: superGroups } = useSuperGroups({ refresh });

  const deleteMessage = "Deleted Successfully!";
  const syncMessage = "Attribute Values synced Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Visit[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const filtered = data.filter((item) =>
      [item.id.toString()]
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

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  const handleSubmit = async (id: number) => {
    try {
      const response = await apiClient.get(
        `${GET_USER_PROJECTS_API}?userId=${id}`,
      );
      console.log("Response:", response);
      setData(response.data.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
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

  return (
    <>
      <>
        {isLoading && <Loader />}
        <TableHeader
          heading="Visits"
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          handleChange={handleChange}
          form={
            <>
              <div className="col-auto text-end mb-2">
                <Form
                  api={VISIT_API}
                  method={"POST"}
                  setRefresh={setRefresh}
                  refresh={refresh}
                  visits={visits}
                  drivers={drivers}
                  vehicles={vehicles}
                  users={users}
                  visitPlans={visitPlans}
                  districts={districts}
                />
              </div>
            </>
          }
        />
      </>
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
                name="status"
                handleSort={() => handleSort("status")}
              />
              <th className="text-center" style={{ whiteSpace: "nowrap" }}>
                SUPER GROUP
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d) => (
              <tr
                className={dmSans.className}
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
                key={d.id}
              >
                <td>{d.id}</td>
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
                  ) : d.status === ISSUED ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : (
                    ""
                  )}
                  &nbsp;
                  <DisplayStatusText statusId={d.status} />
                </td>
                <td className="text-center">
                  <GroupingForm id={d.id} options={superGroups} />
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td>
                <td>
                  <Form
                    api={VISIT_API}
                    method={"PUT"}
                    setRefresh={setRefresh}
                    refresh={refresh}
                    id={d.id}
                    visits={visits}
                    drivers={drivers}
                    vehicles={vehicles}
                    users={users}
                    visitPlans={visitPlans}
                    districts={districts}
                  />
                </td>
              </tr>
            ))}
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
    </>
  );
};

export default VisitsList;

"use client";
import { VISIT_API, VISIT_NEW_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useVisitsNew, { VisitNew } from "@/app/hooks/useVisitsNew";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { sort } from "fast-sort";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import calender from "../../../public/icons/calendar.svg";
import cancel from "../../../public/icons/cancel.svg";
import clock from "../../../public/icons/clock.svg";
import complete from "../../../public/icons/complete.svg";
import Form from "./Form";
import useDriver from "@/app/hooks/useDriver";
import useVehicle from "@/app/hooks/useVehicle";
import useProjects from "@/app/hooks/useProjects";
import useAuthentication from "@/app/hooks/useAuthentication";
import useTourPlans from "@/app/hooks/useTourPlans";
import useDistrict from "@/app/hooks/useDistrict";

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
  const { data, isLoading, setData } = useVisitsNew({ refresh });

  const { data: drivers } = useDriver({ refresh });
  const { data: vehicles } = useVehicle({ refresh });
  const { data: projects } = useProjects({ refresh });
  const { data: users } = useAuthentication({ refresh });
  const { data: visitPlans } = useTourPlans({ refresh });
  const { data: districts } = useDistrict({ refresh });

  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<VisitNew[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = data.filter((item) =>
      [
        item.id.toString(),
        item.gsNo,
        item.name,
        item.userName,
        item.userId.toString(),
        item.designation,
        item.sectorName,
        item.districtName,
        item.districtId.toString(),
        item.status,
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
    key: keyof VisitNew;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof VisitNew) => {
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
      await apiClient.delete(`${VISIT_NEW_API}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.id !== id));
      notifyCreate(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      // setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  // const handleFilterData = (data: VisitNew[], status: string) => {
  //   setStatus(status);
  //   setFilteredData(data?.filter((d: any) => d.status === status));
  // };

  // useEffect(() => {
  //   handleFilterData(data, status);
  // }, [data]);

  return (
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
            {/* <div className="col mb-2">
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
            </div> */}
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
              <TableHeading
                name="project id"
                handleSort={() => handleSort("id")}
              />
              <TableHeading
                name="gs no"
                handleSort={() => handleSort("gsNo")}
              />
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="userName"
                handleSort={() => handleSort("userName")}
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
                name="status"
                handleSort={() => handleSort("status")}
              />
              <th colSpan={2}>
                <div className="text-center"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d, i) => (
              <tr
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
                key={i}
              >
                <td>{d.id}</td>
                <td>{d.gsNo}</td>
                <td>{d.name}</td>
                <td>
                  {d.userName}
                  <br />({d.designation})
                </td>
                <td>{d.sectorName}</td>
                <td>{d.districtName}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {d.status.toLowerCase() === "scheduled" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status.toLowerCase() === "not confirmed" ||
                    d.status.toLowerCase() === "pending" ? (
                    <Image
                      src={clock}
                      style={{ marginBottom: "3px" }}
                      alt="clock"
                    />
                  ) : d.status.toLowerCase() === "cancel" ? (
                    <Image
                      src={cancel}
                      style={{ marginBottom: "3px" }}
                      alt="cancel"
                    />
                  ) : d.status.toLowerCase() === "completed" ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status.toLowerCase().startsWith("approved") ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status.toLowerCase() === "active" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status.toLowerCase() === "draft" ? (
                    <Image
                      src={clock}
                      style={{ marginBottom: "3px" }}
                      alt="clock"
                    />
                  ) : (
                    ""
                  )}
                  &nbsp;{d.status}
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td>
                <td>
                  <Form
                    api={VISIT_API}
                    method="POST"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                    drivers={drivers}
                    vehicles={vehicles}
                    projects={projects}
                    users={users}
                    visitPlans={visitPlans}
                    districts={districts}
                    visitsNew={data}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={9}>
                <Pagination
                  searchTerm={searchTerm}
                  filteredData={filteredData}
                  data={data}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
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

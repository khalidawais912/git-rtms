"use client";
import { GET_USER_PROJECTS_API, SMDP_SYNC_API } from "@/app/APIs";
import Loader from "@/app/components/Loader/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useAuthentication from "@/app/hooks/useAuthentication";
import useProjects, { Project } from "@/app/hooks/useProjects";
import useSectors from "@/app/hooks/useSectors";
import useSuperGroups from "@/app/hooks/useSuperGroups";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getName } from "@/app/utils";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import calender from "../../../public/icons/calendar.svg";
import cancel from "../../../public/icons/cancel.svg";
import clock from "../../../public/icons/clock.svg";
import complete from "../../../public/icons/complete.svg";
import AssignUserForm from "./AssignUserForm";
import GroupingForm from "./GroupingForm";
import SmdpAllProjectsSyncForm from "./SmdpAllProjectsSyncForm";
import SmdpSyncForm from "./SmdpSyncForm";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
});

const inter = Inter({ subsets: ["latin"] });

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  showData: boolean;
  setShowData: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  id: number;
  superGroupLabel: string;
}

export interface UserOption {
  id: number;
  userName: string;
}

const UserProjectsList = ({
  refresh,
  setRefresh,
  showData,
  setShowData,
}: ListProps) => {
  const { error, setError, isLoading } = useProjects({
    refresh,
  });
  const { data: sectorsData } = useSectors({ refresh });
  const { data: superGroups } = useSuperGroups({ refresh });
  const { data: users } = useAuthentication({ refresh });
  const [originalData, setOriginalData] = useState<Project[]>([]); // Store the original data
  const [data, setData] = useState<Project[]>([]); // Store the original data

  const deleteMessage = "Deleted Successfully!";
  const syncMessage = "Attribute Values synced Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Project[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id.toString(), item.gsNo, item.name, item.status]
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

  useEffect(() => {
    setOriginalData(data);
  }, [refresh, data]);

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Project) => {
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

  return (
    <>
      <>
        {isLoading && <Loader />}
        <TableHeader
          heading="User Projects"
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          handleChange={handleChange}
          form={
            <>
              <div className="col text-end mb-2">
                <SmdpSyncForm
                  api={SMDP_SYNC_API}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div>
              <div className="col text-end mb-2">
                <SmdpAllProjectsSyncForm
                  api={SMDP_SYNC_API}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div>
              <div className="col-auto">
                <form>
                  <div className="col text-start">
                    <select
                      className="color-light-dark pt-1 pb-2"
                      aria-label="Select User"
                      name="user"
                      style={{
                        outline: "none",
                        background: "rgba(16, 143, 168, .1)",
                      }}
                      onChange={(e) => handleSubmit(Number(e.target.value))}
                    >
                      <option value="">Select User</option>
                      {users.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.userName}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
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
                name="gs No"
                handleSort={() => handleSort("gsNo")}
              />
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="sector"
                handleSort={() => handleSort("sectorId")}
              />
              <TableHeading
                name="status"
                handleSort={() => handleSort("status")}
              />
              <th style={{ whiteSpace: "nowrap" }}>ASSIGN USER</th>
              {/* <th style={{ whiteSpace: "nowrap" }}>SYNC ATTRIBUTES</th> */}
              <th style={{ whiteSpace: "nowrap" }}>SUPER GROUP</th>
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
                <td>{d.gsNo}</td>
                <td>{d.name}</td>
                <td>{getName(d.sectorId, sectorsData)}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {d.status === "scheduled" || d.status === "Scheduled" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status === "not confirmed" ||
                    d.status === "Not Confirmed" ? (
                    <Image
                      src={clock}
                      style={{ marginBottom: "3px" }}
                      alt="clock"
                    />
                  ) : d.status === "cancel" || d.status === "Cancel" ? (
                    <Image
                      src={cancel}
                      style={{ marginBottom: "3px" }}
                      alt="cancel"
                    />
                  ) : d.status === "completed" || d.status === "Completed" ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status.startsWith("approved") ||
                    d.status.startsWith("Approved") ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status === "active" || d.status === "Active" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status === "draft" || d.status === "Draft" ? (
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
                <td className="text-center">
                  <AssignUserForm id={d.id} options={users} />
                </td>
                {/* <td className="text-center">
                  <SyncModal handleSubmit={handleSync} id={d.smdpProjectID} />
                </td> */}
                <td className="text-center">
                  <GroupingForm id={d.id} options={superGroups} />
                </td>
                {/* <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td> */}
                {/* <td>
                  <DownloadPDFBtn />
                </td> */}
                {/* <td>
                  <ProjectForm
                    api={PROJECT_API}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </td> */}
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

export default UserProjectsList;

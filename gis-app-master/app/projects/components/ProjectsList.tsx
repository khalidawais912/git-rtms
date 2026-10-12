"use client";
import {
  EVALUATION_PROJECT_API,
  EVALUATION_TEMP_TOUR_PLAN_API,
  PROJECT_API,
  TEMP_TOUR_PLAN_API,
} from "@/app/APIs";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader/Loader";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useAuthentication from "@/app/hooks/useAuthentication";
import useProjects, { Project } from "@/app/hooks/useProjects";
import useSectors from "@/app/hooks/useSectors";
import useSuperGroups from "@/app/hooks/useSuperGroups";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getName } from "@/app/utils";
import { sort } from "fast-sort";
import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import calender from "../../../public/icons/calendar.svg";
import cancel from "../../../public/icons/cancel.svg";
import clock from "../../../public/icons/clock.svg";
import complete from "../../../public/icons/complete.svg";
import AssignUserForm from "./AssignUserForm";
import GroupingForm from "./GroupingForm";
import StatusBadge from "./StatusBadge";
import TableWrapper from "@/app/components/Table/TableWrapper";

export interface Option {
  id: number;
  superGroupLabel: string;
}

export interface UserOption {
  id: number;
  userName: string;
}

const ProjectsList = ({ dashboardType }: { dashboardType?: string }) => {
  const PROJECT_API_ENDPOINT = dashboardType
    ? EVALUATION_PROJECT_API
    : PROJECT_API;

  const TEMP_TOUR_PLAN_API_ENDPOINT = dashboardType
    ? EVALUATION_TEMP_TOUR_PLAN_API
    : TEMP_TOUR_PLAN_API;

  const { data, setData, setError, isLoading } = useProjects();
  const { data: sectorsData } = useSectors();
  const { data: superGroups } = useSuperGroups();
  const { data: users } = useAuthentication();
  const [originalData, setOriginalData] = useState<Project[]>([]); // Store the original data
  const [isPageLimit, setPageLimit] = useState(false);

  const deleteMessage = "Deleted Successfully!";
  // const syncMessage = "Attribute Values synced Successfully!";

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
  }, [data]);

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

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`${PROJECT_API_ENDPOINT}/${id}`);
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
  const [rows, setRows] = useState(11); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Determine the data to display for the current page
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  const hideCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Filter the data to hide completed items
      setData((prevData) =>
        prevData.filter((item) => item.status !== "Complete"),
      );
    } else {
      // Reset to the original data
      setData([...originalData]);
    }
  };

  const showCancel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Filter the data to show only canceled items
      setData((prevData) =>
        prevData.filter((item) => item.status === "Cancel"),
      );
    } else {
      // Reset to the original data
      setData([...originalData]);
    }
  };

  const handleAddVisitPlan = async (projectId: number) => {
    try {
      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API_ENDPOINT}/add-tour-plan?projectid=${projectId}`,
      );
      console.log(response);
      notifyCreate(response.data?.message);
    } catch (err) {
      console.log(err);
      notifyError((err as AxiosError).message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Projects"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <>
            {/* <div className="col-auto text-end mb-2">
                <ProjectForm
              api={PROJECT_API_ENDPOINT}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
            />
                <SmdpSyncForm
                  api={SMDP_SYNC_API}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div> */}
            {/* <div className="col-auto text-end">
                <SmdpAllProjectsSyncForm
                  api={SMDP_SYNC_API}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div> */}
          </>
        }
      />
      <TableWrapper
        setRows={setRows}
        currentPage={currentPage}
        data={data}
        isPageLimit={isPageLimit}
      >
        {(firstRowRef) => (
          <>
            <thead>
              <tr>
                <TableHeading name="id" handleSort={() => handleSort("id")} />
                <TableHeading
                  className="text-nowrap"
                  name="gs No"
                  handleSort={() => handleSort("gsNo")}
                />
                <TableHeading
                  name="name"
                  handleSort={() => handleSort("name")}
                />
                <TableHeading
                  name="sector"
                  handleSort={() => handleSort("sectorId")}
                />
                <TableHeading
                  name="status"
                  handleSort={() => handleSort("status")}
                />
                <TableHeading name="ASSIGN USER" className="text-nowrap" />
                <TableHeading name="SUPER GROUP" className="text-nowrap" />
                <TableHeading
                  name="ADD TO VISIT PLAN"
                  className="text-nowrap"
                />
                {/* <th style={{ whiteSpace: "nowrap" }}>ASSIGN USER</th> */}
                {/* <th style={{ whiteSpace: "nowrap" }}>SYNC ATTRIBUTES</th> */}
                {/* <th style={{ whiteSpace: "nowrap" }}>SUPER GROUP</th> */}
                {/* <th colSpan={1}>
                <div className="text-center"></div>
              </th> */}
                {/* <th className="text-nowrap">ADD TO VISIT PLAN</th> */}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={d.id} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.gsNo}</TableData>
                  <TableData>{d.name}</TableData>
                  <TableData className="text-nowrap">
                    {getName(d.sectorId, sectorsData)}
                  </TableData>
                  <TableData className="text-nowrap">
                    {/* {d.status.toLowerCase() === "scheduled" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status.toLowerCase() === "not confirmed" ? (
                    <Image
                      src={clock}
                      style={{ marginBottom: "3px" }}
                      alt="clock"
                    />
                  ) : d.status.toLowerCase() === "un-approved" ? (
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
                  &nbsp; */}
                    <StatusBadge status={d.status} />
                  </TableData>
                  <TableData className="text-center">
                    <AssignUserForm id={d.id} options={users} />
                  </TableData>
                  {/* <td className="text-center">
                  <SyncModal handleSubmit={handleSync} id={d.smdpProjectID} />
                </TableData> */}
                  <TableData className="text-center">
                    <GroupingForm
                      id={d.id}
                      options={superGroups}
                      dashboardType={dashboardType}
                    />
                  </TableData>
                  <TableData className="text-center">
                    <Button
                      className="btn btn-sm"
                      onClick={() => handleAddVisitPlan(d.id)}
                    >
                      <AiOutlinePlus size={26} />
                    </Button>
                  </TableData>
                  {/* <TableData>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </TableData> */}
                  {/* <TableData>
                  <DownloadPDFBtn />
                </TableData> */}
                  {/* <TableData>
                  <ProjectForm
                    api={PROJECT_API_ENDPOINT}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </TableData> */}
                </tr>
              ))}
            </tbody>
          </>
        )}
      </TableWrapper>
      <Pagination
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        rows={rows}
        setRows={setRows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setPageLimit={setPageLimit}
      />
    </>
  );
};

export default ProjectsList;

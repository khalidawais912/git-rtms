"use client";
import {
  EVALUATION_TEMP_TOUR_PLAN_API,
  TEMP_TOUR_PLAN_API,
} from "@/services/endpoints";
import Button from "@/components/Button";
import Loader from "@/components/Loader/Loader";
import Pagination from "@/components/Table/Pagination";
import RowHeader from "@/components/Table/RowHeader";
import TableData from "@/components/Table/TableData";
import TableHeader from "@/components/Table/TableHeader";
import TableHeading from "@/components/Table/TableHeading";
import { useAuthentication } from "@/features/users";
import { useProjects, Project } from "@/features/projects";
import { useSectors } from "@/features/sectors";
import { useSuperGroups } from "@/features/super-group";
import apiClient, { AxiosError } from "@/services/client";
import { getName } from "@/utils";
import { sort } from "fast-sort";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import AssignUserForm from "./AssignUserForm";
import GroupingForm from "./GroupingForm";
import StatusBadge from "./StatusBadge";
import TableWrapper from "@/components/Table/TableWrapper";
const ProjectsList = ({ dashboardType }: { dashboardType?: string }) => {

  const TEMP_TOUR_PLAN_API_ENDPOINT = dashboardType
    ? EVALUATION_TEMP_TOUR_PLAN_API
    : TEMP_TOUR_PLAN_API;

  const { data, setData, isLoading } = useProjects();
  const { data: sectorsData } = useSectors();
  const { data: superGroups } = useSuperGroups();
  const { data: users } = useAuthentication();
  const [, setOriginalData] = useState<Project[]>([]); // Store the original data
  const [isPageLimit, setPageLimit] = useState(false);


  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Project[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
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


  // for selecting rows per page
  const [rows, setRows] = useState(11); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Determine the data to display for the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );



  const handleAddVisitPlan = async (projectId: number) => {
    try {
      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API_ENDPOINT}/add-tour-plan?projectid=${projectId}`,
      );
      notifyCreate(response.data?.message);
    } catch (err) {
      console.error(err);
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
                    <StatusBadge status={d.status} />
                  </TableData>
                  <TableData className="text-center">
                    <AssignUserForm id={d.id} options={users} />
                  </TableData>
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

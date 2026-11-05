"use client";
import { EVALUATION_SUPER_GROUP_API, SUPER_GROUP_API } from "@/services/endpoints";
import DeleteModal from "@/components/DeleteModal";
import Loader from "@/components/Loader/Loader";
import Actions from "@/components/Table/Actions";
import Pagination from "@/components/Table/Pagination";
import RowHeader from "@/components/Table/RowHeader";
import TableData from "@/components/Table/TableData";
import TableHeader from "@/components/Table/TableHeader";
import TableHeading from "@/components/Table/TableHeading";
import TableWrapper from "@/components/Table/TableWrapper";
import { useAttributeGroups } from "@/features/attribute-groups";
import { useSuperGroups } from "../hooks";
import { SuperGroup } from "../types";
import apiClient, { AxiosError } from "@/services/client";
import { sort } from "fast-sort";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
import GroupingForm from "./GroupingForm";

const List = ({ dashboardType }: { dashboardType?: string }) => {
  const [refresh, setRefresh] = useState(false);
  const { data, setData, setError, isLoading } = useSuperGroups({
    refresh,
  });
  const [isPageLimit, setPageLimit] = useState(false);

  const SUPER_GROUP_API_ENDPOINT = dashboardType
    ? EVALUATION_SUPER_GROUP_API
    : SUPER_GROUP_API;

  const { data: attributeGroups } = useAttributeGroups({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<SuperGroup[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const filtered = data.filter((item) =>
      [item.id.toString(), item.superGroupLabel]
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
    key: keyof SuperGroup;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof SuperGroup) => {
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
      await apiClient.delete(`${SUPER_GROUP_API_ENDPOINT}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.id !== id));
      notifyCreate(deleteMessage);
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  // for selecting rows per page
  const [rows, setRows] = useState(15); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Super Groups"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={SUPER_GROUP_API_ENDPOINT}
              method="POST"
              setRefresh={setRefresh}
            />
          </div>
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
                  name="super Group Label"
                  handleSort={() => handleSort("superGroupLabel")}
                />
                <TableHeading
                  name="Attribute Groups"
                  textClassName="text-nowrap text-center"
                />
                <TableHeading name="ACTIONS" textClassName="text-center" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={d.id} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.superGroupLabel}</TableData>
                  <TableData className="text-center">
                    <GroupingForm
                      id={d.id}
                      options={attributeGroups}
                      superGroups={data}
                      dashboardType={dashboardType}
                    />
                  </TableData>
                  <TableData>
                    <Actions
                      deleteNode={
                        <DeleteModal handleDelete={handleDelete} id={d.id} />
                      }
                      formNode={
                        <Form
                          api={SUPER_GROUP_API_ENDPOINT}
                          method="PUT"
                          id={d.id}
                          setRefresh={setRefresh}
                        />
                      }
                    />
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

export default List;

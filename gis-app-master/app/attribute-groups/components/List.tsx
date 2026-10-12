"use client";
import {
  ATTRIBUTE_GROUPS_API,
  EVALUATION_ATTRIBUTE_GROUPS_API,
} from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader/Loader";
import Actions from "@/app/components/Table/Actions";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import TableWrapper from "@/app/components/Table/TableWrapper";
import useAttributeGroups, {
  AttributeGroup,
} from "@/app/hooks/useAttributeGroups";
import useAttributes from "@/app/hooks/useAttributes";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
import GroupingForm from "./GroupingForm";

export interface Option {
  attributeId: number;
  label: string;
}

const List = ({ dashboardType }: { dashboardType?: string }) => {
  const [refresh, setRefresh] = useState(false);
  const [isPageLimit, setPageLimit] = useState(false);

  const { data, setData, setError, error, isLoading } = useAttributeGroups({
    refresh,
  });

  const ATTRIBUTE_GROUPS_API_ENDPOINT = dashboardType
    ? EVALUATION_ATTRIBUTE_GROUPS_API
    : ATTRIBUTE_GROUPS_API;

  const { data: attributes } = useAttributes({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<AttributeGroup[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = [...(data || [])].reverse().filter((item) =>
      [item.id.toString(), item.name, item.parentName]
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
    key: keyof AttributeGroup;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof AttributeGroup) => {
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
      await apiClient.delete(`${ATTRIBUTE_GROUPS_API_ENDPOINT}/${id}`);
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
  const paginatedData = (
    searchTerm ? filteredData : [...(data || [])].reverse()
  ).slice((currentPage - 1) * rows, currentPage * rows);

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Attribute Groups"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={ATTRIBUTE_GROUPS_API_ENDPOINT}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              data={data}
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
                  name="name"
                  handleSort={() => handleSort("name")}
                />
                <TableHeading
                  name="description"
                  handleSort={() => handleSort("description")}
                />
                <TableHeading
                  name="parent name"
                  handleSort={() => handleSort("parentName")}
                  className="text-nowrap"
                />
                <TableHeading
                  className="text-nowrap"
                  name="sort id"
                  handleSort={() => handleSort("sortId")}
                />
                {/* <TableHeading
                  className="text-nowrap"
                  name="created at"
                  handleSort={() => handleSort("createdAt")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="updated at"
                  handleSort={() => handleSort("updatedAt")}
                /> */}
                <TableHeading name="Attributes" textClassName="text-center" />
                <TableHeading name="Actions" textClassName="text-center" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={d.id} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.name}</TableData>
                  <TableData>{d.description}</TableData>
                  <TableData>{d.parentName}</TableData>
                  <TableData className="text-center">{d.sortId}</TableData>
                  {/* <TableData>
                    {d.createdAt &&
                      new Date(d.createdAt).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                  </TableData>
                  <TableData>
                    {d.updatedAt &&
                      new Date(d.updatedAt).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                  </TableData> */}
                  <TableData className="text-center">
                    <GroupingForm
                      id={d.id}
                      options={attributes}
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
                          api={ATTRIBUTE_GROUPS_API_ENDPOINT}
                          method="PUT"
                          id={d.id}
                          setRefresh={setRefresh}
                          refresh={refresh}
                          data={data}
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

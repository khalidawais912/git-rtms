"use client";
import { ROLE_API } from "@/shared/api/endpoints";
import DeleteModal from "@/shared/components/DeleteModal";
import Loader from "@/shared/components/Loader/Loader";
import Actions from "@/shared/components/Table/Actions";
import Pagination from "@/shared/components/Table/Pagination";
import RowHeader from "@/shared/components/Table/RowHeader";
import TableData from "@/shared/components/Table/TableData";
import TableHeader from "@/shared/components/Table/TableHeader";
import TableHeading from "@/shared/components/Table/TableHeading";
import TableWrapper from "@/shared/components/Table/TableWrapper";
import { useRights } from "@/features/rights";
import { useRoles } from "../hooks";
import { Role } from "../types";
import apiClient, { AxiosError } from "@/shared/api/client";
import { sort } from "fast-sort";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
import GroupingForm from "./GroupingForm";

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const List = ({ refresh, setRefresh }: ListProps) => {
  const [isPageLimit, setPageLimit] = useState(false);
  const { data, setData, setError, error, isLoading } = useRoles({ refresh });
  const { data: rights } = useRights({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Role[]>([]);

  // Handle search logic
  const handleSearch = (value: string) => {

    const filtered = data.filter((item) =>
      [
        item.id.toString(),
        item.name,
        item.normalizedName,
        item.concurrencyStamp,
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(value.toLowerCase())),
    );
    setFilteredData(filtered);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm !== "") {
    }
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${ROLE_API}/${id}`);
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

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Role;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Role) => {
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
        heading="Roles"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={ROLE_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
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
                  className="text-nowrap"
                  name="normalized Name"
                  handleSort={() => handleSort("normalizedName")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="concurrency Stamp"
                  handleSort={() => handleSort("concurrencyStamp")}
                />
                <TableHeading name="RIGHTS" textClassName="text-center" />
                <TableHeading name="ACTIONS" textClassName="text-center" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={i} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.name}</TableData>
                  <TableData>{d.normalizedName}</TableData>
                  <TableData>{d.concurrencyStamp}</TableData>
                  <TableData className="text-center">
                    <GroupingForm id={d.id} name={d.name} options={rights} />
                  </TableData>
                  <TableData>
                    <Actions
                      deleteNode={
                        <DeleteModal handleDelete={handleDelete} id={d.id} />
                      }
                      formNode={
                        <Form
                          api={ROLE_API}
                          method="PUT"
                          id={d.id}
                          setRefresh={setRefresh}
                          refresh={refresh}
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

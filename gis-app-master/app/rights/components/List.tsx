"use client";
import { RIGHT_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader/Loader";
import Actions from "@/app/components/Table/Actions";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import TableWrapper from "@/app/components/Table/TableWrapper";
import useRights, { Right } from "@/app/hooks/useRights";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, error, isLoading } = useRights({ refresh });
  const deleteMessage = "Deleted Successfully!";
  const [isPageLimit, setPageLimit] = useState(false);

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Right[]>([]);

  // Handle search logic
  const handleSearch = (value: string) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = data.filter((item) =>
      [item.rightId.toString(), item.rightName, item.rightIdentifier]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(value.toLowerCase())),
    );
    setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${RIGHT_API}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.rightId !== id));
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
    key: keyof Right;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Right) => {
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
        heading="Rights"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={RIGHT_API}
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
                <TableHeading
                  name="right id"
                  handleSort={() => handleSort("rightId")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="right name"
                  handleSort={() => handleSort("rightName")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="right Identifier"
                  handleSort={() => handleSort("rightIdentifier")}
                  className="text-nowrap"
                />
                {/* <TableHeading
                  name="created At"
                  handleSort={() => handleSort("createdAt")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="updated At"
                  handleSort={() => handleSort("updatedAt")}
                  className="text-nowrap"
                /> */}
                <TableHeading name="ACTIONS" textClassName="text-center" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={i} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.rightId}</RowHeader>
                  <TableData>{d.rightName}</TableData>
                  <TableData>{d.rightIdentifier}</TableData>
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
                  <TableData>
                    <Actions
                      deleteNode={
                        <DeleteModal
                          handleDelete={handleDelete}
                          id={d.rightId}
                        />
                      }
                      formNode={
                        <Form
                          api={RIGHT_API}
                          method="PUT"
                          id={d.rightId}
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

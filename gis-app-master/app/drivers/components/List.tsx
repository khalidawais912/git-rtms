"use client";
import { DRIVER_API } from "@/app/APIs";
import Avatar from "@/app/components/Avatar";
import Button from "@/app/components/Button";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader/Loader";
import Actions from "@/app/components/Table/Actions";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useDriver, { Driver } from "@/app/hooks/useDriver";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
import TableWrapper from "@/app/components/Table/TableWrapper";

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  id: number;
  name: string;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, isLoading } = useDriver({
    refresh,
  });

  const [isPageLimit, setPageLimit] = useState(false);

  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Driver[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id.toString(), item.driverName, item.mobileNumber]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase())),
    );
    setFilteredData(filtered);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm !== "") {
      // handleSearch();
    }
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Driver;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Driver) => {
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
      await apiClient.delete(`${DRIVER_API}/${id}`);
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

  const handleRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows(parseInt(e?.target.value, 10));
    setCurrentPage(1);
  };

  // Determine the data to display for the current page
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // for pagination buttons
  const totalPages = Math.ceil(data.length / rows);
  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Maximum visible page numbers
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key="ellipsis-start"
          className="btn bg-color-sea-green shadow me-2"
          disabled
          style={{ border: "1px solid #445E84" }}
        >
          ...
        </Button>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          className={`btn ${
            i === currentPage
              ? "bg-color-matte-light-blue text-dark"
              : "bg-color-sea-green shadow text-white"
          } me-2`}
          onClick={() => handlePageChange(i)}
          style={{
            border: "1px solid #445E84",
          }}
        >
          {i}
        </Button>,
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <Button
          key="ellipsis-end"
          className="btn bg-color-sea-green shadow me-2 text-white"
          disabled
          style={{ border: "1px solid #445E84" }}
        >
          ...
        </Button>,
      );
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <>
        {isLoading && <Loader />}
        <TableHeader
          heading="Drivers"
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          handleChange={handleChange}
          form={
            <div className="col-auto">
              <Form
                api={DRIVER_API}
                method="POST"
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          }
        />
      </>
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
                  name="driver name"
                  handleSort={() => handleSort("driverName")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="driver image"
                  handleSort={() => handleSort("driverImage")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="mobile number"
                  handleSort={() => handleSort("mobileNumber")}
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
                <TableHeading name="ACTIONS" textClassName="text-center" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={i} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.driverName}</TableData>
                  <TableData>
                    {d.driverImage && d.driverImage.length > 0 && (
                      // <img
                      //   className="img-fluid rounded-circle shadow-sm"
                      //   style={{
                      //     width: "70px",
                      //     height: "70px",
                      //     objectFit: "cover",
                      //     objectPosition: "center top",
                      //   }}
                      //   src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.driverImage}`}
                      //   alt="driverImage"
                      // />
                      <Avatar
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.driverImage}`}
                        width={70}
                        height={70}
                      />
                    )}
                  </TableData>
                  <TableData>{d.mobileNumber}</TableData>
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
                        <DeleteModal handleDelete={handleDelete} id={d.id} />
                      }
                      formNode={
                        <Form
                          api={DRIVER_API}
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

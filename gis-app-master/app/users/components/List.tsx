"use client";
import { DELETE_USER_API, REGISTER_USER_API } from "@/app/APIs";
import DeleteModal2 from "@/app/components/DeleteModal2";
import TableHeading from "@/app/components/Table/TableHeading";
import useAuthentication, {
  Authentication,
} from "@/app/hooks/useAuthentication";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { sort } from "fast-sort";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
// import GroupingForm from "./GroupingForm";
import Avatar from "@/app/components/Avatar";
import Loader from "@/app/components/Loader/Loader";
import Actions from "@/app/components/Table/Actions";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableWrapper from "@/app/components/Table/TableWrapper";
import useRoles from "@/app/hooks/useRoles";
import Link from "next/link";
import GroupingForm from "./GroupingForm";
import Image from "next/image";

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  id: number;
  name: string;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, isLoading } = useAuthentication({
    refresh,
  });
  console.log("data", data);
  const [isPageLimit, setPageLimit] = useState(false);
  const { data: roles } = useRoles({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Authentication[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.userName, item.fullName, item.designation, item.email]
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

  const handleDelete = async (userName: string) => {
    try {
      await apiClient.delete(`${DELETE_USER_API}?UserName=${userName}`);
      // remove the deleted item from the data array
      setData((prevData) =>
        prevData.filter((item) => item.userName !== userName),
      );
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
    key: keyof Authentication;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Authentication) => {
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

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Users"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={REGISTER_USER_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              roles={roles}
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
                  className="text-nowrap"
                  name="user name"
                  handleSort={() => handleSort("userName")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="full Name"
                  handleSort={() => handleSort("fullName")}
                />
                <TableHeading
                  name="picture"
                  handleSort={() => handleSort("picture")}
                />
                <TableHeading
                  name="designation"
                  handleSort={() => handleSort("designation")}
                />
                <TableHeading
                  name="email"
                  handleSort={() => handleSort("email")}
                />
                <TableHeading
                  name="phoneNumber"
                  handleSort={() => handleSort("phoneNumber")}
                />
                <TableHeading name="ROLE" />
                <TableHeading name="ACTIONS" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={i} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.userName}</TableData>
                  <TableData>{d.fullName}</TableData>
                  <TableData>
                    {d.picture && d.picture.length > 0 && (
                      <Link
                        href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                        target="_blank"
                      >
                        {/* <img
                        className="rounded-circle shadow-sm"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center top",
                          width: "70px",
                          height: "70px",
                        }}
                        // width={70}
                        // height={70}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                        alt="picture"
                      /> */}
                        <Image
                          className="rounded-circle shadow-sm"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center top",
                            width: "70px",
                            height: "70px",
                          }}
                          width={70}
                          height={70}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                          alt="picture"
                        />
                        {/* <Avatar
                          src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                          width={70}
                          height={70}
                        /> */}
                      </Link>
                    )}
                  </TableData>
                  <TableData>{d.designation}</TableData>
                  <TableData>{d.email}</TableData>
                  <TableData>{d.phoneNumber}</TableData>
                  <TableData className="text-center">
                    <GroupingForm
                      id={d.id}
                      options={roles}
                      userName={d.userName}
                    />
                  </TableData>
                  <TableData>
                    <Actions
                      deleteNode={
                        <DeleteModal2
                          handleDelete={handleDelete}
                          userName={d.userName}
                        />
                      }
                    />
                  </TableData>

                  {/* <TableData>
                  <Form
                    api={USER_API}
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

export default List;

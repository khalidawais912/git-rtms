"use client";
import { GET_USER_PROJECTS_API } from "@/app/APIs";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import TableWrapper from "@/app/components/Table/TableWrapper";
import useAuthentication from "@/app/hooks/useAuthentication";
import { Project } from "@/app/hooks/useProjects";
import useSectors from "@/app/hooks/useSectors";
import useSuperGroups from "@/app/hooks/useSuperGroups";
import AssignUserForm from "@/app/projects/components/AssignUserForm";
import StatusBadge from "@/app/projects/components/StatusBadge";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getName } from "@/app/utils";
import { sort } from "fast-sort";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GroupingForm from "./GroupingForm";

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

const UserProjectsList = ({ refresh }: ListProps) => {
  const { data: sectorsData } = useSectors({ refresh });
  const { data: superGroups } = useSuperGroups({ refresh });
  const { data: users } = useAuthentication({ refresh });
  const [data, setData] = useState<Project[]>([]); // Store the original data
  const [userOptions, setUserOptions] = useState<OptionType[]>(); // Store the original data
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isPageLimit, setPageLimit] = useState(false);

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
        .some((field) => field.includes(e.target.value.toLowerCase()))
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
  const [rows, setRows] = useState(15); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );

  const handleSubmit = async (id: number) => {
    try {
      const response = await apiClient.get(
        `${GET_USER_PROJECTS_API}?userId=${id}`
      );
      console.log("Response:", response);
      setData(response.data.data);
      setCurrentPage(1);
      setSelectedUserId(id);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  useEffect(() => {
    if (users) {
      const userOptions: OptionType[] = users.map((user) => {
        return {
          value: String(user.id),
          label: user.fullName,
        };
      });
      setUserOptions(userOptions);
    }
  }, [users]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <>
      <TableHeader
        heading="User Projects"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <>
            {/* <div className="col text-end mb-2">
                <SmdpSyncForm
                  api={SMDP_SYNC_API}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div> */}
            {/* <div className="col text-end mb-2">
                <SmdpAllProjectsSyncForm
                  api={SMDP_SYNC_API}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div> */}
            <div className="col-12 col-sm-8 col-md-5 col-lg-4 col-xl-3">
              <form>
                <div className="col text-start">
                  {userOptions && (
                    <CustomSelect
                      options={userOptions}
                      id="user"
                      placeholder="Select Engineer..."
                      closeMenuOnSelect={true}
                      value={
                        userOptions.find(
                          (opt) => opt.value === String(selectedUserId)
                        )
                          ? [
                              userOptions.find(
                                (opt) => opt.value === String(selectedUserId)
                              )!,
                            ]
                          : null
                      }
                      onChangeSingle={(nv) => {
                        if (nv) {
                          handleSubmit(Number(nv.value));
                        }
                      }}
                    />
                  )}
                  {/* <select
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
                    </select> */}
                </div>
              </form>
            </div>
          </>
        }
      />
      {data.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "calc(100vh - 200px)", overflow: "auto" }}
        >
          <div className="text-center">
            <Image
              src="/images/corrupted-file.png"
              alt="corrupted-file"
              width={130}
              height={130}
              style={{
                width: "130px",
                height: "130px",
                marginBottom: "20px",
              }}
            />
            <p className="m-0 fw-bold fs20px" style={{ color: "#475569" }}>
              Please Select Any Engineer to see Projects
            </p>
          </div>
        </div>
      ) : (
        <>
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
                      name="id"
                      handleSort={() => handleSort("id")}
                    />
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
                    {/* <th style={{ whiteSpace: "nowrap" }}>ASSIGN USER</th> */}
                    {/* <th style={{ whiteSpace: "nowrap" }}>SYNC ATTRIBUTES</th> */}
                    {/* <th style={{ whiteSpace: "nowrap" }}>SUPER GROUP</th> */}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((d, i) => (
                    <tr key={d.id} ref={i === 0 ? firstRowRef : null}>
                      <RowHeader>{d.id}</RowHeader>
                      <TableData>{d.gsNo}</TableData>
                      <TableData>{d.name}</TableData>
                      <TableData>{getName(d.sectorId, sectorsData)}</TableData>
                      <TableData className="text-nowrap">
                        {/* {d.status === "scheduled" || d.status === "Scheduled" ? (
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
                  &nbsp;{d.status} */}
                        <StatusBadge status={d.status} />
                      </TableData>
                      <TableData className="text-center">
                        <AssignUserForm id={d.id} options={users} />
                      </TableData>
                      {/* <td className="text-center">
                  <SyncModal handleSubmit={handleSync} id={d.smdpProjectID} />
                </TableData> */}
                      <TableData className="text-center">
                        <GroupingForm id={d.id} options={superGroups} />
                      </TableData>
                      {/* <TableData>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </TableData> */}
                      {/* <TableData>
                  <DownloadPDFBtn />
                </TableData> */}
                      {/* <TableData>
                  <ProjectForm
                    api={PROJECT_API}
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
      )}
    </>
  );
};

export default UserProjectsList;

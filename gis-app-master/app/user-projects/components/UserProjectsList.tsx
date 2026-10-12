"use client";
import { GET_USER_PROJECTS_API } from "@/shared/api/endpoints";
import CustomSelect, { OptionType } from "@/shared/components/Form/CustomSelect";
import Pagination from "@/shared/components/Table/Pagination";
import RowHeader from "@/shared/components/Table/RowHeader";
import TableData from "@/shared/components/Table/TableData";
import TableHeader from "@/shared/components/Table/TableHeader";
import TableHeading from "@/shared/components/Table/TableHeading";
import TableWrapper from "@/shared/components/Table/TableWrapper";
import { useAuthentication } from "@/features/users";
import { Project } from "@/app/hooks/useProjects";
import { useSectors } from "@/features/sectors";
import { useSuperGroups } from "@/features/super-group";
import AssignUserForm from "@/app/projects/components/AssignUserForm";
import StatusBadge from "@/app/projects/components/StatusBadge";
import apiClient, { AxiosError } from "@/shared/api/client";
import { getName } from "@/shared/utils";
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
                        <StatusBadge status={d.status} />
                      </TableData>
                      <TableData className="text-center">
                        <AssignUserForm id={d.id} options={users} />
                      </TableData>
                      <TableData className="text-center">
                        <GroupingForm id={d.id} options={superGroups} />
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
      )}
    </>
  );
};

export default UserProjectsList;

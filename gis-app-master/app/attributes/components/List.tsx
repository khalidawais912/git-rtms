"use client";
import {
  ATTRIBUTES_API,
  EVALUATION_ATTRIBUTES_API,
  GET_PROJECT_DETAIL_KEYS_API,
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
import apiClient, { AxiosError } from "@/app/services/api-client";
import { sort } from "fast-sort";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAttributes, { Attribute } from "../../hooks/useAttributes";
import Form from "./Form";

const List = ({ dashboardType }: { dashboardType?: string }) => {
  const [refresh, setRefresh] = useState(false);
  const [isPageLimit, setPageLimit] = useState(false);

  const { data, setData, setError, error, isLoading } = useAttributes({
    refresh,
  });

  const ATTRIBUTES_API_ENDPOINT = dashboardType
    ? EVALUATION_ATTRIBUTES_API
    : ATTRIBUTES_API;

  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Attribute[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = [...(data || [])].reverse().filter((item) =>
      [
        item.attributeId.toString(),
        item.label,
        item.attributeCode,
        item.attributeDataType,
        item.validationRegx,
        item.placeholder,
        item.attributeType,
        item.unit,
        item.errorMessage,
        item.verificationType,
        item.remarks,
        item.attributeCode,
        item.evaluationFormula,
      ]
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
    key: keyof Attribute;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Attribute) => {
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
  const paginatedData = (
    searchTerm ? filteredData : [...(data || [])].reverse()
  ).slice((currentPage - 1) * rows, currentPage * rows);

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${ATTRIBUTES_API_ENDPOINT}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.attributeId !== id));
      notifyCreate(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  const [projectDetailKeys, setProjectDetailKeys] = useState<string[]>([]);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(`${GET_PROJECT_DETAIL_KEYS_API}`);
        const data = response.data.data; // Assuming this returns an array of group objects
        setProjectDetailKeys(data);
        console.log("projectDetailKeys", projectDetailKeys);
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <>
      {/* {error && <p className="text-danger">{error}</p>} */}
      {isLoading && <Loader />}
      <TableHeader
        heading="Attributes"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={ATTRIBUTES_API_ENDPOINT}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              projectDetailKeys={projectDetailKeys}
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
                <TableHeading
                  name="attribute Id"
                  handleSort={() => handleSort("attributeId")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="sort Id"
                  handleSort={() => handleSort("sortId")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="attribute data type"
                  handleSort={() => handleSort("attributeDataType")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="multiselect"
                  handleSort={() => handleSort("multiselect")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="label"
                  handleSort={() => handleSort("label")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="validation regx"
                  handleSort={() => handleSort("validationRegx")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="attribute code"
                  handleSort={() => handleSort("attributeCode")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="min"
                  handleSort={() => handleSort("min")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="max"
                  handleSort={() => handleSort("max")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="required"
                  handleSort={() => handleSort("required")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="status"
                  handleSort={() => handleSort("status")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="hidden"
                  handleSort={() => handleSort("hidden")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="placeholder"
                  handleSort={() => handleSort("placeholder")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="attribute type"
                  handleSort={() => handleSort("attributeType")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="unit"
                  handleSort={() => handleSort("unit")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="error message"
                  handleSort={() => handleSort("errorMessage")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="verification type"
                  handleSort={() => handleSort("verificationType")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="evaluation formula"
                  handleSort={() => handleSort("evaluationFormula")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="weightage"
                  handleSort={() => handleSort("weightage")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="remarks"
                  handleSort={() => handleSort("remarks")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="removeable"
                  handleSort={() => handleSort("removeable")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="options"
                  handleSort={() => handleSort("options")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="Master"
                  handleSort={() => handleSort("isMaster")}
                  className="text-nowrap"
                />
                <TableHeading
                  name="priority"
                  handleSort={() => handleSort("priority")}
                  className="text-nowrap"
                />
                <TableHeading name="Actions" textClassName="text-center" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={i} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.attributeId}</RowHeader>
                  <TableData className="text-center">{d.sortId}</TableData>
                  <TableData className="text-center">
                    {d.attributeDataType}
                  </TableData>
                  <TableData className="text-center">{d.multiselect}</TableData>
                  <TableData>{d.label}</TableData>
                  <TableData>{d.validationRegx}</TableData>
                  <TableData>{d.attributeCode}</TableData>
                  <TableData className="text-center">{d.min}</TableData>
                  <TableData className="text-center">{d.max}</TableData>
                  <TableData className="text-center">{d.required}</TableData>
                  <TableData className="text-center">{d.status}</TableData>
                  <TableData className="text-center">{d.hidden}</TableData>
                  <TableData>{d.placeholder}</TableData>
                  <TableData>{d.attributeType}</TableData>
                  <TableData>{d.unit}</TableData>
                  <TableData>{d.errorMessage}</TableData>
                  <TableData>{d.verificationType}</TableData>
                  <TableData>{d.evaluationFormula}</TableData>
                  <TableData className="text-center">{d.weightage}</TableData>
                  <TableData>{d.remarks}</TableData>
                  <TableData className="text-center">{d.removeable}</TableData>
                  <TableData>
                    {d.options?.map((option: any, i) => (
                      <span key={i}>
                        {option.label}
                        ,&nbsp;
                      </span>
                    ))}
                  </TableData>
                  <TableData className="text-center">
                    {d.isMaster === 0 || d.isMaster === null ? "No" : "Yes"}
                  </TableData>
                  <TableData className="text-center">{d.priority}</TableData>
                  <TableData>
                    <Actions
                      deleteNode={
                        <DeleteModal
                          handleDelete={handleDelete}
                          id={d.attributeId}
                        />
                      }
                      formNode={
                        <Form
                          api={ATTRIBUTES_API_ENDPOINT}
                          method="PUT"
                          id={d.attributeId}
                          setRefresh={setRefresh}
                          refresh={refresh}
                          projectDetailKeys={projectDetailKeys}
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

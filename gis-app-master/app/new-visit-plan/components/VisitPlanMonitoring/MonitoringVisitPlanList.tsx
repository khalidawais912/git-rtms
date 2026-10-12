"use client";
import { EVALUATION_TEMP_TOUR_PLAN_API, TEMP_TOUR_PLAN_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomLabel from "@/app/components/Form/CustomLabel";
import CustomSelect, {
  defaultNegativeNumberOption,
  OptionType,
} from "@/app/components/Form/CustomSelect";
import Loader from "@/app/components/Loader/Loader";
import Spinner from "@/app/components/Spinner";
import TableHeading from "@/app/components/Table/TableHeading";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import useTempTourPlans, { TempTourPlan } from "@/app/hooks/useTempTourPlan";
import apiClient from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  deleteMessage,
  getFormattedDate,
} from "@/app/utils";
import { AxiosError } from "axios";
import { sort } from "fast-sort";
import { useState } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Form, { COUTempTourPlan, TempCopyForm } from "./Form";

interface CreateVisit {
  id: number;
  projectId: number;
  department_Id: number;
  assignedTo: number;
  status: number;
  latitude: string | null;
  longitude: string | null;
  vehicleID: number;
  districtID: number;
  mriValue: number | null;
  driverID: number;
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt: string;
  complete_at: string | null;
  submitted_at: string | null;
  issued_at: string | null;
  tracking_status: boolean;
  is_Contractor: number | null;
  is_ResidentEngineer: number | null;
  is_Tpv: number | null;
  visitPlanGroup: number;
  one_pager_status: string | null;
  cancel_reason: string | null;
  op_submitted_at: string | null;
  submitted_from: number | null;
  submitted_to: number | null;
}

interface Props {
  typeStatusOptions: OptionType[];
  districtOptions: OptionType[];
  driverOptions: OptionType[];
  tourOptions: OptionType[];
  userOptions: OptionType[];
  vehicleOptions: OptionType[];
  dashboardType?: string;
}

const MonitoringVisitPlanList = ({
  typeStatusOptions,
  districtOptions,
  driverOptions,
  tourOptions,
  userOptions,
  vehicleOptions,
  dashboardType,
}: Props) => {
  const [refresh, setRefresh] = useState(false);
  const [visitPlanGroup, setVisitPlanGroup] = useState<number>(-1);
  const { data, setData, isLoading } = useTempTourPlans({ refresh });
  const [copiedRowIndex, setCopiedRowIndex] = useState<number>(-1);

  const TEMP_TOUR_PLAN_API_ENDPOINT = dashboardType
    ? EVALUATION_TEMP_TOUR_PLAN_API
    : TEMP_TOUR_PLAN_API;

  const [isSubmitting, setSubmitting] = useState(false);
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // const [tempJsonDataCreateVisit, setTempJsonDataCreateVisit] =
  //   useState<CreateVisit[]>();
  // const [tempJsonDataTourPlan, setTempJsonDataTourPlan] =
  //   useState<COUTempTourPlan[]>();

  // State for filtered data
  const [filteredData, setFilteredData] = useState<TempTourPlan[]>([]);

  const [formsData, setFormsData] = useState<COUTempTourPlan[]>([]);
  const [copiedFormData, setCopiedFormData] = useState<
    TempCopyForm | undefined
  >();

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [
        item.gsNo.toString(),
        item.projectId.toString(),
        item.projectid.toString(),
        item.projectName,
        item.district,
        item.sectors,
        item.cost.toString(),
        item.type.toString(),
        item.userId.toString(),
        item.meOfficerName,
        item.section,
        item.driverName,
        item.vehicleNumber,
      ]
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
    key: keyof TempTourPlan;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof TempTourPlan) => {
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

  const saveFormsData = async (formsData: COUTempTourPlan[]) => {
    console.log("formsData before filter:", formsData);

    // ✅ Remove duplicates based on id
    const uniqueFormsData = Array.from(
      new Map(
        formsData
          .filter((form) => form !== undefined)
          .map((form) => [form.id, form]),
      ).values(),
    );

    console.log("uniqueFormsData:", uniqueFormsData);

    // ✅ Validate all required fields are present
    const validFormsData = uniqueFormsData.filter((form) => {
      return (
        form.projectid &&
        form.district_Id &&
        form.type !== undefined &&
        form.userId &&
        form.dateFrom &&
        form.dateTo &&
        form.driverId &&
        form.vehicalId
      );
    });

    if (validFormsData.length === 0) {
      toast.error(
        "No valid forms to save. Please complete all required fields.",
      );
      return;
    }

    if (validFormsData.length < uniqueFormsData.length) {
      toast.warning(
        `${
          uniqueFormsData.length - validFormsData.length
        } form(s) skipped due to missing required fields.`,
      );
    }

    try {
      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API_ENDPOINT}/create-or-update`,
        validFormsData,
      );
      console.log(response);
      toast.success(response.data.message);

      // ✅ Clear formsData after successful save
      setFormsData([]);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log(err);
      toast.error((err as AxiosError).message);
    }
  };

  const createVisit = async (formsData: COUTempTourPlan[]) => {
    if (visitPlanGroup === -1) {
      toast.error("Please select visit plan");
      return;
    }

    const filteredFormsData = formsData.filter((form) => form !== undefined);

    const modifiedFormData: CreateVisit[] = filteredFormsData.map((form) => ({
      id: 0,
      projectId: form.projectid,
      department_Id: form.department_id ?? 0,
      assignedTo: form.userId,
      status: 0,
      latitude: "",
      longitude: "",
      vehicleID: form.vehicalId,
      districtID: form.district_Id,
      mriValue: 0,
      driverID: form.driverId,

      // ✅ FIX: Convert YYYY-MM-DD to ISO string for API
      fromDate: form.dateFrom
        ? `${form.dateFrom}T00:00:00`
        : new Date().toISOString().split("Z")[0], // still safe

      toDate: form.dateTo
        ? `${form.dateTo}T00:00:00`
        : new Date().toISOString().split("Z")[0],

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      complete_at: null,
      submitted_at: null,
      issued_at: null,
      tracking_status: false,
      is_Contractor: null,
      is_ResidentEngineer: null,
      is_Tpv: null,
      visitPlanGroup,
      one_pager_status: null,
      cancel_reason: null,
      op_submitted_at: null,
      submitted_from: null,
      submitted_to: null,
    }));

    try {
      setSubmitting(true);
      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API_ENDPOINT}/create-visit`,
        modifiedFormData,
      );
      toast.success(response.data.responseMessage);
      setFormsData([]);
      setFilteredData([]);
      setRefresh((prev) => !prev);
      console.log("response create visit", response);
    } catch (err) {
      console.error("err", err);
      toast.error((err as AxiosError).message);
    } finally {
      setSubmitting(false);
    }
  };

  const exportToExcel = (data: TempTourPlan[]) => {
    // Prepare data for export
    console.log("data", data);

    // Map the modifiedFormData to the desired Excel column structure
    const dataForExcel = data.map((item, index) => {
      return {
        "Sr. No.": index + 1,
        "GS No.": item.gsNo,
        "Name of Scheme": item.projectName,
        District: item.district,
        Sectors: item.sectors,
        Cost: item.cost,
        "Scheme Type": typeStatusOptions.find(
          (type) => Number(type.value) === item.type,
        )?.label,
        "Evaluator Name": item.meOfficerName,
        Section: item.section,
        "Date From": new Date(item.dateFrom).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        "Date To": new Date(item.dateTo).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        "Driver Name": item.driverName,
        "Vehicle Number": item.vehicleNumber,
      };
    });

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visit Plans"); // Changed sheet name

    // Write the workbook to a file
    XLSX.writeFile(
      workbook,
      `Generated Visit Plans ${new Date().toLocaleDateString()}.xlsx`,
    ); // Changed filename
  };

  const handleDelete = async (tempId: number) => {
    try {
      await apiClient.delete(`${TEMP_TOUR_PLAN_API}/${tempId}`);
      // remove the deleted item from the data array
      setRefresh((prev) => !prev);
      setFormsData((prevData) =>
        prevData.filter((item) => item !== undefined && item.id !== tempId),
      );
      toast.success(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <div className="py-2">
      {isLoading && <Loader />}
      {/* <TableHeader
        heading="M&E Visit Plan for the month of May-2025"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={DEPARTMENT_API + "/CreateDepartmentWithRights"}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        }
      /> */}
      <div className="row m-0">
        <div className="col"></div>
        <div className="col">
          <h4 className="fw-bold mb-3 text-center">Monitoring Visit Plan</h4>
          {/* <p className="fw-bold">temp tour plan</p>
          <pre>
            {tempJsonDataTourPlan
              ? JSON.stringify(tempJsonDataTourPlan, null, 2)
              : ""}
          </pre>
          <p className="fw-bold">create visit plan</p>
          <pre>
            {tempJsonDataCreateVisit
              ? JSON.stringify(tempJsonDataCreateVisit, null, 2)
              : ""}
          </pre> */}
        </div>
        <div className="col text-end">
          {formsData.filter((form) => form !== undefined).length > 0 && (
            <Button
              className="btn bg-color-evaluation-theme-blue rounded-pill text-white fs15px fw-bold"
              disabled={isSubmitting}
              onClick={() => createVisit(formsData)}
            >
              Create Visit {isSubmitting && <Spinner color="text-light" />}
            </Button>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-10 col-md-6 col-lg-8 col-xl-5 mb-3">
          <CustomLabel htmlFor="tours">Visit Plan</CustomLabel>
          <CustomSelect
            options={[defaultNegativeNumberOption, ...tourOptions]}
            id="tours"
            closeMenuOnSelect={true}
            onChangeSingle={(
              newValue: SingleValue<{ value: string; label: string }>,
            ) => {
              if (newValue) {
                setVisitPlanGroup(Number(newValue.value));
              }
            }}
          />
          {!visitPlanGroup ||
            (visitPlanGroup === -1 && (
              <p className="text-danger mt-1 fs14px">Please Add Visit Plan!</p>
            ))}
        </div>
        {data && data.length > 0 && (
          <div className="col text-end align-self-end mb-3">
            <DownloadDropDown onClickExcel={() => exportToExcel(data)} />
          </div>
        )}
      </div>
      {/* <div className="col-4">
        <select
          className="form-select form-select-sm color-light-dark"
          id="visitPlans"
        >
          <option value="">Select</option>
        </select>
        
      </div> */}

      <div className="table-responsive mb-2" style={{ margin: "0 -12px" }}>
        <div
          style={{
            height: `calc(100vh - ${
              formsData.filter((form) => form !== undefined).length === 0
                ? "395px"
                : "355px"
            })`,
            overflow: "auto",
          }}
        >
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <TableHeading name="Sr. No." className="text-nowrap" />
                <TableHeading name="Project ID" className="text-nowrap" />
                <TableHeading name="GS No" className="text-nowrap" />
                <TableHeading name="Name of Scheme" className="text-nowrap" />
                <TableHeading name="District" />
                <TableHeading name="Sectors" />
                <TableHeading name="Cost" />
                <TableHeading name="Type" />
                <TableHeading name="M&E Officer Name" className="text-nowrap" />
                <TableHeading name="Section" />
                <TableHeading name="Date From" className="text-nowrap" />
                <TableHeading name="Date To" className="text-nowrap" />
                <TableHeading name="Driver Name" className="text-nowrap" />
                <TableHeading name="Vehicle Number" className="text-nowrap" />
                <TableHeading
                  name="Actions"
                  colSpan={4}
                  className="text-center"
                />
              </tr>
            </thead>

            <tbody>
              {data?.map((d, i) => (
                <Form
                  copiedRowIndex={copiedRowIndex}
                  setCopiedRowIndex={setCopiedRowIndex}
                  key={d.tempId}
                  planData={d}
                  index={i + 1}
                  userOptions={userOptions}
                  driverOptions={driverOptions}
                  vehicleOptions={vehicleOptions}
                  districtOptions={districtOptions}
                  typeStatusOptions={typeStatusOptions}
                  formsData={formsData}
                  setFormsData={setFormsData}
                  handleDelete={() => handleDelete(d.tempId)}
                  setCopiedFormData={setCopiedFormData}
                  copiedFormData={copiedFormData}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {formsData.filter((form) => form !== undefined).length > 0 ? (
        <div className="col text-end">
          <Button
            onClick={() => saveFormsData(formsData)}
            className="btn bg-color-sea-blue text-white fs12px fw-6 me-2"
          >
            Approval
          </Button>
          <Button
            onClick={() => saveFormsData(formsData)}
            className="btn bg-color-sea-blue text-white fs12px fw-6"
          >
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          <IoMdInformationCircle /> Please go to Projects page to add Visit
          Plans!
        </div>
      )}
    </div>
  );
};

export default MonitoringVisitPlanList;

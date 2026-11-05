"use client";
import { EVALUATION_TEMP_TOUR_PLAN_API, TEMP_TOUR_PLAN_API } from "@/services/endpoints";
import Button from "@/components/Button";
import CustomLabel from "@/components/Form/CustomLabel";
import CustomSelect from "@/components/Form/CustomSelect";
import { OptionType } from "@/components/types";
import Loader from "@/components/Loader/Loader";
import Spinner from "@/components/Spinner";
import TableHeading from "@/components/Table/TableHeading";
import DownloadDropDown from "@/components/DownloadDropDown/DownloadDropDown";
import { useAuthentication } from "@/features/users";
import { useDistrict } from "@/features/districts";
import { useDriver } from "@/features/drivers";
import { useTempTourPlans, TempTourPlan, useTourPlans } from "@/features/tour-plans";
import { useVehicle } from "@/features/vehicles";
import apiClient from "@/services/client";
import {
  deleteMessage,
} from "@/utils";
import { AxiosError } from "axios";
import { useState } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Form, { COUTempTourPlan, typeStatues } from "./Form";
import { TempCopyForm, CreateVisit } from "../../types";
const EvaluationVisitPlanList = ({
  dashboardType,
}: {
  dashboardType?: string;
}) => {
  const [refresh, setRefresh] = useState(false);
  const [visitPlanGroup, setVisitPlanGroup] = useState<number>(-1);
  const { data, isLoading } = useTempTourPlans({ refresh });
  const { data: users } = useAuthentication();
  const { data: drivers } = useDriver();
  const { data: vehicles } = useVehicle();
  const { data: districts } = useDistrict();
  const { data: tours } = useTourPlans();
  const [copiedRowIndex, setCopiedRowIndex] = useState<number>(-1);

  const TEMP_TOUR_PLAN_API_ENDPOINT = dashboardType
    ? EVALUATION_TEMP_TOUR_PLAN_API
    : TEMP_TOUR_PLAN_API;

  const [isSubmitting, setSubmitting] = useState(false);
  // State for search input

  // State for filtered data
  const [, setFilteredData] = useState<TempTourPlan[]>([]);

  const [formsData, setFormsData] = useState<COUTempTourPlan[]>([]);
  const [copiedFormData, setCopiedFormData] = useState<
    TempCopyForm | undefined
  >();

  // Handle search logic

  // Update searchTerm and clear search if empty

  // for sorting


  // for selecting rows per page
   // Default to 11 rows per page
   // Track the current page

  // Paginate data to display only the current page's rows

  const saveFormsData = async (formsData: COUTempTourPlan[]) => {
    const filteredFormsData = formsData.filter((form) => form !== undefined);
    try {
      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API_ENDPOINT}/create-or-update`,
        filteredFormsData,
      );

      toast.success(response.data.message);

      // If backend returns updated records with real IDs, replace state
      if (response.data.data) {
        setFormsData(response.data.data); // or reset([...response.data.data])
      }

      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("err", err);
      toast.error((err as AxiosError)?.response?.data as string);
    }
  };

  const createVisit = async (formsData: COUTempTourPlan[]) => {
    if (!visitPlanGroup || visitPlanGroup === -1) {
      toast.error("Please select visit plan");
      return;
    }
    const filteredFormsData = formsData.filter((form) => form !== undefined);

    const modifiedFormData: CreateVisit[] = filteredFormsData.map((form) => ({
      id: 0,
      projectId: form.projectid,
      department_Id: form.department_id ?? 0,
      assignedTo: form.userId,
      status: 0, // or whatever logic you need
      latitude: "", // default or calculate if needed
      longitude: "", // default or calculate if needed
      vehicleID: form.vehicalId,
      districtID: form.district_Id,
      eriValue: 0, // provide default or calculate
      driverID: form.driverId,
      fromDate: form.dateFrom,
      toDate: form.dateTo,
      createdAt: new Date().toISOString(), // or another appropriate value
      updatedAt: new Date().toISOString(), // or another appropriate value
      complete_at: null,
      submitted_at: null,
      issued_at: null,
      tracking_status: false,
      isFocalPerson: false,
      visitPlanGroup,
      cancel_reason: null,
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
      setRefresh((prev) => !prev);
    } catch (err) {
      setSubmitting(false);
      console.error(err);
      toast.error((err as AxiosError).message);
    } finally {
      setSubmitting(false); // Always run after try/catch
    }
    setFormsData([]);
    setFilteredData([]);
  };

  const defaultNumberOption = { value: "-1", label: "Select" };

  const tourNames: OptionType[] = tours.map((tour) => {
    return {
      value: String(tour.id),
      label: tour.name,
    };
  });

  const exportToExcel = (data: TempTourPlan[]) => {
    // Prepare data for export

    // Map the modifiedFormData to the desired Excel column structure
    const dataForExcel = data.map((item, index) => {
      return {
        "Sr. No.": index + 1,
        "GS No.": item.gsNo,
        "Name of Scheme": item.projectName,
        District: item.district,
        Sectors: item.sectors,
        Cost: item.cost,
        "Scheme Type": typeStatues.find(
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
    } catch (err) {
      console.error("failed to delete item", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <div className="py-2">
      {isLoading && <Loader />}
      <div className="row m-0">
        <div className="col"></div>
        <div className="col">
          <h4 className="fw-bold mb-3 text-center">Evalution Visit Plan</h4>
        </div>
        <div className="col text-end">
          {formsData.filter((form) => form !== undefined).length > 0 && (
            <Button
              className="btn rounded-pill bg-color-evaluation-theme-blue text-white fs15px fw-bold"
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
            options={[defaultNumberOption, ...tourNames]}
            id="tours"
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
                <TableHeading name="Is Focal Person" className="text-nowrap" />
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
                  users={users}
                  drivers={drivers}
                  vehicles={vehicles}
                  districts={districts}
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

export default EvaluationVisitPlanList;

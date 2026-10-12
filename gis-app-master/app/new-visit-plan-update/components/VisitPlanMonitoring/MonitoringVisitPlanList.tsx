"use client";

import { EVALUATION_TEMP_TOUR_PLAN_API, TEMP_TOUR_PLAN_API } from "@/app/APIs";
import { OptionType } from "@/app/components/Form/CustomSelect";
import Loader from "@/app/components/Loader/Loader";
import TableHeading from "@/app/components/Table/TableHeading";
import useAuthentication from "@/app/hooks/useAuthentication";
import useDistrict from "@/app/hooks/useDistrict";
import useDriver from "@/app/hooks/useDriver";
import useTempTourPlans from "@/app/hooks/useTempTourPlan";
import useTourPlans from "@/app/hooks/useTourPlans";
import useVehicle from "@/app/hooks/useVehicle";
import apiClient from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Form from "./Form";

export const tempTourPlanSchema = z.object({
  id: z.number().optional().default(0),
  department_id: z.number().optional().default(0),
  projectid: z
    .number({ invalid_type_error: "Please add project Id!" })
    .min(1, "Please add project Id!"),
  district_Id: z
    .number({ invalid_type_error: "Please add district!" })
    .min(1, "Please add district!"),
  type: z.number({ invalid_type_error: "Please add type!" }).default(0),
  userId: z
    .number({ invalid_type_error: "Please add user!" })
    .min(1, "Please add user!"),
  section: z.string().nullable().optional(),
  dateFrom: z
    .string({ required_error: "Please select a start date!" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date!",
    }),
  dateTo: z
    .string({ required_error: "Please select an end date!" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date!",
    }),
  driverId: z
    .number({ invalid_type_error: "Please add driver!" })
    .min(1, "Please add driver!"),
  vehicalId: z
    .number({ invalid_type_error: "Please add vehicle!" })
    .min(1, "Please add vehicle!"),
  isFocalPerson: z.boolean().default(true),
  gsNo: z.string().optional(),
  projectName: z.string().optional(),
  sectors: z.string().optional(),
  cost: z.number().optional(),
  tempId: z.number().default(0),
});

export const tempTourPlansSchema = z.object({
  formsData: z.array(tempTourPlanSchema),
});

export type TempTourFormValues = z.infer<typeof tempTourPlansSchema>;

const MonitoringVisitPlanList = ({
  dashboardType,
}: {
  dashboardType?: string;
}) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TempTourFormValues>({
    resolver: zodResolver(tempTourPlansSchema),
  });

  console.log("errors", errors);
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "formsData",
  });

  const { data, setData, isLoading } = useTempTourPlans();
  const { data: users } = useAuthentication();
  const { data: drivers } = useDriver();
  const { data: vehicles } = useVehicle();
  const { data: districts } = useDistrict();
  const { data: tours } = useTourPlans();

  const TEMP_TOUR_PLAN_API_ENDPOINT = dashboardType
    ? EVALUATION_TEMP_TOUR_PLAN_API
    : TEMP_TOUR_PLAN_API;

  const onSubmit = async (values: TempTourFormValues) => {
    try {
      // ✅ Only send editable fields to the API
      const payload = values.formsData.map((form) => ({
        id: form.id ?? 0,
        department_id: form.department_id ?? 0,
        projectid: form.projectid ?? 0,
        district_Id: form.district_Id ?? 0,
        type: 0,
        userId: form.userId ?? 0,
        section: form.section ?? "",
        dateFrom: form.dateFrom,
        dateTo: form.dateTo,
        driverId: form.driverId ?? 0,
        vehicalId: form.vehicalId ?? 0,
        isFocalPerson: true,
      }));

      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API_ENDPOINT}/create-or-update`,
        payload,
      );
      toast.success(response.data?.message || "Saved successfully!");

      // ✅ Refresh after save
      // setData((prev) => [...prev]); // if useData supports refetch trigger
    } catch (err) {
      const error = err as AxiosError<{ message?: string; errors?: string[] }>;
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Something went wrong!";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const sanitizedData = data.map((item) => ({
        ...item,
        // ensure boolean and number defaults
        isFocalPerson: item.isFocalPerson ?? true,
        type: item.type ?? 0,
      }));

      reset({ formsData: sanitizedData });
      console.log("data", data);
      console.log("sanitizedData", sanitizedData);
    }
  }, [data, reset]);

  const districtOptions: OptionType[] = districts.map((district) => {
    return {
      value: district.id.toString(),
      label: district.districtName,
    };
  });

  const userOptions: OptionType[] = users.map((user) => {
    return {
      value: user.id.toString(),
      label: user.fullName,
    };
  });

  const driverOptions: OptionType[] = drivers.map((driver) => {
    return {
      value: driver.id.toString(),
      label: driver.driverName,
    };
  });

  const vehicleOptions: OptionType[] = vehicles.map((vehicle) => {
    return {
      value: vehicle.id.toString(),
      label: vehicle.vehicleNumber,
    };
  });

  const typeOptions: OptionType[] = [
    { value: "0", label: "Monitoring" },
    { value: "1", label: "Evaluation" },
    { value: "2", label: "MonitoringAndCMInitiative" },
  ];

  const handleDelete = async (tempId: number, index: number) => {
    try {
      // Only call API if this record exists in backend (id > 0)
      const response = await apiClient.delete(
        `${TEMP_TOUR_PLAN_API}/${tempId}`,
      );
      // toast.success("Item deleted successfully!");
      // Remove row from field array
      console.log("delete response", response);
      remove(index);
    } catch (err) {
      console.error("Failed to delete item", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <div className="py-2">
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="table-responsive mb-2" style={{ margin: "0 -12px" }}>
          <div
            style={{
              height: `calc(100vh - ${
                fields.length === 0 ? "395px" : "355px"
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
                  <TableHeading
                    name="M&E Officer Name"
                    className="text-nowrap"
                  />
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

              {userOptions &&
                driverOptions &&
                vehicleOptions &&
                districtOptions &&
                typeOptions &&
                errors && (
                  <tbody>
                    {fields.map((field, index) => (
                      <Form
                        key={index}
                        index={index + 1}
                        control={control}
                        field={field}
                        userOptions={userOptions}
                        driverOptions={driverOptions}
                        vehicleOptions={vehicleOptions}
                        districtOptions={districtOptions}
                        typeOptions={typeOptions}
                        errors={errors}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                )}
            </table>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() =>
              append({
                id: 0,
                department_id: 0,
                projectid: 0,
                district_Id: 0,
                type: 0,
                userId: 0,
                section: "",
                dateFrom: new Date().toISOString(),
                dateTo: new Date().toISOString(),
                driverId: 0,
                vehicalId: 0,
                isFocalPerson: true,
                tempId: 0,
              })
            }
          >
            + Add Row
          </button>

          <button type="submit" className="btn btn-success">
            Save All
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonitoringVisitPlanList;

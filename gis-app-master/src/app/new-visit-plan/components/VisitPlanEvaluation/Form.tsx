import { TEMP_TOUR_PLAN_API } from "@/services/endpoints";
import Button from "@/components/Button";
import DeleteModal from "@/components/DeleteModal";
import CustomCalendar from "@/components/Form/CustomCalender";
import CustomSelect from "@/components/Form/CustomSelect";
import { OptionType } from "@/components/types";
import TableData from "@/components/Table/TableData";
import { TempTourPlan } from "@/features/tour-plans";
import apiClient, { AxiosError } from "@/services/client";
import {
  isoToLocalDateString,
  isValidDate,
  toLocalDateString,
} from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaPaste } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import { z } from "zod";
import { TempCopyForm } from "../../types";
const schema = z.object({
  id: z.number().optional().default(0),
  department_id: z.number().optional().default(0),
  projectid: z.number({ invalid_type_error: "Please add project Id!" }),
  district_Id: z.number({ invalid_type_error: "Please add district!" }),
  type: z.number({ invalid_type_error: "Please add type!" }),
  userId: z.number({ invalid_type_error: "Please add user!" }),
  section: z.string().nullable().optional(),
  dateFrom: z.string().optional().default(new Date().toISOString()),
  dateTo: z.string().optional().default(new Date().toISOString()),
  driverId: z.number({ invalid_type_error: "Please add driver!" }),
  vehicalId: z.number({ invalid_type_error: "Please add vehicle!" }),
  isFocalPerson: z.boolean().default(false),
});

export type COUTempTourPlan = z.infer<typeof schema>; //create or update temp tour plan

interface Props {
  planData: TempTourPlan;
  index: number;
  formsData: COUTempTourPlan[];
  setFormsData: Dispatch<SetStateAction<COUTempTourPlan[]>>;
  handleDelete: (id: number) => void;
  setCopiedFormData: Dispatch<SetStateAction<TempCopyForm | undefined>>;
  copiedFormData: TempCopyForm | undefined;
  setCopiedRowIndex: Dispatch<SetStateAction<number>>;
  copiedRowIndex: number;
  userOptions: OptionType[];
  driverOptions: OptionType[];
  vehicleOptions: OptionType[];
  districtOptions: OptionType[];
  typeStatusOptions: OptionType[];
}

const focalPersonOptions: OptionType[] = [
  { label: "No", value: "0" },
  { label: "Yes", value: "1" },
];

const Form = ({
  planData,
  index,
  setFormsData,
  handleDelete,
  setCopiedFormData,
  copiedFormData,
  setCopiedRowIndex,
  copiedRowIndex,
  userOptions,
  driverOptions,
  vehicleOptions,
  districtOptions,
  typeStatusOptions,
}: Props) => {
  const {
    trigger,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<COUTempTourPlan>({ resolver: zodResolver(schema) });
  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const [isDriverVerified, setDriverVerified] = useState(false);
  const [isVehicleVerified, setVehicleVerified] = useState(false);

  useEffect(() => {
    const subscription = watch((value) => {
      setFormsData((prev) => {
        const updated = prev.filter((item) => item?.id !== value.id);
        return [
          ...updated,
          {
            ...value,
            id: value.id !== undefined ? Number(value.id) : 0,
            type: value.type !== undefined ? Number(value.type) : 0,
            section: value.section !== undefined ? value.section : "",

            // ✅ FIX: Handle dates without timezone conversion
            dateFrom: value.dateFrom ? toLocalDateString(value.dateFrom) : "",
            dateTo: value.dateTo ? toLocalDateString(value.dateTo) : "",

            driverId: value.driverId !== undefined ? value.driverId : 0,
            vehicalId:
              value.vehicalId !== undefined ? Number(value.vehicalId) : 0,
            department_id:
              value.department_id !== undefined
                ? Number(value.department_id)
                : 0,
            district_Id:
              value.district_Id !== undefined ? Number(value.district_Id) : 0,
            projectid:
              value.projectid !== undefined ? Number(value.projectid) : 0,
            userId: value.userId !== undefined ? Number(value.userId) : 0,
            isFocalPerson:
              value.isFocalPerson !== undefined ? value.isFocalPerson : false,
          },
        ];
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, index, setFormsData]);

  useEffect(() => {
    if (planData) {
      setValue("id", planData.tempId);
      setValue("department_id", planData.departmentId);
      setValue("projectid", planData.projectId);
      setValue("type", planData.type);
      setValue("userId", planData.userId);
      setValue("section", planData.section ? planData.section : "");

      // ✅ FIX: Convert ISO strings to local date strings
      setValue("dateFrom", isoToLocalDateString(planData.dateFrom));
      setValue("dateTo", isoToLocalDateString(planData.dateTo));

      setValue("driverId", planData.driverId);
      setValue("vehicalId", planData.vehicleId);
      setValue("district_Id", planData.districtId);
      setValue("isFocalPerson", planData.isFocalPerson);
    }
  }, [planData, setValue]);

  const verfiyForm = async () => {
    const isValid = await trigger();

    if (isValid) {

      notifyCreate("Form is verified ✅");
    } else {
      notifyError("Form contains errors ❌");
    }
  };

  const checkDriver = async (
    driverId: number,
    dateFrom: string,
    dateTo: string,
  ) => {
    if (!driverId || isNaN(driverId) || driverId <= 0) {
      toast.info("Please select a valid driver");
      return;
    } else if (!isValidDate(dateFrom)) {
      toast.info("Please Select dateFrom");
      return;
    } else if (!isValidDate(dateTo)) {
      toast.info("Please Select dateTo");
      return;
    } else {
      try {
        const response = await apiClient(
          `${TEMP_TOUR_PLAN_API}/check-driver??driverId=${driverId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        );

        if (response.data.available) {
          setDriverVerified(true);
          notifyCreate(response.data.message);
        } else {
          setDriverVerified(false);
          notifyError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        notifyError((err as AxiosError).message);
      }
    }
  };

  const checkVehicle = async (
    vehicleId: number,
    dateFrom: string,
    dateTo: string,
  ) => {
    if (!vehicleId) {
      toast.info("Please Select Vehicle");
    } else if (!isValidDate(dateFrom)) {
      toast.info("Please Select dateFrom");
      return;
    } else if (!isValidDate(dateTo)) {
      toast.info("Please Select dateTo");
      return;
    } else {
      try {
        const response = await apiClient(
          `${TEMP_TOUR_PLAN_API}/check-vehical?vehicalId=${vehicleId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        );

        if (response.data.available) {
          setVehicleVerified(true);
          toast.success(response.data.message);
        } else {
          setVehicleVerified(false);
          toast.error(response.data.message);
        }
      } catch (err) {
        console.error(err);
        notifyError((err as AxiosError).message);
      }
    }
  };

  const copyFormData = () => {
    if (copiedFormData) {
      setCopiedFormData(undefined);
      setCopiedRowIndex(-1);
    } else {
      toast.info("Copied");
      setCopiedRowIndex(index);
      const values = getValues();

      // ✅ FIX: Store dates as local date strings
      setCopiedFormData({
        district_Id: values.district_Id,
        type: values.type,
        userId: values.userId,
        dateFrom: toLocalDateString(values.dateFrom),
        dateTo: toLocalDateString(values.dateTo),
        driverId: values.driverId,
        vehicalId: values.vehicalId,
      });
    }
  };

  const pasteFormData = (copiedFormData: TempCopyForm) => {
    if (copiedFormData) {
      setValue("type", copiedFormData.type);
      setValue("userId", copiedFormData.userId);

      // ✅ FIX: Use dates directly (already in YYYY-MM-DD format)
      setValue("dateFrom", copiedFormData.dateFrom);
      setValue("dateTo", copiedFormData.dateTo);

      setValue("driverId", copiedFormData.driverId);
      setValue("vehicalId", copiedFormData.vehicalId);
      setValue("district_Id", copiedFormData.district_Id);

      toast.success("Data pasted successfully");
    }
  };

  return (
    <tr>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
      >
        {index}
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
      >
        {planData.projectId}
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
      >
        {planData.gsNo}
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        {planData.projectName}
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="district_Id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                options={districtOptions} // must be in format { value, label }
                closeMenuOnSelect={true}
                placeholder="Select"
                // Convert between react-select and raw value
                value={
                  districtOptions.find(
                    (opt) =>
                      opt.value ===
                      (field.value != null ? field.value.toString() : ""),
                  )
                    ? [
                        districtOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : ""),
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null,
                  );
                }}
              />
            )}
          />
          {errors.district_Id && (
            <p className="text-danger mt-1 fs14px">
              {errors.district_Id.message}
            </p>
          )}
        </div>
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
      >
        {planData.sectors}
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
      >
        {planData.cost}
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                options={typeStatusOptions} // must be in format { value, label }
                closeMenuOnSelect={true}
                placeholder="Select"
                isDisabled={true}
                // Convert between react-select and raw value
                value={
                  typeStatusOptions.find(
                    (opt) =>
                      opt.value ===
                      (field.value != null ? field.value.toString() : ""),
                  )
                    ? [
                        typeStatusOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : ""),
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null,
                  );
                }}
              />
            )}
          />
          {errors.type && (
            <p className="text-danger mt-1 fs14px">{errors.type.message}</p>
          )}
        </div>
      </TableData>
      <TableData
        className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "240px" }}
      >
        <div className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                options={userOptions} // must be in format { value, label }
                closeMenuOnSelect={true}
                placeholder="Select"
                // Convert between react-select and raw value
                value={
                  userOptions.find(
                    (opt) =>
                      opt.value ===
                      (field.value != null ? field.value.toString() : ""),
                  )
                    ? [
                        userOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : ""),
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null,
                  );
                }}
              />
            )}
          />
          {errors.userId && (
            <p className="text-danger mt-1 fs14px">{errors.userId.message}</p>
          )}
        </div>
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
      >
        {planData.section}
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="dateFrom"
            control={control}
            render={({ field }) => (
              <CustomCalendar
                {...field}
                value={field.value}
                onChange={(date) => {
                  // ✅ FIX: Store as local date string, not ISO
                  const localDateString = toLocalDateString(date);
                  field.onChange(localDateString);
                }}
              />
            )}
          />

          {errors.dateFrom && (
            <p className="text-danger mt-1 fs14px">{errors.dateFrom.message}</p>
          )}
        </div>
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <CustomCalendar
                {...field}
                value={field.value ?? null}
                onChange={(date) => {
                  // ✅ FIX: Store as local date string, not ISO
                  const localDateString = toLocalDateString(date);
                  field.onChange(localDateString);
                }}
              />
            )}
          />
          {errors.dateTo && (
            <p className="text-danger mt-1 fs14px">{errors.dateTo.message}</p>
          )}
        </div>
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="driverId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                closeMenuOnSelect={true}
                options={driverOptions} // must be in format { value, label }
                placeholder="Select"
                // Convert between react-select and raw value
                value={
                  driverOptions.find(
                    (opt) =>
                      opt.value ===
                      (field.value != null ? field.value.toString() : ""),
                  )
                    ? [
                        driverOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : ""),
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null,
                  );
                  if (selectedOption) {
                    const driverId = Number(selectedOption.value);
                    const { dateFrom, dateTo } = getValues();
                    checkDriver(driverId, dateFrom, dateTo);
                  }
                }}
              />
            )}
          />
          {errors.driverId && (
            <p className="text-danger mt-1 fs14px">{errors.driverId.message}</p>
          )}
        </div>
      </TableData>
      <TableData
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="vehicalId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                closeMenuOnSelect={true}
                options={vehicleOptions} // must be in format { value, label }
                placeholder="Select"
                // Convert between react-select and raw value
                value={
                  vehicleOptions.find(
                    (opt) =>
                      opt.value ===
                      (field.value != null ? field.value.toString() : ""),
                  )
                    ? [
                        vehicleOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : ""),
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null,
                  );
                  if (selectedOption) {
                    const vehicleId = Number(selectedOption.value);
                    const { dateFrom, dateTo } = getValues();
                    checkVehicle(Number(vehicleId), dateFrom, dateTo);
                  }
                }}
              />
            )}
          />
          {errors.driverId && (
            <p className="text-danger mt-1 fs14px">{errors.driverId.message}</p>
          )}
        </div>
      </TableData>
      <TableData>
        <Controller
          name="isFocalPerson"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              defaultValue={focalPersonOptions[0]}
              options={focalPersonOptions} // must be in format { value, label }
              placeholder="Select"
              closeMenuOnSelect={true}
              // Convert between react-select and raw value
              value={focalPersonOptions.find(
                (opt) =>
                  opt.value ===
                  (field.value !== undefined ? (field.value ? "1" : "0") : "0"),
              )}
              onChangeSingle={(selectedOption) => {
                // convert "0"/"1" to boolean
                const boolValue = selectedOption
                  ? Number(selectedOption.value) === 1
                  : false;
                field.onChange(boolValue);
              }}
            />
          )}
        />

      </TableData>

      <TableData>
        <Button
          className="btn btn-sm bg-color-sea-green text-white "
          disabled={!isVehicleVerified || !isDriverVerified}
          onClick={verfiyForm}
        >
          Verify
        </Button>
      </TableData>
      <TableData>
        <DeleteModal
          handleDelete={() => handleDelete(planData.tempId)}
          id={index}
        />
      </TableData>
      <TableData>
        <Button
          onClick={copyFormData}
          className={`btn rounded-circle ${
            index === copiedRowIndex && "text-success"
          }`}
        >
          <MdContentCopy />
        </Button>
      </TableData>
      <TableData>
        {copiedFormData ? (
          <Button
            onClick={() => pasteFormData(copiedFormData)}
            className="btn rounded-circle"
          >
            <FaPaste />
          </Button>
        ) : (
          <Button className="btn rounded-circle" disabled>
            <FaPaste />
          </Button>
        )}
      </TableData>
    </tr>
  );
};

export default Form;

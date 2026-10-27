import CustomCalendar from "@/components/Form/CustomCalender";
import CustomSelect from "@/components/Form/CustomSelect";
import { OptionType } from "@/components/types";
import TableData from "@/components/Table/TableData";
import { toLocalDateString } from "@/utils";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TempTourFormValues } from "./MonitoringVisitPlanList";

interface FormProps {
  index: number;
  field: TempTourFormValues["formsData"][number];
  control: Control<TempTourFormValues>;
  userOptions: OptionType[];
  driverOptions: OptionType[];
  vehicleOptions: OptionType[];
  districtOptions: OptionType[];
  typeOptions: OptionType[];
  errors: FieldErrors<TempTourFormValues>;
  handleDelete: (tempId: number, index: number) => void;
}

const Form = ({
  index,
  field,
  control,
  userOptions,
  driverOptions,
  vehicleOptions,
  districtOptions,
  typeOptions,
  errors,
  handleDelete,
}: FormProps) => {
  return (
    <tr>
      <TableData>{index}</TableData>
      <TableData>{field.projectid}</TableData>
      <TableData>{field.gsNo}</TableData>
      <TableData style={{ minWidth: "220px" }}>{field.projectName}</TableData>
      <TableData style={{ minWidth: "220px" }}>
        <div className={`col`}>
          <Controller
            control={control}
            name={`formsData.${index}.district_Id`}
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
                      (field.value != null ? field.value.toString() : "")
                  )
                    ? [
                        districtOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : "")
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                }}
              />
            )}
          />
          {errors.formsData?.[index]?.district_Id && (
            <p className="text-danger mt-1 fs14px">
              {errors.formsData[index].district_Id?.message}
            </p>
          )}
        </div>
      </TableData>
      <TableData>{field.sectors}</TableData>
      <TableData>{field.cost}</TableData>
      <TableData style={{ minWidth: "220px" }}>
        <div
          className={`col `}
        >
          <Controller
            control={control}
            name={`formsData.${index}.type`}
            render={({ field }) => (
              <CustomSelect
                {...field}
                defaultValue={typeOptions[0]}
                options={typeOptions} // must be in format { value, label }
                closeMenuOnSelect={true}
                placeholder="Select"
                isDisabled={true}
                // Convert between react-select and raw value
                value={
                  typeOptions.find(
                    (opt) => Number(opt.value) === Number(field.value ?? 0)
                  ) || typeOptions[0] // ✅ fallback to first option
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : 0
                  ); // ✅ fallback 0
                }}
              />
            )}
          />
        </div>
      </TableData>
      <TableData
        className={`col `}
        style={{ minWidth: "240px" }}
      >
        <div>
          <Controller
            control={control}
            name={`formsData.${index}.userId`}
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
                      (field.value != null ? field.value.toString() : "")
                  )
                    ? [
                        userOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : "")
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                }}
              />
            )}
          />
          {errors.formsData?.[index]?.userId && (
            <p className="text-danger mt-1 fs14px">
              {errors.formsData[index].userId?.message}
            </p>
          )}
        </div>
      </TableData>
      <TableData>{field.section}</TableData>
      <TableData style={{ minWidth: "220px" }}>
        <div
          className={`col `}
        >
          <Controller
            control={control}
            name={`formsData.${index}.dateFrom`}
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
          {errors.formsData?.[index]?.dateFrom && (
            <p className="text-danger mt-1 fs14px">
              {errors.formsData[index].dateFrom?.message}
            </p>
          )}
        </div>
      </TableData>
      <TableData style={{ minWidth: "220px" }}>
        <div
          className={`col `}
        >
          <Controller
            control={control}
            name={`formsData.${index}.dateTo`}
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
          {errors.formsData?.[index]?.dateTo && (
            <p className="text-danger mt-1 fs14px">
              {errors.formsData[index].dateTo?.message}
            </p>
          )}
        </div>
      </TableData>
      <TableData style={{ minWidth: "220px" }}>
        <div
          className={`col `}
        >
          <Controller
            control={control}
            name={`formsData.${index}.driverId`}
            render={({ field }) => (
              <CustomSelect
                {...field}
                options={driverOptions} // must be in format { value, label }
                closeMenuOnSelect={true}
                placeholder="Select"
                // Convert between react-select and raw value
                value={
                  driverOptions.find((opt) => opt.value === String(field.value))
                    ? [
                        driverOptions.find(
                          (opt) => opt.value === String(field.value)
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                  if (selectedOption) {
                    const driverId = Number(selectedOption.value);
                  }
                }}
              />
            )}
          />
          {errors.formsData?.[index]?.driverId && (
            <p className="text-danger mt-1 fs14px">
              {errors.formsData[index].driverId?.message}
            </p>
          )}
        </div>
      </TableData>
      <TableData style={{ minWidth: "220px" }}>
        <div
          className={`col `}
        >
          <Controller
            control={control}
            name={`formsData.${index}.vehicalId`}
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
                      (field.value != null ? field.value.toString() : "")
                  )
                    ? [
                        vehicleOptions.find(
                          (opt) =>
                            opt.value ===
                            (field.value != null ? field.value.toString() : "")
                        )!,
                      ]
                    : null
                }
                onChangeSingle={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                  if (selectedOption) {
                    const vehicleId = Number(selectedOption.value);
                  }
                }}
              />
            )}
          />
          {errors.formsData?.[index]?.driverId && (
            <p className="text-danger mt-1 fs14px">
              {errors.formsData[index].driverId?.message}
            </p>
          )}
        </div>
      </TableData>
      <TableData>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(field.tempId, index)}
        >
          Delete
        </button>
      </TableData>
    </tr>
  );
};

export default Form;

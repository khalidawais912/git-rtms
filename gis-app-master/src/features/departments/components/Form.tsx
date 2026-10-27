"use client";
import Button from "@/components/Button";
import { AxiosError } from "@/services/client";
import { ErrorResponse } from "@/services/types";
import {
  createDepartment,
  getDataAgainstField,
  getDepartment,
  getFieldList,
  updateDepartment,
} from "../services";
import { DepartmentWithRights, departmentWithRightsSchema } from "../schema";
import { FiledList, Option } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select, { SingleValue } from "react-select";
import more from "@/public/icons/more.svg";
import { RxCross2 } from "react-icons/rx";
import ActionButton from "@/components/Table/ActionButton";
import FormWrapper from "@/components/Form/FormWrapper";
import CustomLabel from "@/components/Form/CustomLabel";
import CustomInput from "@/components/Form/CustomInput";
import CustomSelect from "@/components/Form/CustomSelect";
import { OptionType } from "@/components/types";
import SubmitButton from "@/components/Form/SubmitButton";
import { FiPlus } from "react-icons/fi";

interface Props {
  method: "POST" | "PUT";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}
const Form = ({ method, id, setRefresh }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<DepartmentWithRights>({
    resolver: zodResolver(departmentWithRightsSchema),
    defaultValues: {
      department: {
        id: 0,
        name: "",
        logo: "-",
        address: "",
        email: "",
        phoneNumber: "",
      },
      departmentRights: [],
    },
  });

  const [filedList, setFiledList] = useState<FiledList>({
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
  });
  const [fieldValueOptionsMap, setFieldValueOptionsMap] = useState<{
    [index: number]: Option[];
  }>({});

  useEffect(() => {
    const getFiledList = async () => {
      try {
        setFiledList(await getFieldList());
      } catch (err) {
        console.error("Submission error:", err);
        toast.error(
          (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
            (err as AxiosError<ErrorResponse>).message,
        );
      }
    };
    getFiledList();
  }, []);

  const getDataAgainstFiled = async (id: number, index: number) => {
    try {
      const data = await getDataAgainstField(id);
      const options = Array.isArray(data)
        ? data.map((item) => ({
            value: item.id.toString(),
            label:
              item.districtName ||
              item.name ||
              item.divisionName ||
              `Item ${item.id}`,
          }))
        : [];

      setFieldValueOptionsMap((prev) => ({
        ...prev,
        [index]: options,
      }));
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message,
      );
    }
  };

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "departmentRights",
  });

  const [show, setShow] = useState(false);

  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const addNewRole = () => {
    append({ id: 0, department_Id: 0, fieldName: "", fieldValue: "" });
  };

  const handleShow = async () => {
    setShow(true);
    if (method === "PUT") {
      try {
        const itemData = await getDepartment(id!);
        setValue("department.id", itemData.department.id);
        setValue("department.name", itemData.department.name);
        setValue("department.shortName", itemData.department.shortName);
        setValue("department.logo", itemData.department.logo);
        setValue("department.address", itemData.department.address);
        setValue("department.email", itemData.department.email);
        setValue("department.phoneNumber", itemData.department.phoneNumber);

        // Reverse map: string fieldName → numeric key
        const reverseFiledList: Record<string, string> = {};
        Object.entries(filedList).forEach(([key, value]) => {
          reverseFiledList[value] = key;
        });

        if (itemData.departmentRights && itemData.departmentRights.length > 0) {
          // Replace with numeric key instead of string label
          const updatedRights = itemData.departmentRights.map((item) => ({
            ...item,
            fieldName: reverseFiledList[item.fieldName] || "", // convert to number key
          }));

          replace(updatedRights);

          // Fetch options for each field
          updatedRights.forEach((item, index) => {
            const fieldNameId = Number(item.fieldName); // Make sure it's numeric
            if (fieldNameId) {
              getDataAgainstFiled(fieldNameId, index);
            }
          });
        }
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: DepartmentWithRights) => {
    console.log("Form Data:", formData);
    console.log(errors);

    const modifiedFormData = {
      ...formData, // your form data
      departmentRights: formData.departmentRights?.map((right) => ({
        ...right,
        fieldName:
          filedList[right.fieldName as keyof FiledList] || right.fieldName,
      })),
    };

    console.log("modified Form Data:", modifiedFormData);

    try {
      const response =
        method === "POST"
          ? await createDepartment(modifiedFormData)
          : await updateDepartment(modifiedFormData);
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      <ActionButton onClick={handleShow} method={method} name="Department" />

      <Modal
        show={show}
        size="xl"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="new-custom-modal"
        id={`formModal-${id}`}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <FormWrapper
            heading={
              method === "POST" ? "Add New Department" : "Update Department"
            }
          >
            <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div className="col-12 col col-sm-12 col-md-12 col-lg-4 mb-3 text-start">
                  <CustomLabel htmlFor="name">Department Name</CustomLabel>
                  <CustomInput
                    {...register("department.name")}
                    id="name"
                    type="text"
                    placeholder="Enter Department Name"
                  />
                  {errors.department?.name && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.department.name.message}
                    </p>
                  )}
                </div>
                <div className="col-12 col col-sm-12 col-md-12 col-lg-4 mb-3 text-start">
                  <CustomLabel htmlFor="shortName">Short Name</CustomLabel>
                  <CustomInput
                    {...register("department.shortName")}
                    id="shortName"
                    type="text"
                    placeholder="e.g. DGME"
                  />
                  {errors.department?.shortName && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.department.shortName.message}
                    </p>
                  )}
                </div>
                <div className="col-12 col col-sm-12 col-md-12 col-lg-4 mb-3 text-start">
                  <CustomLabel htmlFor="phoneNumber">Phone Number</CustomLabel>
                  <CustomInput
                    {...register("department.phoneNumber")}
                    id="phoneNumber"
                    type="text"
                    placeholder="Enter Phone Number"
                  />
                  {errors.department?.phoneNumber && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.department.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div className="col-12 col col-sm-12 col-md-12 col-lg-4 mb-3 text-start">
                  <CustomLabel htmlFor="address">Addresss</CustomLabel>
                  <CustomInput
                    {...register("department.address")}
                    id="address"
                    type="text"
                    placeholder="Enter your Addresss"
                  />
                  {errors.department?.address && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.department.address.message}
                    </p>
                  )}
                </div>
                <div className="col-12 col col-sm-12 col-md-12 col-lg-4 mb-3 text-start">
                  <CustomLabel htmlFor="email">Email</CustomLabel>
                  <CustomInput
                    {...register("department.email")}
                    id="email"
                    type="text"
                    placeholder="Enter your Email"
                  />
                  {errors.department?.email && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.department.email.message}
                    </p>
                  )}
                </div>
                <>
                  <div className="row d-flex justify-content-between align-items-center m-0 p-0">
                    <div className="col-auto">
                      <h5 className="fs18px fw-6 m-0">Add Rights</h5>
                    </div>
                    <div className="col-auto">
                      <Button
                        type="button"
                        onClick={addNewRole}
                        className="btn rounded-pill text-white fs15px fw-bold bg-color-evaluation-theme-blue"
                      >
                        <div className="col">
                          <div className="row align-items-center">
                            <div
                              className="col pe-0"
                              style={{ paddingBottom: "2px" }}
                            >
                              <FiPlus size={21.6} />
                            </div>
                            <div className="col ps-1 text-nowrap">More</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                    {errors.departmentRights && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.departmentRights.message}
                      </p>
                    )}
                  </div>
                  <hr />

                  {/* Rights Fields */}
                  {fields?.map((field, index) => (
                    <div className="row mb-2 m-0" key={field.id}>
                      <div className="col-md-6 ps-0">
                        <Controller
                          name={`departmentRights.${index}.fieldName`}
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              {...field}
                              options={Object.entries(filedList).map(
                                ([key, value]) => ({
                                  value: key,
                                  label: value,
                                }),
                              )}
                              closeMenuOnSelect={true}
                              value={
                                field.value
                                  ? [
                                      {
                                        value: field.value,
                                        label:
                                          filedList[
                                            field.value as keyof FiledList
                                          ] || "Unknown",
                                      },
                                    ]
                                  : []
                              }
                              onChangeSingle={(selectedOption) => {
                                const singleOption =
                                  selectedOption as SingleValue<OptionType>;

                                const selectedId = singleOption
                                  ? Number(singleOption.value)
                                  : 0;
                                field.onChange(
                                  singleOption ? singleOption.value : "",
                                );

                                if (!selectedId) {
                                  setFieldValueOptionsMap((prev) => ({
                                    ...prev,
                                    [index]: [],
                                  }));
                                  return;
                                }

                                // Fetch new options if a valid field is selected
                                getDataAgainstFiled(selectedId, index);
                              }}
                            />
                          )}
                        />
                        {errors.departmentRights?.[index]?.fieldName && (
                          <p className="text-danger mt-1 fs14px">
                            {
                              errors.departmentRights?.[index]?.fieldName
                                .message
                            }
                          </p>
                        )}
                      </div>
                      <div className="col-md-6 pe-0">
                        <Controller
                          name={`departmentRights.${index}.fieldValue`}
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              {...field}
                              isMulti={true}
                              closeMenuOnSelect={false}
                              options={fieldValueOptionsMap[index] || []}
                              onChangeMulti={(selectedOptions) => {
                                // Store as comma-separated string or JSON depending on backend
                                field.onChange(
                                  selectedOptions
                                    .map((opt) => opt.value)
                                    .join(","),
                                );
                              }}
                              value={(fieldValueOptionsMap[index] || []).filter(
                                (opt) =>
                                  field.value?.split(",")?.includes(opt.value),
                              )}
                            />
                          )}
                        />
                        {errors.departmentRights?.[index]?.fieldValue && (
                          <p className="text-danger mt-1 fs14px">
                            {
                              errors.departmentRights?.[index]?.fieldValue
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Centralized Remove Buttons */}
                  {fields.length > 0 && (
                    <div className="row mt-2 m-0">
                      <div className="col ps-0">
                        {fields.map((field, index) => {
                          const id = 0;
                          // Get current fieldName value from form state
                          const selectedFieldNameId = watch(
                            `departmentRights.${index}.fieldName`,
                          );
                          const selectedFieldNameLabel =
                            filedList?.[
                              selectedFieldNameId as keyof FiledList
                            ] || `Right #${index + 1}`;

                          return (
                            <Button
                              key={field.id}
                              className="me-2 mb-2 btn rounded-pill btn-outline-danger fs13px"
                              onClick={() => remove(index)}
                            >
                              {/* Remove Right #{index + 1} */}
                              {selectedFieldNameLabel} <RxCross2 />
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              </div>
              <SubmitButton>Save Department</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

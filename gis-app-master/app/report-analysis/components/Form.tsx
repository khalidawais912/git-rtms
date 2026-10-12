"use client";

import { REPORT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomSelect from "@/app/components/Form/CustomSelect";
import Spinner from "@/app/components/Spinner";
import TableData from "@/app/components/Table/TableData";
import TableHeading, {
  defaultStyle,
} from "@/app/components/Table/TableHeading";
import { Attribute } from "@/app/hooks/useAttributes";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { createdMessage } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { PiTrashSimpleBold } from "react-icons/pi";
import { toast } from "react-toastify";
import { z } from "zod";

type OptionType = { value: string; label: string };

const schema = z.object({
  reportName: z.string().min(1, { message: "Please add Report Name!" }),
  attributeIds: z
    .array(z.number({ invalid_type_error: "Please add Attribute!" }))
    .min(1, "At least one attribute is required"),
  groupByFields: z.array(z.string()),
  attributeFunctions: z.record(z.string()), // Accepts dynamic keys with string values
  orderByFields: z
    .array(z.string().min(1, { message: "Please add OrderBy!" }))
    .min(1, { message: "Please select an Option!" }),
});

type MasterReportGenerate = z.infer<typeof schema>;

interface Props {
  handleClose: () => void;
  attributes: Attribute[];
  show: boolean;
  setRefreshTabs: Dispatch<SetStateAction<boolean>>;
}

const Form = ({ handleClose, attributes, show, setRefreshTabs }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<MasterReportGenerate>({
    resolver: zodResolver(schema),
    defaultValues: {
      attributeFunctions: {}, // 👈 This is the key-value map you want to populate
    },
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const router = useRouter();

  const functionStatuses = [
    { value: "NONE", label: "NONE" },
    { value: "SUM", label: "SUM" },
    { value: "AVG", label: "AVG" },
    { value: "MIN", label: "MIN" },
    { value: "MAX", label: "MAX" },
  ];

  const defaultGroupByFields = [
    "ProjectId",
    "Project.GsNo",
    "Project.Name",
    "Project.Sector.Name",
    "Project.Division.Name",
    "Project.District.Name",
    "Project.SponsoringAgency.Name",
    "Project.ExecutionAgency.Name",
  ];

  const orderByOptions: OptionType[] = defaultGroupByFields.map(
    (defaultGroupByField) => {
      return {
        value: defaultGroupByField,
        label: defaultGroupByField.replaceAll(".", " "),
      };
    }
  );

  const [groupByFields, setGroupByFields] = useState<string[]>([]);

  useEffect(() => {
    if (show) {
      setGroupByFields(defaultGroupByFields);
      setValue("groupByFields", defaultGroupByFields);
    }
  }, [show]);

  const [availableAttributes, setAvailableAttributes] = useState(
    attributes.filter((a) => a.isMaster === 1)
  );

  const handleAddAttribute = (attributeId: number) => {
    const current = getValues("attributeIds") || [];

    // update form value
    setValue("attributeIds", [...current, attributeId]);

    // remove from display list
    setAvailableAttributes((prev) =>
      prev.filter((attr) => attr.attributeId !== attributeId)
    );
  };

  const handleDeleteAttribute = (id: number) => {
    const current = getValues("attributeIds") || [];
    const updated = current.filter((attrId) => attrId !== id);
    setValue("attributeIds", updated);

    // Restore back to available attributes
    const restoredAttr = attributes.find((a) => a.attributeId === id);
    if (restoredAttr) {
      setAvailableAttributes((prev) => [...prev, restoredAttr]);
    }
  };

  const attributeIds =
    useWatch({
      name: "attributeIds",
      control,
    }) || [];

  const toggleGroupByField = (field: string) => {
    const current: string[] = getValues("groupByFields") || [];
    const isPresent = current.includes(field);
    const updated = isPresent
      ? current.filter((item) => item !== field)
      : [...current, field];

    setValue("groupByFields", updated);
    setGroupByFields(updated);
    console.log("groupByFields", getValues("groupByFields"));
  };

  const onSubmit = async (formData: MasterReportGenerate) => {
    console.log("Form Data:", formData);
    console.log(errors);

    try {
      setSubmitting(true);
      const response = await apiClient.post(REPORT_API + "/generate", formData);
      console.log("Response:", response);
      toast.success(createdMessage);
      handleClose();
      setRefreshTabs((prev) => !prev);
      router.push("/report-analysis/list");
    } catch (err) {
      setSubmitting(false);
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    } finally {
      setSubmitting(false); // Always run after try/catch
    }
  };

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = availableAttributes.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAttributes(filtered);
    }
  }, [searchTerm, availableAttributes]);

  return (
    <div
      className={`col p-3 bg-white`}
      style={{
        borderRadius: "15px",
        border: "1px solid #E2E4E5",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row d-flex align-items-center justify-content-between">
          <div className="col-auto">
            <p
              className="fw-6 d-none d-md-block"
              style={{ fontSize: "2.25rem" }}
            >
              Master Report Form
            </p>
            <p
              className="fw-6 d-block d-md-none"
              style={{ fontSize: "1.25rem" }}
            >
              Master Report Form
            </p>
          </div>
          <div className="col">
            <div className="row align-items-center justify-content-end">
              <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                <CustomInput
                  {...register("reportName")}
                  id="reportName"
                  type="text"
                  style={{ borderRadius: "50px" }}
                  placeholder="Enter Report Name"
                />

                {errors.reportName && (
                  <p className="text-danger mt-1 fs14px">
                    {errors.reportName.message}
                  </p>
                )}
              </div>

              <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
                <Controller
                  name="orderByFields"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      options={orderByOptions} // must be in format { value, label }
                      placeholder="Select Order By"
                      radius="pill"
                      // Convert between react-select and raw value
                      value={
                        orderByOptions.find(
                          (opt) => opt.value === field.value?.[0]
                        )
                          ? [
                              orderByOptions.find(
                                (opt) => opt.value === field.value?.[0]
                              )!,
                            ]
                          : null
                      }
                      onChangeSingle={(selectedOption) => {
                        field.onChange(
                          selectedOption ? [selectedOption.value] : []
                        );
                      }}
                    />
                  )}
                />
                {errors.orderByFields && (
                  <p className="text-danger mt-1 fs14px">
                    {errors.orderByFields.message}
                  </p>
                )}
              </div>
              <div className="col-auto">
                <div className="row">
                  <div className="col-auto text-end">
                    <Button
                      type="submit"
                      className="btn bg-color-sea-blue text-white"
                      style={{ borderRadius: "8px" }}
                      disabled={isSubmitting}
                    >
                      Generate&nbsp;
                      {isSubmitting ? (
                        <Spinner color="text-light" />
                      ) : (
                        <Image
                          src="/icons/3d-scale.svg"
                          alt="3d-scale"
                          width={21}
                          height={21}
                          style={{ width: "21px", height: "21px" }}
                        />
                      )}
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button type="button" className="btn" onClick={handleClose}>
                      <AiOutlineClose />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {defaultGroupByFields.map((groupByField, i) => (
            <div key={i} className="col-auto mb-2 pe-0">
              <Button
                type="button"
                className={`btn rounded-pill fw-5 fs14px ${
                  groupByFields.includes(groupByField)
                    ? "bg-color-sea-blue text-white"
                    : "bg-white"
                }`}
                style={{
                  border: "1px solid #EDF1F3",
                  padding: "14px",
                  boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
                }}
                onClick={() => toggleGroupByField(groupByField)}
              >
                <span className="pe-3">{groupByField}</span>{" "}
                {groupByFields.includes(groupByField) ? (
                  <FaCheck />
                ) : (
                  <IoClose size={16} />
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-7 col-lg-8">
            <div className="table-responsive mb-2">
              <div
                style={{
                  height: "calc(100vh - 345px)",
                  overflow: "auto",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                }}
              >
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <TableHeading name="Attributes" />
                      <TableHeading name="Function" />
                      <TableHeading name="Action" />
                    </tr>
                  </thead>
                  <tbody>
                    {attributeIds?.map((id, i) => {
                      const attribute = attributes.find(
                        (attr) => attr.attributeId === id
                      );
                      if (!attribute) return null;

                      return (
                        <tr key={i}>
                          <TableData>{attribute.label}</TableData>
                          <TableData>
                            <CustomSelect
                              options={functionStatuses}
                              defaultValue={functionStatuses[0]}
                              placeholder="Select function"
                              onChangeSingle={(selectedOption) => {
                                setValue(
                                  `attributeFunctions.${id}`,
                                  selectedOption?.value ?? "NONE"
                                );
                              }}
                            />
                          </TableData>
                          <TableData>
                            <Button
                              type="button"
                              className="btn"
                              onClick={() => handleDeleteAttribute(id)}
                            >
                              <PiTrashSimpleBold
                                style={{ color: "#E22F2F" }}
                                size={20}
                              />
                            </Button>
                          </TableData>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-5 col-lg-4 ps-0">
            <div className="table-responsive mb-2">
              <div
                style={{
                  height: "calc(100vh - 345px)",
                  overflow: "auto",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                }}
              >
                <table className="table table-hover mb-0">
                  <thead>
                    {/* First sticky header row */}
                    <tr
                      className="position-sticky top-0 bg-white"
                      style={{ zIndex: 3 }}
                    >
                      <TableHeading name="Attributes" className="text-nowrap" />
                      <TableHeading name="Action" className="text-nowrap" />
                    </tr>

                    {/* Second sticky row (search) */}
                    <tr
                      className="position-sticky bg-white"
                      style={{
                        top: "45px", // adjust height based on your first row
                        zIndex: 2,
                      }}
                    >
                      <th
                        scope="col"
                        className="fs15px"
                        colSpan={2}
                        style={defaultStyle}
                      >
                        <div className="col position-relative">
                          <div className="input-group">
                            <button
                              className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                              type="submit"
                              style={{
                                border: "1.08px solid #CBD5E1",
                                padding: "8px 0px 12px 12px",
                                zIndex: 1,
                              }}
                            >
                              <LuSearch
                                size={17}
                                style={{ color: "#475569" }}
                              />
                            </button>
                            <CustomInput
                              type="text"
                              className="form-control fw-bold border-start-0 rounded-pill rounded-start shadow-none fs15px bg-transparent py-2 placeholder-bold"
                              style={{
                                border: "1px solid #CBD5E1",
                              }}
                              placeholder="Search..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              id="search"
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchTerm.trim().length > 0
                      ? filteredAttributes
                      : availableAttributes
                    )?.map((attribute, i) => (
                      <tr key={i}>
                        <TableData>{attribute.label}</TableData>
                        <TableData>
                          <Button
                            type="button"
                            className="btn"
                            onClick={() =>
                              handleAddAttribute(attribute.attributeId)
                            }
                          >
                            <FiPlus size={20} />
                          </Button>
                        </TableData>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;

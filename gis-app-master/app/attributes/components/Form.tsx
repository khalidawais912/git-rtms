import Button from "@/app/components/Button";
import CustomToggleSwitch from "@/app/components/CustomToggleSwitch";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import CustomSelect, {
  defaultOption,
  OptionType,
} from "@/app/components/Form/CustomSelect";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import ActionButton from "@/app/components/Table/ActionButton";
import TrashIcon from "@/app/components/TrashIcon";
import { Attribute } from "@/app/hooks/useAttributes";
import apiClient, { AxiosError } from "@/app/services/api-client";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Modal from "react-bootstrap/Modal";
import { ActionMeta, SingleValue } from "react-select";
import { toast } from "react-toastify";
interface Form {
  attributeId: number;
  attributeDataType: string;
  multiselect: number;
  label: string;
  validationRegx: string;
  min: number;
  max: number;
  required: number;
  status: number;
  hidden: number;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
  attributeType: string;
  unit: string;
  errorMessage: string;
  verificationType: string;
  sortId: number;
  attributeCode: string;
  evaluationFormula: string;
  weightage: number;
  remarks: string;
  parentId: number;
  readOnly: number;
  smdpIdentifier: string;
  evaluationFormulaWeightage: number;
  removeable: number;
  isMaster: number;
  priority: number;
}

interface Option {
  value: string;
  attributeId: number;
  sortId: number;
  isActive: number;
  label: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
  remarks: string;
}

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  projectDetailKeys: string[];
  data: Attribute[];
}

const Form = ({
  api,
  method,
  id,
  setRefresh,
  refresh,
  projectDetailKeys,
  data,
}: Props) => {
  const [isRequired, setRequired] = useState(false);
  const [isMultiSelect, setMultiSelect] = useState(false);
  const [isStatus, setStatus] = useState(false);
  const [isHidden, setHidden] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);
  const [isRemoveable, setRemoveable] = useState(false);
  const [isMaster, setMaster] = useState(false);
  const [activeStates, setActiveStates] = useState<{ [key: number]: boolean }>(
    {},
  );

  const modalId = `formModal-${id}`;
  const handleCheckboxChange = (index: number, checked: boolean) => {
    setActiveStates((prevStates) => ({
      ...prevStates,
      [index]: checked,
    }));
  };

  const handleDeleteOption = (index: number) => {
    setOptionsData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState<Form>({
    attributeId: 0,
    attributeDataType: "string",
    multiselect: 0,
    label: "",
    validationRegx: "",
    min: 0,
    max: 0,
    required: 0,
    status: 0,
    hidden: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    placeholder: "",
    attributeType: "textfield",
    unit: "",
    errorMessage: "",
    verificationType: "",
    sortId: 0,
    attributeCode: "",
    evaluationFormula: "",
    weightage: 0,
    remarks: "",
    parentId: 0,
    readOnly: 0,
    smdpIdentifier: "",
    evaluationFormulaWeightage: 0,
    removeable: 0,
    isMaster: 0,
    priority: 0,
  });

  const [optionsData, setOptionsData] = useState<Option[]>([
    {
      attributeId: 0,
      value: "",
      sortId: 0,
      isActive: 0,
      condition: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      label: "",
      remarks: "",
    },
  ]);

  const [show, setShow] = useState(false);
  // error messages
  const errorMessages = {
    created: "Created Successfully",
    labelError: "Please add Label!",
    attributeDataTypeError: "Please add Attribute DataType!",
  };
  const updated = "Updated Successfully";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setShow(true);
    console.log("formData.readOnly:", formData.readOnly);
    if (method === "PUT") {
      try {
        // send a POST request to the server to add the product
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setFormData({
          attributeId: itemData.attributeId,
          attributeDataType: itemData.attributeDataType,
          multiselect: itemData.multiselect,
          label: itemData.label,
          validationRegx: itemData.validationRegx,
          min: itemData.min,
          max: itemData.max,
          required: itemData.required,
          status: itemData.status,
          hidden: itemData.hidden,
          createdAt: itemData.createdAt,
          updatedAt: new Date().toISOString(),
          placeholder: itemData.placeholder,
          attributeType: itemData.attributeType,
          unit: itemData.unit,
          errorMessage: itemData.errorMessage,
          verificationType: itemData.verificationType,
          sortId: itemData.sortId,
          attributeCode: itemData.attributeCode,
          evaluationFormula: itemData.evaluationFormula,
          weightage: itemData.weightage,
          remarks: itemData.remarks,
          parentId: itemData.parentId,
          readOnly: itemData.readOnly,
          smdpIdentifier: itemData.smdpIdentifier,
          evaluationFormulaWeightage: itemData.evaluationFormulaWeightage,
          removeable: itemData.removeable,
          isMaster: itemData.isMaster,
          priority: itemData.priority,
        });
        setOptionsData(
          itemData.options || [
            {
              attributeId: 0,
              value: "",
              sortId: 0,
              isActive: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              label: "",
              condition: "",
              remarks: "",
            },
          ],
        );
        setActiveStates(
          itemData.options
            ? itemData.options.map((option: Option) =>
                option.isActive ? true : false,
              )
            : {},
        );
        setRequired(itemData.required === 1 ? true : false);
        setMultiSelect(itemData.multiselect === 1 ? true : false);
        setStatus(itemData.status === 1 ? true : false);
        setHidden(itemData.hidden === 1 ? true : false);
        setReadOnly(itemData.readOnly === 1 ? true : false);
        setRemoveable(itemData.removeable === 1 ? true : false);
        setMaster(itemData.isMaster === 1 ? true : false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleDatalistSelect = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     // Trim the existing and new values and join them with a single space
  //     evaluationFormula: prevData.evaluationFormula
  //       ? `${prevData.evaluationFormula.trim()}${e.target.value.trim()}`
  //       : e.target.value.trim(),
  //   }));
  // };

  const handleDatalistSelect = (selected: OptionType | null) => {
    if (!selected) return;

    setFormData((prevData) => ({
      ...prevData,
      evaluationFormula: prevData.evaluationFormula
        ? `${prevData.evaluationFormula.trim()}${selected.value.trim()}`
        : selected.value.trim(),
    }));
  };

  const handleOptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setOptionsData((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, [name]: value } : option,
      ),
    );
  };

  function handleSelectChange<Key extends keyof Attribute>(
    name: Key,
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
    setFormData: Dispatch<SetStateAction<Attribute>>,
  ) {
    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? newValue.value : "",
    }));
    console.log({ name, newValue, actionMeta });
  }

  // Function to handle adding new option
  const addNewOption = () => {
    setOptionsData((prevOptions) => [
      ...prevOptions,
      {
        value: "",
        attributeId: 0,
        sortId: 0,
        isActive: 0,
        label: "",
        condition: "",
        remarks: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      evaluationFormula:
        prev.attributeType === "formula" ? prev.evaluationFormula : "",
      required: isRequired ? 1 : 0,
      multiselect: isMultiSelect ? 1 : 0,
      status: isStatus ? 1 : 0,
      hidden: isHidden ? 1 : 0,
      readOnly: isReadOnly ? 1 : 0,
      removeable: isRemoveable ? 1 : 0,
      isMaster: isMaster ? 1 : 0,
    }));
  }, [
    isRequired,
    isMultiSelect,
    isStatus,
    isHidden,
    isReadOnly,
    isRemoveable,
    isMaster,
    formData.attributeType, // ✅ only include this specific key
  ]);

  // Update optionsData state when activeStates change
  useEffect(() => {
    setOptionsData((prevOptions) =>
      prevOptions.map((option, i) => ({
        ...option,
        isActive: activeStates[i] === true ? 1 : 0,
      })),
    );
  }, [activeStates]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("before submit formData.readOnly:", formData.readOnly);

    switch (true) {
      case !formData.label:
        notifyError(errorMessages.labelError);
        break;

      default:
        try {
          console.log("data:", { attribute: formData, options: optionsData });

          const modifiedFormData = {
            ...formData,
            required: isRequired ? 1 : 0,
            multiselect: isMultiSelect ? 1 : 0,
            status: isStatus ? 1 : 0,
            hidden: isHidden ? 1 : 0,
            readOnly: isReadOnly ? 1 : 0,
            removeable: isRemoveable ? 1 : 0,
            isMaster: isMaster ? 1 : 0,
            attributeCode:
              formData.attributeCode === "" ? null : formData.attributeCode, // Change 0 to null
            validationRegx:
              formData.validationRegx === "" ? null : formData.validationRegx, // Change 0 to null
            placeholder:
              formData.placeholder === "" ? null : formData.placeholder, // Change 0 to null
            attributeType:
              formData.attributeType === "" ? null : formData.attributeType, // Change 0 to null
            unit: formData.unit === "" ? null : formData.unit, // Change 0 to null
            verificationType:
              formData.verificationType === ""
                ? null
                : formData.verificationType, // Change 0 to null
            evaluationFormula:
              formData.evaluationFormula === ""
                ? null
                : formData.evaluationFormula, // Change 0 to null
            errorMessage:
              formData.errorMessage === "" ? null : formData.errorMessage, // Change 0 to null
            remarks: formData.remarks === "" ? null : formData.remarks, // Change 0 to null
            parentId: formData.parentId === 0 ? null : formData.parentId, // Change 0 to null
            smdpIdentifier:
              formData.smdpIdentifier === "" ? null : formData.smdpIdentifier, // Change 0 to null
          };

          // send a POST request to the server to add the product
          if (method === "POST") {
            const response = await apiClient({
              method: method,
              url: api,
              data: {
                attribute: modifiedFormData,
                options:
                  formData.attributeType === "radio" ||
                  formData.attributeType === "select" ||
                  formData.attributeType === "checkbox"
                    ? optionsData
                    : null,
              },
            });
            // notifyCreate(errorMessages.created);
            handleClose();
            setFormData({
              attributeId: 0,
              attributeDataType: "string",
              multiselect: 0,
              label: "",
              validationRegx: "",
              min: 0,
              max: 0,
              required: 0,
              status: 0,
              hidden: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              placeholder: "",
              attributeType: "textfield",
              unit: "",
              errorMessage: "",
              verificationType: "",
              sortId: 0,
              attributeCode: "",
              evaluationFormula: "",
              weightage: 0,
              remarks: "",
              parentId: 0,
              readOnly: 0,
              smdpIdentifier: "",
              evaluationFormulaWeightage: 0,
              removeable: 0,
              isMaster: 0,
              priority: 0,
            });
            setOptionsData([
              {
                attributeId: 0,
                value: "",
                sortId: 0,
                isActive: 0,
                condition: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                label: "",
                remarks: "",
              },
            ]);
            setActiveStates({});
            setRequired(false);
            setMultiSelect(false);
            setStatus(false);
            setHidden(false);
            setReadOnly(false);
            setRemoveable(false);
            setMaster(false);
            console.log("Submit Response:", response.data);
            setRefresh((prev) => !prev);
          } else {
            const response = await apiClient({
              method: method,
              url: api,
              data: {
                attribute: modifiedFormData,
                options:
                  formData.attributeType === "radio" ||
                  formData.attributeType === "select" ||
                  formData.attributeType === "checkbox"
                    ? optionsData
                    : null,
              },
            });
            console.log("response", response);
            setRefresh((prev) => !prev);
            // notifyCreate(updated);
            handleClose();
            console.log("after submit formData.readOnly:", formData.readOnly);
          }
        } catch (err) {
          console.log((err as AxiosError).message);
          // notifyError((err as AxiosError).message);
          // setError((err as AxiosError).message);
        }
    }
  };

  const attributeDataTypes = ["String", "Number", "Date"];

  const attributeDataTypeOptions = attributeDataTypes.map((dataType) => {
    return {
      value: dataType.toLowerCase(),
      label: dataType,
    };
  });

  const attributeTypes = [
    "Textfield",
    "Select",
    "File",
    "Radio",
    "Slider",
    "Textarea",
    "Progress",
    "Checkbox",
    "Formula",
  ];

  const attributeTypeOptions = attributeTypes.map((dataType) => {
    return {
      value: dataType.toLowerCase(),
      label: dataType,
    };
  });

  const verificationTypes = ["Image", "Video"];

  const verificationTypeOptions = verificationTypes.map((dataType) => {
    return {
      value: dataType.toLowerCase(),
      label: dataType,
    };
  });

  const smdpIdentifierOptions = projectDetailKeys?.map((key) => {
    return {
      value: key,
      label: key,
    };
  });

  const attributeCodeOptions = data
    .filter((d) => d.attributeCode)
    ?.map((d) => {
      return {
        value: d.attributeCode,
        label: d.label,
      };
    });

  // const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

  // // Prepare selected values for react-select in {value, label} format
  // const selectedAttributeCodeValue: OptionType[] = selectedOptions.map((option) => ({
  //   value: option.value,
  //   label: option.label,
  // }));

  return (
    <>
      <ActionButton onClick={handleShow} method={method} name="Attribute" />

      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id={modalId}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <FormWrapper
            heading={method === "POST" ? "Add Attribute" : "Update Attribute"}
          >
            <form onSubmit={handleSubmit}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="label">Label</CustomLabel>
                  <CustomInput
                    value={formData.label}
                    onChange={handleChange}
                    id="label"
                    name="label"
                    type="text"
                    placeholder="Enter Label"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="placeholder">Placeholder</CustomLabel>
                  <CustomInput
                    value={formData.placeholder}
                    onChange={handleChange}
                    id="placeholder"
                    name="placeholder"
                    type="text"
                    placeholder="Enter Placeholder"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="attributeDataType">
                    Attribute Data Type
                  </CustomLabel>
                  <CustomSelect
                    options={attributeDataTypeOptions}
                    id="attributeDataType"
                    closeMenuOnSelect={true}
                    value={
                      attributeDataTypeOptions.find(
                        (opt) => opt.value === formData.attributeDataType,
                      )
                        ? [
                            attributeDataTypeOptions.find(
                              (opt) => opt.value === formData.attributeDataType,
                            )!,
                          ]
                        : null
                    }
                    onChangeSingle={(nv, meta) =>
                      handleSelectChange(
                        "attributeDataType",
                        nv,
                        meta,
                        setFormData,
                      )
                    }
                  />
                  {/* <select
                    className="form-select form-select-sm color-light-dark shadow-none"
                    style={{ background: "rgba(255, 255, 255, 0.8)" }}
                    aria-label="Default select example"
                    name="attributeDataType"
                    id="attributeDataType"
                    onChange={handleChange}
                    value={formData.attributeDataType}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select> */}
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="attributeType">
                    Attribute Type
                  </CustomLabel>
                  <CustomSelect
                    options={[defaultOption, ...attributeTypeOptions]}
                    id="attributeType"
                    closeMenuOnSelect={true}
                    value={
                      attributeTypeOptions.find(
                        (opt) => opt.value === formData.attributeType,
                      )
                        ? [
                            attributeTypeOptions.find(
                              (opt) => opt.value === formData.attributeType,
                            )!,
                          ]
                        : null
                    }
                    onChangeSingle={(nv, meta) =>
                      handleSelectChange("attributeType", nv, meta, setFormData)
                    }
                  />
                  {/* <select
                    className="form-select form-select-sm color-light-dark shadow-none"
                    style={{ background: "rgba(255, 255, 255, 0.8)" }}
                    aria-label="Default select example"
                    name="attributeType"
                    id="attributeType"
                    onChange={handleChange}
                    value={formData.attributeType}
                  >
                    <option value="">None</option>
                    <option value="textfield">TextField</option>
                    <option value="select">Select</option>
                    <option value="file">File</option>
                    -<option value="radio">Radio</option>
                    <option value="slider">Slider</option>
                    <option value="textarea">Textarea</option>
                    <option value="progress">Progress</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="formula">Formula</option>
                  </select> */}
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="unit">Unit</CustomLabel>
                  <CustomInput
                    value={formData.unit}
                    onChange={handleChange}
                    id="unit"
                    name="unit"
                    type="text"
                    placeholder="Enter Unit"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="validationRegx">
                    Validation Regx
                  </CustomLabel>
                  <CustomInput
                    value={formData.validationRegx}
                    onChange={handleChange}
                    id="validationRegx"
                    name="validationRegx"
                    type="text"
                    placeholder="Enter validationRegx"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="sortId">Sort Id</CustomLabel>
                  <CustomInput
                    value={formData.sortId}
                    onChange={handleChange}
                    id="sortId"
                    name="sortId"
                    type="number"
                    placeholder="Enter Sort Id"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="verificationType">
                    Verification Type
                  </CustomLabel>

                  <CustomSelect
                    options={[defaultOption, ...verificationTypeOptions]}
                    id="verificationType"
                    closeMenuOnSelect={true}
                    value={
                      verificationTypeOptions.find(
                        (opt) => opt.value === formData.verificationType,
                      )
                        ? [
                            verificationTypeOptions.find(
                              (opt) => opt.value === formData.verificationType,
                            )!,
                          ]
                        : null
                    }
                    onChangeSingle={(nv, meta) =>
                      handleSelectChange(
                        "verificationType",
                        nv,
                        meta,
                        setFormData,
                      )
                    }
                  />
                  {/* <select
                    className="form-select form-select-sm color-light-dark shadow-none"
                    style={{ background: "rgba(255, 255, 255, 0.8)" }}
                    aria-label="Default select example"
                    name="verificationType"
                    id="verificationType"
                    onChange={handleChange}
                    value={formData.verificationType}
                  >
                    <option value="">None</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select> */}
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="smdpIdentifier">
                    Smdp Identifier
                  </CustomLabel>
                  <CustomSelect
                    options={[defaultOption, ...smdpIdentifierOptions]}
                    id="smdpIdentifier"
                    closeMenuOnSelect={true}
                    value={
                      smdpIdentifierOptions.find(
                        (opt) => opt.value === formData.smdpIdentifier,
                      )
                        ? [
                            smdpIdentifierOptions.find(
                              (opt) => opt.value === formData.smdpIdentifier,
                            )!,
                          ]
                        : null
                    }
                    onChangeSingle={(nv, meta) =>
                      handleSelectChange(
                        "smdpIdentifier",
                        nv,
                        meta,
                        setFormData,
                      )
                    }
                  />
                  {/* <select
                    className="form-select form-select-sm color-light-dark shadow-none"
                    style={{ background: "rgba(255, 255, 255, 0.8)" }}
                    aria-label="Default select example"
                    name="smdpIdentifier"
                    id="smdpIdentifier"
                    onChange={handleChange}
                    value={formData.smdpIdentifier}
                  >
                    <option value="">None</option>
                    {projectDetailKeys?.map((key, i) => (
                      <option key={i} value={key}>
                        {key}
                      </option>
                    ))}
                  </select> */}
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="errorMessage">
                    Error Message
                  </CustomLabel>
                  <CustomInput
                    value={formData.errorMessage}
                    onChange={handleChange}
                    id="errorMessage"
                    name="errorMessage"
                    type="text"
                    placeholder="Enter Error Message"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="remarks">Remarks</CustomLabel>
                  <CustomInput
                    value={formData.remarks}
                    onChange={handleChange}
                    id="remarks"
                    name="remarks"
                    type="text"
                    placeholder="Enter Remarks"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="attributeCode">
                    Attribute Code
                  </CustomLabel>
                  <CustomInput
                    value={formData.attributeCode}
                    onChange={handleChange}
                    id="attributeCode"
                    name="attributeCode"
                    type="text"
                    placeholder="Enter Attribute Code"
                  />
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="priority">Priority</CustomLabel>
                  <CustomInput
                    value={formData.priority}
                    onChange={handleChange}
                    id="priority"
                    name="priority"
                    type="number"
                    placeholder="Enter Priority"
                  />
                </div>
                {formData.attributeType === "slider" && (
                  <>
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                      style={{ marginBottom: "10px", padding: "0px 10px" }}
                    >
                      <CustomLabel htmlFor="min">Min</CustomLabel>
                      <CustomInput
                        value={formData.min}
                        onChange={handleChange}
                        id="min"
                        name="min"
                        type="number"
                        placeholder="Enter Min"
                      />
                    </div>
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                      style={{ marginBottom: "10px", padding: "0px 10px" }}
                    >
                      <CustomLabel htmlFor="max">Max</CustomLabel>
                      <CustomInput
                        value={formData.max}
                        onChange={handleChange}
                        id="max"
                        name="max"
                        type="number"
                        placeholder="Enter Max"
                      />
                    </div>
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                      style={{ marginBottom: "10px", padding: "0px 10px" }}
                    >
                      <CustomLabel htmlFor="weightage">Weightage</CustomLabel>
                      <CustomInput
                        value={formData.weightage}
                        onChange={handleChange}
                        id="weightage"
                        name="weightage"
                        type="number"
                        placeholder="Enter Weightage"
                      />
                    </div>
                  </>
                )}
                {formData.attributeType === "formula" && (
                  <>
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                      style={{ marginBottom: "10px", padding: "0px 10px" }}
                    >
                      <CustomLabel htmlFor="evaluationFormula">
                        EvaluationFormula
                      </CustomLabel>
                      <CustomInput
                        value={formData.evaluationFormula}
                        onChange={handleChange}
                        id="evaluationFormula"
                        name="evaluationFormula"
                        type="text"
                        placeholder="Enter Evaluation Formula"
                      />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0">
                      <label
                        htmlFor="searchAttributeCodes"
                        className="form-label form-label-color-black fw-5 fs14px"
                        style={{ marginBottom: "6px" }}
                      >
                        Search Attribute Codes
                      </label>
                      <CustomSelect
                        options={attributeCodeOptions}
                        closeMenuOnSelect={true}
                        maxHeight={43 * 5}
                        id="searchAttributeCodes"
                        onChangeSingle={(newValue) => {
                          if (newValue) handleDatalistSelect(newValue);
                        }}
                      />
                      {/* <select
                        className="form-select form-select-sm color-light-dark shadow-none"
                        style={{ background: "rgba(255, 255, 255, 0.8)" }}
                        aria-label="Default select example"
                        name="searchAttributeCodes"
                        id="searchAttributeCodes"
                        onChange={handleDatalistSelect}
                      >
                        <option value="">Select</option>
                        {data
                          .filter((d) => d.attributeCode)
                          .map((d, i) => (
                            <option key={i} value={d.attributeCode}>
                              {d.label}
                            </option>
                          ))}
                      </select> */}
                    </div>
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
                      style={{ marginBottom: "10px", padding: "0px 10px" }}
                    >
                      <CustomLabel htmlFor="evaluationFormulaWeightage">
                        Evaluation Formula Weightage
                      </CustomLabel>
                      <CustomInput
                        value={formData.evaluationFormulaWeightage}
                        onChange={handleChange}
                        id="evaluationFormulaWeightage"
                        name="evaluationFormulaWeightage"
                        type="number"
                        placeholder="Enter Evaluation Formula Weightage"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="row g-2 g-lg-3 mt-0">
                <div
                  className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "25px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      checked={isMultiSelect}
                      onChange={setMultiSelect}
                      id="multiselect"
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="multiselect"
                    >
                      Is Multi Select
                    </label>
                    {/* <input
                      className="form-check-input my-switch-primary"
                      type="checkbox"
                      id="multiselect"
                      name="multiselect"
                      checked={isMultiSelect}
                      onChange={() => setMultiSelect(!isMultiSelect)}
                    /> */}
                  </div>
                </div>
                <div
                  className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "25px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      checked={isRequired}
                      onChange={setRequired}
                      id="required"
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="required"
                    >
                      Is Required
                    </label>
                    {/* <input
                      className="form-check-input"
                      type="checkbox"
                      id="required"
                      name="required"
                      checked={isRequired}
                      onChange={() => setRequired(!isRequired)}
                    /> */}
                  </div>
                </div>
                <div
                  className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "25px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      id="status"
                      checked={isStatus}
                      onChange={setStatus}
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    {/* <input
                      className="form-check-input"
                      type="checkbox"
                      name="status"
                      id="status"
                      checked={isStatus}
                      onChange={() => setStatus(!isStatus)}
                    /> */}
                  </div>
                </div>
                <div
                  className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "25px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      id="hidden"
                      checked={isHidden}
                      onChange={setHidden}
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="hidden"
                    >
                      Is Hidden
                    </label>
                    {/* <input
                      className="form-check-input"
                      type="checkbox"
                      name="hidden"
                      id="hidden"
                      checked={isHidden}
                      onChange={() => setHidden(!isHidden)}
                    /> */}
                  </div>
                </div>
                <div
                  className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "25px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      id="readoOnly"
                      checked={isReadOnly}
                      onChange={setReadOnly}
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="readoOnly"
                    >
                      Is ReadOnly
                    </label>
                    {/* <input
                      className="form-check-input"
                      type="checkbox"
                      name="readoOnly"
                      id="readoOnly"
                      checked={isReadOnly}
                      onChange={() => setReadOnly(!isReadOnly)}
                    /> */}
                  </div>
                </div>
                <div
                  className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "25px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      id="removeable"
                      checked={isRemoveable}
                      onChange={setRemoveable}
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="removeable"
                    >
                      Is Removeable
                    </label>
                    {/* <input
                      className="form-check-input"
                      type="checkbox"
                      name="removeable"
                      id="removeable"
                      checked={isRemoveable}
                      onChange={() => setRemoveable(!isRemoveable)}
                    /> */}
                  </div>
                </div>
                <div
                  className="col-xl-2 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "25px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      id="master"
                      checked={isMaster}
                      onChange={setMaster}
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="master"
                    >
                      Is Master
                    </label>
                    {/* <input
                      className="form-check-input"
                      type="checkbox"
                      name="master"
                      id="master"
                      checked={isMaster}
                      onChange={() => setMaster(!isMaster)}
                    /> */}
                  </div>
                </div>
              </div>
              {formData.attributeType === "radio" ||
              formData.attributeType === "select" ||
              formData.attributeType === "checkbox" ? (
                <>
                  <hr className="mt-0 " style={{ color: "#c2c2c281" }} />
                  <div className="row d-flex justify-content-between align-items-center py-2 mb-3">
                    <div className="col-auto my-auto">
                      <h5 className="m-0 mb-1 fw-bold color-evaluation-dark-blue fs24px">
                        Attribute Options
                      </h5>
                    </div>
                    <div className="col-auto">
                      <Button
                        className="btn text-white fw-bold fs14px border-0"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, #0C8CE9 ,#074F83)",
                          borderRadius: "10px",
                        }}
                        type="button"
                        onClick={addNewOption}
                      >
                        Add More
                      </Button>
                    </div>
                  </div>
                  {optionsData.map((option, index) => (
                    <div
                      key={index}
                      className="row d-flex justify-content-end align-items-center"
                    >
                      <div
                        className="col-xl-2 col-lg-4 col-md-6 col-sm-6 text-start"
                        style={{ marginBottom: "10px", padding: "0px 10px" }}
                      >
                        <CustomLabel htmlFor={`value-${index}`}>
                          Value
                        </CustomLabel>
                        <CustomInput
                          id={`value-${index}`}
                          name="value"
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Value"
                        />
                        {/* <label
                          htmlFor={`value-${index}`}
                          className="form-label form-label-color-black fw-5 fs14px"
                          style={{ marginBottom: "6px" }}
                        >
                          Value
                        </label> */}
                        {/* <input
                          type="text"
                          className="form-control form-control-sm color-light-dark shadow-none"
                          style={{ background: "rgba(255, 255, 255, 0.8)" }}
                          id={`value-${index}`}
                          name="value"
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Value"
                        /> */}
                      </div>
                      <div
                        className="col-xl-2 col-lg-4 col-md-6 col-sm-6 text-start"
                        style={{ marginBottom: "10px", padding: "0px 10px" }}
                      >
                        {/* <label
                          htmlFor={`label-${index}`}
                          className="form-label form-label-color-black fw-5 fs14px"
                          style={{ marginBottom: "6px" }}
                        >
                          Label
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm color-light-dark shadow-none"
                          style={{ background: "rgba(255, 255, 255, 0.8)" }}
                          id={`label-${index}`}
                          name="label"
                          value={option.label}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Label"
                        /> */}
                        <CustomLabel htmlFor={`label-${index}`}>
                          Label
                        </CustomLabel>
                        <CustomInput
                          id={`label-${index}`}
                          name="label"
                          value={option.label}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Label"
                        />
                      </div>
                      <div
                        className="col-xl-2 col-lg-4 col-md-6 col-sm-6 text-start"
                        style={{ marginBottom: "10px", padding: "0px 10px" }}
                      >
                        {/* <label
                          htmlFor="sortId"
                          className="form-label form-label-color-black fw-5 fs14px"
                          style={{ marginBottom: "6px" }}
                        >
                          Sort Id
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm color-light-dark shadow-none"
                          style={{ background: "rgba(255, 255, 255, 0.8)" }}
                          id="sortId"
                          name="sortId"
                          value={option.sortId}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter sortId value"
                        /> */}
                        <CustomLabel htmlFor={`sortId-${index}`}>
                          sort Id
                        </CustomLabel>
                        <CustomInput
                          id={`sortId-${index}`}
                          name="sortId"
                          type="number"
                          value={option.sortId}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter sortId"
                        />
                      </div>
                      <div
                        className="col-xl-2 col-lg-4 col-md-6 col-sm-6 text-start"
                        style={{ marginBottom: "10px", padding: "0px 10px" }}
                      >
                        {/* <label
                          htmlFor={`condition-${index}`}
                          className="form-label form-label-color-black fw-5 fs14px"
                          style={{ marginBottom: "6px" }}
                        >
                          condition
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm color-light-dark shadow-none"
                          style={{ background: "rgba(255, 255, 255, 0.8)" }}
                          id={`condition-${index}`}
                          name="condition"
                          value={option.condition}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Condition"
                        /> */}
                        <CustomLabel htmlFor={`condition-${index}`}>
                          Condition
                        </CustomLabel>
                        <CustomInput
                          id={`condition-${index}`}
                          name="condition"
                          value={option.condition}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Condition"
                        />
                      </div>
                      <div
                        className="col-xl-2 col-lg-4 col-md-6 col-sm-6 text-start"
                        style={{ marginBottom: "10px", padding: "0px 10px" }}
                      >
                        {/* <label
                          htmlFor={`remarks-${index}`}
                          className="form-label form-label-color-black fw-5 fs14px"
                          style={{ marginBottom: "6px" }}
                        >
                          Description
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm color-light-dark shadow-none"
                          style={{ background: "rgba(255, 255, 255, 0.8)" }}
                          id={`remarks-${index}`}
                          name="remarks"
                          value={option.remarks}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Description"
                        /> */}
                        <CustomLabel htmlFor={`remarks-${index}`}>
                          Description
                        </CustomLabel>
                        <CustomInput
                          id={`remarks-${index}`}
                          name="remarks"
                          value={option.remarks}
                          onChange={(e) => handleOptionChange(index, e)}
                          placeholder="Enter Description"
                        />
                      </div>
                      <div
                        className="col-xl-1 col-lg-2 col-md-3 col-sm-6 col-6 text-start"
                        style={{ marginBottom: "10px", padding: "0px 10px" }}
                      >
                        <div className="d-flex flex-column justify-content-between">
                          <label
                            htmlFor={`remarks-${index}`}
                            className="form-label form-label-color-black fw-5 fs14px"
                            style={{ marginBottom: "6px" }}
                          >
                            Is Active
                          </label>
                          <div style={{ padding: "11px 0px 3px 0px" }}>
                            <CustomToggleSwitch
                              id={`isActive${index}`}
                              checked={activeStates[index] || false}
                              onChange={(checked) =>
                                handleCheckboxChange(index, checked)
                              }
                            />
                            {/* <input
                            className="form-check-input"
                            type="checkbox"
                            name="isActive"
                            id={`isActive${index}`}
                            checked={activeStates[index] || false}
                            onChange={(checked) => handleCheckboxChange(index, checked)}
                          /> */}
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-xl-1 col-lg-2 col-md-3 col-sm-6 col-6 text-start"
                        style={{ marginBottom: "10px", padding: "0px 10px" }}
                      >
                        <div className="d-flex flex-column justify-content-between">
                          <label
                            htmlFor={`remarks-${index}`}
                            className="form-label form-label-color-black fw-5 fs14px"
                            style={{ marginBottom: "6px" }}
                          >
                            Action
                          </label>
                          <div style={{ padding: "5px 0px 8px 0px" }}>
                            <Button
                              className="btn w-100 shadow-none p-0 text-start border-0"
                              type="button"
                              style={{ outline: "none" }}
                              onClick={() => handleDeleteOption(index)}
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                ""
              )}
              <SubmitButton>Save Attribute</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

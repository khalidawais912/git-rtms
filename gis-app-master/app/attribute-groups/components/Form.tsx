import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import CustomSelect, {
  defaultNumberOption,
  OptionType,
} from "@/app/components/Form/CustomSelect";
import CustomTextArea from "@/app/components/Form/CustomTextArea";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import ActionButton from "@/app/components/Table/ActionButton";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { SingleValue } from "react-select";
import { z } from "zod";
import CustomToggleSwitch from "@/app/components/CustomToggleSwitch";

const schema = z.object({
  id: z.number().optional().default(0),
  parentId: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Name!" }),
  description: z.string().optional().default(""),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
  sortId: z.number({ invalid_type_error: "Please add Sort Id!" }),
  group_type: z.number().optional().default(0),
  group_nature: z.number().optional().default(0),
});

type AttributeGroup = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  data: AttributeGroup[];
}

const Form = ({ api, method, id, setRefresh, refresh, data }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<AttributeGroup>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);
  const modalId = `formModal-${id}`;
  const [isGroupType, setGroupType] = useState(false);
  const [isGroupNature, setGroupNature] = useState(false);
  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    setGroupType(false);
    setGroupNature(false);
    if (method === "PUT") {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("parentId", itemData.parentId);
        setValue("name", itemData.name);
        setValue("description", itemData.description);
        setValue("sortId", itemData.sortId);
        setValue("group_type", itemData.group_type);
        setValue("group_nature", itemData.group_nature);
        setValue("createdAt", itemData.createdAt);
        setValue("updatedAt", new Date().toISOString());
        setGroupType(itemData.group_type === 1 ? true : false);
        setGroupNature(itemData.group_nature === 1 ? true : false);
      } catch (err) {
        console.log((err as AxiosError).message);
        // setError((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: AttributeGroup) => {
    console.log(errors);
    try {
      const modifiedFormData = {
        ...formData,
        parentId: formData.parentId === 0 ? null : formData.parentId, // Change 0 to null
        group_type: isGroupType ? 1 : 0,
        group_nature: isGroupNature ? 1 : 0,
      };
      console.log("modified Form Data:", modifiedFormData);

      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: modifiedFormData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  const parentIdOptions = [...(data || [])].reverse().map((d) => {
    return {
      value: d.id.toString(),
      label: d.name,
    };
  });

  return (
    <>
      <ActionButton
        onClick={handleShow}
        name="Attribute Group"
        method={method}
      />
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
        dialogClassName="custom-modal"
        id={modalId}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <FormWrapper
            heading={
              method === "POST"
                ? "Add Attribute Group"
                : "Update Attribute Group"
            }
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col-lg-4 col-md-6 col-sm-12 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="name">Name</CustomLabel>
                  <CustomInput
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Enter Attribute Group Name"
                  />
                  {errors.name && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="parentId">
                    Parent Attribute Group
                  </CustomLabel>
                  <Controller
                    name="parentId"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={[defaultNumberOption, ...parentIdOptions]}
                        closeMenuOnSelect={true}
                        value={
                          parentIdOptions.find(
                            (option) => option.value === String(field.value),
                          )
                            ? [
                                parentIdOptions.find(
                                  (option) =>
                                    option.value === String(field.value),
                                )!,
                              ]
                            : null
                        }
                        onChangeSingle={(selectedOption) => {
                          const singleOption =
                            selectedOption as SingleValue<OptionType>;
                          field.onChange(
                            singleOption ? Number(singleOption.value) : 0,
                          );
                        }}
                      />
                    )}
                  />
                  {/* <select
                    id="parentId"
                    {...register("parentId", { valueAsNumber: true })}
                    className="form-select form-select-sm color-light-dark"
                  >
                    <option value="0">None</option>
                    {[...(data || [])].reverse().map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select> */}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="sortId">Sort Id</CustomLabel>
                  <CustomInput
                    {...register("sortId", { valueAsNumber: true })}
                    id="sortId"
                    type="number"
                    placeholder="Enter Sort ID"
                  />
                  {errors.sortId && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.sortId.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-12 col-md-12 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px" }}
                >
                  <CustomLabel htmlFor="description">Description</CustomLabel>
                  <CustomTextArea
                    id="description"
                    {...register("description")}
                    placeholder="Write Brief Description..."
                  />
                </div>
              </div>
              <div className="row g-2 g-lg-3 mt-0">
                <div
                  className="col-auto text-start mt-0"
                  style={{ marginBottom: "16px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      id="group_type"
                      checked={isGroupType}
                      onChange={setGroupType}
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="group_type"
                    >
                      Group Type
                    </label>

                    {/* <input
                        className="form-check-input"
                        type="checkbox"
                        name="group_type"
                        id="group_type"
                        checked={isGroupType}
                        onChange={() => setGroupType(!isGroupType)}
                      /> */}
                  </div>
                </div>
                <div
                  className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 text-start mt-0"
                  style={{ marginBottom: "16px", padding: "0px 10px" }}
                >
                  <div className="d-flex align-items-center">
                    <CustomToggleSwitch
                      id="group_nature"
                      checked={isGroupNature}
                      onChange={setGroupNature}
                    />
                    <label
                      className="form-label form-label-color-black fs14px ms-2 mb-0"
                      htmlFor="group_nature"
                    >
                      Group Nature
                    </label>
                    {/* <input
                        className="form-check-input"
                        type="checkbox"
                        name="group_nature"
                        id="group_nature"
                        checked={isGroupNature}
                        onChange={() => setGroupNature(!isGroupNature)}
                      /> */}
                  </div>
                </div>
              </div>

              <SubmitButton>Save Attribute Group</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

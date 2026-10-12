"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import CustomSelect from "@/app/components/Form/CustomSelect";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import ActionButton from "@/app/components/Table/ActionButton";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { booleanOptions } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  id: z.number().optional().default(0),
  documentName: z.string().min(1, { message: "Please add Document Name!" }),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updateAt: z.string().optional().default(new Date().toISOString()),
});

export type ProjectDocumentName = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  data: ProjectDocumentName[];
  setData: React.Dispatch<React.SetStateAction<ProjectDocumentName[]>>;
}

const defaultValues: ProjectDocumentName = {
  id: 0,
  documentName: "",
  isActive: true,
  createdAt: new Date().toISOString(),
  updateAt: new Date().toISOString(),
};

const Form = ({ api, method, id, setRefresh, refresh, data }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectDocumentName>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const [show, setShow] = useState(false);

  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    if (method === "PUT") {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("documentName", itemData.documentName);
        setValue("isActive", itemData.isActive);
        setValue("createdAt", itemData.createdAt);
        setValue("updateAt", new Date().toISOString());
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: ProjectDocumentName) => {
    console.log("Form Data:", formData);
    console.log(errors);

    try {
      const response = await apiClient({
        method: method,
        url: api,
        data: formData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      // setData((prevData) => [...prevData, response.data.data]);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      <ActionButton
        name="Project Document Name"
        method={method}
        onClick={handleShow}
      />

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id={`formModal-${id}`}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <FormWrapper
            heading={
              method === "POST"
                ? "Add Project Document Name"
                : "Update Project Document Name"
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
                  <CustomLabel htmlFor="documentName">
                    Document Name
                  </CustomLabel>
                  <CustomInput
                    {...register("documentName")}
                    id="documentName"
                    type="text"
                    placeholder="Enter Document Name"
                  />
                  {errors.documentName && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.documentName.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel
                    inputNode={
                      <>
                        <Controller
                          name="isActive"
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              {...field}
                              options={booleanOptions}
                              closeMenuOnSelect={true}
                              // convert backend boolean to select
                              value={
                                field.value !== undefined
                                  ? booleanOptions.filter(
                                      (option) =>
                                        option.value === String(field.value),
                                    )
                                  : []
                              }
                              onChangeSingle={(selectedOption) => {
                                // convert "true" / "false" to real boolean
                                field.onChange(
                                  selectedOption?.value === "true",
                                );
                              }}
                            />
                          )}
                        />
                        <ErrorMessage>{errors.isActive?.message}</ErrorMessage>
                      </>
                    }
                  >
                    Active
                  </CustomLabel>
                </div>
              </div>

              <SubmitButton>Save Project Document Name</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

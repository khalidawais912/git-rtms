"use client";
import CustomInput from "@/components/Form/CustomInput";
import CustomLabel from "@/components/Form/CustomLabel";
import CustomSelect, { defaultNumberOption } from "@/components/Form/CustomSelect";
import { OptionType } from "@/components/types";
import CustomTextArea from "@/components/Form/CustomTextArea";
import FormWrapper from "@/components/Form/FormWrapper";
import SubmitButton from "@/components/Form/SubmitButton";
import ActionButton from "@/components/Table/ActionButton";
import apiClient, { AxiosError } from "@/services/client";
import { createdMessage, updatedMessage } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { SingleValue } from "react-select";
import { z } from "zod";

const schema = z.object({
  id: z.number().optional().default(0),
  parentId: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Name!" }),
  description: z.string().optional().default(""),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updateAt: z.string().optional().default(new Date().toISOString()),
  sortId: z.number({ invalid_type_error: "Please add Sort Id!" }),
});

type Sector = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  data: Sector[];
  setData: React.Dispatch<React.SetStateAction<Sector[]>>;
}

const SectorForm = ({ api, method, id, setRefresh, data }: Props) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<Sector>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    if (method === "PUT") {
      setSubmitting(true);
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("parentId", itemData.parentId);
        setValue("name", itemData.name);
        setValue("sortId", itemData.sortId);
        setValue("description", itemData.description);
        setValue("createdAt", itemData.createdAt);
        setValue("updateAt", new Date().toISOString());
        setSubmitting(false);
      } catch (err) {
        console.error((err as AxiosError).message);
        toast.error((err as AxiosError).message);
        setSubmitting(false);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const onSubmit = async (formData: Sector) => {

    const modifiedFormData = {
      ...formData,
      parentId: formData.parentId === 0 ? null : formData.parentId,
    };
    try {
      await apiClient({
        method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: modifiedFormData,
      });
      setRefresh((prev) => !prev);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  const parentIdOptions: OptionType[] = data?.map((d) => {
    return {
      value: d.id.toString(),
      label: d.name,
    };
  });

  return (
    <>
      <ActionButton name="Sector" method={method} onClick={handleShow} />

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
            heading={method === "POST" ? "Add Sector" : "Update Sector"}
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
                    placeholder="Enter Sector Name"
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
                  <CustomLabel htmlFor="parentId">Parent Sector</CustomLabel>
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
                            : []
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
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="sortId">Sort ID</CustomLabel>
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
              </div>
              <div
                className="col text-start mt-0"
                style={{ marginBottom: "10px" }}
              >
                <CustomLabel htmlFor="description">Description</CustomLabel>
                <CustomTextArea
                  id="description"
                  {...register("description")}
                  placeholder="Write Brief Description..."
                />
              </div>
              <SubmitButton disabled={isSubmitting}>Save Sector</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SectorForm;

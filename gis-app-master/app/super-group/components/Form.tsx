import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import more from "../../../public/icons/more.svg";
// import { ToastContainer, toast } from "react-toastify";
import Button from "@/app/components/Button";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { FiPlus } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import ActionButton from "@/app/components/Table/ActionButton";

const schema = z.object({
  id: z.number().optional().default(0),
  superGroupLabel: z
    .string()
    .min(1, { message: "Please add Super Group Label!" }),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type SuperGroup = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = ({ api, method, id, setRefresh }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SuperGroup>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);
  const modalId = `formModal-${id}`;

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
        setValue("superGroupLabel", itemData.superGroupLabel);
        setValue("createdAt", itemData.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (err) {
        console.log((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: SuperGroup) => {
    console.log("Form Data:", formData);
    console.log(errors);
    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: formData,
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

  return (
    <>
      <ActionButton name="Super Group" method={method} onClick={handleShow} />

      <Modal
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
            heading={
              method === "POST" ? "Add Super Group" : "Update Super Group"
            }
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="col text-start mt-0"
                style={{ marginBottom: "10px" }}
              >
                <CustomLabel htmlFor="superGroupLabel">
                  Super Group Label
                </CustomLabel>
                <CustomInput
                  {...register("superGroupLabel")}
                  id="superGroupLabel"
                  type="text"
                  placeholder="Enter Super Group Label"
                />
                {errors.superGroupLabel && (
                  <p className="text-danger mt-1 fs14px">
                    {errors.superGroupLabel.message}
                  </p>
                )}
              </div>
              <SubmitButton>Save Super Group</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

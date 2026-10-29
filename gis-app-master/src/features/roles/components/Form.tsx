import CustomInput from "@/components/Form/CustomInput";
import CustomLabel from "@/components/Form/CustomLabel";
import FormWrapper from "@/components/Form/FormWrapper";
import SubmitButton from "@/components/Form/SubmitButton";
import ActionButton from "@/components/Table/ActionButton";
import apiClient, { AxiosError } from "@/services/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Name!" }),
  normalizedName: z.string().optional().default(""),
  concurrencyStamp: z.string().optional().default(""),
});

type Role = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const Form = ({ api, method, id, setRefresh }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Role>({ resolver: zodResolver(schema) });
  const modalId = `formModal-${id}`;
  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);

    if (method === "PUT") {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("name", itemData.name);
        setValue("normalizedName", itemData.normalizedName);
        setValue("concurrencyStamp", itemData.concurrencyStamp);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onSubmit = async (formData: Role) => {
    try {
      await apiClient({
        method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: formData,
      });
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
      <ActionButton onClick={handleShow} method={method} name="Role" />

      <Modal
        size="lg"
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
          <FormWrapper heading={method === "POST" ? "Add Role" : "Update Role"}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="name">Name</CustomLabel>
                  <CustomInput
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Enter Role Name"
                  />
                  {errors.name && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="normalizedName">
                    Normalized Name
                  </CustomLabel>
                  <CustomInput
                    {...register("normalizedName")}
                    id="normalizedName"
                    type="text"
                    placeholder="Enter Normalized Name"
                  />
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="concurrencyStamp">
                    Concurrency Stamp
                  </CustomLabel>
                  <CustomInput
                    {...register("concurrencyStamp")}
                    id="concurrencyStamp"
                    type="text"
                    placeholder="Enter Concurrency Stamp"
                  />
                </div>
              </div>
              <SubmitButton>Save Role</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

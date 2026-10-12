import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import ActionButton from "@/app/components/Table/ActionButton";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  rightId: z.number().optional().default(0),
  rightName: z.string().min(1, { message: "Please add Right Name!" }),
  rightIdentifier: z.string().optional().default(""),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type Right = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Right>({ resolver: zodResolver(schema) });
  // console.log(errors);
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
        const response = await apiClient.get(api);
        const itemData = response.data.data;
        const data = itemData.find((item: any) => item.rightId === id);
        setValue("rightId", data.rightId);
        setValue("rightName", data.rightName);
        setValue("rightIdentifier", data.rightIdentifier);
        setValue("createdAt", data.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmit = async (formData: Right) => {
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
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      <ActionButton onClick={handleShow} method={method} name="Right" />

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
            heading={method === "POST" ? "Add Right" : "Update Right"}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="rightName">Right Name</CustomLabel>
                  <CustomInput
                    {...register("rightName")}
                    id="rightName"
                    type="text"
                    placeholder="Enter Right Name"
                  />
                  {/* <label htmlFor="rightName" className="form-label text-white">
                    Right Name
                  </label>
                  <input
                    {...register("rightName")}
                    id="rightName"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Right Name"
                  /> */}
                  {errors.rightName && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.rightName.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="rightIdentifier">
                    Right Identifier
                  </CustomLabel>
                  <CustomInput
                    {...register("rightIdentifier")}
                    id="rightIdentifier"
                    type="text"
                    placeholder="Enter Right Identifier"
                  />

                  {/* <label
                    htmlFor="rightIdentifier"
                    className="form-label text-white"
                  >
                    Right Identifier
                  </label>
                  <input
                    {...register("rightIdentifier")}
                    id="rightIdentifier"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Right Identifier"
                  /> */}
                </div>
              </div>
              <SubmitButton>Save Right</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

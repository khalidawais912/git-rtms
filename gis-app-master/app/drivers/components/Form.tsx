import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import ActionButton from "@/app/components/Table/ActionButton";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TbFileUpload } from "react-icons/tb";
import { z } from "zod";

const schema = z.object({
  id: z.number().optional().default(0),
  user_Id: z.number().optional().default(0),
  driverName: z.string().min(1, { message: "Please add Driver Name!" }),
  mobileNumber: z.string().min(1, { message: "Please add Phone Number!" }),
  driverImage: z.string().optional().default(""),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type Driver = z.infer<typeof schema>;

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
  } = useForm<Driver>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();

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
        setValue("user_Id", itemData.user_Id);
        setValue("driverName", itemData.driverName);
        setValue("mobileNumber", itemData.mobileNumber);
        setValue("driverImage", itemData.driverImage);
        setValue("createdAt", itemData.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: Driver) => {
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("Dropped file:", e.dataTransfer.files[0]);
      setSelectedFile(e.dataTransfer.files[0]);
      // Do your upload logic here
    }
  };

  return (
    <>
      <ActionButton onClick={handleShow} method={method} name="Driver" />

      <Modal
        show={show}
        size="lg"
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
            heading={method === "POST" ? "Add Driver" : "Update Driver"}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="cursor-pointer"
                style={{
                  padding: "10px 24px",
                  borderRadius: "15px",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1.5px solid #EFF0F2",
                  marginBottom: "10px",
                }}
                onClick={handleClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <CustomInput
                  ref={fileInputRef}
                  id="profilePicture"
                  type="file"
                  className="d-none"
                  placeholder="Choose Profile Picture"
                  // onChange={handleFileChange}
                  accept="image/*"
                />
                <div className="row d-flex justify-content-center ">
                  <div className="col-auto">
                    <div
                      className="d-flex justify-content-center align-items-center rounded-circle"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "#EEF2FF",
                      }}
                    >
                      <TbFileUpload
                        size={24}
                        className="color-evaluation-theme-blue"
                      />
                    </div>
                  </div>
                  <div className="col-auto">
                    <span className="fs14px fw-bold color-evaluation-theme-blue">
                      Click here{" "}
                    </span>
                    to upload your file or drag.
                    <p className="m-0" style={{ color: "#94A3B8" }}>
                      {selectedFile
                        ? selectedFile.name
                        : "Supported Format: JPG, PNG (10mb each)"}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="driverName">Driver Name</CustomLabel>
                  <CustomInput
                    {...register("driverName")}
                    id="driverName"
                    type="text"
                    placeholder="Enter Driver Name"
                  />
                  {/* <label htmlFor="driverName" className="form-label text-white">
                    Driver Name
                  </label>
                  <input
                    {...register("driverName")}
                    id="driverName"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Driver Name"
                  /> */}
                  {errors.driverName && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.driverName.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="mobileNumber">
                    Mobile Number
                  </CustomLabel>
                  <CustomInput
                    {...register("mobileNumber")}
                    id="mobileNumber"
                    type="text"
                    placeholder="Enter Mobile Number"
                  />
                  {/* <label
                    htmlFor="mobileNumber"
                    className="form-label text-white"
                  >
                    Mobile Number
                  </label>
                  <input
                    {...register("mobileNumber")}
                    id="mobileNumber"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Mobile Number"
                  /> */}
                  {errors.mobileNumber && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="user_Id">User Id</CustomLabel>
                  <CustomInput
                    {...register("user_Id", { valueAsNumber: true })}
                    id="user_Id"
                    type="number"
                    placeholder="Enter User Id"
                  />

                  {/* <label htmlFor="user_Id" className="form-label text-white">
                    User Id
                  </label>
                  <input
                    {...register("user_Id", { valueAsNumber: true })}
                    id="user_Id"
                    type="number"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter User Id"
                    disabled
                    value={0}
                  /> */}
                  {errors.user_Id && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.user_Id.message}
                    </p>
                  )}
                </div>
                {/* <div
                  className="col-lg-4 col-md-6 col-sm-12  text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="driverImage">Driver Image</CustomLabel>
                  <CustomInput
                    {...register("driverImage")}
                    id="driverImage"
                    type="file"
                    placeholder="Choose Driver Image"
                  />
                </div> */}
              </div>
              <SubmitButton>Save Driver</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

import Button from "@/app/components/Button";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import more from "../../../public/icons/more.svg";
import ActionButton from "@/app/components/Table/ActionButton";
import { TbFileUpload } from "react-icons/tb";

const schema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Name!" }),
  description: z.string().min(1, { message: "Please add Description!" }),
  vehicleNumber: z.string().min(1, { message: "Please add Vehicle Number!" }),
  model: z.string().min(1, { message: "Please add Model!" }),
  color: z.string().min(1, { message: "Please add Color!" }),
  trasnmission: z.string().min(1, { message: "Please add Transmission!" }),
  seatsCapacity: z
    .number({ invalid_type_error: "Please add Seats Capacity!" })
    .min(1, { message: "Please add Seats Capacity!" }),
  fuelType: z.string().min(1, { message: "Please add Fuel Type!" }),
  vehicleImage: z.string().default("").nullable(),
  vehicleIcon: z.string().default("").nullable(),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type Vehicle = z.infer<typeof schema>;

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
  } = useForm<Vehicle>({ resolver: zodResolver(schema) });
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
        setValue("name", itemData.name);
        setValue("description", itemData.description);
        setValue("vehicleNumber", itemData.vehicleNumber);
        setValue("model", itemData.model);
        setValue("color", itemData.color);
        setValue("trasnmission", itemData.trasnmission);
        setValue("seatsCapacity", itemData.seatsCapacity);
        setValue("fuelType", itemData.fuelType);
        setValue("vehicleImage", itemData.vehicleImage);
        setValue("vehicleIcon", itemData.vehicleIcon);
        setValue("createdAt", itemData.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: Vehicle) => {
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
      <ActionButton onClick={handleShow} method={method} name="Vehicle" />

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
            heading={method === "POST" ? "Add Vehicle" : "Update Vehicle"}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-2 g-lg-3 mt-0">
                <div
                  className="col-12 col-sm-12 col-md-6 col-lg-8"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
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
                          Choose Vehicle Image{" "}
                        </span>
                        <p className="m-0" style={{ color: "#94A3B8" }}>
                          {selectedFile
                            ? selectedFile.name
                            : "Supported: JPG, PNG (10mb each)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-12 col-sm-12 col-md-6 col-lg-4"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
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
                          Choose Icon{" "}
                        </span>
                        <p className="m-0" style={{ color: "#94A3B8" }}>
                          {selectedFile ? selectedFile.name : "Format: PNG"}
                        </p>
                      </div>
                    </div>
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
                  <CustomLabel htmlFor="name">Name</CustomLabel>
                  <CustomInput
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Enter Name"
                  />
                  {/* <label htmlFor="name" className="form-label text-white">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Name"
                  /> */}
                  {errors.name && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="description">Description</CustomLabel>
                  <CustomInput
                    {...register("description")}
                    id="description"
                    type="text"
                    placeholder="Enter Description"
                  />
                  {/* <label
                    htmlFor="description"
                    className="form-label text-white"
                  >
                    Description
                  </label>
                  <input
                    {...register("description")}
                    id="description"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Description"
                  /> */}
                  {errors.description && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="vehicleNumber">
                    Vehicle Number
                  </CustomLabel>
                  <CustomInput
                    {...register("vehicleNumber")}
                    id="vehicleNumber"
                    type="text"
                    placeholder="Enter Vehicle Number"
                  />
                  {/* <label
                    htmlFor="vehicleNumber"
                    className="form-label text-white"
                  >
                    Vehicle Number
                  </label>
                  <input
                    {...register("vehicleNumber")}
                    id="vehicleNumber"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter vehicleNumber"
                  /> */}
                  {errors.vehicleNumber && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.vehicleNumber.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="model">Model</CustomLabel>
                  <CustomInput
                    {...register("model")}
                    id="model"
                    type="text"
                    placeholder="Enter Model"
                  />
                  {/* <label htmlFor="model" className="form-label text-white">
                    Model
                  </label>
                  <input
                    {...register("model")}
                    id="model"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Model"
                  /> */}
                  {errors.model && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.model.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="color">Color</CustomLabel>
                  <CustomInput
                    {...register("color")}
                    id="color"
                    type="text"
                    placeholder="Enter Color"
                  />
                  {/* <label htmlFor="color" className="form-label text-white">
                    Color
                  </label>
                  <input
                    {...register("color")}
                    id="color"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Color"
                  /> */}
                  {errors.color && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.color.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="trasnmission">Trasnmission</CustomLabel>
                  <CustomInput
                    {...register("trasnmission")}
                    id="trasnmission"
                    type="text"
                    placeholder="Enter Trasnmission"
                  />
                  {/* <label
                    htmlFor="trasnmission"
                    className="form-label text-white"
                  >
                    Trasnmission
                  </label>
                  <input
                    {...register("trasnmission")}
                    id="trasnmission"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Trasnmission"
                  /> */}
                  {errors.trasnmission && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.trasnmission.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="seatsCapacity">
                    Seats Capacity
                  </CustomLabel>
                  <CustomInput
                    {...register("seatsCapacity", { valueAsNumber: true })}
                    id="seatsCapacity"
                    type="number"
                    placeholder="Enter Seats Capacity"
                  />
                  {/* <label
                    htmlFor="seatsCapacity"
                    className="form-label text-white"
                  >
                    Seats Capacity
                  </label>
                  <input
                    {...register("seatsCapacity", { valueAsNumber: true })}
                    id="seatsCapacity"
                    type="number"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Seats Capacity"
                  /> */}
                  {errors.seatsCapacity && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.seatsCapacity.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="fuelType">Fuel Type</CustomLabel>
                  <CustomInput
                    {...register("fuelType")}
                    id="fuelType"
                    type="text"
                    placeholder="Enter Fuel Type"
                  />
                  {/* <label htmlFor="fuelType" className="form-label text-white">
                    Fuel Type
                  </label>
                  <input
                    {...register("fuelType")}
                    id="fuelType"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter fuel Type"
                  /> */}
                  {errors.fuelType && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.fuelType.message}
                    </p>
                  )}
                </div>
                {/* <div
                  className="col-lg-4 col-md-6 col-sm-12  text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="vehicleImage">
                    Vehicle Image
                  </CustomLabel>
                  <CustomInput
                    {...register("vehicleImage")}
                    id="vehicleImage"
                    type="file"
                    placeholder="Enter Vehicle Image"
                    disabled
                  />
                  {errors.vehicleImage && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.vehicleImage.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12  text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="vehicleIcon">Vehicle Icon</CustomLabel>
                  <CustomInput
                    {...register("vehicleIcon")}
                    id="vehicleIcon"
                    type="file"
                    placeholder="Enter Vehicle Icon"
                    disabled
                  />
                  {errors.vehicleIcon && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.vehicleIcon.message}
                    </p>
                  )}
                </div> */}
              </div>
              <SubmitButton>Save Vehicle</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

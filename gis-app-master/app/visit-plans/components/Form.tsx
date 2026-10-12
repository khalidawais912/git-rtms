"use client";
import CustomCalendar from "@/app/components/Form/CustomCalender";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import ActionButton from "@/app/components/Table/ActionButton";
import { Authentication } from "@/app/hooks/useAuthentication";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  id: z.number().optional().default(0),
  department_Id: z.number().optional().default(1),
  name: z.string().min(1, { message: "Please add Name!" }),
  tourStartDate: z.string().optional().default(new Date().toISOString()),
  tourEndDate: z.string().optional().default(new Date().toISOString()),
  approvalDate: z.string().optional().default(new Date().toISOString()),
  createdDate: z.string().optional().default(new Date().toISOString()),
  updatedDate: z.string().optional().default(new Date().toISOString()),
  createdBy: z.number().default(0),
  updatedBy: z.number().default(0),
});

type TourPlan = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  setData: React.Dispatch<React.SetStateAction<TourPlan[]>>;
  users: Authentication[];
}

const Form = ({
  api,
  method,
  id,
  setRefresh,
  refresh,
  setData,
  users,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm<TourPlan>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);

  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    const userName = Cookies.get("userName");
    if (userName) {
      setUserName(userName);
      const userId = users.find((user) => user.userName === userName)?.id;
      setUserId(userId ? userId : 1);
    }
    console.log(userId);
    console.log(userName);

    setShow(true);
    if (method === "PUT" && userId) {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("name", itemData.name);
        setValue("tourStartDate", itemData.tourStartDate);
        setValue("tourEndDate", itemData.tourEndDate);
        setValue("approvalDate", itemData.approvalDate);
        setValue("createdDate", itemData.createdAt);
        setValue("updatedDate", new Date().toISOString());
        setValue("createdBy", itemData.userId ? itemData.userId : 0);
        setValue("updatedBy", userId);
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: TourPlan) => {
    console.log("Form Data:", formData);
    console.log(errors);

    const modifiedFormData = {
      ...formData,
      updatedBy: userId,
    };
    console.log("modifiedFormData", modifiedFormData);
    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: modifiedFormData,
      });
      console.log("Response:", response);
      setData((prevData) => [...prevData, response.data.data]);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      <ActionButton onClick={handleShow} method={method} name="Visit Plan" />

      <Modal
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
            heading={method === "POST" ? "Add Visit Plan" : "Update Visit Plan"}
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
                    placeholder="Enter TourPlan Name"
                  /> */}
                  {errors.name && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="tourStartDate">
                    Tour Start Date
                  </CustomLabel>
                  <Controller
                    name="tourStartDate"
                    control={control}
                    render={({ field }) => (
                      <CustomCalendar
                        {...field}
                        value={field.value}
                        onChange={(date) => field.onChange(date.toISOString())}
                      />
                    )}
                  />
                  {/* <label
                    htmlFor="tourStartDate"
                    className="form-label text-white"
                  >
                    Tour Start Date
                  </label>
                  <input
                    {...register("tourStartDate")}
                    id="tourStartDate"
                    type="date"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Tour Start Date"
                  /> */}
                  {errors.tourStartDate && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.tourStartDate.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="tourEndDate">Tour End Date</CustomLabel>
                  <Controller
                    name="tourEndDate"
                    control={control}
                    render={({ field }) => (
                      <CustomCalendar
                        {...field}
                        value={field.value}
                        onChange={(date) => field.onChange(date.toISOString())}
                      />
                    )}
                  />
                  {/* <label
                    htmlFor="tourEndDate"
                    className="form-label text-white"
                  >
                    Tour End Date
                  </label>
                  <input
                    {...register("tourEndDate")}
                    id="tourEndDate"
                    type="date"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Tour End Date"
                  /> */}
                  {errors.tourEndDate && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.tourEndDate.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="approvalDate">
                    Approval Date
                  </CustomLabel>
                  <Controller
                    name="approvalDate"
                    control={control}
                    render={({ field }) => (
                      <CustomCalendar
                        {...field}
                        value={field.value}
                        onChange={(date) => field.onChange(date.toISOString())}
                      />
                    )}
                  />
                  {/* <label
                    htmlFor="approvalDate"
                    className="form-label text-white"
                  >
                    Approval Date
                  </label>
                  <input
                    {...register("approvalDate")}
                    id="approvalDate"
                    type="date"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Approval Date"
                  /> */}
                  {errors.approvalDate && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.approvalDate.message}
                    </p>
                  )}
                </div>
              </div>

              <SubmitButton>Save Visit Plan</SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

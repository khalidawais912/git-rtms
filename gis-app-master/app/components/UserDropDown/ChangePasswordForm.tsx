"use client";
import { AUTH_API } from "@/app/APIs";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomLabel from "@/app/components/Form/CustomLabel";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { updatedMessage } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineLockReset } from "react-icons/md";
import { TbEyeClosed } from "react-icons/tb";
import { z } from "zod";
import Button from "../Button";
import Spinner from "../Spinner";

const schema = z.object({
  UserName: z.string().min(1, { message: "Please add Username!" }),
  Password: z
    .string()
    .min(8, { message: "Please add Password!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/\d/, { message: "Password must contain atleast on number!" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least on special character!",
    }),
});

type ChangePassword = z.infer<typeof schema>;

const ChangePasswordForm = ({ userName }: { userName: string }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ChangePassword>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);
  const [buttonType, setButtonType] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    if (userName) {
      setValue("UserName", userName);
    }
  };

  const onSubmit = async (formData: ChangePassword) => {
    console.log("Form Data:", formData);
    console.log(errors);

    setSubmitting(true);
    try {
      const response = await apiClient.post(
        `${AUTH_API}/ChangePassword?UserName=${formData.UserName}&Password=${formData.Password}`
      );
      console.log("Response:", response);
      toast.success(`Password ${updatedMessage}`);
      setSubmitting(false);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn text-nowrap fs12px shadow-none text-start w-100"
        style={{ padding: "6px 16px" }}
      >
        <MdOutlineLockReset size={20} className="me-2 mb-1" />
        Change Password
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id={`change-password`}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <FormWrapper heading="Change Password">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col-lg-4 col-md-6 col-sm-12 col-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="username">User Name</CustomLabel>
                  <CustomInput
                    disabled
                    defaultValue={userName}
                    id="username"
                    type="text"
                  />
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12 col-12 text-start mt-0">
                  <CustomLabel htmlFor="password">Password</CustomLabel>
                  <div className="input-group mb-1 position-relative">
                    <CustomInput
                      {...register("Password")}
                      id="password"
                      type={buttonType === true ? "password" : "text"}
                      style={{
                        background: "rgba(255, 255, 255, 0.7)",
                      }}
                      placeholder="Enter your Password"
                      autoComplete="current-password"
                    />
                    <Button
                      className="btn p-0 position-absolute rounded-pill shadow-none"
                      style={{ top: 8, zIndex: 3, right: 10 }}
                      type="button"
                      onClick={() => setButtonType(!buttonType)}
                    >
                      {buttonType ? <TbEyeClosed /> : <FaRegEye />}
                    </Button>
                  </div>
                  {errors.Password && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.Password.message}
                    </p>
                  )}
                </div>
              </div>

              <SubmitButton disabled={isSubmitting}>
                Save Password &nbsp;{" "}
                {isSubmitting && <Spinner color="text-light" />}
              </SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChangePasswordForm;

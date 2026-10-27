import { Agreement03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomInput from "@/shared/components/Form/CustomInput";
import FormWrapper from "@/shared/components/Form/FormWrapper";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient, { AxiosError } from "@/shared/api/client";
import { USER_API } from "@/shared/api/endpoints";
import { toast } from "react-toastify";
import { updatedMessage } from "@/shared/utils";
import Button from "@/shared/components/Button";
import SubmitButton from "@/shared/components/Form/SubmitButton";
import CustomLabel from "@/shared/components/Form/CustomLabel";

// FileList only exists in the browser, so check it lazily to keep SSR from crashing
const fileList = z.custom<FileList>(
  (value) => typeof FileList !== "undefined" && value instanceof FileList,
);

const schema = z.object({
  profilePicture: fileList.refine(
    (files) => files.length > 0,
    "Profile picture is required",
  ),
  signature: fileList.refine(
    (files) => files.length > 0,
    "Signature is required",
  ),
});

type UpdateUserProfile = z.infer<typeof schema>;

interface Props {
  userId: number;
}

const UploadProfileImgAndSign = ({ userId }: Props) => {
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserProfile>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = () => {
    setShow(true);
  };

  const onSubmit = async (data: UpdateUserProfile) => {
    try {
      const formData = new FormData();

      formData.append("userId", userId.toString());
      formData.append("profilePicture", data.profilePicture[0]);
      formData.append("signature", data.signature[0]);

      const response = await apiClient.put(
        USER_API + "/UpdateUserProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Response:", response);

      toast.success(updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);

      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn text-nowrap fs12px shadow-none text-start w-100"
        style={{ padding: "6px 16px" }}
      >
        <HugeiconsIcon icon={Agreement03Icon} size={20} className="me-2 mb-1" />
        Upload Sign
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id="upload-sign"
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <FormWrapper heading="Upload Sign">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="uploadprofile">Profile Pic</CustomLabel>

                  <CustomInput
                    id="uploadprofile"
                    type="file"
                    {...register("profilePicture")}
                  />

                  {errors.profilePicture && (
                    <div className="text-danger">
                      {errors.profilePicture.message}
                    </div>
                  )}
                </div>
                <div
                  className="col text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="signature">Signature</CustomLabel>

                  <CustomInput
                    id="uploadSign"
                    type="file"
                    {...register("signature")}
                  />

                  {errors.signature && (
                    <div className="text-danger">
                      {errors.signature.message}
                    </div>
                  )}
                </div>
              </div>

              <SubmitButton disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
              </SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UploadProfileImgAndSign;

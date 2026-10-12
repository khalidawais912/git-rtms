import Button from "@/shared/components/Button";
import CustomInput from "@/shared/components/Form/CustomInput";
import CustomLabel from "@/shared/components/Form/CustomLabel";
import CustomSelect, {
  defaultNumberOption,
  defaultOption,
  OptionType,
} from "@/shared/components/Form/CustomSelect";
import FormWrapper from "@/shared/components/Form/FormWrapper";
import SubmitButton from "@/shared/components/Form/SubmitButton";
import Spinner from "@/shared/components/Spinner";
import ActionButton from "@/shared/components/Table/ActionButton";
import useDepartments from "@/features/departments/hooks";
import { Role } from "@/app/hooks/useRoles";
import apiClient, {
  AxiosError,
  ErrorResponse,
} from "@/shared/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEye } from "react-icons/fa";
import { TbEyeClosed, TbFileUpload } from "react-icons/tb";
import { SingleValue } from "react-select";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .min(1, { message: "Please add Name!" })
    .regex(/^\S*$/, { message: "Username should not contain spaces!" }),
  email: z.string().email({ message: "Please enter valid email!" }),
  password: z
    .string()
    .min(8, { message: "Please add Password!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/\d/, { message: "Password must contain atleast on number!" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least on special character!",
    }),
  roleID: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : String(val)),
      z.string({ invalid_type_error: "Please add Role Id!" }),
    )
    .optional()
    .default(""),

  userProfile: z.object({
    id: z.number().optional().default(0),
    department_Id: z.number().optional().default(0),
    user_Id: z.number().optional().default(0),
    firstName: z.string().min(1, { message: "Please add First Name!" }),
    lastName: z.string().min(1, { message: "Please add Last Name!" }),
    profilePicture: z.string().optional().default(""),
    designation: z.string().optional().default(""),
    budget_Code: z.string().optional().default(""),
    vendor_Code: z.string().optional().default(""),
    bps: z.number().optional().default(0),
    status: z.boolean().optional().default(true),
    section: z.string().optional().default(""),
  }),
});

type User = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  roles: Role[];
}

const Form = ({ api, method, id, setRefresh, refresh, roles }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<User>({ resolver: zodResolver(schema) });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [buttonType, setButtonType] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const { data: departments } = useDepartments();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedFile(file);
    }
  };

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
    setPreviewUrl(null);
    if (method === "PUT") {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("username", itemData.username);
        setValue("email", itemData.email);
        setValue("password", itemData.password);
        setValue("roleID", itemData.roleID);
        setValue(
          "userProfile.department_Id",
          itemData.userProfile?.department_Id ?? 0,
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmit = async (formData: User) => {
    setSubmitting(true);
    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: formData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      setSubmitting(false);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitting(false);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const roleIdOptions: OptionType[] = roles?.map((d) => {
    return {
      value: d.id.toString(),
      label: d.name,
    };
  });

  const departmentOptions: OptionType[] = departments?.map((d) => {
    return {
      value: d.id.toString(),
      label: d.name,
    };
  });

  const bpsOptions: OptionType[] = Array.from(
    { length: 22 },
    (_, i) => i + 1,
  ).map((d) => {
    return {
      value: d.toString(),
      label: d.toString(),
    };
  });

  const sectionOptions: OptionType[] = ["M", "E"].map((d) => {
    return {
      value: d.toString(),
      label: d.toString(),
    };
  });

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
      <ActionButton name="User" method={method} onClick={handleShow} />

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
          <FormWrapper heading={method === "POST" ? "Add User" : "Update User"}>
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
                  onChange={handleFileChange}
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
                  <CustomLabel htmlFor="firstName">First Name</CustomLabel>
                  <CustomInput
                    {...register("userProfile.firstName")}
                    id="firstName"
                    type="text"
                    placeholder="Enter first Name"
                  />
                  {/* <input
                      {...register("userProfile.firstName")}
                      id="firstName"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter first Name"
                    /> */}
                  {errors?.userProfile?.firstName && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.userProfile.firstName.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="lastName">Last Name</CustomLabel>
                  <CustomInput
                    {...register("userProfile.lastName")}
                    id="lastName"
                    type="text"
                    placeholder="Enter Last Name"
                  />
                  {errors?.userProfile?.lastName && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.userProfile.lastName.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="username">UserName</CustomLabel>
                  <CustomInput
                    {...register("username")}
                    id="username"
                    type="text"
                    placeholder="Enter UserName"
                    autoComplete="username"
                  />
                  {/* <label htmlFor="username" className="form-label text-white">
                      UserName
                    </label>
                    <input
                      {...register("username")}
                      id="username"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter User Name"
                      autoComplete="username"
                    /> */}
                  {errors.username && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="email">Email</CustomLabel>
                  <CustomInput
                    {...register("email")}
                    id="email"
                    type="text"
                    placeholder="Enter Email"
                    autoComplete="email"
                  />
                  {/* <label htmlFor="email" className="form-label text-white">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Email"
                      autoComplete="email"
                    /> */}
                  {errors.email && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="designation">Designation</CustomLabel>
                  <CustomInput
                    {...register("userProfile.designation")}
                    id="designation"
                    type="text"
                    placeholder="Enter Designation"
                  />
                  {/* <label
                      htmlFor="designation"
                      className="form-label text-white"
                    >
                      Designation
                    </label>
                    <input
                      {...register("userProfile.designation")}
                      id="designation"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Designation"
                    /> */}
                  {errors?.userProfile?.designation && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.userProfile.designation.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="roleID">Role</CustomLabel>
                  <Controller
                    name="roleID"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={[defaultOption, ...roleIdOptions]}
                        closeMenuOnSelect={true}
                        value={
                          roleIdOptions.find(
                            (option) => option.value === String(field.value),
                          )
                            ? [
                                roleIdOptions.find(
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

                  {/* <label htmlFor="roleID" className="form-label text-white">
                      Role
                    </label> */}
                  {/* <select
                      id="roleID"
                      {...register("roleID", { valueAsNumber: true })}
                      className="form-select form-select-sm color-light-dark"
                    >
                      <option value="">None</option>
                      {roles?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select> */}
                  {errors.roleID && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.roleID.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="userProfile.department_Id">
                    Department
                  </CustomLabel>
                  <Controller
                    name="userProfile.department_Id"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        id="userProfile.department_Id"
                        closeMenuOnSelect={true}
                        options={[defaultNumberOption, ...departmentOptions]}
                        value={
                          departmentOptions.find(
                            (option) => option.value === String(field.value),
                          )
                            ? [
                                departmentOptions.find(
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
                  {errors?.userProfile?.department_Id && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.userProfile.department_Id.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <div className="position-relative">
                    <CustomLabel htmlFor="password">Password</CustomLabel>
                    <CustomInput
                      {...register("password")}
                      id="password"
                      type={buttonType === true ? "password" : "text"}
                      placeholder="Enter password"
                      autoComplete="new-password"
                    />
                    {/* <label
                        htmlFor="password"
                        className="form-label text-white"
                      >
                        Password
                      </label>
                      <input
                        {...register("password")}
                        id="password"
                        type={buttonType === true ? "password" : "text"}
                        className="form-control form-control-sm color-light-dark"
                        placeholder="Enter Password"
                        autoComplete="new-password"
                      /> */}
                    <Button
                      className="btn position-absolute rounded-3"
                      style={{ top: 32, zIndex: 3, right: 5 }}
                      type="button"
                      onClick={() => setButtonType(!buttonType)}
                    >
                      {buttonType ? (
                        <TbEyeClosed className="color-light-dark" size={20} />
                      ) : (
                        <FaRegEye className="color-light-dark" size={20} />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="userProfile.bps">BPS</CustomLabel>
                  <Controller
                    name="userProfile.bps"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        id="userProfile.bps"
                        closeMenuOnSelect={true}
                        options={[defaultNumberOption, ...bpsOptions]}
                        maxHeight={43 * 4}
                        value={
                          bpsOptions.find(
                            (option) => option.value === String(field.value),
                          )
                            ? [
                                bpsOptions.find(
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
                  {/* <label htmlFor="bps" className="form-label text-white">
                      BPS
                    </label>
                    <select
                      id="bps"
                      {...register("userProfile.bps", { valueAsNumber: true })}
                      className="form-select form-select-sm color-light-dark"
                    >
                      <option value="0">None</option>
                      {Array.from({ length: 22 }, (_, i) => i + 1)?.map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        )
                      )}
                    </select> */}
                  {errors?.userProfile?.bps && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.userProfile.bps.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="userProfile.section">
                    Section
                  </CustomLabel>
                  <Controller
                    name="userProfile.section"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        id="userProfile.section"
                        closeMenuOnSelect={true}
                        options={[defaultOption, ...sectionOptions]}
                        value={
                          sectionOptions.find(
                            (option) => option.value === String(field.value),
                          )
                            ? [
                                sectionOptions.find(
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
                            singleOption ? singleOption.value : "",
                          );
                        }}
                      />
                    )}
                  />
                  {/* <label htmlFor="section" className="form-label text-white">
                      Section
                    </label>
                    <select
                      id="section"
                      {...register("userProfile.section")}
                      className="form-select form-select-sm color-light-dark"
                    >
                      <option value="">None</option>
                      <option value="M">M</option>
                      <option value="E">E</option>
                    </select> */}
                  {errors?.userProfile?.section && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.userProfile.section.message}
                    </p>
                  )}
                </div>
                {/* <div
                  className="col-lg-4 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="profilePicture">
                    Profile Picture
                  </CustomLabel>
                  <CustomInput
                    id="profilePicture"
                    type="file"
                    placeholder="Choose Profile Picture"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {errors?.userProfile?.profilePicture && (
                    <p className="text-danger mt-1 fs14px">
                      {errors.userProfile.profilePicture.message}
                    </p>
                  )}
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="rounded-circle overflow-hidden"
                      style={{
                        marginTop: "10px",
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div> */}
              </div>

              <SubmitButton disabled={isSubmitting}>
                Save User {isSubmitting && <Spinner />}
              </SubmitButton>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

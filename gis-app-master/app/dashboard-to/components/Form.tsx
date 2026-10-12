import { GET_USER_PROJECTS_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import ErrorMessage from "@/app/components/ErrorMessage";
import useAuthentication, {
  Authentication,
} from "@/app/hooks/useAuthentication";
import useDistrict, { District } from "@/app/hooks/useDistrict";
import useDriver, { Driver } from "@/app/hooks/useDriver";
import { Project } from "@/app/hooks/useProjects";
import useTourPlans, { TourPlan } from "@/app/hooks/useTourPlans";
import useVehicle, { Vehicle } from "@/app/hooks/useVehicle";
import useVisits from "@/app/hooks/useVisits";
import apiClient, {
  AxiosError,
  ErrorResponse,
} from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import more from "../../../public/icons/more.svg";
import Select from "react-select";
import { COMPLETED, SCHEDULED } from "@/app/report-history/statuses";

const schema = z.object({
  id: z.number().optional().default(0),
  projectId: z.number({ invalid_type_error: "Please add Project!" }),
  assignedTo: z.number({ invalid_type_error: "Please add User!" }),
  status: z.number({ invalid_type_error: "Please add Status!" }),
  latitude: z.string().min(1, { message: "Please add Latitude!" }),
  longitude: z.string().min(1, { message: "Please add Longitude!" }),
  vehicleID: z.number({ invalid_type_error: "Please add Vehicle!" }),
  districtID: z.number({ invalid_type_error: "Please add District!" }),
  mriValue: z.number().default(0),
  driverID: z.number({ invalid_type_error: "Please add Driver!" }),
  fromDate: z
    .string()
    .optional()
    .default(new Date().toISOString())
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  toDate: z
    .string()
    .optional()
    .default(new Date().toISOString())
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
  complete_at: z.string().optional().nullable().default(null),
  submitted_at: z.string().optional().nullable().default(null),
  issued_at: z.string().optional().nullable().default(null),
  tracking_status: z.boolean().optional().default(false),
  visitPlanGroup: z.number().optional().default(0),
  one_pager_status: z.string().optional().default(""),
  op_submitted_at: z.string().optional().nullable().default(null),
});

type Visit = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  visits: Visit[];
  drivers: Driver[];
  vehicles: Vehicle[];
  users: Authentication[];
  visitPlans: TourPlan[];
  districts: District[];
}

const Form = ({
  api,
  method,
  id,
  setRefresh,
  refresh,
  visits,
  drivers,
  vehicles,
  users,
  visitPlans,
  districts,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Visit>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>();
  const [userProjects, setUserProjects] = useState<Project[]>([]);

  const modalId = `formModal-${id}`;

  const createdMessage = "Created Successfully";
  const updatedMessage = "Visit Scheduled Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    const itemData: Visit | undefined = visits.find(
      (itemData: any) => itemData.id === id,
    );
    if (itemData) {
      setValue("visitPlanGroup", itemData.visitPlanGroup);
      setValue("assignedTo", itemData.assignedTo);
      setValue("projectId", itemData.projectId);
      setValue("districtID", itemData.districtID);
      setValue("vehicleID", itemData.vehicleID);
      setValue("driverID", itemData.driverID);
      setValue("status", itemData.status);
      setValue("latitude", itemData.latitude);
      setValue("longitude", itemData.longitude);
      setValue("fromDate", itemData.fromDate);
      setValue("toDate", itemData.toDate);
      setValue("updatedAt", new Date().toISOString());
    }
  };

  const onSubmit = async (formData: Visit) => {
    console.log("Form Data:", formData);

    try {
      const modifiedFormData = {
        ...formData,
        complete_at: null,
        submitted_at: null,
        issued_at: null,
        tracking_status: false,
        one_pager_status: "",
        op_submitted_at: null,
      };

      const response = await apiClient({
        method: method,
        url: api,
        data: modifiedFormData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      toast.success(updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message,
      );
    }
  };

  const getUserProjects = async (id: number) => {
    try {
      const response = await apiClient.get(
        `${GET_USER_PROJECTS_API}?userId=${id}`,
      );
      console.log("Response:", response);
      setUserProjects(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <Button
        type="button"
        className={`btn shadow ${
          method === "POST"
            ? "text-white bg-color-sea-green"
            : "rounded-pill ps-3 pe-3 pt-1 pb-1"
        }`}
        onClick={handleShow}
        style={{
          background: method === "POST" ? "" : "rgba(255, 255, 255,.5)",
        }}
      >
        {method === "POST" ? (
          "+ Visit"
        ) : (
          <Image src={more} alt="more" width={20} height={20} />
        )}
      </Button>

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
          <div
            className="container-fluid pt-3 pb-3 ps-4 pe-4"
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
              borderRadius: "15px",
              border: "1.7px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <div className="row flex-column justify-content-center mb-4">
              <div className="col-lg-12">
                <p
                  className="text-center text-white mt-4 fw-bold"
                  style={{ fontSize: "1.5rem" }}
                >
                  {method === "POST" ? "VISIT SCHEDULED" : "VISIT SCHEDULED"}
                </p>
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="col mb-3">
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label
                        htmlFor="visitPlanGroup"
                        className="form-label text-white"
                      >
                        Visit Plan Group
                      </label>
                      {/* <Controller
                        name="visitPlanGroup"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <Select
                            placeholder="Select"
                            {...field}
                            options={visitPlans?.map((d: any) => ({
                              value: d.id,
                              label: d.name,
                            }))}
                          />
                        )}
                      /> */}
                      <select
                        {...register("visitPlanGroup", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                      >
                        <option value="">Select</option>
                        {visitPlans?.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label
                        htmlFor="assignedTo"
                        className="form-label text-white"
                      >
                        Assigned To
                      </label>
                      <select
                        {...register("assignedTo", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                        onChange={(e) =>
                          getUserProjects(Number(e.target.value))
                        }
                      >
                        <option value="">Select</option>
                        {users?.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.fullName}
                          </option>
                        ))}
                      </select>
                      {errors.assignedTo && (
                        <ErrorMessage>
                          {errors.assignedTo?.message}
                        </ErrorMessage>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label
                        htmlFor="projectId"
                        className="form-label text-white"
                      >
                        Project
                      </label>
                      <select
                        {...register("projectId", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                      >
                        <option value="">Select</option>
                        {userProjects?.map((userProject: any) => (
                          <option key={userProject.id} value={userProject.id}>
                            {userProject.name}
                          </option>
                        ))}
                      </select>
                      {errors.projectId && (
                        <ErrorMessage>{errors.projectId?.message}</ErrorMessage>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label
                        htmlFor="district"
                        className="form-label text-white"
                      >
                        District
                      </label>
                      <select
                        {...register("districtID", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                        onChange={(e) => {
                          setSelectedDistrictId(Number(e.target.value));
                          setValue(
                            "latitude",
                            districts.find(
                              (district) =>
                                district.id === Number(e.target.value),
                            )!.latitude,
                          );
                          setValue(
                            "longitude",
                            districts.find(
                              (district) =>
                                district.id === Number(e.target.value),
                            )!.longitude,
                          );
                        }}
                      >
                        <option value="">Select</option>
                        {districts?.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.districtName}
                          </option>
                        ))}
                      </select>
                      {errors.districtID && (
                        <ErrorMessage>
                          {errors.districtID?.message}
                        </ErrorMessage>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label
                        htmlFor="vehicleID"
                        className="form-label text-white"
                      >
                        Vehicle
                      </label>
                      <select
                        {...register("vehicleID", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                      >
                        <option value="">Select</option>
                        {vehicles?.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.vehicleNumber}
                          </option>
                        ))}
                      </select>
                      {errors.vehicleID && (
                        <ErrorMessage>{errors.vehicleID?.message}</ErrorMessage>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label
                        htmlFor="driverID"
                        className="form-label text-white"
                      >
                        Driver
                      </label>
                      <select
                        {...register("driverID", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                      >
                        <option value="">Select</option>
                        {drivers?.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.driverName}
                          </option>
                        ))}
                      </select>
                      {errors.driverID && (
                        <ErrorMessage>{errors.driverID?.message}</ErrorMessage>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label htmlFor="status" className="form-label text-white">
                        Status
                      </label>
                      <select
                        {...register("status", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                      >
                        <option value="">Select</option>
                        <option value={SCHEDULED}>Scheduled</option>
                        <option value={COMPLETED}>Completed</option>
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start mb-3">
                      <label
                        htmlFor="fromDate"
                        className="form-label text-white"
                      >
                        From Date
                      </label>
                      <input
                        {...register("fromDate")}
                        id="fromDate"
                        type="date"
                        className="form-control color-light-dark"
                        placeholder="Enter fromDate"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start mb-3">
                      <label htmlFor="toDate" className="form-label text-white">
                        To Date
                      </label>
                      <input
                        {...register("toDate")}
                        id="toDate"
                        type="date"
                        className="form-control color-light-dark"
                        placeholder="Enter toDate"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-5 mx-auto">
                  <Button
                    className="btn text-white w-100 border-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0C8CE9 ,#136AAA)",
                      borderRadius: "12px",
                    }}
                    type="submit"
                  >
                    Create Visit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;

import Button from "@/app/components/Button";
import useAuthentication, {
  Authentication,
} from "@/app/hooks/useAuthentication";
import useDistrict, { District } from "@/app/hooks/useDistrict";
import useDriver, { Driver } from "@/app/hooks/useDriver";
import useProjects, { Project } from "@/app/hooks/useProjects";
import useTourPlans, { TourPlan } from "@/app/hooks/useTourPlans";
import useVehicle, { Vehicle } from "@/app/hooks/useVehicle";
import useVisitsNew, { VisitNew } from "@/app/hooks/useVisitsNew";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import more from "../../../public/icons/more.svg";

const schema = z.object({
  visitPlanGroup: z.number().optional().default(0),
  id: z.number().optional().default(0),
  projectId: z.number().optional().default(0),
  assignedTo: z.number().optional().default(0),
  status: z.string().min(1, { message: "Please add Status!" }),
  latitude: z.string().min(1, { message: "Please add Latitude!" }),
  longitude: z.string().min(1, { message: "Please add Longitude!" }),
  vehicleID: z
    .number({ invalid_type_error: "Please add Vehicle ID!" })
    .gt(0, { message: "Please select Valid Id" }),
  driverID: z
    .number({ invalid_type_error: "Please add Driver ID!" })
    .gt(0, { message: "Please select Valid Id" }),
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
  reportPath: z.string().optional().default(""),
  tracking_status: z.boolean().optional().default(false),
  visitPlanPath: z.string().optional().default(""),
});

type Visit = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  visitsNew: VisitNew[];
  drivers: Driver[];
  vehicles: Vehicle[];
  projects: Project[];
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
  visitsNew,
  drivers,
  vehicles,
  projects,
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
  const modalId = `formModal-${id}`;

  const updatedMessage = "Visit Scheduled Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    const itemData: VisitNew | undefined = visitsNew.find(
      (itemData: any) => itemData.id === id
    );

    if (itemData) {
      const district = districts.find(
        (district) => district.id === itemData.districtId
      );
      if (district) {
        setValue("latitude", district.latitude);
        setValue("longitude", district.longitude);
      }
      setValue("assignedTo", itemData.userId);
      setValue("projectId", itemData.id);
      setValue("status", itemData.status);
      setValue("updatedAt", new Date().toISOString());
    }
    // try {
    //   const response = await apiClient.get(
    //     `${api}/GetVisitByVisitId?VisitID=${id}`
    //   );
    //   const itemData = response.data.data;
    //   // const formatFromDate = itemData[0].fromDate.split("T")[0];
    //   // const formatToDate = itemData[0].toDate.split("T")[0];
    //   // setValue("visitPlanGroup", itemData[0].visitPlanGroup);
    //   // setValue("assignedTo", itemData[0].assignedTo);
    //   // setValue("vehicleID", itemData[0].vehicleID);
    //   // setValue("driverID", itemData[0].driverID);
    //   setValue("createdAt", itemData[0].createdAt);
    //   setValue("complete_at", itemData[0].complete_at);
    //   setValue("submitted_at", itemData[0].submitted_at);
    //   setValue("issued_at", itemData[0].issued_at);
    //   setValue("reportPath", itemData[0].reportPath);
    //   setValue("tracking_status", itemData[0].tracking_status);
    //   setValue("visitPlanPath", itemData[0].visitPlanPath);
    // } catch (err) {
    //   console.log((err as AxiosError).message);
    //   setError((err as AxiosError).message);
    // }
  };

  const onSubmit = async (formData: Visit) => {
    console.log("Form Data:", formData);
    try {
      const modifiedFormData = {
        ...formData,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        status: (formData.status = "scheduled"),
        complete_at: null,
        submitted_at: null,
        issued_at: null,
        reportPath: "",
        tracking_status: false,
        visitPlanPath: "",
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
          method === "PUT"
            ? "text-white bg-color-sea-green"
            : "rounded-pill ps-3 pe-3 pt-1 pb-1"
        }`}
        onClick={handleShow}
        style={{
          background: method === "PUT" ? "" : "rgba(255, 255, 255,.5)",
        }}
      >
        {method === "PUT" ? (
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
                      <select
                        id="visitPlanGroup"
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
                        htmlFor="projectId"
                        className="form-label text-white"
                      >
                        Project ID
                      </label>
                      <select
                        id="projectId"
                        disabled
                        {...register("projectId", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                      >
                        {projects?.map((d: any) => (
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
                        id="assignedTo"
                        disabled
                        {...register("assignedTo", { valueAsNumber: true })}
                        className="form-select form-select-sm color-light-dark"
                      >
                        {users?.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.userName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start mb-3">
                      <label
                        htmlFor="latitude"
                        className="form-label text-white"
                      >
                        Latitude
                      </label>
                      <input
                        disabled
                        {...register("latitude")}
                        id="latitude"
                        type="text"
                        className="form-control form-control-sm color-light-dark"
                        placeholder="Enter Latitude"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start mb-3">
                      <label
                        htmlFor="longitude"
                        className="form-label text-white"
                      >
                        Longitude
                      </label>
                      <input
                        disabled
                        {...register("longitude")}
                        id="longitude"
                        type="text"
                        className="form-control form-control-sm color-light-dark"
                        placeholder="Enter Longitude"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start mb-3">
                      <label
                        htmlFor="vehicleID"
                        className="form-label text-white"
                      >
                        Vehicle ID
                      </label>
                      <select
                        id="vehicleID"
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
                        <p className="text-danger mt-1 fs14px">
                          {errors.vehicleID.message}
                        </p>
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
                        id="driverID"
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
                        <p className="text-danger mt-1 fs14px">
                          {errors.driverID.message}
                        </p>
                      )}
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
                    Schedule
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

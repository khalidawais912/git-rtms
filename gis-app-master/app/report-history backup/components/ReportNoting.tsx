"use client";
import { REPORTS_HISTORY_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import Spinner from "@/app/components/Spinner";
import useOfficers from "@/app/hooks/useOfficers";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { triggerEscapeKeyPress } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { SubmittedReport } from "../list/components/List";
import {
  APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE,
  APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE,
  D_REFERBACK_ID,
  DD_REFERBACK_ID,
  // DD_USER_ID,
  DG_REFERBACK_ID,
  DG_USER_ID,
  REVIEWED_AND_APPROVED_BY_DG_TO_D,
  REVIEWED_AND_FORWARD_BY_D_TO_DG,
  REVIEWED_AND_FORWARD_BY_DD_TO_D,
  SUBMITTED_BY_AD_TO_DD,
} from "../statuses";
import HistoryList from "./HistoryList";

import PdfIframe from "./pdf/PdfIframe";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const schema = z.object({
  id: z.number().optional().default(0),
  visitId: z.number().optional().default(-1),
  projectId: z.number().optional().default(-1),
  submittedFrom: z.number().optional().default(-1),
  submittedUser: z.number().optional().default(-1),
  submittedTo: z
    .number({ invalid_type_error: "Please select Director!" })
    .optional(),
  remarks: z.string().min(1, { message: "Please add Remarks!" }),
  reportPath: z.string().optional().default(""),
  lastStatus: z.number().optional().default(-1),
  status: z.number().optional().default(-1),
  reportType: z.number().optional().default(-1),
  sDate: z.string().optional().default(new Date().toISOString()),
});

type ReportNoting = z.infer<typeof schema>;

interface Props {
  data: SubmittedReport;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  role: string;
  userId: number;
}

export interface ReportHistory {
  id: number;
  visitId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  reportPath: string;
  status: number;
  sDate: string;
  reportType: number;
}

const ReportNoting = ({ data, setRefresh, refresh, role, userId }: Props) => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportNoting>({ resolver: zodResolver(schema) });
  console.log(errors);
  const { data: users } = useReportHistoryUser({ refresh });
  const { data: officers } = useOfficers({ refresh });
  const [reportsHistory, setReportsHistory] = useState<ReportHistory[]>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [DD_USER_ID, setDD_USER_ID] = useState<number>(0);
  console.log("all officers", users);
  const submittedTo = watch("submittedTo");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    console.log(selectedId);

    setValue("submittedTo", selectedId);
  };

  useEffect(() => {
    if (userId === 28 || userId === 26) {
      setDD_USER_ID(28);
    } else if (userId === 29 || userId === 27) {
      setDD_USER_ID(29);
    } else if (userId === 51 || userId === 52) {
      setDD_USER_ID(51);
    }
  }, [userId]);

  useEffect(() => {
    if (
      role === "deputy director" &&
      reportsHistory &&
      reportsHistory[reportsHistory?.length - 1].status ===
        APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE
    ) {
      setValue("submittedTo", data.intiallyUserId);
    } else if (
      role === "deputy director" &&
      reportsHistory &&
      reportsHistory[reportsHistory?.length - 1].status === D_REFERBACK_ID
    ) {
      setReferback(true);
      setValue("submittedTo", data.intiallyUserId);
    } else if (
      role === "director" &&
      reportsHistory &&
      reportsHistory[reportsHistory?.length - 1].status === DG_REFERBACK_ID
    ) {
      setReferback(true);
      setValue("submittedTo", DD_USER_ID);
    }
  }, [
    data.submittedFrom,
    officers,
    setValue,
    submittedTo,
    role,
    reportsHistory,
  ]);

  // useEffect(() => {
  //   if (
  //     role === "deputy director" &&
  //     reportsHistory &&
  //     reportsHistory[reportsHistory?.length - 1].status ===
  //       APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE
  //   ) {
  //     setValue("submittedTo", data.intiallyUserId);
  //   } else {
  //     if (!submittedTo) {
  //       const defaultOfficer = officers.find(
  //         (officer) => officer.id === data.submittedFrom
  //       )?.id;
  //       if (defaultOfficer) setValue("submittedTo", defaultOfficer);
  //     }
  //   }
  // }, [
  //   data.submittedFrom,
  //   officers,
  //   setValue,
  //   submittedTo,
  //   role,
  //   reportsHistory,
  // ]);

  // function getNextStatus({
  //   role,
  //   lastStatus,
  //   isRejected,
  // }: {
  //   role: string | undefined;
  //   lastStatus: number;
  //   isRejected: boolean;
  // }): number {
  //   const lowerRole = role?.toLowerCase();

  //   if (lowerRole === "deputy director") {
  //     if (lastStatus === SUBMITTED_BY_AD_TO_DD) {
  //       return isRejected ? DD_REFERBACK_ID : REVIEWED_AND_FORWARD_BY_DD_TO_D;
  //     }

  //     if (lastStatus === REVIEWED_AND_FORWARD_BY_D_TO_DG) {
  //       return APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE;
  //     }

  //     if (lastStatus === D_REFERBACK_ID && isRejected) {
  //       return DD_REFERBACK_ID;
  //     }
  //   }

  //   if (lowerRole === "director") {
  //     if (lastStatus === REVIEWED_AND_FORWARD_BY_DD_TO_D) {
  //       return isRejected ? D_REFERBACK_ID : REVIEWED_AND_FORWARD_BY_D_TO_DG;
  //     }

  //     if (isRejected && lastStatus === D_REFERBACK_ID) {
  //       return D_REFERBACK_ID;
  //     }
  //   }

  //   if (lowerRole === "director general") {
  //     if (lastStatus === REVIEWED_AND_FORWARD_BY_D_TO_DG) {
  //       return isRejected ? DG_REFERBACK_ID : REVIEWED_AND_APPROVED_BY_DG_TO_D;
  //     }
  //   }

  //   // fallback if nothing matched
  //   return DD_REFERBACK_ID;
  // }

  // const modifiedFormData = {
  //   ...formData,
  //   visitId: data.visitId,
  //   projectId: data.projectId,
  //   submittedFrom: userId,
  //   submittedUser: data.submittedUser,
  //   reportPath: data.reportPath,
  //   status: getNextStatus({
  //     role,
  //     lastStatus: data.lastStatus,
  //     isRejected,
  //   }),
  //   reportType: data.reportType,
  // };

  const onSubmit = async (formData: ReportNoting) => {
    console.log(errors);
    if (role) {
      const modifiedFormData = {
        ...formData,
        visitId: data.visitId,
        projectId: data.projectId,
        submittedFrom: userId,
        submittedUser: data.intiallyUserId,
        reportPath: data.reportPath,
        status:
          role === "deputy director" &&
          data.lastStatus === SUBMITTED_BY_AD_TO_DD &&
          !isReferback
            ? REVIEWED_AND_FORWARD_BY_DD_TO_D
            : role === "deputy director" &&
                data.lastStatus === SUBMITTED_BY_AD_TO_DD &&
                isReferback
              ? DD_REFERBACK_ID
              : role === "deputy director" &&
                  data.lastStatus ===
                    APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE
                ? APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE
                : role === "director" &&
                    data.lastStatus === REVIEWED_AND_FORWARD_BY_DD_TO_D &&
                    !isReferback
                  ? REVIEWED_AND_FORWARD_BY_D_TO_DG
                  : role === "director" &&
                      data.lastStatus === REVIEWED_AND_FORWARD_BY_DD_TO_D &&
                      isReferback
                    ? D_REFERBACK_ID
                    : role === "director" &&
                        data.lastStatus === DG_REFERBACK_ID &&
                        isReferback
                      ? D_REFERBACK_ID
                      : role === "director" &&
                          data.lastStatus === REVIEWED_AND_APPROVED_BY_DG_TO_D
                        ? APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE
                        : role === "director general" &&
                            data.lastStatus ===
                              REVIEWED_AND_FORWARD_BY_D_TO_DG &&
                            !isReferback
                          ? REVIEWED_AND_APPROVED_BY_DG_TO_D
                          : role === "director general" &&
                              data.lastStatus ===
                                REVIEWED_AND_FORWARD_BY_D_TO_DG &&
                              isReferback
                            ? DG_REFERBACK_ID
                            : role === "deputy director" &&
                                data.lastStatus ===
                                  REVIEWED_AND_FORWARD_BY_D_TO_DG
                              ? APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE
                              : role === "deputy director" &&
                                  data.lastStatus === D_REFERBACK_ID &&
                                  isReferback
                                ? DD_REFERBACK_ID
                                : role === "deputy director" && isReferback
                                  ? data.lastStatus === DD_REFERBACK_ID
                                  : role === "director" && isReferback
                                    ? data.lastStatus === D_REFERBACK_ID
                                    : -999
                                      ? APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE
                                      : DD_REFERBACK_ID,
        reportType: data.reportType,
      };
      console.log("modifiedFormData", modifiedFormData);
      console.log("submittedTo", submittedTo);

      console.log("modified Form Data:", modifiedFormData);

      try {
        setSubmitting(true);
        const response = await apiClient.post(
          `${REPORTS_HISTORY_API}/MarkedReport`,
          modifiedFormData,
        );
        console.log("Response:", response);
        toast.success("Report Marked Successfully");
        triggerEscapeKeyPress();
        setRefresh((prev) => !prev);
      } catch (err) {
        setSubmitting(false);
        console.log("err", err);
        console.error((err as AxiosError).message);
        toast.error("An unexpected error occured.");
      }
    }
  };

  // const handleMarkedReport = async (data: ReportHistory) => {
  //   try {
  //     const response = await apiClient.post(
  //       `${REPORTS_HISTORY_API}/MarkedReport`,
  //       data
  //     );
  //     console.log("marked report: ", response.data.data);
  //   } catch (err) {
  //     console.error("Submission error:", err);
  //   }
  // };

  useEffect(() => {
    const getReportHistory = async (visitId: number, projectId: number) => {
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetReportHistory?visitId=${visitId}&ProjectId=${projectId}`,
        );
        setReportsHistory(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    console.log("visit id:", data.visitId, "project id", data.projectId);
    getReportHistory(data.visitId, data.projectId);
  }, [data]);

  const [isReferback, setReferback] = useState<boolean>(false);
  const [isMarked, setMarked] = useState<boolean>(false);
  const [viewPdf, setViewPdf] = useState<boolean>(false);

  return (
    <div className="container-fluid p-3">
      <div
        className="col"
        style={{
          backgroundImage: "url('/images/bg2.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255, 255, 255, 0.29)",
          borderRadius: "15px",
          height: "100%",
        }}
      >
        <div
          className="col"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, rgba(239, 239, 239,.6) , rgba(255, 255, 255,.08))",
            borderRadius: "15px",
            padding: "34px 50px",
            width: "100%",
            height: "100%",
          }}
        >
          {reportsHistory && (
            <div className="row d-flex m-0">
              {/* <div className="col-lg-4 col-md-12 col-sm-12 mb-3">
              <div
                className="col p-4 me-1"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                }}
              >
                <div className="row d-flex m-0 mb-2">
                  <div className="col text-end">
                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
                      className="btn rounded-pill fs15px text-wrap"
                      style={{ background: "#E4E4E4" }}
                    >
                      Veiw{" "}
                      {data.reportType === ONE_PAGER_REPORT_ID
                        ? "One Pager"
                        : "Complete"}{" "}
                      Report
                    </Link>
                  </div>
                </div>
                <h1
                  className="fw-bold text-wrap text-break"
                  style={{ fontSize: "36px" }}
                >
                  {
                    users.find((user) => user.id === data.submittedFrom)
                      ?.fullName
                  }
                </h1>
                <p
                  className="mb-2 fs18px fw-normal"
                  style={{ color: "#1E1E1E", opacity: 0.8 }}
                >
                  {
                    users.find((user) => user.id === data.submittedFrom)
                      ?.designation
                  }
                </p>
                <p
                  className="mb-2 fs18px fw-normal"
                  style={{ color: "#1E1E1E", opacity: 0.8 }}
                >
                  Marked To :{" "}
                  {users.find((user) => user.id === data.submittedTo)?.fullName}
                </p>
                <hr className="mb-3" style={{ opacity: ".1" }} />
                <div className="row d-flex m-0 mb-2">
                  <div className="col">
                    <p
                      className="mb-1 fw-normal text-break"
                      style={{ color: "#1E1E1E", opacity: 0.6 }}
                    >
                      Last modification:&nbsp;
                      {new Date(data.sDate).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Button className="btn bg-color-sea-blue fs18px rounded-pill text-white w-100 py-3 mb-2 fw-bold">
                  <IoArrowBack size={21} />
                  &nbsp;&nbsp;&nbsp;Back
                </Button>
              </div>
            </div> */}
              {viewPdf && (
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                  {/* <PdfFileViewer /> */}
                  <PdfIframe
                    reportPath={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
                  />
                  {/* <EditPdfFileViewer
                fileUrl={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
              /> */}
                </div>
              )}
              <div
                className={`${
                  viewPdf ? "col-lg-6" : "col-lg-12"
                } col-md-12 col-sm-12`}
                style={{ height: "85%", overflow: "scroll" }}
              >
                <Button
                  className="btn btn-primary"
                  onClick={() => setViewPdf(!viewPdf)}
                >
                  {viewPdf ? "Hide" : "View"} PDF
                </Button>
                <HistoryList data={reportsHistory} />
                <div
                  className="col p-4 ms-1 mb-3"
                  style={{
                    background: "#FAFAFA",
                    borderRadius: "12px",
                  }}
                >
                  <p className="mb-4 fw-normal">
                    <span>Project:&nbsp;&nbsp;</span> {data.projectName}
                  </p>
                  <hr style={{ opacity: ".1" }} />
                  <>
                    {(role === "deputy director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        SUBMITTED_BY_AD_TO_DD) ||
                    (role === "deputy director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        D_REFERBACK_ID) ||
                    (role === "deputy director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE) ||
                    (role === "director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        REVIEWED_AND_FORWARD_BY_DD_TO_D) ||
                    (role === "director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        REVIEWED_AND_APPROVED_BY_DG_TO_D) ||
                    (role === "director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        DG_REFERBACK_ID) ||
                    (role === "director general" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        REVIEWED_AND_FORWARD_BY_D_TO_DG) ? (
                      <>
                        <p className="mb-1 fw-normal fs18px">
                          Description Level
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="mb-2">
                            <Controller
                              name="remarks"
                              control={control}
                              render={({ field }) => (
                                <SimpleMDE
                                  placeholder="Description"
                                  className="custom-editor"
                                  {...field}
                                />
                              )}
                            />
                            {errors.remarks && (
                              <p className="text-danger mt-1 fs14px">
                                {errors.remarks.message}
                              </p>
                            )}
                          </div>

                          <div className="row mx-0 mb-3">
                            {(data.lastStatus ===
                              REVIEWED_AND_FORWARD_BY_DD_TO_D ||
                              REVIEWED_AND_FORWARD_BY_D_TO_DG ||
                              data.lastStatus === DG_REFERBACK_ID) &&
                              ((role === "director" &&
                                data.lastStatus !==
                                  REVIEWED_AND_APPROVED_BY_DG_TO_D) ||
                                role === "director general" ||
                                (role === "deputy director" &&
                                  data.lastStatus !==
                                    APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE)) && (
                                <div className="col">
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="reject"
                                      checked={isReferback}
                                      onChange={() => {
                                        setReferback(!isReferback);
                                        setMarked(false);
                                        role === "deputy director"
                                          ? setValue(
                                              "submittedTo",
                                              reportsHistory[
                                                reportsHistory?.length - 1
                                              ].status === D_REFERBACK_ID
                                                ? data.intiallyUserId
                                                : data.submittedFrom,
                                            )
                                          : setValue(
                                              "submittedTo",
                                              data.submittedFrom,
                                            );
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="reject"
                                    >
                                      Referback:{" "}
                                      {role === "deputy director" &&
                                      reportsHistory[reportsHistory?.length - 1]
                                        .status === D_REFERBACK_ID
                                        ? users.find(
                                            (user) =>
                                              user.id === data.intiallyUserId,
                                          )?.fullName
                                        : role === "director" &&
                                            reportsHistory[
                                              reportsHistory?.length - 1
                                            ].status === DG_REFERBACK_ID
                                          ? officers.find(
                                              (officer) =>
                                                officer.id === DD_USER_ID,
                                            )?.fullName
                                          : users.find(
                                              (user) =>
                                                user.id === data.submittedFrom,
                                            )?.fullName}
                                    </label>
                                  </div>
                                </div>
                              )}
                            {role === "director" &&
                              reportsHistory[reportsHistory?.length - 1]
                                .status !== REVIEWED_AND_APPROVED_BY_DG_TO_D &&
                              reportsHistory[reportsHistory?.length - 1]
                                .status !== DG_REFERBACK_ID && (
                                <div className="col">
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="mark"
                                      checked={isMarked}
                                      onChange={() => {
                                        const newValue = !isMarked;
                                        setMarked(newValue);
                                        setReferback(false);
                                        if (newValue) {
                                          setValue("submittedTo", DG_USER_ID); //director general-id
                                        } else {
                                          setValue("submittedTo", undefined); //director general-id
                                        }
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="mark"
                                    >
                                      {/* Mark To: {officers[4]?.fullName} */}
                                      Mark To: DIRECTOR GENERAL
                                    </label>
                                  </div>
                                </div>
                              )}
                          </div>

                          {!isReferback && !isMarked && (
                            <>
                              {(role === "deputy director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status === SUBMITTED_BY_AD_TO_DD) ||
                              (role === "director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status ===
                                  REVIEWED_AND_FORWARD_BY_DD_TO_D) ||
                              (role === "director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status ===
                                  REVIEWED_AND_APPROVED_BY_DG_TO_D) ||
                              (role === "director general" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status ===
                                  REVIEWED_AND_FORWARD_BY_D_TO_DG) ? (
                                <div className="mb-2">
                                  <select
                                    value={submittedTo || ""}
                                    onChange={handleSelectChange}
                                    className="form-select fs-6"
                                    aria-label="Select Director"
                                  >
                                    {role === "director" ? (
                                      <>
                                        <option value="">
                                          Select Deputy Director
                                        </option>
                                        <option value={officers[2]?.id}>
                                          {officers[2]?.fullName}
                                        </option>
                                        <option value={officers[3]?.id}>
                                          {officers[3]?.fullName}
                                        </option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="">
                                          Select Director
                                        </option>
                                        <option value={officers[0]?.id}>
                                          {officers[0]?.fullName}
                                        </option>
                                        <option value={officers[1]?.id}>
                                          {officers[1]?.fullName}
                                        </option>
                                      </>
                                    )}
                                  </select>
                                  {errors.submittedTo && (
                                    <p className="text-danger mt-1 fs14px">
                                      {errors.submittedTo.message}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="mb-0">
                                  Submitted To:{" "}
                                  {
                                    users.find(
                                      (user) => user.id === data.intiallyUserId,
                                    )?.fullName
                                  }
                                </p>
                              )}
                            </>
                          )}
                          <div className="row d-flex justify-content-end m-0">
                            {!isReferback && (
                              <>
                                {role === "deputy director" && (
                                  <div className="col-auto">
                                    <Button
                                      disabled={isSubmitting || !submittedTo}
                                      type="submit"
                                      className="btn rounded-pill fs18px fw-normal px-3"
                                      style={{
                                        background: `${
                                          submittedTo
                                            ? "rgba(0, 57, 206,.05)"
                                            : "rgba(201, 201, 201,.5)"
                                        }`,
                                        color: `${
                                          submittedTo ? "#0039CE" : "#454545"
                                        }`,
                                      }}
                                    >
                                      Reviewed & Forward To{" "}
                                      {isSubmitting && <Spinner />}
                                    </Button>
                                  </div>
                                )}
                                {(role === "director" ||
                                  role === "director general") && (
                                  <div className="col-auto">
                                    <Button
                                      disabled={isSubmitting || !submittedTo}
                                      type="submit"
                                      className="btn rounded-pill fs18px fw-normal px-3"
                                      style={{
                                        background: `${
                                          submittedTo
                                            ? "rgba(0, 57, 206,.05)"
                                            : "rgba(201, 201, 201,.5)"
                                        }`,
                                        color: `${
                                          submittedTo ? "#0039CE" : "#454545"
                                        }`,
                                      }}
                                    >
                                      {isMarked ? "For Approval" : "Approved"}{" "}
                                      {isSubmitting && <Spinner />}
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}

                            {isReferback && (
                              <div className="col-auto">
                                <Button
                                  disabled={isSubmitting}
                                  className="btn rounded-pill fs18px fw-normal px-3"
                                  type="submit"
                                  style={{
                                    background: "rgba(0, 57, 206,.05)",
                                    color: "#0039CE",
                                  }}
                                >
                                  Referback {isSubmitting && <Spinner />}
                                </Button>
                              </div>
                            )}
                          </div>
                        </form>
                      </>
                    ) : (
                      "Response Submitted"
                    )}
                  </>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportNoting;

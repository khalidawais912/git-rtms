"use client";
import { REPORTS_HISTORY_API } from "@/services/endpoints";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { Officer, ReportHistoryUser } from "@/features/users";
import apiClient, { AxiosError } from "@/services/client";
import { triggerEscapeKeyPress } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { SubmittedReport, ReportHistory } from "../types";
import { APPROVED, REFERBACK, SUBMITTED } from "@/constants/statuses";
import HistoryList from "./HistoryList";

import Loader from "@/components/Loader/Loader";
import PdfIframe from "./pdf/PdfIframe";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
// EasyMDE styles (required)
import "easymde/dist/easymde.min.css";
import type { Options as SimpleMDEOptions } from "easymde";
import AlertMessage from "@/components/AlertMessage";
import { useEffectEvent } from "@/hooks/useEffectEvent";

const schema = z.object({
  id: z.number().optional().default(0),
  visitId: z.number().optional().default(-1),
  projectId: z.number().optional().default(-1),
  submittedFrom: z.number().optional().default(-1),
  submittedUser: z.number().optional().default(-1),
  submittedTo: z
    .number({ invalid_type_error: "Please select Director!" })
    .optional(),
  remarks: z.string().min(1, { message: "Please add Remarks!" }).trim(),
  reportPath: z.string().optional().default(""),
  lastStatus: z.number().optional().default(-1),
  status: z.number().optional().default(-1),
  reportType: z.number().optional().default(1),
  sDate: z.string().optional().default(new Date().toISOString()),
});

type ReportNoting = z.infer<typeof schema>;

interface Props {
  data: SubmittedReport;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  role: string;
  userId: number;
  selectedTabLabel: string;
  users: ReportHistoryUser[];
  deputyDirectors: Officer[];
  directors: Officer[];
  departmentHead: Officer;
  officers: Officer[];
  onCommentSubmitted?: () => void; //Add callback prop
}
const ReportNoting = ({
  data,
  setRefresh,
  role,
  userId,
  selectedTabLabel,
  users,
  deputyDirectors,
  directors,
  departmentHead,
  onCommentSubmitted,
}: Props) => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportNoting>({
    resolver: zodResolver(schema),
    defaultValues: {
      remarks: "", // 👈 make sure it starts as empty string, not undefined
    },
  });

  const [descendingOrderReportsHistory, setDescendingOrderReportsHistory] =
    useState<ReportHistory[]>();
  const [ascendingOrderReportsHistory, setAscendingOrderReportsHistory] =
    useState<ReportHistory[]>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submittedTo = watch("submittedTo");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);

    setValue("submittedTo", selectedId);
  };

  const onSubmittedFromChange = useEffectEvent(() => {
    if (
      role === "deputy director" &&
      descendingOrderReportsHistory &&
      descendingOrderReportsHistory[0].status === APPROVED
    ) {
      setValue("submittedTo", data.intiallyUserId);
    } else if (
      role === "deputy director" &&
      descendingOrderReportsHistory &&
      descendingOrderReportsHistory[0].status === REFERBACK
    ) {
      setReferback(true);
      setValue("submittedTo", data.intiallyUserId);
    } else if (
      role === "director" &&
      descendingOrderReportsHistory &&
      descendingOrderReportsHistory[0].status === REFERBACK
    ) {
      setReferback(true);
    }

  });
  useEffect(() => onSubmittedFromChange(), [data.submittedFrom, setValue, submittedTo, role, descendingOrderReportsHistory, onSubmittedFromChange]);

  const onDescendingOrderReportsHistoryChange = useEffectEvent(() => {
    if (
      role === "director" &&
      descendingOrderReportsHistory &&
      descendingOrderReportsHistory[0].status === SUBMITTED
    ) {
      setValue(
        "submittedTo",
        descendingOrderReportsHistory &&
          descendingOrderReportsHistory[0].submittedFrom,
      );
      setValue(
        "submittedTo",
        descendingOrderReportsHistory &&
          descendingOrderReportsHistory[0].submittedFrom,
      );
      setReferback(true);
    }
  });
  useEffect(() => onDescendingOrderReportsHistoryChange(), [descendingOrderReportsHistory, onDescendingOrderReportsHistoryChange]);

  const onSubmit = async (formData: ReportNoting) => {
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
          data.status === SUBMITTED &&
          !isReferback
            ? SUBMITTED
            : role === "deputy director" &&
                data.status === SUBMITTED &&
                isReferback
              ? REFERBACK
              : role === "deputy director" && data.status === APPROVED
                ? APPROVED
                : role === "director" &&
                    data.status === SUBMITTED &&
                    !isReferback
                  ? SUBMITTED
                  : role === "director" &&
                      data.status === SUBMITTED &&
                      isReferback
                    ? REFERBACK
                    : role === "director" &&
                        data.status === REFERBACK &&
                        isReferback
                      ? REFERBACK
                      : role === "director" && data.status === APPROVED
                        ? APPROVED
                        : role === "department head" &&
                            data.status === SUBMITTED &&
                            !isReferback
                          ? APPROVED
                          : role === "department head" &&
                              data.status === SUBMITTED &&
                              isReferback
                            ? REFERBACK
                            : role === "deputy director" &&
                                data.status === SUBMITTED
                              ? SUBMITTED
                              : role === "deputy director" &&
                                  data.status === REFERBACK &&
                                  isReferback
                                ? REFERBACK
                                : role === "deputy director" && isReferback
                                  ? REFERBACK
                                  : role === "director" && isReferback
                                    ? REFERBACK
                                    : -999
                                      ? APPROVED
                                      : REFERBACK,
        reportType: data.reportType,
      };


      try {
        setSubmitting(true);
        await apiClient.post(
          `${REPORTS_HISTORY_API}/MarkedReport`,
          modifiedFormData,
        );
        toast.success("Report Marked Successfully");
        triggerEscapeKeyPress();
        setRefresh((prev) => !prev);

        // 👇 NEW: Call the callback after successful submission
        if (onCommentSubmitted) {
          onCommentSubmitted();
        }
      } catch (err) {
        setSubmitting(false);
        console.error("err", err);
        console.error((err as AxiosError).message);
        toast.error("An unexpected error occured.");
      }
    }
  };

  useEffect(() => {
    const getReportHistory = async (
      visitId: number,
      projectId: number,
      reportType: number,
    ) => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetReportHistory?visitId=${visitId}&ProjectId=${projectId}&reportType=${reportType}`,
        );
        const sorted = [...response.data.data].sort((a, b) =>
          (b.sDate || "").localeCompare(a.sDate || ""),
        );

        setDescendingOrderReportsHistory(sorted);

        const sortedAsc = [...response.data.data].sort((a, b) =>
          (a.sDate || "").localeCompare(b.sDate || ""),
        );
        setAscendingOrderReportsHistory(sortedAsc);

        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    if (data) getReportHistory(data.visitId, data.projectId, data.reportType);
  }, [data]);

  useEffect(() => {
    if (descendingOrderReportsHistory) {
    }
  }, [descendingOrderReportsHistory]);

  const [isReferback, setReferback] = useState<boolean>(false);
  const [isMarked, setMarked] = useState<boolean>(false);
  const [viewPdf, setViewPdf] = useState<boolean>(false);

  const mdeOptions = useMemo<SimpleMDEOptions>(
    () => ({
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "code",
      ],
    }),
    [],
  );

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
          {isLoading ? (
            <Loader />
          ) : error ? (
            <AlertMessage variant="danger">{error}, Please Try Again!</AlertMessage>
          ) : descendingOrderReportsHistory && ascendingOrderReportsHistory ? (
            <div className="row d-flex m-0">
              {viewPdf && (
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                  <PdfIframe
                    iframeKey={data.reportPath}
                    reportPath={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
                  />
                </div>
              )}
              <div
                className={`${
                  viewPdf ? "col-lg-6" : "col-lg-12"
                } col-md-12 col-sm-12`}
                style={{ height: "85%", overflowY: "scroll" }}
              >
                <Button
                  className="btn btn-primary"
                  onClick={() => setViewPdf(!viewPdf)}
                >
                  {viewPdf ? "Hide" : "View"} PDF
                </Button>
                <HistoryList
                  descendingOrderData={descendingOrderReportsHistory}
                  users={users}
                  submittedReport={data}
                />
                <div
                  className="col p-4 ms-1 mb-3"
                  style={{
                    background: "#FAFAFA",
                    borderRadius: "12px",
                  }}
                >
                  <p className="mb-4 fw-normal">
                    <span>Project:&nbsp;&nbsp;</span> (Gs. No- {data.gsNo}){" "}
                    {data.projectName}
                  </p>
                  <p className="mb-4 fw-normal">
                    <span>Name:&nbsp;&nbsp;</span> {data.intiallyUser}
                  </p>
                  <hr style={{ opacity: ".1" }} />
                  <>
                    {descendingOrderReportsHistory[0].submittedTo === userId &&
                    (selectedTabLabel === "SUBMITTED BY (AD)" ||
                      selectedTabLabel === "APPROVED BY (DG)" ||
                      selectedTabLabel === "REFERBACK BY (DIRECTOR)" ||
                      selectedTabLabel === "SUBMITTED BY (DD)" ||
                      selectedTabLabel === "REFERBACK BY (DG)" ||
                      selectedTabLabel === "SUBMITTED BY (DIRECTOR)") &&
                    (descendingOrderReportsHistory[0].status === SUBMITTED ||
                      descendingOrderReportsHistory[0].status === REFERBACK ||
                      descendingOrderReportsHistory[0].status === APPROVED) ? (
                      <>
                        <p className="mb-1 fw-normal fs18px">
                          Description Level{" "}
                          {errors.remarks && (
                            <span className="text-danger mt-1 fs14px">
                              - {errors.remarks.message}
                            </span>
                          )}
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
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={mdeOptions}
                                />
                              )}
                            />
                          </div>
                          <div className="row mx-0 mb-3">
                            {role !== "director" &&
                              (data.status === SUBMITTED ||
                                data.status === REFERBACK) && (
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
                                              descendingOrderReportsHistory[0]
                                                .status === REFERBACK
                                                ? data.intiallyUserId
                                                : data.submittedFrom,
                                            )
                                          : setValue(
                                              "submittedTo",
                                              data.submittedFrom,
                                            );
                                      }}
                                      disabled={
                                        role === "deputy director" &&
                                        descendingOrderReportsHistory[0]
                                          .status === REFERBACK
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="reject"
                                    >
                                      Referback:{" "}
                                      {role === "deputy director" &&
                                      descendingOrderReportsHistory[0]
                                        .status === REFERBACK
                                        ? data.intiallyUser
                                        : users.find(
                                            (user) =>
                                              user.id === data.submittedFrom,
                                          )?.fullName}
                                    </label>
                                  </div>
                                </div>
                              )}

                            {role === "director" &&
                              selectedTabLabel !== "APPROVED BY (DG)" && (
                                <>
                                  <div className="mb-2">
                                    <select
                                      value={submittedTo || ""}
                                      onChange={(e) => {
                                        handleSelectChange(e);
                                        setReferback(true);
                                        setMarked(false);
                                      }}
                                      className="form-select fs-6"
                                      aria-label="Select Deputy Director"
                                    >
                                      <option value="">
                                        Select Deputy Director
                                      </option>
                                      {deputyDirectors.map((officer) => (
                                        <option
                                          key={officer.id}
                                          value={officer.id}
                                        >
                                          {officer.designation}
                                        </option>
                                      ))}
                                    </select>
                                    {errors.submittedTo && (
                                      <p className="text-danger mt-1 fs14px">
                                        {errors.submittedTo.message}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}

                            {role === "director" &&
                              descendingOrderReportsHistory[0].status !==
                                APPROVED &&
                              descendingOrderReportsHistory[0].status !==
                                REFERBACK && (
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
                                          setValue(
                                            "submittedTo",
                                            departmentHead.id,
                                          ); //department head-id
                                        } else {
                                          setValue("submittedTo", undefined); //department head-id
                                        }
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="mark"
                                    >
                                      {/* Mark To: {officers[4]?.fullName} */}
                                      Mark To: DEPARTMENT HEAD
                                    </label>
                                  </div>
                                </div>
                              )}
                          </div>

                          {!isReferback &&
                            !isMarked &&
                            (selectedTabLabel === "APPROVED BY (DG)" ||
                              selectedTabLabel === "SUBMITTED BY (AD)" ||
                              selectedTabLabel ===
                                "SUBMITTED BY (DIRECTOR)") && (
                              <>
                                {(role === "deputy director" &&
                                  descendingOrderReportsHistory[0].status ===
                                    SUBMITTED) ||
                                (role === "director" &&
                                  descendingOrderReportsHistory[0].status ===
                                    SUBMITTED) ||
                                (role === "director" &&
                                  descendingOrderReportsHistory[0].status ===
                                    APPROVED) ||
                                (role === "department head" &&
                                  descendingOrderReportsHistory[0].status ===
                                    SUBMITTED) ? (
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
                                          {deputyDirectors.map((officer) => (
                                            <option
                                              key={officer.id}
                                              value={officer.id}
                                            >
                                              {officer.designation}
                                            </option>
                                          ))}
                                        </>
                                      ) : (
                                        <>
                                          <option value="">
                                            Select Director
                                          </option>
                                          {directors.map((officer) => (
                                            <option
                                              key={officer.id}
                                              value={officer.id}
                                            >
                                              {officer.designation}
                                            </option>
                                          ))}
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
                                    Submitted To: {data.intiallyUser}
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
                                  role === "department head") && (
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
                                  disabled={isSubmitting || !submittedTo}
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
          ) : (
            <AlertMessage variant="warning" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportNoting;

"use client";
import { PC_IV_WORKFLOW_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import Spinner from "@/app/components/Spinner";
import { Officer } from "@/app/hooks/useOfficers";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { triggerEscapeKeyPress } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { SubmittedReport } from "../list/components/List";
import {
  APPROVED,
  DDE2_USER_ID,
  DDE_USER_ID,
  DE_USER_ID,
  REFERBACK,
  SCHEDULED,
  SUBMITTED,
} from "../statuses";
import HistoryList from "./HistoryList";

import Loader from "@/app/components/Loader/Loader";
import { BsExclamationTriangleFill } from "react-icons/bs";
import PdfIframe from "./pdf/PdfIframe";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
// EasyMDE styles (required)
import "easymde/dist/easymde.min.css";
import type { Options as SimpleMDEOptions } from "easymde";

// const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
//   ssr: false,
// });

// import { Sapling } from "@saplingai/sapling-js/observer";

// export default function Editor() {
//   useEffect(() => {
//     Sapling.init({
//       key: process.env.NEXT_PUBLIC_SAPLING_PUBLIC_KEY || "", // use public key
//       endpointHostname: "https://api.sapling.ai",
//       editPathname: "/api/v1/edits",
//       statusBadge: true,
//       mode: "dev",
//     });

//     const editor = document.getElementById("editor");
//     if (editor) {
//       Sapling.observe(editor);
//     }
//   }, []);

const schema = z.object({
  id: z.number().optional().default(0),
  pcivId: z.number().optional().default(-1),
  markFrom: z.number().optional().default(-1),
  // submittedUser: z.number().optional().default(-1),
  markTo: z
    .number({ invalid_type_error: "Please select Director!" })
    .optional(),
  remarks: z.string().min(1, { message: "Please add Remarks!" }).trim(),
  path: z.string().optional().default(""),
  // lastStatus: z.number().optional().default(-1),
  status: z.number().optional().default(-1),
  // reportType: z.number().optional().default(1),
  // sDate: z.string().optional().default(new Date().toISOString()),
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

export interface ReportHistory {
  id: number;
  pcIv_id: number;
  mark_From: number;
  mark_to: number;
  remarks: string;
  pciv_pdf_path: string;
  status: number;
  mark_date: string;
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
  officers,
  onCommentSubmitted,
}: Props) => {
  console.log("data", data);
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
  console.log(errors);

  const [descendingOrderReportsHistory, setDescendingOrderReportsHistory] =
    useState<ReportHistory[]>();
  const [ascendingOrderReportsHistory, setAscendingOrderReportsHistory] =
    useState<ReportHistory[]>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitAction, setSubmitAction] = useState<string | null>(null);

  const markTo = watch("markTo");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    console.log(selectedId);

    setValue("markTo", selectedId);
  };

  useEffect(() => {
    if (
      role === "deputy director" &&
      descendingOrderReportsHistory &&
      descendingOrderReportsHistory[0].status === APPROVED
    ) {
      setReferback(false);
    }
    // else if (
    //   role === "deputy director" &&
    //   descendingOrderReportsHistory &&
    //   descendingOrderReportsHistory[0].status === REFERBACK
    // ) {
    // setReferback(true);
    // setValue("markTo", data.intiallyUserId);
    // }
    // else if (
    //   role === "director" &&
    //   descendingOrderReportsHistory &&
    //   descendingOrderReportsHistory[0].status === REFERBACK
    // ) {
    // setReferback(true);
    // setValue(
    //   "markTo",
    //   reportsHistory &&
    //     reportsHistory[0].submittedFrom
    // );
    // }

    console.log("markTo", markTo);
  }, [
    data.submittedFrom,
    setValue,
    markTo,
    role,
    descendingOrderReportsHistory,
  ]);

  // useEffect(() => {
  //   if (
  //     role === "director" &&
  //     descendingOrderReportsHistory &&
  //     descendingOrderReportsHistory[0].status === SUBMITTED
  //   ) {
  //     setValue(
  //       "markTo",
  //       descendingOrderReportsHistory &&
  //         descendingOrderReportsHistory[0].mark_From,
  //     );
  //     setValue(
  //       "markTo",
  //       descendingOrderReportsHistory &&
  //         descendingOrderReportsHistory[0].mark_From,
  //     );
  //     console.log("status", REFERBACK);
  //     // setReferback(true);
  //   }
  // }, [descendingOrderReportsHistory]);

  const onSubmit = async (formData: ReportNoting) => {
    console.log(errors);
    if (role) {
      const modifiedFormData: ReportNoting = {
        ...formData,
        pcivId: data.projectId,
        markFrom: userId,
        path: data.reportPath,
      };
      console.log("markTo", markTo);

      console.log("modified Form Data:", modifiedFormData);

      try {
        setSubmitting(true);
        const response = await apiClient.post(
          `${PC_IV_WORKFLOW_API}/mark`,
          modifiedFormData,
        );
        console.log("Response:", response);
        toast.success("Report Marked Successfully");
        triggerEscapeKeyPress();
        setRefresh((prev) => !prev);

        // 👇 NEW: Call the callback after successful submission
        if (onCommentSubmitted) {
          onCommentSubmitted();
        }
      } catch (err) {
        setSubmitting(false);
        console.log("err", err);
        console.error((err as AxiosError).message);
        toast.error("An unexpected error occured.");
      }
    }
  };

  useEffect(() => {
    const getReportHistory = async (projectId: number) => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${PC_IV_WORKFLOW_API}/history?pcivId=${projectId}`,
        );
        console.log(`${PC_IV_WORKFLOW_API}/history?pcivId=${projectId}`);
        console.log("pc iv workflow history", response);
        const sorted = [...response.data.data].sort((a, b) =>
          (b.sDate || "").localeCompare(a.sDate || ""),
        );

        setDescendingOrderReportsHistory(sorted);
        console.log("sorted", sorted);

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
    console.log("visit id:", data.visitId, "project id", data.projectId);
    if (data) getReportHistory(data.projectId);
  }, [data]);

  useEffect(() => {
    if (descendingOrderReportsHistory) {
      console.log("reportsHistory", descendingOrderReportsHistory);
      console.log(
        "test 1",
        descendingOrderReportsHistory[0].status === SUBMITTED,
      );
    }
  }, [descendingOrderReportsHistory]);

  const [isReferback, setReferback] = useState<boolean>(false);
  const [isMarked, setMarked] = useState<boolean>(false);
  const [viewPdf, setViewPdf] = useState<boolean>(false);

  // const checkGrammar = useCallback(async (text: string) => {
  //   const res = await fetch("/api/v1/sapling", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ text }),
  //   });
  //   const data = await res.json();
  //   console.log("Sapling grammar suggestions:", data);
  //   return data;
  // }, []);

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
            <div
              className="alert alert-danger d-flex align-items-center"
              role="alert"
            >
              <BsExclamationTriangleFill size={24} className="me-2" />
              <div>{error}, Please Try Again!</div>
            </div>
          ) : descendingOrderReportsHistory && ascendingOrderReportsHistory ? (
            <div className="row d-flex m-0">
              {viewPdf && (
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                  {/* <PdfFileViewer /> */}
                  <PdfIframe
                    iframeKey={data.reportPath}
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
                style={{ height: "85%", overflowY: "auto" }}
              >
                <Button
                  className="btn btn-primary"
                  onClick={() => setViewPdf(!viewPdf)}
                >
                  {viewPdf ? "Hide" : "View"} PDF
                </Button>
                <HistoryList
                  descendingOrderData={descendingOrderReportsHistory}
                  ascendingOrderData={ascendingOrderReportsHistory}
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
                    {descendingOrderReportsHistory[0].mark_to === userId &&
                    (selectedTabLabel === "SUBMITTED BY (AD)" ||
                      selectedTabLabel === "MARK BY (DG)" ||
                      selectedTabLabel === "MARK BY (D)" ||
                      selectedTabLabel === "REFERBACK BY (DIRECTOR)" ||
                      selectedTabLabel === "SUBMITTED BY (DD)" ||
                      selectedTabLabel === "REFERBACK BY (DG)" ||
                      selectedTabLabel === "REFERBACK BY (AD)" ||
                      selectedTabLabel === "SUBMITTED BY (DEPARTMENT)" ||
                      selectedTabLabel === "REFERBACK BY (DD)" ||
                      selectedTabLabel === "REFERBACK BY (D)") &&
                    (descendingOrderReportsHistory[0].status === SCHEDULED ||
                      descendingOrderReportsHistory[0].status === SUBMITTED ||
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
                          {/* <div className="col"> */}
                          {/* <p>new editor</p>*/}
                          {/* <RichTextEditor />*/}
                          {/* <MarkdownEditorWithSpellcheck /> */}
                          {/* <ClientSideCustomEditor /> */}
                          {/* <SaplingEditorWithHighlight /> */}
                          {/* <SaplingEditor /> */}
                          {/* <GrammarEditor /> */}
                          {/* <SimpleMdeEditor /> */}
                          {/* <QuillWithSpellChecker /> */}
                          {/* </div> */}
                          <div className="row mx-0 mb-3">
                            {/* {(data.status === SUBMITTED ||
                              data.status === REFERBACK) &&
                              selectedTabLabel !== "REFERBACK BY (D)" && (
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
                                              "markTo",
                                              descendingOrderReportsHistory[0]
                                                .status === REFERBACK
                                                ? data.intiallyUserId
                                                : data.submittedFrom,
                                            )
                                          : setValue(
                                              "markTo",
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
                              )} */}

                            {(data.status === SUBMITTED ||
                              data.status === REFERBACK) &&
                              selectedTabLabel === "REFERBACK BY (D)" && (
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
                                        setValue(
                                          "markTo",
                                          descendingOrderReportsHistory[
                                            descendingOrderReportsHistory.length -
                                              1
                                          ].mark_From,
                                        );
                                      }}
                                      // disabled={
                                      //   role === "deputy director" &&
                                      //   descendingOrderReportsHistory[0]
                                      //     .status === REFERBACK
                                      // }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="reject"
                                    >
                                      Department User:{" "}
                                      {
                                        users.find(
                                          (user) =>
                                            user.id ===
                                            descendingOrderReportsHistory[
                                              descendingOrderReportsHistory.length -
                                                1
                                            ].mark_From,
                                        )?.fullName
                                      }
                                    </label>
                                  </div>
                                </div>
                              )}

                            {role === "director" &&
                              descendingOrderReportsHistory[0].status !==
                                REFERBACK &&
                              selectedTabLabel !== "MARK BY (DG)" && (
                                <>
                                  {/* <label
                                    className="form-check-label"
                                    htmlFor="reject"
                                  >
                                    Referback:
                                  </label> */}
                                  <div className="mb-2">
                                    <select
                                      value={markTo || ""}
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
                                    {errors.markTo && (
                                      <p className="text-danger mt-1 fs14px">
                                        {errors.markTo.message}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}

                            {role === "director" &&
                              descendingOrderReportsHistory[0].status ===
                                REFERBACK &&
                              selectedTabLabel === "REFERBACK BY (DD)" && (
                                <>
                                  {/* <label
                                    className="form-check-label"
                                    htmlFor="reject"
                                  >
                                    Referback:
                                  </label> */}
                                  <div className="mb-2">
                                    <select
                                      value={markTo || ""}
                                      onChange={(e) => {
                                        handleSelectChange(e);
                                        setMarked(false);
                                        setReferback(false);
                                      }}
                                      className="form-select fs-6"
                                      aria-label="Select Deputy Director"
                                    >
                                      <option value="">
                                        Select Department Head
                                      </option>
                                      <option
                                        key={departmentHead.id}
                                        value={departmentHead.id}
                                      >
                                        {departmentHead.designation}
                                      </option>
                                    </select>
                                    {errors.markTo && (
                                      <p className="text-danger mt-1 fs14px">
                                        {errors.markTo.message}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}

                            {/* {role === "director" &&
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
                                        console.log(
                                          "departmentHead designation: ",
                                          departmentHead.designation,
                                        );

                                        if (newValue) {
                                          setValue("markTo", departmentHead.id); //department head-id
                                        } else {
                                          setValue("markTo", undefined); //department head-id
                                        }
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="mark"
                                    >
                                      Mark To: DEPARTMENT HEAD
                                    </label>
                                  </div>
                                </div>
                              )} */}

                            {role === "deputy director" &&
                              selectedTabLabel === "MARK BY (D)" && (
                                <>
                                  {/* <label
                                    className="form-check-label"
                                    htmlFor="reject"
                                  >
                                    Referback:
                                  </label> */}
                                  <div className="mb-2">
                                    <select
                                      value={markTo || ""}
                                      onChange={(e) => {
                                        handleSelectChange(e);
                                        setMarked(false);
                                      }}
                                      className="form-select fs-6"
                                      aria-label="Select Assistant Director"
                                    >
                                      <option value="">
                                        Select Assistant Director
                                      </option>
                                      {officers
                                        .filter(
                                          (officer) =>
                                            officer.roleName === "Users" &&
                                            officer.departmentId === 1,
                                        )
                                        .map((officer) => (
                                          <option
                                            key={officer.id}
                                            value={officer.id}
                                          >
                                            {officer.fullName}
                                          </option>
                                        ))}
                                    </select>
                                    {errors.markTo && (
                                      <p className="text-danger mt-1 fs14px">
                                        {errors.markTo.message}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}
                          </div>

                          {!isReferback &&
                            !isMarked &&
                            (selectedTabLabel === "MARK BY (DG)" ||
                              selectedTabLabel === "SUBMITTED BY (AD)" ||
                              selectedTabLabel ===
                                "SUBMITTED BY (DEPARTMENT)" ||
                              selectedTabLabel === "REFERBACK BY (AD)") && (
                              <>
                                {/* <label
                                  className="form-check-label"
                                  htmlFor="reject"
                                >
                                  Approved:
                                </label> */}
                                {(role === "deputy director" &&
                                  descendingOrderReportsHistory[0].status ===
                                    REFERBACK) ||
                                (role === "deputy director" &&
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
                                    SCHEDULED) ? (
                                  <div className="mb-2">
                                    <select
                                      value={markTo || ""}
                                      onChange={handleSelectChange}
                                      className="form-select fs-6"
                                      aria-label="Select Director"
                                    >
                                      {role === "director" ? (
                                        <>
                                          <option value="">
                                            Select Deputy Director
                                          </option>
                                          {/* {deputyDirectors.map((officer) => (
                                            <option
                                              key={officer.id}
                                              value={officer.id}
                                            >
                                              {officer.designation}
                                            </option>
                                          ))} */}

                                          {deputyDirectors
                                            ?.filter(
                                              (dd) =>
                                                dd.id === DDE_USER_ID ||
                                                dd.id === DDE2_USER_ID,
                                            )
                                            ?.map((op) => (
                                              <option
                                                key={op?.id}
                                                value={op?.id}
                                              >
                                                {op?.designation}
                                              </option>
                                            ))}
                                        </>
                                      ) : (
                                        <>
                                          <option value="">
                                            Select Director
                                          </option>
                                          {/* {directors.map((officer) => (
                                            <option
                                              key={officer.id}
                                              value={officer.id}
                                            >
                                              {officer.designation}
                                            </option>
                                          ))} */}
                                          <option
                                            value={
                                              directors?.find(
                                                (director) =>
                                                  director.id === DE_USER_ID,
                                              )?.id
                                            }
                                          >
                                            {
                                              directors?.find(
                                                (director) =>
                                                  director.id === DE_USER_ID,
                                              )?.designation
                                            }
                                          </option>
                                        </>
                                      )}
                                    </select>
                                    {errors.markTo && (
                                      <p className="text-danger mt-1 fs14px">
                                        {errors.markTo.message}
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
                            <>
                              {(submitAction === null ||
                                submitAction === "mark") && (
                                <div className="col-auto">
                                  <Button
                                    disabled={isSubmitting || !markTo}
                                    type="submit"
                                    onClick={() => {
                                      setValue("status", 3);
                                      setReferback(false);
                                      setSubmitAction("mark");
                                    }}
                                    className="btn rounded-pill fs18px fw-normal px-3"
                                    style={{
                                      background: `${
                                        markTo
                                          ? "rgba(0, 57, 206,.05)"
                                          : "rgba(201, 201, 201,.5)"
                                      }`,
                                      color: `${markTo ? "#0039CE" : "#454545"}`,
                                    }}
                                  >
                                    MARK To {isSubmitting && <Spinner />}
                                  </Button>
                                </div>
                              )}
                              {(submitAction === null ||
                                submitAction === "referback") && (
                                <div className="col-auto">
                                  <Button
                                    disabled={isSubmitting || !markTo}
                                    className="btn rounded-pill fs18px fw-normal px-3"
                                    onClick={() => {
                                      setValue("status", 5);
                                      setReferback(true);
                                      setSubmitAction("referback");
                                    }}
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
                              {/* {(role === "director" ||
                                role === "department head") && (
                                <div className="col-auto">
                                  <Button
                                    disabled={isSubmitting || !markTo}
                                    type="submit"
                                    className="btn rounded-pill fs18px fw-normal px-3"
                                    style={{
                                      background: `${
                                        markTo
                                          ? "rgba(0, 57, 206,.05)"
                                          : "rgba(201, 201, 201,.5)"
                                      }`,
                                      color: `${
                                        markTo ? "#0039CE" : "#454545"
                                      }`,
                                    }}
                                  >
                                    {isMarked ? "For Approval" : "Mark To"}{" "}
                                    {isSubmitting && <Spinner />}
                                  </Button>
                                </div>
                              )} */}
                            </>

                            {/* {isReferback && (
                              <div className="col-auto">
                                <Button
                                  disabled={isSubmitting || !markTo}
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
                            )} */}
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
            <div
              className="alert alert-warning d-flex align-items-center"
              role="alert"
            >
              <BsExclamationTriangleFill size={24} className="me-2" />
              <div>No reports found.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportNoting;

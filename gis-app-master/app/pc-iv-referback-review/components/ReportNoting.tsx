"use client";
import { PC_IV_WORKFLOW_API } from "@/shared/api/endpoints";
import Button from "@/shared/components/Button";
import Spinner from "@/shared/components/Spinner";
import { ReportHistoryUser } from "@/features/users";
import apiClient, { AxiosError } from "@/shared/api/client";
import { triggerEscapeKeyPress } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { SubmittedReport, ReportHistory } from "../types";
import { REFERBACK, SUBMITTED } from "@/shared/constants/statuses";
import HistoryList from "./HistoryList";

import Loader from "@/shared/components/Loader/Loader";
import PdfIframe from "./pdf/PdfIframe";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
// EasyMDE styles (required)
import "easymde/dist/easymde.min.css";
import type { Options as SimpleMDEOptions } from "easymde";
import AlertMessage from "@/shared/components/AlertMessage";

const schema = z.object({
  remarks: z.string().min(1, { message: "Please add Remarks!" }).trim(),
});

type ReportNotingForm = z.infer<typeof schema>;

// Tab where DGM&E's referback waits for the Secretary's action
export const REFERBACK_BY_DGME_TAB = "REFERBACK BY (DGM&E)";

interface Props {
  data: SubmittedReport;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number;
  selectedTabLabel: string;
  users: ReportHistoryUser[];
  onCommentSubmitted?: () => void;
}

const ReportNoting = ({
  data,
  setRefresh,
  userId,
  selectedTabLabel,
  users,
  onCommentSubmitted,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportNotingForm>({
    resolver: zodResolver(schema),
    defaultValues: { remarks: "" },
  });

  const [descendingOrderReportsHistory, setDescendingOrderReportsHistory] =
    useState<ReportHistory[]>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isReferback, setReferback] = useState<boolean>(false);
  const [viewPdf, setViewPdf] = useState<boolean>(false);

  const pcivId = data?.pcivId;

  useEffect(() => {
    if (!pcivId) return;

    const getReportHistory = async (pcivId: number) => {
      setLoading(true);
      setError("");
      try {
        const response = await apiClient.get(`${PC_IV_WORKFLOW_API}/history`, {
          params: { pcivId },
        });
        const history: ReportHistory[] = response?.data?.data ?? [];
        setDescendingOrderReportsHistory(
          [...history].sort(
            (a, b) =>
              new Date(b.mark_date).getTime() - new Date(a.mark_date).getTime(),
          ),
        );
      } catch (err) {
        setError((err as AxiosError).message);
      } finally {
        setLoading(false);
      }
    };
    getReportHistory(pcivId);
  }, [pcivId]);

  const latest = descendingOrderReportsHistory?.[0];

  // DGM&E referred the report back to this Secretary and no action has been taken yet
  const canAct =
    selectedTabLabel === REFERBACK_BY_DGME_TAB &&
    latest?.mark_to === userId &&
    latest?.status === REFERBACK;

  // One level up: the officer who referred it back (DGM&E)
  const nextLevelUserId = latest?.mark_From;

  // One level down: the attached department user who first submitted it to this Secretary
  const previousLevelUserId = useMemo(
    () =>
      descendingOrderReportsHistory
        ?.filter((h) => h.mark_to === userId && h.status === SUBMITTED)
        .sort(
          (a, b) =>
            new Date(a.mark_date).getTime() - new Date(b.mark_date).getTime(),
        )[0]?.mark_From,
    [descendingOrderReportsHistory, userId],
  );

  const markTo = isReferback ? previousLevelUserId : nextLevelUserId;

  const userName = (id?: number) =>
    users.find((user) => user.id === id)?.fullName;

  const onSubmit = async (formData: ReportNotingForm) => {
    if (!markTo) return;

    const payload = {
      id: 0,
      pcivId: data.pcivId,
      markFrom: userId,
      markTo,
      remarks: formData.remarks,
      path: data.reportPath,
      status: isReferback ? REFERBACK : SUBMITTED,
    };

    try {
      setSubmitting(true);
      await apiClient.post(`${PC_IV_WORKFLOW_API}/mark`, payload);
      toast.success(
        isReferback
          ? "Report Referred Back Successfully"
          : "Report Marked Successfully",
      );
      triggerEscapeKeyPress();
      setRefresh((prev) => !prev);
      onCommentSubmitted?.();
    } catch (err) {
      console.error((err as AxiosError).message);
      toast.error("An unexpected error occured.");
    } finally {
      setSubmitting(false);
    }
  };

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
          ) : descendingOrderReportsHistory ? (
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
                  users={users}
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
                  {canAct ? (
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
                          {previousLevelUserId !== undefined && (
                            <div className="col-12 mb-2">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="referback-previous-level"
                                  checked={isReferback}
                                  onChange={() => setReferback(!isReferback)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="referback-previous-level"
                                >
                                  Referback:{" "}
                                  {userName(previousLevelUserId) ??
                                    "Attached Dept."}
                                </label>
                              </div>
                            </div>
                          )}
                          {!isReferback && (
                            <p className="mb-0">
                              Mark To: {userName(nextLevelUserId) ?? "DGM&E"}
                            </p>
                          )}
                        </div>
                        <div className="row d-flex justify-content-end m-0">
                          <div className="col-auto">
                            <Button
                              disabled={isSubmitting || !markTo}
                              type="submit"
                              className="btn rounded-pill fs18px fw-normal px-3"
                              style={{
                                background: markTo
                                  ? "rgba(0, 57, 206,.05)"
                                  : "rgba(201, 201, 201,.5)",
                                color: markTo ? "#0039CE" : "#454545",
                              }}
                            >
                              {isReferback ? "Referback" : "MARK To"}{" "}
                              {isSubmitting && <Spinner />}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </>
                  ) : (
                    "Response Submitted"
                  )}
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

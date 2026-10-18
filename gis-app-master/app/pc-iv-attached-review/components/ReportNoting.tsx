"use client";
import { PC_IV_WORKFLOW_API } from "@/shared/api/endpoints";
import Button from "@/shared/components/Button";
import Spinner from "@/shared/components/Spinner";
import { Officer, ReportHistoryUser } from "@/features/users";
import apiClient, { AxiosError } from "@/shared/api/client";
import { triggerEscapeKeyPress } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { SubmittedReport, ReportHistory } from "../types";
import { REFERBACK, SCHEDULED, SUBMITTED } from "@/shared/constants/statuses";
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

type SubmitAction = "forward" | "referback";

interface Props {
  data: SubmittedReport;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number;
  users: ReportHistoryUser[];
  departmentHead?: Officer;
  onCommentSubmitted?: () => void;
}

const ReportNoting = ({
  data,
  setRefresh,
  userId,
  users,
  departmentHead,
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
  const [submitAction, setSubmitAction] = useState<SubmitAction | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        console.error("Submission error:", err);
      } finally {
        setLoading(false);
      }
    };
    getReportHistory(pcivId);
  }, [pcivId]);

  const latest = descendingOrderReportsHistory?.[0];

  // Attached department ne report is user ko submit ki hai aur abhi tak koi action nahi hua
  const canAct =
    data.submittedTo === userId &&
    data.status === SUBMITTED &&
    (!latest || (latest.mark_to === userId && latest.status === SUBMITTED));

  const attachedDeptUser = users.find((u) => u.id === data.submittedFrom);

  const onSubmit = async (formData: ReportNotingForm, action: SubmitAction) => {
    // const markTo = action === "forward" ? departmentHead?.id : data.submittedFrom;

    // if (!markTo) {
    //ave
    //   toast.error("DGM&E officer not found.");
    //   return;
    // }

    const payload = {
      id: 0,
      pcivId: data.pcivId,
      markFrom: data?.submittedTo, //security
      markTo: 50, //DGME
      remarks: formData.remarks,
      path: data.reportPath,
      status: data?.status
    };

    try {
      setSubmitAction(action);
      await apiClient.post(`${PC_IV_WORKFLOW_API}/mark`, payload);
      toast.success(
        action === "forward"
          ? "Report Submitted to DGM&E Successfully"
          : "Report Referred Back Successfully",
      );
      triggerEscapeKeyPress();
      setRefresh((prev) => !prev);
      onCommentSubmitted?.();
    } catch (err) {
      console.error((err as AxiosError).message);
      toast.error("An unexpected error occured.");
    } finally {
      setSubmitAction(null);
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

  const isSubmitting = submitAction !== null;

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
                {descendingOrderReportsHistory.length > 0 && (
                  <HistoryList
                    descendingOrderData={descendingOrderReportsHistory}
                    users={users}
                  />
                )}
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
                    <form onSubmit={(e) => e.preventDefault()}>
                      <p className="mb-1 fw-normal fs18px">
                        Description Level{" "}
                        {errors.remarks && (
                          <span className="text-danger mt-1 fs14px">
                            - {errors.remarks.message}
                          </span>
                        )}
                      </p>
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
                      <div className="row d-flex justify-content-end m-0 gap-2">
                        <div className="col-auto">
                          <Button
                            type="button"
                            disabled
                            onClick={handleSubmit((f) => onSubmit(f, "referback"))}
                            className="btn rounded-pill fs18px fw-normal px-3"
                            style={{
                              background: "rgba(201, 201, 201,.5)",
                              color: "#454545",
                            }}
                          >
                            Referback to {attachedDeptUser?.fullName ?? "Attached Dept."}{" "}
                            {submitAction === "referback" && <Spinner />}
                          </Button>
                        </div>
                        <div className="col-auto">
                          <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit((f) => onSubmit(f, "forward"))}
                            className="btn rounded-pill fs18px fw-normal px-3"
                            style={{
                              background: "rgba(0, 57, 206,.05)",
                              color: "#0039CE",
                            }}
                          >
                            Submit to DGM&E{" "}
                            {submitAction === "forward" && <Spinner />}
                          </Button>
                        </div>
                      </div>
                    </form>
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

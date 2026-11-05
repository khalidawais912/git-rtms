"use client";
import useUserInfo from "@/hooks/useUserInfo";
import type { SubmittedReport } from "@/app/report-history/types";
import { useEffect, useState } from "react";
import { fetchPcivSubmittedReports, fetchSubmittedReports } from "../services";

export interface ReviewCount {
  /** Reports sent to or by this user */
  total: number;
  /** Reports waiting for this user as focal person (the red badge) */
  pending: number;
}

const count = (reports: SubmittedReport[] | undefined, userId: number): ReviewCount => ({
  total: reports?.filter((r) => r.submittedTo === userId || r.submittedFrom === userId).length ?? 0,
  pending: reports?.filter((r) => r.submittedTo === userId && r.isFocalPerson === true).length ?? 0,
});

/** Report Review and PC-IV Review counts, same sources as the old dashboard cards */
export const useReviewCounts = ({ withPciv }: { withPciv: boolean }) => {
  const { userId } = useUserInfo();
  const [reports, setReports] = useState<SubmittedReport[]>();
  const [pcivReports, setPcivReports] = useState<SubmittedReport[]>();

  useEffect(() => {
    if (!userId) return;
    fetchSubmittedReports(userId)
      .then(setReports)
      .catch((err) => console.error("Report review error:", err));
  }, [userId]);

  useEffect(() => {
    if (!userId || !withPciv) return;
    fetchPcivSubmittedReports(userId)
      .then(setPcivReports)
      .catch((err) => console.error("PC-IV review error:", err));
  }, [userId, withPciv]);

  return {
    userId,
    reportReview: userId ? count(reports, userId) : undefined,
    pcivReview: userId ? count(pcivReports, userId) : undefined,
  };
};

/** Feedback entry returned by the feedback API. */
export interface FeedbackItem {
  id: number;
  projectId: number;
  userId: number;
  remarks: string;
  commentPath: string;
  reportTo: number;
  status: number;
  reportDate: string;
  resolvedDate: string;
}

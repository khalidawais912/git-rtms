import { PcivButton } from "./types";

// PC-IV workflow statuses. Separate from shared/constants/statuses,
// which monitoring visits still use.
export const PCIV_STATUS = {
  IN_PROCESS: 1,
  SUBMITTED: 2,
  REFERRED_BACK: 3,
  APPROVED_BY_SECRETARY: 4,
  APPROVED_BY_DG: 5,
  COMPLETED: 6,
  MARKED_TO_EVALUATION: 7,
  CANCELLED: 8,
} as const;

export const PCIV_STATUS_NAME: Record<number, string> = {
  1: "In Process",
  2: "Submitted",
  3: "Referred Back",
  4: "Approved by Secretary",
  5: "Approved by DG DGME",
  6: "Completed",
  7: "Marked to Evaluation",
  8: "Cancelled",
};

/** Bootstrap classes for the status badge / Sr# block. */
export const PCIV_STATUS_CLASS: Record<number, string> = {
  1: "bg-secondary text-light",
  2: "bg-primary text-light",
  3: "bg-warning text-dark",
  4: "bg-info text-dark",
  5: "bg-dark text-light",
  6: "bg-success text-light",
  7: "bg-success text-light",
  8: "bg-danger text-light",
};

/** Statuses after which nobody has a button. */
export const PCIV_FINAL_STATUSES: number[] = [
  PCIV_STATUS.COMPLETED,
  PCIV_STATUS.MARKED_TO_EVALUATION,
  PCIV_STATUS.CANCELLED,
];

export const PCIV_BUTTON_LABEL: Record<PcivButton, string> = {
  submit: "Submit",
  forward: "Forward",
  referBack: "Refer back",
  complete: "Complete",
  cancel: "Cancel PC-IV",
};

export const PCIV_REMARKS_REQUIRED = new Set<PcivButton>(["referBack", "cancel"]);
export const PCIV_NEEDS_PERSON = new Set<PcivButton>(["forward"]);
export const PCIV_CONFIRM = new Set<PcivButton>(["complete", "cancel"]);

/** History row `action`. 3 and 6 appear only on rows from the previous workflow. */
export const PCIV_ACTION = {
  SUBMIT: 1,
  REFER_BACK: 2,
  APPROVE: 3,
  FORWARD: 4,
  COMPLETE: 5,
  SEND_TO_EVALUATION: 6,
  CANCEL: 7,
} as const;

export const PCIV_ACTION_LABEL: Record<number, string> = {
  1: "Submitted",
  2: "Referred back",
  3: "Approved",
  4: "Forwarded",
  5: "Completed",
  6: "Sent to evaluation",
  7: "Cancelled",
};

export const PCIV_SIGNATURE_STAGE_LABEL: Record<number, string> = {
  1: "Initiated By",
  2: "Department User",
  3: "Secretary",
};

import { PcvButton } from "./types";

/** PC-V statuses. */
export const PCV_STATUS = {
  IN_PROCESS: 1,
  SUBMITTED: 2,
  REFERRED_BACK: 3,
  APPROVED_BY_SECRETARY: 4,
  APPROVED_BY_DG: 5,
  COMPLETED: 6,
  MARKED_TO_EVALUATION: 7,
  CANCELLED: 8,
} as const;

export const PCV_STATUS_NAME: Record<number, string> = {
  1: "In Process",
  2: "Submitted",
  3: "Referred Back",
  4: "Approved by Secretary",
  5: "Approved by DG DGME",
  6: "Completed",
  7: "Marked to Evaluation",
  8: "Cancelled",
};

/** Bootstrap classes for the status badge, same colours as PC-IV. */
export const PCV_STATUS_CLASS: Record<number, string> = {
  1: "bg-secondary text-light",
  2: "bg-primary text-light",
  3: "bg-warning text-dark",
  4: "bg-info text-dark",
  5: "bg-dark text-light",
  6: "bg-success text-light",
  7: "bg-success text-light",
  8: "bg-danger text-light",
};

/** The department can edit only while the PC-V is In Process or Referred Back. */
export const PCV_EDITABLE_STATUSES: number[] = [PCV_STATUS.IN_PROCESS, PCV_STATUS.REFERRED_BACK];

/** One project gets at most five PC-Vs, one a year. */
export const PCV_MAX_SUBMISSIONS = 5;

/** Chapters 2 to 16; item 1 (Name of the Project) is `pcvMain.projectName`. */
export const PCV_FIRST_CHAPTER = 2;
export const PCV_LAST_CHAPTER = 16;

export const PCV_PHOTO_TYPES = "image/png,image/jpeg,image/webp";
export const PCV_SIGNATURE_TYPES = "image/png,image/jpeg,image/webp";

export const PCV_BUTTON_LABEL: Record<PcvButton, string> = {
  submit: "Submit",
  forward: "Forward",
  referBack: "Refer back",
  complete: "Complete",
  cancel: "Cancel PC-V",
};

export const PCV_REMARKS_REQUIRED = new Set<PcvButton>(["referBack", "cancel"]);
/** Submit and forward go to a person from GET .../forward-to. */
export const PCV_NEEDS_PERSON = new Set<PcvButton>(["submit", "forward"]);
export const PCV_CONFIRM = new Set<PcvButton>(["complete", "cancel"]);

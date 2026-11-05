export const ONE_PAGER_REPORT_ID = 0;
export const COMPLETE_REPORT_ID = 1;
// happy path
export const SCHEDULED = 0;
export const COMPLETED = 1;
export const CANCELLED = 2;
export const SUBMITTED = 3;
export const APPROVED = 4;
export const REFERBACK = 5;
export const ISSUED = 6;

export const statuses = [
  { label: "SCHEDULED", value: SCHEDULED },
  { label: "COMPLETED", value: COMPLETED },
  { label: "CANCELLED", value: CANCELLED },
  { label: "SUBMITTED", value: SUBMITTED },
  { label: "APPROVED", value: APPROVED },
  { label: "REFERBACK", value: REFERBACK },
  { label: "ISSUED", value: ISSUED },
];

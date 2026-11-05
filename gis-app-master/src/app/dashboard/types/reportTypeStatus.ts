export enum ReportTypeStatusEnum {
  EVALUATION = 0,
  MONITORING = 1,
  PCIV = 2,
  PCIIIA = 3,
  PCIIIB = 4,
}

export type ReportTypeStatus =
  (typeof ReportTypeStatusEnum)[keyof typeof ReportTypeStatusEnum];

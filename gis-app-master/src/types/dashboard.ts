export enum DashboardTypeEnum {
  EVALUATION = "EVALUATION",
}

export type DashboardType =
  (typeof DashboardTypeEnum)[keyof typeof DashboardTypeEnum];

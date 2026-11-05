export enum StatusEnum {
  EVALUATION = "EVALUATION",
}

export type Status = (typeof StatusEnum)[keyof typeof StatusEnum];

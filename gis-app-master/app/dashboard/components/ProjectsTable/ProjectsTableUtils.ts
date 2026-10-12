// Define the type of the range state
export interface RangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

export interface FilterParams {
  districtName?: string;
  sectorName?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
  reportStatus?: number;
}

export const reportStatusOptions = [
  { value: "0", label: "SCHEDULED" },
  { value: "1", label: "COMPLETED" },
  { value: "2", label: "CANCELLED" },
  { value: "3", label: "SUBMITTED" },
  { value: "4", label: "APPROVED" },
  { value: "5", label: "REFERBACK" },
  { value: "6", label: "ISSUED" },
];

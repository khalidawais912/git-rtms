export interface ExcelColumn {
  label: string;
  value: string;
}

export interface SingleProjectLessData {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  gsNo: number;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface StringOption {
  label: string;
  value: string;
}

export interface NumberOption {
  label: string;
  value: number;
}

export type Column<T> = {
  label: string;
  value?: keyof T;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

export interface PdfColumn {
  label: string;
  value: string;
}

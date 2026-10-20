export interface CreateVisit {
  id: number;
  projectId: number;
  department_Id: number;
  assignedTo: number;
  status: number;
  latitude: string | null;
  longitude: string | null;
  vehicleID: number;
  districtID: number;
  eriValue: number | null;
  driverID: number;
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt: string;
  complete_at: string | null;
  submitted_at: string | null;
  issued_at: string | null;
  tracking_status: boolean;
  isFocalPerson: boolean;
  visitPlanGroup: number;
  cancel_reason: string | null;
  submitted_from: number | null;
  submitted_to: number | null;
}

export interface TempCopyForm {
  district_Id: number;
  type: number;
  userId: number;
  dateFrom: string;
  dateTo: string;
  driverId: number;
  vehicalId: number;
}

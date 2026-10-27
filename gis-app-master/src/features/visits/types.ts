export interface Visit {
  id: number;
  projectId: number;
  assignedTo: number;
  status: number;
  latitude: string;
  longitude: string;
  vehicleID: number;
  districtID: number;
  mriValue: number;
  driverID: number;
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt: string;
  complete_at: string;
  submitted_at: string;
  issued_at: string;
  tracking_status: true;
  visitPlanGroup: number;
  one_pager_status: string;
  op_submitted_at: string;
}

export interface VisitNew {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  userId: number;
  userName: string;
  designation: string;
  gsNo: string;
  sectorId: number;
  sectorName: string;
  address: string;
  city: string;
  division: string;
  districtId: number;
  districtName: string;
  latitude: string;
  longitude: string;
  locationCoordinates: string;
  status: string;
  visitStatus: true;
  approvalDate: string;
}

/** Attribute choice used by the visit forms. */
export interface AttributeOption {
  attributeId: number;
  label: string;
}

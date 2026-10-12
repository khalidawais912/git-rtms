export interface District {
  id: number;
  divisionName: string;
  districtName: string;
  latitude: string;
  longitude: string;
}

export interface Officer {
  id: number;
  departmentId: number;
  userName: string;
  fullName: string;
  designation: string;
  picture: string;
  email: string;
  phoneNumber: string;
  roleName: string;
}

export interface Project {
  id: number;
  gsNo: string;
  sectorId: number;
  name: string;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  smdpProjectID: number;
}

export interface ReportHistoryUser {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  designation: string;
  picture: string;
  phoneNumber: string;
  roleId: string;
}

export interface StaffTracking {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

export interface TempTourPlan {
  tempId: number;
  departmentId: number;
  gsNo: string;
  projectid: number;
  projectName: string;
  projectId: number;
  district: string;
  sectors: string;
  cost: number;
  type: number;
  userId: number;
  meOfficerName: string;
  section: string;
  dateFrom: string;
  dateTo: string;
  driverName: string;
  vehicleNumber: string;
  vehicleId: number;
  driverId: number;
  districtId: number;
  isFocalPerson: boolean;
}

export interface TourPlan {
  id: number;
  department_Id: number;
  name: string;
  tourStartDate: string;
  tourEndDate: string;
  approvalDate: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
}

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

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

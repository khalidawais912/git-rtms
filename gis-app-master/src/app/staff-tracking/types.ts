export interface StaffTracking {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

export interface VisitByUserId {
  projectId: number;
  projectName: string;
  projectLat: string;
  projectLong: string;
  projectDistrict: string;
  driverName: string;
  driverImage: string;
  carNumber: string;
  carImage: string;
  visit: {
    id: number;
    projectId: number;
    assignedTo: number;
    status: string;
    latitude: string;
    longitude: string;
    vehicleID: number;
    driverID: number;
    fromDate: string;
    toDate: string;
    createdAt: string;
    updatedAt: string;
    reportPath: string;
  };
}

export interface Coordinates {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

export interface TrackingRequestData {
  userId: number;
  visitId: number;
  date: string | null;
}

export interface OptionUser {
  id: number;
  name: string;
}

export interface OptionProject {
  id: number;
  name: string;
}

export interface OptionDate {
  id: number;
  name: string;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface ProjectVisit {
  visitId: number;
  visitName: string;
}

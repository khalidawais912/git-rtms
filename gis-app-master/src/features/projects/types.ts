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

export interface SuperGroupOption {
  id: number;
  superGroupLabel: string;
}

export interface UserOption {
  id: number;
  userName: string;
}

export interface SmdpSync {
  schemeId: string;
}

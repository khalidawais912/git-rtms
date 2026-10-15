/** Login account returned by GET /api/Authentication/users. */
export interface Authentication {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  designation: string;
  picture: string;
  phoneNumber: string;
  roleId: string;
}

/** Staff profile returned by GET /api/Users/GetAllUsers. */
export interface User {
  id: number;
  name: string;
  designation: string;
  attendance_id: number;
  machine_num: number;
  status: true;
  created_at: string;
  updated_at: string;
  departmentId: number;
  created_by: string;
  updated_by: string;
  user_Id: number;
  bps: number;
  userImage: string;
}

/** A role the user can be assigned in the role form. */
export interface RoleOption {
  id: number;
  name: string;
}

/** Officer returned by GET /api/Authentication/GetOfficers. */
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

/** User or officer returned by GET /api/Authentication/GetAllOfficersList. */
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

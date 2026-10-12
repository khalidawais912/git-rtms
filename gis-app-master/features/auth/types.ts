import type { BaseResponse } from "@/shared/api/client";

export interface UserData {
  id: number;
  userName: string;
  email: string;
}

export interface UserProfile {
  department_Id: number;
  firstName: string;
  lastName: string;
}

/** `data` of the backend login response (POST /api/Authentication/login). */
export interface LoginData {
  token: string;
  expiration: string;
  role: [string];
  rights: { rightName: string }[];
  userData: UserData;
  userProfile: UserProfile;
}

export type LoginResponse = BaseResponse<LoginData>;

/** What the Next.js route /api/auth/login sends back to the browser. */
export interface LoginRouteResponse {
  message: string;
  user: UserData;
}

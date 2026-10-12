/** Department returned by GET /api/Departments. */
export interface Department {
  id: number;
  name: string;
  logo: string;
  shortName: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface DepartmentRight {
  id: number;
  department_Id: number;
  fieldName: string;
  fieldValue: string;
}

/** Field names a department right can restrict, keyed by field id. */
export interface FiledList {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
}

/** One selectable value for a field, from GetDataAgainstField. */
export interface DataAgainstFiled {
  id: number;
  // for parameter 1
  divisionName: string;
  districtName: string;
  latitude: string;
  longitude: string;
  // for parameter 2 and 3
  name: string; // for parameter 4 and 5
  description: string;
  // for parameter 3
  parentId: number;
  createdAt: string; // for parameter 4
  updateAt: string;
  sortId: number;
  // for parameter 4 and 5
  status: boolean;
  updatedAt: string;
}

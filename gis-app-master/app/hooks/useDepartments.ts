import { DEPARTMENT_API } from "../APIs";
import useData from "./useData";

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

// export interface DepartmentData {
//   department: Department;
//   departmentRights: DepartmentRight[];
// }

interface Props {
  refresh?: boolean;
}

const useDepartments = ({ refresh = false }: Props = {}) =>
  useData<Department>({ refresh, endpoint: DEPARTMENT_API });

export default useDepartments;

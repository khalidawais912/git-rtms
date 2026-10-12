import { useEffect, useMemo } from "react";
import { EVALUATION_ATTRIBUTES_API, ATTRIBUTES_API } from "../APIs";
import { DashboardTypeEnum } from "../dashboard/types/types";
import useData from "./useData";
import { useSearchParams } from "next/navigation";

export interface Attribute {
  attributeId: number;
  attributeDataType: string;
  multiselect: number;
  label: string;
  validationRegx: string;
  min: number;
  max: number;
  required: number;
  status: number;
  hidden: number;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
  attributeType: string;
  unit: string;
  errorMessage: string;
  verificationType: string;
  sortId: number;
  remarks: string;
  weightage: number;
  attributeCode: string;
  evaluationFormula: string;
  parentId: number;
  readOnly: number;
  evaluationFormulaWeightage: number;
  smdpIdentifier: string;
  removeable: number;
  isMaster: number;
  priority: number;
  options?: [
    {
      value: string;
      attributeId: number;
      sortId: number;
      isActive: number;
      label: string;
      createdAt: string;
      updatedAt: string;
      condition: string;
      remarks: string;
    }
  ];
}

interface Props {
  refresh?: boolean;
}

const useAttributes = ({ refresh = false }: Props = {}) => {
  const serachParams = useSearchParams();
  const dashboardType = serachParams.get("dashboardType");

  // const endpoint =
  //   dashboardType === TypeEnum.EVALUATION
  //     ? EVALUATION_ATTRIBUTES_API
  //     : ATTRIBUTES_API;

  // useMemo to ensure recomputation when dashboardType changes
  const endpoint = useMemo(() => {
    return dashboardType === DashboardTypeEnum.EVALUATION
      ? EVALUATION_ATTRIBUTES_API
      : ATTRIBUTES_API;
  }, [dashboardType]);

  return useData<Attribute>({ refresh, endpoint });
};

export default useAttributes;

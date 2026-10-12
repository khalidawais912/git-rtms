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

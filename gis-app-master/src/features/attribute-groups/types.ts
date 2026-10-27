export interface AttributeGroup {
  id: number;
  parentId: number;
  parentName: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sortId: number;
  group_type: number;
  group_nature: number;
}

export interface Option {
  attributeId: number;
  label: string;
}

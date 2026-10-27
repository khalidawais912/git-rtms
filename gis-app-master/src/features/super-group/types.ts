export interface GroupsList {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  parentId: number;
  sortId: number;
}

export interface SuperGroup {
  id: number;
  superGroupLabel: string;
  groupsList: GroupsList[];
}

export interface Option {
  id: number;
  name: string;
}

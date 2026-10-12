export interface Role {
  id: number;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}

export interface Option {
  rightId: number;
  rightName: string;
}

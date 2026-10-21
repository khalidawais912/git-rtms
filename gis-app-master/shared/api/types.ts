export interface ErrorResponse {
  responseCode: number;
  responseMessage: string;
}

export interface BaseResponse<T> {
  responseCode: number;
  responseMessage: string;
  data: T;
}

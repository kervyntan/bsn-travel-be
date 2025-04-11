export type SuccessResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type ErrorResponse = {
  status: number;
  message: string;
  data: null;
};

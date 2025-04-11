import { Request } from "express";

import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_SUCCESS,
  STATUS_CODE_UNAUTHORIZED,
} from "../constants/constants";
import { ErrorResponse, SuccessResponse } from "../types/response.dto";

export const buildSuccessRes = <T>(
  message: string,
  data: T
): SuccessResponse<T> => {
  return {
    status: STATUS_CODE_SUCCESS,
    message: message,
    data: data,
  };
};

export const buildErrorRes = (
  status: number,
  message: string
): ErrorResponse => {
  return {
    status: status,
    message: message,
    data: null,
  };
};

export const buildStatusNotFoundResponse = (message: string): ErrorResponse => {
  return buildErrorRes(STATUS_CODE_NOT_FOUND, message);
};

export const buildBadRequestResponse = (message: string): ErrorResponse => {
  return buildErrorRes(STATUS_CODE_BAD_REQUEST, message);
};

export const buildInternalServerErrorResponse = (
  message: string
): ErrorResponse => {
  return buildErrorRes(STATUS_CODE_INTERNAL_SERVER_ERROR, message);
};

export const buildUnauthenticatedResponse = (
  message: string
): ErrorResponse => {
  return buildErrorRes(STATUS_CODE_UNAUTHORIZED, message);
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUnauthenticatedResponse = exports.buildInternalServerErrorResponse = exports.buildBadRequestResponse = exports.buildStatusNotFoundResponse = exports.buildErrorRes = exports.buildSuccessRes = void 0;
const constants_1 = require("../constants/constants");
const buildSuccessRes = (message, data) => {
    return {
        status: constants_1.STATUS_CODE_SUCCESS,
        message: message,
        data: data,
    };
};
exports.buildSuccessRes = buildSuccessRes;
const buildErrorRes = (status, message) => {
    return {
        status: status,
        message: message,
        data: null,
    };
};
exports.buildErrorRes = buildErrorRes;
const buildStatusNotFoundResponse = (message) => {
    return (0, exports.buildErrorRes)(constants_1.STATUS_CODE_NOT_FOUND, message);
};
exports.buildStatusNotFoundResponse = buildStatusNotFoundResponse;
const buildBadRequestResponse = (message) => {
    return (0, exports.buildErrorRes)(constants_1.STATUS_CODE_BAD_REQUEST, message);
};
exports.buildBadRequestResponse = buildBadRequestResponse;
const buildInternalServerErrorResponse = (message) => {
    return (0, exports.buildErrorRes)(constants_1.STATUS_CODE_INTERNAL_SERVER_ERROR, message);
};
exports.buildInternalServerErrorResponse = buildInternalServerErrorResponse;
const buildUnauthenticatedResponse = (message) => {
    return (0, exports.buildErrorRes)(constants_1.STATUS_CODE_UNAUTHORIZED, message);
};
exports.buildUnauthenticatedResponse = buildUnauthenticatedResponse;

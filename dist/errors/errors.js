"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailedPreconditionError = exports.DocumentNotFoundError = exports.InvalidArgumentsError = exports.UnauthenticatedError = void 0;
/**
 *  Error class to handle calls made by unauthenticated users
 */
class UnauthenticatedError extends Error {
    /**
     * @constructor
     * @param {string} message - Takes in an error message
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.type = "UnauthenticatedError";
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
/**
 *  Error class to handle bad requests
 */
class InvalidArgumentsError extends Error {
    /**
     * @constructor
     * @param {string} message - Takes in an error message
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.type = "InvalidArgumentsError";
    }
}
exports.InvalidArgumentsError = InvalidArgumentsError;
/**
 *  Error class for cases where the document is not found
 */
class DocumentNotFoundError extends Error {
    /**
     * @constructor
     * @param {string} message - Takes in an error message
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.type = "DocumentNotFoundError";
    }
}
exports.DocumentNotFoundError = DocumentNotFoundError;
/**
 *  Error class for cases where the precondition for the request is not met
 */
class FailedPreconditionError extends Error {
    /**
     * @constructor
     * @param {string} message - Takes in an error message
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.type = "FailedPreconditionError";
    }
}
exports.FailedPreconditionError = FailedPreconditionError;

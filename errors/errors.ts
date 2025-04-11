/**
 *  Error class to handle calls made by unauthenticated users
 */
export class UnauthenticatedError extends Error {
  type: string;
  message: string;

  /**
   * @constructor
   * @param {string} message - Takes in an error message
   */
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = "UnauthenticatedError";
  }
}

/**
 *  Error class to handle bad requests
 */
export class InvalidArgumentsError extends Error {
  type: string;
  message: string;

  /**
   * @constructor
   * @param {string} message - Takes in an error message
   */
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = "InvalidArgumentsError";
  }
}

/**
 *  Error class for cases where the document is not found
 */
export class DocumentNotFoundError extends Error {
  type: string;
  message: string;

  /**
   * @constructor
   * @param {string} message - Takes in an error message
   */
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = "DocumentNotFoundError";
  }
}

/**
 *  Error class for cases where the precondition for the request is not met
 */
export class FailedPreconditionError extends Error {
  type: string;
  message: string;

  /**
   * @constructor
   * @param {string} message - Takes in an error message
   */
  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = "FailedPreconditionError";
  }
}

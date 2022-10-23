class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
  
      // Set the properties of errro obj to be handled by the error handling route
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
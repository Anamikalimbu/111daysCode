// Custom error class that extends the built-in Error
// Allows us to throw structured errors with statusCode anywhere in the app

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Marks this as a known/expected error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

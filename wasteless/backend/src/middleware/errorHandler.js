export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        if (err.errors) {
            const errors = Object.values(err.errors).map(val => val.message);
            message = `Invalid input data: ${errors.join('. ')}`;
        } else {
            message = err.message;
        }
        statusCode = 400;
    }

    // Handle Mongoose Cast Errors (Invalid ID/Date types)
    if (err.name === 'CastError') {
        message = `Invalid ${err.path}: ${err.value}`;
        statusCode = 400;
    }

    // Handle Missing parameters or JSON parse errors
    if (err.type === 'entity.parse.failed') {
        message = `Invalid JSON payload`;
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

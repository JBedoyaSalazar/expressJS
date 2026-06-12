const ErrorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const errorMessage = err.message || "Error interno del servidor"

    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${errorMessage}`)

    if(err.stack) {
        console.error(err.stack)
    }
    
    res.status(statusCode).json({
        status: "Error",
        statusCode,
        Message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });

};

module.exports = ErrorHandlerMiddleware;
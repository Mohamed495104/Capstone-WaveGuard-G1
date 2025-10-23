export const errorMiddleware = (err, req, res, next) => {
    // Log only generic error message
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Server Error', // do not leak internal details
    });
};
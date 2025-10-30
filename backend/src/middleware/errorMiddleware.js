export const errorMiddleware = (err, req, res, next) => {
<<<<<<< HEAD
    console.error('❌ Error:', err.message);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
    });
};
=======
    // Log only generic error message
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Server Error', // do not leak internal details
    });
};
>>>>>>> main

class ValidationError extends Error {
    constructor(message) {
        super(message); 
        this.name = 'ValidationError';
    }
}

const salt_shared = "mblSalt"

const jwt = require('jsonwebtoken')

function authenticatorMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send(); // Return here to exit the middleware
    }

    try {
        const data = jwt.verify(authHeader, 'matchablKey');
        req.user = {
            username: data.username
        };
        next();
    } catch (error) {
        return res.status(401).send('Unable to verify jwt'); // Return if JWT verification fails
    }
};

const requestLoggerMiddleware = (req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);
    console.log('Request Body:', req.body);
    next(); // Pass control to the next middleware function
};

module.exports = {
    ValidationError,
    salt_shared,
    authenticatorMiddleware,
    requestLoggerMiddleware
}
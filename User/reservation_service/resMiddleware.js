const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
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

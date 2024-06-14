const jwt = require('jsonwebtoken')

// module.exports = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         res.status(401).send();
//         return;
//     }

//     const data = jwt.verify(authHeader, "matchablKey") ///the key should go in config

//     req.user = {id: data.id,
//                 username: data.name}
//     next();
// }

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).sendFile(path.join(__dirname, '../public/login.html')); // Return here to exit the middleware
    }

    try {
        const data = jwt.verify(authHeader, 'matchablKey');
        req.user = {
            id: data.id,
            username: data.name
        };
        next();
    } catch (error) {
        return res.status(401).sendFile(path.join(__dirname, '../public/login.html')); // Return if JWT verification fails
    }
};

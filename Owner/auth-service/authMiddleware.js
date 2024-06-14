// const jwt = require('jsonwebtoken')

// module.exports = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         next()
//         return
//     }

//     const data = jwt.verify(authHeader, "matchableKey")

//     req.user = {id: data.id,
//                 username: data.name}
//     next();
// }
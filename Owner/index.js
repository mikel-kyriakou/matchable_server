const express = require('express');
const app = express();
const authRoutes = require('./auth-service/authRoutes');
const profileRoutes = require('./profile-service/profileRoutes');
const resRoutes = require('./res-service/resRoutes')
// const db = require('../shared/db')
// const resService = require('../res-service/resService')
// const helmet = require("helmet")
const cors = require('cors')
// const https = ('https')
// const bodyParser = require('body-parser')
// const fs = require('fs')
const path = require('path')

const requestLoggerMiddleware = (req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);
    console.log('Request Body:', req.body);
    next(); // Pass control to the next middleware function
};

function middlware(req, res, next){
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).sendFile(path.join(__dirname, './public/login.html')); // Return here to exit the middleware
        // res.redirect('/owner/login')
    }

    try {
        const data = jwt.verify(authHeader, 'matchablKey');
        req.user = {
            id: data.id,
            username: data.name
        };
        next();
    } catch (error) {
        return res.status(401).sendFile(path.join(__dirname, './public/login.html')); // Return if JWT verification fails
        // res.redirect('/owner/login')
    }
};


app.use(cors());

app.use(express.json())

app.use('/owner', requestLoggerMiddleware, authRoutes);

app.use('/owner', requestLoggerMiddleware, profileRoutes);

app.use('/owner', requestLoggerMiddleware, resRoutes);

// app.get('/', (req, res)=>{
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// })

app.get('/owner/homepage',middlware, (req, res)=>{
    // res.sendFile(path.join(__dirname, '/public/admin.html'))
    // res.send('hello')
})

app.use('/owner', express.static(path.join(__dirname + '/public')))

const port = 8000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});

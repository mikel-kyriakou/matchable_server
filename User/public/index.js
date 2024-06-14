const express = require('express');
const router =  new express();
const app = new express();
const auth = require("../auth_service/authRoutes");
const profile = require("../profile_service/profileRoutes")
const res = require('../reservation_service/resRoutes')
const search = require('../search_service/searchRoutes')
const {requestLoggerMiddleware} = require('../shared/shared_data')

app.use(express.json());

app.use('/user/auth', requestLoggerMiddleware, auth)

app.use('/user/profile', requestLoggerMiddleware, profile)

app.use('/user/reservations', requestLoggerMiddleware, res)

app.use('/user/search', requestLoggerMiddleware, search)

// app.listen(8000, () => console.log('App available on http://localhost:8000'))

const port = 8080;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
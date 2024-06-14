const express = require('express')
const router =  new express.Router();
const authMiddleware = require('./authMiddleware')
const path = require('path')
const authController = require('./authController')

router.get('/login', authController.getLoginPage);

router.post('/login', authController.login)

module.exports = router

// const app = new express()

// app.get('/login', authController.getLoginPage);

// app.post('/login', authController.login)


// app.listen(8000, () => console.log('App available on http://localhost:8000'))
const express = require('express')
const router =  new express();
const controller = require('./authController')

router.post('/signup', controller.signUp); //body.username body.password

router.post('/login', controller.logIn); //body.username - body.password

router.get('/check-token', controller.checkToken)

module.exports = router
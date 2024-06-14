const express = require('express')
const router =  new express.Router();
const profileMiddlware = require('./profileMiddleware')
const profileController = require('./profileController')


router.get('/profile', profileMiddlware, profileController.getProfilePage)

router.get('/profile/data', profileMiddlware, profileController.getProfileData)

router.post('/profile/data', profileMiddlware, profileController.postProfileData) //post req need to have req.data and it needs to be a json

router.get('/profile/fields', profileMiddlware, profileController.getAllFields)

// router.post('/profile/fields', profileMiddlware, profileController.postField) //req.body.sportName, req.body.sportType, req.body.price, req.body.field_name, req.body.openType, req.body.closeTime

module.exports = router

// app.listen(8000, () => console.log('App available on http://localhost:8000'))
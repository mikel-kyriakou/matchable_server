const express = require('express')
const router =  new express();
const controller = require('./profileController')
const {authenticatorMiddleware} = require('../shared/shared_data')

router.post('/create-profile', authenticatorMiddleware, controller.createProfile);

router.post('/edit-profile', authenticatorMiddleware, controller.editProfile);

router.post('/add-favorite-sports', authenticatorMiddleware, controller.addFavSports);

router.post('/add-favorites-facility/:id', authenticatorMiddleware, controller.addFavFacility);

router.post('/add-profile-image', authenticatorMiddleware, controller.addProfileImage)

router.get('/image', authenticatorMiddleware, controller.getProfileImage)

module.exports = router
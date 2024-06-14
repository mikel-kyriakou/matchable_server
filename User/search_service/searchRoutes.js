const express = require('express')
const router =  new express();
const controller = require('./searchController')
const {authenticatorMiddleware} = require('../shared/shared_data')

router.get('/', authenticatorMiddleware, controller.searchFacilities) //body.query

// router.get('/apply-filters', controller.searchFacilitiesWithFilters) //body.query 

router.get('/recommended', authenticatorMiddleware, controller.getRecommended)

router.get('/all/:sport/:page', authenticatorMiddleware, controller.getAllSportFacilities)

router.get('/facility/:id', authenticatorMiddleware, controller.getFacilityInfo)

router.get('/facilities/available/:sport/:date/:from/:to', authenticatorMiddleware, controller.getAvailableFacilities)

router.get('/facility/:id/availability/:sport/:sport_type/:date', authenticatorMiddleware, controller.getAvailabilityFacility)

module.exports = router
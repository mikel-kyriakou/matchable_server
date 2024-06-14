const express = require('express')
const router =  new express();
const controller = require('./resController')
const middleware = require('../reservation_service/resMiddleware')

router.get('/', middleware, controller.getReservations) //Authorization header

router.post('/', middleware, controller.postReservation) // Authorization headers, body info (field_id, sport_id, date, start_time, end_time)

module.exports = router
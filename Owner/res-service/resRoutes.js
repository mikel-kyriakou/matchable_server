const express = require('express')
const router = new express.Router()
const resMiddleware = require('./resMiddleware')
const controller = require('./resControllers')


router.get('/reservations', resMiddleware, controller.getOwnerReservations)

router.get('/reservations/today', resMiddleware, controller.getReservationsToday)

router.get('/reservations/current_month', resMiddleware, controller.getReservationsMonth)

router.get('/reservations/current_year', resMiddleware, controller.getReservationsYear)

router.get('/reservations/custom/from/:start_date/to/:end_date', resMiddleware, controller.getReservationsCustomDates)

router.get('/reservations/all_future', resMiddleware, controller.getFutureReservations)

router.get('/reservations/field/:id/all', resMiddleware, controller.getFieldReservations)

router.get('/reservations/field/:id/today', resMiddleware, controller.getFieldReservationsDay)

router.get('/reservations/field/:id/current_month', resMiddleware, controller.getFieldReservationsMonth)

router.get('/reservations/field/:id/current_year', resMiddleware, controller.getFieldReservationsYear)

router.get('/reservations/field/:id/custom/from/:start_date/to/:end_date', resMiddleware, controller.getFieldReservationsCustomDates)

router.post('/reservations/field/:id', resMiddleware, controller.postFieldReservations)

module.exports = router
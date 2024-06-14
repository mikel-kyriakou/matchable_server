const {ValidationError} = require('../shared/shared_data')
const service = require('./resService')

async function getReservations(req, res){
    try {
        const username = req.user.username

        const reservations = await service.getUserReservations(username)

        res.status(200).json({reservations: reservations})
        
    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }

    }
}

async function postReservation(req, res){
    try {
        const username = req.user.username

        if(!req.body.field_id || !req.body.date || !req.body.start_time || !req.body.end_time){
            throw new ValidationError(`Required information missing. Cannot post reservation. \nBody: ${req.body}`)
        }

        const reservations = await service.postUserReservation(username, req.body.field_id, req.body.date, req.body.start_time, req.body.end_time)

        res.status(200).json({message: "Reservation added"})

    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = {
    getReservations,
    postReservation
}
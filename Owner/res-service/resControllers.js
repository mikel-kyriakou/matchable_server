const resService = require('./resService')
const {ValidationError} = require('../shared/errors')

async function getOwnerReservations(req, res){
    try {
        const user_id = req.user.id;
        const reservations = await resService.getReservationsByOwnerId(user_id);

        res.json({reservations: reservations})

    } catch (error) {
        console.log(error);

        if(error instanceof ValidationError){
            res.status(400).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'Internal server error'});
        }
    }

    return;
}

async function getReservationsToday(req, res){
    try {
        const owner_id = req.user.id;

        const d = new Date();
        const from = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        d.setDate(d.getDate()+1);
        const to = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

        const reservations = await resService.getReservationsDateRange(owner_id, from, to);

        res.json({reservations: reservations});


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

async function getReservationsMonth(req, res){
    try {
        const owner_id = req.user.id;

        const d = new Date();
        const from = d.getFullYear() + "-" + d.getMonth() + "-1";
        if(d.getMonth() === 12){
            const to = (d.getFullYear()+1) + "-1-1";
        }
        else{
            const to = d.getFullYear() + "-" + (d.getMonth()+1) + "-1";
        }

        const reservations = await resService.getReservationsDateRange(owner_id, from, to);

        res.json({reservations: reservations});

    } catch (error) {
        
    }
}

async function getReservationsYear(req, res){
    try {
        const owner_id = req.user.id;

        const d = new Date();
        const from = d.getFullYear() + "-1-1";
        const to = (d.getFullYear()+1) + "-1-1";

        const reservations = await resService.getReservationsDateRange(owner_id, from, to)

        res.json({reservations: reservations})

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

async function getReservationsCustomDates(req, res){
    try {
        const owner_id = req.user.id;

        const from = req.params.start_date;
        const d = new Date(req.params.end_date);
        d.setDate(d.getDate() + 1);
        const to = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

        console.log(`Dates: ${from} ${to}`)

        const reservations = await resService.getReservationsDateRange(owner_id, from, to);

        res.json({reservations: reservations});


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

async function getFieldReservations(req, res){
    try {
        const field_id = req.params.id;
        const owner_id = req.user.id;

        const reservations = await resService.getReservationsFieldById(field_id, owner_id);

        res.json({reservations: reservations})
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

async function getFieldReservationsDay(req, res){
    try {
        const field_id = req.params.id;
        const owner_id = req.user.id;

        const d = new Date();
        const from = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        d.setDate(d.getDate()+1);
        const to = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

        const reservations = await resService.getReservationsFieldByIdDateRange(field_id, owner_id, from, to);

        res.json({reservations: reservations});

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

async function getFieldReservationsMonth(req, res){
    try {
        const field_id = req.params.id;
        const owner_id = req.user.id;

        const d = new Date();
        const from = d.getFullYear() + "-" + d.getMonth() + "-1";
        if(d.getMonth() === 12){
            const to = (d.getFullYear()+1) + "-1-1";
        }
        else{
            const to = d.getFullYear() + "-" + (d.getMonth()+1) + "-1";
        }
    
        const reservations = await resService.getReservationsFieldByIdDateRange(field_id, owner_id, from, to);

        res.json({reservations: reservations});

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

async function getFieldReservationsYear(req, res){
    try {
        const field_id = req.params.id;
        const owner_id = req.user.id;

        const d = new Date();
        const from = d.getFullYear() + "-1-1";
        const to = (d.getFullYear()+1) + "-1-1";
        
        const reservations = await resService.getReservationsFieldByIdDateRange(field_id, owner_id, from, to);

        res.json({reservations: reservations});

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

async function getFieldReservationsCustomDates(req, res){
    try {
        const field_id = req.params.id;
        const owner_id = req.user.id;

        const from = req.params.start_date;
        const d = new Date(req.params.end_date);
        d.setDate(d.getDate() + 1);
        const to = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

        const reservations = await resService.getReservationsFieldByIdDateRange(field_id, owner_id, from, to);

        res.json({reservations: reservations});

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

async function postFieldReservations(req, res){
    const field_id = req.params.id;
    const owner_id = req.user.id;

    const checkAuthority = await resService.checkOwnerHasField(owner_id, field_id);
    if(!checkAuthority){
        res.status(401).send("User not authorized for this field");
        return;
    }

    const checkRequest = await resService.checkReservationRequest(req.body);
    if(!checkRequest){
        res.status(400).send("Missing required fields");
        return;
    }

    const checkAvailability = await resService.checkReservationAvailability(field_id, req.body)
    if(!checkAvailability){
        res.status(409).send("Reservation not available")
        return;
    }

    const sumbitSuccess = await resService.addReservation(field_id, req.body)
    if(sumbitSuccess){
        res.status(200).send("Reservation submitted successfully")
    }
    else{
        res.status(500).send("Reservation sumbition failed")
    }
}

async function getFutureReservations(req, res){
    try {
        const owner_id = req.user.id;
        const d = new Date();
        const today = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

        const reservations = await resService.getAllFutureReservations(owner_id, today);

        res.status(200).json({reservations: reservations});
        
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
    getOwnerReservations,
    getFieldReservations,
    postFieldReservations,
    getFieldReservationsDay,
    getFieldReservationsMonth,
    getFieldReservationsYear,
    getFieldReservationsCustomDates,
    getReservationsToday,
    getReservationsCustomDates,
    getReservationsMonth,
    getReservationsYear,
    getFutureReservations
}
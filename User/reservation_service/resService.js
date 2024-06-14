const db = require('../shared/db')
const { ValidationError } = require('../shared/shared_data')

async function getUserReservations(username){
    if(!username){
        throw new ValidationError('Username missing')
    }

    return await db.getReservationsForUser(username);
}

async function postUserReservation(username, field_id, date, start_time, end_time){
    const reservations = await db.getReservationForFieldDateTime(field_id, date, start_time, end_time);

    if(reservations.length > 0){
        throw new ValidationError('Field not available for these hours.')
    }

    try {
        await db.addReservation(username, field_id, date, start_time, end_time);
    } catch (error) {
        throw error;
    }

    return;
}

module.exports = {
    getUserReservations,
    postUserReservation
}
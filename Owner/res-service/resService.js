const db = require('../shared/db')
const {ValidationError} = require('../shared/errors')


async function getReservationsByOwnerId(id){
    if(!id){
        throw new ValidationError('Make sure owner is authenticated');
    }

    const reservations = await db.getReservationsForOwner(id)

    return reservations;
}

async function getReservationsFieldById(field_id, owner_id){
    if(!field_id){
        throw new ValidationError('Field id is required');
    }

    const check = await checkOwnerHasField(owner_id, field_id);
    if(check){
        const reservations = await db.getReservationsForField(field_id)

        return reservations;
    }
    else{
        throw new ValidationError('Not authorized for this field')
    }

}

async function getReservationsFieldByIdDateRange(field_id, owner_id, from, to){
    if(!field_id || !owner_id || !from || !to){
        throw new ValidationError('Information missing. Make sure owner is authenticated. Field id, date from and date to are required');
    }

    const check = await checkOwnerHasField(owner_id, field_id);
    if(check){
        const reservations = await db.getReservationsForFieldFromTo(field_id, from , to);

        return reservations;
    }
    else{
        throw new ValidationError('Not authorized for this field')
    }
}

async function getReservationsDateRange(owner_id, from, to){
    if(!owner_id || !from || !to){
        throw new ValidationError('Information missing. Make sure owner is authenticated. Field id, date from and date to are required');
    }

    try {
        const facility = await getFacilityByOwnerId(owner_id);

        const facility_id = facility.FacilityID;

        console.log(`Facility id: ${facility_id}`)

        const reservations = db.getReservationsFromTo(facility_id, from, to);

        return reservations;
    } catch (error) {
        throw error;
    }
}

async function checkOwnerHasField(owner_id, field_id){
    const field = await db.getField(field_id);

    if(field.length === 0){
        throw new ValidationError(`This field id (${field_id}) does not exist`);
    }
    else{
        const facility_list = await db.getFacilityForField(field_id);

        const facility = facility_list[0];

        if(facility.OwnerID != owner_id){
            return false;
        }

        return true;
    }
}


async function getFacilityByOwnerId(owner_id){
    const facility_list = await db.getFacilityByOwnerId(owner_id);

    if(facility_list.length === 0){
        throw new ValidationError(`This facility id (${field_id}) does not exist`);
    }
    else{
        const facility = facility_list[0];

        if(facility.OwnerID != owner_id){
            throw ValidationError(`Not authorized for facility id ${facility_id}`);
        }

        return facility;
    }
}

async function checkReservationRequest(body){
    if(!body.date || !body.start_time || !body.end_time){
        return false;
    }

    return true;
}

async function addReservation(field_id, reqBody){
    const added = await db.addReservation(field_id, reqBody.date, reqBody.start_time, reqBody.end_time)

    if(added){
        return true;
    }

    return false;
}

async function checkReservationAvailability(field_id, reqBody){
    const reservations = await db.getReservationForFieldDateTime(field_id, reqBody.date, reqBody.start_time, reqBody.end_time)

    if(reservations.length > 0){
        return false
    }

    return true
}

async function getAllFutureReservations(owner_id, today){
    const reservations = await db.getReservationsFuture(owner_id, today);

    return reservations;
}

module.exports = {
    getReservationsByOwnerId,
    getReservationsFieldById,
    checkOwnerHasField,
    checkReservationRequest,
    addReservation,
    checkReservationAvailability,
    getReservationsFieldByIdDateRange,
    getFacilityByOwnerId,
    getReservationsDateRange,
    getAllFutureReservations
}
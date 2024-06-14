const db = require('../shared/db')
const { ValidationError } = require('../shared/shared_data')

async function searchForFacilities(query){
    return await db.search(query);
}

async function getSportFacilities(sport, page){
    return await db.getSportFacilitiesPage(sport, page)
}

async function getFacility(id){
    const facility_info = await db.getFacilityById(id);

    if(facility_info.length === 0){
        throw new ValidationError(`Facility with id ${id} does not exist`)
    }

    const facility_hours = await db.getFacilityHoursById(id);

    const facility_sports = await db.getFacilitySportsAndPriceById(id);

    const facility_list = {facility_info, facility_sports, facility_hours}

    return facility_list;
}

async function findAvailableFacilities(sport, date, from, to){
    if(!sport || !date || !from || !to){
        throw new ValidationError('Missing requires properties.')
    }

    console.log("sport2: ", sport);

    const facilities = await db.getFacilityAvailable(sport, date, from, to)

    for(let facility of facilities){
        facility.rating = facility.rating.toPrecision(2);
    }

    return facilities;
}

async function findAvailabilityForFacility(facility_id, sport, type, date){
    let date_obj = new Date(date);
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let dayName = daysOfWeek[date_obj.getDay()];

    const fields_list = await db.getFieldsByFacilityIdSport(facility_id, sport, type)

    for(let field of fields_list){
        const reservations = await db.getReservationsForFieldDay(field.id, date);
        field.reservations = reservations;
        const open_hours = await db.getOpeningHoursForFieldDay(field.id, dayName);
        field.open_hours = open_hours[0]

    }

    let fields_availability = []

    for(let field of fields_list){
        const field_new = getAvailability(field);
        field_new.field_name = field.field_name
        fields_availability.push(field_new);
    }

    return fields_availability;
}

async function getRecommendedFacilities(){
    const facilities = await db.getRecFacilities();

    for(let f of facilities){
        f.rating = f.rating.toPrecision(2);
    }

    return facilities;
}





module.exports = {
    searchForFacilities,
    getSportFacilities,
    getFacility,
    findAvailableFacilities,
    findAvailabilityForFacility,
    getRecommendedFacilities
}


function getHourFromDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.getUTCHours(); // Get the hour in UTC
}

function checkHourReservation(hour, reservation_list){
    if(reservationsContainsHourAsStart(hour, reservation_list)){
        return true;
    }
    return false;
}

function reservationsContainsHourAsStart(hour, reservations_list){
    for(let reservation of reservations_list){
        if(getHourFromDateTime(reservation.start_time) == hour){
            return true;
        }
    }
    
    return false;
}

function getAvailability(field){
    available = [];
    for(let h = getHourFromDateTime(field.open_hours.open_time); h<getHourFromDateTime(field.open_hours.close_time); h++){
        if(!checkHourReservation(h, field.reservations)){
            available.push({from: h + ":00", to: (h+1)+":00"})
        }
    }  
    let field_av = {}
    field_av.id = field.id
    field_av.available_hours = available
    return field_av
}


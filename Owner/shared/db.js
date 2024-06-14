const { query } = require("express");
const sql = require("mssql")

const config = {
    user: `test`,  ///CHANGE
    password: 'test', ///CHANGE
    server: 'LAPTOP-T5CC0BSI',
    database: 'mbl-db',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('SQL Connection Error:', err);
        throw err;
    });


async function executeQuery(query){
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);

        return result.recordset
    } catch (err) {
        console.log('SQL Error: ', err);
        console.log('Query: ', query)
        throw err;
    }
}

async function getOwners(){
    const queryString = "select * from owners"
    return await executeQuery(queryString)
}

async function getOwnerById(id){
    const queryString = `select * from owners where id = ${id}`
    return await executeQuery(queryString)
}

async function getOwnerByUsername(username){
    const queryString =  `select * from owners where username = '${username}'`
    return await executeQuery(queryString)
}

async function getReservations(){
    const queryString = "select * from reservations"
    return await executeQuery(queryString)
}

async function getReservationsForOwner(id){
    const queryString = `select R.* from reservations R
    inner join fields on R.field_id = fields.id
    inner join facilities F on fields.facility_id = F.FacilityID
    inner join owners on F.OwnerID = owners.id
    where owners.id = ${id}`

    return await executeQuery(queryString)
}

async function getReservationsForField(id){
    const queryString = `select * from reservations where field_id = ${id}`

    return await executeQuery(queryString)
}

async function getReservationForFieldDateTime(id, date, start_time, end_time){
    const queryString = `SELECT *
                        FROM reservations
                        WHERE field_id = '${id}'
                            AND date = '${date}'
                            AND start_time <= '${end_time}' 
                            AND end_time >= '${start_time}'`
    
    return await executeQuery(queryString)
}

async function getReservationsForFieldFromTo(id, date_from, date_to){
    const queryString = `SELECT *
                        FROM reservations
                        WHERE field_id = ${id} AND
                        date >= '${date_from}' AND date < '${date_to}'
                        `

    return await executeQuery(queryString);
}

async function getReservationsFromTo(facility_id, date_from, date_to){
    const queryString = `select r.* from reservations r
    inner join fields on fields.id = r.field_id
    inner join facilities f on fields.facility_id = f.FacilityID
    where f.FacilityID = ${facility_id}
    AND date >= '${date_from}' AND date < '${date_to}'`

    return await executeQuery(queryString)
}

async function addReservation(field_id, date, start_time, end_time){
    const queryString = `INSERT INTO reservations (user_id, field_id, date, start_time, end_time)
                        VALUES (NULL, '${field_id}', '${date}', '${start_time}', '${end_time}')`

    await executeQuery(queryString);

    return true
}

async function getField(id){
    const queryString = `select * from fields where id = ${id}`;

    return await executeQuery(queryString); 
}

async function getProfileByOwnerId(id){
    const queryString = ` SELECT * FROM facilities
                            WHERE OwnerID = ${id}`

    return await executeQuery(queryString);
}

async function getFacilityForField(id){
    const queryString = `select facilities.* from facilities
    inner join fields on facilities.FacilityID = fields.facility_id
    where fields.id = ${id}`

    return await executeQuery(queryString)
}

async function getFacilityById(id){
    const queryString = `select * from facilities
    where FacilityID = ${id}`

    return await executeQuery(queryString)
}

async function getFacilityByOwnerId(id){
    const queryString = `select * from facilities
    where OwnerID = ${id}`

    return await executeQuery(queryString)
}

async function getOwnerFieldsById(id){
    const queryString = `
    select fields.id from facilities f
    inner join fields on fields.facility_id = f.FacilityID
    where f.OwnerID=${id}`

    return await executeQuery(queryString);
}

async function getFieldInfo(id){
    const queryString = `
    select fields.id, sports.SportName, sports.SportType, fields.price from fields
    inner join sports on fields.sport_id = sports.SportID
    where id = ${id}`

    return await executeQuery(queryString);
}

async function getFieldHours(id){
    const queryString = `
    select day_of_week, open_time, close_time from opening_hours
    where field_id = ${id}`

    return await executeQuery(queryString);
}

async function addField(facility_id, field_name, sport_id, price){
    const queryString = `
    insert into fields(facility_id, sport_id, price, field_name) values
    (${facility_id}, '${field_name}', ${sport_id}, ${price});`

    await executeQuery(queryString);

    return;
}

async function getReservationsFuture(owner_id, today){
    const queryString = `
    SELECT reservations.*, fields.field_name
    FROM reservations
    inner join fields on fields.id = reservations.field_id
    WHERE field_id = ${id} AND
    date >= '${today}'`

    return await executeQuery(queryString);
}

module.exports = {
    getOwners,
    getReservations,
    getOwnerById,
    getOwnerByUsername,
    getReservationsForField,
    addReservation,
    getReservationForFieldDateTime,
    getReservationsForFieldFromTo,
    getField,
    getProfileByOwnerId,
    getReservationsForOwner,
    getFacilityForField,
    getReservationsFromTo,
    getFacilityById,
    getFacilityByOwnerId,
    getOwnerFieldsById,
    getFieldInfo,
    getFieldHours,
    addField,
    getReservationsFuture
}


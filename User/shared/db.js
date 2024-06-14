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

async function addUser(username, password){
    const queryString = `insert into user_credentials(username, password) values
    ('${username}', '${password}');`

    await executeQuery(queryString);

    return true;
}

async function getUserPassword(username){
    const queryString = `select password from user_credentials
    where username = '${username}'`

    return await executeQuery(queryString);
}

async function getReservationsForUser(username){
    const queryString = `select r.username, r.field_id, r.date, r.start_time, r.end_time, f.FacilityName from reservations r
    inner join fields on fields.id = r.field_id
    inner join facilities f on f.FacilityID = fields.facility_id
    where username = '${username}'`

    return await executeQuery(queryString);
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

async function addReservation(username, field_id, date, start_time, end_time){
    const queryString = `insert into reservations(username, field_id, date, start_time, end_time) values
    ('${username}', ${field_id}, '${date}', '${start_time}', '${end_time}')`

    await executeQuery(queryString);

    return true;
}

async function search(query){
    const queryString = `
    DECLARE @query NVARCHAR(4000) = '${query}';

    SELECT 
        mvfs.*,
        ft.RANK
    FROM 
        matView_FacilitiesSports mvfs
    INNER JOIN 
        FREETEXTTABLE(matView_FacilitiesSports, (FacilityName, Address, SportName, SportType), @query) AS ft
        ON mvfs.id = ft.[KEY]
    ORDER BY 
        ft.RANK DESC;
    `

    return await executeQuery(queryString)
}

async function addUserProfile(username, name, surname, email, phone, age){
    const queryString = `
    insert into user_profile(username, name, surname, email, phone_number, age) values
    ('${username}', '${name}', '${surname}', '${email}', '${phone}', ${age}) 
    `

    await executeQuery(queryString);
    return;
}

async function editUser_Profile(username, name, surname, email, phone, age){
    const queryString = `
    update user_profile
    set
    name = '${name}',
    surname = '${surname}',
    email = '${email}',
    phone_number = '${phone}',
    age = ${age}
    where username = '${username}'
    `

    await executeQuery(queryString);

    return;
}

async function getAllSports(){
    const queryString = `
    select * from sports`

    return await executeQuery(queryString);
}

async function insertUser_Sport(username, sport_id){
    const queryString = `
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM user_sports
            WHERE username = '${username}' AND sport_id = ${sport_id}
        )
        BEGIN
            INSERT INTO user_sports (username, sport_id)
            VALUES ('${username}', ${sport_id});
        END
    END`

    await executeQuery(queryString);

    return;
}

async function addUser_Sports(username, sports_list){
    const allSports = await getAllSports();

    for(let sport of allSports){
        if(sports_list.includes(sport.SportName)){
            await insertUser_Sport(username, sport.SportID);
        }
    }

    return;
}

async function getSportFacilitiesPage(sport, page){
    const queryString = `
    DECLARE @PageNumber INT = ${page};
    DECLARE @PageSize INT = 10;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT DISTINCT f.FacilityID, f.FacilityName, f.Address, f.rating
    FROM facilities f
    INNER JOIN fields ON fields.facility_id = f.FacilityID
    INNER JOIN sports ON fields.sport_id = sports.SportID
    WHERE sports.SportName = '${sport}'
    ORDER BY f.rating DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;`

    return await executeQuery(queryString);
}

async function getFacilityById(id){
    const queryString = `
    select distinct f.FacilityName, f.Address from facilities f
    where f.FacilityID = ${id}`

    return await executeQuery(queryString);
}

async function getFacilityHoursById(id){
    const queryString = `
    select distinct oh.day_of_week, min(oh.open_time) as opening, max(oh.close_time) as closing from facilities f
    inner join fields on f.FacilityID = fields.facility_id
    inner join sports on fields.sport_id = sports.SportID
    inner join opening_hours oh on oh.field_id = fields.id
    where f.FacilityID = ${id}
    group by oh.day_of_week`

    return await executeQuery(queryString);
}

async function getFacilitySportsAndPriceById(id){
    const queryString = `
    select distinct sports.SportID, sports.SportName, sports.SportType, fields.price from facilities f
    inner join fields on f.FacilityID = fields.facility_id
    inner join sports on fields.sport_id = sports.SportID
    inner join opening_hours oh on oh.field_id = fields.id
    where f.FacilityID = ${id}
    `

    return await executeQuery(queryString);
}

async function getUserSportsByUsername(username){
    const queryString = `
    select distinct sports.SportName from user_sports
    inner join sports on user_sports.sport_id = sports.SportID
    where user_sports.username = '${username}'`

    return await executeQuery(queryString);
}

async function getFacilityAvailable(sport, date, from, to){
    const queryString = `
    SELECT all_facilities.FacilityID, all_facilities.FacilityName, all_facilities.Address, all_facilities.rating
    FROM (
        SELECT DISTINCT *
        FROM facilities
    ) AS all_facilities
    LEFT JOIN (
        SELECT f.FacilityID
        FROM reservations r
        INNER JOIN fields ON fields.id = r.field_id
        INNER JOIN facilities f ON fields.facility_id = f.FacilityID
        INNER JOIN sports ON fields.sport_id = sports.SportID
        WHERE
        sports.SportName = '${sport}'
        AND date = '${date}'
        AND start_time <= '${to}'
        AND end_time >= '${from}'
    ) AS your_original_query ON all_facilities.FacilityID = your_original_query.FacilityID
    WHERE your_original_query.FacilityID IS NULL;
    `

    return await executeQuery(queryString);
}

async function getOpeningHoursForFieldDay(id, day){
    const queryString = `
    SELECT * from opening_hours
    where field_id = ${id}
    and day_of_week = '${day}'`

    return await executeQuery(queryString);
}

async function getReservationsForFieldDay(facility_id, sport, type, date){
    const queryString = `
    select r.* from facilities f
    inner join fields on fields.facility_id = f.FacilityID
    inner join sports on sports.SportID = fields.sport_id
    inner join reservations r on r.field_id = fields.id
    where SportName = '${sport}'
    and SportType = '${type}'
    and r.date = '${date}'
    and f.FacilityID = ${facility_id}`

    return await executeQuery(queryString);
}

async function getFieldsByFacilityIdSport(id, sport, type){
    const queryString = `
    select fields.id, fields.field_name from fields
    inner join facilities f on f.FacilityID = fields.facility_id
    inner join sports on fields.sport_id = sports.SportID
    where sports.SportName = '${sport}'
    and sports.SportType = '${type}'
    and f.FacilityID = ${id}`

    return await executeQuery(queryString);
}

async function getReservationsForFieldDay(id, date){
    const queryString = `
    select date, start_time, end_time from reservations
    inner join fields on reservations.field_id = fields.id
    where fields.id = ${id}
    and date = '${date}'`

    return await executeQuery(queryString)
}

async function getUserProfile(username){
    const queryString = `
    select username, name, surname, email, phone_number, age from user_profile
    where username = '${username}'`

    return await executeQuery(queryString);
}

async function addUserFavorites(username, favorites){
    const queryString = `
    insert into user_favorites(username, facility_id) values
    ('${username}', ${favorites});`

    await executeQuery(queryString);

    return;
}

async function addUserImage(username, image){
    const queryString = `
    update user_profile
    set profile_image = (select * from Openrowset(bulk '${image}', single_blob) as image)
    where username = 'username'`

    await executeQuery(queryString);
    return;
}

async function getUserProfileImage(username){
    const queryString = `
    select profile_image from user_profile
    where username = '${username}'`

    return await executeQuery(queryString);
}

async function getRecFacilities(){
    const queryString = `
    select top 5 f.FacilityID, f.FacilityName, f.Address, f.rating from  facilities f
    order by f.rating desc
    `

    return await executeQuery(queryString);
}

module.exports = {
    addUser,
    getUserPassword,
    getReservationsForUser,
    getReservationForFieldDateTime,
    addReservation,
    search,
    addUserProfile,
    editUser_Profile,
    addUser_Sports,
    getSportFacilitiesPage,
    getFacilityById,
    getFacilityHoursById,
    getFacilitySportsAndPriceById,
    getUserSportsByUsername,
    getFacilityAvailable,
    getOpeningHoursForFieldDay,
    getReservationsForFieldDay,
    getFieldsByFacilityIdSport,
    getUserProfile,
    addUserFavorites,
    addUserImage,
    getUserProfileImage,
    getRecFacilities
}
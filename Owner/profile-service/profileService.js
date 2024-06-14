const db = require('../shared/db')
const {ValidationError} = require('../shared/errors')

// async function getOwner(id){
//     if(!id){
//         throw new ValidationError('Owner id is required')
//     }

//     const owner = await db.getOwnerById(id);

//     return owner;
// }

async function getOwnerProfile(id){
    if(!id){
        throw new ValidationError('Owner id is required');
    }

    const profileData = await db.getProfileByOwnerId(id);

    return profileData;
}

async function postOwnerProfile(id, data){
    if(!id){
        throw new ValidationError('Owner id is required');
    }

    //to be done
}

async function getOwnerFields(id){
    const fields_id = await db.getOwnerFieldsById(id);
    const fields = []

    for(let id_json of fields_id){
        const info_list = await db.getFieldInfo(id_json.id);
        const info = info_list[0];
        const hours = await db.getFieldHours(id_json.id);

        fields.push({info, hours})
    }

    return fields;
}

async function postNewField(id, field_name, sport_name, sport_type, price){
    const facility_list = await db.getFacilityByOwnerId(id);

    const facility_id = facility_list[0].FacilityID;

    await db.addField(facility_id, field_name, sport_id, price);

    await db.addHoursForFied(field)

    return;
}

module.exports = {
    getOwnerProfile,
    postOwnerProfile,
    getOwnerFields,
    postNewField
}
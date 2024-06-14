const db = require('../shared/db')
const {ValidationError} = require('../shared/shared_data')

async function createUserProfile(username, name, surname, email, phone, age){
    await db.addUserProfile(username, name, surname, email, phone, age);
    return;
}

async function editUserProfile(username, name, surname, email, phone, age){
    await db.editUser_Profile(username, name, surname, email, phone, age);
    return;
}

async function addUserFavSports(username, sports_list){
    if(sports_list.length === 0){
        return;
    }

    await db.addUser_Sports(username, sports_list);

    return;
}

async function addFacilityToFav(username, facility_id){
    await db.addUserFavorites(username, facility_id);

    return;
}

async function addImage(username, image){
    await db.addUserImage(username, image);

    return;
}

async function getImage(username){
    const image = db.getUserProfileImage(username);

    return image;
}
module.exports = {
    createUserProfile,
    editUserProfile,
    addUserFavSports,
    addFacilityToFav,
    addImage,
    getImage
}
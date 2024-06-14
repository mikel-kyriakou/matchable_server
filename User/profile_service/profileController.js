const service = require('./profileService')
const {ValidationError} = require('../shared/shared_data')

async function createProfile(req, res){
    try {
        const body = req.body;
        const username = req.user.username;

        if(!body.name || !body.surname || !body.email || !body.phone || !body.age){
            throw new ValidationError("Not all properties provided. Body: ", body);
        }

        await service.createUserProfile(username, body.name, body.surname, body.email, body.phone, body.age);

        res.status(200).json({message: "User profile added successfully"})
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

async function editProfile(req, res){
    try {
        const username = req.user.username;
        const body = req.body;

        if(!body.name || !body.surname || !body.email || !body.phone || !body.age){
            throw new ValidationError("Not all properties provided. Body: ", body);
        }

        await service.editUserProfile(username, body.name, body.surname, body.email, body.phone, body.age);

        res.status(200).json({message: "User profile edited successfully"})
        
    } catch (error) {
    }
}

async function addFavSports(req, res){
    try {
        const username = req.user.username;
        const sports_list = req.body.sports;

        if(!username || !sports_list){
            throw new ValidationError('Not all properties provided. Body: ', req.body)
        }

        await service.addUserFavSports(username, sports_list);

        res.status(200).json({message: "Favorite sports added"});
        
        
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

async function addFavFacility(req, res){
    try {
        const username = req.user.username;
        const facility_id = req.params.id;

        await service.addFacilityToFav(username, facility_id);

        res.status(200).send()

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

async function addProfileImage(req, res){
    try {
        const username = req.user.username;
        const img_path = req.body.image;

        await service.addImage(username, img_path);

        req.status(200).send();

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

async function getProfileImage(req, res){
    try {
        const username = req.user.username;

        const image = service.getUserImage(username);

        res.status(200).json({image: image})

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
    createProfile,
    editProfile,
    addFavSports,
    addFavFacility,
    addProfileImage,
    getProfileImage
}
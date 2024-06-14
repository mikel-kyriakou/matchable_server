const path = require('path')
const service = require('./profileService')
const { ValidationError } = require('../shared/errors')

async function getProfilePage(req, res){
    let user = req.user

    if(!user){
        res.sendFile(path.join(__dirname, '../public/login-page.html'))
    }
    else{
        service.getOwnerById(user.id)
        .then(response => {
            res.sendFile(path.join(__dirname, '../public/profile-page.html'))
        })
        .catch(err => {
            console.log(err);
            if(err instanceof ValidationError){
                res.status(401).json({error: err.message});
            }
            else{
                res.status(500).json({error: 'Internal Server Error'});
            }
        })
    }
}

async function getProfileData(req, res){
    try {
        const id = req.user.id;

        const data = await service.getOwnerProfile(id);

        res.json({profile_data: data})
        
    } catch (error) {
        console.log(error);
        if(error instanceof ValidationError){
            res.status(401).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}

async function postProfileData(req, res){ // not tested
    try {
        const id = req.user.id;

        const data = req.data;

        let username = null;
        let password = null;

        await service.postOwnerProfile(id, data);

        res.status(200).json({message: 'Profile updated successfully'})
        
    } catch (error) {
    }
}

async function getAllFields(req, res){
    try {
        const id = req.user.id;

        const fieds = await service.getOwnerFields(id);

        res.status(200).json({fields: fieds})

    } catch (error) {
        console.log(error);
        if(error instanceof ValidationError){
            res.status(401).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}

async function postField(req, res){
    try {
        const id = req.user.id
        const field_name = req.body.field_name;
        const sport_name = req.body.sport_name;
        const sport_type = req.body.sport_type;
        const price = req.body.price;
        const open_time = req.body.openTime;
        const close_time = req.body.closeTime;

        if(!id || !field_name || !sport_name || !sport_type || !price || !open_time || !close_time){
            throw new ValidationError('Required information missing. Cannot post field')
        }

        let sport_id

        if(sport_name == "Football"){
            if(sport_type == "5x5"){
                sport_id = 1
            }
            else if(sport_type == "7x7"){
                sport_id = 3
            }
            else{
                throw new ValidationError('Invalid sport type: ', sport_type)
            }
        }
        else if(sport_name == "Basketball"){
            if(sport_type == "5x5"){
                sport_id = 2
            }
            else{
                throw new ValidationError('Invalid sport type:', sport_type)
            }
        }
        else{
            throw new ValidationError('Invalid sport name: ', sport_name)
        }

        await service.postNewField(id, field_name, sport_id, price, open_time, close_time)

        res.status(200).json({message: 'Field added'});
        
    } catch (error) {
        console.log(error);
        if(error instanceof ValidationError){
            res.status(401).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}

module.exports = {
    getProfilePage,
    getProfileData,
    postProfileData,
    getAllFields,
    postField
}
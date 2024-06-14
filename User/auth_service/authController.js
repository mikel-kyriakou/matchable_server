const service = require('./authService')
const {ValidationError} = require('../shared/shared_data')
const jwt = require('jsonwebtoken')

async function signUp(req, res){
    try {

        const body = req.body;

        const token = await service.userSignUp(body);

        res.status(200).header('Authorization', token).json({success: "true"});

    } catch (error) {
        console.log(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        }
        else if(error.number === 2627){
            res.status(409).json({error: 'This username is already taken'})
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }

    }
}

async function logIn(req, res){
    try {
        const body = req.body;

        const result = await service.userLogIn(body);

        res.status(200).header('Authorization', result.token).json({profile: result.profile, sports: result.sports});

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

async function checkToken(req, res){
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send(); 
        }
    
        const data = jwt.verify(authHeader, 'matchablKey');

        const user_sports = await service.getUserSports(data.username)

        res.status(200).json({username: data.username, sports: user_sports});

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
    signUp,
    logIn,
    checkToken
}
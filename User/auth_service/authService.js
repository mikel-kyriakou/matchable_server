const {ValidationError, salt_shared} = require('../shared/shared_data')
const {createHash} = require('crypto')
const db = require("../shared/db")
const jwt = require('jsonwebtoken')

async function createToken(user_json){
    return jwt.sign(user_json, "matchablKey")
}

async function userSignUp(body){
    if(!body.username || !body.password){
        throw new ValidationError('Missing username or password')
    }

    

    const pass_salt = body.password + salt_shared;

    const hash = createHash('sha512').update(pass_salt).digest('hex');

    try {
        await db.addUser(body.username, hash);
    } catch (error) {
        
        throw error
    }

    const token = createToken({username: body.username});

    return token;

}

async function userLogIn(body){
    if(!body.username || !body.password){
        throw new ValidationError('Missing username or password')
    }

    const given_pass_salt = body.password + salt_shared;

    const hash = createHash('sha512').update(given_pass_salt).digest('hex');

    const result = await db.getUserPassword(body.username);

    if(result.length === 0){
        throw new ValidationError('Username invalid');
    }

    const real_password_hash = result[0].password;

    if(hash != real_password_hash){
        throw new ValidationError('Wrong password');
    }

    const token = await createToken({username: body.username, password: body.password});

    const profile = await db.getUserProfile(body.username);

    const sports = await db.getUserSportsByUsername(body.username);

    return {token: token, profile: profile, sports: sports};
}

async function getUserSports(username){
    return await db.getUserSportsByUsername(username);
}

module.exports = {
    userSignUp,
    userLogIn,
    getUserSports
}
const jwt = require('jsonwebtoken')
const db = require("../shared/db")

async function authenticateOwner(username, password){
    const owner = await db.getOwnerByUsername(username)

    if(owner.length === 0){
        return null;
    }
    else{
        if(owner[0].password == password){
            const jwtToken = jwt.sign(owner[0], 'matchablKey')
            owner.token = jwtToken
            return owner;
        }
        else{
            return null;
        }
    }

}

module.exports = {
    authenticateOwner
}
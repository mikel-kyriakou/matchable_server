const path = require('path')
const authService = require('./authService')


async function getLoginPage(req, res){
    res.sendFile(path.join(__dirname, '../public/login.html'))
}

async function login(req, res){
    let username = req.body.username;
    let password = req.body.password;

    owner = await authService.authenticateOwner(username, password)
    
    if(owner){
        res.status(200).header('Authorization', owner.token).send();
        // res.status(200).header('Authorization', owner.token).sendFile(path.join(__dirname, '../public/admin.html'))
        // res.redirect('/owner/homepage')
    }
    else{
        res.status(401).send("Wrong username or password")
    }

}

module.exports = {
    getLoginPage,
    login
}
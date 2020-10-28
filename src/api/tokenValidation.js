const jwt = require('jsonwebtoken');
const { users }= require('../data/users.json'); // Import json
// get token from header
const getToken = (req)=>{

    const bearerHeader = req.headers['authorization'];

    return bearerHeader ? bearerHeader.split(' ')[1] : false;
}

//check if token is valid
const isTokenValid = (token) => {

    const tokenPayload = jwt.decode(token);
    //search for user
    const user = users.find(element => element.username === tokenPayload.username);

    if (user)
    {
        //verify jwt
        try{
            return jwt.verify(token, user.secret);
        } catch (e) {
            return false;
        }
    }
    return false;
};

module.exports ={
    isTokenValid,
    getToken
}
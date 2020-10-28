const { StatusCodes }= require('http-status-codes');

const { getToken, isTokenValid } = require('./tokenValidation');

//check if user is authenticated
const isAuthenticated = (req,res,next)=>{

    const token = getToken(req);
    //check if token is valid
    const payload = isTokenValid(token);

    if (payload)
    {
        req.tokenPayload = payload
        console.log('User is authenticated!');
        next();
    }
    else
    {
        res
        .status(StatusCodes.UNAUTHORIZED)
        .send({
            "error":"Please log in!"
        });
    }

}

module.exports = isAuthenticated;
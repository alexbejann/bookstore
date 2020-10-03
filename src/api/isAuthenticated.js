const { StatusCodes }= require('http-status-codes');

const { getToken, isTokenValid } = require('./user');

const isAuthenticated = (req,res,next)=>{

    const token = getToken(req);

    const payload = isTokenValid(token);

    if (payload)
    {
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
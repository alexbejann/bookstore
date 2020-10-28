const { StatusCodes } = require('http-status-codes');

//Check if user is admin
function isAdmin (req,res,next)
{
    //check token payload for role
    if (req.tokenPayload.roles.indexOf('admin') >= 0)
    {
        console.log('User is admin');
        next();
    }
    else
    {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .send({
                "Error":"You are not admin!"
            });
    }
}
module.exports = isAdmin
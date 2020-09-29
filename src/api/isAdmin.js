const { StatusCodes } = require('http-status-codes');

//Check if user is admin
module.exports = function isAdmin (req,res,next)
{
    if (req.user.roles.indexOf('admin') === -1)
    {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .send({
                "error":"You are not admin!"
            });
    }
    else
    {
        console.log('You can manage you bids');
        next();
    }
}
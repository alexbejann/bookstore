const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
// Salt to hash the password
const saltRounds = 10;


const router = Router();
const { users }= require('../data/users.json'); // Import json

const login = (username, password)=>{

    console.log("breaks here in login");
    const currentUser = users.find(user => user.username === username);
    //Check password
    if (bcrypt.compareSync(password, currentUser.password))
    {
        return jwt.sign({
            username: currentUser.username,
            roles: currentUser.roles
        }, currentUser.secret);
    }
    return false;
}

// User login
router.post('/auth', (req, res, next) => {
    try {
        let username = req.body.username || '';

        const password = req.body.password || '';
        // process user login
        const token = login(username, password);

        if (token)
        {
            res.status(StatusCodes.OK).send({
                "token": token
            });
        }
        else
        {
            res.status(StatusCodes.NOT_FOUND)
               res.json({
                 message: "Bad request, something went wrong!"
               });
        }
      
    } catch (error) {
        next(error);
    } 
});

const encryptedPassword = (password) =>{
    return bcrypt.hashSync(password, saltRounds);
};

// User register, user is the resource => post to user || create the user
router.post('/users', (req, res, next) => {
  try {
    let username = req.body.username;

    const password = encryptedPassword(req.body.password || '');

    const email = req.body.email || '';

    const element = users.find(user => user.username === username
                                          && user.email === email);


     if (!element)
     {
         users.push({
             "id": uuidv4(),
             "username": `${username}`,
             "password": `${password}`,
             "email": `${email}`,
             "secret": uuidv4(),
             "roles":[]
         })
         res.status(StatusCodes.CREATED)
         res.json({
             message: `Welcome, ${username}!`,
         })
     } else
     {
         res.status(StatusCodes.CONFLICT) //
         res.json({
             message: `${username}, already exists!`,
         })
     }
  } catch (error) {
    next(error);
  }
});

router.get('/auth', (req, res) =>{
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader ? bearerHeader.split(' ')[1] : null;
    if (token)
    {
        const payload = isTokenValid(token);
        if (payload)
        {
            const user = users
                        .find(element => element.username === payload.username);
            //store the username and role in secret
            res.send({
                    username: user.username,
                    roles: user.roles
                }
            );
        }
        else
        {
            res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
        }
    }
    else
    {
        req.json({
            msg: 'Not authorized!'
        })
    }
});


const isTokenValid = (token) => {
    const tokenPayload = jwt.decode(token);
    const user = users.find(element => element.username === tokenPayload.username);

    if (user)
    {
        try{
            return jwt.verify(token, user.secret);
        } catch (e) {
            return false;
        }
    }
    return false;
};
//logout delete and change secret for user
router.delete('/', (req,res)=>{
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader ? bearerHeader.split(' ')[1] : null;
    console.log('Token '+token)
    if (token) {
        const payload = isTokenValid(token);
        if (payload) {
            const user = users
                        .find(element => element.username === payload.username);
            if (user)
            {
                user.secret = uuidv4();
                res.status(StatusCodes.OK).send({
                    msg:'Logged out!'
                })
            }
            //store the username and role in secret
        } else {
            res.status(StatusCodes.NOT_FOUND).send({message: 'Bad Request, something went wrong'});
        }
    }
    else
    {
        res.status(StatusCodes.NOT_FOUND).send({message: 'Bad Request, you are not authenticated'});
    }
});

module.exports = router;
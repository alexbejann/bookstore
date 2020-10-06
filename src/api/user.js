const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
// Salt to hash the password
const saltRounds = 10;


const user_router = Router();
const { users }= require('../data/users.json'); // Import json
const { books } = require('../data/books.json'); // Import books

//login method
const login = (username, password)=>{

    const currentUser = users.find(user => user.username === username);
    //Check password
    if (bcrypt.compareSync(password, currentUser.password))
    {
        //set user secret
        return jwt.sign({
            username: currentUser.username,
            roles: currentUser.roles
        }, currentUser.secret);
    }
    return false;
}

// User login
user_router.post('/auth', (req, res, next) => {
    try {
        let username = req.body.username || '';

        const password = req.body.password || '';
        // process user login
        const token = login(username, password);

        if (token)
        {
            res
                .status(StatusCodes.OK)
                .send({"token": token});
        }
        else
        {
               res
                   .status(StatusCodes.NOT_FOUND)
                   .json({message: "Bad request, something went wrong!"});
        }
      
    } catch (error) {
        next(error);
    } 
});

const encryptedPassword = (password) =>{
    return bcrypt.hashSync(password, saltRounds);
};

// User register, user is the resource => post to user || create the user
user_router.post('/users', (req, res, next) => {
  try {
      console.log('Registering user...')
    let username = req.body.username;

    //todo check password
    const password = encryptedPassword(req.body.password || '');

    const email = verifyEmail(req.body.email || '');

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
         res
             .status(StatusCodes.CREATED)
             .json({message: `Welcome, ${username}!`,
         })
     } else
     {
         res
             .status(StatusCodes.CONFLICT)
             .json({message: `${username}, already exists!`})
     }
  } catch (error) {
    next(error);
  }
});

// check email by specified regex
const verifyEmail = (email) =>{

    console.log('Checking email...'+email);
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
}

//
user_router.get('/auth', (req, res) =>{

    const token = getToken(req);
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
            res
                .status(StatusCodes.UNAUTHORIZED)
                .send({ message: 'Unauthorized' });
        }
    }
    else
    {
        req
            .status(StatusCodes.UNAUTHORIZED)
            .json({msg: 'Not authorized!'})
    }
});

// get all users
user_router.get('/users', (req, res) =>{

    const token = getToken(req);
    if (token)
    {
        const payload = isTokenValid(token);
        // check if user is admin
        if (payload)
        {
            if (payload.roles.indexOf('admin') > -1)
            {
                //return all users
                res
                    .status(StatusCodes.OK)
                    .send(users)
            }
            else
            {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .send({ message: 'Unauthorized, you are supposed to be admin' });
            }
        }
        else
        {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .send({ message: 'Unauthorized' });
        }
    }
    else
    {
        req
            .status(StatusCodes.UNAUTHORIZED)
            .json({msg: 'Not authorized! Login first!'})
    }
});

// get token from header
const getToken = (req)=>{

    const bearerHeader = req.headers['authorization'];

    return bearerHeader ? bearerHeader.split(' ')[1] : false;
}

//check if token is valid
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
user_router.delete('/auth', (req, res)=>{

    const token = getToken(req);

    console.log('Token '+token)
    if (token) {
        const payload = isTokenValid(token);
        if (payload) {
            const user = users
                        .find(element => element.username === payload.username);
            if (user)
            {
                user.secret = uuidv4();
                res
                    .status(StatusCodes.OK)
                    .send({msg:'Logged out!'})
            }
            //store the username and role in secret
        } else {
            res
                .status(StatusCodes.NOT_FOUND)
                .send({message: 'Bad Request, something went wrong'});
        }
    }
    else
    {
        res
            .status(StatusCodes.NOT_FOUND)
            .send({message: 'Bad Request, you are not authenticated'});
    }
});

module.exports = {
    user_router: user_router,
    getToken,
    isTokenValid
};
const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
// Salt to hash the password
const saltRounds = 10;

const user_router = Router();
const { users }= require('../data/users.json'); // Import json
const isAuthenticated = require('./isAuthenticated');
const isAdmin = require('./isAdmin');

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
                   .json({message: "Username or password are incorrect!"});
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

// get all users
user_router.get('/users',isAuthenticated, isAdmin,(req, res) =>{

    //return all users
    res
        .status(StatusCodes.OK)
        .send(users)

});

//logout delete and change secret for user
user_router.delete('/auth',isAuthenticated, (req, res)=>{

    const user = users
                .find(element => element.username === req.tokenPayload.username);
    if (user)
    {
        user.secret = uuidv4();
        res
            .status(StatusCodes.OK)
            .send({msg:'Logged out!'})
    }
});

module.exports = {
    user_router
};
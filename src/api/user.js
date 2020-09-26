const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Salt to hash the password
const saltRounds = 10;


const router = Router();
const users = require('../data/users.json'); // Import json
const fs = require('fs');

const login = (username, password)=>{

    const currentUser = users.users.find(user => user.username === username);

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
            res.status(200).send({
                "token": token
            });
        }
        else
        {
            res.status(404)
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

    const password = encryptedPassword(req.body.password);

    const element = users.users.find(user => user.username === username );


     if (!element)
     {
         users.users.push({
             "id": uuidv4(),
             "username": `${username}`,
             "password": `${password}`,
             "secret": uuidv4(),
             "roles":[]
         })
         res.status(201)
         res.json({
             message: `Welcome, ${username}!`,
         })
     } else
     {
         res.status(400) //
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
            const user = users.users
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
            res.status(404);
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
    const user = users.users.find(element => element.username === tokenPayload.username);

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

module.exports = router;
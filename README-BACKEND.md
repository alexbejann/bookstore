# Assignment 1 - Express
-  **Daniel-Alexandru Bejan**
-  **Cosmin George Mucalau**

## Get Started
Do `npm install` or `pnpm install`([pnpm](https://www.npmjs.com/package/pnpm), to install run `npm i pnpm`) to install dependencies and to run project do `npm run dev`. This command will start the server to listen on `http://localhost:3000
`.

## Project structure, backend only
- src
    - api
        - books.js
        - isAdmin.js
        - isAuthenticated.js
        - tokenValidation.js
        - user.js
    - data
        - books.json
        - user.json
    - rest
        - requests.rest
        - userCalls.rest
    - errorHandlers.js
    - index.js 

## NPM Packages used

| Package                                   | Description                                                 |
|-------------------------------------------|-------------------------------------------------------------|
| [Express](https://www.npmjs.com/package/express) | Is a Node.js module, framework which runs on top of the node server                |
| [Morgan](https://www.npmjs.com/package/morgan) | Morgan is used in our application to log common events, requests from a specific ip for instance |
| [Helmet](https://www.npmjs.com/package/helmet) | Helmet is used in our app to remove and add HTTP headers, which secures the app a bit more. "It's not a silver bullet, but it can help!"           |
| [Nodemon](https://www.npmjs.com/package/nodemon) | Nodemon is used in our app to detect changes so we don't have to restart the server manually |
| [Eslint](https://www.npmjs.com/package/eslint) | Eslint is used in our app to detect common JS/ECMASCRIPT mistakes and notify the developer |
| [Cors](https://www.npmjs.com/package/cors) | Cors is used in our application to enable/add cors headers to allow requests from our front end. Also, we use the cors to allow only a specified origin to make requests to our backend |
| [http-status-codes](https://www.npmjs.com/package/http-status-codes) | This module has been used to specify the status codes for our server responses, to have a clean code |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | jwt module is used to handle the tokens. We sign in the user based on the token and token payload |
| [uuid](https://www.npmjs.com/package/uuid) | As the name suggests, allows us to create RFC4122 UUIDs |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Bcrypt helps us to hash a password by specifying salt rounds |

## Complex code from static files explained

- Middlewares created
    - errorHandlers.js is our first middleware created. If we don't have any route for a req that req will end up in this middleware which will return a 404 (NOT FOUND) along with a stack trace se we have a path for debugging(the stacktrace will be used only in development).
    ```
       const notFound = (req,res,next) =>{
           const error = new Error(`Not Found - ${req.originalUrl}`);
           res.status(StatusCodes.NOT_FOUND);
           next(error);
       };
       
       const errorHandler = (error,req,res,next) => {
           const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
           res.status(statusCode);
           res.json({
               message: error.message,
               stack: error.stack,
           });
       };
   ```
    - isAuthenticated.js middleware which is used throughout the routes when we need to know that our used is logged in
    ```
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
  ```
  - isAdmin.js middleware used throughout the code in route to check if user has permission to do this request if not will return a 401(UNAUTHORIZED)
  ```
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
  ```
  - tokenValidation.js is a middleware used to check if the token provided is valid comparing the user secret to check the token
  ```
    ...
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
    ...
  ```


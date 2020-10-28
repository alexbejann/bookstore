const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const middlewares = require('./errorHandlers');
const books = require('./api/books');
const { user_router } = require('./api/user');

// Use the static folder
app.use(express.static(__dirname+'/static'));

// use helmet to protect header
app.use(helmet());
// Use morgan for common logs
app.use(morgan('common'));

// Allow requests only from this origin and add headers
app.use(cors({
    origin: 'http://localhost:5000',
}));
// User json
app.use(express.json());

app.get("/", (req, res) =>{
    res.json({
        message: "Hello",
    })
})

app.use('/books', books); // Process books router

app.use('/', user_router ); // Processes multiple requests

//If we couldn't find any route the request will end you here
app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = 3000;
app.listen(port, () =>{
    console.log(`Listening at http://localhost:${port}`);
});

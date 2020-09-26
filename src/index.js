const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();

const middlewares = require('./middlewares');
const books = require('./api/books');
const user = require('./api/user');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json());

app.get("/", (req, res) =>{
    res.json({
        message: "Hello",
    })
})

app.use('/books', books);

//app.use('/books', books);

// app.use('/books/id/bids', books);

app.use('/', user); // Processes multiple requests 


app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = 3000;
app.listen(port, () =>{
    console.log(`Listening at http://localhost:${port}`);
});

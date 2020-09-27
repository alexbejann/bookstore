const { Router } = require('express');


const router = Router();
const books = require('../data/books');

// Return all books
router.get('/books', (req, res, next) => {
    try {
       res.status(200).send(books.books);
    } catch (error) {
        next(error);
    }
});

// Retrieve books with parameters
router.get('/', (req, res, next) => {
  try {
    let country = req.query.country;
    let author = req.query.author;
    let year = req.query.year;
    if (country != null)
    {
        let result = books.books.filter(element => element.country == country);

        res.status(200);
        res.json(result);
    }
    else if(author != null)
    {
        let result = books.books.filter(element => element.author == author);
        console.log(author.trim());
        res.status(200);
        res.json(result);
    }
    else if (year != null)
    {
        let result = books.books.filter(element => element.year == year);

        res.status(200);
        res.json(result);
    }
    else
    {
        res.status(200);
        res.json(books.books);
    }
  } catch (error) {
    next(error);
  }
});

// Return book by id
router.get('/:id', (req,res) => {
    let book =  (books.books).find(book => book.id === req.params.id);
    if (book != null)
    {
        res.json({
            book : book,
        });
        res.status(200);
    } else {
        res.json({
            Error: "Book doesn't exists",
        });
        res.status(404);
    }
})

// Return bids of a book
router.get('/:id/bids', (req,res) => {
    let book =  (books.books).find(book => book.id === req.params.id);
    if (book != null)
    {
        res.json({
            Bids : book.bids,
        });
        res.status(200);
    } else {
        res.json({
            Error: "Book doesn't exists",
        });
        res.status(404);
    }
})

// Post bid to a book
router.post('/:id/bids', (req,res) => {
    let book =  (books.books).find(book => book.id === req.params.id);
    if (book != null)
    {
        book.bids.push({
            "username": `${req.body.username}`,
            "amount": `${req.body.amount}`,
        });
        res.status(201);
        res.json({
            book : book.bids,
        });

    } else {
        res.json({
            Error: "Book doesn't exists",
        });
        res.status(404);
    }
})

// Delete bid to a book todo check if loggedin use has that specific bid
router.delete('/:id/bids', (req,res) => {
    let book =  (books.books).find(book => book.id === req.params.id);
    let bid_ID  = req.query.id;
    if (book != null && bid_ID != null)
    {
        let bid = book.bids.find(element => element.id == bid_ID);
        delete book.bids[book.bids.indexOf(bid)];

        res.status(200);
        res.json({
            Bids : book.bids,
        });

    } else {
        res.json({
            Error: "Book doesn't exists",
        });
        res.status(404);
    }
})

module.exports = router;
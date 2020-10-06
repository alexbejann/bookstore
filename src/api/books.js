const { Router } = require('express');
const { StatusCodes }= require('http-status-codes');


const router = Router();
const { books } = require('../data/books');
const { getToken, isTokenValid } = require('./user');
const isAuthenticated = require('./isAuthenticated');
const isAdmin = require('./isAdmin')

// Return all books
router.get('/books', (req, res, next) => {
    try {
       res.status(200).send(books);
    } catch (error) {
        next(error);
    }
});

// Get bids for a user
router.get('/bids', (req,res) => {

    const payload = isTokenValid(getToken(req));
    console.log('Bids for user....')
    if (payload)
    {
        const
            username = payload.username,
            user_bids = [];
        for (let index = 0; index < books.length ; index++)
        {
            const bookBids = books[index].bids;

            for (let i = 0; i < bookBids.length ; i++)
            {
                if (bookBids[i].username === username)
                {
                    console.log('Bid added',bookBids[i])
                    user_bids.push({
                        "bookID": "" + books[index].id,// book id
                        "bidID": bookBids[i].id, // bid id
                        "price": bookBids[i].amount,
                        "title": books[index].title,
                        "time": bookBids[i].time,
                    })
                }
            }
        }
        res
            .status(StatusCodes.OK)
            .json(user_bids);
    }
    else
    {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .json({Error: "Please login!"});
    }
})

// Retrieve books with parameters
router.get('/', (req, res, next) => {
  try {
    let country = req.query.country;
    let author = req.query.author;
    let year = req.query.year;
    if (country != null)
    {
        let result = books.filter(element => element.country == country);

        res
            .status(StatusCodes.OK)
            .json(result);
    }
    else if(author != null)
    {
        let result = books.filter(element => element.author == author);
        console.log(author.trim());
        res.status(StatusCodes.OK);
        res.json(result);
    }
    else if (year != null)
    {
        let result = books.filter(element => element.year == year);

        res.status(StatusCodes.OK);
        res.json(result);
    }
    else
    {
        res.status(StatusCodes.OK);
        res.json(books);
    }
  } catch (error) {
    next(error);
  }
});

// Return book by id
router.get('/:id', (req,res) => {
    let book =  (books).find(book => book.id === req.params.id);
    if (book != null)
    {
        res.status(StatusCodes.OK).json({
            book : book,
        });
    } else {
        res.json({
            Error: "Book doesn't exists",
        });
        res.status(StatusCodes.NOT_FOUND);
    }
})

// Return bids of a book
router.get('/:id/bids', (req,res) => {
    let book =  (books).find(book => book.id === req.params.id);
    if (book != null)
    {
        res.json({
            Bids : book.bids,
        });
        res.status(StatusCodes.OK);
    } else {
        res.json({
            Error: "Book doesn't exists",
        });
        res.status(StatusCodes.NOT_FOUND);
    }
})

// Post bid to a book
router.post('/:id/bids', (req,res) => {

    console.log('Do post id/bids')
    const payload = isTokenValid(getToken(req));
    console.log('Token is valid');
    if (payload)
    {
        let book =  (books).find(book => book.id === req.params.id);
        if (book)
        {
            const date = new Date();
            book.bids.push({
                            "id":""+Math.floor(Math.random() * 110000)+1,
                            "username": `${req.body.username}`,
                            "amount": `${req.body.amount}`,
                            "time":  ''+date.getHours()+':'+date.getMinutes()
                            });
            res
                .status(StatusCodes.CREATED)
                .json(book.bids);

        } else {
            console.log('Book does not exist');
            res
                .status(StatusCodes.NOT_FOUND)
                .send({"Error": "Book doesn't exists"});
        }
    }
    else
    {
        res.status(StatusCodes.UNAUTHORIZED).send({"msg":'You are not logged in!'})
    }
})

//Post new book
router.post('/', (req,res) => {

    console.log('Creating new book')
    const payload = isTokenValid(getToken(req));
    console.log('Token is valid');
    if (payload)
    {
        if (payload.roles.indexOf('admin') > -1)
        {
            const title = req.body.name,
                  author = req.body.author,
                  year = req.body.year,
                  price = req.body.price,
                  time = req.body.time,
                  country = req.body.country;

            const exist =  books.find(book => book.title === title);
            if (!exist)
            {

                books.push({
                    "id":""+Math.floor(Math.random() * 110000)+1,
                    "author": author,
                    "country": country,
                    "pages": Math.floor(Math.random() * 300)+10,
                    "title": title,
                    "year": year,
                    "price": price,
                    "time": time,
                    "bids": []
                });
                res
                    .status(StatusCodes.CREATED)
                    .json(books);
            }
            else {
                console.log('Book exists');
                res
                    .status(StatusCodes.CONFLICT)
                    .json({ Error: "Book already exists"});
            }
        }
    }
    else
    {
        res.status(StatusCodes.UNAUTHORIZED).send({"msg":'You are not logged in!'})
    }
})

// Delete bid from a book
router.delete('/:id/bids', (req,res) => {

    const payload = isTokenValid(getToken(req));

    console.log('Deleting bid from book...',req.params.id, req.query.id)
    if (payload)
    {
        let book =  (books).find(book => book.id === req.params.id);
        let bid_ID  = req.query.id;
        if (book != null && bid_ID != null)
        {
            let bid = book.bids.find(element => element.id == bid_ID);
            book.bids.splice(book.bids.indexOf(bid), 1);
            console.log('log',bid)
            res.status(StatusCodes.OK);
            res.json({
                Bids : book.bids,
            });

        } else {
            res
                .status(StatusCodes.NOT_FOUND)
                .send({"Error": "Book doesn't exists"});
        }
    }
})

// Delete book
router.delete('/:id', (req,res) => {

    const payload = isTokenValid(getToken(req));

    if (payload)
    {
        if (payload.roles.indexOf('admin') > -1)
        {
            let book =  (books).find(book => book.id === req.params.id);

            if (book)
            {
                //remove book
                const index = books.indexOf(book);
                books.splice(index, 1);

                res
                    .status(StatusCodes.OK)
                    .json({msg: "Book removed"})

            } else {
                res
                    .status(StatusCodes.NOT_FOUND)
                    .json({Error: "Book doesn't exists"})
            }
        }
        else
        {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .send({"MSG":'You should be admin for this action!'})
        }
    }
    else
    {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .send({"MSG":'Please login!'})
    }
})

module.exports = router;
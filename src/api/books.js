const { Router } = require('express');
const { StatusCodes }= require('http-status-codes');


const router = Router();
const { books } = require('../data/books');
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
router.get('/bids', isAuthenticated, (req,res) => {

    console.log('Bids for user....',req.tokenPayload.username)

        const
            username = req.tokenPayload.username,
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
        res
            .status(StatusCodes.OK)
            .json(result);
    }
    else if (year != null)
    {
        let result = books.filter(element => element.year == year);

        res
            .status(StatusCodes.OK)
            .json(result);
    }
    else
    {
        res
            .status(StatusCodes.OK)
            .json(books);
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
        res
            .status(StatusCodes.OK)
            .json({ book : book, });
    } else {
        res
            .status(StatusCodes.NOT_FOUND)
            .json({Error: "Book doesn't exists",});
    }
})

// Return bids of a book
router.get('/:id/bids', (req,res) => {
    let book =  (books).find(book => book.id === req.params.id);
    if (book != null)
    {
        res
            .status(StatusCodes.OK)
            .json({ Bids : book.bids, });
    } else {
        res
            .status(StatusCodes.NOT_FOUND)
            .json({ Error: "Book doesn't exists", });
    }
})

// Post bid to a book
router.post('/:id/bids',isAuthenticated, (req,res) => {

    console.log('Do post id/bids')

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
})

// Update book
router.put('/:id', isAuthenticated, isAdmin,(req,res) => {

    console.log('Updating book....'+req.params.id)
    let book =  (books).find(book => book.id === req.params.id);
    const changes = req.body.changes;

    if (book)
    {
        console.log("This should be changed "+changes,req.body.changes[0]);
        for (let index  = 0; index < changes.length ; index++)
        {
            const fieldChanged = changes[index].fieldChanged,
                newValue = changes[index].newValue;
            console.log(fieldChanged, newValue);
            if ("title" === fieldChanged)
            {

                book.title =  newValue;
            }
            else if ("author" === fieldChanged)
            {
                book.author =  newValue;
            }
            else if ("year" === fieldChanged)
            {
                book.year =  newValue;
            }
            else if ("price" === fieldChanged)
            {
                book.price = newValue;
            }
            else if ("time" === fieldChanged)
            {
                book.time =  newValue;
            }
        }
        console.log(book);

    }
    else
    {
        res
            .status(StatusCodes.NOT_FOUND)
            .send({"Error":"Book doesn't exist!"});
    }

})

//Post new book
router.post('/', isAuthenticated, isAdmin,(req,res) => {

    console.log('Creating new book')

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
})

// Delete bid from a book
router.delete('/:id/bids',isAuthenticated, (req,res) => {

    console.log('Deleting bid from book...',req.params.id, req.query.id)

    let book =  (books).find(book => book.id === req.params.id);
    let bid_ID  = req.query.id;
    if (book != null && bid_ID != null)
    {
        let bid = book.bids.find(element => element.id == bid_ID);

        console.log('Bid to be deleted:',bid)

        book.bids.splice(book.bids.indexOf(bid), 1);
        console.log('Bid:',bid)

        res
            .status(StatusCodes.OK)
            .json(book.bids);

    } else {
        res
            .status(StatusCodes.NOT_FOUND)
            .send({"Error": "Book doesn't exists"});
    }
})

// Delete book
router.delete('/:id',isAuthenticated, isAdmin,(req,res) => {

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
})

module.exports = router;
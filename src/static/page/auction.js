// import utilities from util.js
import {sendJSON, loadNavigation, newElement, newElem, sessionCookie, getTokenPayload} from './util.js'

// on page load get book
window.onload = (event) =>{

    loadNavigation('home');

    queryBook(searchParams())
};

//get params from URL
const searchParams = ()=>{
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
  return params.get('id');
};
//query book info
function queryBook(id)
{
    sendJSON({ method: 'GET', url: '/books/'+id }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            // the book
            fillBookInformation(response.book);
        } else {
            //return the error
            alert(err);
        }
    })
}

//fill book information
function fillBookInformation(book)
{
    const auctionContainer = document.getElementById('detail-column');
    auctionContainer
        .appendChild(
            newElement('h1',`${book.title}`,'auction_title','',''));
    auctionContainer
        .appendChild(
            newElement('p',`Book author: ${book.author}`,'auction_description','',''));
    auctionContainer
        .appendChild(
            newElement('p',`The book has been published in ${book.year}, in ${book.country}`,'auction_description','',''));
    auctionContainer
        .appendChild(
            newElement('p',`The book has ${book.pages} pages.`,'auction_description','',''));
    //create form if use is logged in
    if (sessionCookie())
    {
        const form = auctionContainer.appendChild(newElem('form','',''));
        const amount = form.appendChild(newElem('input','','auction_bid_amount'));
        amount.type = 'number';
        amount.placeholder = 'Amount';
        const button = form.appendChild(newElem('input','','auction_bid_amount'));
        button.type = 'submit';
        button.value = 'Bid';
        button.addEventListener('click', event=>{
            event.preventDefault();

            console.log('Creating post request...')
            const body = {
                            username: getTokenPayload().username,
                            amount: amount.value
                        }
            // post to bids from this book
            sendJSON({ method: 'POST', url: `/books/${searchParams()}/bids`, body }, (err, response) => {
                // if err is undefined, the send operation was a success
                if (!err) {
                    console.log('Bid added successfully!')
                    //reload page
                    location.reload();
                } else
                    {
                    console.error(err);
                }
            })
        })
    }
    // create bids
    createBids(book.bids)
}

//create bids
function createBids(bids)
{
    const container = document.getElementById('bids-container');
    container.appendChild(newElement('h2','Bids', '','',''));
    const bidsContainer = container.appendChild(newElement('ul','','',''));
    for (let index = 0; index < bids.length; index++)
    {
        bidsContainer.appendChild(createBid(bids[index]));
    }
}

// create bid
function createBid(bid)
{
    const nTag = newElement('li', '', 'auction_detail_bid', '',`${bid.id}`);
    nTag.appendChild(newElement('span', `${bid.amount}`, 'auction_detail_bid_price', '',''));
    nTag.appendChild(newElement('span', `${bid.username}`, 'auction_detail_bid_user', '',''));
    nTag.appendChild(newElement('span', `${bid.time}`, 'auction_detail_bid_time', '',''));

    return nTag;
}
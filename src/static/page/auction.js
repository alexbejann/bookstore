// import utilities from util.js
import { sendJSON, logout, loadNavigation, newElement } from './util.js'

// grab form controls from the DOM
const
    logoutButton = document.getElementById('logout');

// on page load get all the books
window.onload = (event) =>{

    loadNavigation();

    queryBook(localStorage.getItem('bookID'))
};

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

function fillBookInformation(book)
{
    const input =document.getElementById('bid-input');
    const auctionContainer = document.getElementById('detail-column');
    auctionContainer.insertBefore((newElement('h1',`${book.title}`,'auction_title')), input);
    auctionContainer.insertBefore((newElement('span',`${book.author} ${book.year}`,'auction_description')), input );
    createBids(book.bids)
}

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

// create book for index.html
function createBid(bid)
{
    const nTag = newElement('li', '', 'auction_detail_bid', '',`${bid.id}`);
    nTag.appendChild(newElement('span', `${bid.amount}`, 'auction_detail_bid_price', ''));
    nTag.appendChild(newElement('span', `${bid.username}`, 'auction_detail_bid_user', ''));
    nTag.appendChild(newElement('span', `${bid.time}`, 'auction_detail_bid_time', '',''));

    return nTag;
}

// logout
logoutButton.addEventListener('click', (event) =>{
    // Logout
    logout();
})
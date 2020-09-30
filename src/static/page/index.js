// import utilities from util.js
import { sendJSON, logout, loadNavigation, newElement } from './util.js';

// grab form controls from the DOM
const
    logoutButton = document.getElementById('logout');

function createBooks(response)
{
    const container = document.getElementById('book-container');
    for (let index = 0; index < response.length; index++)
    {
        container.appendChild(createBook(response[index]));
    }
}

// on page load get all the books
window.onload = (event) =>{

    loadNavigation();

    sendJSON({ method: 'GET', url: '/books' }, (err, response) => {
        // if err is undefined, the send operation was a success
        if (!err) {
            createBooks(response);
        } else {
            alert(err);
            console.error(err);
        }
    })
};


// create book for index.html
function createBook(book)
{
    const nTag = newElement('section', '', 'auction_box', '');
    const bookTitle = nTag.appendChild(newElement('a', `${book.title}`, 'auction_title', '',`${book.id}`));
    bookTitle.href = `auction.html?id=${book.id}`;
    nTag.appendChild(newElement('p', `Author: ${book.author}`, 'auction_description'));
    nTag.appendChild(newElement('p', `Year: ${book.year}`, 'auction_description'));
    const bidsContainer = nTag.appendChild(newElement('div', '','auction_bid',''));
    bidsContainer.appendChild(newElement('span', `${book.price}`, 'auction_bid_price',''));
    bidsContainer.appendChild(newElement('span',`${book.time}`,'auction_bid_time',''));
    return nTag;
}

// logout
logoutButton.addEventListener('click', (event) =>{
    // Logout
    logout();
})
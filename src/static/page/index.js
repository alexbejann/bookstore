// import utilities from util.js
import { sendJSON, loadNavigation, newElement } from './util.js';

//create books
function createBooks(response)
{
    const container = document.getElementById('book-container');
    //used for filtering
    let authors = [];
    let years = [];
    let countries = [];
    for (let index = 0; index < response.length; index++)
    {
        let book = response[index];
        //create books and append to parent
        container.appendChild(createBook(book));
        //add filter values
        if (!authors.includes(book.author))
        {
            authors.push(book.author)
        }
        if (!years.includes(book.year))
        {
            years.push(book.year)
        }
        if (!countries.includes(book.country))
        {
            countries.push(book.country)
        }
    }
    // create filters
    for (let i = 0; i < authors.length; i++)
    {
        createFilter('author',authors[i], 'author-cont')
    }
    for (let i = 0; i < years.length; i++)
    {
        createFilter('year',years[i], 'year-cont')
    }
    for (let i = 0; i < countries.length; i++)
    {
        createFilter('country',countries[i], 'country-cont')
    }
}

//create filter
function createFilter(category,value, id)
{
    //get container
    const container = document.getElementById(`${id}`);
    const option = document.createElement('li');
    option.className = 'filter-option'

    //create input/checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'
    checkbox.id = `${value}`
    // add checkbox checked listener
    checkbox.addEventListener('click', event =>{

        const bookContainer = document.getElementById('book-container');
        //clear children
        bookContainer.innerHTML = '';

        //do filter request
        sendJSON({ method: 'GET', url: `/books/?${category}=${value}` }, (err, response) => {
            // if err is undefined, the send operation was a success
            if (!err) {
                //recreate all books
                for (let i = 0; i < response.length; i++) {
                    bookContainer.appendChild(createBook(response[i]));
                }
            } else {
                alert(err)
               console.error(err);
            }
        })
    })
    //create label for input
    const label = document.createElement('label')
    label.setAttribute('for',`${value}`)
    label.innerText = value

    //append
    option.appendChild(checkbox)
    option.appendChild(label)
    container.appendChild(option)
}

// on page load get all the books
window.onload = (event) =>{

    loadNavigation('home');

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
    //add link to detail page
    bookTitle.href = `auction.html?id=${book.id}`;

    nTag.appendChild(newElement('p', `Author: ${book.author}`, 'auction_description'));
    nTag.appendChild(newElement('p', `Year: ${book.year}`, 'auction_description'));
    nTag.appendChild(newElement('p', `Country: ${book.country}`, 'auction_description'));

    const bidsContainer = nTag.appendChild(newElement('div', '','auction_bid',''));
    bidsContainer.appendChild(newElement('span', `${book.price}`, 'auction_bid_price',''));
    bidsContainer.appendChild(newElement('span',`${book.time}`,'auction_bid_time',''));
    return nTag;
}
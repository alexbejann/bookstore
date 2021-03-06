// import utilities from util.js
import {sendJSON, loadNavigation, newElement, newElem} from './util.js';

let books = [];
//create books
function createBooks(response)
{
    const container = document.getElementById('book-container');
    container.innerHTML = '';
    for (let index = 0; index < response.length; index++)
    {
        //create books and append to parent
        container.appendChild(createBook(response[index]));
    }
}

//create filters
function createFilters(books)
{
    //used for filtering
    let authors = [];
    let years = [];
    let countries = [];
    books.forEach(book =>{
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
    })
    // create filters
    authors.forEach(author=>{
        createFilter('author',author, 'author-cont')
    })

    years.forEach(year=>{
        createFilter('year',year, 'year-cont')
    })

    countries.forEach(country =>{
        createFilter('country',country, 'country-cont')
    })
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
    checkbox.type = 'radio'
    checkbox.id = `${value}`
    checkbox.name='rad'
    // add checkbox checked listener
    checkbox.addEventListener('change', event =>{
        const bookContainer = document.getElementById('book-container');
        //clear children
        bookContainer.innerHTML = '';

        if (checkbox.checked)
        {
            //do filter request
            sendJSON({ method: 'GET', url: `/books/?${category}=${value}` }, (err, response) => {
                // if err is undefined, the send operation was a success
                if (!err) {
                    //recreate all books
                    response.forEach(book=>{
                        bookContainer.appendChild(createBook(book));
                    })
                } else {
                    alert(err)
                    console.error(err);
                }
            })
        }
        else
        {
            location.reload();
        }
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
            createFilters(response);
            books = response;
        } else {
            alert(err);
            console.error(err);
        }
    });

    createSearch();
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

const createSearch = () => {
    const nav = document.querySelector('nav');
    // create container
    const container = nav.appendChild(newElem('div','','search-container'));
    //search box
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search..';
    searchBox.id = 'searchBox'
    searchBox.name = 'searchBox';
    // add on key up listener
    searchBox.addEventListener('keyup', (event) => {
        //get input value and to lowercase
        const searchString = event.target.value.toLowerCase();
        //filter books
        const filteredBooks = books.filter((book) => {
            return (
                book.title.toLowerCase().includes(searchString)
            );
        });
        //create books with filtered books
        createBooks(filteredBooks)
    })
    container.appendChild(searchBox)
}